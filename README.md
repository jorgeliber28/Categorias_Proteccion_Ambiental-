# Dashboard ANP/AVA · Ciudad de México · v34

Tablero institucional del **Sistema de Información Ambiental · SEDEMA · Gobierno de la Ciudad de México** para la consulta y monitoreo de Áreas Naturales Protegidas (ANP), Áreas de Valor Ambiental (AVA) y Zonas Comunitarias de Conservación Ecológica del territorio capitalino, con superposición de la capa de **Suelo de Conservación**.

**Coordinación de Tecnologías de la Información y Monitoreo Geoestadístico (TIMOG) · SEDEMA**

---

## 1. Estructura del repositorio

```
Categorias_Proteccion_Ambiental-/
├── index.html                      ← Aplicación (178 KB)
├── SIA_LOGO-03.png                 ← Logo institucional + favicon (88 KB)
├── README.md
└── data/
    ├── anp_inventario.csv          ← 66 áreas (editable en Excel)
    ├── geometrias.geojson          ← Polígonos de las 65 áreas (carga lazy)
    ├── alcaldias.geojson           ← Polígonos de las 16 alcaldías (carga lazy)
    └── suelo_conservacion.geojson  ← Capa SC (decretos 2000/2009/2020)
```

---

## 2. Cambios en v34 — Cumplimiento institucional

### Accesibilidad WCAG AA
- **Contraste corregido**: chip AVA cambia de dorado claro `#b28e5c` (ratio 2.97:1, FAIL) a dorado oscuro `#7a5d35` (ratio 5.6:1, AA).
- **Estructura semántica**: contenido principal envuelto en `<main>`.
- **Tablas accesibles**: 10 `<th scope="col">` en tabla principal, 7 en tabla comparativa de Análisis, 3 `<th scope="row">` en tabla de hitos.

### Metadatos institucionales
- `<meta name="description">` para indexación y búsqueda.
- `<meta name="theme-color" content="#9d2148">` para barra de navegador móvil.
- `<link rel="icon">` y `<link rel="apple-touch-icon">` con el logo SIA.
- Open Graph completo (og:title, og:description, og:image, og:url, og:locale) para previsualización al compartir por correo, WhatsApp, Slack.

### Optimización de carga
- `<link rel="dns-prefetch">` para CDNs externas (unpkg, CartoDB, ArcGIS).

### Limpieza de código
- 12 clases CSS muertas eliminadas (`.dot`, `.pm-si/no`, `.sc-tag*`, `.eyebrow`, `.grid-3`, `.mini`).
- Comparaciones laxas `==` migradas a estrictas `===`.

---

## 3. Cambios en v32–v33 (recapitulación)

### Optimización de carga
- HTML aligerado de **543 → 175 KB** (-68%) extrayendo geometrías a archivos externos.
- Logo recomprimido de **238 → 88 KB** (-64%).
- **Carga inicial total: ~270 KB** (antes 785 KB) → tiempo en 4G de ~5 s a ~1.5 s.

### Lazy loading
Las geometrías se descargan solo al abrir el mapa global o una ficha (no al cargar la página). Cache singleton en navegador para que la segunda apertura sea instantánea.

### UX móvil
- **Chat asistente**: z-index elevado y ocultamiento automático de controles del mapa al abrirlo. Chips de preguntas siempre visibles.
- **Tabs**: en mobile distribuidas en grid 4×2 (sin scroll horizontal).
- **Tabla comparativa de Análisis**: scroll horizontal con fade gradient cuando excede el ancho.

### Jerarquía visual en tabla principal
- **Tipo (AVA/ANP)**: chip ghost (solo borde).
- **Jurisdicción (Local/Federal)**: chip ghost.
- **Subcategoría**: chip con fondo de color (elemento principal).
- **PM y En SC**: badges unificados con fondo verde (Sí) / rojo (No).

---

## 4. Taxonomía de áreas

| Tipo | Jurisdicción | Categorías posibles |
|---|---|---|
| **ANP** | Federal | Parque Nacional, APRN |
| **ANP** | Local | ZCE, ZSCE, ZPE, ZECC, ZPHE, REC |
| **AVA** | Local únicamente | **Bosque Urbano** o **Barranca** (no hay AVA federales) |

Total: **49 AVA + 17 ANP = 66 áreas**.

Nota: *Cerro de la Estrella* y *Sierra de Santa Catarina* aparecen dos veces en el inventario (con sufijo `local` / `federal`) pero comparten polígono físico.

---

## 5. Despliegue en GitHub Pages

1. Subir todos los archivos al repositorio respetando la estructura de carpetas (los `*.geojson` deben quedar en `data/`).
2. En **Settings → Pages**, habilitar GitHub Pages desde la rama `main` (root).
3. La aplicación quedará disponible en `https://<usuario>.github.io/<repo>/`.

---

## 6. Edición del inventario

El archivo `data/anp_inventario.csv` se puede editar directamente en Excel. Columnas:

- `id` (001–066)
- `nombre`, `grupo`, `categoria`, `alcaldia`
- `fecha_decreto`, `fecha_decreto_iso`, `superficie`
- `programa_manejo` (Sí / No), `fecha_pm`, `fecha_pm_iso`
- `suelo_conservacion` (Sí / No, binarizado por análisis espacial)
- `observaciones`

Codificación: **UTF-8 con BOM**.

---

## 7. Cumplimiento normativo

- WCAG 2.1 nivel AA (contrastes verificados, estructura semántica, scope en tablas).
- Manual de Accesibilidad Web del Gobierno de México (MAWGM).
- Identidad gráfica institucional GCDMX vigente.

---

## 8. Soporte técnico

Para incidencias o ampliaciones del sistema, contactar a la Coordinación TIMOG · SEDEMA.
