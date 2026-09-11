import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Preset } from "@/lib/presets";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom-presets.json");

function readCustomPresets(): Preset[] {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Preset[];
  } catch {
    return [];
  }
}

function writeCustomPresets(presets: Preset[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(presets, null, 2), "utf-8");
}

// PUT /api/presets/[id] — edita preset custom
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const custom = readCustomPresets();
    const idx = custom.findIndex((p) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: "Preset no encontrado" }, { status: 404 });

    const body = await req.json();
    custom[idx] = { ...custom[idx], ...body, id: params.id, isReadonly: false };
    writeCustomPresets(custom);
    return NextResponse.json(custom[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/presets/[id] — elimina preset custom
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const custom = readCustomPresets();
    const filtered = custom.filter((p) => p.id !== params.id);
    if (filtered.length === custom.length)
      return NextResponse.json({ error: "Preset no encontrado o es del sistema (readonly)" }, { status: 404 });
    writeCustomPresets(filtered);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
