# Reporte de Bugs — Asistente Poetico Original

> Proyecto: `WEB/ASISTENTE POETICO ULTIMA VERSION`
> Fecha: 30 de abril de 2026
> Estado: Bugs heredados sin corregir
> Arquitectura: Firebase Hosting (100% client-side)

---

## Arquitectura

El Asistente Poetico se despliega en **Firebase Hosting**. Los archivos `.js` se sirven como estáticos y se ejecutan **en el navegador del cliente**. No hay servidor Node.js backend que ejecute código poético.

Esto significa:
- Cada usuario tiene **su propia copia** de las variables globales (`tipoSina`, etc.) en su navegador.
- No hay estado compartido entre clientes.
- El código corre en el `window` de cada pestaña.

---

## Resumen

Se encontraron **6 bugs** en el motor poético (`public/vocales.js`, `public/metrica.js`, `public/silabeo.js`). **Ninguno produce errores visibles en producción** con inputs reales en español, pero todos merecen corrección por higiene del código.

---

## Bug 1–3: `if (match);` — Semicolón huérfano (3 ocurrencias)

| Archivo | Línea | Función |
|---------|-------|---------|
| `public/vocales.js` | 92 | `hiato()` |
| `public/vocales.js` | 275 | `tresVocales()` |
| `public/vocales.js` | 329 | `cuatroVocales()` |

### Código actual (erróneo)
```js
if (dip.match("h"));
{
  dip = dip.replace("h", "");
}
```

### Problema
El `;` después del `if` cierra la sentencia condicional. El bloque `{ replace }` se ejecuta **siempre**, haya `h` o no.

### Impacto real en producción
**Nulo.** `replace("h", "")` sobre una cadena sin `h` no cambia nada (es no-op). Cuando la cadena sí tiene `h`, la elimina — que es exactamente lo correcto. **El resultado final es idéntico con o sin el bug.**

### ¿Se puede evidenciar con versos?
**No.** No existe ningún verso en español que produzca output diferente por este bug.

---

## Bug 4: Variable equivocada en sinalefa 2+2

| Archivo | Línea | Función |
|---------|-------|---------|
| `public/metrica.js` | 292 | `sinalefaDosPalabras()` |

### Código actual (erróneo)
```js
} else if (largoVocalesUno == 2 && largoVocalesDos == 2) {
  sinalefaa1 = !hiato(vocalesPalUno);
  sinalefaa2 = !hiato(vocalesPalUno);  // ← debería ser vocalesPalDos
  sinalefaa = sinalefaa1 && sinalefaa2;
  return sinalefaa;
}
```

### Problema
En el caso raro de 2 vocales + 2 vocales entre palabras, se evalúa la palabra 1 dos veces. La palabra 2 nunca se analiza.

### Impacto real en producción
**Extremadamente bajo.** Requiere que:
1. La palabra 1 termine con 2 vocales en su última sílaba (ej: "fue" → "ue")
2. La palabra 2 empiece con 2 vocales en su primera sílaba (ej: "aire" → "ai")
3. Una de las dos sea hiato y la otra no

Este escenario es prácticamente inexistente en español porque si dos vocales forman hiato al inicio de una palabra, pertenecen a sílabas distintas, así que la primera sílaba solo tiene 1 vocal.

### ¿Se puede evidenciar con versos?
**No.** Se intentaron casos como `"fue aire"`, `"trae eterno"`, pero el resultado con y sin bug es idéntico.

---

## Bug 5: Variable global mutable `tipoSina`

| Archivo | Línea |
|---------|-------|
| `public/metrica.js` | 6 |

### Código actual
```js
let tipoSina = 2;
```

### Problema
Se usa `tipoSina` como variable global que cambia entre `2` y `3` dentro de `segundo()` según si analiza sinalefas de 2 o 3 palabras.

### Impacto real en producción
**NULO para el Asistente Poetico actual.**

**¿Por qué no afecta con dos clientes en IPs diferentes?**

Porque Firebase Hosting sirve archivos estáticos. Cada usuario descarga `metrica.js` y lo ejecuta en **su propio navegador**. Cada navegador tiene su propio `window`, su propio scope global, su propia variable `tipoSina`. No hay un proceso servidor compartido.

```
Cliente A (IP 1.2.3.4)           Cliente B (IP 5.6.7.8)
┌──────────────────────┐         ┌──────────────────────┐
│ Browser A            │         │ Browser B            │
│  tipoSina = 2        │         │  tipoSina = 2        │
│  tipoSina = 3 (local)│         │  tipoSina = 3 (local)│
│  (sin interferencia) │         │  (sin interferencia) │
└──────────────────────┘         └──────────────────────┘
       ↕                               ↕
       Firebase Hosting (solo archivos estáticos, no ejecuta JS del motor)
```

**¿Cuándo SÍ sería un problema?**

Solo si `metrica.js` se ejecutara en un **servidor Node.js** con múltiples requests simultáneos en el mismo proceso. Eso es exactamente lo que pasa en el **SERVIDOR MCP** (donde este bug ya fue corregido).

### ¿Se puede evidenciar con versos?
**No.** No importa cuántos versos envíes. Se necesitarían dos peticiones simultáneas al mismo proceso servidor.

---

## Bug 6: Condicional duplicado 3 veces

| Archivo | Línea | Función |
|---------|-------|---------|
| `public/silabeo.js` | 416 | `triptongoSilaba()` |

### Código actual
```js
if (!(cadena == "guía" || cadena == "guía" || cadena == "guía")) {
```

### Problema
La misma comparación se repite 3 veces. Equivale exactamente a `cadena !== "guía"`.

### Impacto real en producción
**Nulo.** Solo es redundancia visual.

---

## Resumen de impacto real

| Bug | ¿Afecta output? | ¿Evidenciable con versos? | Tipo |
|-----|-----------------|--------------------------|------|
| 1–3: `if (match);` | ❌ No | ❌ No | Deuda técnica |
| 4: `vocalesPalUno`/`Dos` | ❌ No (caso imposible en español) | ❌ No | Bug dormido |
| 5: `tipoSina` global | ❌ No (client-side, cada usuario tiene su copia) | ❌ No | Riesgo solo en servidor |
| 6: duplicado `guía` | ❌ No | ❌ No | Código sucio |

---

## Por dónde corregir

Los mismos bugs ya fueron corregidos en el proyecto hermano `SERVIDOR MCP`. Las correcciones se pueden portar directamente:

1. Eliminar `;` tras `if (match)` en `vocales.js` (3 lugares)
2. Cambiar `vocalesPalUno` → `vocalesPalDos` en `metrica.js:292`
3. Pasar `tipoSina` como parámetro en lugar de variable global
4. Simplificar a `cadena !== "guía"` en `silabeo.js:416`
