"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Layers,
  Sparkles,
  Mic,
  Video,
  ChevronRight,
  ChevronLeft,
  Play,
  Download,
  AlertCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Library,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
  FolderArchive,
  Volume2,
  Pause,
  BookOpen,
} from "lucide-react";
import { NavigationDrawer, StudioTab } from "../components/NavigationDrawer";
import { HOLO_THEMES, DEFAULT_THEME_KEY } from "../styles/themes";
import { PresetsManagerTab } from "../components/PresetsManagerTab";
import type { Preset, Angle } from "../lib/presets";

// Tipo para tab activa del pipeline
type AppTab = StudioTab;

export default function HoloStudioPage() {
  const [activeTab, setActiveTab] = useState<AppTab>("presets");
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME_KEY);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Configuracion de API y Modelos
  const [aiProvider, setAiProvider] = useState<"google" | "openrouter">("google");
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
  const [openRouterApiKey, setOpenRouterApiKey] = useState(
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ""
  );
  const [llmModel, setLlmModel] = useState("gemini-3.6-flash");

  const handleAiProviderChange = (newProvider: "google" | "openrouter") => {
    setAiProvider(newProvider);
    if (newProvider === "openrouter" && !llmModel.includes("/")) {
      setLlmModel("openrouter/auto");
    } else if (newProvider === "google" && (llmModel.includes("/") || llmModel.includes(":free"))) {
      setLlmModel("gemini-3.6-flash");
    }
  };

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

  // Estado de Generación Visual Local con ComfyUI
  const [comfyGeneratingIdx, setComfyGeneratingIdx] = useState<number | null>(null);
  const [comfyImages, setComfyImages] = useState<Record<number, string>>({});
  const [exportingDrift, setExportingDrift] = useState(false);

  // Estado de Síntesis Vocal Neuronal (Edge TTS - Buenos Aires)
  const [selectedVoice, setSelectedVoice] = useState("es-AR-TomasNeural");
  const [voicePacing, setVoicePacing] = useState("+5%");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

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
          provider: aiProvider,
          api_key: apiKey,
          openrouter_api_key: openRouterApiKey,
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

  // Disparar generación de imagen con ComfyUI local
  const handleGenerateComfyImage = async (sceneIdx: number, promptText: string) => {
    if (!promptText) return;
    setComfyGeneratingIdx(sceneIdx);
    try {
      const res = await fetch("/api/comfy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Fallo al generar imagen con ComfyUI.");
      }
      setComfyImages((prev) => ({ ...prev, [sceneIdx]: data.image_url }));
    } catch (err: any) {
      alert(`[ComfyUI Error]: ${err.message}`);
    } finally {
      setComfyGeneratingIdx(null);
    }
  };

  // Reproducir muestra de locución neuronal argentina con Edge TTS
  const handlePlayTtsSample = async () => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    let textToSpeak = packageData?.matrix_scenes
      ?.map((s: any) => s.voiceover)
      .filter(Boolean)
      .join(". ");

    if (!textToSpeak) {
      textToSpeak = `Che, mirá este video. Si estás buscando ${productName || "una solución real"}, esto te va a cambiar el día por completo.`;
    }

    setLoadingAudio(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          voice: selectedVoice,
          rate: voicePacing,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Fallo en la síntesis vocal neuronal.");
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        alert("Error al reproducir el flujo de audio.");
      };

      await audio.play();
      setIsPlayingAudio(true);
    } catch (err: any) {
      alert(`[Error TTS]: ${err.message}`);
    } finally {
      setLoadingAudio(false);
    }
  };

  // Exportar paquete multipista desacoplado para Drift
  const handleExportDrift = async () => {
    if (!packageData?.matrix_scenes || packageData.matrix_scenes.length === 0) {
      alert("Primero debes generar un guion en la pestaña de Estrategia para exportar a Drift.");
      return;
    }
    setExportingDrift(true);
    try {
      const res = await fetch("/api/export/drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName || "DirectResponse_Video",
          scenes: packageData.matrix_scenes,
          comfyImages,
          voice: selectedVoice,
          rate: voicePacing,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error en el servidor al compilar el proyecto para Drift");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const cleanName = (productName || "Anuncio").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `${cleanName}_Drift_Bundle.drift`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      alert(`[Error Drift Export]: ${err.message}`);
    } finally {
      setExportingDrift(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-200">
      {/* ── Navigation Drawer (ANCLADO A LA DERECHA) ── */}
      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={(t: StudioTab) => setActiveTab(t)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        llmModel={llmModel}
        onLlmModelChange={setLlmModel}
        aiProvider={aiProvider}
        onAiProviderChange={handleAiProviderChange}
        openRouterApiKey={openRouterApiKey}
        onOpenRouterApiKeyChange={setOpenRouterApiKey}
      />

      {/* ── HEADER SUPERIOR FORSEE CON HAMBURGUESA A LA DERECHA ── */}
      <header className="theme-header sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* ── LEFT: Brand ── */}
          <button
            onClick={() => setActiveTab("presets")}
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
            {activeTab === "presets" && (
              <>
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-semibold">0. Presets &amp; Ángulos</span>
              </>
            )}
            {activeTab === "script" && (
              <>
                <Sparkles className="w-3.5 h-3.5 theme-text-accent" />
                <span className="text-xs font-semibold">1. Guion &amp; Estrategia</span>
              </>
            )}
            {activeTab === "audio" && (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold">2. Locución &amp; Audio</span>
              </>
            )}
            {activeTab === "visuals" && (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-semibold">3. Storyboard &amp; Imágenes</span>
              </>
            )}
            {activeTab === "render" && (
              <>
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold">4. Ensamblado &amp; Drift</span>
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

        {/* ── NAVEGACION DE PESTANAS (5 PASOS DESACOPLADOS) ── */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto gap-2">
          {([
            { id: "presets", label: "0. Presets & Ángulos" },
            { id: "script", label: "1. Guion & Estrategia" },
            { id: "audio", label: "2. Locución & Audio" },
            { id: "visuals", label: "3. Storyboard & Imágenes" },
            { id: "render", label: "4. Render & Exportación" },
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

        {/* ── PASO 0: PRESETS & ÁNGULOS (CONFIGURACIÓN BASE) ── */}
        {activeTab === "presets" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 theme-card border-emerald-400/20">
              <div>
                <h2 className="font-mono text-sm font-bold text-[#F8F8F2] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Paso 0: Presets de Producto &amp; Ángulos de Respuesta Directa</span>
                </h2>
                <p className="font-mono text-xs theme-text-muted mt-0.5">
                  Selecciona un producto para cargar sus dolores, mecanismo y oferta, o define nuevos ángulos de venta antes de generar tu guion.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("script")}
                className="px-5 py-2.5 theme-btn-primary font-mono text-xs font-bold uppercase flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>Continuar a Guion &amp; Estrategia</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <PresetsManagerTab
              onUsePreset={(p) => {
                loadFromPreset(p);
                setActiveTab("script");
              }}
            />
          </div>
        )}

        {/* ── PASO 1: GUION & ESTRATEGIA (COPYWRITING CANÓNICO) ── */}
        {activeTab === "script" && (
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
                  onClick={() => { setActiveTab("presets"); }}
                  className="ml-auto text-[10px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  Cambiar en Paso 0
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

            {/* Mensaje informativo si aún no se ha generado */}
            {!packageData && (
              <div className="p-4 theme-card border-white/5 bg-white/[0.02] text-center space-y-1">
                <span className="font-mono text-xs text-slate-300 block">
                  👆 Revisa los datos de tu producto arriba y haz clic en &quot;Generar Matriz Canónica &amp; 3 Hooks DCT&quot;.
                </span>
                <p className="font-mono text-[11px] theme-text-muted">
                  El motor de IA creará los 3 ganchos DCT (Dolor, Quiebre de Creencia y Demo) junto a la matriz técnica de 4 columnas de 30 segundos.
                </p>
              </div>
            )}

            {/* Si ya hay guion generado: 3 Hooks DCT, Matriz Canónica y Guion Continuo */}
            {packageData && (
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

        {/* ── PASO 2: LOCUCIÓN & AUDIO (EDGE TTS • BUENOS AIRES) ── */}
        {activeTab === "audio" && (
          <div className="space-y-6">
            <div className="theme-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#F8F8F2] flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Paso 2: Locución Neuronal &amp; Pista de Audio (Edge TTS • Buenos Aires)</span>
                  </h3>
                  <p className="font-mono text-xs theme-text-muted mt-0.5">
                    Motor neuronal con acento nativo rioplatense y cadencia acelerada para maximizar la retención publicitaria (Hold Rate &gt;= 20%).
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 self-start sm:self-auto">
                  ● Acento: Buenos Aires, AR (Costo $0)
                </span>
              </div>

              <div className="p-4 theme-input flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="text-[10px] font-mono theme-text-muted uppercase block mb-1">
                      Locutor / Voz Porteña
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full p-2 theme-card text-xs font-mono text-emerald-400 border border-white/10 rounded focus:outline-none"
                    >
                      <option value="es-AR-TomasNeural">Tomás Neural (Buenos Aires • Masculina)</option>
                      <option value="es-AR-ElenaNeural">Elena Neural (Buenos Aires • Femenina)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono theme-text-muted uppercase block mb-1">
                      Ritmo / Cadencia de Pacing
                    </label>
                    <select
                      value={voicePacing}
                      onChange={(e) => setVoicePacing(e.target.value)}
                      className="w-full p-2 theme-card text-xs font-mono text-slate-200 border border-white/10 rounded focus:outline-none"
                    >
                      <option value="+5%">+5% Pacing (Dinámico y Enérgico)</option>
                      <option value="+10%">+10% Pacing (Acelerado TikTok/Reels)</option>
                      <option value="+0%">Ritmo Natural (0% Pacing)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center pt-2 md:pt-0">
                  <button
                    onClick={handlePlayTtsSample}
                    disabled={loadingAudio}
                    className={`px-5 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 rounded transition-all cursor-pointer ${
                      isPlayingAudio
                        ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/40"
                        : "theme-btn-primary"
                    }`}
                  >
                    {loadingAudio ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sintetizando...</span>
                      </>
                    ) : isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Detener Reproducción</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Escuchar Muestra Porteña</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Desglose de Locución Escena por Escena */}
            {packageData?.matrix_scenes ? (
              <div className="theme-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold text-[#F8F8F2] flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Desglose de Locución por Escenas (Pista de Audio Desacoplada)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {packageData.matrix_scenes.length} Escenas
                  </span>
                </div>
                <div className="space-y-3">
                  {packageData.matrix_scenes.map((sc: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 theme-input flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-1 bg-black/40 rounded border border-white/5 whitespace-nowrap">
                          {sc.timestamp}
                        </span>
                        <span className="font-mono text-xs text-slate-200">
                          &quot;{sc.voiceover}&quot;
                        </span>
                      </div>
                      <span className="text-[10px] font-mono theme-text-muted shrink-0">
                        {sc.segment || `Escena ${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="theme-card p-6 text-center space-y-2">
                <p className="font-mono text-xs theme-text-muted">
                  Aún no has generado ningún guion. Puedes probar la voz con el botón de muestra arriba o volver al Paso 1 para crear tu guion.
                </p>
              </div>
            )}

            {/* Navegación inferior Paso 2 */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setActiveTab("script")}
                className="px-4 py-2 theme-btn-secondary font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a Guion</span>
              </button>
              <button
                onClick={() => setActiveTab("visuals")}
                className="px-6 py-2.5 theme-btn-primary font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar a Storyboard &amp; Imágenes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: STORYBOARD & RENDER DE IMÁGENES (COMFYUI) ── */}
        {activeTab === "visuals" && (
          <div className="space-y-6">
            <div className="theme-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#F8F8F2] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Paso 3: Storyboard Visual 9:16 (ComfyUI B-Roll)</span>
                  </h3>
                  <p className="font-mono text-xs theme-text-muted mt-0.5">
                    Generación de planos visuales verticales con Stable Diffusion (DreamShaper 8) ejecutándose en Metal/MPS de tu Mac.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 self-start sm:self-auto">
                  ● Engine: DreamShaper 8 (Local MPS)
                </span>
              </div>
            </div>

            {!packageData ? (
              <div className="theme-card p-8 text-center space-y-3">
                <ImageIcon className="w-8 h-8 text-emerald-400/50 mx-auto" />
                <p className="font-mono text-xs theme-text-muted">
                  Aún no has generado un guion con escenas para ilustrar en el Storyboard.
                </p>
                <button
                  onClick={() => setActiveTab("script")}
                  className="px-4 py-2 theme-btn-primary font-mono text-xs font-bold uppercase"
                >
                  Ir a Paso 1 (Guion &amp; Estrategia)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {packageData?.matrix_scenes?.map((sc: any, idx: number) => {
                    const prompt = sc.image_prompt || "Vertical photorealistic shot 9:16 for direct response commercial...";
                    const generatedImg = comfyImages[idx];
                    const isGenerating = comfyGeneratingIdx === idx;

                    return (
                      <div key={idx} className="theme-card p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              Escena {idx + 1}
                            </span>
                            <span className="font-mono text-[10px] theme-text-muted">
                              {sc.timestamp}
                            </span>
                          </div>

                          {/* Imagen generada o placeholder */}
                          {generatedImg ? (
                            <div className="relative aspect-[9/16] rounded-lg overflow-hidden border border-emerald-500/30 bg-black/40 group">
                              <img
                                src={generatedImg}
                                alt={`Escena ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                                COMFYUI
                              </div>
                            </div>
                          ) : null}

                          <p className="text-[11px] font-mono text-slate-300 line-clamp-3">
                            {prompt}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <span className="text-[10px] font-mono theme-text-accent block truncate">
                            {sc.screen_text}
                          </span>

                          <button
                            onClick={() => handleGenerateComfyImage(idx, prompt)}
                            disabled={isGenerating || comfyGeneratingIdx !== null}
                            className={`w-full py-1.5 px-2.5 rounded font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isGenerating
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait"
                                : generatedImg
                                ? "bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
                            }`}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Generando en ComfyUI...</span>
                              </>
                            ) : generatedImg ? (
                              <>
                                <RefreshCw className="w-3 h-3" />
                                <span>Regenerar B-Roll</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3 h-3" />
                                <span>Generar con ComfyUI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navegación inferior Paso 3 */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setActiveTab("audio")}
                    className="px-4 py-2 theme-btn-secondary font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a Locución</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("render")}
                    className="px-6 py-2.5 theme-btn-primary font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuar a Render &amp; Exportación</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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

                  {/* ── Exportación Multipista Desacoplada para Drift ── */}
                  <div className="pt-4 mt-2 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <FolderArchive className="w-3.5 h-3.5" />
                        <span>Proyecto Desacoplado para Drift</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Open Source NLE
                      </span>
                    </div>
                    <p className="font-mono text-[11px] theme-text-muted leading-relaxed">
                      Exporta un paquete <strong className="text-slate-200">.drift</strong> multipista con: audio de locución, B-Roll de ComfyUI y subtítulos editables (desacoplados, sin quemar), listo para abrir en Drift o sincronizar vía Drift MCP.
                    </p>
                    <button
                      onClick={handleExportDrift}
                      disabled={exportingDrift}
                      className={`w-full py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer rounded transition-all ${
                        exportingDrift
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/40"
                      }`}
                    >
                      {exportingDrift ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Empaquetando Assets para Drift...</span>
                        </>
                      ) : (
                        <>
                          <FolderArchive className="w-4 h-4" />
                          <span>Exportar Paquete para Drift (.drift)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => setActiveTab("visuals")}
                      className="px-4 py-2 theme-btn-secondary font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Volver a Storyboard &amp; Imágenes</span>
                    </button>
                  </div>
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
