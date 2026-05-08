# Limitaciones y Posibles Mejoras — Asistente Poético

## Estado actual (2026-04-18)
- 45/45 pruebas pasan
- Código modularizado en ES6 (utils, vocales, silabeo, metrica, ui)
- Desplegado en https://asistentepoetico.web.app

---

## Limitaciones conocidas

### 1. Algoritmo lingüístico

| # | Limitación | Detalle |
|---|-----------|---------|
| 1 | **Diéresis española no manejada** | `güe` y `güi` contienen `ü` que actúa como vocal en esa posición (la "u" suena), pero el algoritmo trata `ü` como préstamo extranjero y puede silabear mal palabras como "pingüino" o "vergüenza". |
| 2 | **`vhvvv` no implementado** | En `cuatroSilaba` el patrón `v+h+vvv` (ej. vocal + h + triptongo) está detectado pero el bloque de código está vacío. Es un caso raro en español pero queda sin resolver. |
| 3 | **Acento diacrítico no siempre considerado** | `determinaAcentoPalabra` asume que la tilde indica acento. Monosílabos con tilde diacrítica (él, tú, sí, más) se clasifican incorrectamente como esdrújulos o agudos cuando lingüísticamente no tienen efecto en el conteo métrico. |
| 4 | **Sinalefa forzada entre fuertes** | El algoritmo acepta sinalefa entre vocales fuertes (a-e, e-o, etc.) siguiendo la RAE moderna. Algunos profesores o métricas clásicas no la aceptan. No hay opción para elegir el criterio. |
| 5 | **Préstamos e hipocorísticos** | Palabras como "football", "show", "jazz" pasan por `depurarVerso` y quedan como "football", "show", "jazz" — el silabeo puede fallar porque el algoritmo asume patrones del español. |
| 6 | **Palabras con mayúsculas internas** | "iPhone", "macOS", "WiFi" se convierten a minúsculas pero el silabeo puede fallar por las combinaciones de letras no españolas. |

---

### 2. Código y arquitectura

| # | Limitación | Detalle |
|---|-----------|---------|
| 1 | **`tipoSina` es estado mutable de módulo** | En `metrica.js`, `tipoSina` es una variable de nivel módulo que se escribe en `segundo()` y se lee en `obtenerSilabas()`. Si en el futuro se procesa más de un verso en paralelo, puede haber condiciones de carrera. |
| 2 | **`obtenerTamanoPantalla` usa jQuery** | La función llama `body.css("height", ...)` (sintaxis jQuery) pero jQuery no está cargado. La función nunca se llama desde ningún lugar — es código muerto. |
| 3 | **`largoMayor` no se usa** | Función en `ui.js` que calcula el verso más largo de un poema. Fue planificada pero nunca integrada a la UI. |
| 4 | **Comentarios del código original jQuery** | Quedan líneas comentadas con `.val()` en `metrica.js` (restos de cuando el código usaba jQuery). Son inofensivas pero acumulan deuda técnica. |
| 5 | **CSS con variable inválida** | `--A400R` y `--A700R` tienen el valor `#rgb(...)` que es inválido. Solo se usan en la raíz y no tienen efecto visible, pero están mal definidas. |
| 6 | **`body` por defecto tiene `background-color: aqua`** | En `asistentepoetico.css` hay un bloque `body { background-color: aqua; }` que fue puesto probablemente para pruebas. Las media queries de color-scheme lo sobreescriben, pero es confuso. |
| 7 | **Test runner usa `eval()`** | El runner carga módulos con `eval()` previo stripping de `import/export`. Es frágil: si una función usa un template literal con backticks especiales o código dinámico, puede fallar. La solución correcta es usar Jest o Vitest con soporte ESM. |

---

### 3. UX / Interfaz

| # | Limitación | Detalle |
|---|-----------|---------|
| 1 | **Sin indicador de carga** | Para poemas largos, el procesamiento es síncrono y bloquea el hilo principal. No hay spinner ni indicación de que está trabajando. |
| 2 | **Sin límite de entrada** | El textarea de entrada no tiene límite de caracteres. Un poema muy largo puede lentificar o congelar la página. |
| 3 | **Sin accesibilidad (a11y)** | No hay atributos `aria-label` en los textarea ni en los botones. Los lectores de pantalla no pueden describir el propósito de cada panel. |
| 4 | **Sin modo de copiado fácil** | El usuario no puede copiar los resultados con un botón — debe seleccionar y copiar manualmente. |
| 5 | **La sincronización de scroll está incompleta** | Solo se sincronizan outtext1↔outtext2 y outtext3↔outtext4. Si el usuario hace scroll en outtext2 o outtext4 sin pasar por outtext1/3, la sincronización no funciona en ese sentido. |

