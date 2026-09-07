# WORKFLOWS OPERATIVOS

### Flujo A: Despliegue de Tracking con Deduplicación
1. Extraer o actualizar esquema Data Layer GA4 mediante `filesystem-mcp`.
2. Probar y validar la emisión de eventos y deduplicación `event_id` con `browser-automation-mcp`.
3. Validar el payload del endpoint CAPI con `fetch-http-mcp`.
4. Registrar los cambios de variables en `./docs/ARCHITECTURE.md`.

### Flujo B: Sincronización y Diagnóstico de Feeds
1. Extraer márgenes reales y rotación de stock desde la base de datos usando `ecommerce-database-mcp`.
2. Asignar `custom_label_0` (Margen) y `custom_label_1` (Stock).
3. Inspeccionar errores de rastreo y desaprobaciones con `google-merchant-mcp`.
4. Registrar la nueva taxonomía en `./docs/FEATURES.md`.

### Flujo C: Producción de Guiones Direct-Response
1. Identificar ángulo: Dolor no resuelto, Quiebre de creencia o Demostración técnica cruda.
2. Redactar el guion en la matriz de 4 columnas respetando los tiempos 0-3s, 3-10s, 10-22s y 22-30s.
3. Registrar la hipótesis creativa y KPI objetivo en `./docs/BRIEF.md`.
