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
// para que las funciones queden en el scope global.
// IMPORTANTE: el eval debe ejecutarse en scope global (no dentro de función).
const fs = require("fs");
const prep = p => fs.readFileSync(p,"utf8").replace(/\r\n/g,"\n").replace(/export\s+function/g,"function").replace(/^import\s+.*from\s+.*;\n?/gm,"");

eval(prep("./public/utils.js"));
eval(prep("./public/vocales.js"));
eval(prep("./public/silabeo.js"));
eval(prep("./public/metrica.js"));
eval(prep("./public/ui.js"));

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

console.log("\n═══ 9. Silabeo — esdrújulas ═══");

check("pájaro → pá/ja/ro",        silabasOrtograficas("pájaro"),      "pá/ja/ro");
check("médico → mé/di/co",        silabasOrtograficas("médico"),      "mé/di/co");
check("ábaco → á/ba/co",          silabasOrtograficas("ábaco"),       "á/ba/co");
check("último → úl/ti/mo",        silabasOrtograficas("último"),      "úl/ti/mo");
check("música → mú/si/ca",        silabasOrtograficas("música"),      "mú/si/ca");
check("cántico → cán/ti/co",      silabasOrtograficas("cántico"),     "cán/ti/co");

console.log("\n═══ 10. Conteo ortográfico — versos de arte mayor ═══");

// nues/tras=2, vi/das=2, son=1, los=1, rí/os=2 → 8
check("'nuestras vidas son los ríos' = 8 sílabas",
  contaOrto("nuestras vidas son los ríos"), 8);

// del=1, sa/lón=2, en=1, el=1, án/gu/lo=3, os/cu/ro=3 → 11
check("'del salón en el ángulo oscuro' = 11 sílabas",
  contaOrto("del salón en el ángulo oscuro"), 11);

// a/mar=2, es=1, per/der=2, es=1, ga/nar=2 → 8
check("'amar es perder es ganar' = 8 sílabas",
  contaOrto("amar es perder es ganar"), 8);

console.log("\n═══ 11. Puntuación y depuración ═══");

check("'amor,' = 2 sílabas (coma ignorada)",     contaOrto("amor,"),     2);
check("'¡sol!' = 1 sílaba (signos ignorados)",   contaOrto("¡sol!"),     1);
check("'árbol.' = 2 sílabas (punto ignorado)",   contaOrto("árbol."),    2);

console.log("\n═══ 12. Sinalefas en versos más largos ═══");

// mi=1, al/ma=2, es=1, tu/ya=2 → orto=6
// sinalefa: mi+alma → -1; alma+es → -1; tuya es llana → sin ajuste
// total poético = 4
check("'mi alma es tuya' = 4 sílabas poéticas",  contaPoetico("mi alma es tuya"),   4);

// la=1, i/de/a=3, e/ter/na=3 → orto=7
// sinalefa: la+idea → -1; idea+eterna → "a+e" → -1
// "eterna" llana → sin ajuste → 5
check("'la idea eterna' = 5 sílabas poéticas",   contaPoetico("la idea eterna"),    5);

// ─── Resultado final ──────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Total: ${passed + failed} pruebas | ✅ ${passed} pasaron | ❌ ${failed} fallaron`);
console.log(`${"─".repeat(50)}\n`);
