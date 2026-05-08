# Seguimiento Fase 1 - Evaluación del Proyecto Asistente Poético

## Estado al 2026-04-18

### Lo que se hizo
Se realizó una evaluación completa del código del proyecto. Se revisaron:
- `public/index.html`
- `public/asistentepoetico.js`
- `public/funciones.js`
- `public/asistentepoetico.css`
- `public/index.css`

---

## Problemas encontrados (pendientes de corregir)

### Bugs críticos en `asistentepoetico.js`

| # | Línea | Problema | Impacto |
|---|-------|----------|---------|
| 1 | 1231 | `this.nuevoArreglo(pdt)` — `this` incorrecto fuera de clase | Falla en strict mode |
| 2 | 1394 | `this.tresVocales(...)` — mismo problema | Falla en strict mode |
| 3 | 1424 | `this.nuevoArreglo(oout)` — mismo problema | Falla en strict mode |
| 4 | 1611 | `this.hiato(...)` — mismo problema | Falla en strict mode |
| 5 | 1619 | `this.hiato(...)` — mismo problema | Falla en strict mode |
| 6 | 1641 | `this.nuevoArreglo(oout)` — mismo problema | Falla en strict mode |
| 7 | 1811 | `this.cuatroVocales(...)` — mismo problema | Falla en strict mode |
| 8 | 1864 | `this.nuevoArreglo(oout)` — mismo problema | Falla en strict mode |
| 9 | 1863-1868 | `cuatroSilaba` retorna `nuevo` solo si `vvvv=true`; si es `false`, retorna `undefined` | Bug de lógica |
| 10 | 150 | `body.css("height", alto+"px")` — sintaxis jQuery, función nunca se llama | Código muerto |
| 11 | 465 | `sinalefaaExterior = false` sin declarar | Variable global implícita |
| 12 | 476 | `versoCopia = verso` sin declarar | Variable global implícita |
| 13 | 1244 | `out = []` sin declarar | Variable global implícita |
| 14 | 1251 | `nuevo = [numNuevo]` sin declarar | Variable global implícita |

### Problemas CSS

| # | Archivo | Línea | Problema |
|---|---------|-------|----------|
| 1 | `asistentepoetico.css` | 9 | `--A200R: #rgb(178, 255, 89, 0.5)` — valor CSS inválido |
| 2 | Ambos CSS | — | Variables CSS duplicadas en `index.css` y `asistentepoetico.css` |

### Problemas de arquitectura

| # | Problema |
|---|----------|
| 1 | `funciones.js` exporta `limpiar()` pero nunca se importa; es código huérfano |
| 2 | `index.html` carga `asistentepoetico.js` como script clásico (no módulo), por eso los `this.X()` no crashean (van a `window`) |

---

## Correcciones aplicadas (2026-04-18)

| # | Corrección | Estado |
|---|-----------|--------|
| 1 | `this.nuevoArreglo()` → `nuevoArreglo()` (4 lugares) | ✅ Hecho |
| 2 | `this.tresVocales()` → `tresVocales()` | ✅ Hecho |
| 3 | `this.hiato()` → `hiato()` (2 lugares) | ✅ Hecho |
| 4 | `this.cuatroVocales()` → `cuatroVocales()` | ✅ Hecho |
| 5 | `cuatroSilaba`: retorna `iin` cuando `vvvv=false` (en vez de `undefined`) | ✅ Hecho |
| 6 | `out = []` → `let out = []` en `nuevoArreglo` | ✅ Hecho |
| 7 | `nuevo = [numNuevo]` → `let nuevo = [numNuevo]` en `nuevoArreglo` | ✅ Hecho |
| 8 | `versoCopia = verso` → `let versoCopia` (en `segundo` y `leerVerso`) | ✅ Hecho |
| 9 | CSS: `--A200R: #rgb(...)` → `rgba(...)` | ✅ Hecho |

| 10 | `sinalefaa == true` → `sinalefaa[0] == true` en versos de 2 palabras | ✅ Hecho |
| 11 | Agregado par `"oe"` faltante en función `sinalefa()` | ✅ Hecho |

