# Plan — Conversión a Módulos ES6

## Estado de partida
- `asistentepoetico.js` es un script clásico (~2200 líneas, todo en un archivo)
- `index.html` lo carga con `<script src="asistentepoetico.js">` (sin type="module")
- Variables globales compartidas: `tipoSina`, `ampliar`, `tamanoInicialVentana`
- Test runner usa `eval(code)` para cargar el archivo

## Estrategia
Partir el archivo en módulos por capas de dependencia (sin dependencias circulares).
`asistentepoetico.js` se convierte en el punto de entrada que importa todo.
Después de cada etapa: correr las 45 pruebas + deploy + push.

---

## Módulos previstos

| Archivo | Funciones | Depende de |
|---------|-----------|------------|
| `utils.js` | `depurarVerso`, `invertirPalabra`, `vCH`, `nuevoArreglo` | — |
| `vocales.js` | `extraeVocales`, `hiato`, `sinalefa`, `triSinalefa`, `tresVocales`, `cuatroVocales` | utils |
| `silabeo.js` | `separaPalabra`, `cuatroSilaba`, `triptongoSilaba`, `hiatoSilaba` | utils, vocales |
| `sinalefas.js` | `extraerSilabas`, `obtenerSilabas`, `sinalefaDosPalabras`, `sinalefaTresPalabras` | utils, vocales |
| `metrica.js` | `leerVerso`, `determinaAcentoPalabra`, `contarSilabasOrtografico`, `contarSilabasPoetico`, `segundo` | utils, vocales, silabeo, sinalefas |
| `ui.js` | `principal`, `leerFila`, `limpiar`, `ampliarVentanas` | metrica |

---

## Etapas

### Etapa A — utils.js ✅ (2026-04-18)
Sin dependencias externas. Punto de entrada seguro.
1. Crear `public/utils.js` con export de las 4 funciones
2. En `asistentepoetico.js`: borrar esas 4 funciones, agregar import
3. Cambiar `<script src>` a `<script type="module" src>` en index.html
4. Actualizar test-silabeo.js para importar con require() o reescribir

### Etapa B — vocales.js
Depende solo de utils. Segunda capa más simple.
1. Crear `public/vocales.js` con export de las 6 funciones
2. En `asistentepoetico.js`: borrar + agregar import

### Etapa C — silabeo.js
Depende de utils + vocales. Capa más pesada (separaPalabra es la función central).
1. Crear `public/silabeo.js`
2. En `asistentepoetico.js`: borrar + agregar import

### Etapa D — sinalefas.js + metrica.js + ui.js
Las tres capas finales. Se pueden hacer una por una o juntas.

---

## Consideraciones importantes

### Variables globales (`tipoSina`, `ampliar`, `tamanoInicialVentana`)
`tipoSina` es usada por `obtenerSilabas()` (en sinalefas.js) pero se asigna desde `segundo()` (en metrica.js).
Opciones:
- **Opción A** (mínimo cambio): dejarlas en `asistentepoetico.js` y pasarlas como parámetro donde se necesiten
- **Opción B**: crear `state.js` con un objeto compartido exportado
Se recomienda Opción A para no romper la lógica existente.

### Test runner (`test-silabeo.js`)
Actualmente usa `eval(fs.readFileSync(...))` — funciona con script clásico pero no con módulos ES6.
Al convertir a módulos, el test runner deberá usar `import()` dinámico o reescribirse con Jest/Vitest.
**Solución simple**: mantener un `asistentepoetico.js` que re-exporte todo para que el test siga funcionando.

### index.html
Cambiar `<script src="asistentepoetico.js">` → `<script type="module" src="asistentepoetico.js">`.
Con type="module" el script se ejecuta en diferido (defer implícito), lo cual es mejor.
Los event listeners del DOM funcionarán igual.

---

## Reglas
1. Una etapa a la vez — deploy tras cada una
2. No cambiar lógica, solo mover funciones
3. Las 45 pruebas deben pasar después de cada etapa
