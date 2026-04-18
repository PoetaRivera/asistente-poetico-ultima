# Plan de Refactor — Asistente Poético

## Objetivo
Comentar, documentar y reorganizar el código en módulos ES6 por etapas,
sin romper la funcionalidad existente. Después de cada etapa: deploy.

## Estado actual (2026-04-18)
- 45/45 pruebas funcionales pasan ✅
- Bugs corregidos (ver siguimiento-fase1.md)
- Código funcional desplegado en https://asistentepoetico.web.app

---

## Etapa 1 — Funciones de utilidad ✅ (2026-04-18)
Funciones simples, sin dependencias complejas. Punto de entrada ideal.

| Función | Descripción |
|---------|-------------|
| `invertirPalabra` | Invierte una cadena carácter a carácter |
| `vCH` | Clasifica un carácter: vocal (v), consonante (c) o h |
| `nuevoArreglo` | Compacta un arreglo eliminando vacíos |
| `depurarVerso` | Limpia un verso: minúsculas, elimina caracteres no válidos |

---

## Etapa 2 — Análisis de vocales ✅ (2026-04-18)
Funciones que determinan relaciones entre vocales.

| Función | Descripción |
|---------|-------------|
| `extraeVocales` | Extrae la secuencia de vocales al final de una sílaba |
| `hiato` | Determina si dos vocales forman hiato |
| `sinalefa` | Determina si dos vocales forman sinalefa (2 palabras, 2 vocales) |
| `triSinalefa` | Determina sinalefa entre tres vocales |
| `tresVocales` | Determina el caso de tres vocales seguidas (triptongo) |
| `cuatroVocales` | Determina el caso de cuatro vocales seguidas |

---

## Etapa 3 — Silabeo base ✅ (2026-04-18)
El corazón del algoritmo. La función más compleja del proyecto.

| Función | Descripción |
|---------|-------------|
| `separaPalabra` | Separa una palabra en sílabas usando patrones de secuencia (vcv, vccv...) |

---

## Etapa 4 — Diptongos y triptongos ✅ (2026-04-18)
Correcciones sobre el silabeo base para casos especiales de vocales juntas.

| Función | Descripción |
|---------|-------------|
| `cuatroSilaba` | Maneja secuencias de 4 vocales seguidas |
| `triptongoSilaba` | Detecta y ajusta triptongos dentro de sílabas |
| `hiatoSilaba` | Detecta hiatos y divide sílabas cuando corresponde |

---

## Etapa 5 — Sinalefas poéticas ✅ (2026-04-18)
Lógica de unión de vocales entre palabras del verso.

| Función | Descripción |
|---------|-------------|
| `sinalefaDosPalabras` | Detecta sinalefa entre dos palabras contiguas |
| `sinalefaTresPalabras` | Detecta sinalefa entre tres palabras cuando la del medio es corta |
| `obtenerSilabas` | Extrae las sílabas relevantes para analizar sinalefa |
| `segundo` | Orquesta todo el análisis poético de un verso |

---

## Etapa 6 — Núcleo principal y UI ✅ (2026-04-18)
Conteo final, acento y control de la interfaz.

| Función | Descripción |
|---------|-------------|
| `leerVerso` | Procesa un verso completo: llama separaPalabra + diptongos + hiatos |
| `determinaAcentoPalabra` | Clasifica una palabra: aguda (1), llana (0), esdrújula (-1) |
| `contarSilabasOrtografico` | Cuenta sílabas ortográficas de un verso |
| `contarSilabasPoetico` | Calcula el ajuste poético (sinalefas + acento final) |
| `principal` | Función principal: lee entrada, procesa y muestra resultados |
| `limpiar` | Limpia todos los textarea y reinicia estado |
| `ampliarVentanas` | Ajusta altura de los textarea al contenido |

---

## Pendientes además del comentado

- [ ] Decidir qué hacer con `funciones.js` (está huérfano, no se importa)
- [ ] Convertir a módulos ES6 (después de que todo esté comentado)
- [ ] Agregar más casos de prueba en `test-silabeo.js`

---

## Reglas para el comentado
1. Comentar el **por qué**, no el qué (el código ya dice qué hace)
2. Al inicio de cada función: una línea con **entrada** y **salida**
3. Comentar los casos especiales y excepciones lingüísticas
4. No borrar lógica, solo documentar
5. Después de cada etapa: correr las 45 pruebas y hacer deploy
