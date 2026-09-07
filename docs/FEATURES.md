# ACTIVE CAPABILITIES & TOOL MATRIX

### 1. Medición y Datos
* `track:audit-events`: Simulación de compra vía Puppeteer y validación de `event_id`.
* `track:setup-consent`: Inyección de plantilla Consent Mode v2 por defecto en `denied`.
* `track:sha256-hash`: Normalización y hasheo de credenciales de usuario (email y teléfono E.164).

### 2. Feeds y Catálogos
* `merchant:sync-labels`: Cruce de base de datos con Google Merchant Center para custom_labels.
* `merchant:fix-discrepancies`: Corrección de diferencias de precio/stock entre Schema.org y feed.

### 3. Operaciones Financieras
* `billing:health-check`: Verificación de umbrales, tarjetas de respaldo y límites de gasto.
* `ads:scale-safe`: Cálculo de incrementos presupuestarios máximos seguros (<20%).

### 4. Creativos
* `creative:generate-script`: Producción de guiones técnicos en matriz de 4 columnas.
