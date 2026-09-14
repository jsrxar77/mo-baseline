import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";

function getEdgeTtsBinary(): string {
  const localBin = path.join(os.homedir(), ".local/bin/edge-tts");
  if (fs.existsSync(localBin)) {
    return localBin;
  }
  return "edge-tts";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voice = "es-AR-TomasNeural",
      rate = "+5%",
    } = body as {
      text?: string;
      voice?: string;
      rate?: string;
    };

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "El texto para sintetizar es obligatorio." },
        { status: 400 }
      );
    }

    const tempDir = os.tmpdir();
    const fileId = `tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const outputAudioPath = path.join(tempDir, `${fileId}.mp3`);
    const outputVttPath = path.join(tempDir, `${fileId}.vtt`);

    const edgeTtsBin = getEdgeTtsBinary();
    const args = [
      "--voice",
      voice,
      "--rate",
      rate,
      "--text",
      text.trim(),
      "--write-media",
      outputAudioPath,
      "--write-subtitles",
      outputVttPath,
    ];

    await execFileAsync(edgeTtsBin, args, {
      env: {
        ...process.env,
        PATH: `${path.join(os.homedir(), ".local/bin")}:${process.env.PATH || ""}`,
      },
    });

    if (!fs.existsSync(outputAudioPath)) {
      throw new Error("No se pudo generar el archivo de audio con edge-tts.");
    }

    const audioBuffer = fs.readFileSync(outputAudioPath);
    const vttContent = fs.existsSync(outputVttPath)
      ? fs.readFileSync(outputVttPath, "utf-8")
      : "";

    // Limpieza de archivos temporales
    try {
      fs.unlinkSync(outputAudioPath);
      if (fs.existsSync(outputVttPath)) fs.unlinkSync(outputVttPath);
    } catch {}

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-VTT-Subtitles": encodeURIComponent(vttContent),
      },
    });
  } catch (error: any) {
    console.error("[TTS API Error]:", error);
    return NextResponse.json(
      { error: "Error en la síntesis neuronal", details: error?.message },
      { status: 500 }
    );
  }
}
