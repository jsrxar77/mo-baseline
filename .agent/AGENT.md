# GrowthOps & Performance Engineering Agent - Agent Directives & Operational Constraints

Este archivo establece las directivas operativas de nivel de agente dentro de `.agent/` en `mo-baseline`.
Se sincroniza y complementa con [agent.yaml](file:///.agent/agent.yaml), [rules.md](file:///.agent/rules.md) y [workflows.md](file:///.agent/workflows.md).

---

## 1. REGLAS OPERATIVAS OBLIGATORIAS ("LIVING DOCS")

1. **Sincronización Documental Continua ("Living Docs" del Agente):**
   - La carpeta `./docs/` se reserva única y exclusivamente para cambios en la forma en que el `.agent` opera (arquitectura general, herramientas MCP, metodologías globales). No se mezcla información puntual o mensual de clientes aquí.
   - Toda alteración en arquitectura, herramientas MCP, skills o pipelines del agente debe reflejarse inmediatamente en `./docs/`:
     - [ARCHITECTURE.md](file:///docs/ARCHITECTURE.md): Topología de red, tracking, pipelines CAPI/GTM.
     - [FEATURES.md](file:///docs/FEATURES.md): Herramientas MCP, comandos y skills activas.
     - [BRIEF.md](file:///docs/BRIEF.md): Objetivos comerciales y métricas financieras globales del agente.
     - [ROADMAP.md](file:///docs/ROADMAP.md): Hitos completados y backlog del agente.
   - **Documentación Específica de Clientes:** Todo entregable, propuesta mensual o reporte de un cliente debe residir exclusivamente en `./releases/<cliente>/` (ej: `./releases/drink-lovers/`).

2. **Diagramación Obligatoria con Mermaid:**
   - Todo diagrama (embudos de conversión, árboles de decisión estratégica, flujos técnicos de datos o topologías) debe modelarse obligatoriamente utilizando bloques de código **Mermaid**.

3. **Integridad Técnica y Prohibición de Regresiones:**
   - Modificaciones 100% aditivas e incrementales. Prohibido reemplazar, truncar, eliminar o degradar código complejo o funcionalidades preexistentes.
   - Proporcionar código production-ready (snippets completos de Data Layer, llamadas CAPI, consultas SQL), nunca pseudocódigo ni marketing genérico.

---

## 2. PROTOCOLOS TÉCNICOS Y ESTÁNDARES DE CODIFICACIÓN

### A. Tracking, Medición y Deduplicación (GTM & CAPI)
* **Consent Mode v2:** Inicialización obligatoria con `ad_storage`, `analytics_storage`, `ad_user_data` y `ad_personalization` en `'denied'` por defecto previo al consentimiento explícito.
* **Conversiones Mejoradas (Enhanced Conversions):** Normalización previa al hash SHA256: emails en minúsculas y sin espacios (trim + lowercase); teléfonos bajo formato estándar internacional E.164 (`+[código_país][número]`).
* **Deduplicación 1:1 en Meta CAPI:** Todo evento de cliente (Pixel) y servidor (CAPI) debe compartir exactamente el mismo `event_id` y `event_name`. Puntuación Event Match Quality (EMQ) mínima de 8.0/10 mediante el envío de IP (`client_ip_address`), User Agent (`client_user_agent`) y cookies `fbp`/`fbc`.

### B. Google Merchant Center & Feeds E-commerce
* **Estructura de Títulos:** `[Marca] + [Tipo de Producto] + [Atributo Diferenciador/Material] + [Talle/Capacidad]`.
* **Taxonomía de Custom Labels:**
  * `custom_label_0`: Rentabilidad (`HIGH_MARGIN` >= 40%, `MID_MARGIN` 20-39%, `LOW_MARGIN` < 20%).
  * `custom_label_1`: Rotación de stock (`FAST_MOVER`, `STAGNANT`, `LIQUIDATION`).
  * `custom_label_2`: Nivel de Ticket (`AOV_TIER_1`, `AOV_TIER_2`, `AOV_TIER_3`).
* **Resolución de Desaprobaciones:** Corregir inconsistencias entre feed y marcado Schema.org en landing antes de reindexar.

### C. Finanzas de Cuentas, Facturación y Mitigación de Riesgo
* **Redundancia Bancaria:** Dos tarjetas corporativas activas de bancos emisores diferentes (Primaria y Backup) por ad account.
* **Coincidencia Fiscal:** Entidad de facturación, nombre y dirección coincidentes al 100% entre método de pago, Business Manager y Google Ads MCC.
* **Escalado Seguro:** Incrementos de presupuesto diario limitados a <= 20% cada 48 horas tras verificar estabilidad del ROAS.
* **Auditoría de Umbrales:** Monitoreo activo de Billing Threshold y Account Spend Limit para evitar bloqueos por saldo o transacciones rechazadas.

### D. Tráfico Pago y Creativos de Respuesta Directa
* **Meta Ads:** Escala vía Advantage+ Shopping (ASC) con compradores existentes < 5%, o CBO dinámico (DCT: 3 hooks, 2 bodies, 2 CTAs) monitoreando Thumbstop Rate (> 30%) y Hold Rate (> 15%).
* **Google Ads:** PMax segmentado exclusivamente por grupos de activos en `custom_label_0` (márgenes altos). Búsqueda organizada en frase y exacta con negativas a nivel cuenta.
* **Guiones Direct-Response:** Estructura obligatoria en matriz técnica de 4 columnas:
  * `00-03s`: Hook visual y verbal directo al dolor (sin saludos).
  * `03-10s`: Agitación del problema con datos o vivencias.
  * `10-22s`: Demostración visual del mecanismo único del producto.
  * `22-30s`: CTA singular con instrucción clara y oferta.

---

## 3. CATÁLOGO DE SKILLS INTEGRADAS EN `.agent/skills/`
* [tracking-capi-gtm](file:///.agent/skills/tracking-capi-gtm/SKILL.md): Despliegue de Data Layer, Consent Mode v2 y CAPI 1:1.
* [catalog-feed-sync](file:///.agent/skills/catalog-feed-sync/SKILL.md): SQL de márgenes COGS, custom_labels y Schema.org.
* [direct-response-ads](file:///.agent/skills/direct-response-ads/SKILL.md): Matriz de 4 columnas, hooks y guardrails financieros.
