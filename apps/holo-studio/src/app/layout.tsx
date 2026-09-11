import type { Metadata } from "next";
import "./globals.css";
import "../styles/holo-theme.css";

export const metadata: Metadata = {
  title: "Holo Studio | Direct Response Video AI Engine",
  description: "Suite de generacion masiva y edicion de video vertical 9:16 para TikTok y Meta Reels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="theme-omarchy_tiling" suppressHydrationWarning>
      <body className="antialiased min-h-screen theme-omarchy_tiling bg-[#121317] text-[#F8F8F2]">
        {children}
      </body>
    </html>
  );
}
