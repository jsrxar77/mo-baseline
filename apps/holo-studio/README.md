# Holo Studio

Suite Web profesional World-Class para generación de guiones de video de respuesta directa (TikTok/Reels en formato vertical 9:16), producción de audio neuronal y renderizado dinámico con Google AI, con costo $0 en suscripciones.

## Arquitectura y Stack Tecnológico

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Estilos**: Tailwind CSS + Custom Design System CSS (`holo-theme.css`)
- **Iconografía**: `lucide-react`
- **Navegación**: Sticky Header con Drawer lateral derecho (`<aside id="nav-drawer" className="fixed top-0 right-0 ...">`) y animación fluida con backdrop blur.
- **Temas**: 5 temas canónicos integrados:
  - `Omarchy Tiling` (Por defecto — estrictamente **SIN ROJO**, usando emerald `#A6DA95`, cobalt `#CBA6F7` y amber `#F1FA8C`)
  - `Omarchy Aetherial`
  - `Soft Pastel`
  - `Dark Glass`
  - `Cyberpunk Glass`

## Módulos y Flujo de Trabajo

1. **Estrategia & Ángulo**: Formulación del dolor central, quiebre de creencia y demostración técnica.
2. **Guion 4 Columnas**:
   - Audio / Voz en off
   - Visual / B-Roll
   - Texto en Pantalla
   - Indicador Emocional
   - 3 Ganchos DCT (Visual, Verbal, Textual) con KPIs (Thumbstop Rate > 35%, Hold Rate > 15%).
3. **Locución Neuronal**: Motor local/Google Cloud TTS para síntesis vocal.
4. **Render 9:16**: Composición de video con movimiento dinámico y subtítulos tipográficos.

## Ejecución

Para iniciar la aplicación en desarrollo o producción:

```bash
# Vía script en la raíz del repositorio
./bin/holo-studio.sh

# O manualmente desde el directorio
cd apps/holo-studio
npm run dev
# Puerto por defecto: http://localhost:3000
```