---

## Posibles mejoras

### Prioridad alta (afectan la precisión lingüística)

#### A. Soporte de diéresis española
Agregar `ü` en la secuencia de vocales del español para las palabras `güe` y `güi`:
- En `vocales.js`: incluir `ü` en los arreglos de vocales
- En `silabeo.js`: tratar `gü` como un grupo especial antes de vocal

#### B. Eliminar código muerto
- Borrar `obtenerTamanoPantalla()` de `ui.js` (usa jQuery, nunca se llama)
- Borrar `largoMayor()` de `ui.js` o integrarla si hay un caso de uso
- Limpiar comentarios `.val()` en `metrica.js`

#### C. Corregir variables CSS inválidas
Cambiar en `asistentepoetico.css`:
```css
--A400R: rgb(118, 255, 3);    /* era: #rgb(118, 255, 3)  */
--A700R: rgb(100, 221, 23);   /* era: #rgb(100, 221, 23) */
```
Y eliminar el `background-color: aqua` del bloque `body` por defecto.

---

### Prioridad media (mejoran la robustez)

#### D. Eliminar `tipoSina` como variable de módulo
Pasar `tipoSina` como parámetro a `obtenerSilabas()`:
```js
// Antes:
tipoSina = 2;
obtenerSilabas(palabras);

// Después:
obtenerSilabas(palabras, 2);
```
Esto elimina el estado mutable compartido y hace las funciones más predecibles.

#### E. Migrar el test runner a Vitest o Jest (ESM)
El runner actual con `eval()` es frágil. Vitest tiene soporte nativo para módulos ES6:
```bash
npm install -D vitest
# test-silabeo.js se convierte en test-silabeo.test.js con imports normales
```

#### F. Añadir más casos de prueba
El suite actual tiene 45 casos pero faltan:
- Palabras con diéresis: `pingüino`, `vergüenza`
- Versos esdrújulos: `cántico`, `música`
- Versos con más de 3 palabras y trisinalefa
- Versos de arte mayor (11+ sílabas)
- Casos límite: verso vacío, una sola letra, signos de puntuación solos

---

### Prioridad baja (mejoras de UX y arquitectura futura)

#### G. Procesamiento asíncrono para poemas largos
Usar `setTimeout(..., 0)` o `requestIdleCallback` para no bloquear la UI:
```js
async function principal() {
  for (const verso of filas) {
    await new Promise(r => setTimeout(r, 0)); // libera el hilo
    // procesar verso
  }
}
```

#### H. Botón "Copiar resultado"
Agregar un botón que copie el contenido de cada panel al portapapeles usando `navigator.clipboard.writeText()`.

#### I. Opción de criterio de sinalefa
Un checkbox o selector que permita elegir entre:
- Modo RAE moderno (fuerte+fuerte = sinalefa válida)
- Modo clásico (fuerte+fuerte = hiato)

#### J. Accesibilidad básica
Agregar atributos `aria-label` a los textarea y `role` a las secciones:
```html
<textarea aria-label="Verso de entrada" ...></textarea>
<textarea aria-label="Sílabas ortográficas" readonly ...></textarea>
```

#### K. PWA / uso offline
El sitio ya está en Firebase Hosting. Con un `service-worker.js` básico los usuarios podrían usarlo sin conexión (el algoritmo es 100% local, no usa APIs externas).

---

## Resumen de deuda técnica por prioridad

| Prioridad | Ítem | Esfuerzo |
|-----------|------|----------|
| Alta | Soporte `güe`/`güi` | Medio |
| Alta | Eliminar código muerto (obtenerTamanoPantalla, largoMayor) | Bajo |
| Alta | Corregir CSS (`#rgb`, `aqua`) | Bajo |
| Media | Eliminar `tipoSina` como estado mutable | Medio |
| Media | Migrar test runner a Vitest | Medio |
| Media | Ampliar casos de prueba | Bajo |
| Baja | Procesamiento asíncrono | Bajo |
| Baja | Botón copiar | Bajo |
| Baja | Opción criterio sinalefa | Alto |
| Baja | Accesibilidad aria | Bajo |
| Baja | PWA offline | Medio |
