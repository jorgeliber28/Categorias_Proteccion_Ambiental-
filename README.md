# Dashboard ANP/AVA · Ciudad de México · v34

Tablero institucional del **Sistema de Información Ambiental · SEDEMA · Gobierno de la Ciudad de México** para la consulta y monitoreo de Áreas Naturales Protegidas (ANP), Áreas de Valor Ambiental (AVA) y Zonas Comunitarias de Conservación Ecológica del territorio capitalino, con superposición de la capa de **Suelo de Conservación**.

**Coordinación de Tecnologías de la Información y Monitoreo Geoestadístico (TIMOG) · SEDEMA**

URL pública: `https://jorgeliber28.github.io/Categorias_Proteccion_Ambiental-/`

---

## 1. Estructura del repositorio

```
Categorias_Proteccion_Ambiental-/
├── index.html                      ← Aplicación principal (261 KB)
├── sw.js                           ← Service Worker para operación offline (3.7 KB)
├── SIA_LOGO-03.png                 ← Logo institucional + favicon (88 KB)
├── README.md                       ← Este documento
└── data/
    ├── anp_inventario.csv          ← 66 áreas (editable en Excel)
    ├── geometrias.geojson          ← Polígonos georreferenciados
    ├── alcaldias.geojson           ← 16 alcaldías de la CDMX
    ├── suelo_conservacion.geojson  ← Capa SC (decretos 2000/2009/2020)
    └── normativa/
        ├── CPCDMX_Constitucion_CDMX.pdf
        ├── LACM_Ley_Ambiental_CDMX.pdf
        ├── LGEEPA_Ley_General_Equilibrio_Ecologico.pdf
        └── CONVENIO_SEMARNAT-CONANP-CDMX_2025.pdf
```

---

## 2. Funcionalidades v34

### 2.1 Tabs del dashboard (8)

| Tab | Contenido |
|---|---|
| Global | Vista agregada · 66 áreas · 27,747 ha · Mapa institucional con todas las capas |
| Bosques Urbanos | AVA · Categoría Bosque Urbano |
| Barrancas | AVA · Categoría Barranca |
| ANP Locales | ANP de jurisdicción local CDMX |
| ANP Federales | ANP de jurisdicción federal en CDMX (CONANP) |
| Análisis | Distribuciones por grupo, jurisdicción, alcaldía + cronología histórica de decretos |
| Metas | Línea base 2018-2024 vs administración actual + diagnóstico de brechas operativas |
| Marco Jurídico | CPCDMX · LACM · LGEEPA + Convenio SEMARNAT–CONANP–CDMX 2025 |

### 2.2 Mapas interactivos

- Toggle Mapa/Satélite flotante en esquina superior derecha
- Botón Pantalla Completa en cualquier mapa (Fullscreen API nativa)
- Buscador de coordenadas y direcciones con Nominatim (OpenStreetMap), acepta múltiples formatos: `19.4326, -99.1332`, `(19.4326, -99.1332)`, `[19.4326, -99.1332]`
- Capa de Suelo de Conservación activable
- Capa de Coadministración que resalta las 8 ANP federales del Convenio 2025
- Capa de alcaldías como contexto territorial

### 2.3 Ficha técnica de cada área

- Apertura mediante clic en cualquier fila de la tabla
- Botón Compartir enlace (deep linking `#area=slug-del-area`)
- Botón Imprimir con formato institucional para papel tamaño carta
- Mapa específico del polígono con todas las funcionalidades de mapa
- Marco legal aplicable contextualizado

### 2.4 Asistente conversacional

- 28 preguntas predefinidas en pool aleatorio de 6
- Detección de intención: superlativos, conteos, listados, definiciones jurídicas
- Filtros combinados: por grupo, alcaldía, año, década, programa de manejo
- Definiciones jurídicas integradas: AVA, ANP, ARCAS, PM, LACM, LGEEPA, CPCDMX, ZEC, ZSCE, ZPE, REC, PN, SEDEMA, CONANP, Suelo de Conservación, Convenio de Coadministración

### 2.5 Modo presentación

- Activable por URL `?modo=presentacion` o desde enlace en footer
- Oculta chat, filtros y controles secundarios
- Tipografía aumentada para proyección en sala de juntas
- Encabezado institucional fijo en color guinda
- Mapa global a 720px de altura

### 2.6 Operación offline (Service Worker)

- Cachea recursos críticos en la primera carga
- Funciona sin conexión tras la primera visita
- Indicador visual de estado de conexión
- Estrategia mixta: cache-first para estáticos, network-first para datos cambiantes

---

## 3. Cumplimiento de auditorías

### Auditoría 1 (estática) — 100% resuelta

- Contraste WCAG AA (chip dorado AVA con ratio 5.6:1)
- Metadatos institucionales completos (description, theme-color, OG, favicon)
- Estructura semántica (`<main>`, `scope` en tablas)
- DNS-prefetch a CDNs (unpkg, cartodb, arcgis)
- Eliminación de clases CSS muertas

### Auditoría 2 (dinámica) — 100% resuelta

- Listeners no se duplican al re-renderizar (clone-and-replace en 5 puntos)
- Chip Suelo de Conservación funciona en los 5 mapas (función reutilizable `attachSCToggle`)
- `invalidateSize()` en cambios de fullscreen (resuelve tiles parciales)
- Handlers `def_sc` y `def_convenio` en chat (preguntas del pool funcionales)
- Conteo dinámico de polígonos (no hardcoded)
- Race condition al cargar mapa global resuelta (async + await)

---

## 4. Flujo de actualización del inventario

1. Editar `data/anp_inventario.csv` en Excel (UTF-8 con BOM)
2. Validar columnas: `id, nombre, grupo, categoria, alcaldia, fecha_decreto, fecha_decreto_iso, superficie, programa_manejo, fecha_pm, fecha_pm_iso, suelo_conservacion, observaciones`
3. Si se agregan o modifican polígonos, actualizar `data/geometrias.geojson` con la propiedad `nombre` coincidente
4. Commit en GitHub
5. Esperar 1-2 minutos para que GitHub Pages reconstruya el sitio
6. Recargar con `Ctrl+Shift+R` para limpiar caché del navegador y del Service Worker

---

## 5. Compatibilidad

- Navegadores: Chrome, Firefox, Safari, Edge (versiones recientes)
- Mobile: optimizado para iOS y Android (responsive de 320px a 1600px)
- Offline: funciona sin conexión tras la primera carga
- Impresión: estilos optimizados para papel tamaño carta
- Accesibilidad: WCAG AA en contrastes; navegación por teclado en controles principales

---

## 6. Stack técnico

- HTML5 + CSS3 + JavaScript ES2020 (sin frameworks)
- Leaflet 1.9 (mapas interactivos)
- OpenStreetMap + Nominatim (geocoder)
- CartoDB Positron + ArcGIS Imagery (capas base)
- Service Worker API (offline)
- Fullscreen API + Web Share API + Clipboard API (interacciones)

---

*Documento mantenido por la Coordinación TIMOG · SEDEMA · Ciudad de México · 2026.*
