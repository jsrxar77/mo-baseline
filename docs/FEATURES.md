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
* `diagram:mermaid-standard`: Generación homogénea de diagramas en grises suaves (#F8FAFC/#F1F5F9/#E2E8F0), bordes slate y tipografía 100% negra (#0F172A), con escala estricta en cuadrantes (fontSize <= 11px) y ejes temporales.
* **Skill Activa:** `direct-response-ads` (`.agent/skills/direct-response-ads/SKILL.md`).

### 5. Configuración de Entorno y Protocolo MCP (`.agent/mcp_config.json`)
* `meta-marketing-mcp`: Control de campañas, adsets, creativos y CAPI en Meta Ads.
* `google-ads-mcp`: Mutaciones de Search/PMax y términos de búsqueda.
* `google-merchant-mcp`: Diagnóstico de catálogo, errores y custom_labels.
* `filesystem-mcp`: Acceso y sincronización del árbol de trabajo y `./docs`.
* `browser-automation-mcp`: Auditoría web y validación de marcado y tags vía Puppeteer.
* `fetch-http-mcp`: Llamadas directas Graph API y microservicios server-side.
* `ecommerce-database-mcp`: Extracción directa PostgreSQL de márgenes (COGS) y stock.
