// Copia el CATÁLOGO de Mia Store a Asteria Store (productos, estilos y categorías) con sus fotos y videos.
// NO copia ventas, compras, caja, gastos, cuadres ni pedidos: Asteria empieza en cero.
// El stock llega en 0: se carga registrando una compra (o "Reponer" en Bodega) en el panel de Asteria.
//
// Uso (desde la carpeta del proyecto, Node 20+):
//   ORIGEN_URL=https://xxxx.supabase.co ORIGEN_KEY=<anon de Mia> \
//   DESTINO_URL=https://yyyy.supabase.co DESTINO_SERVICE_KEY=<service_role de Asteria> \
//   node scripts/copiar-catalogo.mjs
//
// Opcional: SOLO=slug1,slug2  copia solo esos productos (si no, copia todos y luego borras los que no quieras).
// La clave service_role se queda en tu computadora: no la subas a GitHub ni la pegues en el chat.

import { createClient } from "@supabase/supabase-js";

const { ORIGEN_URL, ORIGEN_KEY, DESTINO_URL, DESTINO_SERVICE_KEY, SOLO } = process.env;
if (!ORIGEN_URL || !ORIGEN_KEY || !DESTINO_URL || !DESTINO_SERVICE_KEY) {
  console.error("Faltan variables: ORIGEN_URL, ORIGEN_KEY, DESTINO_URL, DESTINO_SERVICE_KEY");
  process.exit(1);
}
if (ORIGEN_URL === DESTINO_URL) {
  console.error("ORIGEN y DESTINO son el mismo proyecto. Revisa las URLs.");
  process.exit(1);
}

const BUCKET = "productos";
const origen = createClient(ORIGEN_URL, ORIGEN_KEY);
const destino = createClient(DESTINO_URL, DESTINO_SERVICE_KEY);

const marca = `/storage/v1/object/public/${BUCKET}/`;
const cache = new Map();

/** Pasa un archivo del Storage de Mia al de Asteria y devuelve la URL nueva. */
async function moverArchivo(url) {
  if (!url) return url;
  if (cache.has(url)) return cache.get(url);
  const i = url.indexOf(marca);
  if (i === -1) return url; // no es del Storage de Mia: se deja igual
  const ruta = decodeURIComponent(url.slice(i + marca.length).split("?")[0]);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No pude descargar ${url} (${res.status})`);
  const tipo = res.headers.get("content-type") ?? "application/octet-stream";
  const { error } = await destino.storage.from(BUCKET).upload(ruta, Buffer.from(await res.arrayBuffer()), {
    contentType: tipo,
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw new Error(`No pude subir ${ruta}: ${error.message}`);
  const nueva = destino.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
  cache.set(url, nueva);
  return nueva;
}

const moverLista = (urls = []) => Promise.all(urls.map(moverArchivo));

async function leer(tabla, filtro) {
  let q = origen.from(tabla).select("*");
  if (filtro) q = filtro(q);
  const { data, error } = await q;
  if (error) throw new Error(`Leyendo ${tabla}: ${error.message}`);
  return data ?? [];
}

async function escribir(tabla, filas, conflicto) {
  if (!filas.length) return;
  const { error } = await destino.from(tabla).upsert(filas, { onConflict: conflicto });
  if (error) throw new Error(`Escribiendo ${tabla}: ${error.message}`);
}

const solo = SOLO ? SOLO.split(",").map((s) => s.trim()).filter(Boolean) : null;

console.log("1/3 Categorías…");
const categorias = await leer("categories");
await escribir("categories", categorias, "id");
console.log(`    ${categorias.length} categorías`);

console.log("2/3 Productos y fotos…");
const productos = await leer("products", solo ? (q) => q.in("slug", solo) : undefined);
const filasProductos = [];
for (const [n, p] of productos.entries()) {
  process.stdout.write(`    [${n + 1}/${productos.length}] ${p.name}\r`);
  filasProductos.push({
    ...p,
    images: await moverLista(p.images),
    video_url: await moverArchivo(p.video_url),
    stock: 0,
  });
}
await escribir("products", filasProductos, "id");
console.log(`\n    ${filasProductos.length} productos`);

console.log("3/3 Estilos…");
const ids = productos.map((p) => p.id);
const estilos = ids.length ? await leer("product_variants", (q) => q.in("product_id", ids)) : [];
const filasEstilos = [];
for (const v of estilos) filasEstilos.push({ ...v, images: await moverLista(v.images), stock: 0 });
await escribir("product_variants", filasEstilos, "id");
console.log(`    ${filasEstilos.length} estilos`);

console.log(`\nListo. Fotos copiadas: ${cache.size}. Ahora registra tu stock inicial en el panel de Asteria (Bodega → Reponer).`);