## Pruebas funcionales (45 casos)
- 45/45 pasan ✅
- "prohibir" → "prohi/bir" es CORRECTO: la "h" es transparente (RAE 2010), "oi" sigue siendo diptongo

## Documentación completa (2026-04-18) ✅

Todas las etapas del plan-refactor.md completadas:

| Etapa | Funciones | Estado |
|-------|-----------|--------|
| 1 | `depurarVerso`, `invertirPalabra`, `vCH`, `nuevoArreglo` | ✅ |
| 2 | `extraeVocales`, `hiato`, `sinalefa`, `triSinalefa`, `tresVocales`, `cuatroVocales` | ✅ |
| 3 | `separaPalabra` | ✅ |
| 4 | `cuatroSilaba`, `triptongoSilaba`, `hiatoSilaba` | ✅ |
| 5 | `segundo`, `obtenerSilabas`, `sinalefaDosPalabras`, `sinalefaTresPalabras` | ✅ |
| 6 | `leerVerso`, `determinaAcentoPalabra`, `contarSilabasOrtografico`, `contarSilabasPoetico`, `principal`, `limpiar`, `ampliarVentanas`, `leerFila` | ✅ |

- Deploy en producción tras cada etapa ✅
- Push a GitHub tras cada etapa ✅
- 45/45 pruebas pasan en todas las etapas ✅

## Por dónde seguir

- ✅ `funciones.js` eliminado — era huérfano, nunca importado
- ✅ Etapa A módulos ES6: `utils.js` creado con 4 funciones base
- ✅ `index.html` ya usa `<script type="module">`
- ✅ test runner actualizado para cargar módulos via eval sin export/import
- ✅ Etapa B: vocales.js (extraeVocales, hiato, sinalefa, triSinalefa, tresVocales, cuatroVocales)
- ✅ Etapa C: silabeo.js (separaPalabra, cuatroSilaba, triptongoSilaba, hiatoSilaba)
- ✅ Etapa D: metrica.js (segundo, obtenerSilabas, leerVerso, determinaAcento, contarSilabas*) + ui.js (principal, limpiar, ampliarVentanas, leerFila)
- ✅ asistentepoetico.js: solo entry point con imports + DOMContentLoaded
- ✅ Test runner actualizado para cargar todos los módulos via eval (CRLF normalizado)
- 45/45 pruebas pasan, deploy y push tras cada etapa

## Estado final de la arquitectura de módulos
public/
  utils.js       → funciones de utilidad base
  vocales.js     → análisis de vocales, hiatos, sinalefas, triptongos
  silabeo.js     → algoritmo de silabeo (separaPalabra y ajustes)
  metrica.js     → lógica poética completa (leerVerso, segundo, conteo)
  ui.js          → interfaz (principal, limpiar, ampliarVentanas)
  asistentepoetico.js → entry point (solo event listeners + imports)
## Completado (2026-04-18) — Documento de limitaciones

- ✅ `limitaciones-y-mejoras.md` creado con 3 secciones:
  - Limitaciones lingüísticas (6 ítems): güe/güi, vhvvv vacío, diacríticos, sinalefa forzada, préstamos, mayúsculas
  - Limitaciones de código (7 ítems): tipoSina mutable, jQuery muerto, largoMayor sin usar, CSS #rgb inválido, aqua por defecto, eval frágil
  - Limitaciones UX (5 ítems): sin spinner, sin límite de entrada, sin a11y, sin botón copiar, scroll incompleto
  - Mejoras A-K organizadas por prioridad Alta/Media/Baja con estimación de esfuerzo

## Completado (2026-04-18) — Limpieza de código muerto, CSS y pruebas

- ✅ `ui.js`: eliminadas `obtenerTamanoPantalla()` (usaba jQuery, nunca llamada) y `largoMayor()` (planificada, nunca integrada)
- ✅ `asistentepoetico.css`: corregidas `--A400R` y `--A700R` (`#rgb(...)` → `rgb(...)`)
- ✅ `asistentepoetico.css`: eliminado `background-color: aqua` del bloque `body` por defecto
- ✅ `test-silabeo.js`: suite ampliada de 45 a 59 pruebas (grupos 9-12: esdrújulas, arte mayor, puntuación, sinalefas en versos largos)
- ✅ Deploy en https://asistentepoetico.web.app
- ✅ Push a GitHub (ambos repos)

