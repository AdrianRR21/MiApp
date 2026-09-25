/* PANTALLA: Inversiones
   Cada activo guarda sus compras y ventas (fecha, nº de acciones y precio) y los valores de mercado que registres.
   Con eso se calcula el precio medio, el valor en cualquier fecha, la TIR, la TWR y la rentabilidad de cada mes.
   Comparte los datos con Finanzas (necesita patrimonio.js, que se carga antes).
   Para cambiarla, sustituye solo este archivo. */
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
    .iv-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:12px; }
  .iv-grid div { background:var(--papel-2); border-radius:12px; padding:11px 12px; }
  .iv-grid b { display:block; font-size:17px; margin-top:2px; }
  .iv-botones { display:flex; gap:8px; margin-top:14px; }
  .iv-botones button { flex:1; border:0; border-radius:11px; padding:12px 4px; font:inherit; font-weight:700; font-size:14px; cursor:pointer; background:var(--naranja-suave); color:var(--naranja); }
  .iv-botones button.pri { background:var(--naranja); color:#17130A; }
  .iv-hist { display:flex; align-items:center; gap:10px; padding:10px 0; border-top:1px solid var(--linea); font-size:14px; }
  .iv-hist .izq { flex:1; min-width:0; }
  .iv-hist .tipo { font-weight:600; }
  .iv-x { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:0 2px; cursor:pointer; }
  .iv-exp { font-size:12px; color:var(--tinta-suave); line-height:1.45; margin-top:6px; }
  .iv-resumen-op { background:var(--papel-2); border-radius:12px; padding:12px; margin-top:12px; font-size:14px; line-height:1.5; }
  .iv-modo { display:flex; gap:4px; margin-top:6px; }
  .iv-modo button { flex:1; border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:13.5px; font-weight:600; padding:9px 6px; border-radius:9px; cursor:pointer; }
  .iv-modo button.on { background:var(--naranja-suave); color:var(--naranja); }
  .iv-enlace { background:none; border:0; color:var(--tinta-suave); font:inherit; font-size:13.5px; font-weight:600; padding:12px 0 0; cursor:pointer; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  let vista = "evolucion", modo = "posiciones", rango = "1a", base = "valor";

  HiperApp.registrar({
    id: "inversiones",
    datos: "patrimonio",   // mismos datos que Finanzas
    titulo: "Inversiones",
    color: "#F5C542",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.3A9 9 0 0 1 20.7 9H15z"/></svg>',

    render(contenedor, store) {
      const F = window.Finanzas;
      if (!F) { contenedor.innerHTML = `<div class="bloque"><p>Falta el archivo patrimonio.js actualizado.</p></div>`; return; }
      const { CLASES, esc, eur, eurS, pct, num, hoyK, sumarDias, fechaCorta, mesMas, MESES, nuevoId } = F;
      const d = store.get({});
      F.preparar(d);
      const guardar = () => store.set(d);
      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Formato ----------
      const cls = n => n > 0.00001 ? "iv-pos" : n < -0.00001 ? "iv-neg" : "";
      const eur0 = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(n || 0);
      const nAcc = n => (Math.round(n * 1e6) / 1e6).toLocaleString("es-ES", { maximumFractionDigits: 6 });
      const precioTxt = p => p.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: p < 10 ? 4 : 2 }) + " €";
      const aTexto = n => String(Math.round(n * 1e6) / 1e6).replace(".", ",");
      const nomMes = ym => MESES[+ym.slice(5) - 1] + " " + ym.slice(2, 4);
      const conPosicion = acts => acts.filter(a => F.posicion(a).n > 0);
      // Rentabilidad total de un activo o grupo: lo que vale + lo cobrado en ventas frente a lo comprado
      const rentTotal = acts => { let comprado = 0, vendido = 0, valor = 0; acts.forEach(a => { const p = F.posicion(a); comprado += p.comprado; vendido += p.vendido; valor += F.valor(a); }); return comprado > 0 ? (valor + vendido) / comprado - 1 : null; };

      // ---------- Gráfico: valor de mercado (área) y aportado (discontinua) a final de cada mes ----------
      function grafEvolucion(meses, valor, aport) {
        const W = 340, H = 200, pad = { t: 10, r: 8, b: 22, l: 40 };
        const max = Math.max(1, ...valor, ...aport) * 1.1, n = meses.length;
        const X = i => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (W - pad.l - pad.r) * i / (n - 1));
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        let g = ""; for (let i = 0; i <= 3; i++) { const v = max * i / 3; g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v >= 1000 ? (v / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "k" : Math.round(v)}</text>`; }
        const pts = valor.map((v, i) => [X(i), Y(v)]);
        if (n > 1) g += `<polygon points="${pts.map(p => p.join(",")).join(" ")} ${X(n - 1)},${Y(0)} ${X(0)},${Y(0)}" fill="url(#ivDeg)"/>`;
        g += `<polyline points="${aport.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}" fill="none" stroke="var(--tinta)" stroke-width="1.6" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
        g += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--naranja)" stroke-width="2.4" stroke-linejoin="round"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="var(--naranja)"/>`).join("");
        const paso = Math.ceil(n / 7);
        g += meses.map((m, i) => (n - 1 - i) % paso === 0 ? `<text x="${X(i)}" y="${H - 6}" text-anchor="middle">${MESES[+m.slice(5) - 1]}${i === 0 || m.endsWith("-01") ? " " + m.slice(2, 4) : ""}</text>` : "").join("");
        return `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="ivDeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--naranja)" stop-opacity=".32"/><stop offset="1" stop-color="var(--naranja)" stop-opacity="0"/></linearGradient></defs>${g}</svg>`;
      }

      // ---------- Vista 1: evolución ----------
      function vistaEvolucion() {
        if (!d.activos.length) return `<div class="bloque"><h2>Empieza aquí</h2><p>Aún no tienes inversiones. Ve a Desglose y pulsa "Añadir activo" para dar de alta cada acción, ETF, materia prima o crypto con sus compras.</p>
          <button class="boton" data-accion="vista" data-v="desglose">Ir a Desglose</button></div>`;
        const t = F.totales(d.activos), ben = t.valor - t.coste, tir = F.tir(d.activos), twr = F.twr(d.activos);
        const primera = d.activos.flatMap(a => a.ops.map(o => o.fecha)).sort()[0];
        const meses = F.meses(primera, rango), cortes = meses.map(F.corte);
        const valor = cortes.map(c => F.totales(d.activos, c).valor), aport = cortes.map(c => F.totales(d.activos, c).coste);
        const rangos = `<div class="iv-mini-seg">${[["6m", "6 meses"], ["1a", "1 año"], ["todo", "Todo"]].map(([k, n]) => `<button class="${rango === k ? "on" : ""}" data-accion="rango" data-r="${k}">${n}</button>`).join("")}</div>`;
        return `
          <div class="iv-total">
            <div class="etiqueta">Valor de mercado</div>
            <div class="cifra">${eur(t.valor)}</div>
            <div class="sub">Aportado ${eur(t.coste)}, <span class="${cls(ben)}">${eurS(ben)}${t.coste > 0 ? " (" + pct(t.valor / t.coste - 1) + ")" : ""}</span></div>
            ${Math.abs(t.realizado) > 0.004 ? `<div class="sub">Beneficio ya realizado con ventas: <span class="${cls(t.realizado)}">${eurS(t.realizado)}</span></div>` : ""}
          </div>
          <div class="iv-tarjetas">
            <div><span class="etiqueta">TIR anual</span><b class="${cls(tir)}">${pct(tir)}</b><div class="iv-exp">Tu rentabilidad al año, teniendo en cuenta cuándo compraste y vendiste.</div></div>
            <div><span class="etiqueta">TWR anualizada</span><b class="${cls(twr)}">${pct(twr)}</b><div class="iv-exp">Lo que han rendido tus activos al año, sin el efecto de cuándo metes dinero.</div></div>
          </div>
          ${tir === null ? `<p class="iv-nota" style="margin:-4px 0 12px">Las rentabilidades anuales aparecen cuando tu primera compra tiene al menos 3 meses, para no dar cifras exageradas.</p>` : ""}
          <div class="bloque iv-graf">
            <h2>Aportado y valor</h2><div style="margin-top:10px">${rangos}</div>
            ${grafEvolucion(meses, valor, aport)}
            <div class="iv-leyenda"><span><i style="background:var(--naranja)"></i>Valor de mercado a fin de mes</span><span><i style="background:var(--tinta);height:2px;width:12px;border-radius:0"></i>Aportado</span></div>
          </div>
          <button class="iv-boton" data-accion="valores">Registrar valores de mercado</button>`;
      }

      // ---------- Vista 2: desglose ----------
      function vistaDesglose() {
        const toggle = `<div class="iv-barra-sup"><div class="iv-mini-seg"><button class="${modo === "posiciones" ? "on" : ""}" data-accion="modo" data-m="posiciones">Posiciones</button><button class="${modo === "rent" ? "on" : ""}" data-accion="modo" data-m="rent">Rentabilidad</button></div></div>`;
        const alta = `<button class="iv-boton sec" data-accion="nuevo-activo">Añadir activo</button>`;
        const clasesUsadas = CLASES.filter(c => d.activos.some(a => a.clase === c.id));
        if (!clasesUsadas.length) return toggle + alta + `<div class="bloque"><p style="margin:0">Da de alta cada inversión con su primera compra: fecha, número de acciones y precio. Después podrás añadir más compras, ventas y valores de mercado.</p></div>`;
        const primera = d.activos.flatMap(a => a.ops.map(o => o.fecha)).sort()[0];
        const meses = F.meses(primera, "todo").slice().reverse().slice(0, 24);

        if (modo === "posiciones") {
          const t = F.totales(d.activos);
          const bloques = clasesUsadas.map(c => {
            const acts = F.delaClase(d, c.id).sort((a, b) => F.valor(b) - F.valor(a));
            const tc = F.totales(acts), g = tc.valor - tc.coste;
            const filas = acts.map(a => {
              const p = F.posicion(a), v = F.valor(a), ga = v - p.coste;
              return `<button class="iv-fila" data-accion="activo" data-id="${a.id}"><div class="izq"><div>${esc(a.nombre)}</div>
                <div class="iv-sub">${p.n > 0 ? nAcc(p.n) + " a " + precioTxt(p.medio) + " de media" : "Vendido todo"}</div></div>
                <div class="der">${eur(v)}<div class="iv-sub ${cls(p.n > 0 ? ga : rentTotal([a]))}">${p.n > 0 ? pct(p.coste > 0 ? v / p.coste - 1 : null) : pct(rentTotal([a])) + " total"}</div></div></button>`;
            }).join("");
            const filasMes = meses.map(m => {
              const acum = F.totales(acts, F.corte(m)).coste, prev = F.totales(acts, F.corte(mesMas(m, -1))).coste, x = acum - prev;
              return `<tr><td>${nomMes(m)}</td><td class="${Math.abs(x) > 0.5 ? "" : "vacio"}">${Math.abs(x) > 0.5 ? (x > 0 ? "+" : "") + eur0(x) : "–"}</td><td>${eur0(acum)}</td><td>${eur0(F.totales(acts, F.corte(m)).valor)}</td></tr>`;
            }).join("");
            return `<div class="bloque">
              <div class="iv-cab"><h2><i style="background:${c.color}"></i>${c.nombre}</h2><span class="v">${eur(tc.valor)}</span></div>
              <div class="iv-sub">Aportado ${eur(tc.coste)}, <span class="${cls(g)}">${eurS(g)}${tc.coste > 0 ? " (" + pct(tc.valor / tc.coste - 1) + ")" : ""}</span></div>
              ${filas}
              <details class="iv-mesmes"><summary>Mes a mes</summary>
                <div class="iv-tabla-caja"><table class="iv-tabla"><tr><th>Mes</th><th>Aportado en el mes</th><th>Aportado acumulado</th><th>Valor</th></tr>${filasMes}</table></div>
              </details></div>`;
          }).join("");
          return toggle + `<div class="bloque"><div class="iv-cab"><h2>Total</h2><span class="v">${eur(t.valor)}</span></div>
            <div class="iv-sub">Aportado ${eur(t.coste)}, <span class="${cls(t.valor - t.coste)}">${eurS(t.valor - t.coste)}${t.coste > 0 ? " (" + pct(t.valor / t.coste - 1) + ")" : ""}</span></div></div>` + bloques + alta;
        }

        // Rentabilidad de cada mes por activo, categoría y total
        const mesesR = meses.slice(0, 12);
        const celda = r => `<td class="${r === null ? "vacio" : cls(r)}">${r === null ? "–" : pct(r)}</td>`;
        let filas = "";
        clasesUsadas.forEach(c => {
          const acts = F.delaClase(d, c.id);
          filas += `<tr class="cat"><td><span style="color:${c.color}">●</span> ${c.nombre}</td>${celda(rentTotal(acts))}${mesesR.map(m => celda(F.rentMes(acts, m))).join("")}</tr>`;
          acts.forEach(a => { filas += `<tr class="act"><td>${esc(a.nombre)}</td>${celda(rentTotal([a]))}${mesesR.map(m => celda(F.rentMes([a], m))).join("")}</tr>`; });
        });
        filas += `<tr class="tot"><td>Total cartera</td>${celda(rentTotal(d.activos))}${mesesR.map(m => celda(F.rentMes(d.activos, m))).join("")}</tr>`;
        return toggle + `<div class="bloque"><h2>Rentabilidad</h2>
          <div class="iv-tabla-caja"><table class="iv-tabla"><tr><th></th><th>Total</th>${mesesR.map(m => `<th>${nomMes(m)}</th>`).join("")}</tr>${filas}</table></div>
          <p class="iv-nota">"Total" compara lo que vale hoy más lo que has cobrado vendiendo con todo lo que has comprado. Cada mes compara el valor al final con el del final del mes anterior, descontando las compras y ventas. Para que sea exacto, registra valores de mercado a final de mes. Desliza la tabla para ver más meses.</p></div>`;
      }

      // ---------- Vista 3: reparto ----------
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
        const valorDe = a => base === "valor" ? F.valor(a) : F.posicion(a).coste;
        const partes = CLASES.map(c => ({ c, v: F.delaClase(d, c.id).reduce((s, a) => s + valorDe(a), 0) })).filter(p => p.v > 0.004);
        const T = partes.reduce((s, p) => s + p.v, 0);
        const toggle = `<div class="iv-barra-sup"><div class="iv-mini-seg"><button class="${base === "valor" ? "on" : ""}" data-accion="base" data-b="valor">Valor de mercado</button><button class="${base === "aportado" ? "on" : ""}" data-accion="base" data-b="aportado">Aportado</button></div></div>`;
        if (!T) return toggle + `<div class="bloque"><p style="margin:0">El gráfico aparecerá cuando tengas inversiones.</p></div>`;
        let ang = 0, segs = "";
        partes.forEach(p => { const x = p.v / T * Math.PI * 2; segs += `<path d="${arco(150, 150, 76, 132, ang, ang + x)}" fill="url(#ivP-${p.c.id})" stroke="var(--fondo)" stroke-width="${partes.length > 1 ? 3 : 0}" stroke-linejoin="round"/>`; ang += x; });
        const defs = `<defs>${CLASES.map(c => MOTIVOS[c.id](c.color)).join("")}</defs>`;
        const donut = `<svg class="iv-donut" viewBox="0 0 300 300" role="img" aria-label="Reparto de tus inversiones">${defs}${segs}
          <circle cx="150" cy="150" r="72" fill="var(--papel)"/>
          <text x="150" y="150" text-anchor="middle" class="c1">${eur0(T)}</text><text x="150" y="170" text-anchor="middle" class="c2">${base === "valor" ? "valor de mercado" : "aportado"}</text></svg>`;
        const leyenda = partes.sort((x, y) => y.v - x.v).map(p => {
          const acts = F.delaClase(d, p.c.id).filter(a => valorDe(a) > 0.004).sort((x, y) => valorDe(y) - valorDe(x));
          return `<div class="fila"><svg viewBox="0 0 34 34"><defs>${MOTIVOS[p.c.id](p.c.color).replace(`id="ivP-${p.c.id}"`, `id="ivL-${p.c.id}"`)}</defs><rect width="34" height="34" fill="url(#ivL-${p.c.id})"/></svg>
            <div><div style="font-weight:600">${p.c.nombre}</div><div class="iv-sub">${eur(p.v)}</div></div><b>${(p.v / T * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %</b>
            ${acts.length ? `<div class="acts">${acts.map(x => `${esc(x.nombre)} ${(valorDe(x) / T * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`).join("<br>")}</div>` : ""}</div>`;
        }).join("");
        return toggle + `<div class="bloque">${donut}<div class="iv-reparto">${leyenda}</div></div>`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="iv-seg">${[["evolucion", "Evolución"], ["desglose", "Desglose"], ["reparto", "Reparto"]].map(([k, n]) =>
          `<button class="${vista === k ? "on" : ""}" data-accion="vista" data-v="${k}">${n}</button>`).join("")}</div>
          ${{ evolucion: vistaEvolucion, desglose: vistaDesglose, reparto: vistaReparto }[vista]()}`;
      }

      // ---------- Hojas ----------
      function panel(html) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel iv-form" role="dialog"></div>`;
        contenedor.appendChild(f);   // fuera de "raiz", para que repintar la pantalla no cierre la ficha abierta
        const p = f.querySelector(".panel"); p.innerHTML = html;
        f.addEventListener("click", e => { if (e.target === f) f.remove(); });
        return { f, p, cerrar: () => f.remove() };
      }
      const rojo = el => { el.style.borderColor = "var(--rojo)"; el.focus(); };
      // Comprueba que en ningún momento se venden más acciones de las que había
      function lineaValida(a) {
        let n = 0;
        for (const o of F.opsOrdenadas(a)) { n += o.tipo === "compra" ? o.n : -o.n; if (n < -1e-7) return o; }
        return null;
      }

      // Compra o venta de un activo. Si el activo es nuevo, se crea con esta primera compra.
      function hojaOp(a, tipo, alTerminar) {
        const nuevo = !a;
        const cuentaDef = nuevo ? "" : ((d.cuentas.find(c => c.id === "tr") || d.cuentas[0] || {}).id || "");
        let enTotal = false;
        const h = panel(`<h2>${nuevo ? "Añadir activo" : (tipo === "compra" ? "Compra de " : "Venta de ") + esc(a.nombre)}</h2>
          ${nuevo ? `<div class="dos"><div><label>Nombre</label><input id="ivNom" placeholder="MSCI World, Apple, Bitcoin…" maxlength="40"></div>
            <div><label>Categoría</label><select id="ivClase">${CLASES.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("")}</select></div></div>
            <p class="iv-nota" style="margin-top:10px">Pon tu primera compra. Si tienes varias, añade el resto después desde el activo.</p>` : ""}
          <div class="dos"><div><label>Fecha</label><input type="date" id="ivF" value="${hoyK()}" max="${hoyK()}"></div>
            <div><label>Nº de acciones</label><input id="ivN" inputmode="decimal" placeholder="0" autocomplete="off"></div></div>
          <div class="iv-modo"><button data-modo="precio" class="on">Precio por acción</button><button data-modo="total">Importe total</button></div>
          <input class="iv-grande" id="ivP" inputmode="decimal" placeholder="0,00" style="margin-top:8px" autocomplete="off">
          <label>${tipo === "compra" ? "Dinero sale de" : "Dinero entra en"}</label><select id="ivC">${F.opcionesCuentas(d, cuentaDef, true)}</select>
          <div class="iv-resumen-op" id="ivRes"></div>
          <div class="iv-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        const $ = s => h.p.querySelector(s);
        function refrescar(prefill) {
          const fecha = $("#ivF").value || hoyK(), n = num($("#ivN").value), x = num($("#ivP").value);
          const precio = enTotal ? (n > 0 ? x / n : NaN) : x, total = enTotal ? x : n * x;
          let txt = "";
          if (!nuevo) {
            const p = F.posicion(a, fecha), pr = F.precio(a, fecha);
            txt += `El ${fechaCorta(fecha)} tenías ${nAcc(p.n)} acciones${p.n > 0 ? " a " + precioTxt(p.medio) + " de media" : ""}.`;
            if (pr) txt += `<br>Último precio registrado hasta esa fecha: ${precioTxt(pr.precio)} (${fechaCorta(pr.fecha)}).`;
            if (tipo === "venta" && prefill && pr && !enTotal) $("#ivP").value = aTexto(Math.round(pr.precio * 10000) / 10000);
            if (tipo === "venta" && p.n > 0) txt += ` <button class="iv-enlace" data-h="todas" style="padding:0;color:var(--naranja)">Vender todas</button>`;
          }
          if (n > 0 && isFinite(precio) && precio > 0) txt += `${txt ? "<br><br>" : ""}${enTotal ? "Precio por acción: <b>" + precioTxt(precio) + "</b>" : "Importe total: <b>" + eur(total) + "</b>"}`;
          $("#ivRes").innerHTML = txt || "Escribe el número de acciones y el precio.";
          $("#ivRes").style.display = txt ? "" : "";
        }
        h.p.addEventListener("input", e => { if (["ivN", "ivP"].includes(e.target.id)) refrescar(false); });
        $("#ivF").addEventListener("change", () => refrescar(true));
        h.p.addEventListener("click", e => {
          const t = e.target;
          if (t.dataset.modo) { enTotal = t.dataset.modo === "total"; h.p.querySelectorAll("[data-modo]").forEach(b => b.classList.toggle("on", b === t)); $("#ivP").placeholder = enTotal ? "Importe total" : "0,00"; refrescar(false); }
          if (t.dataset.h === "todas") { $("#ivN").value = aTexto(F.posicion(a, $("#ivF").value || hoyK()).n); refrescar(false); }
          if (t.dataset.h === "c") h.cerrar();
          if (t.dataset.h === "g") {
            const fecha = $("#ivF").value || hoyK(), n = num($("#ivN").value), x = num($("#ivP").value);
            let nombre, clase;
            if (nuevo) { nombre = $("#ivNom").value.trim(); clase = $("#ivClase").value; if (!nombre) return rojo($("#ivNom")); if (F.buscarActivo(d, nombre)) { alert("Ya tienes un activo con ese nombre. Añade la compra desde él."); return; } }
            if (!(n > 0)) return rojo($("#ivN"));
            if (!(x > 0)) return rojo($("#ivP"));
            const precio = enTotal ? x / n : x;
            const op = { id: nuevoId(), creado: Date.now(), fecha, tipo, n: Math.round(n * 1e6) / 1e6, precio: Math.round(precio * 1e6) / 1e6, cuenta: $("#ivC").value || null };
            const act = nuevo ? { id: nuevoId(), nombre, clase, ops: [], valores: [] } : a;
            act.ops.push(op);
            const mal = lineaValida(act);
            if (mal) { act.ops.pop(); alert("Con esta venta, el " + fechaCorta(mal.fecha) + " venderías más acciones de las que tenías en ese momento. Revisa la fecha o el número de acciones."); return; }
            if (nuevo) d.activos.push(act);
            F.aplicarEfecto(d, F.efectoOp(op), 1);
            guardar(); h.cerrar(); pintar(); if (alTerminar) alTerminar(act);
          }
        });
        refrescar(true);
        setTimeout(() => (nuevo ? $("#ivNom") : $("#ivN")).focus(), 50);
      }

      // Registrar valores de mercado en una fecha (de uno o de todos los activos)
      function hojaValores(soloActivo, alTerminar) {
        let enTotal = false;
        const h = panel(`<h2>Valor de mercado</h2>
          <p class="iv-nota" style="margin-top:4px">Se guarda con su fecha. Para cualquier cálculo en una fecha, la app usa el último valor registrado hasta ese día.</p>
          <label>Fecha</label><input type="date" id="ivVF" value="${hoyK()}" max="${hoyK()}">
          <div class="iv-modo"><button data-modo="precio" class="on">Precio por acción</button><button data-modo="total">Valor total de la posición</button></div>
          <div id="ivLista"></div>
          <div class="iv-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`);
        const $ = s => h.p.querySelector(s);
        const lista = () => (soloActivo ? [soloActivo] : d.activos);
        function pintarLista() {
          const fecha = $("#ivVF").value || hoyK();
          const acts = lista().filter(a => F.posicion(a, fecha).n > 0);
          if (!acts.length) { $("#ivLista").innerHTML = `<p class="iv-nota">${soloActivo ? "Ese día no tenías acciones de " + esc(soloActivo.nombre) + ", así que no tiene valor que registrar." : "Ese día no tenías ninguna inversión."}</p>`; return; }
          $("#ivLista").innerHTML = CLASES.map(c => { const xs = acts.filter(a => a.clase === c.id); if (!xs.length) return "";
            return (soloActivo ? "" : `<div class="iv-grupo">${c.nombre}</div>`) + xs.map(a => {
              const p = F.posicion(a, fecha), pr = F.precio(a, fecha), ref = pr ? (enTotal ? p.n * pr.precio : pr.precio) : null;
              return `<div class="iv-val"><div class="n">${esc(a.nombre)}<div class="iv-sub">${nAcc(p.n)} acciones${pr ? ", último " + (enTotal ? eur(ref) : precioTxt(ref)) + " (" + fechaCorta(pr.fecha) + ")" : ""}</div></div>
                <input inputmode="decimal" data-id="${a.id}" placeholder="${ref ? aTexto(Math.round(ref * 100) / 100) : "0,00"}"></div>`; }).join(""); }).join("")
            + `<p class="iv-nota">Deja vacío lo que no quieras actualizar.</p>`;
        }
        $("#ivVF").addEventListener("change", pintarLista);
        h.p.addEventListener("click", e => {
          const t = e.target;
          if (t.dataset.modo) { enTotal = t.dataset.modo === "total"; h.p.querySelectorAll("[data-modo]").forEach(b => b.classList.toggle("on", b === t)); pintarLista(); }
          if (t.dataset.h === "c") h.cerrar();
          if (t.dataset.h === "g") {
            const fecha = $("#ivVF").value || hoyK(); let n = 0;
            for (const inp of h.p.querySelectorAll("[data-id]")) {
              if (!inp.value.trim()) continue;
              const v = num(inp.value); if (!(v > 0)) return rojo(inp);
              const a = F.activo(d, inp.dataset.id), acc = F.posicion(a, fecha).n;
              const precio = enTotal ? v / acc : v;
              a.valores = a.valores.filter(x => x.fecha !== fecha);
              a.valores.push({ fecha, precio: Math.round(precio * 1e6) / 1e6 }); n++;
            }
            if (!n) { alert("No has escrito ningún valor."); return; }
            guardar(); h.cerrar(); pintar(); if (alTerminar) alTerminar();
          }
        });
        pintarLista();
      }

      // Ficha de un activo: situación, botones y todo su historial
      function hojaActivo(id) {
        const a = F.activo(d, id); if (!a) return;
        const h = panel("");
        function pintarFicha() {
          const p = F.posicion(a), v = F.valor(a), pr = F.precio(a), g = v - p.coste, c = CLASES.find(x => x.id === a.clase);
          const hist = a.ops.map(o => ({ fecha: o.fecha, orden: 1, html: `<div class="iv-hist"><div class="izq"><div class="tipo">${o.tipo === "compra" ? "Compra" : "Venta"} de ${nAcc(o.n)} a ${precioTxt(o.precio)}</div>
              <div class="iv-sub">${fechaCorta(o.fecha)} ${o.fecha.slice(0, 4)}, ${eur(o.n * o.precio)}${o.cuenta ? "" : ", sin mover saldo"}</div></div><button class="iv-x" data-borrar-op="${o.id}" aria-label="Borrar">×</button></div>` }))
            .concat(a.valores.map(x => ({ fecha: x.fecha, orden: 0, html: `<div class="iv-hist"><div class="izq"><div class="tipo">Valor de mercado: ${precioTxt(x.precio)} por acción</div>
              <div class="iv-sub">${fechaCorta(x.fecha)} ${x.fecha.slice(0, 4)}${F.posicion(a, x.fecha).n > 0 ? ", la posición valía " + eur(F.posicion(a, x.fecha).n * x.precio) : ""}</div></div><button class="iv-x" data-borrar-val="${x.fecha}" aria-label="Borrar">×</button></div>` })))
            .sort((x, y) => y.fecha.localeCompare(x.fecha) || x.orden - y.orden).map(x => x.html).join("");
          h.p.innerHTML = `<h2>${esc(a.nombre)}</h2><div class="iv-sub">${c.nombre}</div>
            <div class="iv-grid">
              <div><span class="etiqueta">Acciones</span><b>${nAcc(p.n)}</b></div>
              <div><span class="etiqueta">Precio medio</span><b>${p.n > 0 ? precioTxt(p.medio) : "–"}</b></div>
              <div><span class="etiqueta">Último precio</span><b>${pr ? precioTxt(pr.precio) : "–"}</b><span class="iv-sub">${pr ? fechaCorta(pr.fecha) : ""}</span></div>
              <div><span class="etiqueta">Valor</span><b>${eur(v)}</b></div>
              <div><span class="etiqueta">Aportado</span><b>${eur(p.coste)}</b></div>
              <div><span class="etiqueta">Beneficio</span><b class="${cls(g)}">${eurS(g)}</b><span class="iv-sub">${p.coste > 0 ? pct(v / p.coste - 1) : ""}</span></div>
              ${Math.abs(p.realizado) > 0.004 ? `<div><span class="etiqueta">Realizado con ventas</span><b class="${cls(p.realizado)}">${eurS(p.realizado)}</b></div>` : ""}
              <div><span class="etiqueta">TIR anual</span><b class="${cls(F.tir([a]))}">${pct(F.tir([a]))}</b></div>
            </div>
            <div class="iv-botones"><button class="pri" data-h="compra">Compra</button><button data-h="venta" ${p.n > 0 ? "" : "disabled style=\"opacity:.4\""}>Venta</button><button data-h="valor" ${p.n > 0 ? "" : "disabled style=\"opacity:.4\""}>Valor</button></div>
            <div class="iv-grupo">Historial</div>${hist || `<p class="iv-nota">Sin operaciones.</p>`}
            <div class="iv-acciones"><button class="boton secundario" data-h="editar">Editar nombre</button><button class="boton" data-h="cerrar">Cerrar</button></div>
            <button class="iv-peligro" data-h="borrar">Borrar activo</button>`;
        }
        h.p.addEventListener("click", e => {
          const t = e.target.closest("button"); if (!t) return;
          const k = t.dataset.h;
          if (k === "cerrar") return h.cerrar();
          if (k === "compra" || k === "venta") return hojaOp(a, k, () => { if (h.f.isConnected) pintarFicha(); });
          if (k === "valor") return hojaValores(a, () => { if (h.f.isConnected) pintarFicha(); });
          if (k === "editar") {
            const n = (prompt("Nombre del activo", a.nombre) || "").trim(); if (!n) return;
            const otro = F.buscarActivo(d, n); if (otro && otro !== a) { alert("Ya tienes un activo con ese nombre."); return; }
            a.nombre = n; guardar(); pintarFicha(); pintar(); return;
          }
          if (k === "borrar") {
            if (!confirm("¿Borrar " + a.nombre + " con todo su historial? Se deshará el efecto de sus compras y ventas en los saldos de tus cuentas.")) return;
            a.ops.forEach(o => F.aplicarEfecto(d, F.efectoOp(o), -1));
            d.activos = d.activos.filter(x => x !== a); guardar(); h.cerrar(); pintar(); return;
          }
          if (t.dataset.borrarOp) {
            const o = a.ops.find(x => x.id === t.dataset.borrarOp);
            if (!confirm("¿Borrar esta " + o.tipo + "? Se deshará su efecto en el saldo.")) return;
            a.ops = a.ops.filter(x => x !== o);
            if (lineaValida(a)) { a.ops.push(o); alert("No se puede borrar: sin esta compra, alguna venta posterior sería de más acciones de las que tenías. Borra antes esa venta."); return; }
            F.aplicarEfecto(d, F.efectoOp(o), -1);
            if (!a.ops.length) { d.activos = d.activos.filter(x => x !== a); guardar(); h.cerrar(); pintar(); return; }
            guardar(); pintarFicha(); pintar();
          }
          if (t.dataset.borrarVal) { a.valores = a.valores.filter(x => x.fecha !== t.dataset.borrarVal); guardar(); pintarFicha(); pintar(); }
        });
        pintarFicha();
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "rango") rango = b.dataset.r;
        else if (a === "modo") modo = b.dataset.m;
        else if (a === "base") base = b.dataset.b;
        else if (a === "valores") return hojaValores(null);
        else if (a === "activo") return hojaActivo(b.dataset.id);
        else if (a === "nuevo-activo") return hojaOp(null, "compra", act => hojaActivo(act.id));
        pintar();
      });

      pintar();
    }
  });
})();
