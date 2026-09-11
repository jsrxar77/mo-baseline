import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Angle } from "@/lib/presets";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom-angles.json");

function readCustomAngles(): Angle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Angle[];
  } catch {
    return [];
  }
}

function writeCustomAngles(angles: Angle[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(angles, null, 2), "utf-8");
}

// PUT /api/angles/[id] — edita ángulo custom
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const custom = readCustomAngles();
    const idx = custom.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: "Ángulo no encontrado" }, { status: 404 });

    const body = await req.json();
    custom[idx] = { ...custom[idx], ...body, id: params.id, isReadonly: false };
    writeCustomAngles(custom);
    return NextResponse.json(custom[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/angles/[id] — elimina ángulo custom
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const custom = readCustomAngles();
    const filtered = custom.filter((a) => a.id !== params.id);
    if (filtered.length === custom.length)
      return NextResponse.json({ error: "Ángulo no encontrado o es del sistema (readonly)" }, { status: 404 });
    writeCustomAngles(filtered);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