## Completado (2026-04-18) — Bug crítico strict-mode en extraeVocales

- ✅ `vocales.js`: `palabraCopia = p` → `palabraCopia = p.split("")` (era string inmutable, se asignaba a índice → TypeError en módulos ES6)
- ✅ Suite de pruebas: 62/62 pasan — añadidos casos `hay amor`, `ley eterna`, `rey oscuro` que cubren 'y' como vocal en borde de sinalefa
- ✅ Deploy y push

---

## Refactor con motor MCP — 1 mayo 2026 ✅ COMPLETADO

### Qué se hizo

Reemplazo completo del motor poético (utils.js, vocales.js, silabeo.js, metrica.js) por la versión mejorada del proyecto `SERVIDOR MCP`. Se agregó `analizador.js` y un botón "Análisis completo" en la UI.

### Archivos modificados

| Archivo | Acción |
|---------|--------|
| `public/_backup/*` | Backup de los 4 archivos originales del motor |
| `public/utils.js` | Reemplazado con versión MCP (vCH simplificado, nuevoArreglo corregido, JSDoc) |
| `public/vocales.js` | Reemplazado con versión MCP (sinalefa/hiato con Set O(1), 3 bugs de `;` corregidos, triptongo dFd) |
| `public/silabeo.js` | Reemplazado con versión MCP (imports limpios, variables muertas eliminadas, guía triplicado arreglado) |
| `public/metrica.js` | Reemplazado con versión MCP (tipoSina como parámetro, bug sinalefaDosPalabras corregido, sin código muerto) |
| `public/analizador.js` | Nuevo: análisis completo de poemas (rima, métrica, 19 formas, sugerencias) |
| `public/index.html` | Botón "Análisis completo" + sección `<pre>` para resultados |
| `public/ui.js` | Import y función `analisisCompleto()` |
| `public/asistentepoetico.js` | Listener para el nuevo botón |
| `public/package.json` | Agregado `"type": "module"` |

### Bugs corregidos (heredados de la versión anterior)

| Bug | Ubicación | Corrección |
|-----|-----------|------------|
| `if (match("h"));` — 3 ocurrencias | `vocales.js` | `;` eliminado |
| `sinalefaDosPalabras` chequeaba `vocalesPalUno` 2 veces | `metrica.js` | Corregido a `vocalesPalDos` |
| `tipoSina` variable global mutable | `metrica.js` | Pasado como parámetro a `obtenerSilabas()` |
| Doble llamada a `determinaAcentoPalabra` | `metrica.js` | Resultado almacenado en variable |
| `cadena == "guía"` triplicado | `silabeo.js` | Simplificado a `!==` |
| Triptongo dFd (iai, uai) no soportado | `vocales.js` | Agregado caso 3/4 |
| `úe` duplicado, faltaba `úo` en `hiato()` | `vocales.js` | Corregido con Set |

### Verificación

- ESLint: 0 errores
- Node.js: `analizarPoema()`, `analizarVerso()`, `extraerRimaPalabra()`, `validarMetrica()`, `escanearPoema()` funcionan
- `ui.js`: las 5 funciones exportadas cargan correctamente
- Firebase serve: HTML y JS se sirven correctamente en localhost
- `principal()` (botón Iniciar): sin cambios, compatible con nuevo motor
- Backup disponible en `public/_backup/` para rollback

### NO desplegado a producción

Pendiente verificación visual en navegador (firebase serve) antes de hacer `firebase deploy`.

---

## Por dónde seguir

1. **Probar en navegador** con `firebase serve` — verificar botón "Iniciar" y "Análisis completo" visualmente
2. **Deploy** a `asistentepoetico.web.app` cuando esté verificado
3. **Mejorar UI de resultados** — reemplazar `<pre>` JSON por tabla HTML estilizada
4. **Agregar agente IA** — página `agente.html` con chat + Anthropic API + tools
