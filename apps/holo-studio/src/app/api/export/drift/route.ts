import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";

interface SceneData {
  timestamp?: string;
  visual_action?: string;
  screen_text?: string;
  voiceover?: string;
  image_prompt?: string;
}

// Genera un buffer WAV PCM válido de 44.1kHz de una duración dada (en segundos)
function createWavBuffer(durationSeconds: number, sampleRate: number = 44100): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // 'fmt ' chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);

  // 'data' chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generar tono sutil al inicio de cada cambio de escena (beep sutil de sincro)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Tono de sincronización sutil de 440Hz durante los primeros 0.08 segundos de cada segundo par
    let sample = 0;
    if (t % 5 < 0.05) {
      sample = Math.sin(2 * Math.PI * 440 * t) * 0.15;
    }
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Parsea strings como "0-3s", "3-8 seg", "00:00 - 00:05" a segundos numéricos
function parseTimestamp(ts?: string, defaultStart: number = 0, defaultDuration: number = 4): { start: number; end: number } {
  if (!ts) {
    return { start: defaultStart, end: defaultStart + defaultDuration };
  }

  const clean = ts.replace(/seg|s|sec/gi, "").trim();
  const parts = clean.split(/[-–—]/).map((p) => p.trim());

  if (parts.length === 2) {
    const parsePart = (val: string) => {
      if (val.includes(":")) {
        const segs = val.split(":");
        return parseFloat(segs[0]) * 60 + parseFloat(segs[1]);
      }
      return parseFloat(val) || 0;
    };
    const start = parsePart(parts[0]);
    const end = parsePart(parts[1]);
    if (end > start) return { start, end };
  }

  return { start: defaultStart, end: defaultStart + defaultDuration };
}

// Convierte segundos a formato SRT (00:00:00,000)
function formatSrtTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

// Convierte segundos a formato VTT (00:00:00.000)
function formatVttTime(totalSeconds: number): string {
  return formatSrtTime(totalSeconds).replace(",", ".");
}

