// ============================================================
// HOLO STUDIO — Sistema de Presets y Ángulos (Readonly)
// Estos datos son del sistema y NO se pueden eliminar.
// Los presets y ángulos del usuario se persisten en src/data/
// ============================================================

export interface Preset {
  id: string;
  label: string;
  category: "bebidas" | "comidas" | "custom";
  isReadonly: boolean;
  product_name: string;
  product_description: string;
  target_audience: string;
  main_problem: string;
  unique_mechanism: string;
  offer_or_cta: string;
}

export interface Angle {
  id: string;
  label: string;
  description: string;
  badge_color: "amber" | "cobalt" | "emerald";
  group: "clasicos" | "emocionales" | "racionales" | "nativos" | "comportamentales" | "custom";
  isReadonly: boolean;
}

// ─────────────────────────────────────────────────────────────
// 10 PRESETS — TIENDA DE BEBIDAS (poke.com.ar · drinklovers.com.ar)
// ─────────────────────────────────────────────────────────────
export const SYSTEM_PRESETS_BEBIDAS: Preset[] = [
  {
    id: "poke-catena-zapata-malbec",
    label: "🍷 Catena Zapata Adrianna Malbec",
    category: "bebidas",
    isReadonly: true,
    product_name: "Catena Zapata Adrianna Vineyard Malbec",
    product_description:
      "Malbec de alta gama de Catena Zapata proveniente del viñedo Adrianna en Gualtallary (1.500 msnm), Mendoza. Cosecha limitada, envejecido 18 meses en barricas francesas de primer uso. Notas de fruta negra, violetas, grafito y chocolate. Botella 750ml con certificado de bodega.",
    target_audience:
      "Enófilos y coleccionistas de 35 a 60 años que buscan vinos de autor argentinos de clase mundial para consumo propio o regalo de alto impacto.",
    main_problem:
      "Encontrar una etiqueta de Catena Zapata del viñedo Adrianna en Argentina sin esperar a que se agote en bodega o pagar sobreprecio en restaurante.",
    unique_mechanism:
      "Acceso directo a etiquetas seleccionadas de Catena Zapata con trazabilidad de cosecha y número de botella, disponibles para entrega en 24–48h en Buenos Aires.",
    offer_or_cta: "Últimas 12 botellas de la cosecha. Envío con caja isotérmica incluida. 3 y 6 cuotas sin interés.",
  },
  {
    id: "poke-salentein-single-vineyard",
    label: "🍇 Salentein Single Vineyard Pinot Noir",
    category: "bebidas",
    isReadonly: true,
    product_name: "Salentein Single Vineyard Pinot Noir Valle de Uco",
    product_description:
      "Pinot Noir de parcela única del Valle de Uco (Mendoza), elaborado en bodega winery arquitectónica de Salentein. Fermentación en piletas de hormigón, 12 meses en roble francés. Elegante, de alta acidez y final largo. Botella 750ml.",
    target_audience:
      "Amantes del vino de 30 a 55 años que conocen el Pinot Noir borgonés y quieren descubrir la expresión argentina del varietal sin pagar precio importado.",
    main_problem:
      "Los Pinot Noir de calidad son difíciles de encontrar fuera de los grandes restaurantes y las pocas tiendas especializadas que los tienen cobran 40–60% más.",
    unique_mechanism:
      "Acceso a la producción limitada de Salentein Single Vineyard antes de que llegue a la carta de los restaurantes, al precio de tienda especializada.",
    offer_or_cta: "Stock limitado a 8 botellas. 3 cuotas sin interés con todas las tarjetas. Envío a todo el país.",
  },
  {
    id: "poke-whisky-single-malt-escoces",
    label: "🥃 Whisky Single Malt Escocés 12 años",
    category: "bebidas",
    isReadonly: true,
    product_name: "Whisky Single Malt Escocés 12 Años (750ml)",
    product_description:
      "Single malt de destilería escocesa tradicional, 12 años en barrica de roble americano ex-bourbon. Notas de miel, vainilla, turba suave y peras maduras. 43% ABV. Presenta en estuche de cartón premium. Disponible en Glenfiddich, Glenlivet, Macallan según stock.",
    target_audience:
      "Hombres y mujeres de 30 a 55 años con experiencia en destilados que quieren incorporar un Single Malt clásico a su bar personal o regalarlo con categoría.",
    main_problem:
      "Los whiskies Single Malt importados son difíciles de conseguir en Argentina a precio razonable: los supermercados tienen poco surtido y las whiskerías cobran el doble.",
    unique_mechanism:
      "Selección rotativa de Single Malts escoceses importados con precio fijo, cuotas sin interés y envío a todo el país desde una tienda especializada con trazabilidad de lote.",
    offer_or_cta: "Comprá con 6 cuotas sin interés. Envío gratis en CABA y GBA. Consulta stock actualizado hoy.",
  },
  {
    id: "drinklovers-pack-gin-tonic-premium",
    label: "🌿 Pack Gin & Tonic Premium x3",
    category: "bebidas",
    isReadonly: true,
    product_name: "Pack Gin & Tonic Premium — 3 Botellas Seleccionadas",
    product_description:
      "Selección de 3 gins premium para armar Gin & Tonics de nivel: 1 gin botánico español (Hendrick's o Monkey 47), 1 gin local premiado y 1 tónica artesanal x4 en lata. Con tarjeta de combinaciones recomendadas y garnish guide ilustrada.",
    target_audience:
      "Personas de 25 a 45 años que toman gin los fines de semana y quieren elevar la experiencia en casa sin ir a un bar de cocktails a pagar 4x el precio.",
    main_problem:
      "No saben qué gin elegir de los cientos disponibles ni qué tónica marida mejor, y terminan comprando el de siempre en el super sin explorar el universo del gin.",
    unique_mechanism:
      "Curaduría de un sommelier especializado en destilados con las 3 combinaciones gin-tónica que más impactan en boca, listas para servir en casa esa misma noche.",
    offer_or_cta: "Pack curado por sommelier con guía incluida. 3 cuotas sin interés. Envío en 24h en CABA.",
  },
  {
    id: "drinklovers-bourbon-coleccion",
    label: "🪵 Colección Bourbon Americano x2",
    category: "bebidas",
    isReadonly: true,
    product_name: "Dúo Bourbon Americano — Kentucky Small Batch",
    product_description:
      "Pack de 2 botellas de bourbon de pequeña destilería de Kentucky: 1 bourbon wheated (suave, notas de miel y caramelo) + 1 rye-forward (picante, especiado, más seco). Ambos de 750ml entre 43 y 50% ABV. Con guía de degustación comparada.",
    target_audience:
      "Amantes del whisky americano de 28 a 50 años que conocen el Jack Daniel's y el Jim Beam pero quieren explorar el mundo del bourbon artesanal de destilería pequeña.",
    main_problem:
      "Los bourbons de small batch no se consiguen en las licorerías de barrio y en los grandes hipermercados el surtido no pasa de las marcas mainstream.",
    unique_mechanism:
      "Selección directa de importador con botellas de stock exclusivo que no están en la distribución masiva argentina, a precio de tienda especializada.",
    offer_or_cta: "Pack dúo con guía de degustación. 6 cuotas sin interés. Envío refrigerado a todo el país.",
  },
  {
    id: "poke-espumante-chandon-baron-b",
    label: "🥂 Espumante Chandon Baron B Extra Brut",
    category: "bebidas",
    isReadonly: true,
    product_name: "Chandon Baron B Extra Brut — Método Tradicional",
    product_description:
      "Espumante premium argentino de Bodega Chandon por método tradicional champenoise. Blend de Chardonnay, Pinot Noir y Pinot Meunier, 36 meses sobre borras. Extra Brut, burbujas finas y persistentes, notas de brioche, cítricos y almendras tostadas. Botella 750ml.",
    target_audience:
      "Personas de 30 a 55 años que buscan un espumante de método tradicional para celebrar sin pagar precio de champagne francés pero con la misma elegancia en copa.",
    main_problem:
      "El Moët & Chandon o el Veuve Clicquot se pasan de precio para el día a día, y los espumantes baratos del super tienen burbujas gruesas y acidez agresiva.",
    unique_mechanism:
      "Baron B usa el mismo método Champenoise que los grandes champagnes franceses pero a precio argentino, con 36 meses de guarda en cueva que ningún espumante masivo tiene.",
    offer_or_cta: "Disponible en caja de 6 botellas con 12% de descuento. Envío en caja isotérmica. Comprá antes que se agote.",
  },
  {
    id: "drinklovers-aperitivo-kit",
    label: "🍊 Kit Aperitivo Italiano — Spritz en Casa",
    category: "bebidas",
    isReadonly: true,
    product_name: "Kit Aperitivo Italiano Spritz — Aperol + Prosecco + Soda",
    product_description:
      "Kit completo para preparar el Aperol Spritz perfecto en casa: 1 botella Aperol 750ml, 1 Prosecco DOC Italiano 750ml, 4 sodas artesanales, receta oficial de la proporción 3-2-1 y 2 copas Spritz de vidrio. Todo en caja de regalo.",
    target_audience:
      "Personas de 25 a 45 años que disfrutaron el Aperol Spritz en un bar o en Italia y quieren replicarlo en casa para reuniones informales sin la incertidumbre de las proporciones.",
    main_problem:
      "No saben las proporciones exactas del Spritz, el Prosecco que compran no es el correcto o la soda arruina la burbuja, y el resultado no tiene nada que ver con lo que tomaron en el bar.",
    unique_mechanism:
      "Kit curado con los ingredientes exactos (Aperol original + Prosecco DOC, no espumante nacional) y las proporciones 3-2-1 que usa la receta oficial italiana, con todo en una sola compra.",
    offer_or_cta: "Kit completo con copas incluidas. 3 cuotas sin interés. Envío en caja regalo lista para llevar.",
  },
  {
    id: "poke-rutini-coleccion-vinos",
    label: "🍷 Rutini Wines — Colección Gualtallary",
    category: "bebidas",
    isReadonly: true,
    product_name: "Rutini Wines Colección Gualtallary — Malbec + Cabernet Franc",
    product_description:
      "Dúo de Rutini Wines de la línea Colección, terroir Gualtallary a 1.450 msnm: 1 Malbec y 1 Cabernet Franc. Envejecidos 14 meses en roble francés, producción limitada de 3.000 cajas anuales por varietal. Notas de fruta madura, tabaco y flores silvestres.",
    target_audience:
      "Amantes del vino de 35 a 60 años que conocen la bodega Rutini y quieren acceder a la línea Colección que normalmente se vende solo en restaurantes premium y exportación.",
    main_problem:
      "La línea Colección de Rutini casi no se consigue en licorerías normales y cuando aparece en carta de restaurant cuesta el triple del precio de bodega.",
    unique_mechanism:
      "Acceso a la línea Colección de Rutini Wines con stock directo de tienda especializada, al precio de bodega, sin recargo de restaurant ni espera de importación.",
    offer_or_cta: "Pack dúo (Malbec + Cab Franc). Stock de 20 unidades. 6 cuotas sin interés. Envío en 48h.",
  },
  {
    id: "drinklovers-tequila-reposado-importado",
    label: "🌵 Tequila Reposado 100% Agave — Importado",
    category: "bebidas",
    isReadonly: true,
    product_name: "Tequila Reposado 100% Agave Azul — Importado de Jalisco",
    product_description:
      "Tequila reposado 100% agave azul de Jalisco, México. Destilado en alambique de cobre, reposado 8 meses en barrica de roble americano ex-bourbon. Notas de caramelo, vainilla, agave dulce y madera. 40% ABV, 750ml. Incluye sal de gusano y receta del Margarita perfecto.",
    target_audience:
      "Personas de 25 a 45 años que quieren pasar del tequila mixto de fiesta al tequila 100% agave real y tomarlo solo o en cocktails de nivel.",
    main_problem:
      "La mayoría de los tequilas que se consiguen en Argentina son mixtos (solo 51% agave), saben a alcohol industrial y nadie les explica la diferencia real.",
    unique_mechanism:
      "Tequila 100% agave azul certificado por el CRT (Consejo Regulador del Tequila) con etiqueta de lote y número de alambique, importado directamente de Jalisco.",
    offer_or_cta: "Incluye sal de gusano + receta Margarita. 3 cuotas sin interés. Envío a todo el país en 72h.",
  },
  {
    id: "drinklovers-ron-premium-cubano",
    label: "🍬 Ron Premium Añejo — Edición Especial",
    category: "bebidas",
    isReadonly: true,
    product_name: "Ron Añejo Premium — Edición Especial 15 Años",
    product_description:
      "Ron añejo de 15 años de guarda en barrica de roble blanco americano, de destilería premium caribeña. Notas de frutos secos, dátiles, caramelo tostado, tabaco suave y chocolate amargo. 40% ABV, 700ml. Presentación estuche de madera grabado. Ideal para sipping.",
    target_audience:
      "Aficionados a los destilados de 35 a 60 años que quieren explorar el ron de autor como alternativa de sipping al whisky, o regalarlo en una ocasión especial.",
    main_problem:
      "El ron en Argentina está asociado al Cuba Libre y al Bacardí; los rones premium de añejamiento largo son desconocidos, difíciles de conseguir y se subestima su complejidad.",
    unique_mechanism:
      "Selección de ron premium añejo de 15 años con estuche de madera incluido, al mismo nivel de regalo que un Single Malt pero con un perfil de sabor completamente diferente.",
    offer_or_cta: "Estuche de madera grabado incluido. Stock de 6 unidades. 6 cuotas sin interés. Envío en 48h.",
  },
];

