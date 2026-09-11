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
// Cuando se usa "openrouter/auto", OpenRouter intentará estos
// modelos en orden estricto. Si uno tiene rate-limit, salta al siguiente.
// Todos terminan estrictamente en ':free' (Costo $0 / 1M tokens).
// ─────────────────────────────────────────────────────────────
export const OPENROUTER_FREE_FALLBACK_CHAIN = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
] as const;

// Modelos seleccionables en el Navigation Drawer para OpenRouter
export const OPENROUTER_MODELS: ModelOption[] = [
  {
    id: "openrouter/auto",
    label: "⚡ Auto Fallback (Cadena Inteligente :free)",
    provider: "openrouter",
    isFree: true,
    description: "Intenta Llama 3.3 70B -> DeepSeek R1 -> DeepSeek V3 -> Gemini 2.0 -> Qwen 2.5 sin interrupciones",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    label: "🦙 Meta Llama 3.3 70B (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo insignia de Meta, excelente para copy de performance",
  },
  {
    id: "deepseek/deepseek-r1:free",
    label: "🧠 DeepSeek R1 Razonamiento (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo de razonamiento analítico para matrices complejas",
  },
  {
    id: "deepseek/deepseek-chat:free",
    label: "⚡ DeepSeek V3 Chat (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Alta velocidad y precisión en copywriting en español",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    label: "✨ Google Gemini 2.0 Flash Exp (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Nueva generación multimodal de Google vía OpenRouter",
  },
  {
    id: "qwen/qwen-2.5-72b-instruct:free",
    label: "🌐 Qwen 2.5 72B Instruct (:free)",
    provider: "openrouter",
    isFree: true,
    description: "72 mil millones de parámetros optimizados para instrucciones",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    label: "🌪️ Mistral 7B Instruct (:free)",
    provider: "openrouter",
    isFree: true,
    description: "Modelo ligero, rápido y confiable para hooks directos",
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
