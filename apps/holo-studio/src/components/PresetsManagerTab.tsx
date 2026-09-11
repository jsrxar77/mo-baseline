"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  ChevronRight,
  BookOpen,
  Zap,
  Lock,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { Preset, Angle } from "../lib/presets";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type ActiveSub = "presets" | "angles";

const BADGE_COLOR_CLASSES: Record<string, string> = {
  amber: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  cobalt: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  emerald: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  bebidas: "🍹 Bebidas",
  comidas: "🍽 Comidas",
  custom: "⭐ Personalizado",
};

// ─────────────────────────────────────────────────────────────
// Empty forms
// ─────────────────────────────────────────────────────────────
const emptyPreset = (): Partial<Preset> => ({
  label: "",
  category: "custom",
  product_name: "",
  product_description: "",
  target_audience: "",
  main_problem: "",
  unique_mechanism: "",
  offer_or_cta: "",
});

const emptyAngle = (): Partial<Angle> => ({
  label: "",
  description: "",
  badge_color: "emerald",
});

// ─────────────────────────────────────────────────────────────
// Sub-component: Label field
// ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-mono theme-text-muted uppercase tracking-wider block mb-1">
      {children}
    </label>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 theme-input font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400/40"
    />
  );
}

function FieldTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 theme-input font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400/40 resize-none"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Preset Form
// ─────────────────────────────────────────────────────────────
function PresetForm({
  initial,
  onSave,
  onCancel,
  isEdit,
}: {
  initial: Partial<Preset>;
  onSave: (data: Partial<Preset>) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Partial<Preset>>(initial);
  const set = (key: keyof Preset) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  return (
    <div className="theme-card p-4 space-y-3 border-emerald-400/30">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-emerald-400" />
        <span className="font-mono text-xs font-bold text-emerald-400">
          {isEdit ? "Editar Preset" : "Crear Nuevo Preset"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Nombre del Preset (label)</FieldLabel>
          <FieldInput value={form.label || ""} onChange={set("label")} placeholder="Ej: Mi Kit de Mate" />
        </div>
        <div>
          <FieldLabel>Categoría</FieldLabel>
          <select
            value={form.category || "custom"}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Preset["category"] }))}
            className="w-full p-2 theme-input font-mono text-xs focus:outline-none cursor-pointer"
          >
            <option value="bebidas">🍹 Bebidas</option>
            <option value="comidas">🍽 Comidas</option>
            <option value="custom">⭐ Personalizado</option>
          </select>
        </div>
      </div>

      <div>
        <FieldLabel>Nombre del Producto</FieldLabel>
        <FieldInput value={form.product_name || ""} onChange={set("product_name")} placeholder="Ej: Kit Mate Premium" />
      </div>
      <div>
        <FieldLabel>Descripción / Beneficios</FieldLabel>
        <FieldTextarea
          value={form.product_description || ""}
          onChange={set("product_description")}
          placeholder="Características, materiales, contenido del kit..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Audiencia Objetivo</FieldLabel>
          <FieldInput value={form.target_audience || ""} onChange={set("target_audience")} placeholder="Ej: Adultos de 25-45 años..." />
        </div>
        <div>
          <FieldLabel>Dolor / Fricción Principal</FieldLabel>
          <FieldInput value={form.main_problem || ""} onChange={set("main_problem")} placeholder="El problema que resuelve..." />
        </div>
        <div>
          <FieldLabel>Mecanismo Único / Solución</FieldLabel>
          <FieldInput value={form.unique_mechanism || ""} onChange={set("unique_mechanism")} placeholder="Por qué tu producto funciona mejor..." />
        </div>
        <div>
          <FieldLabel>Oferta / CTA</FieldLabel>
          <FieldInput value={form.offer_or_cta || ""} onChange={set("offer_or_cta")} placeholder="Ej: 15% OFF + envío gratis hoy..." />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-1.5 px-4 py-2 theme-btn-primary font-mono text-xs font-bold cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {isEdit ? "Guardar Cambios" : "Crear Preset"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 theme-btn-secondary font-mono text-xs cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Angle Form
// ─────────────────────────────────────────────────────────────
function AngleForm({
  initial,
  onSave,
  onCancel,
  isEdit,
}: {
  initial: Partial<Angle>;
  onSave: (data: Partial<Angle>) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Partial<Angle>>(initial);

  return (
    <div className="theme-card p-4 space-y-3 border-purple-400/30">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="font-mono text-xs font-bold text-purple-400">
          {isEdit ? "Editar Ángulo" : "Crear Nuevo Ángulo"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Nombre del Ángulo</FieldLabel>
          <FieldInput
            value={form.label || ""}
            onChange={(v) => setForm((f) => ({ ...f, label: v }))}
            placeholder="Ej: 🎯 Mi Ángulo de Conversión"
          />
        </div>
        <div>
          <FieldLabel>Color de Badge</FieldLabel>
          <select
            value={form.badge_color || "emerald"}
            onChange={(e) => setForm((f) => ({ ...f, badge_color: e.target.value as Angle["badge_color"] }))}
            className="w-full p-2 theme-input font-mono text-xs focus:outline-none cursor-pointer"
          >
            <option value="emerald">🟢 Esmeralda</option>
            <option value="amber">🟡 Ámbar</option>
            <option value="cobalt">🔵 Cobalto</option>
          </select>
        </div>
      </div>

      <div>
        <FieldLabel>Descripción Táctica del Ángulo</FieldLabel>
        <FieldTextarea
          rows={4}
          value={form.description || ""}
          onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          placeholder="Explica cómo y cuándo usar este ángulo, qué emoción activa, para qué tipo de producto funciona mejor..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-1.5 px-4 py-2 theme-btn-primary font-mono text-xs font-bold cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {isEdit ? "Guardar Cambios" : "Crear Ángulo"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 theme-btn-secondary font-mono text-xs cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Tab Component
// ─────────────────────────────────────────────────────────────
export function PresetsManagerTab({
  onUsePreset,
}: {
  onUsePreset: (preset: Preset) => void;
}) {
  const [activeSub, setActiveSub] = useState<ActiveSub>("presets");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [angles, setAngles] = useState<Angle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preset form state
  const [showPresetForm, setShowPresetForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [presetFilterCat, setPresetFilterCat] = useState<string>("all");

  // Angle form state
  const [showAngleForm, setShowAngleForm] = useState(false);
  const [editingAngle, setEditingAngle] = useState<Angle | null>(null);

  // Confirm delete state
  const [confirmDeletePresetId, setConfirmDeletePresetId] = useState<string | null>(null);
  const [confirmDeleteAngleId, setConfirmDeleteAngleId] = useState<string | null>(null);

  const fetchPresets = useCallback(async () => {
    const res = await fetch("/api/presets");
    setPresets(await res.json());
  }, []);

  const fetchAngles = useCallback(async () => {
    const res = await fetch("/api/angles");
    setAngles(await res.json());
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPresets(), fetchAngles()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [fetchPresets, fetchAngles]);

  // ── PRESET CRUD ──────────────────────────────────────────
  const handleSavePreset = async (form: Partial<Preset>) => {
    if (!form.label || !form.product_name) return;
    try {
      if (editingPreset) {
        await fetch(`/api/presets/${editingPreset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowPresetForm(false);
      setEditingPreset(null);
      await fetchPresets();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeletePreset = async (id: string) => {
    try {
      await fetch(`/api/presets/${id}`, { method: "DELETE" });
      setConfirmDeletePresetId(null);
      await fetchPresets();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDuplicatePreset = async (preset: Preset) => {
    const dup = { ...preset, label: `${preset.label} (Copia)`, id: undefined, isReadonly: false };
    await fetch("/api/presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dup),
    });
    await fetchPresets();
  };

  // ── ANGLE CRUD ──────────────────────────────────────────
  const handleSaveAngle = async (form: Partial<Angle>) => {
    if (!form.label) return;
    try {
      if (editingAngle) {
        await fetch(`/api/angles/${editingAngle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/angles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowAngleForm(false);
      setEditingAngle(null);
      await fetchAngles();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteAngle = async (id: string) => {
    try {
      await fetch(`/api/angles/${id}`, { method: "DELETE" });
      setConfirmDeleteAngleId(null);
      await fetchAngles();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // ── Filtros ─────────────────────────────────────────────
  const systemPresets = presets.filter((p) => p.isReadonly);
  const customPresets = presets.filter((p) => !p.isReadonly);
  const filteredSystem = presetFilterCat === "all"
    ? systemPresets
    : systemPresets.filter((p) => p.category === presetFilterCat);
  const systemAngles = angles.filter((a) => a.isReadonly);
  const customAngles = angles.filter((a) => !a.isReadonly);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-xs font-mono theme-text-muted animate-pulse">Cargando biblioteca...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="p-3 theme-card border-amber-400/40 bg-amber-950/20 flex items-center gap-2 text-xs font-mono text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sub-tab switcher */}
      <div className="flex gap-1 theme-card p-1 w-fit">
        <button
          onClick={() => setActiveSub("presets")}
          className={`px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
            activeSub === "presets" ? "theme-btn-primary" : "theme-btn-secondary"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
          Presets ({presets.length})
        </button>
        <button
          onClick={() => setActiveSub("angles")}
          className={`px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
            activeSub === "angles" ? "theme-btn-primary" : "theme-btn-secondary"
          }`}
        >
          <Zap className="w-3.5 h-3.5 inline mr-1.5" />
          Ángulos ({angles.length})
        </button>
      </div>

      {/* ─── PRESETS SUBMÓDULO ─────────────────────────────── */}
      {activeSub === "presets" && (
        <div className="space-y-6">
          {/* Header + create */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-sm font-bold text-[#F8F8F2]">Biblioteca de Presets</h2>
              <p className="text-[10px] font-mono theme-text-muted mt-0.5">
                {systemPresets.length} del sistema · {customPresets.length} personalizados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={presetFilterCat}
                onChange={(e) => setPresetFilterCat(e.target.value)}
                className="p-1.5 theme-input font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="bebidas">🍹 Bebidas</option>
                <option value="comidas">🍽 Comidas</option>
                <option value="custom">⭐ Personalizados</option>
              </select>
              <button
                onClick={() => { setShowPresetForm(true); setEditingPreset(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 theme-btn-primary font-mono text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Crear Preset
              </button>
            </div>
          </div>

          {/* Create/Edit form */}
          {(showPresetForm || editingPreset) && (
            <PresetForm
              initial={editingPreset ? { ...editingPreset } : emptyPreset()}
              onSave={handleSavePreset}
              onCancel={() => { setShowPresetForm(false); setEditingPreset(null); }}
              isEdit={!!editingPreset}
            />
          )}

          {/* Sistema presets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 theme-text-muted" />
              <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider">
                Sistema — Solo Lectura ({filteredSystem.length})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSystem.map((p) => (
                <div key={p.id} className="theme-card p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold text-[#F8F8F2] block truncate">{p.label}</span>
                      <span className="text-[10px] font-mono theme-text-muted">{CATEGORY_LABELS[p.category]}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-700/40 text-slate-400 border border-slate-600/30 shrink-0">
                      Sistema
                    </span>
                  </div>
                  <p className="text-[10px] font-mono theme-text-muted line-clamp-2">{p.product_description}</p>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onUsePreset(p)}
                      className="flex items-center gap-1 px-2.5 py-1 theme-btn-primary font-mono text-[10px] font-bold cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3" />
                      Usar
                    </button>
                    <button
                      onClick={() => handleDuplicatePreset(p)}
                      className="flex items-center gap-1 px-2.5 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                      title="Duplicar para editar"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom presets */}
          {customPresets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider">
                  Mis Presets ({customPresets.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customPresets.map((p) => (
                  <div key={p.id} className="theme-card p-3 space-y-2 border-emerald-400/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-bold text-emerald-300 block truncate">{p.label}</span>
                        <span className="text-[10px] font-mono theme-text-muted">{CATEGORY_LABELS[p.category]}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 shrink-0">
                        Mi Preset
                      </span>
                    </div>
                    <p className="text-[10px] font-mono theme-text-muted line-clamp-2">{p.product_description}</p>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => onUsePreset(p)}
                        className="flex items-center gap-1 px-2.5 py-1 theme-btn-primary font-mono text-[10px] font-bold cursor-pointer"
                      >
                        <ChevronRight className="w-3 h-3" />
                        Usar
                      </button>
                      <button
                        onClick={() => { setEditingPreset(p); setShowPresetForm(false); }}
                        className="flex items-center gap-1 px-2.5 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDuplicatePreset(p)}
                        className="flex items-center gap-1 px-2.5 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {confirmDeletePresetId === p.id ? (
                        <>
                          <button
                            onClick={() => handleDeletePreset(p.id)}
                            className="px-2 py-1 bg-amber-700/60 text-amber-200 font-mono text-[10px] cursor-pointer border border-amber-500/40"
                          >
                            ¿Confirmar?
                          </button>
                          <button
                            onClick={() => setConfirmDeletePresetId(null)}
                            className="px-2 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeletePresetId(p.id)}
                          className="flex items-center gap-1 px-2.5 py-1 theme-btn-secondary font-mono text-[10px] text-amber-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── ÁNGULOS SUBMÓDULO ─────────────────────────────── */}
      {activeSub === "angles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-sm font-bold text-[#F8F8F2]">Biblioteca de Ángulos</h2>
              <p className="text-[10px] font-mono theme-text-muted mt-0.5">
                {systemAngles.length} del sistema · {customAngles.length} personalizados
              </p>
            </div>
            <button
              onClick={() => { setShowAngleForm(true); setEditingAngle(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 theme-btn-primary font-mono text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear Ángulo
            </button>
          </div>

          {/* Create/Edit form */}
          {(showAngleForm || editingAngle) && (
            <AngleForm
              initial={editingAngle ? { ...editingAngle } : emptyAngle()}
              onSave={handleSaveAngle}
              onCancel={() => { setShowAngleForm(false); setEditingAngle(null); }}
              isEdit={!!editingAngle}
            />
          )}

          {/* Sistema angles */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 theme-text-muted" />
              <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider">
                Sistema — Solo Lectura ({systemAngles.length})
              </span>
            </div>
            <div className="space-y-2">
              {systemAngles.map((a) => (
                <div key={a.id} className="theme-card p-3 flex items-start gap-3">
                  <span className={`text-[9px] font-mono px-2 py-0.5 shrink-0 mt-0.5 ${BADGE_COLOR_CLASSES[a.badge_color]}`}>
                    {a.badge_color.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#F8F8F2] block">{a.label}</span>
                    <p className="text-[10px] font-mono theme-text-muted mt-0.5 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom angles */}
          {customAngles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider">
                  Mis Ángulos ({customAngles.length})
                </span>
              </div>
              <div className="space-y-2">
                {customAngles.map((a) => (
                  <div key={a.id} className="theme-card p-3 flex items-start gap-3 border-purple-400/20">
                    <span className={`text-[9px] font-mono px-2 py-0.5 shrink-0 mt-0.5 ${BADGE_COLOR_CLASSES[a.badge_color]}`}>
                      {a.badge_color.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-purple-300 block">{a.label}</span>
                      <p className="text-[10px] font-mono theme-text-muted mt-0.5 leading-relaxed">{a.description}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => { setEditingAngle(a); setShowAngleForm(false); }}
                        className="flex items-center gap-1 px-2 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {confirmDeleteAngleId === a.id ? (
                        <>
                          <button
                            onClick={() => handleDeleteAngle(a.id)}
                            className="px-2 py-1 bg-amber-700/60 text-amber-200 font-mono text-[10px] cursor-pointer border border-amber-500/40"
                          >
                            ¿Confirmar?
                          </button>
                          <button
                            onClick={() => setConfirmDeleteAngleId(null)}
                            className="px-2 py-1 theme-btn-secondary font-mono text-[10px] cursor-pointer"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteAngleId(a.id)}
                          className="flex items-center gap-1 px-2 py-1 theme-btn-secondary font-mono text-[10px] text-amber-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
