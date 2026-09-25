/* PANTALLA: Finanzas
   Resumen del patrimonio, ingresos/gastos/traspasos y evolución mes a mes.
   Contiene también la lógica común de inversiones (window.Finanzas), que usa la pantalla Inversiones.
   Todo se calcula a partir de hechos con fecha: movimientos, compras/ventas y valores registrados.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .pt-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:16px; }
  .pt-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .pt-seg button.on { background:var(--papel-2); color:var(--tinta); }

  .pt-total { padding:6px 2px 18px; }
  .pt-total .cifra { font-size:44px; line-height:1.05; }
  .pt-delta { font-size:14px; color:var(--tinta-suave); margin-top:6px; }
  .pt-delta b { font-weight:600; }
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
  .pt-rent span.etiqueta + b + span.etiqueta { display:block; margin-top:2px; }
  .pt-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtE = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always" });
  const eur = n => fmtE.format(Math.round((n || 0) * 100) / 100);
  const eurS = n => (n > 0.004 ? "+" : "") + eur(n);
  const pct = n => {
    if (n === null || n === undefined || !isFinite(n)) return "–";
    if (Math.abs(n) < 0.0005) n = 0;
    return (n > 0 ? "+" : "") + (n * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";
  };
  const clsN = n => n > 0.00001 ? "pt-pos" : n < -0.00001 ? "pt-neg" : "";
  const num = s => { s = String(s == null ? "" : s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const sumarDias = (k, n) => { const x = aFecha(k); x.setDate(x.getDate() + n); return clave(x); };
  const diasEntre = (a, b) => Math.round((aFecha(b) - aFecha(a)) / 864e5);
  const fechaCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const mesMas = (ym, n) => { const [y, m] = ym.split("-").map(Number); return clave(new Date(y, m - 1 + n, 1)).slice(0, 7); };
  const finDeMes = ym => { const [y, m] = ym.split("-").map(Number); return clave(new Date(y, m, 0)); };
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const normN = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  const CLASES = [
    { id: "acciones", nombre: "Acciones", color: "#4DA3FF" },
    { id: "etfs", nombre: "ETFs", color: "#1FD67A" },
    { id: "materias", nombre: "Materias primas", color: "#F5C542" },
    { id: "crypto", nombre: "Crypto", color: "#FF8A3D" }
  ];
  const COLOR_LIQ = "#5A5A61";

  // =====================================================================
  //  LÓGICA COMÚN (la usa también Inversiones). Fechas en formato "AAAA-MM-DD".
  //  Activo: {id, nombre, clase, ops:[{id, fecha, tipo:"compra"|"venta", n, precio, cuenta}], valores:[{fecha, precio}]}
  // =====================================================================
  const Fin = window.Finanzas = {
    CLASES, COLOR_LIQ, esc, eur, eurS, pct, num, clave, hoyK, aFecha, sumarDias, diasEntre, fechaCorta, mesMas, finDeMes, nuevoId, normN, MESES,

    // Prepara los datos. Versión 2: las inversiones se guardan como compras, ventas y valores con fecha.
    preparar(d) {
      d.cuentas = d.cuentas || [{ id: "bbva", nombre: "BBVA", saldo: 0 }, { id: "tr", nombre: "Trade Republic", saldo: 0 }];
      d.movs = d.movs || [];
      d.cats = d.cats || { gasto: ["Supermercado", "Restaurantes", "Ocio", "Transporte", "Hogar", "Suscripciones", "Ropa", "Deporte", "Otros"], ingreso: ["Nómina", "Beca", "Regalos", "Otros"] };
      ["Intereses y dividendos", "Devoluciones"].forEach(c => { if (!d.cats.ingreso.includes(c)) d.cats.ingreso.splice(d.cats.ingreso.length - 1, 0, c); });
      if (d.v !== 2) {
        // Se guarda lo antiguo aparte por si acaso, y se empieza de cero con las inversiones
        const viejo = {}; ["inv", "activos", "fotos", "ultimaValoracion"].forEach(k => { if (d[k] !== undefined) { viejo[k] = d[k]; delete d[k]; } });
        const movInv = d.movs.filter(m => m.tipo === "invertir" || m.tipo === "desinvertir");
        if (movInv.length) viejo.movsInversion = movInv;
        if (Object.keys(viejo).length) d.respaldoV1 = viejo;
        d.movs = d.movs.filter(m => m.tipo === "gasto" || m.tipo === "ingreso" || m.tipo === "traspaso");
        d.activos = [];
        d.v = 2;
      }
      d.activos = d.activos || [];
    },

    activo: (d, id) => d.activos.find(a => a.id === id),
    buscarActivo: (d, nombre) => d.activos.find(a => normN(a.nombre) === normN(nombre)),
    opsOrdenadas: a => a.ops.slice().sort((x, y) => x.fecha.localeCompare(y.fecha) || (x.tipo === "compra" ? -1 : 1) || (x.creado || 0) - (y.creado || 0)),

    // Posición al final del día t: acciones, coste (precio medio x acciones) y beneficio ya realizado con ventas
    posicion(a, t = hoyK()) {
      let n = 0, coste = 0, realizado = 0, comprado = 0, vendido = 0;
      for (const o of Fin.opsOrdenadas(a)) {
        if (o.fecha > t) break;
        if (o.tipo === "compra") { n += o.n; coste += o.n * o.precio; comprado += o.n * o.precio; }
        else { const medio = n > 0 ? coste / n : 0; realizado += o.n * (o.precio - medio); coste -= medio * o.n; n -= o.n; vendido += o.n * o.precio; }
        if (n < 1e-9) { n = 0; coste = 0; }
      }
      return { n, coste, medio: n > 0 ? coste / n : 0, realizado, comprado, vendido };
    },
    // Precio por acción en la fecha t: el último registrado (valor de mercado, compra o venta) en t o antes
    precio(a, t = hoyK()) {
      let mejor = null;
      a.ops.forEach(o => { if (o.fecha <= t && (!mejor || o.fecha > mejor.fecha)) mejor = { fecha: o.fecha, precio: o.precio, prio: 0 }; });
      a.valores.forEach(v => { if (v.fecha <= t && (!mejor || v.fecha > mejor.fecha || (v.fecha === mejor.fecha && mejor.prio === 0))) mejor = { fecha: v.fecha, precio: v.precio, prio: 1 }; });
      return mejor;
    },
    valor(a, t = hoyK()) { const p = Fin.posicion(a, t); if (!p.n) return 0; const pr = Fin.precio(a, t); return pr ? p.n * pr.precio : p.coste; },
    // Totales de un conjunto de activos en una fecha
    totales(acts, t = hoyK()) {
      return acts.reduce((s, a) => { const p = Fin.posicion(a, t); s.valor += Fin.valor(a, t); s.coste += p.coste; s.realizado += p.realizado; return s; }, { valor: 0, coste: 0, realizado: 0 });
    },
    delaClase: (d, clase) => d.activos.filter(a => a.clase === clase),

    // Efecto de un movimiento o de una compra/venta en el saldo de su cuenta
    efectoMov(m) {
      const e = {};
      if (m.tipo === "gasto") e[m.cuenta] = -m.importe;
      if (m.tipo === "ingreso") e[m.cuenta] = m.importe;
      if (m.tipo === "traspaso") { e[m.cuenta] = -m.importe; if (m.destino) e[m.destino] = (e[m.destino] || 0) + m.importe; }
      return e;
    },
    efectoOp: o => o.cuenta ? { [o.cuenta]: (o.tipo === "compra" ? -1 : 1) * o.n * o.precio } : {},
    aplicarEfecto(d, efecto, signo) { Object.entries(efecto).forEach(([id, x]) => { const c = d.cuentas.find(c => c.id === id); if (c) c.saldo = Math.round((c.saldo + x * signo) * 100) / 100; }); },

    // Liquidez al final del día t: saldo actual menos todo lo que ha pasado después de t
    liquidez(d, t = hoyK()) {
      let total = d.cuentas.reduce((s, c) => s + c.saldo, 0);
      const ids = new Set(d.cuentas.map(c => c.id));
      const restar = e => Object.entries(e).forEach(([id, x]) => { if (ids.has(id)) total -= x; });
      d.movs.forEach(m => { if (m.fecha > t) restar(Fin.efectoMov(m)); });
      d.activos.forEach(a => a.ops.forEach(o => { if (o.fecha > t) restar(Fin.efectoOp(o)); }));
      return total;
    },
    patrimonio: (d, t = hoyK()) => Fin.liquidez(d, t) + Fin.totales(d.activos, t).valor,

    // TIR anual (XIRR): compras como pagos, ventas como cobros y el valor de hoy como cobro final
    tir(acts, hasta = hoyK()) {
      const flujos = [];
      acts.forEach(a => a.ops.forEach(o => { if (o.fecha <= hasta) flujos.push({ f: o.fecha, v: (o.tipo === "compra" ? -1 : 1) * o.n * o.precio }); }));
      if (!flujos.length) return null;
      flujos.push({ f: hasta, v: Fin.totales(acts, hasta).valor });
      const t0 = flujos.reduce((m, x) => x.f < m ? x.f : m, hasta);
      if (diasEntre(t0, hasta) < 90) return null;
      const vpn = r => flujos.reduce((s, x) => s + x.v / Math.pow(1 + r, diasEntre(t0, x.f) / 365), 0);
      let lo = -0.9999, hi = 100, flo = vpn(lo);
      if (flo * vpn(hi) > 0) return null;
      for (let i = 0; i < 300; i++) { const mid = (lo + hi) / 2, fm = vpn(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } }
      return (lo + hi) / 2;
    },
    // TWR anualizada: se encadena la rentabilidad entre cada compra o venta, sin contar el dinero que entra o sale
    twr(acts, hasta = hoyK()) {
      const fechas = [...new Set(acts.flatMap(a => a.ops.filter(o => o.fecha <= hasta).map(o => o.fecha)))].sort();
      if (!fechas.length || diasEntre(fechas[0], hasta) < 90) return null;
      let acum = 1, despues = 0;
      fechas.forEach(t => {
        const antes = acts.reduce((s, a) => { const p = Fin.posicion(a, sumarDias(t, -1)); const pr = Fin.precio(a, t); return s + (p.n && pr ? p.n * pr.precio : 0); }, 0);
        if (despues > 0) acum *= antes / despues;
        despues = Fin.totales(acts, t).valor;
      });
      if (despues > 0) acum *= Fin.totales(acts, hasta).valor / despues;
      return Math.pow(acum, 365 / diasEntre(fechas[0], hasta)) - 1;
    },
    // Rentabilidad de un mes (Dietz modificado, ponderando cada compra/venta por los días que estuvo invertida)
    rentMes(acts, ym) {
      const ini = finDeMes(mesMas(ym, -1)), finR = finDeMes(ym), fin = finR > hoyK() ? hoyK() : finR;
      if (fin <= ini) return null;
      const v0 = Fin.totales(acts, ini).valor, v1 = Fin.totales(acts, fin).valor, dias = diasEntre(ini, fin);
      let flujo = 0, pond = 0;
      acts.forEach(a => a.ops.forEach(o => { if (o.fecha > ini && o.fecha <= fin) { const x = (o.tipo === "compra" ? 1 : -1) * o.n * o.precio; flujo += x; pond += x * diasEntre(o.fecha, fin) / dias; } }));
      const den = v0 + pond;
      if (den <= 0.01 || (v0 === 0 && flujo === 0)) return null;
      return (v1 - v0 - flujo) / den;
    },
    primeraFecha(d) {
      const fs = [...d.movs.map(m => m.fecha), ...d.activos.flatMap(a => a.ops.map(o => o.fecha))].sort();
      return fs[0] || null;
    },
    opcionesCuentas(d, sel, conNinguna) {
      return d.cuentas.map(c => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${esc(c.nombre)}</option>`).join("")
        + (conNinguna ? `<option value="" ${!sel ? "selected" : ""}>Ninguna (ya estaba descontado)</option>` : "");
    },

    // Gráfico de barras por meses. series: [{color, vals}] apiladas o agrupadas; linea opcional discontinua
    grafBarras(meses, series, opc = {}) {
      const W = 340, H = 190, pad = { t: 10, r: 6, b: 22, l: 40 };
      const n = meses.length, ancho = (W - pad.l - pad.r) / n;
      const alturas = meses.map((_, i) => opc.agrupadas ? Math.max(0, ...series.map(s => s.vals[i] || 0)) : series.reduce((t, s) => t + Math.max(s.vals[i] || 0, 0), 0));
      const max = Math.max(...alturas, ...(opc.linea ? opc.linea.vals.filter(v => v != null) : []), 1) * 1.1;
      const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
      const corto = v => v >= 1000 ? (v / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "k" : String(Math.round(v));
      let g = "";
      for (let i = 0; i <= 3; i++) { const v = max * i / 3; g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${corto(v)}</text>`; }
      meses.forEach((_, i) => {
        if (opc.agrupadas) {
          const w = ancho * 0.76 / series.length;
          series.forEach((s, j) => { const v = Math.max(s.vals[i] || 0, 0); if (v) g += `<rect x="${pad.l + i * ancho + ancho * 0.12 + j * w}" y="${Y(v)}" width="${Math.max(w - 1, 1)}" height="${Y(0) - Y(v)}" rx="${Math.min(w / 3, 2.5)}" fill="${s.color}"/>`; });
        } else {
          let base = 0; const w = ancho * 0.62;
          series.forEach(s => { const v = Math.max(s.vals[i] || 0, 0); if (v) { g += `<rect x="${pad.l + i * ancho + (ancho - w) / 2}" y="${Y(base + v)}" width="${w}" height="${Y(base) - Y(base + v)}" fill="${s.color}"/>`; base += v; } });
        }
      });
      if (opc.linea) {
        const pts = opc.linea.vals.map((v, i) => v == null ? null : [pad.l + (i + 0.5) * ancho, Y(v)]).filter(Boolean);
        g += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${opc.linea.color}" stroke-width="1.8" ${opc.linea.discontinua ? 'stroke-dasharray="4 3"' : ""} stroke-linejoin="round"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="${opc.linea.color}"/>`).join("");
      }
      const paso = Math.ceil(n / 7);
      g += meses.map((m, i) => (n - 1 - i) % paso === 0 ? `<text x="${pad.l + (i + 0.5) * ancho}" y="${H - 6}" text-anchor="middle">${MESES[+m.slice(5) - 1]}${i === 0 || m.endsWith("-01") ? " " + m.slice(2, 4) : ""}</text>` : "").join("");
      return `<svg viewBox="0 0 ${W} ${H}">${g}</svg>`;
    },
    meses(desde, rango) {
      const actual = hoyK().slice(0, 7);
      let ini = desde ? desde.slice(0, 7) : actual;
      if (rango !== "todo") { const lim = mesMas(actual, rango === "6m" ? -5 : -11); if (ini < lim) ini = lim; }
      const out = []; for (let m = ini; m <= actual; m = mesMas(m, 1)) out.push(m);
      return out;
    },
    // Fecha de corte de un mes: su último día, o hoy si es el mes en curso
    corte: ym => { const f = finDeMes(ym); return f > hoyK() ? hoyK() : f; }
  };

  // Estado de pantalla
  let vista = "resumen", rango = "1a", mesSel = null, tipoSel = "gasto";
  const TIPOS = [{ id: "gasto", nombre: "Gasto" }, { id: "ingreso", nombre: "Ingreso" }, { id: "traspaso", nombre: "Traspaso" }];

  HiperApp.registrar({
    id: "patrimonio",
    titulo: "Finanzas",
    color: "#1FD67A",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      Fin.preparar(d);
      if (!mesSel) mesSel = hoyK().slice(0, 7);
      const guardar = () => store.set(d);
      const cuenta = id => d.cuentas.find(c => c.id === id);
      const raiz = document.createElement("div");
      raiz.className = "pt-raiz";
      contenedor.appendChild(raiz);

      // ---------- Vista 1: resumen ----------
      function vistaResumen() {
        const hoy = hoyK(), liq = Fin.liquidez(d), inv = Fin.totales(d.activos), T = liq + inv.valor;
        const hace30 = sumarDias(hoy, -30), primera = Fin.primeraFecha(d);
        const delta = primera && primera <= hace30 ? `<div class="pt-delta"><b class="${clsN(T - Fin.patrimonio(d, hace30))}">${eurS(T - Fin.patrimonio(d, hace30))}</b> en los últimos 30 días</div>` : "";

        const partes = [{ n: "Liquidez", v: liq, c: COLOR_LIQ }].concat(CLASES.map(c => ({ n: c.nombre, v: Fin.totales(Fin.delaClase(d, c.id)).valor, c: c.color })));
        const dist = T > 0 ? partes.filter(p => p.v > 0).map(p => `<div style="flex:${p.v};background:${p.c}"></div>`).join("") : `<div style="flex:1;background:var(--papel-2)"></div>`;
        const ley = partes.map(p => `<span><i style="background:${p.c}"></i>${p.n} ${T > 0 ? Math.round(Math.max(p.v, 0) / T * 100) + "%" : ""}</span>`).join("");

        const cuentas = d.cuentas.map(c => `
          <button class="pt-fila" data-accion="cuenta" data-id="${c.id}">
            <div class="izq"><div>${esc(c.nombre)}</div></div>
            <div class="der">${eur(c.saldo)}</div>
          </button>`).join("");

        const filasInv = CLASES.map(c => {
          const acts = Fin.delaClase(d, c.id).filter(a => Fin.posicion(a).n > 0);
          const t = Fin.totales(acts), g = t.valor - t.coste;
          return `<button class="pt-fila" data-accion="ir-inversiones">
            <div class="izq"><div>${c.nombre}</div><div class="sub">${acts.length ? acts.length + (acts.length === 1 ? " activo, " : " activos, ") : ""}aportado ${eur(t.coste)}</div></div>
            <div class="der">${eur(t.valor)}<div class="sub ${clsN(g)}">${eurS(g)}${t.coste > 0 ? " (" + pct(t.valor / t.coste - 1) + ")" : ""}</div></div>
          </button>`;
        }).join("");
        const ben = inv.valor - inv.coste, tir = Fin.tir(d.activos);

        const vacio = !d.cuentas.some(c => c.saldo) && !d.activos.length && !d.movs.length ? `<div class="bloque"><h2>Primeros pasos</h2>
          <p>Toca cada cuenta para poner su saldo actual. Tus inversiones se dan de alta en la pantalla Inversiones. A partir de ahí, apunta tus ingresos y gastos con el botón +.</p></div>` : "";

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
            <div class="pt-cab"><h2>Liquidez</h2><span class="v">${eur(liq)}</span></div>
            ${cuentas}
            <button class="pt-enlace" data-accion="nueva-cuenta">Añadir cuenta</button>
          </div>
          <div class="bloque">
            <div class="pt-cab"><h2>Inversión</h2><span class="v">${eur(inv.valor)}</span></div>
            ${filasInv}
            <div class="pt-rent">
              <div><span class="etiqueta">Beneficio sobre lo aportado</span><b class="${clsN(ben)}">${inv.coste > 0 ? pct(inv.valor / inv.coste - 1) : "–"}</b><span class="etiqueta">${eurS(ben)}</span></div>
              <div><span class="etiqueta">Rentabilidad anualizada</span><b class="${clsN(tir)}">${tir === null ? "–" : pct(tir)}</b><span class="etiqueta">${tir === null ? (d.activos.length ? "con 3 meses de historia" : "") : "al año"}</span></div>
            </div>
            <p class="aviso" style="margin:12px 0 0;font-size:12.5px">La rentabilidad anualizada es el interés al año equivalente a tu beneficio, teniendo en cuenta cuándo aportaste cada euro.</p>
          </div>`;
      }

      // ---------- Vista 2: movimientos ----------
      function vistaMovimientos() {
        const [a, m] = mesSel.split("-").map(Number);
        const mesTxt = new Date(a, m - 1, 1).toLocaleDateString("es-ES", { month: "long" });
        const nombreMes = mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1) + " " + a;
        const delMes = d.movs.filter(x => x.fecha.startsWith(mesSel));
        const ing = delMes.filter(x => x.tipo === "ingreso").reduce((s, x) => s + x.importe, 0);
        const gas = delMes.filter(x => x.tipo === "gasto").reduce((s, x) => s + x.importe, 0);
        const ahorro = ing - gas;
        // Compras y ventas de inversiones del mes (se gestionan en Inversiones; aquí solo se muestran)
        const ops = d.activos.flatMap(ac => ac.ops.filter(o => o.fecha.startsWith(mesSel)).map(o => ({ o, ac })));
        const invertido = ops.reduce((s, x) => s + (x.o.tipo === "compra" ? 1 : -1) * x.o.n * x.o.precio, 0);

        const porCat = {};
        delMes.filter(x => x.tipo === "gasto").forEach(x => porCat[x.cat] = (porCat[x.cat] || 0) + x.importe);
        const cats = Object.entries(porCat).sort((x, y) => y[1] - x[1]).map(([c, v]) => `
          <div class="pt-cat"><div class="n"><span>${esc(c)}</span><span>${eur(v)}</span></div>
          <div class="pt-barra"><div style="width:${v / gas * 100}%"></div></div></div>`).join("");

        const nomCuenta = id => { const c = cuenta(id); return c ? c.nombre : "Cuenta borrada"; };
        const filas = delMes.map(x => ({ fecha: x.fecha, orden: x.creado || 0, html: (() => {
          let titulo, sub, imp, cls = "";
          if (x.tipo === "gasto") { titulo = x.cat; sub = nomCuenta(x.cuenta); imp = "−" + eur(x.importe); }
          else if (x.tipo === "ingreso") { titulo = x.cat; sub = nomCuenta(x.cuenta); imp = "+" + eur(x.importe); cls = "pt-pos"; }
          else { titulo = "Traspaso"; sub = nomCuenta(x.cuenta) + " a " + nomCuenta(x.destino); imp = eur(x.importe); }
          return `<div class="pt-fila" style="cursor:default">
            <div class="izq"><div>${esc(titulo)}${x.nota ? ` <span class="sub">${esc(x.nota)}</span>` : ""}</div><div class="sub">${esc(sub)}, ${fechaCorta(x.fecha)}</div></div>
            <div class="der ${cls}">${imp}</div>
            <button class="pt-borrar" data-accion="borrar-mov" data-id="${x.id}" aria-label="Borrar movimiento">×</button></div>`; })() }))
          .concat(ops.map(({ o, ac }) => ({ fecha: o.fecha, orden: o.creado || 0, html: `<button class="pt-fila" data-accion="ir-inversiones">
            <div class="izq"><div>${o.tipo === "compra" ? "Compra de " : "Venta de "}${esc(ac.nombre)}</div><div class="sub">${o.cuenta ? esc(nomCuenta(o.cuenta)) + ", " : ""}${fechaCorta(o.fecha)}, en Inversiones</div></div>
            <div class="der">${eur(o.n * o.precio)}</div></button>` })))
          .sort((x, y) => y.fecha.localeCompare(x.fecha) || y.orden - x.orden).map(x => x.html).join("");

        return `
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
            ${ops.length ? `<p style="margin:12px 0 0;font-size:14px">${invertido >= 0 ? "Has invertido " + eur(invertido) : "Has retirado " + eur(-invertido) + " de inversiones"} este mes.</p>` : ""}
          </div>
          ${cats ? `<div class="bloque"><h2>Gastos por categoría</h2>${cats}</div>` : ""}
          <div class="bloque">
            <h2>Movimientos</h2>
            ${filas || `<p>Sin movimientos este mes. Usa el botón + para apuntar uno.</p>`}
          </div>`;
      }

      // ---------- Vista 3: evolución ----------
      function vistaEvolucion() {
        const meses = Fin.meses(Fin.primeraFecha(d), rango);
        const rangos = `<div class="pt-rangos">${[["6m", "6 meses"], ["1a", "1 año"], ["todo", "Todo"]].map(([id, n]) =>
          `<button class="${rango === id ? "on" : ""}" data-accion="rango" data-r="${id}">${n}</button>`).join("")}</div>`;
        const ley = xs => `<div class="pt-leyenda" style="margin-top:10px">${xs.map(([n, c, raya]) => `<span><i style="background:${c}${raya ? ";height:2px;border-radius:0;width:12px" : ""}"></i>${n}</span>`).join("")}</div>`;
        if (!Fin.primeraFecha(d)) return `<div class="bloque"><h2>Evolución</h2><p>Las gráficas aparecerán en cuanto apuntes movimientos o inversiones.</p></div>`;

        // 1. Ingresos y gastos de cada mes, con el ahorro
        const ing = meses.map(m => d.movs.filter(x => x.tipo === "ingreso" && x.fecha.startsWith(m)).reduce((s, x) => s + x.importe, 0));
        const gas = meses.map(m => d.movs.filter(x => x.tipo === "gasto" && x.fecha.startsWith(m)).reduce((s, x) => s + x.importe, 0));
        const conDatos = meses.map((_, i) => ing[i] > 0 || gas[i] > 0);
        const nDatos = conDatos.filter(Boolean).length;
        const ahorroTotal = ing.reduce((a, b) => a + b, 0) - gas.reduce((a, b) => a + b, 0);
        const g1 = nDatos ? `<div class="pt-cab"><h2>Ingresos y gastos</h2><span class="v ${clsN(ahorroTotal)}">${eurS(ahorroTotal / nDatos)}</span></div>
            <p style="margin:0;font-size:14px">Ahorro medio por mes (en los ${nDatos} ${nDatos === 1 ? "mes" : "meses"} con datos).</p>
            ${Fin.grafBarras(meses, [{ color: "var(--naranja)", vals: ing }, { color: "var(--rojo)", vals: gas }], { agrupadas: true })}
            ${ley([["Ingresos", "var(--naranja)"], ["Gastos", "var(--rojo)"]])}`
          : `<h2>Ingresos y gastos</h2><p>Aparecerá cuando apuntes ingresos o gastos.</p>`;

        // 2. Patrimonio a final de cada mes (reconstruido con movimientos, compras, ventas y valores)
        const cortes = meses.map(Fin.corte);
        const liqM = cortes.map(t => Fin.liquidez(d, t));
        const claseM = CLASES.map(c => ({ c, vals: cortes.map(t => Fin.totales(Fin.delaClase(d, c.id), t).valor) }));
        const totM = cortes.map((t, i) => liqM[i] + claseM.reduce((s, x) => s + x.vals[i], 0));
        const cambio = totM[totM.length - 1] - totM[0];
        const g2 = `<div class="pt-cab"><h2>Patrimonio</h2><span class="v ${clsN(cambio)}">${eurS(cambio)}</span></div>
            <p style="margin:0;font-size:14px">Valor a final de cada mes${meses.length > 1 ? ", y cambio desde " + MESES[+meses[0].slice(5) - 1] + " " + meses[0].slice(0, 4) : ""}.</p>
            ${Fin.grafBarras(meses, [{ color: COLOR_LIQ, vals: liqM }].concat(claseM.map(x => ({ color: x.c.color, vals: x.vals }))))}
            ${ley([["Liquidez", COLOR_LIQ]].concat(CLASES.map(c => [c.nombre, c.color])))}`;

        // 3. Inversiones: valor de mercado por categoría y lo aportado (coste de lo que tienes) a final de mes
        let g3 = `<h2>Inversiones</h2><p>Aparecerá cuando des de alta tus inversiones en la pantalla Inversiones.</p>`;
        if (d.activos.length) {
          const costeM = cortes.map(t => Fin.totales(d.activos, t).coste);
          const valM = cortes.map((t, i) => claseM.reduce((s, x) => s + x.vals[i], 0));
          const ult = valM.length - 1, ben = valM[ult] - costeM[ult];
          g3 = `<div class="pt-cab"><h2>Inversiones</h2><span class="v ${clsN(ben)}">${eurS(ben)}</span></div>
            <p style="margin:0;font-size:14px">Valor de mercado a final de cada mes y lo aportado. Arriba, el beneficio actual.</p>
            ${Fin.grafBarras(meses, claseM.map(x => ({ color: x.c.color, vals: x.vals })), { linea: { color: "var(--tinta)", vals: costeM, discontinua: true } })}
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

      // ---------- Hojas ----------
      function hoja(html, alGuardar, extra) {
        const fondo = document.createElement("div");
        fondo.className = "panel-fondo";
        fondo.innerHTML = `<div class="panel pt-form" role="dialog">${html}
          <div class="pt-acciones"><button class="boton secundario" data-h="cancelar">Cancelar</button><button class="boton" data-h="guardar">Guardar</button></div>
          ${extra || ""}</div>`;
        raiz.appendChild(fondo);
        fondo.addEventListener("click", e => {
          if (e.target === fondo || e.target.dataset.h === "cancelar") fondo.remove();
          if (e.target.dataset.h === "guardar") { if (alGuardar(fondo) !== false) { fondo.remove(); guardar(); pintar(); } }
        });
        return fondo;
      }
      const leerImporte = (el, permitirNegativo) => {
        const v = num(el.value);
        if (!isFinite(v) || (!permitirNegativo && v <= 0)) { el.focus(); el.style.borderColor = "var(--rojo)"; return null; }
        return Math.round(v * 100) / 100;
      };

      function hojaMovimiento() {
        if (!TIPOS.some(t => t.id === tipoSel)) tipoSel = "gasto";
        const f = hoja(`<h2>Nuevo movimiento</h2>
          <div class="pt-tipos">${TIPOS.map(t => `<button class="${t.id === tipoSel ? "on" : ""}" data-tipo="${t.id}">${t.nombre}</button>`).join("")}</div>
          <label>Importe (€)</label><input class="pt-importe" id="ptImp" inputmode="decimal" placeholder="0,00" autocomplete="off">
          <div id="ptCampos"></div>
          <div class="dos"><div><label>Fecha</label><input type="date" id="ptFecha" value="${hoyK()}" max="${hoyK()}"></div>
            <div><label>Nota (opcional)</label><input id="ptNota" maxlength="60"></div></div>
          <p class="aviso" style="font-size:12.5px">Las compras y ventas de inversiones se apuntan en la pantalla Inversiones.</p>`,
          f => {
            const importe = leerImporte(f.querySelector("#ptImp")); if (importe === null) return false;
            const m = { id: nuevoId(), creado: Date.now(), tipo: tipoSel, importe, fecha: f.querySelector("#ptFecha").value || hoyK(),
              nota: f.querySelector("#ptNota").value.trim(), cuenta: f.querySelector("#ptCuenta").value };
            if (tipoSel !== "traspaso") { m.cat = f.querySelector("#ptCat").value; if (m.cat === "__nueva") return false; }
            else { m.destino = f.querySelector("#ptDestino").value; if (m.destino === m.cuenta) { alert("Elige dos cuentas distintas."); return false; } }
            Fin.aplicarEfecto(d, Fin.efectoMov(m), 1);
            d.movs.push(m);
            mesSel = m.fecha.slice(0, 7);
          });
        function campos() {
          let h = "";
          if (tipoSel !== "traspaso") h += `<label>Categoría</label><select id="ptCat">${d.cats[tipoSel].map(c => `<option>${esc(c)}</option>`).join("")}<option value="__nueva">+ Nueva…</option></select>`;
          const etq = { gasto: "Pagado desde", ingreso: "Cobrado en", traspaso: "Desde" }[tipoSel];
          h += `<div class="dos"><div><label>${etq}</label><select id="ptCuenta">${Fin.opcionesCuentas(d, d.cuentas[0] && d.cuentas[0].id)}</select></div>`;
          if (tipoSel === "traspaso") h += `<div><label>Hacia</label><select id="ptDestino">${Fin.opcionesCuentas(d, d.cuentas[1] && d.cuentas[1].id)}</select></div>`;
          f.querySelector("#ptCampos").innerHTML = h + `</div>`;
        }
        campos();
        f.addEventListener("click", e => {
          const t = e.target.dataset.tipo; if (!t) return;
          tipoSel = t; f.querySelectorAll("[data-tipo]").forEach(b => b.classList.toggle("on", b.dataset.tipo === t)); campos();
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
            if (c) { c.nombre = nombre; c.saldo = saldo; } else d.cuentas.push({ id: nuevoId(), nombre, saldo });
          },
          c && d.cuentas.length > 1 ? `<button class="pt-peligro" data-h="borrar">Borrar cuenta</button>` : "");
        f.addEventListener("click", e => {
          if (e.target.dataset.h !== "borrar") return;
          if (!confirm("¿Borrar la cuenta " + c.nombre + "? Su saldo dejará de contar en tu patrimonio.")) return;
          d.cuentas = d.cuentas.filter(x => x.id !== c.id); f.remove(); guardar(); pintar();
        });
        setTimeout(() => f.querySelector(c ? "#ptSaldo" : "#ptNom").focus(), 50);
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "rango") rango = b.dataset.r;
        else if (a === "mes") { const [y, m] = mesSel.split("-").map(Number); mesSel = clave(new Date(y, m - 1 + Number(b.dataset.d), 1)).slice(0, 7); }
        else if (a === "nuevo-mov") return hojaMovimiento();
        else if (a === "cuenta") return hojaCuenta(b.dataset.id);
        else if (a === "nueva-cuenta") return hojaCuenta(null);
        else if (a === "ir-inversiones") { location.hash = "inversiones"; return; }
        else if (a === "borrar-mov") {
          if (!confirm("¿Borrar este movimiento? Se deshará su efecto en los saldos.")) return;
          const m = d.movs.find(x => x.id === b.dataset.id);
          Fin.aplicarEfecto(d, Fin.efectoMov(m), -1); d.movs = d.movs.filter(x => x.id !== m.id); guardar();
        }
        pintar();
      });

      pintar();
    }
  });
})();
