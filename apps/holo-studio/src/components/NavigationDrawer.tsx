"use client";

import React, { useEffect } from "react";
import {
  X,
  Layers,
  Sparkles,
  Mic,
  Video,
  Cpu,
  Globe,
  ChevronRight,
  Moon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { HOLO_THEMES } from "../styles/themes";
import { GOOGLE_MODELS, OPENROUTER_MODELS } from "../lib/models";

export type StudioTab = "strategy" | "script" | "audio" | "render";

interface NavItem {
  id: StudioTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "strategy",
    label: "1. Estrategia & Producto",
    icon: <Layers className="w-4 h-4" />,
    description: "Definicion del producto, angulo directo, dolores y oferta",
  },
  {
    id: "script",
    label: "2. Guion Canonico (4 Col)",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Matriz de 30s + 3 Hooks DCT para testeo de retencion",
  },
  {
    id: "audio",
    label: "3. Audio & Storyboard",
    icon: <Mic className="w-4 h-4" />,
    description: "Locucion neuronal con cadencia acelerada y prompts 9:16",
  },
  {
    id: "render",
    label: "4. Render & Exportacion",
    icon: <Video className="w-4 h-4" />,
    description: "Montaje vertical 1080x1920 con Ken Burns y exportacion",
  },
];

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  llmModel: string;
  onLlmModelChange: (model: string) => void;
  aiProvider?: "google" | "openrouter";
  onAiProviderChange?: (provider: "google" | "openrouter") => void;
  openRouterApiKey?: string;
  onOpenRouterApiKeyChange?: (key: string) => void;
}

export function NavigationDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  currentTheme,
  onThemeChange,
  apiKey,
  onApiKeyChange,
  llmModel,
  onLlmModelChange,
  aiProvider = "google",
  onAiProviderChange,
  openRouterApiKey = "",
  onOpenRouterApiKeyChange,
}: NavigationDrawerProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll de body cuando el drawer este abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (tab: StudioTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* ── Backdrop Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer panel (ANCLADO A LA DERECHA) ── */}
      <aside
        role="navigation"
        aria-label="Menu principal de Holo Studio"
        className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          theme-drawer`}
        style={{
          background: "var(--theme-card-bg, #181825)",
          borderLeft: "1px solid var(--theme-card-border, #313244)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Header del Drawer ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <span className="font-bold tracking-tight text-sm text-[#F8F8F2] block font-mono">
              HOLO STUDIO
            </span>
            <span className="block text-[10px] theme-text-accent font-mono tracking-wider uppercase mt-0.5">
              Direct Response Video AI Engine
            </span>
          </div>
          <button
            onClick={onClose}
            id="drawer-close-btn"
            className="p-2 theme-btn-secondary transition-all hover:rotate-90 duration-200 cursor-pointer"
            aria-label="Cerrar menu"
          >
            <X className="w-4 h-4 text-[#F8F8F2]" />
          </button>
        </div>

        {/* ── Contenido Scrollable ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* ── SECCION 1: NAVEGACION DE ETAPAS ── */}
          <div>
            <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider px-1 block mb-2">
              Navegacion
            </span>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all group cursor-pointer ${
                      isActive
                        ? "theme-btn-primary"
                        : "hover:bg-white/5 theme-text-muted hover:text-white"
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? "" : "opacity-60 group-hover:opacity-100"}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold block">{item.label}</span>
                      <span className="text-[10px] theme-text-muted block truncate mt-0.5 leading-tight">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── SECCION 2: APARIENCIA & TEMAS (5 TEMAS CANONICOS) ── */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider px-1 block">
              Apariencia &amp; Tema
            </span>
            <div className="flex items-center gap-2.5 px-3 py-2.5 theme-input">
              <Moon className="w-3.5 h-3.5 theme-text-accent shrink-0" />
              <span className="text-xs font-mono theme-text-muted">Tema:</span>
              <select
                value={currentTheme}
                onChange={(e) => onThemeChange(e.target.value)}
                className="flex-1 bg-transparent theme-text-accent font-semibold text-xs focus:outline-none cursor-pointer font-mono"
              >
                {Object.values(HOLO_THEMES).map((th) => (
                  <option key={th.key} value={th.key} className="bg-[#181825] text-slate-200">
                    {th.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-mono text-emerald-400 block">
                ● Cero rojo en Omarchy (Acentos Esmeralda/Cobalto/Ambar)
              </span>
            </div>
          </div>

          {/* ── SECCION 3: MOTORES IA ACTIVOS ── */}
          <div>
            <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider px-1 block mb-2">
              Motores IA Activos
            </span>

            {/* Selector de Proveedor IA */}
            <div className="grid grid-cols-2 gap-1 mb-2 p-1 bg-black/40 border border-white/10 rounded">
              <button
                type="button"
                onClick={() => onAiProviderChange?.("google")}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono font-medium rounded transition-all ${
                  aiProvider === "google"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu className="w-3 h-3 shrink-0" />
                Google AI
              </button>
              <button
                type="button"
                onClick={() => onAiProviderChange?.("openrouter")}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono font-medium rounded transition-all ${
                  aiProvider === "openrouter"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Globe className="w-3 h-3 shrink-0" />
                OpenRouter
              </button>
            </div>

            <div className="space-y-2">
              {aiProvider === "google" ? (
                <div className="p-3 theme-input space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 theme-text-accent shrink-0" />
                      <span className="text-[11px] font-mono font-bold">Google AI Studio</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Free Tier
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="GEMINI_API_KEY..."
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1.5 bg-black/40 border border-white/10 rounded text-[#F8F8F2] focus:outline-none focus:border-emerald-400"
                  />
                  <select
                    value={llmModel}
                    onChange={(e) => onLlmModelChange(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1 bg-black/40 border border-white/10 rounded text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {GOOGLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 theme-input space-y-2 border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-[11px] font-mono font-bold text-purple-300">OpenRouter</span>
                    </div>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:underline"
                    >
                      Key Gratis ↗
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="sk-or-v1-... (OpenRouter API Key)"
                    value={openRouterApiKey}
                    onChange={(e) => onOpenRouterApiKeyChange?.(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1.5 bg-black/40 border border-white/10 rounded text-[#F8F8F2] focus:outline-none focus:border-purple-400"
                  />
                  <select
                    value={llmModel}
                    onChange={(e) => onLlmModelChange(e.target.value)}
                    className="w-full text-xs font-mono px-2 py-1 bg-black/40 border border-white/10 rounded text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {OPENROUTER_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2.5 px-3 py-2.5 theme-input">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono theme-text-muted block">Locucion Neuronal</span>
                  <span className="text-xs font-bold font-mono truncate block text-emerald-400">
                    Neural TTS (Costo $0)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECCION 4: GUARDRAILS DIRECT RESPONSE ── */}
          <div>
            <span className="text-[10px] font-mono theme-text-muted uppercase tracking-wider px-1 block mb-2">
              Guardrails de Pauta
            </span>
            <div className="p-3 theme-card space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="theme-text-muted">Thumbstop Rate:</span>
                <span className="text-emerald-400 font-bold">&gt;= 30%</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-muted">Hold Rate:</span>
                <span className="text-emerald-400 font-bold">&gt;= 20%</span>
              </div>
              <div className="flex justify-between">
                <span className="theme-text-muted">Estructura:</span>
                <span className="theme-text-accent">4 Columnas (30s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer: Version ── */}
        <div className="px-5 py-3 border-t border-white/10">
          <span className="text-[10px] font-mono theme-text-muted">
            Holo Studio v1.0 • 2026
          </span>
        </div>
      </aside>
    </>
  );
}
