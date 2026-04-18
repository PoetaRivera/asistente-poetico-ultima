// Script de pruebas funcionales del algoritmo de silabeo
// Ejecutar con: node test-silabeo.js

// Mock mínimo del DOM para que el archivo cargue sin errores
global.document = {
  addEventListener: () => {},
  getElementById: () => ({ disabled: false, value: "", scrollTop: 0, style: {} })
};
global.screen = { height: 768 };

// Cargar el algoritmo — compatible con módulos ES6 via eval:
// se eliminan las palabras clave import/export antes del eval
// para que las funciones queden disponibles en el scope global.
const fs = require("fs");

const utils = fs.readFileSync("./public/utils.js", "utf8")
  .replace(/export\s+function/g, "function")
  .replace(/^import\s+.*from\s+.*;\n?/gm, "");
eval(utils);

const vocales = fs.readFileSync("./public/vocales.js", "utf8")
  .replace(/export\s+function/g, "function")
  .replace(/^import\s+.*from\s+.*;\n?/gm, "");
eval(vocales);

const code = fs.readFileSync("./public/asistentepoetico.js", "utf8")
  .replace(/^import\s+.*from\s+.*;\n?/gm, "");
eval(code);

// ─── Utilidades ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function check(descripcion, obtenido, esperado) {
  const ok = obtenido === esperado;
  if (ok) {
    console.log(`  ✅ ${descripcion}`);
    passed++;
  } else {
    console.log(`  ❌ ${descripcion}`);
    console.log(`     Esperado : "${esperado}"`);
    console.log(`     Obtenido : "${obtenido}"`);
    failed++;
  }
}

function silabasOrtograficas(palabra) {
  const resultado = leerVerso(palabra);
  return resultado.join(" ");
}

function silabasVerso(verso) {
  const resultado = leerVerso(verso);
  return resultado.join(" ");
}

function contaOrto(verso) {
  const palabras = leerVerso(verso);
  return contarSilabasOrtografico(palabras, "/");
}

function contaPoetico(verso) {
  const palabras = leerVerso(verso);
  const orto = contarSilabasOrtografico(palabras, "/");
  const poeticas = leerVerso(depurarVerso(verso));
  const resultado = segundo(verso);
  const poetic = contarSilabasPoetico(resultado);
  return orto + poetic;
}

// ─── 1. Silabeo de palabras individuales ──────────────────────────────────────

console.log("\n═══ 1. Silabeo ortográfico — palabras simples ═══");

check("casa → ca/sa",          silabasOrtograficas("casa"),      "ca/sa");
check("libro → li/bro",        silabasOrtograficas("libro"),     "li/bro");
check("árbol → ár/bol",        silabasOrtograficas("árbol"),     "ár/bol");
check("perro → pe/rro",        silabasOrtograficas("perro"),     "pe/rro");
check("carro → ca/rro",        silabasOrtograficas("carro"),     "ca/rro");
check("clase → cla/se",        silabasOrtograficas("clase"),     "cla/se");
check("brillo → bri/llo",      silabasOrtograficas("brillo"),    "bri/llo");
check("grato → gra/to",        silabasOrtograficas("grato"),     "gra/to");
check("triste → tris/te",      silabasOrtograficas("triste"),    "tris/te");
check("blanco → blan/co",      silabasOrtograficas("blanco"),    "blan/co");

console.log("\n═══ 2. Silabeo — diptongos ═══");

check("aire → ai/re",          silabasOrtograficas("aire"),      "ai/re");
check("cielo → cie/lo",        silabasOrtograficas("cielo"),     "cie/lo");
check("ciudad → ciu/dad",      silabasOrtograficas("ciudad"),    "ciu/dad");
check("pueblo → pue/blo",      silabasOrtograficas("pueblo"),    "pue/blo");
check("fuego → fue/go",        silabasOrtograficas("fuego"),     "fue/go");
check("peine → pei/ne",        silabasOrtograficas("peine"),     "pei/ne");
check("aula → au/la",          silabasOrtograficas("aula"),      "au/la");
check("deuda → deu/da",        silabasOrtograficas("deuda"),     "deu/da");

console.log("\n═══ 3. Silabeo — hiatos ═══");

check("poema → po/e/ma",       silabasOrtograficas("poema"),     "po/e/ma");
check("teatro → te/a/tro",     silabasOrtograficas("teatro"),    "te/a/tro");
check("maíz → ma/íz",          silabasOrtograficas("maíz"),      "ma/íz");
check("reír → re/ír",          silabasOrtograficas("reír"),      "re/ír");
check("país → pa/ís",          silabasOrtograficas("país"),      "pa/ís");
check("caer → ca/er",          silabasOrtograficas("caer"),      "ca/er");

console.log("\n═══ 4. Silabeo — triptongos ═══");

check("buey → buey",           silabasOrtograficas("buey"),      "buey");
check("miau → miau",           silabasOrtograficas("miau"),      "miau");

console.log("\n═══ 5. Silabeo — palabras con h ═══");

check("ahora → a/ho/ra",       silabasOrtograficas("ahora"),     "a/ho/ra");
check("prohibir → prohi/bir (oi=diptongo a través de h)", silabasOrtograficas("prohibir"), "prohi/bir");
check("alcohol → al/co/hol",   silabasOrtograficas("alcohol"),   "al/co/hol");

console.log("\n═══ 6. Conteo ortográfico de versos ═══");

check("'amor' = 2 sílabas",            contaOrto("amor"),              2);
check("'casa' = 2 sílabas",            contaOrto("casa"),              2);
check("'poema' = 3 sílabas",           contaOrto("poema"),             3);
check("'amor eterno' = 5 sílabas",     contaOrto("amor eterno"),       5);
check("'el cielo azul' = 5 sílabas",   contaOrto("el cielo azul"),     5);
check("'ciudad eterna' = 5 sílabas",   contaOrto("ciudad eterna"),     5);

console.log("\n═══ 7. Acento de palabra ═══");
// 1=aguda, 0=llana, -1=esdrújula

check("'amor' = aguda (1)",            determinaAcentoPalabra("a/mor"),          1);
check("'casa' = llana (0)",            determinaAcentoPalabra("ca/sa"),          0);
check("'árbol' = llana (0)",           determinaAcentoPalabra("ár/bol"),         0);
check("'música' = esdrújula (-1)",     determinaAcentoPalabra("mú/si/ca"),      -1);
check("'cántico' = esdrújula (-1)",    determinaAcentoPalabra("cán/ti/co"),     -1);
check("'sol' = aguda (1)",             determinaAcentoPalabra("sol"),            1);

console.log("\n═══ 8. Conteo poético (con sinalefas) ═══");
// El conteo poético = ortográfico + ajuste por sinalefas y acento final

check("'mi alma' tiene sinalefa → 2 sílabas",   contaPoetico("mi alma"),    2);
check("'la aurora' tiene sinalefa → 3 sílabas", contaPoetico("la aurora"),  3);
check("'de oro' tiene sinalefa → 2 sílabas",    contaPoetico("de oro"),     2);
check("'lo oscuro' tiene sinalefa → 3 sílabas", contaPoetico("lo oscuro"),  3);

// ─── Resultado final ──────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Total: ${passed + failed} pruebas | ✅ ${passed} pasaron | ❌ ${failed} fallaron`);
console.log(`${"─".repeat(50)}\n`);
