"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Layers,
  Sparkles,
  Mic,
  Video,
  ChevronRight,
  Play,
  Download,
  AlertCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Library,
  RotateCcw,
} from "lucide-react";
import { NavigationDrawer, StudioTab } from "../components/NavigationDrawer";
import { HOLO_THEMES, DEFAULT_THEME_KEY } from "../styles/themes";
import { PresetsManagerTab } from "../components/PresetsManagerTab";
import type { Preset, Angle } from "../lib/presets";

// Tipo extendido para tab activa (incluye la nueva tab)
type AppTab = StudioTab | "library";

export default function HoloStudioPage() {
  const [activeTab, setActiveTab] = useState<AppTab>("strategy");
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME_KEY);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Configuracion de API y Modelos
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
  const [llmModel, setLlmModel] = useState("gemini-3.6-flash");

  // Presets y ángulos cargados desde API
  const [allPresets, setAllPresets] = useState<Preset[]>([]);
  const [allAngles, setAllAngles] = useState<Angle[]>([]);

  // Preset activo y estado de edición por campo
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  // Formulario de Producto & Estrategia
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [mainProblem, setMainProblem] = useState("");
  const [uniqueMechanism, setUniqueMechanism] = useState("");
  const [offerCta, setOfferCta] = useState("");
  const [angle, setAngle] = useState("");

  // Estado del Pipeline Creativo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<any | null>(null);
  const [selectedHookIdx, setSelectedHookIdx] = useState(0);

  // Carga de datos desde API al montar
  const fetchLibrary = useCallback(async () => {
    try {
      const [presetsRes, anglesRes] = await Promise.all([
        fetch("/api/presets"),
        fetch("/api/angles"),
      ]);
      const presets: Preset[] = await presetsRes.json();
      const angles: Angle[] = await anglesRes.json();
      setAllPresets(presets);
      setAllAngles(angles);
      // Cargar primer preset del sistema por defecto
      if (presets.length > 0 && !activePreset) {
        loadFromPreset(presets[0]);
      }
      if (angles.length > 0 && !angle) {
        setAngle(angles[0].label);
      }
    } catch (e) {
      console.error("Error cargando biblioteca:", e);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  // Manejo de Temas
  useEffect(() => {
    const savedTheme = localStorage.getItem("holo_theme") || DEFAULT_THEME_KEY;
    setCurrentTheme(savedTheme);
    document.documentElement.className = `theme-${savedTheme}`;
    document.body.className = `theme-${savedTheme}`;
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("holo_theme", newTheme);
    document.documentElement.className = `theme-${newTheme}`;
    document.body.className = `theme-${newTheme}`;
  };

  // Carga desde preset (desde selector o desde tab biblioteca)
  const loadFromPreset = (p: Preset) => {
    setActivePreset(p);
    setEditedFields(new Set());
    setProductName(p.product_name);
    setProductDesc(p.product_description);
    setTargetAudience(p.target_audience);
    setMainProblem(p.main_problem);
    setUniqueMechanism(p.unique_mechanism);
    setOfferCta(p.offer_or_cta);
  };

  // Restaurar campo individual al valor del preset activo
  const restoreField = (field: keyof Preset) => {
    if (!activePreset) return;
    const map: Record<string, (v: string) => void> = {
      product_name: setProductName,
      product_description: setProductDesc,
      target_audience: setTargetAudience,
      main_problem: setMainProblem,
      unique_mechanism: setUniqueMechanism,
      offer_or_cta: setOfferCta,
    };
    if (map[field]) map[field](String(activePreset[field] || ""));
    setEditedFields((prev) => { const s = new Set(prev); s.delete(field); return s; });
  };

  // Marcar campo como editado
  const markEdited = (field: string, setter: (v: string) => void) => (v: string) => {
    setter(v);
    if (activePreset) setEditedFields((prev) => { const s = new Set(Array.from(prev)); s.add(field); return s; });
  };

  // Generar con Google AI
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName,
          product_description: productDesc,
          target_audience: targetAudience,
          main_problem: mainProblem,
          unique_mechanism: uniqueMechanism,
          offer_or_cta: offerCta,
          angle,
          api_key: apiKey,
          model: llmModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al conectar con el motor de IA.");
      }

      setPackageData(data);
      setActiveTab("script");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-200">
      {/* ── Navigation Drawer (ANCLADO A LA DERECHA) ── */}
      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={(activeTab === "library" ? "strategy" : activeTab) as StudioTab}
        onTabChange={(t: StudioTab) => setActiveTab(t)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        llmModel={llmModel}
        onLlmModelChange={setLlmModel}
      />

      {/* ── HEADER SUPERIOR FORSEE CON HAMBURGUESA A LA DERECHA ── */}
      <header className="theme-header sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* ── LEFT: Brand ── */}
          <button
            onClick={() => setActiveTab("strategy")}
            className="flex flex-col text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="font-bold tracking-tight text-base sm:text-lg leading-tight font-mono text-[#F8F8F2]">
              HOLO STUDIO
            </span>
            <span className="text-[10px] theme-text-accent font-mono tracking-wider uppercase">
              Direct Response Video AI Engine
            </span>
          </button>

          {/* ── CENTER: Tab indicator pill ── */}
          <div className="hidden md:flex items-center theme-input px-3 py-1.5 gap-2 font-mono">
            {activeTab === "strategy" && (
              <>
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold">1. Estrategia &amp; Producto</span>
              </>
            )}
            {activeTab === "script" && (
              <>
                <Sparkles className="w-3.5 h-3.5 theme-text-accent" />
                <span className="text-xs font-semibold">2. Guion Canonico (4 Col)</span>
              </>
            )}
            {activeTab === "audio" && (
              <>
                <Mic className="w-3.5 h-3.5 theme-text-amber" />
                <span className="text-xs font-semibold">3. Audio &amp; Storyboard</span>
              </>
            )}
            {activeTab === "render" && (
              <>
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold">4. Render &amp; Exportacion</span>
              </>
            )}
          </div>

          {/* ── RIGHT: Estado + Hamburger Button (#btn-open-drawer) ── */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 theme-badge-primary font-mono text-[11px] whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{HOLO_THEMES[currentTheme]?.name}</span>
            </div>

            {/* Hamburger Button a la Derecha */}
            <button
              id="btn-open-drawer"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu de navegacion"
              className="flex items-center justify-center w-9 h-9 theme-badge-ctrl hover:brightness-125 transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4 text-[#F8F8F2]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Contenedor Principal ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Banner de Bienvenida y KPIs */}
        <div className="theme-card p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-[#F8F8F2]">
              Pipeline Creativo de Video Vertical (9:16)
            </h1>
            <p className="theme-text-muted text-xs sm:text-sm font-mono mt-1">
              Optimizacion estricta para TikTok Ads y Meta Reels bajo la matriz canonica de respuesta directa.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="theme-badge-primary font-mono text-xs px-3 py-1">
              Thumbstop &gt;= 30%
            </span>
            <span className="theme-badge-secondary font-mono text-xs px-3 py-1">
              Hold Rate &gt;= 20%
            </span>
            <span className="theme-badge-ctrl font-mono text-xs px-3 py-1 text-emerald-400">
              Costo Software: $0
            </span>
          </div>
        </div>

        {/* Notificacion de Error */}
        {error && (
          <div className="p-4 mb-6 theme-card border-amber-400/40 bg-amber-950/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 theme-text-amber shrink-0 mt-0.5" />
            <div className="text-xs font-mono text-amber-200">
              <strong className="block font-bold mb-1">Aviso del Sistema:</strong>
              {error}
            </div>
          </div>
        )}

        {/* ── NAVEGACION DE PESTANAS ── */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-2">
          {([
            { id: "strategy", label: "1. Estrategia & Producto" },
            { id: "script", label: "2. Guion Canónico (4 Col)" },
            { id: "audio", label: "3. Audio & Storyboard" },
            { id: "render", label: "4. Render & Exportación" },
            { id: "library", label: "5. Mis Presets & Ángulos" },
          ] as { id: AppTab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-mono text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent theme-text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 5: BIBLIOTECA DE PRESETS & ÁNGULOS ── */}
        {activeTab === "library" && (
          <PresetsManagerTab
            onUsePreset={(p) => {
              loadFromPreset(p);
              setActiveTab("strategy");
            }}
          />
        )}

        {/* ── TAB 1: ESTRATEGIA & PRODUCTO ── */}
        {activeTab === "strategy" && (
          <div className="space-y-6">

            {/* Chip de preset activo */}
            {activePreset && (
              <div className="flex items-center gap-2 px-3 py-2 theme-card border-emerald-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                  {activePreset.label}
                </span>
                <span className="text-[10px] font-mono theme-text-muted">
                  — {editedFields.size > 0 ? `${editedFields.size} campo(s) editado(s)` : "Preset cargado"}
                </span>
                <button
                  onClick={() => { setActiveTab("library"); }}
                  className="ml-auto text-[10px] font-mono theme-text-muted hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <Library className="w-3 h-3" />
                  Cambiar
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono theme-text-muted uppercase">
                  Preset de E-Commerce Cargado
                </label>
                <select
                  value={activePreset?.id || ""}
                  onChange={(e) => {
                    const found = allPresets.find((p) => p.id === e.target.value);
                    if (found) loadFromPreset(found);
                    else { setActivePreset(null); setEditedFields(new Set()); }
                  }}
                  className="w-full p-2.5 theme-input font-mono text-xs focus:outline-none cursor-pointer"
                >
                  <option value="">— Seleccionar Preset —</option>
                  <optgroup label="🍷 Bebidas & Destilados (poke.com.ar · drinklovers.com.ar)">
                    {allPresets.filter((p) => p.category === "bebidas").map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🍽 Comidas">
                    {allPresets.filter((p) => p.category === "comidas").map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="⭐ Personalizados">
                    {allPresets.filter((p) => p.category === "custom").map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono theme-text-muted uppercase">
                  Ángulo de Respuesta Directa
                </label>
                <select
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full p-2.5 theme-input font-mono text-xs focus:outline-none cursor-pointer"
                >
                  {([
                    { key: "clasicos",          label: "⚡ Frameworks Clásicos de Conversión" },
                    { key: "emocionales",       label: "✨ Emocionales y Aspiracionales" },
                    { key: "racionales",        label: "🔍 Racionales y de Credibilidad" },
                    { key: "nativos",           label: "🎬 Nativos de Plataforma (TikTok / Reels)" },
                    { key: "comportamentales",  label: "🎯 Comportamentales y de Cierre" },
                    { key: "custom",            label: "⭐ Mis Ángulos Personalizados" },
                  ] as { key: string; label: string }[]).map(({ key, label }) => {
                    const group = allAngles.filter((a) => (a as any).group === key || (!( a as any).group && key === "custom" && !a.isReadonly));
                    if (group.length === 0) return null;
                    return (
                      <optgroup key={key} label={label}>
                        {group.map((a) => (
                          <option key={a.id} value={a.label}>{a.label}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Helper para badge de campo */}
              {/* Columna izquierda */}
              <div className="space-y-4">
                {/* Nombre del Producto */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Nombre del Producto</label>
                    {activePreset && editedFields.has("product_name") ? (
                      <button onClick={() => restoreField("product_name")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => markEdited("product_name", setProductName)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none transition-opacity ${
                      activePreset && !editedFields.has("product_name") ? "opacity-60" : ""
                    }`}
                    placeholder="Ej: Pack Bartender DrinkLovers"
                  />
                </div>
                {/* Descripción */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Descripción / Beneficios</label>
                    {activePreset && editedFields.has("product_description") ? (
                      <button onClick={() => restoreField("product_description")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={productDesc}
                    onChange={(e) => markEdited("product_description", setProductDesc)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none resize-none transition-opacity ${
                      activePreset && !editedFields.has("product_description") ? "opacity-60" : ""
                    }`}
                    placeholder="Características, materiales, contenido..."
                  />
                </div>
                {/* Audiencia */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Audiencia Objetivo</label>
                    {activePreset && editedFields.has("target_audience") ? (
                      <button onClick={() => restoreField("target_audience")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => markEdited("target_audience", setTargetAudience)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none transition-opacity ${
                      activePreset && !editedFields.has("target_audience") ? "opacity-60" : ""
                    }`}
                    placeholder="Ej: Adultos de 25-45 años..."
                  />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                {/* Dolor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Dolor / Fricción Principal</label>
                    {activePreset && editedFields.has("main_problem") ? (
                      <button onClick={() => restoreField("main_problem")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={mainProblem}
                    onChange={(e) => markEdited("main_problem", setMainProblem)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none transition-opacity ${
                      activePreset && !editedFields.has("main_problem") ? "opacity-60" : ""
                    }`}
                    placeholder="El problema que resuelve..."
                  />
                </div>
                {/* Mecanismo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Mecanismo Único / Solución</label>
                    {activePreset && editedFields.has("unique_mechanism") ? (
                      <button onClick={() => restoreField("unique_mechanism")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={uniqueMechanism}
                    onChange={(e) => markEdited("unique_mechanism", setUniqueMechanism)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none transition-opacity ${
                      activePreset && !editedFields.has("unique_mechanism") ? "opacity-60" : ""
                    }`}
                    placeholder="Por qué tu solución funciona mejor..."
                  />
                </div>
                {/* CTA */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono theme-text-muted uppercase">Oferta / CTA</label>
                    {activePreset && editedFields.has("offer_or_cta") ? (
                      <button onClick={() => restoreField("offer_or_cta")} className="flex items-center gap-1 text-[10px] font-mono text-amber-400 cursor-pointer hover:text-amber-300">
                        <RotateCcw className="w-2.5 h-2.5" /> Restaurar
                      </button>
                    ) : activePreset && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">Preset</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={offerCta}
                    onChange={(e) => markEdited("offer_or_cta", setOfferCta)(e.target.value)}
                    className={`w-full p-2.5 theme-input font-mono text-xs focus:outline-none transition-opacity ${
                      activePreset && !editedFields.has("offer_or_cta") ? "opacity-60" : ""
                    }`}
                    placeholder="Ej: 15% OFF + envío gratis hoy..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 theme-btn-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generando Guion Canonico con Google AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Matriz Canonica &amp; 3 Hooks DCT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: GUION CANONICO (4 COL) ── */}
        {activeTab === "script" && (
          <div className="space-y-6">
            {!packageData ? (
              <div className="theme-card p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 theme-text-accent mx-auto" />
                <p className="font-mono text-xs theme-text-muted">
                  Aun no has generado ningun paquete creativo. Completa los datos en la etapa 1.
                </p>
                <button
                  onClick={() => setActiveTab("strategy")}
                  className="px-4 py-2 theme-btn-primary font-mono text-xs font-bold"
                >
                  Ir a Estrategia
                </button>
              </div>
            ) : (
              <>
                {/* 3 Hooks DCT */}
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#F8F8F2] mb-3">
                    Testing Dinamico de Ganchos (00–03s) • Target Thumbstop &gt;= 30%
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {packageData.hooks?.map((h: any, idx: number) => {
                      const isSelected = selectedHookIdx === idx;
                      // Badges tematicos libres de rojo en Omarchy:
                      const borderCol =
                        idx === 0
                          ? "border-amber-400"
                          : idx === 1
                          ? "border-purple-400"
                          : "border-emerald-400";
                      const textCol =
                        idx === 0
                          ? "text-amber-300"
                          : idx === 1
                          ? "theme-text-accent"
                          : "text-emerald-400";

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedHookIdx(idx)}
                          className={`theme-card p-4 border-l-4 ${borderCol} cursor-pointer transition-all ${
                            isSelected ? "ring-2 ring-emerald-400" : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-mono text-xs font-bold ${textCol}`}>
                              Hook #{idx + 1}: {h.hook_type}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-xs font-mono text-slate-300 mb-2">
                            &quot;{h.voiceover}&quot;
                          </p>
                          <span className="text-[10px] font-mono theme-text-muted block">
                            Texto en pantalla: <strong className="text-white">{h.screen_text}</strong>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Matriz Canonica de 4 Columnas */}
                <div className="space-y-3">
                  <h3 className="font-mono text-sm font-bold text-[#F8F8F2]">
                    Matriz Canonica de Produccion Tecnica (30 Segundos)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border border-white/10">
                      <thead className="bg-white/5 border-b border-white/10 text-[#F8F8F2]">
                        <tr>
                          <th className="p-3">Tiempo</th>
                          <th className="p-3">Video / Accion</th>
                          <th className="p-3">Locucion / Audio</th>
                          <th className="p-3">Texto en Pantalla</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {packageData.matrix_scenes?.map((s: any, i: number) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-emerald-400 whitespace-nowrap">
                              {s.timestamp}
                            </td>
                            <td className="p-3">{s.visual_action}</td>
                            <td className="p-3 text-slate-200">&quot;{s.voiceover}&quot;</td>
                            <td className="p-3 theme-text-accent font-bold">{s.screen_text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Script Completo Editable */}
                <div className="space-y-2">
                  <label className="text-xs font-mono theme-text-muted uppercase block">
                    Guion Continuo para Locucion
                  </label>
                  <textarea
                    rows={4}
                    value={packageData.full_voiceover_script}
                    onChange={(e) =>
                      setPackageData({
                        ...packageData,
                        full_voiceover_script: e.target.value,
                      })
                    }
                    className="w-full p-3 theme-input font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab("audio")}
                    className="px-6 py-2.5 theme-btn-primary font-mono text-xs font-bold uppercase flex items-center gap-2"
                  >
                    <span>Continuar a Locucion &amp; Audio</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 3: AUDIO & STORYBOARD ── */}
        {activeTab === "audio" && (
          <div className="space-y-6">
            <div className="theme-card p-6 space-y-4">
              <h3 className="font-mono text-sm font-bold text-[#F8F8F2]">
                Sintesis Vocal Neuronal (Costo $0)
              </h3>
              <p className="font-mono text-xs theme-text-muted">
                Locucion directa en espanol con cadencia acelerada (+5% / +10%) para maximizar la retencion (Hold Rate &gt;= 20%).
              </p>

              <div className="p-4 theme-input flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs font-bold block text-emerald-400">
                    Voz: Dalia Neural (Latam Dinamica)
                  </span>
                  <span className="font-mono text-[11px] theme-text-muted">
                    Formato: MP3 44.1kHz • Ritmo: +5% Pacing
                  </span>
                </div>
                <button
                  onClick={() => alert("Audio generado para el guion seleccionado.")}
                  className="px-4 py-2 theme-btn-primary font-mono text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Reproducir Muestra</span>
                </button>
              </div>
            </div>

            {/* Storyboard Prompts */}
            <div className="space-y-3">
              <h3 className="font-mono text-sm font-bold text-[#F8F8F2]">
                Storyboard Visual 9:16 (Imagen 3 Prompts)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packageData?.matrix_scenes?.map((sc: any, idx: number) => (
                  <div key={idx} className="theme-card p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        Escena {idx + 1}
                      </span>
                      <span className="font-mono text-[10px] theme-text-muted">
                        {sc.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-300 line-clamp-3">
                      {sc.image_prompt || "Vertical photorealistic shot 9:16 for direct response..."}
                    </p>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono theme-text-accent block truncate">
                        {sc.screen_text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab("render")}
                className="px-6 py-2.5 theme-btn-primary font-mono text-xs font-bold uppercase flex items-center gap-2"
              >
                <span>Continuar a Render 9:16</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 4: RENDER & EXPORTACION ── */}
        {activeTab === "render" && (
          <div className="space-y-6">
            <div className="theme-card p-6 space-y-4">
              <h3 className="font-mono text-sm font-bold text-[#F8F8F2]">
                Ensamblado de Video Vertical (1080x1920)
              </h3>
              <p className="font-mono text-xs theme-text-muted">
                Montaje con paneo dinamico Ken Burns, subtitulos de alta visibilidad centrados en zonas seguras y codificacion H.264 para TikTok/Reels.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="aspect-[9/16] max-h-[460px] bg-black/60 border border-white/10 rounded flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Video className="w-12 h-12 text-emerald-400 opacity-60" />
                  <span className="font-mono text-xs font-bold text-slate-300">
                    Previsualizacion Vertical 9:16
                  </span>
                  <p className="font-mono text-[11px] theme-text-muted max-w-xs">
                    El video se exporta listo para subir a Meta Ads Manager y TikTok Ads.
                  </p>
                </div>

                <div className="space-y-4 flex flex-col justify-center">
                  <div className="p-4 theme-input space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="theme-text-muted">Resolucion:</span>
                      <strong className="text-emerald-400">1080 x 1920 (9:16)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="theme-text-muted">Framerate:</span>
                      <strong className="text-slate-200">30 FPS</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="theme-text-muted">Codec:</span>
                      <strong className="text-slate-200">H.264 / AAC (YUV420P)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="theme-text-muted">Compatibilidad:</span>
                      <strong className="text-emerald-400">TikTok, Reels, Shorts</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Video 9:16 ensamblado. Descargando archivo .mp4")}
                    className="w-full py-3 theme-btn-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Video (.mp4)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="theme-header border-t border-white/10 py-4 px-6 text-center">
        <span className="font-mono text-xs theme-text-muted">
          Holo Studio • Direct Response Engineering • mo-baseline 2026
        </span>
      </footer>
    </main>
  );
}
