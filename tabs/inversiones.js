/* PANTALLA: Inversiones
   Comparte los datos con Finanzas: las compras y ventas se registran allí, en Movimientos.
   Aquí se ve la evolución, el desglose por activo, la rentabilidad mes a mes y el reparto.
   Para cambiarla, sustituye solo este archivo (necesita patrimonio.js, que se carga antes). */
(() => {
  const css = `
  .iv-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:14px; }
  .iv-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .iv-seg button.on { background:var(--papel-2); color:var(--tinta); }
  .iv-mini-seg { display:flex; gap:4px; }
  .iv-mini-seg button { border:0; background:var(--papel); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 11px; border-radius:8px; cursor:pointer; }
  .iv-mini-seg button.on { background:var(--naranja-suave); color:var(--naranja); }
  .iv-barra-sup { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; }

  .iv-aviso { display:flex; gap:12px; align-items:center; background:var(--naranja-suave); color:var(--tinta); border-radius:14px; padding:14px; margin-bottom:12px; font-size:14px; line-height:1.4; }
  .iv-aviso button { flex:none; border:0; background:var(--naranja); color:#17130A; font:inherit; font-weight:700; font-size:13.5px; padding:9px 12px; border-radius:10px; cursor:pointer; }
  .iv-total { padding:4px 2px 16px; }
  .iv-total .cifra { font-size:42px; line-height:1.05; }
  .iv-total .sub { font-size:14.5px; color:var(--tinta-suave); margin-top:6px; }
  .iv-tarjetas { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
  .iv-tarjetas div { background:var(--papel); border-radius:14px; padding:14px; }
  .iv-tarjetas b { display:block; font-size:24px; margin-top:3px; letter-spacing:-.02em; }
  .iv-pos, .iv-sub.iv-pos { color:var(--naranja); }
  .iv-neg, .iv-sub.iv-neg { color:var(--rojo); }
  .iv-graf svg { width:100%; height:auto; display:block; margin-top:10px; }
  .iv-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }
  .iv-leyenda { display:flex; flex-wrap:wrap; gap:6px 14px; font-size:12.5px; color:var(--tinta-suave); margin-top:10px; }
  .iv-leyenda span { display:inline-flex; align-items:center; gap:6px; }
  .iv-leyenda i { width:10px; height:10px; border-radius:3px; display:inline-block; }
  .iv-nota { font-size:13px; color:var(--tinta-suave); line-height:1.55; margin:12px 0 0; }
  .iv-boton { width:100%; border:0; background:var(--naranja); color:#17130A; font:inherit; font-weight:700; font-size:16px; padding:14px; border-radius:14px; cursor:pointer; margin-bottom:12px; }
  .iv-boton.sec { background:none; border:1.5px dashed var(--linea); color:var(--naranja); font-size:15px; }

  .iv-cab { display:flex; justify-content:space-between; align-items:baseline; gap:10px; }
  .iv-cab h2 { margin:0; display:flex; align-items:center; gap:9px; }
  .iv-cab h2 i { width:11px; height:11px; border-radius:3px; display:inline-block; }
  .iv-cab .v { font-weight:700; font-size:17px; white-space:nowrap; }
  .iv-sub { font-size:13px; color:var(--tinta-suave); margin-top:3px; }
  .iv-fila { display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .iv-fila:first-of-type { margin-top:10px; }
  .iv-fila .izq { flex:1; min-width:0; }
  .iv-fila .izq div:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .iv-fila .der { text-align:right; font-weight:600; white-space:nowrap; }
  .iv-tabla-caja { overflow-x:auto; margin:12px -4px 0; padding:0 4px; -webkit-overflow-scrolling:touch; }
  .iv-tabla { border-collapse:collapse; font-size:13.5px; width:100%; }
  .iv-tabla th { font-weight:600; font-size:12px; color:var(--tinta-suave); text-align:right; padding:6px 0 6px 12px; white-space:nowrap; }
  .iv-tabla td { text-align:right; padding:9px 0 9px 12px; border-top:1px solid var(--linea); white-space:nowrap; }
  .iv-tabla th:first-child, .iv-tabla td:first-child { text-align:left; padding-left:0; position:sticky; left:0; background:var(--papel); max-width:150px; overflow:hidden; text-overflow:ellipsis; z-index:1; }
  .iv-tabla tr.cat td { font-weight:700; padding-top:14px; }
  .iv-tabla tr.cat td:first-child { color:var(--tinta); }
  .iv-tabla tr.act td:first-child { padding-left:10px; color:var(--tinta-suave); }
  .iv-tabla tr.tot td { font-weight:700; border-top:2px solid var(--linea); }
  .iv-tabla .vacio { color:#56565C; }
  .iv-mesmes { margin-top:14px; padding-top:4px; }
  .iv-mesmes summary { cursor:pointer; color:var(--naranja); font-weight:600; font-size:14px; padding:6px 0; list-style:none; }
  .iv-mesmes summary::-webkit-details-marker { display:none; }

  .iv-donut { display:block; width:100%; max-width:320px; margin:4px auto 0; }
  .iv-donut .c1 { font-family:var(--texto); font-weight:700; font-size:21px; fill:var(--tinta); }
  .iv-donut .c2 { font-family:var(--texto); font-size:11px; fill:var(--tinta-suave); }
  .iv-reparto { margin-top:6px; }
  .iv-reparto .fila { display:grid; grid-template-columns:34px 1fr auto; gap:12px; align-items:center; padding:12px 0; border-top:1px solid var(--linea); }
  .iv-reparto .fila:first-child { border-top:0; }
  .iv-reparto svg { width:34px; height:34px; border-radius:9px; display:block; }
  .iv-reparto b { font-size:18px; }
  .iv-reparto .acts { grid-column:2 / 4; font-size:12.5px; color:var(--tinta-suave); margin-top:-6px; line-height:1.6; }

  .iv-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .iv-form .dos { display:flex; gap:10px; }
  .iv-form .dos > div { flex:1; min-width:0; }
  .iv-grande { font-size:26px !important; font-weight:700; }
  .iv-val { display:grid; grid-template-columns:1fr 120px; gap:10px; align-items:center; padding:10px 0; border-top:1px solid var(--linea); }
  .iv-val .n { font-size:14.5px; line-height:1.3; }
  .iv-val input { text-align:right; font-weight:700; }
  .iv-grupo { font-size:12.5px; font-weight:700; color:var(--tinta-suave); margin:16px 0 2px; text-transform:uppercase; letter-spacing:.06em; }
  .iv-acciones { display:flex; gap:8px; margin-top:20px; }
  .iv-acciones .boton { flex:1; margin:0; }
  .iv-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const fmtE = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always" });
  const eur = n => fmtE.format(Math.round((n || 0) * 100) / 100);
  const eur0 = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(n || 0);
  const eurS = n => (n > 0 ? "+" : "") + eur(n);
  const pct = (n, dec = 1) => (n === null || n === undefined || !isFinite(n)) ? "–" : (n > 0 ? "+" : "") + (n * 100).toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + " %";
  const cls = n => n > 0 ? "iv-pos" : n < 0 ? "iv-neg" : "";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = s => { s = String(s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const mesMas = (ym, n) => { const [y, m] = ym.split("-").map(Number); return clave(new Date(y, m - 1 + n, 1)).slice(0, 7); };
  const finDeMes = ym => { const [y, m] = ym.split("-").map(Number); return clave(new Date(y, m, 0)); };
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const nomMes = ym => MESES[+ym.slice(5) - 1] + " " + ym.slice(2, 4);
  const aTexto = n => String(Math.round((n || 0) * 100) / 100).replace(".", ",");

  let vista = "evolucion", modo = "aportado", rango = "1a", base = "valor";

  HiperApp.registrar({
    id: "inversiones",
    datos: "patrimonio",   // mismos datos que Finanzas
    titulo: "Inversiones",
    color: "#F5C542",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.3A9 9 0 0 1 20.7 9H15z"/></svg>',

    render(contenedor, store) {
      const F = window.Finanzas;
      if (!F) { contenedor.innerHTML = `<div class="bloque"><p>Falta el archivo patrimonio.js actualizado.</p></div>`; return; }
      const d = store.get({});
      F.migrar(d);
      const CLASES = F.CLASES;
      const guardar = () => { F.foto(d, hoyK()); store.set(d); };
      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Cálculos ----------
      const fs = () => F.fotosOrdenadas(d);
      // Última foto hasta una fecha
      const fotoHasta = (lista, k) => { let r = null; for (const f of lista) { if (f.k <= k) r = f; else break; } return r; };
      // Flujo neto de aportación de un movimiento (compra suma lo pagado, venta resta el coste de lo vendido)
      const flujoAport = m => m.tipo === "invertir" ? m.importe : m.tipo === "desinvertir" ? -(m.coste || 0) : 0;
      // Flujo de caja (para rentabilidad mensual): compra entra en la cartera, venta sale
      const flujoCaja = m => m.tipo === "invertir" ? m.importe : m.tipo === "desinvertir" ? -m.importe : 0;
      const movsInv = () => d.movs.filter(m => m.tipo === "invertir" || m.tipo === "desinvertir");

      // Aportado acumulado a final de un mes, reconstruido hacia atrás desde hoy con los movimientos
      function aportadoFinMes(ym, filtro) {
        const acts = d.activos.filter(filtro);
        const ids = new Set(acts.map(a => a.id));
        const ahora = acts.reduce((s, a) => s + a.aportado, 0);
        const despues = movsInv().filter(m => ids.has(m.activo) && m.fecha > finDeMes(ym)).reduce((s, m) => s + flujoAport(m), 0);
        return Math.max(0, ahora - despues);
      }
      function mesesDesde(primero) {
        const actual = hoyK().slice(0, 7);
        let desde = primero || actual;
        if (rango !== "todo") { const lim = mesMas(actual, rango === "6m" ? -5 : -11); if (desde < lim) desde = lim; }
        const out = []; for (let m = desde; m <= actual; m = mesMas(m, 1)) out.push(m);
        return out;
      }
      const primerMes = () => [...movsInv().map(m => m.fecha.slice(0, 7)), ...fs().filter(f => f.valor > 0 || f.aportado > 0).map(f => f.k.slice(0, 7))].sort()[0];

      // TIR anual (XIRR) con las fotos: valor inicial, aportaciones netas entre fotos y valor final
      function tirAnual() {
        const lista = fs().filter(f => f.valor > 0 || f.aportado > 0);
        const i0 = lista.findIndex(f => f.valor > 0); if (i0 < 0) return null;
        const t0 = lista[i0].t, fin = lista[lista.length - 1];
        if ((fin.t - t0) / 864e5 < 60) return null;
        const flujos = [{ t: t0, v: -lista[i0].valor }];
        for (let i = i0 + 1; i < lista.length; i++) { const x = lista[i].aportado - lista[i - 1].aportado; if (Math.abs(x) > 0.005) flujos.push({ t: lista[i].t, v: -x }); }
        flujos.push({ t: fin.t, v: fin.valor });
        const vpn = r => flujos.reduce((s, f) => s + f.v / Math.pow(1 + r, (f.t - t0) / 864e5 / 365), 0);
        let lo = -0.99, hi = 10, flo = vpn(lo), fhi = vpn(hi);
        if (flo * fhi > 0) return null;
        for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2, fm = vpn(mid); if (flo * fm <= 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; } }
        return (lo + hi) / 2;
      }
      function twrAnual() {
        const lista = fs().filter(f => f.valor > 0 || f.aportado > 0); if (lista.length < 2) return null;
        const dias = (lista[lista.length - 1].t - lista[0].t) / 864e5; if (dias < 60) return null;
        const rs = F.serieRent(lista), t = rs[rs.length - 1].twr;
        return Math.pow(1 + t, 365 / dias) - 1;
      }
      // Rentabilidad de un mes (método Dietz modificado) para un conjunto de activos
      function rentMes(ym, ids, lista) {
        const fEnd = fotoHasta(lista, finDeMes(ym)), fPrev = fotoHasta(lista, finDeMes(mesMas(ym, -1)));
        if (!fEnd || fEnd.k < ym + "-01") return null;   // sin valoración ese mes
        const val = (f, id) => f && f.act[id] ? f.act[id][0] : 0;
        let vEnd = 0, vPrev = 0; ids.forEach(id => { vEnd += val(fEnd, id); vPrev += val(fPrev, id); });
        const flujo = movsInv().filter(m => ids.includes(m.activo) && m.fecha.startsWith(ym)).reduce((s, m) => s + flujoCaja(m), 0);
        const den = vPrev + flujo / 2;
        if (!fEnd || den <= 0.5 || (vEnd === 0 && vPrev === 0)) return null;
        return (vEnd - vPrev - flujo) / den;
      }
      function necesitaValoracion() {
        const hoy = new Date(), dia = hoy.getDate(), ult = d.ultimaValoracion || "";
        if (!d.activos.some(a => a.valor > 0)) return false;
        const ymHoy = hoyK().slice(0, 7);
        if (dia >= 28) return ult < ymHoy + "-28";
        if (dia <= 5) return ult < mesMas(ymHoy, -1) + "-28";
        return false;
      }

      // ---------- Gráfico de líneas mensual: valor (área) y aportado (discontinua) ----------
      function grafEvolucion(meses, valor, aport) {
        const W = 340, H = 200, pad = { t: 10, r: 8, b: 22, l: 40 };
        const max = Math.max(1, ...valor.filter(v => v != null), ...aport) * 1.1;
        const n = meses.length, X = i => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (W - pad.l - pad.r) * i / (n - 1));
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        let ej = ""; for (let i = 0; i <= 3; i++) { const v = max * i / 3; ej += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v >= 1000 ? (v / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "k" : Math.round(v)}</text>`; }
        const pts = valor.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
        const area = pts.length > 1 ? `<polygon points="${pts.map(p => p.join(",")).join(" ")} ${pts[pts.length - 1][0]},${Y(0)} ${pts[0][0]},${Y(0)}" fill="url(#ivDegradado)"/>` : "";
        const lineaV = `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--naranja)" stroke-width="2.4" stroke-linejoin="round"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="var(--naranja)"/>`).join("");
        const lineaA = `<polyline points="${aport.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}" fill="none" stroke="var(--tinta)" stroke-width="1.6" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
        const paso = Math.ceil(n / 7);
        const etq = meses.map((m, i) => (n - 1 - i) % paso === 0 ? `<text x="${X(i)}" y="${H - 6}" text-anchor="middle">${MESES[+m.slice(5) - 1]}${i === 0 || m.endsWith("-01") ? " " + m.slice(2, 4) : ""}</text>` : "").join("");
        return `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="ivDegradado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--naranja)" stop-opacity=".32"/><stop offset="1" stop-color="var(--naranja)" stop-opacity="0"/></linearGradient></defs>${ej}${area}${lineaA}${lineaV}${etq}</svg>`;
      }

      // ---------- Vista 1: evolución ----------
      function vistaEvolucion() {
        const V = F.valorInv(d), A = F.aportadoInv(d), G = V - A;
        const tir = tirAnual(), twr = twrAnual();
        const meses = mesesDesde(primerMes());
        const lista = fs();
        const valor = meses.map(m => { const f = fotoHasta(lista, finDeMes(m)); return f && (f.valor > 0 || f.aportado > 0) ? f.valor : null; });
        const aport = meses.map(m => aportadoFinMes(m, () => true));
        const rangos = `<div class="iv-mini-seg">${[["6m", "6 meses"], ["1a", "1 año"], ["todo", "Todo"]].map(([k, n]) => `<button class="${rango === k ? "on" : ""}" data-accion="rango" data-r="${k}">${n}</button>`).join("")}</div>`;
        if (!d.activos.length) return `<div class="bloque"><h2>Empieza aquí</h2><p>Aún no tienes inversiones. Da de alta lo que ya tienes con "Añadir activo" en Desglose, o registra una compra en Finanzas → Movimientos con el tipo Invertir.</p></div>`;
        return `
          ${necesitaValoracion() ? `<div class="iv-aviso"><span style="flex:1">Toca actualizar el valor de tus inversiones de fin de mes.</span><button data-accion="valores">Actualizar</button></div>` : ""}
          <div class="iv-total">
            <div class="etiqueta">Valor de mercado</div>
            <div class="cifra">${eur(V)}</div>
            <div class="sub">Aportado ${eur(A)}, <span class="${cls(G)}">${eurS(G)} (${A > 0 ? pct(V / A - 1) : "–"})</span></div>
          </div>
          <div class="iv-tarjetas">
            <div><span class="etiqueta">TIR anual</span><b class="${cls(tir)}">${pct(tir)}</b></div>
            <div><span class="etiqueta">TWR anualizada</span><b class="${cls(twr)}">${pct(twr)}</b></div>
          </div>
          <div class="bloque iv-graf">
            <h2>Aportado y valor</h2><div style="margin-top:10px">${rangos}</div>
            ${valor.some(v => v != null) || aport.some(v => v > 0) ? grafEvolucion(meses, valor, aport) : `<p class="iv-nota">El gráfico aparecerá con tus primeras aportaciones.</p>`}
            <div class="iv-leyenda"><span><i style="background:var(--naranja)"></i>Valor de mercado a fin de mes</span><span><i style="background:var(--tinta);height:2px;width:12px;border-radius:0"></i>Aportado acumulado</span></div>
          </div>
          <button class="iv-boton" data-accion="valores">Actualizar valores de fin de mes</button>
          <p class="iv-nota" style="margin-top:0">La <b>TIR</b> es el interés anual que te ha dado tu dinero teniendo en cuenta cuándo aportaste cada euro. La <b>TWR anualizada</b> mide solo cómo han ido tus inversiones, sin el efecto de cuándo aportas, y es la que se compara con un índice o un fondo. Las dos necesitan al menos dos meses de datos.</p>`;
      }

      // ---------- Vista 2: desglose ----------
      function vistaDesglose() {
        const lista = fs();
        const toggle = `<div class="iv-mini-seg"><button class="${modo === "aportado" ? "on" : ""}" data-accion="modo" data-m="aportado">Aportaciones</button><button class="${modo === "rent" ? "on" : ""}" data-accion="modo" data-m="rent">Rentabilidad</button></div>`;
        const cab = `<div class="iv-barra-sup">${toggle}</div>`;
        const clasesUsadas = CLASES.filter(c => d.activos.some(a => a.clase === c.id));
        const alta = `<button class="iv-boton sec" data-accion="nuevo-activo">Añadir activo que ya tenías</button>`;
        if (!clasesUsadas.length) return cab + alta + `<div class="bloque"><p style="margin:0">Aún no hay activos. Añade los que ya tienes, o registra una compra en Finanzas → Movimientos.</p></div>`;
        const meses = mesesDesde(primerMes()).slice().reverse();

        if (modo === "aportado") {
          const bloques = clasesUsadas.map(c => {
            const acts = d.activos.filter(a => a.clase === c.id).sort((a, b) => b.valor - a.valor || b.aportado - a.aportado);
            const t = F.clase(d, c.id), g = t.valor - t.aportado;
            const filas = acts.map(a => { const ga = a.valor - a.aportado;
              return `<button class="iv-fila" data-accion="activo" data-id="${a.id}"><div class="izq"><div>${esc(a.nombre)}</div><div class="iv-sub">Aportado ${eur(a.aportado)}</div></div>
                <div class="der">${eur(a.valor)}<div class="iv-sub ${cls(ga)}">${a.aportado > 0 ? pct(a.valor / a.aportado - 1) : "–"}</div></div></button>`; }).join("");
            // Mes a mes: aportado en el mes y acumulado (categoría y cada activo)
            const idsCat = new Set(acts.map(a => a.id));
            const cols = acts.length > 1 ? acts : [];
            const filasMes = meses.map(m => {
              const acum = aportadoFinMes(m, a => idsCat.has(a.id)), prev = aportadoFinMes(mesMas(m, -1), a => idsCat.has(a.id));
              const delMes = acum - prev;
              return `<tr><td>${nomMes(m)}</td><td class="${delMes ? "" : "vacio"}">${delMes ? (delMes > 0 ? "+" : "") + eur0(delMes) : "–"}</td><td>${eur0(acum)}</td>${cols.map(a => { const x = aportadoFinMes(m, y => y.id === a.id) - aportadoFinMes(mesMas(m, -1), y => y.id === a.id); return `<td class="${x ? "" : "vacio"}">${x ? (x > 0 ? "+" : "") + eur0(x) : "–"}</td>`; }).join("")}</tr>`;
            }).join("");
            return `<div class="bloque">
              <div class="iv-cab"><h2><i style="background:${c.color}"></i>${c.nombre}</h2><span class="v">${eur(t.valor)}</span></div>
              <div class="iv-sub">Aportado ${eur(t.aportado)}, <span class="${cls(g)}">${eurS(g)}${t.aportado > 0 ? " (" + pct(t.valor / t.aportado - 1) + ")" : ""}</span></div>
              ${filas}
              <details class="iv-mesmes"><summary>Aportaciones mes a mes</summary>
                <div class="iv-tabla-caja"><table class="iv-tabla"><tr><th>Mes</th><th>En el mes</th><th>Acumulado</th>${cols.map(a => `<th>${esc(a.nombre.length > 14 ? a.nombre.slice(0, 13) + "…" : a.nombre)}</th>`).join("")}</tr>${filasMes}</table></div>
              </details>
            </div>`;
          }).join("");
          const V = F.valorInv(d), A = F.aportadoInv(d);
          return cab + `<div class="bloque"><div class="iv-cab"><h2>Total invertido</h2><span class="v">${eur(A)}</span></div>
            <div class="iv-sub">Vale ${eur(V)}, <span class="${cls(V - A)}">${eurS(V - A)}${A > 0 ? " (" + pct(V / A - 1) + ")" : ""}</span></div></div>` + bloques + alta;
        }

        // Rentabilidad mes a mes
        const mesesR = meses.slice(0, 12);   // del más reciente al más antiguo
        const celda = r => `<td class="${r === null ? "vacio" : cls(r)}">${r === null ? "–" : pct(r)}</td>`;
        const total = (ids) => { const acts = d.activos.filter(a => ids.includes(a.id)); const v = acts.reduce((s, a) => s + a.valor, 0), ap = acts.reduce((s, a) => s + a.aportado, 0); return ap > 0 ? v / ap - 1 : null; };
        let filas = "";
        clasesUsadas.forEach(c => {
          const ids = d.activos.filter(a => a.clase === c.id).map(a => a.id);
          filas += `<tr class="cat"><td><span style="color:${c.color}">●</span> ${c.nombre}</td>${celda(total(ids))}${mesesR.map(m => celda(rentMes(m, ids, lista))).join("")}</tr>`;
          d.activos.filter(a => a.clase === c.id).forEach(a => { filas += `<tr class="act"><td>${esc(a.nombre)}</td>${celda(total([a.id]))}${mesesR.map(m => celda(rentMes(m, [a.id], lista))).join("")}</tr>`; });
        });
        const todos = d.activos.map(a => a.id);
        filas += `<tr class="tot"><td>Total cartera</td>${celda(total(todos))}${mesesR.map(m => celda(rentMes(m, todos, lista))).join("")}</tr>`;
        return cab + `<div class="bloque"><h2>Rentabilidad mes a mes</h2>
          <div class="iv-tabla-caja"><table class="iv-tabla"><tr><th></th><th>Total</th>${mesesR.map(m => `<th>${nomMes(m)}</th>`).join("")}</tr>${filas}</table></div>
          <p class="iv-nota">Cada mes compara el valor a final de mes con el del mes anterior, descontando lo que compraste o vendiste. Necesita que actualices los valores cada fin de mes. "Total" es la rentabilidad sobre lo aportado desde el principio. Desliza la tabla para ver más meses.</p></div>`;
      }

      // ---------- Vista 3: reparto (donut con motivos) ----------
      const MOTIVOS = {
        // Velas japonesas
        acciones: c => `<pattern id="ivP-acciones" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="${c}"/>
          <path d="M4 2v14M13 3v13" stroke="rgba(0,0,0,.35)" stroke-width="1"/><rect x="2" y="6" width="4" height="7" rx=".6" fill="rgba(0,0,0,.35)"/><rect x="11" y="5" width="4" height="6" rx=".6" fill="rgba(255,255,255,.45)"/></pattern>`,
        // Mosaico de muchas piezas: una cesta diversificada
        etfs: c => `<pattern id="ivP-etfs" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${c}"/>
          <rect x="1" y="1" width="4" height="4" rx=".8" fill="rgba(255,255,255,.35)"/><rect x="7" y="1" width="4" height="4" rx=".8" fill="rgba(0,0,0,.22)"/><rect x="1" y="7" width="4" height="4" rx=".8" fill="rgba(0,0,0,.3)"/><rect x="7" y="7" width="4" height="4" rx=".8" fill="rgba(255,255,255,.18)"/></pattern>`,
        // Lingotes apilados
        materias: c => `<pattern id="ivP-materias" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="14" fill="${c}"/>
          <path d="M3 11l2.5-6h11l2.5 6z" fill="rgba(0,0,0,.28)"/><path d="M6.2 6.2h9.6" stroke="rgba(255,255,255,.55)" stroke-width="1"/></pattern>`,
        // Símbolo de Bitcoin
        crypto: c => `<pattern id="ivP-crypto" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)"><rect width="20" height="20" fill="${c}"/>
          <text x="10" y="14.5" text-anchor="middle" font-size="12" font-weight="700" font-family="Manrope, -apple-system, sans-serif" fill="rgba(0,0,0,.32)">₿</text></pattern>`
      };
      function arco(cx, cy, r1, r2, a0, a1) {
        const p = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
        if (a1 - a0 >= Math.PI * 2 - 1e-6) return `M${cx} ${cy - r2}A${r2} ${r2} 0 1 1 ${cx - 0.01} ${cy - r2}Z M${cx} ${cy - r1}A${r1} ${r1} 0 1 0 ${cx + 0.01} ${cy - r1}Z`;
        const g = a1 - a0 > Math.PI ? 1 : 0, [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
        return `M${x1} ${y1}A${r2} ${r2} 0 ${g} 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 ${g} 0 ${x4} ${y4}Z`;
      }
      function vistaReparto() {
        const campo = base === "valor" ? "valor" : "aportado";
        const partes = CLASES.map(c => ({ c, v: d.activos.filter(a => a.clase === c.id).reduce((s, a) => s + a[campo], 0) })).filter(p => p.v > 0);
        const T = partes.reduce((s, p) => s + p.v, 0);
        const toggle = `<div class="iv-barra-sup"><div class="iv-mini-seg"><button class="${base === "valor" ? "on" : ""}" data-accion="base" data-b="valor">Valor de mercado</button><button class="${base === "aportado" ? "on" : ""}" data-accion="base" data-b="aportado">Aportado</button></div></div>`;
        if (!T) return toggle + `<div class="bloque"><p style="margin:0">El gráfico aparecerá cuando tengas inversiones con valor.</p></div>`;
        let a = 0, segs = "";
        partes.forEach(p => { const ang = p.v / T * Math.PI * 2; segs += `<path d="${arco(150, 150, 76, 132, a, a + ang)}" fill="url(#ivP-${p.c.id})" stroke="var(--fondo)" stroke-width="${partes.length > 1 ? 3 : 0}" stroke-linejoin="round"/>`; a += ang; });
        const defs = `<defs>${CLASES.map(c => MOTIVOS[c.id](c.color)).join("")}</defs>`;
        const donut = `<svg class="iv-donut" viewBox="0 0 300 300" role="img" aria-label="Reparto de tus inversiones">${defs}${segs}
          <circle cx="150" cy="150" r="72" fill="var(--papel)"/>
          <text x="150" y="150" text-anchor="middle" class="c1">${eur0(T)}</text><text x="150" y="170" text-anchor="middle" class="c2">${base === "valor" ? "valor de mercado" : "aportado"}</text></svg>`;
        const leyenda = partes.sort((x, y) => y.v - x.v).map(p => {
          const acts = d.activos.filter(a => a.clase === p.c.id && a[campo] > 0).sort((x, y) => y[campo] - x[campo]);
          return `<div class="fila"><svg viewBox="0 0 34 34"><defs>${MOTIVOS[p.c.id](p.c.color).replace(`id="ivP-${p.c.id}"`, `id="ivL-${p.c.id}"`)}</defs><rect width="34" height="34" fill="url(#ivL-${p.c.id})"/></svg>
            <div><div style="font-weight:600">${p.c.nombre}</div><div class="iv-sub">${eur(p.v)}</div></div><b>${(p.v / T * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %</b>
            ${acts.length > 1 || (acts[0] && !acts[0].id.startsWith("sd-")) ? `<div class="acts">${acts.map(x => `${esc(x.nombre)} ${(x[campo] / T * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`).join("<br>")}</div>` : ""}</div>`;
        }).join("");
        return toggle + `<div class="bloque">${donut}<div class="iv-reparto">${leyenda}</div></div>`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="iv-seg">${[["evolucion", "Evolución"], ["desglose", "Desglose"], ["reparto", "Reparto"]].map(([k, n]) =>
          `<button class="${vista === k ? "on" : ""}" data-accion="vista" data-v="${k}">${n}</button>`).join("")}</div>
          ${{ evolucion: vistaEvolucion, desglose: vistaDesglose, reparto: vistaReparto }[vista]()}`;
      }

      // ---------- Hojas ----------
      function hoja(html, alGuardar, extra) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel iv-form" role="dialog">${html}<div class="iv-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>${extra || ""}</div>`;
        raiz.appendChild(f);
        f.addEventListener("click", e => {
          if (e.target === f || e.target.dataset.h === "c") f.remove();
          if (e.target.dataset.h === "g" && alGuardar(f) !== false) { f.remove(); pintar(); }
        });
        return f;
      }
      const leer = (el, vacioCero) => { if (vacioCero && !el.value.trim()) return 0; const v = num(el.value); if (!isFinite(v) || v < 0) { el.style.borderColor = "var(--rojo)"; el.focus(); return null; } return Math.round(v * 100) / 100; };

      // Actualizar el valor de todos los activos (rutina de fin de mes)
      function hojaValores() {
        const hoy = new Date(), fechaDef = hoy.getDate() <= 5 ? finDeMes(mesMas(hoyK().slice(0, 7), -1)) : hoyK();
        const acts = d.activos.filter(a => a.valor > 0 || a.aportado > 0);
        if (!acts.length) { alert("Aún no tienes activos con valor."); return; }
        const grupos = CLASES.map(c => { const xs = acts.filter(a => a.clase === c.id); return xs.length ? `<div class="iv-grupo">${c.nombre}</div>` + xs.map(a => `<div class="iv-val"><div class="n">${esc(a.nombre)}<div class="iv-sub">Antes ${eur(a.valor)}</div></div><input inputmode="decimal" data-id="${a.id}" value="${aTexto(a.valor)}"></div>`).join("") : ""; }).join("");
        const f = hoja(`<h2>Valores de fin de mes</h2><p class="iv-nota" style="margin-top:4px">Pon lo que vale hoy cada inversión (lo que te marca Trade Republic en cada posición).</p>
          <label>Fecha de la valoración</label><input type="date" id="ivFecha" value="${fechaDef}" max="${hoyK()}">${grupos}`, f => {
          const nuevos = {};
          for (const inp of f.querySelectorAll("[data-id]")) { const v = leer(inp); if (v === null) return false; nuevos[inp.dataset.id] = v; }
          const fecha = f.querySelector("#ivFecha").value || hoyK();
          Object.entries(nuevos).forEach(([id, v]) => F.activo(d, id).valor = v);
          F.foto(d, fecha); if (fecha !== hoyK()) F.foto(d, hoyK());
          d.ultimaValoracion = fecha > (d.ultimaValoracion || "") ? fecha : d.ultimaValoracion;
          store.set(d);
        });
        f.querySelectorAll("[data-id]").forEach(i => i.addEventListener("focus", () => i.select()));
      }

      // Crear o editar un activo
      function hojaActivo(id) {
        const a = id ? F.activo(d, id) : null;
        const nMovs = a ? d.movs.filter(m => m.activo === a.id).length : 0;
        const f = hoja(`<h2>${a ? esc(a.nombre) : "Añadir activo"}</h2>
          ${a ? "" : `<p class="iv-nota" style="margin-top:4px">Para dar de alta algo que ya tenías antes de usar la app. Las compras nuevas regístralas en Finanzas → Movimientos.</p>`}
          <label>Nombre</label><input id="ivNom" value="${a ? esc(a.nombre) : ""}" placeholder="iShares Core MSCI World, Bitcoin…" maxlength="40">
          <label>Categoría</label><select id="ivClase">${CLASES.map(c => `<option value="${c.id}" ${a && a.clase === c.id ? "selected" : ""}>${c.nombre}</option>`).join("")}</select>
          <div class="dos"><div><label>Valor actual</label><input class="iv-grande" id="ivValor" inputmode="decimal" value="${a ? aTexto(a.valor) : ""}" placeholder="0"></div>
            <div><label>Total aportado</label><input class="iv-grande" id="ivAport" inputmode="decimal" value="${a ? aTexto(a.aportado) : ""}" placeholder="0"></div></div>
          ${a ? `<p class="iv-nota">El total aportado se ajusta solo con las compras y ventas de Movimientos${nMovs ? ` (este activo tiene ${nMovs})` : ""}. Cámbialo a mano solo para corregir o para repartir un activo "sin desglosar" entre tus activos reales.</p>` : ""}`,
          f => {
            const nombre = f.querySelector("#ivNom").value.trim(); if (!nombre) { f.querySelector("#ivNom").style.borderColor = "var(--rojo)"; return false; }
            const v = leer(f.querySelector("#ivValor"), true), ap = leer(f.querySelector("#ivAport"), true); if (v === null || ap === null) return false;
            const otro = F.buscarActivo(d, nombre); if (otro && otro !== a) { alert("Ya tienes un activo con ese nombre."); return false; }
            const x = a || F.nuevoActivo(d, nombre, f.querySelector("#ivClase").value);
            x.nombre = nombre; x.clase = f.querySelector("#ivClase").value; x.valor = v; x.aportado = ap;
            d.movs.filter(m => m.activo === x.id).forEach(m => m.clase = x.clase);
            guardar();
          }, a ? `<button class="iv-peligro" data-h="borrar">Borrar activo</button>` : "");
        f.addEventListener("click", e => {
          if (e.target.dataset.h !== "borrar") return;
          if (nMovs) { alert("Este activo tiene " + nMovs + " movimientos en Finanzas. Bórralos allí primero, o ponlo a cero si ya no lo tienes."); return; }
          if (!confirm("¿Borrar " + a.nombre + "?")) return;
          d.activos = d.activos.filter(x => x !== a); guardar(); f.remove(); pintar();
        });
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "rango") rango = b.dataset.r;
        else if (a === "modo") modo = b.dataset.m;
        else if (a === "base") base = b.dataset.b;
        else if (a === "valores") return hojaValores();
        else if (a === "activo") return hojaActivo(b.dataset.id);
        else if (a === "nuevo-activo") return hojaActivo(null);
        pintar();
      });

      pintar();
    }
  });
})();
