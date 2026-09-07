---
name: tracking-capi-gtm
description: >-
  Auditoría e implementación de tracking e-commerce, Data Layer GA4, deduplicación 1:1 de Meta Conversions API (CAPI) mediante event_id idéntico, Consent Mode v2 por defecto en denied y normalización SHA256 de Enhanced Conversions. Usar cuando el usuario pida auditar, corregir o desplegar eventos de pixel, CAPI, GTM o dataLayer.
---

# Skill: Despliegue de Tracking con Deduplicación 1:1 y Consent Mode v2

Esta skill detalla la implementación técnica y validación del pipeline de medición e-commerce en frontend, GTM Web y GTM Server-Side.

## 1. Consent Mode v2 (Inicialización Obligatoria)

Todo contenedor GTM o script frontend debe cargar el siguiente snippet previo a la llamada de `gtag('config', ...)` o inyección del contenedor GTM:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Estado por defecto: denegado para todas las directivas de consentimiento
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });

  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
</script>
```

## 2. Generación de `event_id` y Emisión de Data Layer (Purchase de Ejemplo)

Para garantizar la deduplicación 1:1 en Meta CAPI y GA4, el frontend debe generar un identificador criptográfico único por evento transaccional:

```javascript
// Generación de identificador único compartido entre Browser y Servidor
const eventId = window.crypto.randomUUID();

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ ecommerce: null }); // Limpiar ecommerce previo
window.dataLayer.push({
  event: 'purchase',
  event_id: eventId,
  ecommerce: {
    transaction_id: order.id,
    value: order.total_amount,
    tax: order.tax_amount,
    shipping: order.shipping_amount,
    currency: 'USD',
    items: order.line_items.map((item, index) => ({
      item_id: item.sku,
      item_name: item.title,
      index: index + 1,
      item_brand: item.vendor,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity
    }))
  },
  user_data: {
    // Datos normalizados previos al hasheo
    email_sha256: hashSha256(order.customer.email.trim().toLowerCase()),
    phone_sha256: hashSha256(normalizePhoneE164(order.customer.phone)),
    first_name_sha256: hashSha256(order.customer.first_name.trim().toLowerCase()),
    last_name_sha256: hashSha256(order.customer.last_name.trim().toLowerCase())
  }
});

// Helper de hashing SHA256 nativo Web Crypto API
async function hashSha256(text) {
  if (!text) return null;
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper normalizador E.164
function normalizePhoneE164(rawPhone) {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
}
```

## 3. Disparo de Meta Pixel (Browser) con Deduplicación

En GTM Web o script de cliente, pasar el `eventID` a la llamada de `fbq`:

```javascript
fbq('track', 'Purchase', {
  value: order.total_amount,
  currency: 'USD',
  content_type: 'product',
  contents: order.line_items.map(item => ({ id: item.sku, quantity: item.quantity }))
}, { eventID: eventId });
```

## 4. Disparo de Meta CAPI (Server-Side)

GTM Server-Side o microservicio backend emite el POST HTTPS a la Graph API de Meta manteniendo el mismo `event_id`:

```http
POST /v20.0/{PIXEL_ID}/events?access_token={META_ACCESS_TOKEN} HTTP/1.1
Host: graph.facebook.com
Content-Type: application/json

{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1725732000,
      "event_id": "<MISMO_EVENT_ID_QUE_BROWSER>",
      "action_source": "website",
      "event_source_url": "https://tienda.com/checkout/order-received",
      "user_data": {
        "em": ["<EMAIL_HASH_SHA256>"],
        "ph": ["<PHONE_HASH_SHA256_E164>"],
        "client_ip_address": "181.44.12.98",
        "client_user_agent": "Mozilla/5.0 ...",
        "fbp": "fb.1.1725731999.123456789",
        "fbc": "fb.1.1725731999.AbCdEfGhIjKlMnOpQrSt"
      },
      "custom_data": {
        "currency": "USD",
        "value": 149.99,
        "order_id": "ORD-12345"
      }
    }
  ]
}
```

## 5. Procedimiento de Verificación y Auditoría
1. **Emulación con Puppeteer / Tag Assistant:**
   - Ejecutar navegación de prueba simulando el checkout.
   - Inspeccionar la red con DevTools para verificar que la llamada `facebook.com/tr/` contenga el parámetro `eid` idéntico al payload enviado por el contenedor server-side.
2. **Auditoría de Event Match Quality (EMQ):**
   - Validar que el payload de CAPI incluya obligatoriamente `client_ip_address`, `client_user_agent`, `fbp` y `fbc` para garantizar un puntaje EMQ >= 8.0/10 en Meta Events Manager.
3. **Registro Documental:**
   - Registrar cualquier adición de parámetros o endpoints en [ARCHITECTURE.md](file:///docs/ARCHITECTURE.md).
