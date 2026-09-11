import { NextRequest, NextResponse } from "next/server";
import { OPENROUTER_FREE_FALLBACK_CHAIN } from "@/lib/models";

function extractAndParseJson(text: string): any {
  let cleaned = text.trim();
  // Remover etiquetas de razonamiento de modelos como DeepSeek R1 (<think>...</think>)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  // Quitar bloques markdown si el modelo los incluyó
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");
    cleaned = cleaned.trim();
  }
  // Localizar el objeto JSON exterior { ... }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      product_name,
      product_description,
      target_audience,
      main_problem,
      unique_mechanism,
      offer_or_cta,
      angle = "problem_agitation",
      provider: clientProvider,
      api_key: clientApiKey,
      openrouter_api_key: clientOpenRouterKey,
      model = "gemini-3.6-flash",
    } = body;

    // Detectar si se debe usar OpenRouter o Google AI Studio
    const isExplicitOpenRouter =
      clientProvider === "openrouter" ||
      (typeof model === "string" && (model.includes("/") || model.includes(":free")));
    const activeProvider = isExplicitOpenRouter ? "openrouter" : "google";

    const systemInstruction = `
Eres el Director Creativo de Performance y Copywriting de Respuesta Directa más prestigioso del mundo para e-commerce (TikTok Ads y Meta Reels).
Tu obsesión son dos métricas canónicas:
1. THUMBSTOP RATE (3s Plays / Impressions) >= 30%: Primeros 3 segundos brutales, quiebre de patrón, cero saludos, cero rodeos.
2. HOLD RATE (ThruPlays / 3s Plays) >= 20%: Ritmo frenético, cortes cada 1.5 a 2 segundos, subtítulos palabra por palabra.

Reglas Obligatorias:
- Todo guion debe estructurarse en la Matriz Canónica de 4 Columnas:
  [Tiempo] | [Accion_Visual_Cámara] | [Locucion_Audio_Literal] | [Texto_Pantalla_Subtitulo]
- Generar 3 Hooks distintos para DCT (Dynamic Creative Testing):
  1. Dolor Agresivo / Fricción (Badge Ámbar)
  2. Quiebre de Creencia / Curiosidad ("Pensabas que...") (Badge Cobalto)
  3. Demostración Visual Cruda / "POV" (Badge Esmeralda)
- En Omarchy el color rojo está terminantemente prohibido.
- El audio/locución debe sonar 100% como un creador de contenido real de TikTok, en español fluido, natural, sin formalismos ni clichés robóticos.
- Proporcionar prompts fotográficos para Imagen 3 (relación 9:16 vertical, fotorrealistas, iluminación cinematográfica).

Debes responder ÚNICAMENTE en formato JSON válido sin bloques markdown adicionales ni texto previo.
`;

    const userPrompt = `
Genera un paquete de video ads de respuesta directa de 30 segundos para:
- Producto: ${product_name}
- Descripción / Características: ${product_description}
- Audiencia Objetivo: ${target_audience}
- Dolor Principal del Cliente: ${main_problem}
- Mecanismo Único / Solución: ${unique_mechanism}
- Oferta / CTA: ${offer_or_cta}
- Ángulo Principal: ${angle}

El JSON debe tener la siguiente estructura exacta:
{
  "product_name": "${product_name}",
  "angle": "${angle}",
  "hooks": [
    {
      "hook_id": "hook_1_pain",
      "hook_type": "Dolor Agresivo",
      "visual_action": "Descripción visual de 0 a 3s con plano cerrado y quiebre de patrón",
      "voiceover": "Texto exacto que dice la voz en los primeros 3 segundos",
      "screen_text": "Titular en mayúsculas de alto contraste para el tercio medio",
      "image_prompt": "Prompt en inglés para Imagen 3, vertical 9:16 photorealistic vertical reel hook..."
    },
    {
      "hook_id": "hook_2_myth",
      "hook_type": "Quiebre de Creencia",
      "visual_action": "...",
      "voiceover": "...",
      "screen_text": "...",
      "image_prompt": "..."
    },
    {
      "hook_id": "hook_3_demo",
      "hook_type": "Demostración Cruda",
      "visual_action": "...",
      "voiceover": "...",
      "screen_text": "...",
      "image_prompt": "..."
    }
  ],
  "matrix_scenes": [
    {
      "timestamp": "00-03s",
      "segment": "Hook (Thumbstop)",
      "visual_action": "Plano detalle impactante o acción inmediata.",
      "voiceover": "Texto del hook seleccionado.",
      "screen_text": "Titular gancho en pantalla.",
      "duration_seconds": 3.0,
      "image_prompt": "Prompt en inglés para Imagen 3..."
    },
    {
      "timestamp": "03-10s",
      "segment": "Agitación del Problema",
      "visual_action": "Muestra del error común o frustración con alternativas viejas.",
      "voiceover": "Agitación emocional y datos vivenciales.",
      "screen_text": "Palabras clave destacadas.",
      "duration_seconds": 7.0,
      "image_prompt": "Prompt en inglés para Imagen 3..."
    },
    {
      "timestamp": "10-22s",
      "segment": "Mecanismo Único & Demo",
      "visual_action": "El producto en uso resolviendo el problema con claridad total.",
      "voiceover": "Explicación simple de por qué funciona diferente a todo lo demás.",
      "screen_text": "Badge de beneficio o prueba social.",
      "duration_seconds": 12.0,
      "image_prompt": "Prompt en inglés para Imagen 3..."
    },
    {
      "timestamp": "22-30s",
      "segment": "CTA & Urgencia",
      "visual_action": "Producto en plano principal y botón o gesto a pantalla.",
      "voiceover": "Llamada a la acción clara con incentivo (código o link).",
      "screen_text": "OFERTA LIMITADA / CÓDIGO ACTIVO",
      "duration_seconds": 8.0,
      "image_prompt": "Prompt en inglés para Imagen 3..."
    }
  ],
  "full_voiceover_script": "Texto completo continuo de la locución para alimentar al motor de audio TTS.",
  "marketing_notes": "Explicación de por qué este creativo alcanzará los KPIs objetivo (Thumbstop >= 30%, Hold >= 20%)."
}
`;

    // ─────────────────────────────────────────────────────────────
    // RAMA A: OPENROUTER (Modelos Gratuitos :free y Auto Router)
    // ─────────────────────────────────────────────────────────────
    if (activeProvider === "openrouter") {
      const openRouterKey =
        (clientOpenRouterKey && clientOpenRouterKey.trim().length > 0
          ? clientOpenRouterKey.trim()
          : "") ||
        (clientApiKey && clientApiKey.startsWith("sk-or-") ? clientApiKey.trim() : "") ||
        process.env.OPENROUTER_API_KEY ||
        process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
        "";

      if (!openRouterKey) {
        return NextResponse.json(
          {
            error:
              "API Key de OpenRouter no configurada. Ingrésala en el Navigation Drawer (menú superior derecho) o regístrate gratis en openrouter.ai/keys.",
          },
          { status: 400 }
        );
      }

      const requestedModel = (model || "openrouter/auto").trim();

      // Guardrail de Seguridad: Solo permitir modelos con sufijo :free o el router automático
      const isAllowedFreeModel =
        requestedModel === "openrouter/auto" ||
        requestedModel.endsWith(":free") ||
        OPENROUTER_FREE_FALLBACK_CHAIN.includes(requestedModel as any);

      if (!isAllowedFreeModel) {
        return NextResponse.json(
          {
            error: `El modelo '${requestedModel}' no está en la lista de costo $0. Por seguridad, Holo Studio solo permite modelos con sufijo ':free' o 'openrouter/auto'.`,
          },
          { status: 400 }
        );
      }

      // Si el modelo es openrouter/auto, usamos la cadena de fallbacks gratuitos del proyecto
      const openRouterPayload: any = {
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      };

      if (requestedModel === "openrouter/auto") {
        openRouterPayload.models = OPENROUTER_FREE_FALLBACK_CHAIN;
        openRouterPayload.route = "fallback";
      } else {
        openRouterPayload.model = requestedModel;
      }

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Holo Studio Direct Response",
        },
        body: JSON.stringify(openRouterPayload),
      });

      if (!openRouterResponse.ok) {
        const errorData = await openRouterResponse.text();
        return NextResponse.json(
          { error: `OpenRouter API error (${openRouterResponse.status}): ${errorData}` },
          { status: openRouterResponse.status }
        );
      }

      const openRouterData = await openRouterResponse.json();
      const rawContent = openRouterData.choices?.[0]?.message?.content;

      if (!rawContent) {
        return NextResponse.json(
          { error: "OpenRouter no devolvió contenido en la respuesta." },
          { status: 500 }
        );
      }

      const parsedData = extractAndParseJson(rawContent);
      return NextResponse.json(parsedData);
    }

    // ─────────────────────────────────────────────────────────────
    // RAMA B: GOOGLE AI STUDIO (Gemini Directo)
    // ─────────────────────────────────────────────────────────────
    const apiKey =
      clientApiKey && clientApiKey.trim().length > 0
        ? clientApiKey.trim()
        : process.env.GEMINI_API_KEY ||
          process.env.GOOGLE_API_KEY ||
          process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
          "";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "API Key de Google AI no configurada. Ingrésala en el Navigation Drawer (menú superior derecho).",
        },
        { status: 400 }
      );
    }

    let activeModel = model || "gemini-3.6-flash";
    if (activeModel.includes("1.5") || activeModel.includes("2.0") || activeModel.includes("2.5")) {
      activeModel = "gemini-3.6-flash";
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Google AI API error: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      return NextResponse.json(
        { error: "No se recibió respuesta válida del modelo de IA." },
        { status: 500 }
      );
    }

    const parsedData = extractAndParseJson(rawJson);
    return NextResponse.json(parsedData);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Error interno al generar guion: ${err.message}` },
      { status: 500 }
    );
  }
}

