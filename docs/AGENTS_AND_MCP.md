# Arquitectura de Agente y Protocolo MCP (`.agents`)

Este documento describe la estructura unificada de configuración para el agente de IA en `mo-baseline`, el catálogo de herramientas conectadas mediante el **Model Context Protocol (MCP)** y las directivas de integración con **ComfyUI** (Local y Cloud).

---

## 1. Estructura Unificada en `.agents/`

Toda la configuración, habilidades (*skills*) y reglas operativas han sido centralizadas exclusivamente en el directorio canónico `.agents/`. Se han eliminado por completo las carpetas redundantes `.agent` y `.claude`.


### Árbol de Directorios
```text
.agents/
├── AGENT.md            # Directivas operativas de nivel de agente
├── agent.yaml          # Metadatos del agente
├── mcp_config.json     # Catálogo de servidores MCP registrados
├── rules.md            # Restricciones operativas y estándares de codificación
├── workflows.md        # Definición de flujos y procesos automatizados
└── skills/             # Skills funcionales cargadas en contexto
    ├── catalog-feed-sync/
    ├── direct-response-ads/
    └── tracking-capi-gtm/
```

---

## 2. Servidores MCP Registrados (`.agents/mcp_config.json`)

El archivo [mcp_config.json](file:///.agents/mcp_config.json) expone los siguientes servidores:

### A. Edición y Renderizado de Video (Drift & ComfyUI)
1. **`drift-mcp` (CutWire Drift Editor)**:
   - **Protocolo**: `stdio` (`drift --mcp-stdio`) con token de sesión de Drift.
   - **Capacidades**: Control directo de la línea de tiempo (timeline multipista), importación de media (B-Rolls de ComfyUI, audios de voz en off), colocación y corte de clips, inserción de títulos y subtítulos independientes, efectos y exportación final.
   - **Requisito**: Tener CutWire Drift abierto y habilitar **Settings → Agent access**.
2. **`comfy-mcp` (Local)**:
   - **Protocolo**: `stdio` a través de Python (`uvx comfy-mcp`).
   - **Host / Puerto**: Conexión a la instancia local activa (`127.0.0.1:8188`).
   - **Capacidades**: Inspeccionar nodos disponibles (incluyendo `ComfyUI-Easy-Use`), consultar modelos instalados, validar grafos y ejecutar workflows locales.
   - **Requisito**: Tener el paquete instalado en el entorno (`pip install comfy-mcp comfy-cli`) y ComfyUI ejecutándose.
3. **`comfy-cloud` (Cloud Hosted)**:
   - **Protocolo**: Streamable HTTP hacia `https://cloud.comfy.org/mcp`.
   - **Autenticación**: Header `X-API-Key: ${COMFY_API_KEY}` (generable en [platform.comfy.org/profile/api-keys](https://platform.comfy.org/profile/api-keys)).
   - **Capacidades**: Búsqueda de templates (`search_templates`), consulta de catálogo de modelos y ejecución sin GPU local.

### B. Marketing, Feeds y Medición
4. **`meta-marketing-mcp`**: Gestión de campañas, creativos y eventos CAPI en Meta Ads.
5. **`google-ads-mcp`**: Mutaciones de Search, PMax y términos de búsqueda en Google Ads.
6. **`google-merchant-mcp`**: Diagnóstico de catálogo, errores de feed y custom labels en Google Merchant Center.

### C. Herramientas de Sistema y Datos
7. **`filesystem-mcp`**: Inspección y lectura de archivos en `./` y `./docs`.
8. **`browser-automation-mcp`**: Automatización de navegador y auditoría visual vía Puppeteer.
9. **`fetch-http-mcp`**: Peticiones HTTP directas a APIs externas y microservicios.
10. **`ecommerce-database-mcp`**: Consultas SQL directas a PostgreSQL para cálculo de márgenes (COGS) y rotación.

---

## 3. Guía de Interacción con ComfyUI y Drift

### A. Con ComfyUI (Generación Visual):
- **Inspección de Nodos**:
  > *"¿Qué nodos de Easy-Use o video tengo disponibles en mi instalación de ComfyUI?"*
- **Validación de Workflows**:
  > *"Revisa este workflow JSON para generar B-Roll 9:16 y dime si los nodos de conexión son válidos."*
- **Generación Local**:
  > *"Genera el B-Roll de la escena 1 usando DreamShaper 8 en ComfyUI."*

### B. Con Drift (Edición en la Línea de Tiempo Real):
- **Montaje Multipista**:
  > *"Importa a Drift la pista de audio de voz en off y monta las 4 imágenes de B-Roll en la pista de video."*
- **Subtítulos y Textos**:
  > *"Crea los textos en pantalla de los 3 ganchos en la pista superior sincronizados con el audio."*
- **Exportación**:
  > *"Renderiza la composición 9:16 desde Drift a 1080x1920."*
