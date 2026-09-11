export interface ThemeConfig {
  key: string;
  name: string;
  background: string;
  cardBg: string;
  cardBorder: string;
  emerald: string;
  cobalt: string;
  amber: string;
  red: string;
  textMain: string;
  textMuted: string;
  fontFamily: string;
  fontMono: string;
  borderRadius: number;
}

export const HOLO_THEMES: Record<string, ThemeConfig> = {
  omarchy_tiling: {
    key: "omarchy_tiling",
    name: "Omarchy Tiling",
    background: "#121317",
    cardBg: "#1A1B22",
    cardBorder: "#2E303E",
    emerald: "#A6DA95",
    cobalt: "#BD93F9",
    amber: "#F1FA8C",
    red: "#F1FA8C", // REGLA DE ORO: En Omarchy el color rojo está terminantemente prohibido. Sustituido por Ámbar.
    textMain: "#F8F8F2",
    textMuted: "#6272A4",
    fontFamily: "JetBrains Mono, monospace",
    fontMono: "JetBrains Mono, monospace",
    borderRadius: 4,
  },
  omarchy_aetheria: {
    key: "omarchy_aetheria",
    name: "Omarchy Aetherial",
    background: "#0E091D",
    cardBg: "#170F2E",
    cardBorder: "#3D256D",
    emerald: "#14B9B5",
    cobalt: "#7C3AED",
    amber: "#FBBF24",
    red: "#FBBF24", // REGLA DE ORO: En Omarchy el color rojo está terminantemente prohibido. Sustituido por Ámbar.
    textMain: "#F3EEFF",
    textMuted: "#9D8BBF",
    fontFamily: "JetBrains Mono, monospace",
    fontMono: "JetBrains Mono, monospace",
    borderRadius: 4,
  },
  soft_minimal_pastel: {
    key: "soft_minimal_pastel",
    name: "Soft Pastel (Catppuccin)",
    background: "#1E1E2E",
    cardBg: "#252538",
    cardBorder: "#36364F",
    emerald: "#A6E3A1",
    cobalt: "#89B4FA",
    amber: "#F9E2AF",
    red: "#F38BA8",
    textMain: "#CDD6F4",
    textMuted: "#7F849C",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontMono: "monospace",
    borderRadius: 16,
  },
  dark_glassmorphism: {
    key: "dark_glassmorphism",
    name: "Dark Glass",
    background: "#0B0E14",
    cardBg: "rgba(18, 24, 38, 0.55)",
    cardBorder: "rgba(255, 255, 255, 0.12)",
    emerald: "#00E676",
    cobalt: "#3B82F6",
    amber: "#F59E0B",
    red: "#FF5252",
    textMain: "#FFFFFF",
    textMuted: "#8B949E",
    fontFamily: "Outfit, sans-serif",
    fontMono: "monospace",
    borderRadius: 24,
  },
  cyberpunk_glassmorphism: {
    key: "cyberpunk_glassmorphism",
    name: "Cyberpunk Glass",
    background: "#05050A",
    cardBg: "rgba(20, 10, 35, 0.70)",
    cardBorder: "rgba(255, 0, 127, 0.45)",
    emerald: "#00FFCC",
    cobalt: "#FF007F",
    amber: "#FFE600",
    red: "#FF003C",
    textMain: "#FFFFFF",
    textMuted: "#A0A0B0",
    fontFamily: "Outfit, sans-serif",
    fontMono: "monospace",
    borderRadius: 8,
  },
};

export const DEFAULT_THEME_KEY = "omarchy_tiling";