// ─────────────────────────────────────────────────────────────
// 10 PRESETS — TIENDA DE COMIDAS / SNACKS
// ─────────────────────────────────────────────────────────────
export const SYSTEM_PRESETS_COMIDAS: Preset[] = [
  {
    id: "snack-box-saludable-mensual",
    label: "📦 Snack Box Saludable Mensual",
    category: "comidas",
    isReadonly: true,
    product_name: "Snack Box Saludable Curada",
    product_description:
      "Caja mensual curada con 12 a 15 snacks saludables sin TACC, sin azúcar refinada y sin conservantes artificiales. Incluye barras, crackers, nuts, chocolates raw y dips. Selección nueva cada mes.",
    target_audience:
      "Adultos de 25 a 45 años con hábitos saludables o intolerancias alimentarias que quieren snacks ricos y convenientes sin ir al supermercado.",
    main_problem:
      "En el kiosco o supermercado no hay opciones realmente saludables. Todo tiene azúcar, gluten o conservantes que los inflan y los dejan con culpa.",
    unique_mechanism:
      "Curaduría mensual por nutricionista de productos artesanales de pequeños productores, con perfil nutricional verificado en cada caja.",
    offer_or_cta: "Primera caja con 20% OFF. Suscripción mensual con cancelación cuando quieras.",
  },
  {
    id: "granola-artesanal-sin-azucar",
    label: "🌾 Granola Artesanal Sin Azúcar",
    category: "comidas",
    isReadonly: true,
    product_name: "Granola Artesanal Sin Azúcar Añadida",
    product_description:
      "Granola horneada artesanalmente con avena arrollada, semillas de chía, lino, girasol, castañas de cajú y coco rallado. Sin azúcar añadida, sin aceite de palma, sin gluten (certificada). Bolsa de 400g.",
    target_audience:
      "Personas de 28 a 50 años que desayunan granola pero quieren una opción real sin los azúcares ocultos de las marcas de supermercado.",
    main_problem:
      "La granola del supermercado tiene hasta 28g de azúcar por porción, más que una galletita, aunque viene en packaging de 'vida sana'.",
    unique_mechanism:
      "Endulzada solo con dátil deshidratado triturado, el índice glucémico es 3 veces más bajo que la granola estándar y sacia el doble.",
    offer_or_cta: "Bolsa 400g + recetario de 10 bowls saludables gratis. 2 bolsas con 15% OFF.",
  },
  {
    id: "aceite-oliva-virgen-extra",
    label: "🫒 Aceite de Oliva Virgen Extra",
    category: "comidas",
    isReadonly: true,
    product_name: "AOVE Primera Extracción en Frío",
    product_description:
      "Aceite de oliva virgen extra de primera extracción en frío, acidez menor a 0.2%, cosecha de abril. Variedad arbequina de productor familiar en Mendoza. Botella oscura 500ml con contra-etiqueta de análisis de laboratorio.",
    target_audience:
      "Cocineros apasionados y familias de 30 a 60 años que usan aceite de oliva a diario y quieren saber que están comprando algo real y honesto.",
    main_problem:
      "El 80% de los aceites de oliva del supermercado están adulterados con aceite de girasol o soja y ni siquiera lo aclaran en el etiquetado.",
    unique_mechanism:
      "Cada botella tiene el número de lote, la fecha de cosecha y el análisis de laboratorio visible: acidez, polifenoles y pureza verificable.",
    offer_or_cta: "2 botellas 500ml con envío gratis. Análisis de laboratorio incluido en cada una.",
  },
  {
    id: "salsa-bbq-artesanal-ahumada",
    label: "🍖 Salsa BBQ Artesanal Ahumada",
    category: "comidas",
    isReadonly: true,
    product_name: "Salsa BBQ Artesanal Ahumada en Frío",
    product_description:
      "Salsa BBQ elaborada artesanalmente con tomates asados, pimiento rojo, cebolla caramelizada y ahumado real en frío con leña de manzano. Sin conservantes, sin colorantes, sin HFCS. Frasco de 300g.",
    target_audience:
      "Asadores y foodies de 25 a 50 años que quieren llevar su parrilla al siguiente nivel con un condimento real, no industrial.",
    main_problem:
      "Las salsas BBQ de supermercado tienen jarabe de maíz de alta fructosa, colorante caramelo y saben todas igual, sin carácter propio.",
    unique_mechanism:
      "Ahumado real en frío con leña de manzano durante 6 horas que le da una profundidad imposible de replicar con humo líquido artificial.",
    offer_or_cta: "Pack 3 sabores (original, chipotle, bourbon) con 20% OFF. Envío en 48h.",
  },
  {
    id: "kit-fondue-gourmet",
    label: "🫕 Kit Fondue Gourmet",
    category: "comidas",
    isReadonly: true,
    product_name: "Kit Fondue Gourmet con Base Eléctrica",
    product_description:
      "Kit completo para fondue suizo: caquelon de cerámica 1.8L, base eléctrica regulable, 6 tenedores de acero, mix de 3 quesos premium (gruyere, emmental, appenzeller), vino blanco para la receta y 30 recetas incluidas.",
    target_audience:
      "Parejas y grupos de amigos de 25 a 45 años que quieren una experiencia gastronómica memorable en casa sin reservar en un restaurante caro.",
    main_problem:
      "Una fondue en restaurante cuesta 40 a 60 dólares por persona y en casa no saben cómo hacerla bien ni tienen los utensilios correctos.",
    unique_mechanism:
      "Kit all-in-one con los quesos exactos de la receta suiza tradicional y base eléctrica de temperatura precisa para que quede perfecta siempre.",
    offer_or_cta: "Kit completo con quesos y recetas. Envío en caja refrigerada. Pedido mínimo 2 días antes.",
  },
  {
    id: "alfajores-premium-sin-gluten",
    label: "🍪 Alfajores Premium Sin Gluten",
    category: "comidas",
    isReadonly: true,
    product_name: "Trilogía Alfajores Premium Sin TACC",
    product_description:
      "Caja con 9 alfajores premium sin gluten, sin tacc certificado: 3 de chocolate negro 70%, 3 de dulce de leche artesanal y 3 de ganache de limón. Masa de almendras y coco, relleno generoso, cobertura real.",
    target_audience:
      "Personas celíacas o con sensibilidad al gluten de 20 a 50 años que extrañan los alfajores de verdad y reciben cajas llenas de decepción.",
    main_problem:
      "Los alfajores sin gluten del mercado tienen masa de cartón, relleno escaso y saben a medicamento. Comer sin TACC nunca debería significar eso.",
    unique_mechanism:
      "Masa húmeda de almendras y coco que en boca tiene la misma textura que el alfajor clásico, más cobertura de chocolate belga real.",
    offer_or_cta: "Caja de 9 unidades con envío en caja refrigerada. Regalo ideal. 2 cajas con 10% OFF.",
  },
  {
    id: "pasta-fresca-artesanal",
    label: "🍝 Pasta Fresca Artesanal x4",
    category: "comidas",
    isReadonly: true,
    product_name: "Pack Pasta Fresca Artesanal 4 Variedades",
    product_description:
      "Pack refrigerado con 4 variedades de pasta fresca artesanal de 200g cada una: tagliatelle de espinaca, ravioles de ricota y nuez, pappardelle al huevo de campo y gnocchi de papa sin relleno. Listas en 3 minutos.",
    target_audience:
      "Familias y parejas de 28 a 55 años que quieren cocinar pasta fresca de calidad sin hacer la masa desde cero ni pagar precio de restaurante.",
    main_problem:
      "La pasta seca del supermercado no tiene comparación en sabor y la pasta fresca de restaurante cuesta 3 veces más de lo que razonablemente querrían pagar.",
    unique_mechanism:
      "Pasta amasada el mismo día del pedido con harina 00, huevos de campo y rellenos sin conservantes. Cocción en 3 minutos exactos.",
    offer_or_cta: "Pack 4 variedades + salsa pomodoro artesanal gratis. Pedido antes del jueves, entrega el viernes.",
  },
  {
    id: "hummus-organico-pack-x6",
    label: "🫘 Hummus Orgánico Pack x6",
    category: "comidas",
    isReadonly: true,
    product_name: "Hummus Orgánico Porciones Individuales x6",
    product_description:
      "Pack de 6 porciones de hummus orgánico de 80g cada una: original, con pimiento asado, con pesto de albahaca, con remolacha, black bean y con ajo negro. Sin aceite de palma, sin conservantes, sin azúcar.",
    target_audience:
      "Personas de 20 a 40 años que comen hummus como snack o colación pero están cansadas del hummus industrial que sabe a goma y tiene aceite de palma.",
    main_problem:
      "El hummus de supermercado tiene aceite de palma, goma guar y conservantes. El hummus de verdad dura 5 días y nadie lo vende así empaquetado.",
    unique_mechanism:
      "Hecho el mismo día del pedido con garbanzos orgánicos remojados 24h y tahini artesanal. Sin conservantes: cadena de frío garantizada hasta tu puerta.",
    offer_or_cta: "Pack 6 sabores con crudités de verduras gratis. Envío refrigerado en 48h.",
  },
  {
    id: "cacao-puro-criollo",
    label: "🍫 Cacao Puro 100% Criollo",
    category: "comidas",
    isReadonly: true,
    product_name: "Cacao en Polvo Puro 100% Criollo",
    product_description:
      "Polvo de cacao puro variedad criollo de origen Ecuador, fermentado naturalmente, procesado sin alcalización (método holandés). Sin azúcar añadida, sin lecitina de soja. 250g en bolsa con cierre hermético y cuchara dosificadora.",
    target_audience:
      "Personas de 25 a 45 años que hacen recetas saludables, smoothies o que toman chocolate caliente y quieren el cacao más puro sin adulterantes.",
    main_problem:
      "El cacao en polvo del supermercado está alcalizado (destruye los flavonoides) o viene mezclado con azúcar. No es realmente cacao puro.",
    unique_mechanism:
      "Variedad criollo sin alcalizar mantiene el 100% de los flavonoides, los antioxidantes ORAC y el sabor intenso que el cacao alcalizado pierde.",
    offer_or_cta: "250g con 10 recetas saludables de temporada incluidas. Comprá 2, el segundo a mitad de precio.",
  },
  {
    id: "kit-picada-epica",
    label: "🧀 Kit Picada Épica",
    category: "comidas",
    isReadonly: true,
    product_name: "Kit Picada Épica Curada",
    product_description:
      "Caja curada para 4 personas: tabla de madera de acacia, 3 quesos seleccionados (brie, manchego y provolone), 2 fiambres (salame de Colonia Caroya y copa de cerdo), crackers artesanales de semillas, miel de flores y nueces.",
    target_audience:
      "Grupos de amigos y familias de 25 a 50 años que arman reuniones informales y quieren impresionar sin gastar horas en una góndola de supermercado.",
    main_problem:
      "Armar una picada decente lleva 45 minutos de supermercado, gastan el doble y al final olvidan algo o mezclan productos que no van bien juntos.",
    unique_mechanism:
      "Curaduría de sommelier gastronómico con los productos específicos que van juntos en sabor y textura, listos para servir en 5 minutos.",
    offer_or_cta: "Caja lista para 4 personas con tabla de madera incluida. Pedido antes del sábado al mediodía.",
  },
];

