// ============================================================
// HOLO STUDIO — Catálogo Centralizado de Modelos IA
// Define los modelos disponibles para Google AI Studio y OpenRouter
// con garantía estricta de costo $0 (:free tier).
// ============================================================

export interface ModelOption {
  id: string;
  label: string;
  provider: "google" | "openrouter";
  isFree: boolean;
  description: string;
}

// ─────────────────────────────────────────────────────────────
// LISTA ORDENADA DE FALLBACKS GRATUITOS PARA OPENROUTER
// OpenRouter restringe el array 'models' a un máximo estricto de 3 ítems.
// Seleccionamos los 3 modelos :free más potentes y activos del catálogo.
// ─────────────────────────────────────────────────────────────
export const OPENROUTER_FREE_FALLBACK_CHAIN = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "liquid/lfm-2.5-2.6b:free",
] as const;

// Modelos seleccionables en el Navigation Drawer para OpenRouter
export const OPENROUTER_MODELS: ModelOption[] = [
  {
    id: "openrouter/auto",
    label: "⚡ Auto Fallback (Cadena Inteligente :free)",
    provider: "openrouter",
    isFree: true,
    description: "Intenta Nemotron 120B -> Gemma 4 31B -> LFM 2.5 sin interrupciones",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    label: "🟢 NVIDIA Nemotron 3 Super 120B (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo insignia de NVIDIA con 120B parámetros y razonamiento rápido",
  },
  {
    id: "google/gemma-4-31b-it:free",
    label: "✨ Google Gemma 4 31B Instruct (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo instruct de 31B de Google de última generación",
  },
  {
    id: "liquid/lfm-2.5-2.6b:free",
    label: "💧 Liquid LFM 2.5 (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo ultra rápido y liviano para borradores inmediatos",
  },
];

// Modelos oficiales de Google AI Studio
export const GOOGLE_MODELS: ModelOption[] = [
  {
    id: "gemini-3.6-flash",
    label: "gemini-3.6-flash (Recomendado Gratuito)",
    provider: "google",
    isFree: true,
    description: "Google AI Studio oficial con cuota gratuita permanente",
  },
  {
    id: "gemini-3.1-flash-lite",
    label: "gemini-3.1-flash-lite",
    provider: "google",
    isFree: true,
    description: "Ultra rápido para pruebas y borradores",
  },
  {
    id: "gemini-3.1-pro-preview",
    label: "gemini-3.1-pro-preview",
    provider: "google",
    isFree: true,
    description: "Modelo Pro para razonamiento creativo avanzado",
  },
];
