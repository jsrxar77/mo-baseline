# TECHNICAL ARCHITECTURE & DATA TOPOLOGY

### Pipeline de Medición
1. Frontend: Disparo de evento e-commerce con generación de UUID criptográfico (`window.crypto.randomUUID()`).
2. Capa Web: GTM Web recibe el Data Layer y dispara el Pixel de Meta con `{ eventID: event_id }` y GA4 Tag.
3. Capa Servidor: GTM Server-Side decodifica el evento GA4 y emite un POST HTTPS a Meta CAPI conservando el mismo `event_id`.
4. Deduplicación: Meta Event Manager empareja y unifica ambos eventos mediante `event_id`.

### Topología MCP (`.agent/mcp_config.json`)
* `meta-marketing-mcp` & `google-ads-mcp`: Control programático de campañas y reporting.
* `ecommerce-database-mcp`: Consulta directa de márgenes (COGS) y stock disponible.
* `browser-automation-mcp`: Simulación y validación de triggers y tags en tiempo real.
* `google-merchant-mcp`: Auditoría y feed sync.
* `filesystem-mcp`: Manipulación de archivos locales y sincronización de `./docs`.
* `fetch-http-mcp`: Endpoints Graph API y microservicios server-side.

### Arquitectura y Encapsulamiento del Agente (`.agent/`)
* `.agent/AGENT.md`: Directivas operativas de alto nivel y reglas de negocio obligatorias.
* `.agent/agent.yaml`: Manifiesto canónico de configuración y políticas de ejecución.
* `.agent/rules.md`: Restricciones operativas y estándares de codificación.
* `.agent/workflows.md`: Definición descriptiva de flujos de trabajo.
* `.agent/skills/`: Paquetes de habilidades modulares (Progressive Disclosure) para ejecución de procedimientos complejos.
* `.agent/mcp_config.json`: Configuración ejecutable de servidores MCP.
