# ROADMAP & BACKLOG

### Fase 1: Infraestructura de Tracking y Customización (Completada)
- [x] Implementación de Data Layer GA4 para flujo e-commerce completo.
- [x] Configuración de deduplicación 1:1 Meta CAPI vía `event_id`.
- [x] Despliegue de Consent Mode v2.
- [x] Encapsulamiento del espacio de trabajo en `.agent/` con directivas operativas `AGENT.md`, skills nativas y `mcp_config.json`.

### Fase 2: Automatización de Catálogos (En Progreso)
- [x] Integración de `ecommerce-database-mcp` para consulta de costos y márgenes.
- [ ] Script de automatización de custom_labels en Google Merchant Center.
- [ ] Monitoreo automatizado de desaprobaciones de productos.

### Fase 3: Escala de Pauta y Contenido (En Progreso)
- [x] Suite Web local (Creative Studio en `tools/creative-studio/`) para guiones DCT con Google AI y renderizado vertical 9:16 sin costos de suscripción.
- [ ] Reglas automáticas para pausar creativos con Thumbstop Rate < 25%.
- [ ] Segmentación de Google Ads PMax exclusiva para productos `HIGH_MARGIN`.
- [ ] Generación masiva de guiones por arquetipo (UGC, Problema-Solución, Quiebre de Mito).
