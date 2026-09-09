# ESTRATEGIA Y PLAN DE MEDIOS: MES 1 - DRINK LOVERS
**Objetivo:** Activación de tracción comercial inicial, adquisición y rentabilidad e-commerce (ROAS/POAS) sobre catálogo sincronizado (265 SKUs en stock).

---

## 1. META ADS (60-70% Presupuesto)
Motor de prospección visual, descubrimiento y retargeting dinámico.

### A. Campañas de Catálogo Dinámico (Advantage+ Catalog Ads - DPA)
* **Retargeting 0-14 días (Bottom of Funnel):**
  * Impacto automático a usuarios que hicieron `ViewContent` o `AddToCart` en Tiendanube y no compraron.
  * Muestra exactamente la botella vista + productos complementarios (carrusel nativo con precio y stock en tiempo real).
* **Prospección Dinámica Broad (Top of Funnel):**
  * Meta entrega automáticamente las referencias con mayor probabilidad de compra según comportamiento del usuario.
  * **Segmentación por Conjuntos (Sets ya creados):**
    * `Whiskies Orientales`: Campaña enfocada a amantes del destilado japonés y etiquetas de nicho.
    * `Whisky Macallan`: Campaña de alta gama / coleccionistas.
    * `Vinos El Enemigo`: Tracción de alta rotación en vinos de autor reconocidos.
    * `Drink Lovers - En Stock`: Exclusión absoluta de productos sin stock (cero presupuesto desperdiciado).

### B. Campañas de Creativos Direct-Response (Advantage+ Shopping Campaign - ASC)
* **Formatos:** Reels, TikTok/Stories y Feed estático con ganchos visuales (desempaque, botellas exclusivas, combos y maridajes).
* **Ofertas Gancho:** Descuento primera compra, envíos rápidos en CABA/GBA, cuotas o promociones por caja/pack cerrado.

---

## 2. GOOGLE ADS (30-40% Presupuesto)
Captura de demanda activa y con alta intención de compra inmediata.

### A. Google Performance Max (PMax) con Google Merchant Center
* **Estructura por Margen y Categoría (Listing Groups):**
  * Segmentación del feed usando los mismos filtros de disponibilidad (`In stock`) y margen de ganancia.
  * Presencia simultánea en: Google Shopping, Búsqueda, YouTube, Gmail y Red de Display.
  * Foco en SKUs con mayor ticket y volumen de búsqueda (ej. Macallan 12/15/18, Hibiki, El Enemigo Malbec/Cabernet Franc).

### B. Google Search (Búsqueda de Alta Intención)
* **Campañas de Marca y Nicho Específico (Concordancia de Frase y Exacta):**
  * Grupo 1: *"Comprar Macallan 12 / 18 Argentina"*, *"Macallan precio envío"*.
  * Grupo 2: *"Whisky japonés comprar"*, *"Suntory Hibiki Argentina"*.
  * Grupo 3: *"Vino El Enemigo caja"*, *"Gran Enemigo Gualtallary"*.
* **Extensiones de Anuncio Activas:** Enlaces a sitio por categoría, precios destacados, promociones y envío express.

---

## 3. HOJA DE RUTA DE IMPLEMENTACIÓN RÁPIDA: MES 1

| Fase | Canal | Acción Concreta | Impacto Esperado |
| :--- | :--- | :--- | :--- |
| **Fase 1 (Semana 1)** | Meta Ads | Lanzar **DPA Retargeting** + **DPA Prospección** con conjunto `Drink Lovers - En Stock`. | Recuperar carritos abandonados y activar primeras ventas dinámicas. |
| **Fase 2 (Semana 2)** | Meta & Google | Pauta segmentada para **Whiskies Orientales** y **Macallan** (Search exacto + Carrusel DPA). | Incrementar el Ticket Promedio (AOV). |
| **Fase 3 (Semana 3-4)** | Google Ads | Configurar Google Merchant Center + **Performance Max** con los 265 SKUs activos. | Dominar el bloque visual de Google Shopping en Argentina. |

---

## 4. GUARDRAILS TÉCNICOS & CONTROL
1. **Filtro Permanente de Stock:** Toda campaña corre sobre conjuntos que excluyan `Out of stock`.
2. **CAPI & Tracking:** Mantener deduplicación 1:1 de Meta Conversions API y Pixel mediante `event_id` idéntico.
3. **Control ROAS:** ROAS objetivo mínimo para escalar = `1 / Margen Bruto`.
