# TECHNICAL ARCHITECTURE & DATA TOPOLOGY

### Pipeline de Medición
1. Frontend: Disparo de evento e-commerce con generación de UUID criptográfico (`window.crypto.randomUUID()`).
2. Capa Web: GTM Web recibe el Data Layer y dispara el Pixel de Meta con `{ eventID: event_id }` y GA4 Tag.
3. Capa Servidor: GTM Server-Side decodifica el evento GA4 y emite un POST HTTPS a Meta CAPI conservando el mismo `event_id`.
4. Deduplicación: Meta Event Manager empareja y unifica ambos eventos mediante `event_id`.

### Topología MCP
* `meta-marketing-mcp` & `google-ads-mcp`: Control programático de campañas y reporting.
* `ecommerce-database-mcp`: Consulta directa de márgenes (COGS) y stock disponible.
* `browser-automation-mcp`: Simulación y validación de triggers y tags en tiempo real.
