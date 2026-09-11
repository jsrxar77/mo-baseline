import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ALL_SYSTEM_ANGLES, Angle } from "@/lib/presets";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom-angles.json");

function readCustomAngles(): Angle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Angle[];
  } catch {
    return [];
  }
}

function writeCustomAngles(angles: Angle[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(angles, null, 2), "utf-8");
}

// GET /api/angles — devuelve sistema + custom
export async function GET() {
  const custom = readCustomAngles();
  const all = [...ALL_SYSTEM_ANGLES, ...custom];
  return NextResponse.json(all);
}

// POST /api/angles — crea nuevo ángulo custom
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const custom = readCustomAngles();

    const newAngle: Angle = {
      id: `custom-angle-${Date.now()}`,
      label: body.label || "Ángulo Personalizado",
      description: body.description || "",
      badge_color: body.badge_color || "emerald",
      group: "custom",
      isReadonly: false,
    };

    custom.push(newAngle);
    writeCustomAngles(custom);
    return NextResponse.json(newAngle, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
