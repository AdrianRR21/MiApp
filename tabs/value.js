/* PANTALLA: Value Investing
   Empresas con tu valor intrínseco, separadas en infravaloradas, bien valoradas y sobrevaloradas.
   Cada empresa lleva país y sector, y se puede filtrar por ambos.
   Cartera ficticia: cada vez que valoras una empresa y sale infravalorada, se "compra" a su precio de esa fecha.
   La "vendes" cuando tú decidas. Rentabilidad en %, cada empresa en su propia moneda.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .vi-seg { display:flex; border:1px solid var(--linea); border-radius:11px; padding:3px; margin-bottom:14px; }
  .vi-seg button { flex:1; min-width:0; display:flex; flex-direction:column; align-items:center; gap:1px; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:500; font-size:12.5px; padding:7px 2px; border-radius:8px; cursor:pointer; white-space:nowrap; }
  .vi-seg button.on { background:#1A1A1E; color:var(--tinta); }
  .vi-seg button i { font-style:normal; font-size:17px; font-weight:600; letter-spacing:-0.02em; color:inherit; order:-1; }
  .vi-seg button.on i { color:var(--naranja); }
  .vi-pos { color:#30D158; } .vi-neg { color:var(--rojo); }
  .vi-cartera { border:1px solid var(--linea); border-radius:14px; background:var(--papel); padding:18px; margin-bottom:12px; }
  .vi-cartera .cifra { font-size:38px; line-height:1.05; margin-top:2px; }
  .vi-cartera .sub { font-size:13.5px; color:var(--tinta-suave); margin-top:6px; line-height:1.5; }
  .vi-mini { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:14px; }
  .vi-mini div { background:var(--papel-2); border-radius:10px; padding:10px; }
  .vi-mini b { display:block; font-size:16px; font-weight:600; margin-top:2px; letter-spacing:-0.02em; }
  .vi-titulo { display:flex; align-items:center; gap:10px; font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--tinta-suave); margin:20px 2px 8px; }
  .vi-titulo::after { content:""; flex:1; height:1px; background:var(--linea); }
  .vi-emp { display:block; width:100%; text-align:left; font:inherit; color:inherit; background:var(--papel); border:1px solid var(--linea); border-radius:12px; padding:14px; margin-bottom:8px; cursor:pointer; }
  .vi-emp .l1 { display:flex; align-items:baseline; gap:8px; }
  .vi-emp .l1 b { font-weight:600; font-size:15.5px; letter-spacing:-0.01em; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .vi-emp .tk { font-size:12px; color:var(--tinta-suave); font-weight:600; letter-spacing:.04em; }
  .vi-emp .pot { font-weight:600; font-size:17px; letter-spacing:-0.02em; white-space:nowrap; }
  .vi-emp .l2 { display:flex; justify-content:space-between; gap:8px; font-size:12.5px; color:var(--tinta-suave); margin-top:4px; }
  .vi-barra { position:relative; height:4px; background:var(--papel-2); border-radius:2px; margin-top:10px; }
  .vi-barra i { position:absolute; top:-3px; width:2px; height:10px; border-radius:1px; }
  .vi-barra .fill { position:absolute; top:0; height:4px; border-radius:2px; }
  .vi-tag { display:inline-block; font-size:11.5px; font-weight:600; padding:2px 7px; border-radius:6px; background:var(--naranja-suave); color:var(--naranja); margin-top:8px; }
  .vi-tag.viejo { background:var(--papel-2); color:var(--tinta-suave); margin-left:4px; }
  .vi-pos-fila { display:flex; align-items:center; gap:10px; padding:11px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .vi-pos-fila:first-of-type { border-top:0; }
  .vi-pos-fila .izq { flex:1; min-width:0; }
  .vi-pos-fila .izq div:first-child { font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .vi-pos-fila .sub { font-size:12.5px; color:var(--tinta-suave); margin-top:2px; }
  .vi-pos-fila .der { font-weight:600; white-space:nowrap; text-align:right; }
  .vi-boton { width:100%; border:0; background:none; color:var(--naranja); box-shadow:inset 0 0 0 1px var(--naranja); font:inherit; font-weight:600; font-size:15px; padding:13px; border-radius:12px; cursor:pointer; margin-bottom:12px; }
  .vi-enlace { background:none; border:0; color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:500; padding:10px 0 0; cursor:pointer; }
  .vi-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .vi-form .dos { display:flex; gap:10px; }
  .vi-form .dos > div { flex:1; min-width:0; }
  .vi-grande { font-size:24px !important; font-weight:600; }
  .vi-calc { background:var(--papel-2); border-radius:10px; padding:11px 12px; margin-top:12px; font-size:14px; line-height:1.5; }
  .vi-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:14px; }
  .vi-grid div { background:var(--papel-2); border-radius:10px; padding:10px 12px; }
  .vi-grid b { display:block; font-size:17px; font-weight:600; margin-top:2px; }
  .vi-botones { display:flex; gap:8px; margin-top:14px; }
  .vi-botones button { flex:1; border:1px solid var(--linea); border-radius:10px; padding:11px 4px; font:inherit; font-weight:600; font-size:13.5px; cursor:pointer; background:none; color:var(--tinta); }
  .vi-botones button.pri { background:var(--naranja); border-color:var(--naranja); color:#000; }
  .vi-grupo { font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--tinta-suave); margin:18px 0 4px; }
  .vi-hist { display:flex; align-items:center; gap:10px; padding:9px 0; border-top:1px solid var(--linea); font-size:14px; }
  .vi-hist .izq { flex:1; min-width:0; }
  .vi-hist .sub { font-size:12.5px; color:var(--tinta-suave); }
  .vi-x { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:0 2px; cursor:pointer; }
  .vi-acciones { display:flex; gap:8px; margin-top:20px; }
  .vi-acciones .boton { flex:1; margin:0; }
  .vi-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  .vi-filtros { display:flex; gap:8px; margin-bottom:12px; }
  .vi-filtros select { flex:1; min-width:0; font-size:14px; padding:9px 10px; }
  .vi-filtros select.on { border-color:var(--naranja); color:var(--naranja); }
  .vi-filtrado { display:flex; justify-content:space-between; align-items:center; font-size:12.5px; color:var(--tinta-suave); margin:-4px 2px 12px; }
  .vi-filtrado button { background:none; border:0; color:var(--naranja); font:inherit; font-weight:600; cursor:pointer; padding:0; }
  .vi-dosb { display:flex; gap:8px; }
  .vi-dosb .vi-boton { flex:1; }
  .vi-dosb .vi-boton.sec { color:var(--tinta); box-shadow:inset 0 0 0 1px var(--linea); }
  .vi-emp .meta { font-size:12.5px; color:var(--tinta-suave); margin-top:3px; }
  .vi-val { display:grid; grid-template-columns:1fr 112px; gap:10px; align-items:center; padding:9px 0; border-top:1px solid var(--linea); }
  .vi-val .n { font-size:14.5px; line-height:1.3; min-width:0; }
  .vi-val .n .sub { font-size:12px; color:var(--tinta-suave); }
  .vi-val input { text-align:right; font-weight:600; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = s => { s = String(s == null ? "" : s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const dias = (a, b) => Math.round((aFecha(b) - aFecha(a)) / 864e5);
  const fecha = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const pct = n => { if (n === null || n === undefined || !isFinite(n)) return "–"; if (Math.abs(n) < 0.0005) n = 0; return (n > 0 ? "+" : "") + (n * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %"; };
  const cls = n => n > 0.00001 ? "vi-pos" : n < -0.00001 ? "vi-neg" : "";
  const MONEDAS = { EUR: "€", USD: "$", GBP: "£", CHF: "CHF", JPY: "¥", CAD: "C$", AUD: "A$", HKD: "HK$", SEK: "kr", DKK: "kr", NOK: "kr", CNY: "¥",
    PLN: "zł", KRW: "₩", TWD: "NT$", INR: "₹", SGD: "S$", BRL: "R$", MXN: "MX$", ILS: "₪", ZAR: "R" };
  // Países con bolsa más habituales y su moneda (al elegir país se propone su moneda)
  const PAIS_MONEDA = { ES: "EUR", DE: "EUR", FR: "EUR", NL: "EUR", IT: "EUR", PT: "EUR", BE: "EUR", IE: "EUR", FI: "EUR", AT: "EUR", LU: "EUR",
    US: "USD", GB: "GBP", CH: "CHF", SE: "SEK", DK: "DKK", NO: "NOK", PL: "PLN", JP: "JPY", CN: "CNY", HK: "HKD", KR: "KRW", TW: "TWD",
    IN: "INR", SG: "SGD", AU: "AUD", CA: "CAD", BR: "BRL", MX: "MXN", IL: "ILS", ZA: "ZAR" };
  let nombresPais = null; try { nombresPais = new Intl.DisplayNames(["es"], { type: "region" }); } catch (e) {}
  const nombrePais = a2 => (nombresPais && nombresPais.of(a2)) || a2;
  const bandera = a2 => a2 && a2.length === 2 ? String.fromCodePoint(...[...a2].map(c => 127397 + c.charCodeAt(0))) : "";
  const PAISES = Object.keys(PAIS_MONEDA).sort((a, b) => nombrePais(a).localeCompare(nombrePais(b), "es"));
  const SECTORES = ["Tecnología", "Salud", "Financiero", "Consumo discrecional", "Consumo básico", "Industria", "Energía", "Materiales", "Servicios públicos", "Inmobiliario", "Comunicaciones"];
  const precioTxt = (p, mon) => { const s = p.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: p < 10 ? 3 : 2, useGrouping: "always" }); const sim = MONEDAS[mon] || mon; return mon === "USD" || mon === "GBP" ? sim + s : s + " " + sim; };
  const eur = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(n);
  const aTexto = n => String(Math.round(n * 1e4) / 1e4).replace(".", ",");
  const IMPORTE = 1000;   // cartera ficticia: misma cantidad en cada empresa

  let vista = "infra", filtroPais = "", filtroSector = "";

  HiperApp.registrar({
    id: "value",
    titulo: "Value Investing",
    color: "#7D7AFF",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/><path d="M8 13l2-2 1.5 1.5L14 9"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.empresas = d.empresas || [];   // [{id, nombre, ticker, moneda, nota, valoraciones:[{fecha, intrinseco, precio}], precios:[{fecha, precio}], posiciones:[{id, entrada:{fecha, precio}, salida:{fecha, precio}|null}]}]
      d.umbral = d.umbral || 10;       // % de margen para considerar infra/sobrevalorada
      d.sectores = d.sectores || [];   // sectores propios añadidos con "Otro…"
      d.empresas.forEach(e => { e.pais = e.pais || ""; e.sector = e.sector || ""; });
      const todosSectores = () => SECTORES.concat(d.sectores.filter(x => !SECTORES.includes(x)));
      // Empresas que pasan los filtros de país y sector
      const filtradas = () => d.empresas.filter(e => (!filtroPais || e.pais === filtroPais) && (!filtroSector || e.sector === filtroSector));
      const guardar = () => store.set(d);
      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Cálculos ----------
      const valoracion = e => e.valoraciones.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).pop();
      // Último precio conocido hasta una fecha (precios actualizados y precios de las valoraciones)
      function precio(e, hasta = hoyK()) {
        const todos = e.precios.concat(e.valoraciones.map(v => ({ fecha: v.fecha, precio: v.precio }))).filter(x => x.fecha <= hasta);
        todos.sort((a, b) => a.fecha.localeCompare(b.fecha));
        return todos.pop() || null;
      }
      const potencial = e => { const v = valoracion(e), p = precio(e); return v && p ? v.intrinseco / p.precio - 1 : null; };
      const clase = e => { const x = potencial(e), u = d.umbral / 100; return x === null ? "bien" : x > u ? "infra" : x < -u ? "sobre" : "bien"; };
      const abierta = e => e.posiciones.find(p => !p.salida);
      const rentPos = (e, p) => { const fin = p.salida ? p.salida.precio : precio(e).precio; return fin / p.entrada.precio - 1; };
      // Al valorar: si sale infravalorada y no hay posición abierta, se compra al precio de esa fecha
      function revisarEntrada(e, v) {
        if (abierta(e)) return false;
        if (v.intrinseco / v.precio - 1 > d.umbral / 100) { e.posiciones.push({ id: nuevoId(), entrada: { fecha: v.fecha, precio: v.precio }, salida: null }); return true; }
        return false;
      }

      // ---------- Vistas ----------
      function tarjeta(e) {
        const v = valoracion(e), p = precio(e), x = potencial(e), pos = abierta(e);
        const viejo = p && dias(p.fecha, hoyK()) > 30;
        // Barra: dónde está el precio frente al valor intrínseco
        const max = Math.max(v.intrinseco, p.precio) * 1.15, ip = p.precio / max * 100, iv = v.intrinseco / max * 100;
        const col = x > 0 ? "#30D158" : "var(--rojo)";
        return `<button class="vi-emp" data-accion="empresa" data-id="${e.id}">
          <div class="l1"><b>${esc(e.nombre)}</b>${e.ticker ? `<span class="tk">${esc(e.ticker)}</span>` : ""}<span class="pot ${cls(x)}">${pct(x)}</span></div>
          ${e.pais || e.sector ? `<div class="meta">${e.pais ? bandera(e.pais) + " " + esc(nombrePais(e.pais)) : ""}${e.pais && e.sector ? " · " : ""}${esc(e.sector)}</div>` : ""}
          <div class="l2"><span>Precio ${precioTxt(p.precio, e.moneda)} · Valor ${precioTxt(v.intrinseco, e.moneda)}</span><span>${x > 0 ? "potencial" : x < 0 ? "por encima" : ""}</span></div>
          <div class="vi-barra"><div class="fill" style="left:${Math.min(ip, iv)}%;width:${Math.abs(iv - ip)}%;background:${col};opacity:.45"></div>
            <i style="left:${ip}%;background:var(--tinta)"></i><i style="left:${iv}%;background:${col}"></i></div>
          ${pos ? `<span class="vi-tag">En cartera ficticia ${pct(rentPos(e, pos))}</span>` : ""}${viejo ? `<span class="vi-tag viejo">Precio de hace ${dias(p.fecha, hoyK())} días</span>` : ""}
        </button>`;
      }

      function bloqueCartera() {
        const todas = filtradas().flatMap(e => e.posiciones.map(p => ({ e, p })));
        const hayFiltro = filtroPais || filtroSector;
        if (!todas.length && hayFiltro) return `<div class="vi-cartera"><div class="etiqueta">Cartera ficticia</div><div class="sub">No hay compras ficticias con estos filtros.</div></div>`;
        if (!todas.length) return `<div class="vi-cartera"><div class="etiqueta">Cartera ficticia</div>
          <div class="sub">Cuando valores una empresa y salga infravalorada, se "comprará" aquí al precio de esa fecha (${eur(IMPORTE)} en cada una). Así verás qué habrías ganado invirtiendo en todas tus ideas.</div></div>`;
        const ab = todas.filter(x => !x.p.salida), ce = todas.filter(x => x.p.salida);
        const r = xs => xs.length ? xs.reduce((s, x) => s + rentPos(x.e, x.p), 0) / xs.length : null;
        const rt = r(todas), ganado = todas.reduce((s, x) => s + IMPORTE * rentPos(x.e, x.p), 0);
        const filas = xs => xs.sort((a, b) => b.p.entrada.fecha.localeCompare(a.p.entrada.fecha)).map(({ e, p }) => {
          const rr = rentPos(e, p), fin = p.salida || precio(e);
          return `<button class="vi-pos-fila" data-accion="empresa" data-id="${e.id}"><div class="izq"><div>${esc(e.nombre)}</div>
            <div class="sub">${precioTxt(p.entrada.precio, e.moneda)} (${fecha(p.entrada.fecha)}) → ${precioTxt(fin.precio, e.moneda)}${p.salida ? " (vendida " + fecha(p.salida.fecha) + ")" : ""}</div></div>
            <div class="der ${cls(rr)}">${pct(rr)}<div class="sub">${dias(p.entrada.fecha, p.salida ? p.salida.fecha : hoyK())} días</div></div></button>`;
        }).join("");
        return `<div class="vi-cartera">
          <div class="etiqueta">Cartera ficticia, rentabilidad total${hayFiltro ? " (con filtros)" : ""}</div>
          <div class="cifra ${cls(rt)}">${pct(rt)}</div>
          <div class="sub">Con ${eur(IMPORTE)} en cada empresa el día que la valoraste: ${eur(IMPORTE * todas.length)} invertidos, <span class="${cls(ganado)}">${ganado >= 0 ? "+" : ""}${eur(ganado)}</span>.</div>
          <div class="vi-mini">
            <div><span class="etiqueta">Abiertas</span><b class="${cls(r(ab))}">${pct(r(ab))}</b><span class="etiqueta">${ab.length}</span></div>
            <div><span class="etiqueta">Vendidas</span><b class="${cls(r(ce))}">${pct(r(ce))}</b><span class="etiqueta">${ce.length}</span></div>
            <div><span class="etiqueta">Aciertos</span><b>${Math.round(todas.filter(x => rentPos(x.e, x.p) > 0).length / todas.length * 100)} %</b><span class="etiqueta">en positivo</span></div>
          </div>
        </div>
        ${ab.length ? `<div class="vi-titulo">En cartera</div><div class="bloque" style="padding:6px 16px">${filas(ab)}</div>` : ""}
        ${ce.length ? `<details><summary class="vi-titulo" style="cursor:pointer;list-style:none">Vendidas · ${ce.length}</summary><div class="bloque" style="padding:6px 16px">${filas(ce)}</div></details>` : ""}`;
      }

      function pintar() {
        // Los filtros solo ofrecen países y sectores que tienes; si ya no existe alguno, se quita
        const paisesUsados = [...new Set(d.empresas.map(e => e.pais).filter(Boolean))].sort((a, b) => nombrePais(a).localeCompare(nombrePais(b), "es"));
        const sectoresUsados = [...new Set(d.empresas.map(e => e.sector).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
        if (filtroPais && !paisesUsados.includes(filtroPais)) filtroPais = "";
        if (filtroSector && !sectoresUsados.includes(filtroSector)) filtroSector = "";
        const grupos = { infra: [], bien: [], sobre: [] };
        filtradas().forEach(e => grupos[clase(e)].push(e));
        grupos.infra.sort((a, b) => potencial(b) - potencial(a));
        grupos.sobre.sort((a, b) => potencial(a) - potencial(b));
        grupos.bien.sort((a, b) => potencial(b) - potencial(a));
        const lista = grupos[vista];
        const vacio = { infra: "Ninguna empresa cotiza ahora por debajo de tu valor intrínseco.", bien: "Ninguna empresa cotiza ahora cerca de su valor intrínseco.", sobre: "Ninguna empresa cotiza ahora por encima de su valor intrínseco." }[vista];
        raiz.innerHTML = `<div class="vi-seg">${[["infra", "Infravaloradas"], ["bien", "Bien valoradas"], ["sobre", "Sobrevaloradas"]].map(([k, n]) =>
            `<button class="${vista === k ? "on" : ""}" data-accion="vista" data-v="${k}">${n}<i>${grupos[k].length}</i></button>`).join("")}</div>
          ${d.empresas.length > 1 ? `<div class="vi-filtros">
              <select data-filtro="pais" class="${filtroPais ? "on" : ""}" aria-label="Filtrar por país"><option value="">Todos los países</option>${paisesUsados.map(a => `<option value="${a}" ${a === filtroPais ? "selected" : ""}>${bandera(a)} ${esc(nombrePais(a))}</option>`).join("")}</select>
              <select data-filtro="sector" class="${filtroSector ? "on" : ""}" aria-label="Filtrar por sector"><option value="">Todos los sectores</option>${sectoresUsados.map(x => `<option ${x === filtroSector ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>
            </div>
            ${filtroPais || filtroSector ? `<div class="vi-filtrado"><span>${filtradas().length} de ${d.empresas.length} empresas</span><button data-accion="sin-filtros">Quitar filtros</button></div>` : ""}` : ""}
          <div class="vi-dosb"><button class="vi-boton" data-accion="nueva">Añadir empresa</button>${d.empresas.length ? `<button class="vi-boton sec" data-accion="precios">Actualizar precios</button>` : ""}</div>
          ${vista === "infra" ? bloqueCartera() + (lista.length ? `<div class="vi-titulo">Infravaloradas ahora</div>` : "") : ""}
          ${lista.map(tarjeta).join("") || (d.empresas.length || vista !== "infra" ? `<div class="bloque"><p style="margin:0">${!d.empresas.length ? "Aún no has añadido empresas." : (filtroPais || filtroSector) && !filtradas().length ? "Ninguna empresa cumple estos filtros." : vacio}</p></div>` : "")}
          <button class="vi-enlace" data-accion="umbral">Margen para clasificar: ±${d.umbral} % · Cambiar</button>`;
      }

      // ---------- Hojas ----------
      function panel(html) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel vi-form" role="dialog">${html}</div>`;
        contenedor.appendChild(f);
        f.addEventListener("click", e => { if (e.target === f) f.remove(); });
        return { f, p: f.querySelector(".panel"), cerrar: () => f.remove() };
      }
      const rojo = el => { el.style.borderColor = "var(--rojo)"; el.focus(); return false; };
      const calcTexto = (intr, pr, mon) => {
        if (!(intr > 0 && pr > 0)) return "Escribe el valor intrínseco y el precio para ver la clasificación.";
        const x = intr / pr - 1, u = d.umbral / 100;
        const c = x > u ? "<b class='vi-pos'>infravalorada</b>" : x < -u ? "<b class='vi-neg'>sobrevalorada</b>" : "<b>bien valorada</b>";
        return `Potencial ${pct(x)} · Margen de seguridad ${pct(1 - pr / intr)}<br>Queda ${c}${x > u ? ", entra en la cartera ficticia a " + precioTxt(pr, mon) : ""}.`;
      };

      function camposEmpresa(e) {
        const pais = e ? e.pais : "", sector = e ? e.sector : "", mon = e ? e.moneda : "EUR";
        return `<div class="dos"><div style="flex:2"><label>Empresa</label><input id="viN" value="${e ? esc(e.nombre) : ""}" placeholder="Apple, Inditex…" maxlength="40"></div>
            <div><label>Ticker</label><input id="viT" value="${e ? esc(e.ticker) : ""}" placeholder="AAPL" maxlength="12" autocapitalize="characters"></div></div>
          <div class="dos"><div><label>País</label><select id="viPa"><option value="">Elige…</option>${PAISES.map(a => `<option value="${a}" ${a === pais ? "selected" : ""}>${bandera(a)} ${esc(nombrePais(a))}</option>`).join("")}</select></div>
            <div><label>Sector</label><select id="viSe">${opcionesSector(sector)}</select></div></div>
          <label>Moneda en la que cotiza</label><select id="viM">${Object.keys(MONEDAS).map(m => `<option ${m === mon ? "selected" : ""}>${m}</option>`).join("")}</select>`;
      }
      const opcionesSector = sel => `<option value="">Elige…</option>${todosSectores().map(x => `<option ${x === sel ? "selected" : ""}>${esc(x)}</option>`).join("")}<option value="__otro">+ Otro…</option>`;
      // País → propone su moneda; "Otro…" en sector → pide el nombre
      function enlazarCampos(p) {
        p.querySelector("#viPa").addEventListener("change", ev => { const m = PAIS_MONEDA[ev.target.value]; if (m) p.querySelector("#viM").value = m; });
        p.querySelector("#viSe").addEventListener("change", ev => {
          if (ev.target.value !== "__otro") return;
          const n = (prompt("Nombre del sector") || "").trim();
          if (n && !todosSectores().includes(n)) { d.sectores.push(n); guardar(); }
          ev.target.innerHTML = opcionesSector(n);
        });
      }
      function leerCampos(p, actual) {
        const nombre = p.querySelector("#viN").value.trim(), ticker = p.querySelector("#viT").value.trim().toUpperCase();
        if (!nombre) return rojo(p.querySelector("#viN"));
        const ya = d.empresas.find(e => e !== actual && (norm(e.nombre) === norm(nombre) || (ticker && e.ticker === ticker)));
        return { nombre, ticker, pais: p.querySelector("#viPa").value, sector: p.querySelector("#viSe").value.replace("__otro", ""), moneda: p.querySelector("#viM").value, ya };
      }

      function hojaNueva() {
        const h = panel(`<h2>Añadir empresa</h2>
          ${camposEmpresa(null)}
          <label>Fecha de valoración</label><input type="date" id="viF" value="${hoyK()}" max="${hoyK()}">
          <div class="dos"><div><label>Valor intrínseco por acción</label><input class="vi-grande" id="viI" inputmode="decimal" placeholder="0,00"></div>
            <div><label>Precio ese día</label><input class="vi-grande" id="viP" inputmode="decimal" placeholder="0,00"></div></div>
          <div class="vi-calc" id="viCalc"></div>
          <label>Nota o tesis (opcional)</label><input id="viNota" maxlength="140" placeholder="Método, hipótesis clave…">
          <div class="vi-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        const $ = q => h.p.querySelector(q);
        const calc = () => $("#viCalc").innerHTML = calcTexto(num($("#viI").value), num($("#viP").value), $("#viM").value);
        h.p.addEventListener("input", calc); h.p.addEventListener("change", calc); calc();
        enlazarCampos(h.p);
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h !== "g") return;
          const c = leerCampos(h.p, null); if (!c) return;
          const intr = num($("#viI").value), pr = num($("#viP").value);
          if (!(intr > 0)) return rojo($("#viI"));
          if (!(pr > 0)) return rojo($("#viP"));
          if (c.ya) { h.cerrar(); alert(c.ya.nombre + " ya está en tu lista. Te abro su ficha para que añadas una nueva valoración."); return hojaEmpresa(c.ya.id); }
          const e = { id: nuevoId(), nombre: c.nombre, ticker: c.ticker, pais: c.pais, sector: c.sector, moneda: c.moneda, nota: $("#viNota").value.trim(), valoraciones: [], precios: [], posiciones: [] };
          const v = { fecha: $("#viF").value || hoyK(), intrinseco: Math.round(intr * 1e4) / 1e4, precio: Math.round(pr * 1e4) / 1e4 };
          e.valoraciones.push(v); revisarEntrada(e, v);
          d.empresas.push(e); vista = clase(e); guardar(); h.cerrar(); pintar();
        });
        setTimeout(() => $("#viN").focus(), 50);
      }

      // Nueva valoración, nuevo precio o venta ficticia
      function hojaDato(e, tipo, alTerminar) {
        const u = precio(e), v = valoracion(e), pos = abierta(e);
        const titulos = { valor: "Nueva valoración", precio: "Actualizar precio", venta: "Venta ficticia" };
        const h = panel(`<h2>${titulos[tipo]}</h2><div class="etiqueta">${esc(e.nombre)}</div>
          <label>Fecha</label><input type="date" id="viF" value="${hoyK()}" max="${hoyK()}" ${tipo === "venta" ? `min="${pos.entrada.fecha}"` : ""}>
          ${tipo === "valor" ? `<div class="dos"><div><label>Valor intrínseco</label><input class="vi-grande" id="viI" inputmode="decimal" placeholder="${aTexto(v.intrinseco)}"></div>
            <div><label>Precio ese día</label><input class="vi-grande" id="viP" inputmode="decimal" placeholder="${aTexto(u.precio)}"></div></div>`
          : `<label>${tipo === "venta" ? "Precio de venta" : "Precio de mercado"} (${e.moneda})</label><input class="vi-grande" id="viP" inputmode="decimal" placeholder="${aTexto(u.precio)}" ${tipo === "venta" ? `value="${aTexto(u.precio)}"` : ""}>`}
          <div class="vi-calc" id="viCalc"></div>
          <div class="vi-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">${tipo === "venta" ? "Vender" : "Guardar"}</button></div>`);
        const $ = q => h.p.querySelector(q);
        const calc = () => {
          const pr = num($("#viP").value);
          if (tipo === "valor") $("#viCalc").innerHTML = calcTexto(num($("#viI").value), pr, e.moneda) + (pos ? "<br>Ya está en la cartera ficticia: la posición se mantiene hasta que la vendas." : "");
          else if (tipo === "precio") $("#viCalc").innerHTML = pr > 0 ? `Potencial frente a tu valor: ${pct(v.intrinseco / pr - 1)}` : `Último precio: ${precioTxt(u.precio, e.moneda)} (${fecha(u.fecha)})`;
          else $("#viCalc").innerHTML = pr > 0 ? `Compra a ${precioTxt(pos.entrada.precio, e.moneda)} el ${fecha(pos.entrada.fecha)}. Rentabilidad: <b class="${cls(pr / pos.entrada.precio - 1)}">${pct(pr / pos.entrada.precio - 1)}</b>` : "";
        };
        h.p.addEventListener("input", calc); calc();
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h !== "g") return;
          const f = $("#viF").value || hoyK(), pr = num($("#viP").value);
          if (!(pr > 0)) return rojo($("#viP"));
          const p4 = Math.round(pr * 1e4) / 1e4;
          if (tipo === "valor") {
            const intr = num($("#viI").value); if (!(intr > 0)) return rojo($("#viI"));
            const nv = { fecha: f, intrinseco: Math.round(intr * 1e4) / 1e4, precio: p4 };
            e.valoraciones = e.valoraciones.filter(x => x.fecha !== f); e.valoraciones.push(nv);
            if (nv === valoracion(e)) revisarEntrada(e, nv);
          } else if (tipo === "precio") {
            e.precios = e.precios.filter(x => x.fecha !== f); e.precios.push({ fecha: f, precio: p4 });
          } else {
            if (f < pos.entrada.fecha) { alert("La venta no puede ser anterior a la compra (" + fecha(pos.entrada.fecha) + ")."); return; }
            pos.salida = { fecha: f, precio: p4 };
            e.precios = e.precios.filter(x => x.fecha !== f); e.precios.push({ fecha: f, precio: p4 });
          }
          guardar(); h.cerrar(); pintar(); if (alTerminar) alTerminar();
        });
        setTimeout(() => $(tipo === "valor" ? "#viI" : "#viP").focus(), 50);
      }

      function hojaEmpresa(id) {
        const e = d.empresas.find(x => x.id === id); if (!e) return;
        const h = panel("");
        function ficha() {
          const v = valoracion(e), p = precio(e), x = potencial(e), pos = abierta(e), c = clase(e);
          const nomC = { infra: "Infravalorada", bien: "Bien valorada", sobre: "Sobrevalorada" }[c];
          const hist = e.valoraciones.map(y => ({ f: y.fecha, o: 0, html: `<div class="vi-hist"><div class="izq">Valoración: ${precioTxt(y.intrinseco, e.moneda)}<div class="sub">${fecha(y.fecha)}, cotizaba a ${precioTxt(y.precio, e.moneda)} (${pct(y.intrinseco / y.precio - 1)})</div></div>${e.valoraciones.length > 1 ? `<button class="vi-x" data-bv="${y.fecha}" aria-label="Borrar">×</button>` : ""}</div>` }))
            .concat(e.precios.map(y => ({ f: y.fecha, o: 1, html: `<div class="vi-hist"><div class="izq">Precio: ${precioTxt(y.precio, e.moneda)}<div class="sub">${fecha(y.fecha)}</div></div><button class="vi-x" data-bp="${y.fecha}" aria-label="Borrar">×</button></div>` })))
            .concat(e.posiciones.flatMap(q => [{ f: q.entrada.fecha, o: 2, html: `<div class="vi-hist"><div class="izq">Compra ficticia a ${precioTxt(q.entrada.precio, e.moneda)}<div class="sub">${fecha(q.entrada.fecha)}</div></div><button class="vi-x" data-bq="${q.id}" aria-label="Borrar">×</button></div>` }]
              .concat(q.salida ? [{ f: q.salida.fecha, o: 3, html: `<div class="vi-hist"><div class="izq">Venta ficticia a ${precioTxt(q.salida.precio, e.moneda)} <span class="${cls(rentPos(e, q))}">${pct(rentPos(e, q))}</span><div class="sub">${fecha(q.salida.fecha)}</div></div><button class="vi-x" data-bs="${q.id}" aria-label="Deshacer venta">×</button></div>` }] : [])))
            .sort((a, b) => b.f.localeCompare(a.f) || b.o - a.o).map(y => y.html).join("");
          h.p.innerHTML = `<h2>${esc(e.nombre)}</h2><div class="etiqueta">${e.ticker ? esc(e.ticker) + " · " : ""}${e.pais ? bandera(e.pais) + " " + esc(nombrePais(e.pais)) + " · " : ""}${e.sector ? esc(e.sector) + " · " : ""}${e.moneda} · <span class="${c === "infra" ? "vi-pos" : c === "sobre" ? "vi-neg" : ""}">${nomC}</span></div>
            ${e.nota ? `<p class="aviso" style="margin-top:8px">${esc(e.nota)}</p>` : ""}
            <div class="vi-grid">
              <div><span class="etiqueta">Valor intrínseco</span><b>${precioTxt(v.intrinseco, e.moneda)}</b><span class="etiqueta">${fecha(v.fecha)}</span></div>
              <div><span class="etiqueta">Precio actual</span><b>${precioTxt(p.precio, e.moneda)}</b><span class="etiqueta">${fecha(p.fecha)}</span></div>
              <div><span class="etiqueta">Potencial</span><b class="${cls(x)}">${pct(x)}</b></div>
              <div><span class="etiqueta">Margen de seguridad</span><b class="${cls(1 - p.precio / v.intrinseco)}">${pct(1 - p.precio / v.intrinseco)}</b></div>
              ${pos ? `<div style="grid-column:1/3"><span class="etiqueta">En cartera ficticia desde ${fecha(pos.entrada.fecha)} a ${precioTxt(pos.entrada.precio, e.moneda)}</span><b class="${cls(rentPos(e, pos))}">${pct(rentPos(e, pos))}</b></div>` : ""}
            </div>
            <div class="vi-botones"><button class="pri" data-h="precio">Precio</button><button data-h="valor">Revalorar</button>${pos ? `<button data-h="venta">Vender</button>` : ""}</div>
            <div class="vi-grupo">Historial</div>${hist}
            <div class="vi-acciones"><button class="boton secundario" data-h="editar">Editar datos</button><button class="boton" data-h="cerrar">Cerrar</button></div>
            <button class="vi-peligro" data-h="borrar">Borrar empresa</button>`;
        }
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          const k = b.dataset.h;
          const otra = () => { if (h.f.isConnected) ficha(); };
          if (k === "cerrar") return h.cerrar();
          if (k === "precio" || k === "valor" || k === "venta") return hojaDato(e, k, otra);
          if (k === "editar") return hojaEditar(e, otra);
          if (k === "borrar") { if (!confirm("¿Borrar " + e.nombre + " con todo su historial y su cartera ficticia?")) return; d.empresas = d.empresas.filter(y => y !== e); guardar(); h.cerrar(); pintar(); return; }
          if (b.dataset.bv) { e.valoraciones = e.valoraciones.filter(y => y.fecha !== b.dataset.bv); }
          else if (b.dataset.bp) { e.precios = e.precios.filter(y => y.fecha !== b.dataset.bp); }
          else if (b.dataset.bq) { if (!confirm("¿Quitar esta compra ficticia (y su venta, si la tiene)?")) return; e.posiciones = e.posiciones.filter(q => q.id !== b.dataset.bq); }
          else if (b.dataset.bs) { if (abierta(e)) { alert("Ya tienes otra posición abierta; quita primero esa compra."); return; } e.posiciones.find(q => q.id === b.dataset.bs).salida = null; }
          else return;
          guardar(); ficha(); pintar();
        });
        ficha();
      }

      function hojaEditar(e, alTerminar) {
        const h = panel(`<h2>Editar empresa</h2>${camposEmpresa(e)}
          <label>Nota o tesis (opcional)</label><input id="viNota" value="${esc(e.nota)}" maxlength="140">
          <p class="aviso">Si cambias la moneda, no se convierten los precios: solo cambia el símbolo.</p>
          <div class="vi-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        enlazarCampos(h.p);
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h !== "g") return;
          const c = leerCampos(h.p, e); if (!c) return;
          if (c.ya) { alert("Ya tienes otra empresa con ese nombre o ticker."); return; }
          Object.assign(e, { nombre: c.nombre, ticker: c.ticker, pais: c.pais, sector: c.sector, moneda: c.moneda, nota: h.p.querySelector("#viNota").value.trim() });
          guardar(); h.cerrar(); pintar(); if (alTerminar) alTerminar();
        });
      }

      // Actualizar el precio de todas las empresas (las filtradas) de una vez
      function hojaPrecios() {
        const lista = filtradas().slice().sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        const h = panel(`<h2>Actualizar precios</h2>
          <p class="aviso" style="margin-top:4px">Pon el precio de mercado de cada empresa. Deja vacías las que no quieras cambiar.</p>
          <label>Fecha</label><input type="date" id="viF" value="${hoyK()}" max="${hoyK()}">
          <div style="margin-top:10px">${lista.map(e => { const u = precio(e);
            return `<div class="vi-val"><div class="n">${esc(e.nombre)}<div class="sub">${e.ticker ? esc(e.ticker) + ", " : ""}último ${precioTxt(u.precio, e.moneda)} (${fecha(u.fecha)})</div></div>
              <input inputmode="decimal" data-id="${e.id}" placeholder="${aTexto(u.precio)}" aria-label="Precio de ${esc(e.nombre)}"></div>`; }).join("")}</div>
          <div class="vi-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h !== "g") return;
          const f = h.p.querySelector("#viF").value || hoyK(); let n = 0;
          for (const inp of h.p.querySelectorAll("[data-id]")) {
            if (!inp.value.trim()) continue;
            const pr = num(inp.value); if (!(pr > 0)) return rojo(inp);
            const e = d.empresas.find(x => x.id === inp.dataset.id);
            e.precios = e.precios.filter(x => x.fecha !== f); e.precios.push({ fecha: f, precio: Math.round(pr * 1e4) / 1e4 }); n++;
          }
          if (!n) { alert("No has escrito ningún precio."); return; }
          guardar(); h.cerrar(); pintar();
        });
      }

      function hojaUmbral() {
        const h = panel(`<h2>Margen para clasificar</h2>
          <p class="aviso">Una empresa es infravalorada si tu valor intrínseco supera el precio en más de este porcentaje, y sobrevalorada si el precio supera tu valor en más de este porcentaje. Entre medias, bien valorada.</p>
          <label>Margen (%)</label><input class="vi-grande" id="viU" inputmode="decimal" value="${String(d.umbral).replace(".", ",")}">
          <div class="vi-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        h.p.addEventListener("click", ev => {
          const b = ev.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h === "g") { const u = num(h.p.querySelector("#viU").value); if (!(u >= 0 && u < 100)) return rojo(h.p.querySelector("#viU")); d.umbral = u; guardar(); h.cerrar(); pintar(); }
        });
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", ev => {
        const b = ev.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "nueva") return hojaNueva();
        else if (a === "empresa") return hojaEmpresa(b.dataset.id);
        else if (a === "umbral") return hojaUmbral();
        else if (a === "precios") return hojaPrecios();
        else if (a === "sin-filtros") { filtroPais = ""; filtroSector = ""; }
        pintar();
      });
      raiz.addEventListener("change", ev => {
        const f = ev.target.dataset.filtro; if (!f) return;
        if (f === "pais") filtroPais = ev.target.value; else filtroSector = ev.target.value;
        pintar();
      });

      pintar();
    }
  });
})();
