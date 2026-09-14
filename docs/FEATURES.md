# ACTIVE CAPABILITIES & TOOL MATRIX

### 1. Medición y Datos
* `track:audit-events`: Simulación de compra vía Puppeteer y validación de `event_id`.
* `track:setup-consent`: Inyección de plantilla Consent Mode v2 por defecto en `denied`.
* `track:sha256-hash`: Normalización y hasheo de credenciales de usuario (email y teléfono E.164).
* **Skill Activa:** `tracking-capi-gtm` (`.agent/skills/tracking-capi-gtm/SKILL.md`).

### 2. Feeds y Catálogos
* `merchant:sync-labels`: Cruce de base de datos con Google Merchant Center para custom_labels.
* `merchant:fix-discrepancies`: Corrección de diferencias de precio/stock entre Schema.org y feed.
* **Skill Activa:** `catalog-feed-sync` (`.agent/skills/catalog-feed-sync/SKILL.md`).

### 3. Operaciones Financieras
* `billing:health-check`: Verificación de umbrales, tarjetas de respaldo y límites de gasto.
* `ads:scale-safe`: Cálculo de incrementos presupuestarios máximos seguros (<20%).

### 4. Creativos y Documentación Visual
* `creative:generate-script`: Producción de guiones técnicos en matriz de 4 columnas.
* `creative:holo-studio`: Suite Web local Next.js 14 / React 18 / Tailwind CSS (`apps/holo-studio/`, ejecutable vía `bin/holo-studio.sh`) con pipeline desacoplado en 5 pasos:
  - **Paso 0 (Presets & Ángulos):** Biblioteca de configuraciones de producto y ángulos canónicos de respuesta directa.
  - **Paso 1 (Guion & Estrategia):** Generador con Google AI Studio / OpenRouter, 3 Hooks DCT y matriz canónica de 4 columnas (30s).
  - **Paso 2 (Locución & Audio):** Motor neuronal Microsoft Edge TTS con acento rioplatense (Buenos Aires, Tomás & Elena) y control de cadencia publicitaria.
  - **Paso 3 (Storyboard & Imágenes):** Generación de B-Roll 9:16 con ComfyUI local Metal/MPS (DreamShaper 8).
  - **Paso 4 (Ensamblado & Drift):** Renderizado vertical 1080x1920 (30 FPS, H.264/AAC) y exportador multipista desacoplado `.drift` para el editor open-source Drift y sincronización MCP.
* `diagram:mermaid-standard`: Generación homogénea de diagramas en grises suaves (#F8FAFC/#F1F5F9/#E2E8F0), bordes slate y tipografía 100% negra (#0F172A), con escala estricta en cuadrantes (fontSize <= 11px) y ejes temporales.
* **Skill Activa:** `direct-response-ads` (`.agent/skills/direct-response-ads/SKILL.md`).

### 5. Configuración de Entorno y Protocolo MCP (`.agents/mcp_config.json`)
* `comfy-mcp`: Control e inspección de la instancia local de ComfyUI (puerto 8188) vía stdio (`comfy-cli`).
* `comfy-cloud`: Conexión remota a la nube oficial de Comfy (`https://cloud.comfy.org/mcp`) para templates y ejecución GPU.
* `meta-marketing-mcp`: Control de campañas, adsets, creativos y CAPI en Meta Ads.
* `google-ads-mcp`: Mutaciones de Search/PMax y términos de búsqueda.
* `google-merchant-mcp`: Diagnóstico de catálogo, errores y custom_labels.
* `filesystem-mcp`: Acceso y sincronización del árbol de trabajo y `./docs`.
* `browser-automation-mcp`: Auditoría web y validación de marcado y tags vía Puppeteer.
* `fetch-http-mcp`: Llamadas directas Graph API y microservicios server-side.
* `ecommerce-database-mcp`: Extracción directa PostgreSQL de márgenes (COGS) y stock.

