/* PESTAÑA: Patrimonio
   Liquidez por cuenta, inversiones por tipo, ingresos y gastos, y evolución.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .pt-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:16px; }
  .pt-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .pt-seg button.on { background:var(--papel-2); color:var(--tinta); }

  .pt-total { padding:6px 2px 18px; }
  .pt-total .cifra { font-size:44px; line-height:1.05; }
  .pt-delta { font-size:14px; color:var(--tinta-suave); margin-top:6px; }
  .pt-delta b { color:var(--naranja); font-weight:600; }
  .pt-dist { display:flex; height:8px; border-radius:4px; overflow:hidden; gap:2px; margin:16px 0 10px; }
  .pt-leyenda { display:flex; flex-wrap:wrap; gap:6px 14px; font-size:12.5px; color:var(--tinta-suave); }
  .pt-leyenda span { display:inline-flex; align-items:center; gap:6px; }
  .pt-leyenda i { width:8px; height:8px; border-radius:50%; display:inline-block; }

  .pt-cab { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .pt-cab h2 { margin:0; }
  .pt-cab .v { font-weight:700; font-size:17px; }
  .pt-fila { display:flex; align-items:center; gap:12px; padding:13px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .pt-fila .izq { flex:1; min-width:0; }
  .pt-fila .izq div:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pt-fila .sub { font-size:13px; color:var(--tinta-suave); margin-top:2px; }
  .pt-fila .der { text-align:right; font-weight:600; white-space:nowrap; }
  .pt-pos, .pt-fila .sub.pt-pos { color:var(--naranja); }
  .pt-neg, .pt-fila .sub.pt-neg { color:#E5776B; }
  .pt-raiz { padding-bottom:64px; }
  .pt-enlace { background:none; border:0; color:var(--naranja); font:inherit; font-weight:600; font-size:14px; cursor:pointer; padding:10px 0 0; }
  .pt-rent { display:flex; gap:10px; margin-top:14px; }
  .pt-rent div { flex:1; background:var(--papel-2); border-radius:12px; padding:12px; }
  .pt-rent b { display:block; font-size:20px; margin-top:2px; }

  .pt-mes { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .pt-mes button { background:var(--papel); border:0; color:var(--tinta); width:40px; height:40px; border-radius:12px; font-size:20px; cursor:pointer; }
  .pt-mes h2 { margin:0; font-family:var(--titulos); font-weight:400; font-size:28px; }
  .pt-cuadro { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .pt-cuadro div { background:var(--papel-2); border-radius:12px; padding:12px; }
  .pt-cuadro b { display:block; font-size:19px; margin-top:2px; }
  .pt-cat { margin-top:12px; }
  .pt-cat .n { display:flex; justify-content:space-between; font-size:14px; margin-bottom:6px; }
  .pt-cat .n span:last-child { color:var(--tinta-suave); }
  .pt-barra { height:6px; background:var(--papel-2); border-radius:3px; overflow:hidden; }
  .pt-barra div { height:100%; background:var(--naranja); border-radius:3px; }
  .pt-borrar { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:2px 4px 2px 8px; cursor:pointer; }

  .pt-fab { position:fixed; right:20px; bottom:calc(var(--barra-alto) + env(safe-area-inset-bottom, 0px) + 18px); z-index:6;
    width:56px; height:56px; border-radius:50%; border:0; background:var(--naranja); color:#1A1411; font-size:30px; line-height:1; cursor:pointer;
    box-shadow:0 6px 20px rgba(0,0,0,.45); }

  .pt-rangos { display:flex; gap:4px; }
  .pt-rangos button { border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 11px; border-radius:8px; cursor:pointer; }
  .pt-rangos button.on { background:var(--naranja-suave); color:var(--naranja); }
  .pt-graf svg { width:100%; height:auto; display:block; margin-top:12px; }
  .pt-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }

  .pt-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .pt-form .dos { display:flex; gap:10px; }
  .pt-form .dos > div { flex:1; min-width:0; }
  .pt-tipos { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
  .pt-tipos button { border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:14px; font-weight:600; padding:8px 12px; border-radius:9px; cursor:pointer; }
  .pt-tipos button.on { background:var(--naranja-suave); color:var(--naranja); }
  .pt-importe { font-size:28px !important; font-weight:700; }
  .pt-acciones { display:flex; gap:8px; margin-top:20px; }
  .pt-acciones .boton { flex:1; margin:0; }
  .pt-peligro { background:none; border:0; color:#E5776B; font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  .pt-importar { width:100%; border:1.5px dashed var(--linea); background:none; color:var(--naranja); font:inherit; font-weight:700; font-size:15px; padding:13px; border-radius:14px; cursor:pointer; margin-bottom:12px; }
  .pt-archivo { display:block; width:100%; border:0; background:var(--papel-2); color:var(--tinta); font:inherit; font-weight:600; padding:16px; border-radius:12px; text-align:center; cursor:pointer; }
  .pt-archivo input { display:none; }
  .pt-imp { display:grid; grid-template-columns:22px 1fr auto; gap:10px; align-items:start; padding:11px 0; border-top:1px solid var(--linea); }
  .pt-imp input[type=checkbox], .pt-check input { width:20px; height:20px; accent-color:var(--naranja); margin:2px 0 0; padding:0; }
  .pt-imp .t { font-size:14.5px; line-height:1.3; word-break:break-word; }
  .pt-imp .sub { font-size:12.5px; color:var(--tinta-suave); margin-top:3px; }
  .pt-imp select { margin-top:6px; padding:7px 9px; font-size:13.5px; }
  .pt-imp .imp { font-weight:700; white-space:nowrap; font-size:14.5px; }
  .pt-imp.dup { opacity:.5; }
  .pt-form .pt-check, .pt-check { display:flex; gap:10px; align-items:flex-start; background:var(--papel-2); border-radius:12px; padding:12px; margin-top:10px; font-size:14px; line-height:1.4; }
  .pt-cargando { text-align:center; padding:30px 0 10px; color:var(--tinta-suave); }
  .pt-cargando i { display:block; width:34px; height:34px; margin:0 auto 14px; border-radius:50%; border:3px solid var(--papel-2); border-top-color:var(--naranja); animation:pt-gira .9s linear infinite; }
  @keyframes pt-gira { to { transform:rotate(360deg); } }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtE = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always" });
  const eur = n => fmtE.format(Math.round((n || 0) * 100) / 100);
  const eurS = n => (n > 0 ? "+" : "") + eur(n);
  const pct = n => (n === null || !isFinite(n)) ? "–" : (n > 0 ? "+" : "") + (n * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";
  const clsN = n => n > 0 ? "pt-pos" : n < 0 ? "pt-neg" : "";
  const num = s => { s = String(s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const fechaCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const CLASES = [
    { id: "acciones", nombre: "Acciones", color: "#1FD67A" },
    { id: "etfs", nombre: "ETFs", color: "#A3F0C8" },
    { id: "materias", nombre: "Materias primas", color: "#0F8A4F" },
    { id: "crypto", nombre: "Crypto", color: "#C6F25E" }
  ];
  // Modelo de Claude que lee los documentos (se puede cambiar aquí)
  const MODELO_IA = "claude-sonnet-5";
  const CLAVE_IA = "hiperapp-clave-claude"; // la clave se guarda aparte: no va en las copias de seguridad
  const leerClaveIA = () => { try { return localStorage.getItem(CLAVE_IA) || ""; } catch (e) { return ""; } };
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const COLOR_LIQ = "#5A5A61";
  const TIPOS = [
    { id: "gasto", nombre: "Gasto" }, { id: "ingreso", nombre: "Ingreso" },
    { id: "invertir", nombre: "Invertir" }, { id: "desinvertir", nombre: "Vender" },
    { id: "traspaso", nombre: "Traspaso" }
  ];

  // Estado de pantalla
  let vista = "resumen", rango = "1a", mesSel = null, tipoSel = "gasto";

  HiperApp.registrar({
    id: "patrimonio",
    titulo: "Finanzas",
    nombreCorto: "Finanzas",
    color: "#F2884B",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.cuentas = d.cuentas || [{ id: "bbva", nombre: "BBVA", saldo: 0 }, { id: "tr", nombre: "Trade Republic", saldo: 0 }];
      d.inv = d.inv || { acciones: { aportado: 0, valor: 0 }, etfs: { aportado: 0, valor: 0 }, materias: { aportado: 0, valor: 0 } };
      d.movs = d.movs || [];
      d.cats = d.cats || {
        gasto: ["Supermercado", "Restaurantes", "Ocio", "Transporte", "Hogar", "Suscripciones", "Ropa", "Deporte", "Otros"],
        ingreso: ["Nómina", "Beca", "Regalos", "Otros"]
      };
      d.fotos = d.fotos || {};  // {"AAAA-MM-DD": {liq, inv:{acciones:[valor,aportado],...}}}
      CLASES.forEach(c => { d.inv[c.id] = d.inv[c.id] || { aportado: 0, valor: 0 }; });   // añade Crypto a datos antiguos
      ["Intereses y dividendos", "Devoluciones"].forEach(c => { if (!d.cats.ingreso.includes(c)) d.cats.ingreso.splice(d.cats.ingreso.length - 1, 0, c); });
      if (!mesSel) mesSel = hoyK().slice(0, 7);

      // ---------- Cálculos ----------
      const liquidez = () => d.cuentas.reduce((s, c) => s + c.saldo, 0);
      const valorInv = () => CLASES.reduce((s, c) => s + d.inv[c.id].valor, 0);
      const aportadoInv = () => CLASES.reduce((s, c) => s + d.inv[c.id].aportado, 0);
      const total = () => liquidez() + valorInv();

      function guardar() {
        // Foto del día: se sobrescribe si ya había una hoy
        const inv = {};
        CLASES.forEach(c => inv[c.id] = [d.inv[c.id].valor, d.inv[c.id].aportado]);
        d.fotos[hoyK()] = { liq: liquidez(), inv };
        store.set(d);
      }
      const fotosOrdenadas = () => Object.keys(d.fotos).sort().map(k => {
        const f = d.fotos[k], inv = {};
        CLASES.forEach(c => inv[c.id] = (f.inv && f.inv[c.id]) || [0, 0]);
        const v = CLASES.reduce((s, c) => s + inv[c.id][0], 0), a = CLASES.reduce((s, c) => s + inv[c.id][1], 0);
        return { k, t: aFecha(k).getTime(), liq: f.liq, inv, valor: v, aportado: a, total: f.liq + v };
      });

      // Serie de rentabilidades: simple (valor/aportado - 1) y TWR encadenada entre fotos.
      // Entre dos fotos, el flujo neto es el cambio en lo aportado (aportaciones - coste de lo vendido).
      function serieRent(fotos) {
        let acum = 1; const out = [];
        fotos.forEach((f, i) => {
          if (i > 0) {
            const prev = fotos[i - 1], flujo = f.aportado - prev.aportado;
            if (prev.valor > 0) acum *= (f.valor - flujo) / prev.valor;
          }
          out.push({ t: f.t, k: f.k, simple: f.aportado > 0 ? f.valor / f.aportado - 1 : null, twr: acum - 1 });
        });
        return out;
      }
      function twrClase(id) {
        const fs = fotosOrdenadas(); let acum = 1;
        for (let i = 1; i < fs.length; i++) {
          const p = fs[i - 1].inv[id], c = fs[i].inv[id];
          if (p[0] > 0) acum *= (c[0] - (c[1] - p[1])) / p[0];
        }
        return fs.length > 1 ? acum - 1 : null;
      }

      // ---------- Aplicar / deshacer movimientos ----------
      const cuenta = id => d.cuentas.find(c => c.id === id);
      function aplicar(m, signo) {
        const c = cuenta(m.cuenta), c2 = cuenta(m.destino), x = m.importe * signo;
        if (m.tipo === "gasto" && c) c.saldo -= x;
        if (m.tipo === "ingreso" && c) c.saldo += x;
        if (m.tipo === "traspaso") { if (c) c.saldo -= x; if (c2) c2.saldo += x; }
        if (m.tipo === "invertir") { if (c) c.saldo -= x; d.inv[m.clase].aportado += x; d.inv[m.clase].valor += x; }
        if (m.tipo === "desinvertir") { if (c) c.saldo += x; d.inv[m.clase].valor -= x; d.inv[m.clase].aportado -= m.coste * signo; }
      }

      const raiz = document.createElement("div");
      raiz.className = "pt-raiz";
      contenedor.appendChild(raiz);

      // ---------- Gráficos (SVG) ----------
      function ejes(W, H, pad, min, max, fmt) {
        let g = "";
        for (let i = 0; i <= 3; i++) {
          const v = min + (max - min) * i / 3, y = H - pad.b - (H - pad.t - pad.b) * i / 3;
          g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" stroke="var(--linea)" stroke-width="1"/>
                <text x="${pad.l - 6}" y="${y + 3}" text-anchor="end">${fmt(v)}</text>`;
        }
        return g;
      }
      const compacto = v => Math.abs(v) >= 1000 ? (v / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "k" : Math.round(v).toString();

      // Gráfico de barras por meses. series: [{color, vals}], apiladas o agrupadas; linea opcional (discontinua)
      function grafBarras(meses, series, opc = {}) {
        const W = 340, H = 190, pad = { t: 10, r: 6, b: 22, l: 38 };
        const n = meses.length, ancho = (W - pad.l - pad.r) / n;
        const alturas = meses.map((_, i) => opc.agrupadas ? Math.max(...series.map(s => s.vals[i] || 0)) : series.reduce((t, s) => t + Math.max(s.vals[i] || 0, 0), 0));
        const max = Math.max(...alturas, ...(opc.linea ? opc.linea.vals.filter(v => v != null) : []), 1) * 1.1;
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        let barras = "";
        meses.forEach((_, i) => {
          if (opc.agrupadas) {
            const w = ancho * 0.78 / series.length;
            series.forEach((s, j) => { const v = Math.max(s.vals[i] || 0, 0); if (!v) return;
              barras += `<rect x="${pad.l + i * ancho + ancho * 0.11 + j * w}" y="${Y(v)}" width="${Math.max(w - 1, 1)}" height="${Y(0) - Y(v)}" rx="${Math.min(w / 3, 2.5)}" fill="${s.color}"/>`; });
          } else {
            let base = 0; const w = ancho * 0.64;
            series.forEach(s => { const v = Math.max(s.vals[i] || 0, 0); if (!v) return;
              barras += `<rect x="${pad.l + i * ancho + (ancho - w) / 2}" y="${Y(base + v)}" width="${w}" height="${Y(base) - Y(base + v)}" fill="${s.color}"/>`; base += v; });
          }
        });
        let linea = "";
        if (opc.linea) {
          const pts = opc.linea.vals.map((v, i) => v == null ? null : `${pad.l + (i + 0.5) * ancho},${Y(v)}`).filter(Boolean).join(" ");
          linea = `<polyline points="${pts}" fill="none" stroke="${opc.linea.color}" stroke-width="1.6" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
        }
        const paso = Math.ceil(n / 7);
        const etiquetas = meses.map((m, i) => (n - 1 - i) % paso === 0 ? `<text x="${pad.l + (i + 0.5) * ancho}" y="${H - 6}" text-anchor="middle">${MESES[+m.slice(5) - 1]}${m.endsWith("-01") || i === 0 ? " " + m.slice(2, 4) : ""}</text>` : "").join("");
        return `<svg viewBox="0 0 ${W} ${H}">${ejes(W, H, pad, 0, max, compacto)}${barras}${linea}${etiquetas}</svg>`;
      }

      // ---------- Vistas ----------
      function vistaResumen() {
        const T = total(), fs = fotosOrdenadas();
        // Comparación con hace ~30 días
        const limite = clave(new Date(Date.now() - 30 * 864e5));
        const ref = fs.filter(f => f.k <= limite).pop();
        const delta = ref ? `<div class="pt-delta"><b>${eurS(T - ref.total)}</b> desde el ${fechaCorta(ref.k)}</div>` : "";

        const partes = [{ n: "Liquidez", v: liquidez(), c: COLOR_LIQ }].concat(CLASES.map(c => ({ n: c.nombre, v: d.inv[c.id].valor, c: c.color })));
        const dist = T > 0 ? partes.filter(p => p.v > 0).map(p => `<div style="flex:${p.v};background:${p.c}"></div>`).join("") : `<div style="flex:1;background:var(--papel-2)"></div>`;
        const ley = partes.map(p => `<span><i style="background:${p.c}"></i>${p.n} ${T > 0 ? Math.round(p.v / T * 100) + "%" : ""}</span>`).join("");

        const cuentas = d.cuentas.map(c => `
          <button class="pt-fila" data-accion="cuenta" data-id="${c.id}">
            <div class="izq"><div>${esc(c.nombre)}</div></div>
            <div class="der">${eur(c.saldo)}</div>
          </button>`).join("");

        const V = valorInv(), A = aportadoInv(), rs = serieRent(fs);
        const twrTotal = fs.length > 1 ? rs[rs.length - 1].twr : null;
        const inv = CLASES.map(c => {
          const x = d.inv[c.id], g = x.valor - x.aportado;
          return `<button class="pt-fila" data-accion="clase" data-id="${c.id}">
            <div class="izq"><div>${c.nombre}</div><div class="sub">Aportado ${eur(x.aportado)}</div></div>
            <div class="der">${eur(x.valor)}<div class="sub ${clsN(g)}">${eurS(g)} ${x.aportado > 0 ? "(" + pct(x.valor / x.aportado - 1) + ")" : ""}</div></div>
          </button>`;
        }).join("");

        const vacio = T === 0 && A === 0 ? `<div class="bloque"><h2>Primeros pasos</h2>
          <p>Toca cada cuenta para poner su saldo actual, y cada tipo de inversión para poner lo que has aportado y lo que vale hoy. A partir de ahí, registra los movimientos con el botón +.</p></div>` : "";

        return `
          <div class="pt-total">
            <div class="etiqueta">Patrimonio total</div>
            <div class="cifra">${eur(T)}</div>
            ${delta}
            <div class="pt-dist">${dist}</div>
            <div class="pt-leyenda">${ley}</div>
          </div>
          ${vacio}
          <div class="bloque">
            <div class="pt-cab"><h2>Liquidez</h2><span class="v">${eur(liquidez())}</span></div>
            ${cuentas}
            <button class="pt-enlace" data-accion="nueva-cuenta">Añadir cuenta</button>
          </div>
          <div class="bloque">
            <div class="pt-cab"><h2>Inversión</h2><span class="v">${eur(V)}</span></div>
            ${inv}
            <div class="pt-rent">
              <div><span class="etiqueta">Rentabilidad simple</span><b class="${clsN(V - A)}">${A > 0 ? pct(V / A - 1) : "–"}</b></div>
              <div><span class="etiqueta">TWR</span><b class="${clsN(twrTotal)}">${pct(twrTotal)}</b></div>
            </div>
          </div>`;
      }

      function vistaMovimientos() {
        const [a, m] = mesSel.split("-").map(Number);
        const mesTxt = new Date(a, m - 1, 1).toLocaleDateString("es-ES", { month: "long" });
        const nombreMes = mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1) + " " + a;
        const delMes = d.movs.filter(x => x.fecha.startsWith(mesSel)).sort((x, y) => y.fecha.localeCompare(x.fecha) || y.creado - x.creado);
        const ing = delMes.filter(x => x.tipo === "ingreso").reduce((s, x) => s + x.importe, 0);
        const gas = delMes.filter(x => x.tipo === "gasto").reduce((s, x) => s + x.importe, 0);
        const inv = delMes.filter(x => x.tipo === "invertir").reduce((s, x) => s + x.importe, 0);
        const ahorro = ing - gas;

        const porCat = {};
        delMes.filter(x => x.tipo === "gasto").forEach(x => porCat[x.cat] = (porCat[x.cat] || 0) + x.importe);
        const cats = Object.entries(porCat).sort((x, y) => y[1] - x[1]).map(([c, v]) => `
          <div class="pt-cat"><div class="n"><span>${esc(c)}</span><span>${eur(v)}</span></div>
          <div class="pt-barra"><div style="width:${v / gas * 100}%"></div></div></div>`).join("");

        const nomCuenta = id => { const c = cuenta(id); return c ? c.nombre : "Cuenta borrada"; };
        const lista = delMes.map(x => {
          let titulo, sub, imp, cls = "";
          if (x.tipo === "gasto") { titulo = x.cat; sub = nomCuenta(x.cuenta); imp = "−" + eur(x.importe); }
          else if (x.tipo === "ingreso") { titulo = x.cat; sub = nomCuenta(x.cuenta); imp = "+" + eur(x.importe); cls = "pt-pos"; }
          else if (x.tipo === "traspaso") { titulo = "Traspaso"; sub = nomCuenta(x.cuenta) + " a " + nomCuenta(x.destino); imp = eur(x.importe); }
          else { const c = { acciones: "acciones", etfs: "ETFs", materias: "materias primas", crypto: "crypto" }[x.clase]; titulo = (x.tipo === "invertir" ? "Inversión en " : "Venta de ") + c; sub = nomCuenta(x.cuenta); imp = eur(x.importe); }
          return `<div class="pt-fila" style="cursor:default">
            <div class="izq"><div>${esc(titulo)}${x.nota ? ` <span class="sub">${esc(x.nota)}</span>` : ""}</div><div class="sub">${esc(sub)}, ${fechaCorta(x.fecha)}</div></div>
            <div class="der ${cls}">${imp}</div>
            <button class="pt-borrar" data-accion="borrar-mov" data-id="${x.id}" aria-label="Borrar movimiento">×</button>
          </div>`;
        }).join("");

        return `
          <button class="pt-importar" data-accion="importar">Importar extracto de tu banco</button>
          <div class="pt-mes">
            <button data-accion="mes" data-d="-1" aria-label="Mes anterior">‹</button>
            <h2>${nombreMes}</h2>
            <button data-accion="mes" data-d="1" aria-label="Mes siguiente">›</button>
          </div>
          <div class="bloque">
            <div class="pt-cuadro">
              <div><span class="etiqueta">Ingresos</span><b>${eur(ing)}</b></div>
              <div><span class="etiqueta">Gastos</span><b>${eur(gas)}</b></div>
              <div><span class="etiqueta">Ahorro</span><b class="${clsN(ahorro)}">${eurS(ahorro)}</b></div>
              <div><span class="etiqueta">Tasa de ahorro</span><b>${ing > 0 ? Math.round(ahorro / ing * 100) + " %" : "–"}</b></div>
            </div>
            ${inv ? `<p style="margin:12px 0 0;font-size:14px">Has invertido ${eur(inv)} este mes.</p>` : ""}
          </div>
          ${cats ? `<div class="bloque"><h2>Gastos por categoría</h2>${cats}</div>` : ""}
          <div class="bloque">
            <h2>Movimientos</h2>
            ${lista || `<p>Sin movimientos este mes. Usa el botón + para apuntar uno.</p>`}
          </div>
          <button class="pt-enlace" data-accion="clave-ia" style="color:var(--tinta-suave);font-weight:500;font-size:13px">${leerClaveIA() ? "Cambiar clave de la API de Claude" : "Configurar clave de la API de Claude"}</button>`;
      }

      function vistaEvolucion() {
        const actual = hoyK().slice(0, 7);
        const mesMas = (ym, n) => { const [y, m] = ym.split("-").map(Number); return clave(new Date(y, m - 1 + n, 1)).slice(0, 7); };
        const primeros = [...d.movs.map(x => x.fecha.slice(0, 7)), ...Object.keys(d.fotos).map(k => k.slice(0, 7))].sort();
        let desde = primeros[0] || actual;
        if (rango !== "todo") { const lim = mesMas(actual, rango === "6m" ? -5 : -11); if (desde < lim) desde = lim; }
        const meses = []; for (let m = desde; m <= actual; m = mesMas(m, 1)) meses.push(m);
        const rangos = `<div class="pt-rangos">${[["6m", "6 meses"], ["1a", "1 año"], ["todo", "Todo"]].map(([id, n]) =>
          `<button class="${rango === id ? "on" : ""}" data-accion="rango" data-r="${id}">${n}</button>`).join("")}</div>`;
        const ley = xs => `<div class="pt-leyenda" style="margin-top:10px">${xs.map(([n, c, raya]) => `<span><i style="background:${c}${raya ? ";height:2px;border-radius:0;width:12px" : ""}"></i>${n}</span>`).join("")}</div>`;

        // 1. Ingresos y gastos
        const ing = meses.map(m => d.movs.filter(x => x.tipo === "ingreso" && x.fecha.startsWith(m)).reduce((s, x) => s + x.importe, 0));
        const gas = meses.map(m => d.movs.filter(x => x.tipo === "gasto" && x.fecha.startsWith(m)).reduce((s, x) => s + x.importe, 0));
        const conDatos = meses.filter((_, i) => ing[i] || gas[i]).length;
        const ahorroMedio = conDatos ? (ing.reduce((a, b) => a + b, 0) - gas.reduce((a, b) => a + b, 0)) / conDatos : 0;
        const g1 = conDatos ? `<div class="pt-cab"><h2>Ingresos y gastos</h2><span class="v ${clsN(ahorroMedio)}">${eurS(ahorroMedio)}</span></div>
            <p style="margin:0;font-size:14px">Ahorro medio al mes en el periodo.</p>
            ${grafBarras(meses, [{ color: "var(--naranja)", vals: ing }, { color: "var(--rojo)", vals: gas }], { agrupadas: true })}
            ${ley([["Ingresos", "var(--naranja)"], ["Gastos", "var(--rojo)"]])}`
          : `<h2>Ingresos y gastos</h2><p>Aparecerá en cuanto apuntes o importes movimientos.</p>`;

        // Foto de fin de cada mes (la última que haya hasta ese mes)
        const fs = fotosOrdenadas();
        const finMes = meses.map(m => { const x = fs.filter(f => f.k.slice(0, 7) <= m).pop(); return x || null; });
        const hayFotos = finMes.filter(Boolean).length;

        // 2. Patrimonio
        let g2 = `<h2>Patrimonio</h2><p>Aparecerá cuando la app lleve al menos un mes guardando tu patrimonio (se guarda solo cada día que la usas).</p>`;
        if (hayFotos) {
          const conF = finMes.filter(Boolean), cambio = conF[conF.length - 1].total - conF[0].total;
          const capas = [{ color: COLOR_LIQ, vals: finMes.map(f => f ? f.liq : 0) }].concat(CLASES.map(c => ({ color: c.color, vals: finMes.map(f => f ? f.inv[c.id][0] : 0) })));
          g2 = `<div class="pt-cab"><h2>Patrimonio</h2><span class="v ${clsN(cambio)}">${eurS(cambio)}</span></div>
            <p style="margin:0;font-size:14px">Valor a final de cada mes.</p>
            ${grafBarras(meses, capas)}
            ${ley([["Liquidez", COLOR_LIQ]].concat(CLASES.map(c => [c.nombre, c.color])))}`;
        }

        // 3. Inversiones
        let g3 = `<h2>Inversiones</h2><p>Aparecerá cuando la app lleve al menos un mes guardando tus inversiones.</p>`;
        const fsRango = fs.filter(f => f.k.slice(0, 7) >= meses[0]);
        const previa = fs.filter(f => f.k.slice(0, 7) < meses[0]).pop();
        const rs = serieRent((previa ? [previa] : []).concat(fsRango));
        if (hayFotos && rs.length) {
          const ult = rs[rs.length - 1];
          g3 = `<div class="pt-cab"><h2>Inversiones</h2></div>
            <div class="pt-rent" style="margin-top:6px">
              <div><span class="etiqueta">Rentabilidad simple</span><b class="${clsN(ult.simple)}">${pct(ult.simple)}</b></div>
              <div><span class="etiqueta">TWR del periodo</span><b class="${clsN(rs.length > 1 ? ult.twr : null)}">${rs.length > 1 ? pct(ult.twr) : "–"}</b></div>
            </div>
            ${grafBarras(meses, CLASES.map(c => ({ color: c.color, vals: finMes.map(f => f ? f.inv[c.id][0] : 0) })), { linea: { color: "var(--tinta)", vals: finMes.map(f => f ? f.aportado : null) } })}
            ${ley(CLASES.map(c => [c.nombre, c.color]).concat([["Aportado", "var(--tinta)", true]]))}`;
        }

        return `<div style="display:flex;justify-content:flex-end;margin-bottom:12px">${rangos}</div>
          <div class="bloque pt-graf">${g1}</div>
          <div class="bloque pt-graf">${g2}</div>
          <div class="bloque pt-graf">${g3}</div>`;
      }

      function pintar() {
        raiz.innerHTML = `
          <div class="pt-seg">
            ${[["resumen", "Resumen"], ["movimientos", "Movimientos"], ["evolucion", "Evolución"]].map(([id, n]) =>
              `<button class="${vista === id ? "on" : ""}" data-accion="vista" data-v="${id}">${n}</button>`).join("")}
          </div>
          ${vista === "resumen" ? vistaResumen() : vista === "movimientos" ? vistaMovimientos() : vistaEvolucion()}
          <button class="pt-fab" data-accion="nuevo-mov" aria-label="Nuevo movimiento">+</button>`;
      }

      // ---------- Hojas (formularios que suben desde abajo) ----------
      function hoja(html, alGuardar, extra) {
        const fondo = document.createElement("div");
        fondo.className = "panel-fondo";
        fondo.innerHTML = `<div class="panel pt-form" role="dialog">${html}
          <div class="pt-acciones"><button class="boton secundario" data-h="cancelar">Cancelar</button><button class="boton" data-h="guardar">Guardar</button></div>
          ${extra || ""}</div>`;
        raiz.appendChild(fondo);
        const cerrar = () => fondo.remove();
        fondo.addEventListener("click", e => {
          if (e.target === fondo || e.target.dataset.h === "cancelar") cerrar();
          if (e.target.dataset.h === "guardar") { if (alGuardar(fondo) !== false) { cerrar(); guardar(); pintar(); } }
        });
        return fondo;
      }
      const leerImporte = (el, permitirNegativo) => {
        const v = num(el.value);
        if (!isFinite(v) || (!permitirNegativo && v <= 0)) { el.focus(); el.style.borderColor = "#E5776B"; return null; }
        return Math.round(v * 100) / 100;
      };
      const opcionesCuentas = sel => d.cuentas.map(c => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${esc(c.nombre)}</option>`).join("");

      function hojaMovimiento() {
        const f = hoja(`<h2>Nuevo movimiento</h2>
          <div class="pt-tipos">${TIPOS.map(t => `<button class="${t.id === tipoSel ? "on" : ""}" data-tipo="${t.id}">${t.nombre}</button>`).join("")}</div>
          <label>Importe (€)</label><input class="pt-importe" id="ptImp" inputmode="decimal" placeholder="0,00" autocomplete="off">
          <div id="ptCampos"></div>
          <div class="dos"><div><label>Fecha</label><input type="date" id="ptFecha" value="${hoyK()}" max="${hoyK()}"></div>
            <div><label>Nota (opcional)</label><input id="ptNota" maxlength="60"></div></div>`,
          f => {
            const importe = leerImporte(f.querySelector("#ptImp")); if (importe === null) return false;
            const m = { id: nuevoId(), creado: Date.now(), tipo: tipoSel, importe, fecha: f.querySelector("#ptFecha").value || hoyK(),
              nota: f.querySelector("#ptNota").value.trim(), cuenta: f.querySelector("#ptCuenta").value };
            if (tipoSel === "gasto" || tipoSel === "ingreso") {
              m.cat = f.querySelector("#ptCat").value;
              if (m.cat === "__nueva") return false;
            }
            if (tipoSel === "traspaso") { m.destino = f.querySelector("#ptDestino").value; if (m.destino === m.cuenta) { alert("Elige dos cuentas distintas."); return false; } }
            if (tipoSel === "invertir" || tipoSel === "desinvertir") m.clase = f.querySelector("#ptClase").value;
            if (tipoSel === "desinvertir") {
              const x = d.inv[m.clase];
              if (importe > x.valor + 0.005) { alert("Vendes más de lo que vale esa inversión ahora mismo (" + eur(x.valor) + "). Actualiza antes su valor."); return false; }
              m.coste = x.valor > 0 ? Math.round(x.aportado * importe / x.valor * 100) / 100 : 0;
            }
            aplicar(m, 1);
            d.movs.push(m);
          });

        function campos() {
          let h = "";
          if (tipoSel === "gasto" || tipoSel === "ingreso") {
            const cs = d.cats[tipoSel];
            h += `<label>Categoría</label><select id="ptCat">${cs.map(c => `<option>${esc(c)}</option>`).join("")}<option value="__nueva">+ Nueva…</option></select>`;
          }
          if (tipoSel === "invertir" || tipoSel === "desinvertir")
            h += `<label>Tipo de inversión</label><select id="ptClase">${CLASES.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("")}</select>`;
          const etq = { gasto: "Pagado desde", ingreso: "Cobrado en", traspaso: "Desde", invertir: "Dinero sale de", desinvertir: "Dinero entra en" }[tipoSel];
          const def = (tipoSel === "invertir" || tipoSel === "desinvertir") && cuenta("tr") ? "tr" : d.cuentas[0] && d.cuentas[0].id;
          h += `<div class="dos"><div><label>${etq}</label><select id="ptCuenta">${opcionesCuentas(def)}</select></div>`;
          if (tipoSel === "traspaso") h += `<div><label>Hacia</label><select id="ptDestino">${opcionesCuentas(d.cuentas[1] && d.cuentas[1].id)}</select></div>`;
          h += `</div>`;
          f.querySelector("#ptCampos").innerHTML = h;
        }
        campos();
        f.addEventListener("click", e => {
          const t = e.target.dataset.tipo; if (!t) return;
          tipoSel = t;
          f.querySelectorAll("[data-tipo]").forEach(b => b.classList.toggle("on", b.dataset.tipo === t));
          campos();
        });
        f.addEventListener("change", e => {
          if (e.target.id === "ptCat" && e.target.value === "__nueva") {
            const n = (prompt("Nombre de la nueva categoría") || "").trim();
            if (n && !d.cats[tipoSel].includes(n)) { d.cats[tipoSel].push(n); store.set(d); }
            campos(); if (n) f.querySelector("#ptCat").value = n;
          }
        });
        setTimeout(() => f.querySelector("#ptImp").focus(), 50);
      }

      function hojaCuenta(id) {
        const c = id ? cuenta(id) : null;
        const f = hoja(`<h2>${c ? esc(c.nombre) : "Nueva cuenta"}</h2>
          <label>Nombre</label><input id="ptNom" value="${c ? esc(c.nombre) : ""}" maxlength="30">
          <label>${c ? "Saldo real hoy (según tu banco)" : "Saldo actual"}</label>
          <input class="pt-importe" id="ptSaldo" inputmode="decimal" value="${c ? String(c.saldo).replace(".", ",") : ""}" placeholder="0,00">
          ${c ? `<p class="aviso">Si no coincide con lo que marca la app, pon aquí el saldo real para cuadrarlo. La diferencia no cuenta como gasto ni como ingreso.</p>` : ""}`,
          f => {
            const nombre = f.querySelector("#ptNom").value.trim(); if (!nombre) return false;
            const saldo = f.querySelector("#ptSaldo").value.trim() === "" ? 0 : leerImporte(f.querySelector("#ptSaldo"), true);
            if (saldo === null) return false;
            if (c) { c.nombre = nombre; c.saldo = saldo; }
            else d.cuentas.push({ id: nuevoId(), nombre, saldo });
          },
          c && d.cuentas.length > 1 ? `<button class="pt-peligro" data-h="borrar">Borrar cuenta</button>` : "");
        f.addEventListener("click", e => {
          if (e.target.dataset.h !== "borrar") return;
          if (!confirm("¿Borrar la cuenta " + c.nombre + "? Su saldo dejará de contar en tu patrimonio.")) return;
          d.cuentas = d.cuentas.filter(x => x.id !== c.id);
          f.remove(); guardar(); pintar();
        });
        setTimeout(() => f.querySelector(c ? "#ptSaldo" : "#ptNom").focus(), 50);
      }

      function hojaClase(id) {
        const c = CLASES.find(x => x.id === id), x = d.inv[id];
        const f = hoja(`<h2>${c.nombre}</h2>
          <label>Valor actual de todo lo que tienes en ${c.nombre.toLowerCase()}</label>
          <input class="pt-importe" id="ptValor" inputmode="decimal" value="${String(x.valor).replace(".", ",")}">
          <label>Total aportado</label>
          <input id="ptAport" inputmode="decimal" value="${String(x.aportado).replace(".", ",")}">
          <p class="aviso">Actualiza el valor cuando quieras (por ejemplo, cada semana). El total aportado solo tienes que ponerlo al empezar: a partir de ahí, las compras y ventas nuevas regístralas con el botón + como "Invertir" o "Vender" y se ajusta solo.</p>`,
          f => {
            const v = leerImporte(f.querySelector("#ptValor"), true), a = leerImporte(f.querySelector("#ptAport"), true);
            if (v === null || a === null || v < 0 || a < 0) return false;
            x.valor = v; x.aportado = a;
          });
        setTimeout(() => { const i = f.querySelector("#ptValor"); i.focus(); i.select(); }, 50);
      }

      // ---------- Importar extractos con IA ----------
      function hojaSimple() {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel pt-form" role="dialog"><div class="pt-paso"></div></div>`;
        raiz.appendChild(f);
        return { f, paso: f.querySelector(".pt-paso"), cerrar: () => f.remove() };
      }

      function hojaClaveIA(despues) {
        const h = hojaSimple();
        h.paso.innerHTML = `<h2>Clave de la API de Claude</h2>
          <p class="aviso">Para leer los extractos, la app se los envía a Claude a través de la API de Anthropic. Es un servicio aparte de tu plan Pro y se paga por uso (leer un extracto cuesta céntimos). Solo hay que configurarlo una vez:</p>
          <p class="aviso">1. Entra en console.anthropic.com y crea una cuenta.<br>2. En Billing, añade algo de saldo (5 € dan para mucho). Te recomiendo poner también un límite de gasto mensual.<br>3. En API Keys, pulsa Create Key, copia la clave y pégala aquí.</p>
          <p class="aviso">La clave se guarda solo en este iPhone y no se incluye en las copias de seguridad. Tus documentos se envían a Anthropic solo para leerlos.</p>
          <label>Clave</label><input id="ptClaveIA" value="${esc(leerClaveIA())}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="sk-ant-…">
          <div class="pt-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`;
        h.f.addEventListener("click", e => {
          if (e.target === h.f || e.target.dataset.h === "c") h.cerrar();
          if (e.target.dataset.h === "g") {
            const k = h.paso.querySelector("#ptClaveIA").value.trim();
            try { if (k) localStorage.setItem(CLAVE_IA, k); else localStorage.removeItem(CLAVE_IA); } catch (err) {}
            h.cerrar(); pintar(); if (k && despues) despues();
          }
        });
      }

      const aBase64 = file => new Promise((ok, mal) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1]); r.onerror = mal; r.readAsDataURL(file); });
      function cargarSheetJS() {
        if (window.XLSX) return Promise.resolve();
        return new Promise((ok, mal) => { const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; sc.onload = ok; sc.onerror = () => mal(new Error("No se ha podido cargar el lector de Excel (¿sin conexión?).")); document.head.appendChild(sc); });
      }
      async function contenidoArchivo(file) {
        const nombre = file.name.toLowerCase();
        if (file.type === "application/pdf" || nombre.endsWith(".pdf"))
          return { type: "document", source: { type: "base64", media_type: "application/pdf", data: await aBase64(file) } };
        if (/^image\/(jpeg|png|gif|webp)$/.test(file.type))
          return { type: "image", source: { type: "base64", media_type: file.type, data: await aBase64(file) } };
        if (/\.(xlsx|xls|ods)$/.test(nombre)) {
          await cargarSheetJS();
          const libro = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
          const texto = libro.SheetNames.map(n => "## Hoja: " + n + "\n" + XLSX.utils.sheet_to_csv(libro.Sheets[n], { dateNF: "yyyy-mm-dd" })).join("\n\n");
          return { type: "text", text: "Contenido del archivo " + file.name + " (convertido a CSV):\n\n" + texto.slice(0, 180000) };
        }
        return { type: "text", text: "Contenido del archivo " + file.name + ":\n\n" + (await file.text()).slice(0, 180000) };
      }

      async function leerConIA(file, cuentaId) {
        const c = cuenta(cuentaId), otras = d.cuentas.filter(x => x.id !== cuentaId).map(x => x.nombre);
        const instrucciones = `Eres un asistente que extrae movimientos de extractos bancarios y de bróker para una app personal de finanzas en euros.
El documento pertenece a la cuenta "${c.nombre}". Otras cuentas del usuario: ${otras.join(", ") || "ninguna"}. Hoy es ${hoyK()}.

Devuelve SOLO un objeto JSON válido, sin texto antes ni después y sin bloques de código, con esta forma:
{"movimientos":[{"fecha":"AAAA-MM-DD","tipo":"gasto|ingreso|invertir|desinvertir|traspaso","direccion":"salida|entrada","importe":12.34,"categoria":"...","descripcion":"texto breve","clase":"acciones|etfs|materias|crypto"}],
 "saldo_final":1234.56,"fecha_saldo":"AAAA-MM-DD","valor_inversiones":{"acciones":0,"etfs":0,"materias":0,"crypto":0}}

Reglas:
- "importe" siempre positivo, en euros, con punto decimal. Usa la fecha de la operación.
- gasto: pagos con tarjeta, recibos, comisiones, Bizum enviados por compras o pagos. categoria, exactamente una de: ${d.cats.gasto.join(", ")}.
- ingreso: nóminas, becas, intereses, dividendos, devoluciones, Bizum recibidos. categoria, exactamente una de: ${d.cats.ingreso.join(", ")}.
- invertir: compras de valores, planes de inversión, saveback y redondeos. desinvertir: ventas. Indica "clase": etfs si es un fondo cotizado (ETF, UCITS, iShares, Vanguard, Xtrackers, Amundi, índices como MSCI World o S&P 500); materias si es oro, plata u otras materias primas (incluidos ETC); crypto si es una criptomoneda (Bitcoin, Ethereum…); acciones en el resto. En invertir/desinvertir no pongas categoria.
- traspaso: transferencias entre cuentas del propio usuario (por ejemplo, de BBVA a Trade Republic o al revés). "direccion": salida si el dinero sale de "${c.nombre}", entrada si entra. No pongas categoria.
- Omite los campos que no apliquen (direccion, clase, categoria).
- "saldo_final": saldo de efectivo de la cuenta al final del extracto, si aparece; si no, null. "fecha_saldo": su fecha, o null.
- "valor_inversiones": solo si el documento muestra el valor actual de la cartera de inversión, repartido por esas cuatro clases; si no, null.
- No inventes movimientos. Si algo no está claro, clasifícalo lo mejor posible y ponlo en "descripcion".`;
        const bloque = await contenidoArchivo(file);
        let r;
        try {
          r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "content-type": "application/json", "x-api-key": leerClaveIA(), "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
            body: JSON.stringify({ model: MODELO_IA, max_tokens: 16000, messages: [{ role: "user", content: [bloque, { type: "text", text: instrucciones }] }] })
          });
        } catch (e) { throw new Error("No se ha podido conectar con Claude. Revisa tu conexión e inténtalo de nuevo."); }
        if (r.status === 401) throw new Error("La clave de la API no es válida. Revísala en \"Configurar clave de la API de Claude\", al final de Movimientos.");
        if (!r.ok) {
          let msg = ""; try { msg = (await r.json()).error.message; } catch (e) {}
          if (/credit|balance|billing/i.test(msg)) throw new Error("Tu cuenta de la API no tiene saldo. Añade saldo en console.anthropic.com, en Billing.");
          throw new Error("Claude no ha podido leer el documento (" + r.status + (msg ? ": " + msg : "") + ").");
        }
        const j = await r.json();
        const texto = (j.content || []).map(x => x.type === "text" ? x.text : "").join("");
        const a = texto.indexOf("{"), b = texto.lastIndexOf("}");
        try { return JSON.parse(texto.slice(a, b + 1)); }
        catch (e) { throw new Error("La respuesta no se ha podido interpretar. Prueba otra vez o con otro formato del documento (Excel suele funcionar mejor que PDF)."); }
      }

      // ¿Ya existe este movimiento? (misma cuenta, tipo e importe, con 1 día de margen; traspasos con 4 días)
      function esDuplicado(m) {
        const dias = (x, y) => Math.abs(aFecha(x) - aFecha(y)) / 864e5;
        return d.movs.some(x => {
          if (Math.abs(x.importe - m.importe) > 0.005) return false;
          if (m.tipo === "traspaso") return x.tipo === "traspaso" && dias(x.fecha, m.fecha) <= 4 && ((x.cuenta === m.cuenta && x.destino === m.destino) || (x.cuenta === m.destino && x.destino === m.cuenta) || x.cuenta === m.cuenta || x.destino === m.destino);
          return x.tipo === m.tipo && x.cuenta === m.cuenta && dias(x.fecha, m.fecha) <= 1;
        });
      }

      function hojaImportar() {
        const h = hojaSimple();
        let archivo = null, resultado = null, cuentaId = d.cuentas[0] && d.cuentas[0].id, filas = [];
        h.f.addEventListener("click", e => { if (e.target === h.f) h.cerrar(); });

        function paso1(error) {
          h.paso.innerHTML = `<h2>Importar extracto</h2>
            <p class="aviso">Sube un Excel, CSV o PDF de movimientos. Claude lo leerá, clasificará cada movimiento y te lo enseñará para revisarlo antes de guardar nada.</p>
            <label>¿De qué cuenta es?</label><select id="ptImpCuenta">${opcionesCuentas(cuentaId)}</select>
            <label>Documento</label>
            <label class="pt-archivo">${archivo ? esc(archivo.name) : "Elegir archivo"}<input type="file" id="ptImpArchivo" accept=".pdf,.xlsx,.xls,.csv,.txt,image/*,application/pdf"></label>
            ${error ? `<p class="aviso" style="color:var(--rojo)">${esc(error)}</p>` : ""}
            <div class="pt-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="leer" ${archivo ? "" : 'disabled style="opacity:.4"'}>Leer documento</button></div>`;
          h.paso.querySelector("#ptImpArchivo").addEventListener("change", e => { archivo = e.target.files[0] || null; cuentaId = h.paso.querySelector("#ptImpCuenta").value; paso1(); });
          h.paso.querySelector("#ptImpCuenta").addEventListener("change", e => { cuentaId = e.target.value; });
          h.paso.querySelector("[data-h=c]").onclick = h.cerrar;
          h.paso.querySelector("[data-h=leer]").onclick = async () => {
            if (!archivo) return;
            cuentaId = h.paso.querySelector("#ptImpCuenta").value;
            h.paso.innerHTML = `<div class="pt-cargando"><i></i>Claude está leyendo el documento.<br>Puede tardar hasta un minuto.</div>`;
            try { resultado = await leerConIA(archivo, cuentaId); prepararFilas(); if (h.f.isConnected) paso2(); }
            catch (err) { if (h.f.isConnected) paso1(err.message); }
          };
        }

        function prepararFilas() {
          const otra = (d.cuentas.find(x => x.id !== cuentaId) || {}).id;
          filas = (resultado.movimientos || []).map(x => {
            const tipo = ["gasto", "ingreso", "invertir", "desinvertir", "traspaso"].includes(x.tipo) ? x.tipo : "gasto";
            const importe = Math.round(Math.abs(Number(x.importe) || 0) * 100) / 100;
            const fecha = /^\d{4}-\d{2}-\d{2}$/.test(x.fecha || "") ? x.fecha : hoyK();
            const m = { tipo, importe, fecha, nota: String(x.descripcion || "").slice(0, 60), cuenta: cuentaId };
            if (tipo === "gasto" || tipo === "ingreso") m.cat = d.cats[tipo].includes(x.categoria) ? x.categoria : "Otros";
            if (tipo === "invertir" || tipo === "desinvertir") m.clase = CLASES.some(c => c.id === x.clase) ? x.clase : "etfs";
            if (tipo === "traspaso") { if (x.direccion === "entrada") { m.cuenta = otra; m.destino = cuentaId; } else m.destino = otra; }
            const dup = importe > 0 && esDuplicado(m);
            return { m, marcado: importe > 0 && !dup, dup };
          }).filter(f => f.m.importe > 0).sort((a, b) => b.m.fecha.localeCompare(a.m.fecha));
        }

        function paso2() {
          const c = cuenta(cuentaId), nuevos = filas.filter(f => !f.dup).length;
          const selCat = (f, i) => `<select data-cat="${i}">${d.cats[f.m.tipo].map(k => `<option ${k === f.m.cat ? "selected" : ""}>${esc(k)}</option>`).join("")}</select>`;
          const selClase = (f, i) => `<select data-clase="${i}">${CLASES.map(k => `<option value="${k.id}" ${k.id === f.m.clase ? "selected" : ""}>${k.nombre}</option>`).join("")}</select>`;
          const lista = filas.map((f, i) => {
            const m = f.m, signo = m.tipo === "gasto" || (m.tipo === "invertir") || (m.tipo === "traspaso" && m.cuenta === cuentaId) ? "−" : "+";
            const titulo = m.tipo === "traspaso" ? "Traspaso " + (m.cuenta === cuentaId ? "a " : "desde ") + ((cuenta(m.cuenta === cuentaId ? m.destino : m.cuenta) || {}).nombre || "otra cuenta")
              : m.tipo === "invertir" ? "Inversión" : m.tipo === "desinvertir" ? "Venta" : m.tipo === "ingreso" ? "Ingreso" : "Gasto";
            return `<div class="pt-imp ${f.dup ? "dup" : ""}"><input type="checkbox" data-i="${i}" ${f.marcado ? "checked" : ""} aria-label="Importar">
              <div><div class="t">${esc(m.nota || titulo)}</div><div class="sub">${fechaCorta(m.fecha)}, ${titulo.charAt(0).toLowerCase() + titulo.slice(1)}${f.dup ? ", ya registrado" : ""}</div>
                ${m.tipo === "gasto" || m.tipo === "ingreso" ? selCat(f, i) : ""}${m.tipo === "invertir" || m.tipo === "desinvertir" ? selClase(f, i) : ""}</div>
              <div class="imp ${signo === "+" ? "pt-pos" : ""}">${signo}${eur(m.importe)}</div></div>`;
          }).join("");
          const saldo = Number(resultado.saldo_final), hayValor = resultado.valor_inversiones && typeof resultado.valor_inversiones === "object";
          h.paso.innerHTML = `<h2>Revisa antes de guardar</h2>
            <p class="aviso">${filas.length} movimientos encontrados en ${esc(c.nombre)}${filas.length - nuevos ? `, ${filas.length - nuevos} ya estaban registrados y vienen desmarcados` : ""}. Puedes cambiar categorías o desmarcar lo que no quieras importar.</p>
            ${isFinite(saldo) && resultado.saldo_final !== null ? `<label class="pt-check"><input type="checkbox" id="ptImpSaldo" checked><span>Poner el saldo de ${esc(c.nombre)} en <b>${eur(saldo)}</b>${resultado.fecha_saldo ? ", según el extracto a " + fechaCorta(resultado.fecha_saldo) : ""}.</span></label>` : ""}
            ${hayValor ? `<label class="pt-check"><input type="checkbox" id="ptImpValor" checked><span>Actualizar el valor de tus inversiones: ${CLASES.filter(k => resultado.valor_inversiones[k.id] != null).map(k => k.nombre + " " + eur(Number(resultado.valor_inversiones[k.id]))).join(", ")}.</span></label>` : ""}
            <div style="margin-top:8px">${lista || `<p class="aviso">No se han encontrado movimientos.</p>`}</div>
            <div class="pt-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="ok">Importar</button></div>`;
          h.paso.querySelectorAll("[data-i]").forEach(el => el.onchange = () => { filas[+el.dataset.i].marcado = el.checked; });
          h.paso.querySelectorAll("[data-cat]").forEach(el => el.onchange = () => { filas[+el.dataset.cat].m.cat = el.value; });
          h.paso.querySelectorAll("[data-clase]").forEach(el => el.onchange = () => { filas[+el.dataset.clase].m.clase = el.value; });
          h.paso.querySelector("[data-h=c]").onclick = h.cerrar;
          h.paso.querySelector("[data-h=ok]").onclick = () => {
            let n = 0;
            filas.filter(f => f.marcado).sort((a, b) => a.m.fecha.localeCompare(b.m.fecha)).forEach(f => {
              const m = Object.assign({ id: nuevoId(), creado: Date.now() + n, importado: true }, f.m);
              if (m.tipo === "desinvertir") {
                const x = d.inv[m.clase];
                m.coste = x.valor > 0 ? Math.round(x.aportado * Math.min(1, m.importe / x.valor) * 100) / 100 : 0;
              }
              aplicar(m, 1);
              CLASES.forEach(k => { d.inv[k.id].valor = Math.max(0, d.inv[k.id].valor); d.inv[k.id].aportado = Math.max(0, d.inv[k.id].aportado); });
              d.movs.push(m); n++;
            });
            const chkS = h.paso.querySelector("#ptImpSaldo"); if (chkS && chkS.checked) c.saldo = Math.round(saldo * 100) / 100;
            const chkV = h.paso.querySelector("#ptImpValor");
            if (chkV && chkV.checked) CLASES.forEach(k => { const v = Number(resultado.valor_inversiones[k.id]); if (isFinite(v) && resultado.valor_inversiones[k.id] !== null) d.inv[k.id].valor = Math.round(v * 100) / 100; });
            guardar(); h.cerrar();
            const ult = filas.filter(f => f.marcado).map(f => f.m.fecha).sort().pop(); if (ult) mesSel = ult.slice(0, 7);
            vista = "movimientos"; pintar();
            setTimeout(() => alert(n ? `Listo: ${n} movimientos importados.` : "No se ha importado ningún movimiento."), 50);
          };
        }
        paso1();
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "rango") rango = b.dataset.r;
        else if (a === "mes") { const [y, m] = mesSel.split("-").map(Number); const n = new Date(y, m - 1 + Number(b.dataset.d), 1); mesSel = clave(n).slice(0, 7); }
        else if (a === "nuevo-mov") return hojaMovimiento();
        else if (a === "cuenta") return hojaCuenta(b.dataset.id);
        else if (a === "nueva-cuenta") return hojaCuenta(null);
        else if (a === "clase") return hojaClase(b.dataset.id);
        else if (a === "importar") return leerClaveIA() ? hojaImportar() : hojaClaveIA(hojaImportar);
        else if (a === "clave-ia") return hojaClaveIA();
        else if (a === "borrar-mov") {
          if (!confirm("¿Borrar este movimiento? Se deshará su efecto en los saldos.")) return;
          const m = d.movs.find(x => x.id === b.dataset.id);
          aplicar(m, -1); d.movs = d.movs.filter(x => x.id !== m.id); guardar();
        }
        pintar();
      });

      pintar();
    }
  });
})();