// ─────────────────────────────────────────────────────────────
// 30 ÁNGULOS DE RESPUESTA DIRECTA — SISTEMA
// ─────────────────────────────────────────────────────────────
export const SYSTEM_ANGLES: Angle[] = [
  // ── GRUPO 1: FRAMEWORKS CLÁSICOS DE CONVERSIÓN ──────────────
  {
    id: "pas-dolor-no-resuelto",
    label: "🔥 Dolor No Resuelto (PAS)",
    description:
      "Problem → Agitation → Solution. Empieza con el dolor más crudo y visceral, lo agita hasta el punto de inflexión y presenta el producto como la única salida lógica. Ideal para fricciones cotidianas repetidas.",
    badge_color: "amber",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "myth-buster-quiebre-creencia",
    label: "💡 Quiebre de Creencia (Myth Buster)",
    description:
      '"Pensabas que X era la solución… en realidad Y es lo que funciona." Destruye la objeción o creencia limitante principal de la audiencia y reposiciona el producto como la verdad que nadie les había dicho.',
    badge_color: "cobalt",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "pov-demo-tecnica-cruda",
    label: "📸 Demo Técnica Cruda (POV Demo)",
    description:
      "La cámara muestra el producto en uso real, en tiempo real, sin cortes. Sin voiceover artificial, sin presentador. El producto habla solo. Máximo impacto visual para productos con resultado observable inmediato.",
    badge_color: "emerald",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "prueba-social-masiva",
    label: "👥 Prueba Social Masiva",
    description:
      '"+10.000 clientes ya lo usan" + clip UGC real de usuarios reales. Activa el sesgo de bandwagon y reduce la fricción de compra. Funciona mejor cuando el número es creíble y el UGC parece auténtico, no producido.',
    badge_color: "emerald",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "autoridad-certificacion",
    label: "🏆 Autoridad / Certificación",
    description:
      "Experto, premio o claim técnico/científico en los primeros 3 segundos. Establece credibilidad antes de que la audiencia pueda dudar. Funciona especialmente bien en salud, nutrición y tecnología.",
    badge_color: "cobalt",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "urgencia-real-scarcity",
    label: "⏱ Urgencia Real (Scarcity)",
    description:
      "Stock limitado real + countdown visual. Cierra el bucle de procrastinación y fuerza la decisión ahora. Clave: la urgencia debe ser real o el comprador siente la trampa y pierde confianza en la marca.",
    badge_color: "amber",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "comparacion-directa-vs",
    label: "⚖️ Comparación Directa (Vs.)",
    description:
      "Tu producto vs. alternativa cara, ineficiente o conocida. Muestra el contraste visual y económico de forma honesta. Activa el sesgo de comparación anchoring y posiciona el precio como obvia decisión inteligente.",
    badge_color: "amber",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "brand-story-origen",
    label: "📖 Historia de Origen (Brand Story)",
    description:
      "Por qué existe el producto, quién lo creó, el proceso artesanal o el problema personal del fundador. Conecta emocionalmente antes de vender. Funciona mejor para marcas pequeñas que compiten contra gigantes industriales.",
    badge_color: "cobalt",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "antes-despues-resultado",
    label: "🔄 Resultado Antes / Después",
    description:
      "Transformación visual en 3 cortes: estado de dolor antes, proceso de uso del producto, resultado final. El contraste visual dispara dopamina y deseo de transformación. Máximo impacto en skincare, fitness y organización.",
    badge_color: "emerald",
    group: "clasicos",
    isReadonly: true,
  },
  {
    id: "value-stack-quiebre-precio",
    label: "💰 Quiebre de Precio (Value Stack)",
    description:
      '"Lo que pagarías comprando esto por separado en otro lado: $X. Lo que te cuesta hoy aquí: $Y." Ancla el precio en la comparación más cara y hace que el precio de hoy parezca una obviedad. Ideal para kits y bundles.',
    badge_color: "amber",
    group: "clasicos",
    isReadonly: true,
  },

  // ── GRUPO 2: EMOCIONALES Y ASPIRACIONALES ───────────────────
  {
    id: "identidad-aspiracional",
    label: "✨ Identidad Aspiracional",
    description:
      '"Las personas que X usan Y." No vendas el producto, vendé la identidad que el comprador quiere proyectar. El producto es el boleto de entrada a una tribu, un estilo de vida o un estatus. Poderoso en lifestyle, bebidas premium y gourmet.',
    badge_color: "cobalt",
    group: "emocionales",
    isReadonly: true,
  },
  {
    id: "miedo-a-perderse-fomo",
    label: "😱 Miedo a Perderse (FOMO)",
    description:
      '"Todo el mundo ya lo sabe menos vos." Muestra que la tendencia ya ocurrió, que tu audiencia target ya adoptó el producto y que quedarse afuera es perder relevancia. Especialmente efectivo con tendencias de alimentación y salud.',
    badge_color: "amber",
    group: "emocionales",
    isReadonly: true,
  },
  {
    id: "culpa-permission-slip",
    label: "🎁 Permiso para el Placer (Permission Slip)",
    description:
      '"Te lo merecés, y además es sano." Elimina la culpa del placer mostrando que el producto satisface sin consecuencias. Perfecto para snacks, chocolates premium, bebidas alcohólicas artesanales o postres gourmet.',
    badge_color: "emerald",
    group: "emocionales",
    isReadonly: true,
  },
  {
    id: "nostalgia-memoria",
    label: "🕰 Nostalgia / Memoria",
    description:
      '"Como hacía la abuela, pero en tu puerta." Activa el circuito emocional de la memoria y la infancia. El producto se presenta como la recuperación de algo genuino que el mundo moderno perdió. Ideal para productos artesanales y recetas tradicionales.',
    badge_color: "cobalt",
    group: "emocionales",
    isReadonly: true,
  },
  {
    id: "ego-reconocimiento",
    label: "🌟 Ego / Reconocimiento Social",
    description:
      '"Tus invitados van a preguntar dónde lo conseguiste." Apela al deseo de ser admirado, de impresionar en reuniones sociales y de ser el que sabe. Especialmente efectivo en vinos, kits gourmet, picadas y bebidas de especialidad.',
    badge_color: "amber",
    group: "emocionales",
    isReadonly: true,
  },

  // ── GRUPO 3: RACIONALES Y DE CREDIBILIDAD ───────────────────
  {
    id: "transparencia-ingredientes",
    label: "🔍 Transparencia de Ingredientes",
    description:
      '"Te mostramos exactamente qué hay adentro y por qué." Abre el producto al escrutinio total: laboratorio, trazabilidad, origen. Destruye la desconfianza del consumidor educado que lee etiquetas. Ideal para alimentos funcionales, orgánicos y sin TACC.',
    badge_color: "emerald",
    group: "racionales",
    isReadonly: true,
  },
  {
    id: "roi-calculadora-ahorro",
    label: "🧮 ROI / Calculadora de Ahorro",
    description:
      '"Gastás $X por mes en Y. Con nuestro producto gastás $Z y obtenés más." Convierte la compra en una decisión financiera obvia. Muy efectivo para suscripciones, kits de preparación casera y productos que sustituyen consumos externos frecuentes.',
    badge_color: "cobalt",
    group: "racionales",
    isReadonly: true,
  },
  {
    id: "garantia-riesgo-cero",
    label: "🛡 Garantía / Riesgo Cero",
    description:
      '"Si en 30 días no estás convencido, te devolvemos el 100%." Elimina el riesgo percibido de la compra. Cuando el producto es genuinamente bueno, la garantía se convierte en argumento de venta, no en costo. Activa la acción en indecisos.',
    badge_color: "emerald",
    group: "racionales",
    isReadonly: true,
  },
  {
    id: "proceso-detras-del-producto",
    label: "⚙️ El Proceso Detrás del Producto",
    description:
      '"Tardamos 24 horas en hacerlo antes de que llegue a tu puerta." Muestra el proceso de producción como argumento de calidad y valor. Cada paso visible justifica el precio y diferencia al producto de lo masivo e industrial.',
    badge_color: "cobalt",
    group: "racionales",
    isReadonly: true,
  },
  {
    id: "cliente-esceptico-convertido",
    label: "🙃 El Escéptico Convertido",
    description:
      '"Yo tampoco lo creía… hasta que lo probé." Un cliente o el mismo fundador que era el más difícil de convencer ahora es el más fanático. Neutraliza la objeción de incredulidad usando el mismo perfil del escéptico como vocero.',
    badge_color: "amber",
    group: "racionales",
    isReadonly: true,
  },

  // ── GRUPO 4: NATIVOS DE PLATAFORMA (TIKTOK / REELS) ─────────
  {
    id: "hook-pregunta-incomoda",
    label: "❓ Pregunta Incómoda (Hook)",
    description:
      '"¿Sabías que el X que tomás todos los días tiene Y?" Una pregunta que genera disonancia cognitiva en los primeros 2 segundos. Obliga al espectador a quedarse para resolver la incomodidad. Alta retención en los primeros 3 seg. (Thumbstop).',
    badge_color: "amber",
    group: "nativos",
    isReadonly: true,
  },
  {
    id: "storytime-formato-nativo",
    label: "🎬 Storytime (Formato Nativo)",
    description:
      '"Esto me pasó y cambió todo lo que pensaba sobre X." Formato narrativo de primera persona, cámara casual, sin producción aparente. Máxima autenticidad percibida. Alto Hold Rate por estructura de historia con tensión narrativa.',
    badge_color: "emerald",
    group: "nativos",
    isReadonly: true,
  },
  {
    id: "reaccion-sorpresa",
    label: "😲 Reacción / Sorpresa en Vivo",
    description:
      "Primera vez que alguien prueba o usa el producto en cámara, con reacción genuina de sorpresa o satisfacción. Sin guion aparente. El momento de descubrimiento real es el gancho. Muy efectivo para productos de sabor, textura o efecto visible.",
    badge_color: "emerald",
    group: "nativos",
    isReadonly: true,
  },
  {
    id: "educacion-dato-sorprendente",
    label: "🧪 Educación / Dato Sorprendente",
    description:
      '"El 80% de los aceites de oliva del supermercado están adulterados." Un dato verificable y sorprendente que reencuadra completamente la categoría. Posiciona la marca como la fuente de verdad y al producto como la solución educada.',
    badge_color: "cobalt",
    group: "nativos",
    isReadonly: true,
  },
  {
    id: "tutorial-receta-integrada",
    label: "👨‍🍳 Tutorial / Receta Integrada",
    description:
      "El producto aparece dentro de una receta o tutorial real que la audiencia ya quería aprender. No es publicidad, es contenido útil que cierra con el producto como protagonista. Retención máxima porque aporta valor genuino antes de vender.",
    badge_color: "emerald",
    group: "nativos",
    isReadonly: true,
  },
  {
    id: "packing-unboxing",
    label: "📦 Unboxing / Experiencia de Apertura",
    description:
      "La experiencia de recibir y abrir el packaging es el contenido en sí. El detalle, el olor, la presentación, el primer contacto con el producto. ASMR implícito. Especialmente efectivo para kits regalo, suscripciones y productos de packaging premium.",
    badge_color: "cobalt",
    group: "nativos",
    isReadonly: true,
  },

  // ── GRUPO 5: COMPORTAMENTALES Y DE CIERRE ───────────────────
  {
    id: "objecion-precio-directa",
    label: "💬 Objeción de Precio Directa",
    description:
      '"Sí, cuesta más. Y acá te explico exactamente por qué." Aborda la objeción del precio de frente antes de que el espectador la formule. Convierte la transparencia en argumento de venta. Muy efectivo cuando el diferencial de precio tiene justificación real.',
    badge_color: "amber",
    group: "comportamentales",
    isReadonly: true,
  },
  {
    id: "limitacion-acceso-exclusivo",
    label: "🔐 Acceso Exclusivo / Edición Limitada",
    description:
      '"Solo disponible en nuestra tienda. No lo vas a encontrar en otro lado." Activa la exclusividad como valor. El producto no es masivo porque no puede o no quiere serlo. Ideal para pequeños productores, ediciones estacionales y preventa.',
    badge_color: "cobalt",
    group: "comportamentales",
    isReadonly: true,
  },
  {
    id: "ritual-habito-diario",
    label: "☀️ Ritual / Hábito Diario",
    description:
      '"No es solo un producto, es tu nueva rutina de las 8am." Integra el producto en un ritual cotidiano deseable. El comprador no está comprando un objeto, está comprando una identidad de persona organizada, saludable o premium. Alto LTV y recurrencia.',
    badge_color: "emerald",
    group: "comportamentales",
    isReadonly: true,
  },
  {
    id: "regalo-perfecto-ocasion",
    label: "🎀 El Regalo Perfecto (Ocasión)",
    description:
      '"¿Qué le regalás a alguien que tiene todo?" Posiciona el producto como la solución al problema universal de qué regalar. Apela a la culpa del regalo genérico y ofrece el producto como la opción inesperada y memorable. Máximo ROI en fechas especiales.',
    badge_color: "amber",
    group: "comportamentales",
    isReadonly: true,
  },
  {
    id: "comunidad-pertenencia",
    label: "🤝 Comunidad / Pertenencia",
    description:
      '"Más de 5.000 personas en nuestra comunidad ya lo hacen." El producto es la entrada a un grupo con valores compartidos: salud, sustentabilidad, buen gusto o conocimiento. Activa el deseo de pertenencia tribal que supera al deseo del producto en sí.',
    badge_color: "emerald",
    group: "comportamentales",
    isReadonly: true,
  },
];

// ─────────────────────────────────────────────────────────────
// EXPORTS COMBINADOS
// ─────────────────────────────────────────────────────────────
export const ALL_SYSTEM_PRESETS: Preset[] = [
  ...SYSTEM_PRESETS_BEBIDAS,
  ...SYSTEM_PRESETS_COMIDAS,
];

export const ALL_SYSTEM_ANGLES: Angle[] = SYSTEM_ANGLES;

