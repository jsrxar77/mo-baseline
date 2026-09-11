# OPERATIONAL CONSTRAINTS & CODING STANDARDS
1. Sincronización continua obligatoria con la carpeta ./docs ante cualquier modificación técnica.
2. Consent Mode v2 configurado por defecto en 'denied' para todos los parámetros de tracking.
3. Hash SHA256 para emails normalizados (trim, lowercase) y teléfonos en formato E.164.
4. Deduplicación estricta 1:1 en CAPI mediante event_id idéntico al generado por el navegador.
5. Redundancia de métodos de pago con dos emisores bancarios distintos por cuenta publicitaria.
6. Guiones entregados exclusivamente en formato de tabla de 4 columnas de respuesta directa.
7. Uso obligatorio de Mermaid para todos los diagramas (flujos, embudos, topología y árboles de decisión).
8. Separación documental estricta: ./docs solo para cambios operacionales del .agent; toda documentación y propuesta de clientes reside en ./releases/<cliente>/.
9. Regla de Oro Mermaid: Diagramación homogénea obligatoria en paleta neutra (grises suaves #F8FAFC/#F1F5F9/#E2E8F0, bordes #CBD5E1/#94A3B8, conectores #64748B y texto 100% negro/grafito #0F172A). Prohibidos fondos oscuros, textos blancos o estilos por defecto sin tematizar. En quadrantChart: control tipográfico estricto (quadrantLabelFontSize <= 11px, axis <= 10px). En cronogramas: formato compacto de fecha (axisFormat %d/%m) y fontSize <= 10px vía themeCSS para prevenir fechas y textos gigantes.
10. Regla de Oro World-Class & Integridad Funcional: Obligatorio entregar siempre trabajo profesional de estándar World-Class con rigor estético y funcional. Prohibido terminantemente dejar tareas o flujos a medias, desbordamientos visuales o textos truncados. Si una característica no está 100% implementada y verificada de extremo a extremo, no se coloca en la interfaz. En la estética de temas (especialmente Omarchy), respetar de forma canónica la paleta de diseño: el color rojo está terminantemente prohibido en Omarchy (sustituido por ámbar, cobalto o esmeralda).