// Genera un SVG vertical 9:16 minimalista como respaldo si la escena aún no fue procesada en ComfyUI
function createFallbackSvg(sceneNum: number, title: string, text: string): string {
  const cleanTitle = (title || "").replace(/[<>&"]/g, "");
  const cleanText = (text || "").replace(/[<>&"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#090D16"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect x="40" y="40" width="1000" height="1840" fill="none" stroke="#334155" stroke-width="4" stroke-dasharray="16 16" rx="24"/>
  <text x="540" y="300" fill="#10B981" font-size="48" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="4">HOLO STUDIO • DRIFT BUNDLE</text>
  <text x="540" y="420" fill="#94A3B8" font-size="32" font-family="monospace" text-anchor="middle">ESCENA ${sceneNum} • 9:16 VERTICAL B-ROLL</text>
  <rect x="140" y="700" width="800" height="400" fill="#1E293B" rx="16" stroke="#475569" stroke-width="2"/>
  <text x="540" y="850" fill="#F8FAFC" font-size="42" font-family="sans-serif" font-weight="bold" text-anchor="middle">
    ${cleanTitle.slice(0, 35)}
  </text>
  <text x="540" y="940" fill="#38BDF8" font-size="28" font-family="monospace" text-anchor="middle">
    ${cleanText.slice(0, 50)}
  </text>
  <text x="540" y="1650" fill="#64748B" font-size="26" font-family="monospace" text-anchor="middle">
    Reemplazar con B-Roll ComfyUI o video real en Drift
  </text>
</svg>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName = "Anuncio", scenes = [], comfyImages = {} } = body as {
      productName?: string;
      scenes?: SceneData[];
      comfyImages?: Record<number, string>;
    };

    const zip = new JSZip();

    // 1. Calcular tiempos de escena
    let currentTime = 0;
    const timedScenes = scenes.map((sc, i) => {
      const parsed = parseTimestamp(sc.timestamp, currentTime, 4);
      currentTime = Math.max(currentTime + 1, parsed.end);
      return {
        index: i + 1,
        ...sc,
        startSeconds: parsed.start,
        endSeconds: parsed.end,
        duration: parsed.end - parsed.start,
      };
    });

    const totalDuration = currentTime > 0 ? currentTime : 15;

    // 2. Generar Subtítulos Desacoplados (SRT y WebVTT)
    let srtContent = "";
    let vttContent = "WEBVTT\n\n";

    timedScenes.forEach((sc, idx) => {
      const textToDisplay = sc.screen_text || sc.voiceover || `Escena ${sc.index}`;
      const srtStart = formatSrtTime(sc.startSeconds);
      const srtEnd = formatSrtTime(sc.endSeconds);
      const vttStart = formatVttTime(sc.startSeconds);
      const vttEnd = formatVttTime(sc.endSeconds);

      // SRT
      srtContent += `${idx + 1}\n`;
      srtContent += `${srtStart} --> ${srtEnd}\n`;
      srtContent += `${textToDisplay}\n\n`;

      // VTT
      vttContent += `${idx + 1}\n`;
      vttContent += `${vttStart} --> ${vttEnd}\n`;
      vttContent += `${textToDisplay}\n\n`;
    });

    zip.file("media/captions/subtitles.srt", srtContent);
    zip.file("media/captions/subtitles.vtt", vttContent);

    // 3. Generar Audio Separado con Edge TTS (Acento Buenos Aires)
    const voiceoverScript = timedScenes
      .map(
        (sc) =>
          `[${formatSrtTime(sc.startSeconds)} - ${formatSrtTime(sc.endSeconds)}] ESCENA ${sc.index}:\n"${sc.voiceover || ""}"\n`
      )
      .join("\n");

    zip.file("media/audio/voiceover_script.txt", voiceoverScript);

    // Síntesis neuronal de locución continua con acento de Buenos Aires
    const fullVoiceText = timedScenes
      .map((sc) => sc.voiceover?.trim())
      .filter(Boolean)
      .join(". ");

    let realAudioBuffer: Buffer | null = null;
    let audioFileName = "voiceover_track.wav";

    if (fullVoiceText) {
      try {
        const localBin = path.join(os.homedir(), ".local/bin/edge-tts");
        const edgeTtsBin = fs.existsSync(localBin) ? localBin : "edge-tts";
        const tempAudioPath = path.join(os.tmpdir(), `drift_tts_${Date.now()}.mp3`);

        await execFileAsync(
          edgeTtsBin,
          [
            "--voice",
            (body as any).voice || "es-AR-TomasNeural",
            "--rate",
            (body as any).rate || "+5%",
            "--text",
            fullVoiceText,
            "--write-media",
            tempAudioPath,
          ],
          {
            env: {
              ...process.env,
              PATH: `${path.join(os.homedir(), ".local/bin")}:${process.env.PATH || ""}`,
            },
          }
        );

        if (fs.existsSync(tempAudioPath)) {
          realAudioBuffer = fs.readFileSync(tempAudioPath);
          audioFileName = "voiceover_track.mp3";
          zip.file(`media/audio/${audioFileName}`, realAudioBuffer);
          try {
            fs.unlinkSync(tempAudioPath);
          } catch {}
        }
      } catch (ttsErr) {
        console.warn("[Export Drift TTS Warning]:", ttsErr);
      }
    }

    if (!realAudioBuffer) {
      // Fallback a WAV audible generado
      const wavBuffer = createWavBuffer(totalDuration);
      zip.file(`media/audio/${audioFileName}`, wavBuffer);
    }

    // 4. Incorporar B-Roll Visual (Track 2: Imágenes 9:16 de ComfyUI o SVG fallback)
    const comfyHost = process.env.COMFYUI_URL || "http://127.0.0.1:8188";

    for (let i = 0; i < timedScenes.length; i++) {
      const sc = timedScenes[i];
      let filename = comfyImages[i];
      let imageAdded = false;

      if (filename) {
        if (filename.includes("filename=")) {
          const match = filename.match(/filename=([^&]+)/);
          if (match) filename = decodeURIComponent(match[1]);
        }
        try {
          const comfyUrl = `${comfyHost}/view?filename=${encodeURIComponent(filename)}&type=output`;
          const res = await fetch(comfyUrl, { cache: "no-store" });
          if (res.ok) {
            const imgBuffer = await res.arrayBuffer();
            const ext = filename.split(".").pop() || "png";
            zip.file(`media/visuals/scene_${String(i + 1).padStart(2, "0")}.${ext}`, imgBuffer);
            imageAdded = true;
          }
        } catch (err) {
          console.warn(`[Export Drift] No se pudo obtener imagen ComfyUI para escena ${i}:`, err);
        }
      }

      if (!imageAdded) {
        // Fallback visual 9:16
        const svg = createFallbackSvg(
          i + 1,
          sc.visual_action || `Escena ${i + 1}`,
          sc.screen_text || "B-Roll Shot"
        );
        zip.file(`media/visuals/scene_${String(i + 1).padStart(2, "0")}.svg`, svg);
      }
    }

    // 5. Manifest de Proyecto Drift (JSON de timeline multitrack)
    const driftProjectManifest = {
      format: "drift-project-v1",
      generator: "Holo Studio Direct Response (mo-baseline)",
      created_at: new Date().toISOString(),
      project_name: `${productName} - Drift Export`,
      settings: {
        width: 1080,
        height: 1920,
        fps: 30,
        aspect_ratio: "9:16",
        duration_seconds: totalDuration,
      },
      tracks: [
        {
          id: "track-audio-voiceover",
          type: "audio",
          name: "Locución / Voiceover",
          muted: false,
          locked: false,
          clips: [
            {
              id: "clip-voiceover-main",
              source: `media/audio/${audioFileName}`,
              start_time: 0,
              duration: totalDuration,
              volume: 1.0,
            },
          ],
        },
        {
          id: "track-video-broll",
          type: "video",
          name: "B-Roll Visual (9:16)",
          muted: false,
          locked: false,
          clips: timedScenes.map((sc, idx) => {
            const hasComfy = !!comfyImages[idx];
            const ext = hasComfy ? (comfyImages[idx]?.split(".").pop() || "png") : "svg";
            return {
              id: `clip-scene-${sc.index}`,
              source: `media/visuals/scene_${String(sc.index).padStart(2, "0")}.${ext}`,
              start_time: sc.startSeconds,
              duration: sc.duration,
              ken_burns_motion: "subtle_zoom_in",
              scale: "fill_9_16",
            };
          }),
        },
        {
          id: "track-text-captions",
          type: "subtitle",
          name: "Subtítulos Desacoplados (Texto Editable)",
          subtitle_file: "media/captions/subtitles.srt",
          unbaked: true,
          style: {
            font_family: "Impact, Inter, sans-serif",
            font_size: 54,
            font_color: "#FFFFFF",
            outline_color: "#000000",
            outline_width: 8,
            alignment: "center_safe_zone",
            uppercase: true,
          },
          items: timedScenes.map((sc) => ({
            start_time: sc.startSeconds,
            end_time: sc.endSeconds,
            text: sc.screen_text || sc.voiceover || "",
            position_y_percent: 75,
          })),
        },
      ],
    };

    zip.file("project.drift", JSON.stringify(driftProjectManifest, null, 2));
    zip.file("timeline_manifest.json", JSON.stringify(driftProjectManifest, null, 2));

    // 6. Guía para el usuario y para el Drift MCP Server
    const agentReadme = `# HOLO STUDIO • DRIFT PROJECT BUNDLE (MULTIPISTA)

Este paquete contiene tu proyecto listo para continuar la edición en **Drift** (https://cutwire.org/drift) manteniendo cada componente **completamente desacoplado**:

## 🎬 Estructura de Pistas Independientes:
1. **Pista de Audio (Locución)**: \`media/audio/voiceover_track.wav\` y guion en \`media/audio/voiceover_script.txt\`.
2. **Pista de Video/Visual (B-Roll 9:16)**: \`media/visuals/\` con los renders de ComfyUI por escena.
3. **Pista de Subtítulos y Títulos**: \`media/captions/subtitles.srt\` (los textos están desacoplados, no quemados en la imagen; puedes cambiarles la fuente, color, posición o animación en Drift).

---

## 🤖 Uso con Drift MCP (Model Context Protocol):
Si tienes activado el MCP de Drift en tu editor o agente (\`drift --mcp-stdio\`):
- Puedes pedirle a tu agente:
  > "Abre el archivo project.drift en Drift, ajusta los cortes de B-Roll en los cambios de escena y aplica animación pop a los subtítulos del track 3."

---
Generado por Holo Studio - mo-baseline (2026)
`;
    zip.file("README_DRIFT.md", agentReadme);

    // Generar buffer del ZIP (.drift bundle)
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          productName.replace(/[^a-zA-Z0-9_-]/g, "_")
        )}_drift_project.drift"`,
      },
    });
  } catch (error: any) {
    console.error("[Export Drift Error]:", error);
    return NextResponse.json(
      { error: "Error generando paquete para Drift", details: error?.message },
      { status: 500 }
    );
  }
}
