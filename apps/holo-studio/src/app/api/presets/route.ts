import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ALL_SYSTEM_PRESETS, Preset } from "@/lib/presets";

const DATA_FILE = path.join(process.cwd(), "src", "data", "custom-presets.json");

function readCustomPresets(): Preset[] {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Preset[];
  } catch {
    return [];
  }
}

function writeCustomPresets(presets: Preset[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(presets, null, 2), "utf-8");
}

// GET /api/presets — devuelve sistema + custom
export async function GET() {
  const custom = readCustomPresets();
  const all = [...ALL_SYSTEM_PRESETS, ...custom];
  return NextResponse.json(all);
}

// POST /api/presets — crea nuevo preset custom
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const custom = readCustomPresets();

    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      label: body.label || body.product_name || "Preset Personalizado",
      category: body.category || "custom",
      isReadonly: false,
      product_name: body.product_name || "",
      product_description: body.product_description || "",
      target_audience: body.target_audience || "",
      main_problem: body.main_problem || "",
      unique_mechanism: body.unique_mechanism || "",
      offer_or_cta: body.offer_or_cta || "",
    };

    custom.push(newPreset);
    writeCustomPresets(custom);
    return NextResponse.json(newPreset, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
