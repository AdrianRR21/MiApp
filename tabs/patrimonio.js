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
    { id: "acciones", nombre: "Acciones", color: "#F2884B" },
    { id: "etfs", nombre: "ETFs", color: "#F7B892" },
    { id: "materias", nombre: "Materias primas", color: "#B5612F" }
  ];
  const COLOR_LIQ = "#565B60";
  const TIPOS = [
    { id: "gasto", nombre: "Gasto" }, { id: "ingreso", nombre: "Ingreso" },
    { id: "invertir", nombre: "Invertir" }, { id: "desinvertir", nombre: "Vender" },
    { id: "traspaso", nombre: "Traspaso" }
  ];

  // Estado de pantalla
  let vista = "resumen", rango = "todo", mesSel = null, tipoSel = "gasto";

  HiperApp.registrar({
    id: "patrimonio",
    titulo: "Patrimonio",
    nombreCorto: "Patrimonio",
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
        const f = d.fotos[k];
        const v = CLASES.reduce((s, c) => s + f.inv[c.id][0], 0), a = CLASES.reduce((s, c) => s + f.inv[c.id][1], 0);
        return { k, t: aFecha(k).getTime(), liq: f.liq, inv: f.inv, valor: v, aportado: a, total: f.liq + v };
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

      function grafPatrimonio(fs) {
        const W = 340, H = 190, pad = { t: 10, r: 8, b: 22, l: 38 };
        const t0 = fs[0].t, t1 = fs[fs.length - 1].t;
        const max = Math.max(...fs.map(f => f.total), 1) * 1.08;
        const X = t => pad.l + (W - pad.l - pad.r) * (t1 === t0 ? 1 : (t - t0) / (t1 - t0));
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        const capas = [{ color: COLOR_LIQ, val: f => f.liq }].concat(CLASES.slice().reverse().map(c => ({ color: c.color, val: f => f.inv[c.id][0] })));
        let base = fs.map(() => 0), areas = "";
        capas.forEach(cp => {
          const top = fs.map((f, i) => base[i] + Math.max(cp.val(f), 0));
          const arriba = fs.map((f, i) => `${X(f.t)},${Y(top[i])}`).join(" ");
          const abajo = fs.map((f, i) => `${X(f.t)},${Y(base[i])}`).reverse().join(" ");
          areas += `<polygon points="${arriba} ${abajo}" fill="${cp.color}" opacity=".9"/>`;
          base = top;
        });
        const linea = fs.map(f => `${X(f.t)},${Y(f.total)}`).join(" ");
        return `<svg viewBox="0 0 ${W} ${H}">${ejes(W, H, pad, 0, max, compacto)}${areas}
          <polyline points="${linea}" fill="none" stroke="var(--tinta)" stroke-width="1.5"/>
          <text x="${pad.l}" y="${H - 5}">${fechaCorta(fs[0].k)}</text>
          <text x="${W - pad.r}" y="${H - 5}" text-anchor="end">${fechaCorta(fs[fs.length - 1].k)}</text></svg>`;
      }

      function grafRent(rs) {
        const W = 340, H = 180, pad = { t: 10, r: 8, b: 22, l: 38 };
        const t0 = rs[0].t, t1 = rs[rs.length - 1].t;
        const vals = rs.flatMap(r => [r.simple, r.twr]).filter(v => v !== null).concat([0]);
        let min = Math.min(...vals), max = Math.max(...vals);
        const m = Math.max((max - min) * 0.15, 0.01); min -= m; max += m;
        const X = t => pad.l + (W - pad.l - pad.r) * (t1 === t0 ? 1 : (t - t0) / (t1 - t0));
        const Y = v => H - pad.b - (H - pad.t - pad.b) * (v - min) / (max - min);
        const linea = (campo, color, ancho, guion) => {
          const pts = rs.filter(r => r[campo] !== null).map(r => `${X(r.t)},${Y(r[campo])}`).join(" ");
          return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${ancho}" ${guion ? 'stroke-dasharray="4 3"' : ""} stroke-linejoin="round"/>`;
        };
        return `<svg viewBox="0 0 ${W} ${H}">${ejes(W, H, pad, min, max, v => Math.round(v * 100) + "%")}
          <line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--tinta-suave)" stroke-width="1"/>
          ${linea("twr", "var(--tinta)", 1.6, true)}${linea("simple", "var(--naranja)", 2.2)}
          <text x="${pad.l}" y="${H - 5}">${fechaCorta(rs[0].k)}</text>
          <text x="${W - pad.r}" y="${H - 5}" text-anchor="end">${fechaCorta(rs[rs.length - 1].k)}</text></svg>`;
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
          else { const c = { acciones: "acciones", etfs: "ETFs", materias: "materias primas" }[x.clase]; titulo = (x.tipo === "invertir" ? "Inversión en " : "Venta de ") + c; sub = nomCuenta(x.cuenta); imp = eur(x.importe); }
          return `<div class="pt-fila" style="cursor:default">
            <div class="izq"><div>${esc(titulo)}${x.nota ? ` <span class="sub">${esc(x.nota)}</span>` : ""}</div><div class="sub">${esc(sub)}, ${fechaCorta(x.fecha)}</div></div>
            <div class="der ${cls}">${imp}</div>
            <button class="pt-borrar" data-accion="borrar-mov" data-id="${x.id}" aria-label="Borrar movimiento">×</button>
          </div>`;
        }).join("");

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
            ${inv ? `<p style="margin:12px 0 0;font-size:14px">Has invertido ${eur(inv)} este mes.</p>` : ""}
          </div>
          ${cats ? `<div class="bloque"><h2>Gastos por categoría</h2>${cats}</div>` : ""}
          <div class="bloque">
            <h2>Movimientos</h2>
            ${lista || `<p>Sin movimientos este mes. Usa el botón + para apuntar uno.</p>`}
          </div>`;
      }

      function vistaEvolucion() {
        let fs = fotosOrdenadas();
        if (rango !== "todo") {
          const meses = { "3m": 3, "1a": 12 }[rango];
          const desde = new Date(); desde.setMonth(desde.getMonth() - meses);
          const k = clave(desde);
          const antes = fs.filter(f => f.k < k).pop();
          fs = (antes ? [antes] : []).concat(fs.filter(f => f.k >= k));
        }
        const rangos = `<div class="pt-rangos">${[["3m", "3 meses"], ["1a", "1 año"], ["todo", "Todo"]].map(([id, n]) =>
          `<button class="${rango === id ? "on" : ""}" data-accion="rango" data-r="${id}">${n}</button>`).join("")}</div>`;

        if (fs.length < 2) return `<div class="bloque"><h2>Evolución</h2>
          <p>Las gráficas aparecerán cuando haya datos de al menos dos días distintos. Cada día que actualices saldos, valores o apuntes movimientos se guarda automáticamente una foto de tu patrimonio.</p></div>`;

        const rs = serieRent(fs), ult = rs[rs.length - 1];
        const cambio = fs[fs.length - 1].total - fs[0].total;
        const flujoInv = fs[fs.length - 1].aportado - fs[0].aportado;
        const mercado = (fs[fs.length - 1].valor - fs[0].valor) - flujoInv;
        const leyP = [{ n: "Liquidez", c: COLOR_LIQ }].concat(CLASES.map(c => ({ n: c.nombre, c: c.color })))
          .map(p => `<span><i style="background:${p.c}"></i>${p.n}</span>`).join("");

        return `
          <div style="display:flex;justify-content:flex-end;margin-bottom:12px">${rangos}</div>
          <div class="bloque pt-graf">
            <div class="pt-cab"><h2>Patrimonio</h2><span class="v ${clsN(cambio)}">${eurS(cambio)}</span></div>
            <p style="margin:0;font-size:14px">De ese cambio, ${eurS(mercado)} viene del mercado y el resto de tu ahorro.</p>
            ${grafPatrimonio(fs)}
            <div class="pt-leyenda" style="margin-top:10px">${leyP}</div>
          </div>
          <div class="bloque pt-graf">
            <div class="pt-cab"><h2>Rentabilidad</h2></div>
            <div class="pt-rent" style="margin-top:6px">
              <div><span class="etiqueta">Simple (acumulada)</span><b class="${clsN(ult.simple)}">${pct(ult.simple)}</b></div>
              <div><span class="etiqueta">TWR (en el periodo)</span><b class="${clsN(ult.twr)}">${pct(ult.twr)}</b></div>
            </div>
            ${grafRent(rs)}
            <div class="pt-leyenda" style="margin-top:10px">
              <span><i style="background:var(--naranja)"></i>Simple</span>
              <span><i style="background:var(--tinta)"></i>TWR</span>
            </div>
          </div>`;
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
