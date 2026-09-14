import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      negative_prompt = "ugly, blurry, low quality, deformed, bad anatomy, text, watermark",
      width = 512,
      height = 768,
      steps = 20,
      cfg = 7.0,
      ckpt_name = "DreamShaper_8_pruned.safetensors",
      seed = Math.floor(Math.random() * 1000000000),
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "El prompt es obligatorio." },
        { status: 400 }
      );
    }

    const comfyHost = process.env.COMFYUI_URL || "http://127.0.0.1:8188";

    // Workflow estándar de inferencia para DreamShaper / SD 1.5 en formato API
    const workflow = {
      "1": {
        class_type: "CheckpointLoaderSimple",
        inputs: { ckpt_name },
      },
      "2": {
        class_type: "CLIPTextEncode",
        inputs: {
          text: prompt,
          clip: ["1", 1],
        },
      },
      "3": {
        class_type: "CLIPTextEncode",
        inputs: {
          text: negative_prompt,
          clip: ["1", 1],
        },
      },
      "4": {
        class_type: "EmptyLatentImage",
        inputs: {
          width: Number(width),
          height: Number(height),
          batch_size: 1,
        },
      },
      "5": {
        class_type: "KSampler",
        inputs: {
          seed: Number(seed),
          steps: Number(steps),
          cfg: Number(cfg),
          sampler_name: "euler_ancestral",
          scheduler: "normal",
          denoise: 1.0,
          model: ["1", 0],
          positive: ["2", 0],
          negative: ["3", 0],
          latent_image: ["4", 0],
        },
      },
      "6": {
        class_type: "VAEDecode",
        inputs: {
          samples: ["5", 0],
          vae: ["1", 2],
        },
      },
      "7": {
        class_type: "SaveImage",
        inputs: {
          filename_prefix: "HoloStudio_Broll",
          images: ["6", 0],
        },
      },
    };

    // 1. Enviar el trabajo a ComfyUI
    const promptRes = await fetch(`${comfyHost}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: workflow }),
    });

    if (!promptRes.ok) {
      const errText = await promptRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Error comunicando con ComfyUI (${promptRes.status}): ${errText}`,
        },
        { status: 502 }
      );
    }

    const promptData = await promptRes.json();
    const promptId = promptData.prompt_id;

    if (!promptId) {
      return NextResponse.json(
        { success: false, error: "ComfyUI no devolvió un prompt_id válido." },
        { status: 500 }
      );
    }

    // 2. Sondear historial hasta obtener la imagen generada (polling de hasta 60s sin cache)
    let imageUrl = null;
    let filename = null;
    const maxAttempts = 60;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const histRes = await fetch(`${comfyHost}/history/${promptId}`, {
        cache: "no-store",
      });
      if (histRes.ok) {
        const histData = await histRes.json();
        const job = histData[promptId];

        if (job && job.outputs && job.outputs["7"]?.images?.length > 0) {
          const imgInfo = job.outputs["7"].images[0];
          filename = imgInfo.filename;
          imageUrl = `/api/comfy/view?filename=${encodeURIComponent(
            filename
          )}&subfolder=${encodeURIComponent(imgInfo.subfolder || "")}&type=${encodeURIComponent(imgInfo.type || "output")}`;
          break;
        }

        if (job && job.status?.status_str === "error") {
          return NextResponse.json(
            {
              success: false,
              error: "ComfyUI reportó un error durante la ejecución del grafo.",
              details: job.status,
            },
            { status: 500 }
          );
        }
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Tiempo de espera agotado esperando el renderizado de ComfyUI.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json({
      success: true,
      prompt_id: promptId,
      filename,
      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error("[ComfyUI Generate API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error interno generando imagen con ComfyUI.",
      },
      { status: 500 }
    );
  }
}
