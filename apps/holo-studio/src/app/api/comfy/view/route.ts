import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    const subfolder = searchParams.get("subfolder") || "";
    const type = searchParams.get("type") || "output";

    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    const comfyHost = process.env.COMFYUI_URL || "http://127.0.0.1:8188";
    const comfyViewUrl = `${comfyHost}/view?filename=${encodeURIComponent(
      filename
    )}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(type)}`;

    const response = await fetch(comfyViewUrl, { cache: "no-store" });
    if (!response.ok) {
      return new NextResponse("Image not found in ComfyUI", {
        status: response.status,
      });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("[ComfyUI Proxy Error]:", error);
    return new NextResponse("Error proxying ComfyUI image", { status: 500 });
  }
}
