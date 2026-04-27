# Dashboard ANP/AVA · Ciudad de México · v29

Tablero institucional del **Sistema de Información Ambiental · SEDEMA · Gobierno de la Ciudad de México** para la consulta y monitoreo de Áreas Naturales Protegidas (ANP) y Áreas de Valor Ambiental (AVA) del territorio capitalino, con superposición de la capa de **Suelo de Conservación**.

**Coordinación de Tecnologías de la Información y Monitoreo Geoestadístico (TIMOG) · SEDEMA**

---

## 1. Estructura del repositorio

```
dashboard-anp-cdmx/
├── index.html                      ← Aplicación
├── SIA_LOGO-03.png                 ← Logo institucional
├── data/
│   ├── anp_inventario.csv          ← 66 áreas (editable en Excel)
│   └── suelo_conservacion.geojson  ← Polígonos SC (decretos 2000/2009)
└── README.md                       ← Este archivo
```

---

## 2. Novedades de v29 respecto a v28

- **Capa de Suelo de Conservación** activable/desactivable tanto en el mapa global como en el mapa específico de cada área.
- **Indicador en cada ficha** que señala si el área se encuentra dentro del Suelo de Conservación: `Sí` / `Parcial` / `No`.
- **Activación automática** de la capa SC al abrir áreas que están total o parcialmente dentro de SC.
- **Logo institucional actualizado** (SIA_LOGO-03.png).
- **IDs en el CSV** ahora son consecutivos sin prefijo (`001`, `002`, …, `066`) para no sesgar entre ANP y AVA.
- **Nueva columna `suelo_conservacion`** en el CSV con los valores precalculados mediante análisis espacial (algoritmo ray-casting sobre los 7 polígonos del decreto SC).

---

## 3. Taxonomía de áreas (recordatorio)

| Tipo | Jurisdicción | Categorías posibles |
|---|---|---|
| **ANP** | Federal | Parque Nacional, APRN |
| **ANP** | Local | ZCE, ZSCE, ZPE, ZECC, ZPHE, REC |
| **AVA** | Local únicamente | **Bosque Urbano** o **Barranca** (no hay AVA federales) |

Total inventario: **66 áreas** (49 AVA · 17 ANP).

---

## 4. Esquema del CSV `anp_inventario.csv`

| Campo | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `id` | texto | `001` | Consecutivo. Tres dígitos con ceros a la izquierda. **NO usa prefijo `anp_` ni `ava_`** porque hay áreas mezcladas. |
| `nombre` | texto | `Bosque de Tláhuac` | Nombre oficial decretado. |
| `grupo` | enum | `ANP · Local` | Valores válidos: `ANP · Local`, `ANP · Federal`, `AVA · Bosque Urbano`, `AVA · Barranca`. |
| `categoria` | texto | `Zona de Protección Especial` | Subcategoría dentro del grupo. |
| `alcaldia` | texto | `Tláhuac` | Si abarca varias, separar con coma entre comillas. |
| `fecha_decreto` | fecha | `29/01/2024` | DD/MM/AAAA. |
| `fecha_decreto_iso` | fecha | `2024-01-29` | AAAA-MM-DD (para sorting). |
| `superficie` | número | `58.77` | Hectáreas. Punto decimal. |
| `programa_manejo` | enum | `Sí` / `No` | Campo más editado. |
| `fecha_pm` | fecha o `—` | `15/03/2025` | DD/MM/AAAA o `—`. |
| `fecha_pm_iso` | fecha | `2025-03-15` | AAAA-MM-DD. Vacío si no aplica. |
| `suelo_conservacion` | enum | `Sí` / `Parcial` / `No` | **Nuevo campo.** Calculado espacialmente. Reeditar manualmente solo si se agrega un área nueva sin polígono. |
| `observaciones` | texto | (libre) | Notas técnicas internas. |

### Distribución actual de áreas en Suelo de Conservación

| Estado | Cantidad |
|---|---|
| Totalmente dentro | 8 |
| Parcial | 16 |
| Fuera de SC | 42 |
| **Total** | **66** |

