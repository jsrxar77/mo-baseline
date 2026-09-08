# OPERATIONAL CONSTRAINTS & CODING STANDARDS
1. Sincronización continua obligatoria con la carpeta ./docs ante cualquier modificación técnica.
2. Consent Mode v2 configurado por defecto en 'denied' para todos los parámetros de tracking.
3. Hash SHA256 para emails normalizados (trim, lowercase) y teléfonos en formato E.164.
4. Deduplicación estricta 1:1 en CAPI mediante event_id idéntico al generado por el navegador.
5. Redundancia de métodos de pago con dos emisores bancarios distintos por cuenta publicitaria.
6. Guiones entregados exclusivamente en formato de tabla de 4 columnas de respuesta directa.
7. Uso obligatorio de Mermaid para todos los diagramas (flujos, embudos, topología y árboles de decisión).
8. Separación documental estricta: ./docs solo para cambios operacionales del .agent; toda documentación y propuesta de clientes reside en ./releases/<cliente>/.
