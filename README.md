# Dashboard ANP/AVA · Ciudad de México · v33

Tablero institucional del **Sistema de Información Ambiental · SEDEMA · Gobierno de la Ciudad de México** para la consulta y monitoreo de Áreas Naturales Protegidas (ANP) y Áreas de Valor Ambiental (AVA) del territorio capitalino, con superposición de la capa de **Suelo de Conservación**.

**Coordinación de Tecnologías de la Información y Monitoreo Geoestadístico (TIMOG) · SEDEMA**

---

## 1. Estructura del repositorio

```
Categorias_Proteccion_Ambiental-/
├── index.html                      ← Aplicación (175 KB)
├── SIA_LOGO-03.png                 ← Logo institucional (88 KB)
├── data/
│   ├── anp_inventario.csv          ← 66 áreas (editable en Excel)
│   ├── geometrias.geojson          ← Polígonos de las 65 áreas (carga lazy)
│   ├── alcaldias.geojson           ← Polígonos de las 16 alcaldías (carga lazy)
│   └── suelo_conservacion.geojson  ← Capa SC (decretos 2000/2009/2020)
└── README.md
```

---

## 2. Optimización móvil (v32–v33)

### Carga inicial
- HTML aligerado de **543 → 175 KB** (-68%) extrayendo geometrías a archivos externos.
- Logo recomprimido de **238 → 88 KB** (-64%).
- **Carga inicial total: ~270 KB** (antes 785 KB) → tiempo en 4G de ~5 s a ~1.5 s.

### Lazy loading
Las geometrías se descargan solo al abrir el mapa global o una ficha (no al cargar la página). Cache singleton en navegador para que la segunda apertura sea instantánea.

### UX móvil (v33)
- **Chat asistente**: z-index elevado y ocultamiento automático de controles del mapa al abrirlo.
- **Tabs**: scroll horizontal con fade gradient al lado derecho como indicador visual + scroll-snap.
- **Tabla comparativa de Análisis**: scroll horizontal con fade gradient cuando excede el ancho de pantalla.
- **Chips del chat**: siempre visibles durante toda la conversación.

### Jerarquía visual en tabla principal
- **Tipo (AVA/ANP)**: chip ghost (solo borde).
- **Jurisdicción (Local/Federal)**: chip ghost.
- **Subcategoría**: chip con fondo de color (elemento principal).
- **PM y En SC**: badges unificados con fondo verde (Sí) / rojo (No).

---

## 3. Taxonomía de áreas

| Tipo | Jurisdicción | Categorías posibles |
|---|---|---|
| **ANP** | Federal | Parque Nacional, APRN |
| **ANP** | Local | ZCE, ZSCE, ZPE, ZECC, ZPHE, REC |
| **AVA** | Local únicamente | **Bosque Urbano** o **Barranca** (no hay AVA federales) |

Total: **49 AVA + 17 ANP = 66 áreas**.

Nota: *Cerro de la Estrella* y *Sierra de Santa Catarina* aparecen dos veces en el inventario (con sufijo `local` / `federal`) pero comparten polígono físico.

---

## 4. Despliegue en GitHub Pages

1. Subir todos los archivos al repositorio respetando la estructura de carpetas (en particular, los `*.geojson` deben quedar en `data/`).
2. En **Settings → Pages**, habilitar GitHub Pages desde la rama `main` (root).
3. La aplicación quedará disponible en `https://<usuario>.github.io/<repo>/`.

---

## 5. Edición del inventario

El archivo `data/anp_inventario.csv` se puede editar directamente en Excel. Columnas:

- `id` (001–066)
- `nombre`, `grupo`, `categoria`, `alcaldia`
- `fecha_decreto`, `fecha_decreto_iso`, `superficie`
- `programa_manejo` (Sí / No), `fecha_pm`, `fecha_pm_iso`
- `suelo_conservacion` (Sí / No, binarizado por análisis espacial)
- `observaciones`

Codificación: **UTF-8 con BOM**.

---

## 6. Soporte técnico

Para incidencias o ampliaciones del sistema, contactar a la Coordinación TIMOG · SEDEMA.