---

## 5. Despliegue en GitHub Pages

1. Crear repositorio público en GitHub.
2. Subir los 4 archivos respetando la estructura (carpeta `data/` con los dos archivos adentro).
3. Settings → Pages → Source: `Deploy from a branch` → `main` / `(root)`.
4. URL pública en 1-2 minutos: `https://[usuario].github.io/[repo]/`.

---

## 6. Workflow de actualización rutinaria

**Caso 1: Nuevo Programa de Manejo publicado**

1. Abrir `data/anp_inventario.csv` en Excel.
2. Localizar la fila del área (filtrar por `nombre`).
3. Cambiar `programa_manejo` a `Sí`, llenar `fecha_pm` y `fecha_pm_iso`.
4. Guardar como **CSV UTF-8**.
5. Subir el CSV reemplazando el del repositorio.
6. Sitio actualizado en 1-2 minutos. **No se toca el HTML.**

**Caso 2: Nueva ANP/AVA decretada**

1. Agregar fila al CSV con el siguiente ID consecutivo (`067`, `068`, …).
2. Llenar todos los campos. **Importante:** llenar `suelo_conservacion` manualmente con `Sí`, `Parcial` o `No` según corresponda (consultar mapa de Suelo de Conservación).
3. Para que el polígono aparezca en el mapa, hay que incorporarlo manualmente al bloque `GEOMETRIES_EMBEDDED` dentro de `index.html` (tarea del equipo GIS con QGIS).
4. Mientras tanto, el área aparece correctamente en tablas, gráficos y filtros, pero no en el mapa.

**Caso 3: Actualizar el polígono de Suelo de Conservación**

Si se publica un nuevo decreto que modifica el SC:

1. Reemplazar `data/suelo_conservacion.geojson` con el nuevo archivo (debe estar en CRS WGS84 / EPSG:4326).
2. Re-ejecutar el análisis espacial (script `spatial_analysis.py` provisto al equipo TIMOG) para recalcular la columna `suelo_conservacion` del CSV.
3. Subir ambos archivos actualizados.

---

## 7. Funcionamiento de la capa de Suelo de Conservación en el mapa

### En el mapa global (pestaña Global y por categoría)

- Bajo los toggles de "Mapa / Satélite" hay un nuevo botón **"Suelo de Conservación"** con un swatch verde.
- Al activarlo, se dibuja el polígono de SC con relleno verde semitransparente (`#3a7d44` al 18%) y borde verde oscuro punteado.
- La capa SC queda detrás de los polígonos de áreas para no taparlos.
- Las alcaldías permanecen visibles como referencia territorial.

### En la ficha de cada área (drawer)

- Mismo botón "Suelo de Conservación" disponible en el mapa específico.
- **Activación automática:** al abrir un área cuyo campo `suelo_conservacion` sea `Sí` o `Parcial`, la capa se muestra de manera predeterminada para visualizar inmediatamente la intersección.
- En la ficha, debajo del campo "Alcaldía(s)", se muestra una etiqueta con el estado: `Sí` (verde) / `Parcial` (amarillo) / `No` (gris).

---

## 8. Pruebas locales

El sitio requiere un servidor HTTP (no funciona con doble-click por restricciones CORS). Opciones:

- **Live Server** (extensión VSCode): clic derecho sobre `index.html` → Open with Live Server.
- **Python:** desde la carpeta del proyecto, `python -m http.server 8000` y abrir `http://localhost:8000`.
- **GitHub Pages:** subir y probar en la URL pública.

Si el dashboard no carga, aparecerá un mensaje de error rojo identificando el archivo faltante.

---

## 9. Versionado y trazabilidad

Cada modificación al CSV o al GeoJSON queda registrada como un *commit* en GitHub, lo que constituye una **bitácora institucional auditable** para auditorías, transparencia y el Informe de Gobierno.

---

**Versión:** v29 · Abril 2026
**Mantenimiento:** Coordinación TIMOG · SEDEMA CDMX
