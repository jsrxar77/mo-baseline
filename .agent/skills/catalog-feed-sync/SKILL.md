---
name: catalog-feed-sync
description: >-
  Sincronización, segmentación y diagnóstico de feeds en Google Merchant Center. Calcula márgenes de producto (COGS) y rotación de stock vía SQL para asignar custom_labels 0, 1 y 2, audita desaprobaciones y alinea discrepancias de Schema.org/Product. Usar cuando el usuario pida gestionar feeds, Merchant Center, custom labels o segmentar campañas de shopping/PMax por margen.
---

# Skill: Sincronización y Diagnóstico de Feeds en Google Merchant Center

Esta skill cubre la categorización programática de productos mediante `custom_labels`, optimización de títulos de catálogo y auditoría de discrepancias entre landing y feed.

## 1. Taxonomía de Custom Labels

La segmentación para campañas de Google Ads Shopping y Performance Max sigue una taxonomía estricta basada en rentabilidad, rotación y ticket:

| Custom Label | Clave | Criterio / Regla de Negocio | Valores Válidos |
| :--- | :--- | :--- | :--- |
| `custom_label_0` | Margen Bruto (Rentabilidad) | `(Precio - COGS) / Precio` | `HIGH_MARGIN` (>= 40%), `MID_MARGIN` (20-39%), `LOW_MARGIN` (< 20%) |
| `custom_label_1` | Rotación de Inventario | Días de stock o ventas en últimos 30 días | `FAST_MOVER` (alta venta), `STAGNANT` (sin ventas > 45d), `LIQUIDATION` (stock sobrante) |
| `custom_label_2` | Nivel de Ticket (AOV Tier) | Precio unitario del producto | `AOV_TIER_1` (< $50), `AOV_TIER_2` ($50 - $150), `AOV_TIER_3` (> $150) |

## 2. Consulta SQL de Extracción de Márgenes y Categorización

Usar contra la base de datos e-commerce (PostgreSQL vía `ecommerce-database-mcp`):

```sql
WITH product_metrics AS (
  SELECT
    p.id AS product_id,
    p.sku,
    p.title,
    p.brand,
    p.price,
    p.cost_of_goods AS cogs,
    ROUND(((p.price - p.cost_of_goods) / NULLIF(p.price, 0)) * 100, 2) AS margin_pct,
    p.inventory_quantity,
    COALESCE(SUM(oi.quantity), 0) AS units_sold_last_30d
  FROM products p
  LEFT JOIN order_items oi ON p.id = oi.product_id AND oi.created_at >= NOW() - INTERVAL '30 days'
  WHERE p.is_active = TRUE
  GROUP BY p.id, p.sku, p.title, p.brand, p.price, p.cost_of_goods, p.inventory_quantity
)
SELECT
  product_id,
  sku,
  title,
  price,
  margin_pct,
  -- custom_label_0: Margen
  CASE
    WHEN margin_pct >= 40 THEN 'HIGH_MARGIN'
    WHEN margin_pct >= 20 THEN 'MID_MARGIN'
    ELSE 'LOW_MARGIN'
  END AS custom_label_0,
  -- custom_label_1: Rotación
  CASE
    WHEN units_sold_last_30d >= 30 THEN 'FAST_MOVER'
    WHEN inventory_quantity > 50 AND units_sold_last_30d = 0 THEN 'LIQUIDATION'
    ELSE 'STAGNANT'
  END AS custom_label_1,
  -- custom_label_2: Ticket
  CASE
    WHEN price < 50 THEN 'AOV_TIER_1'
    WHEN price <= 150 THEN 'AOV_TIER_2'
    ELSE 'AOV_TIER_3'
  END AS custom_label_2
FROM product_metrics;
```

## 3. Estándar de Optimización de Títulos

Google Shopping indexa fuertemente las primeras 70 palabras de cada título. Aplicar obligatoriamente la fórmula:

$$\text{[Marca]} + \text{[Tipo de Producto]} + \text{[Atributo Diferenciador / Material]} + \text{[Talle / Capacidad / Color]}$$

* **Incorrecto:** `Zapatillas Urbanas Nuevas Oferta`
* **Correcto:** `Nike Zapatillas Running Air Pegasus 40 Amortiguación React Talle 42 Negro`

## 4. Resolución de Discrepancias (Feed vs Schema.org)

Antes de forzar la reindexación en Merchant Center:
1. Auditar con `browser-automation-mcp` el bloque `itemscope itemtype="https://schema.org/Product"` o el JSON-LD en la landing del producto.
2. Comprobar que:
   - `offers.price` coincida exactamente con el precio final en el feed (incluyendo impuestos y moneda).
   - `offers.availability` (`InStock` vs `OutOfStock`) esté alineado con el valor de stock.
3. Registrar cualquier actualización de esquema en [FEATURES.md](file:///docs/FEATURES.md).
