/* PANTALLA: Vida
   Resumen de un vistazo de Hábitos, Agenda, Deporte, Alimentación, Finanzas, Inversiones y Value Investing.
   No guarda datos propios: lee los de cada pantalla (y permite marcar los hábitos de hoy desde aquí).
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .vd-resumen { color:var(--tinta-suave); font-size:14.5px; line-height:1.6; margin:-2px 2px 22px; }
  .vd-resumen b { color:var(--tinta); font-weight:500; }
  .vd-grid { display:grid; gap:14px; grid-template-columns:minmax(0, 1fr); }
  .vd-card { position:relative; background:radial-gradient(120% 70% at 100% 0%, color-mix(in srgb, var(--c) 8%, transparent), transparent 62%), var(--papel); border:1px solid var(--linea); border-radius:20px; padding:18px 18px 20px; min-width:0; box-shadow:var(--sombra-tarjeta); transition:border-color .2s, transform .2s; }
  .vd-card:hover { border-color:color-mix(in srgb, var(--c) 35%, var(--linea)); }
  /* Accesos rápidos a cada pantalla (solo en el móvil; en el ordenador está la barra lateral) */
  .vd-accesos { display:flex; gap:8px; overflow-x:auto; margin:0 -16px 18px; padding:2px 16px 4px; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
  .vd-accesos::-webkit-scrollbar { display:none; }
  .vd-accesos button { flex:none; display:flex; flex-direction:column; align-items:center; gap:7px; width:68px; border:0; background:none; color:var(--tinta-suave); font:inherit; font-size:11.5px; font-weight:500; padding:0; cursor:pointer; letter-spacing:-0.01em; }
  .vd-accesos i { width:54px; height:54px; border-radius:18px; display:grid; place-items:center; background:var(--papel); border:1px solid var(--linea); color:var(--c); box-shadow:var(--sombra-tarjeta); transition:transform .15s; }
  .vd-accesos i svg { width:23px; height:23px; }
  .vd-accesos button:active i { transform:scale(.93); }
  .vd-accesos span { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .vd-vivo { color:var(--c); font-weight:500; }
  .vd-vivo::before { content:""; display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--c); margin-right:6px; vertical-align:1px; animation:vdLatido 1.6s ease-in-out infinite; }
  @keyframes vdLatido { 50% { opacity:.3; } }
  .vd-vivo .s { opacity:.6; }
  .vd-estudio .vd-mini { grid-template-columns:repeat(2, minmax(0, 1fr)); }
  .vd-cab { display:flex; align-items:center; gap:9px; margin-bottom:16px; }
  .vd-cab i { width:8px; height:8px; border-radius:50%; background:var(--c); box-shadow:0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent); flex:none; }
  .vd-cab span { flex:1; font-size:11px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:var(--tinta-suave); }
  .vd-cab button { background:none; border:0; color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:500; cursor:pointer; padding:4px 0 4px 8px; display:flex; align-items:center; gap:4px; }
  .vd-cab button:hover { color:var(--c); }
  .vd-cifra { font-size:34px; font-weight:600; letter-spacing:-0.05em; line-height:1; }
  .vd-cifra small { font-size:15px; font-weight:500; letter-spacing:-0.02em; color:var(--tinta-suave); margin-left:4px; }
  .vd-sub { font-size:13px; color:var(--tinta-suave); margin-top:7px; line-height:1.5; }
  .vd-pos { color:var(--verde); } .vd-neg { color:var(--rojo); }
  .vd-vacio { color:var(--tinta-suave); font-size:14px; line-height:1.55; }
  .vd-vacio button { margin-top:12px; }
  .vd-mini { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px; margin-top:16px; }
  .vd-mini div { background:var(--papel-2); border-radius:11px; padding:10px 11px; min-width:0; }
  .vd-mini span { display:block; font-size:11.5px; line-height:1.3; color:var(--tinta-suave); }
  .vd-mini b { display:block; font-size:15.5px; font-weight:600; letter-spacing:-0.025em; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .vd-linea { display:block; width:100%; height:64px; margin-top:16px; overflow:visible; }
  .vd-sep { height:1px; background:var(--linea); margin:16px 0; }
  .vd-tit { font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--tinta-tenue); margin:0 0 8px; }

  /* Hábitos */
  .vd-hab-cuerpo { display:grid; gap:20px; }
  .vd-check { display:flex; align-items:center; gap:12px; width:100%; background:none; border:0; border-top:1px solid var(--linea); padding:11px 0; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .vd-check:first-child { border-top:0; padding-top:2px; }
  .vd-check i { flex:none; width:22px; height:22px; border-radius:50%; box-shadow:inset 0 0 0 1.6px var(--tinta-tenue); display:grid; place-items:center; transition:background .15s; }
  .vd-check i svg { width:12px; height:12px; opacity:0; }
  .vd-check.on i { background:var(--c); box-shadow:none; }
  .vd-check.on i svg { opacity:1; }
  .vd-check.on span { color:var(--tinta-suave); }
  .vd-check span { flex:1; font-size:15px; letter-spacing:-0.01em; }
  .vd-barras { display:flex; align-items:flex-end; gap:5px; height:86px; margin-top:16px; }
  .vd-barras div { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; justify-content:flex-end; }
  .vd-barras em { display:block; width:100%; max-width:22px; border-radius:5px; background:var(--c); min-height:3px; }
  .vd-barras em.cero { background:var(--papel-2); }
  .vd-barras span { font-size:10.5px; color:var(--tinta-tenue); font-family:var(--mono); }
  .vd-barras div.hoy span { color:var(--tinta); }

  /* Agenda */
  .vd-ev { display:grid; grid-template-columns:48px 1fr; gap:12px; padding:9px 0; border-top:1px solid var(--linea); }
  .vd-ev:first-child { border-top:0; padding-top:0; }
  .vd-ev .h { font-family:var(--mono); font-size:13px; color:var(--tinta-suave); padding-top:1px; }
  .vd-ev b { display:block; font-weight:500; font-size:15px; letter-spacing:-0.01em; }
  .vd-ev small { font-size:12.5px; color:var(--tinta-suave); }
  .vd-ev.pasado { opacity:.42; }
  .vd-ev.ahora .h { color:var(--c); }
  .vd-ev.ahora b::after { content:"ahora"; margin-left:8px; font-size:10.5px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c); }
  .vd-tarea { display:flex; gap:10px; align-items:baseline; font-size:14px; padding:5px 0; }
  .vd-tarea::before { content:""; flex:none; width:6px; height:6px; border-radius:2px; box-shadow:inset 0 0 0 1.4px var(--tinta-suave); transform:translateY(-1px); }
  .vd-tarea small { color:var(--tinta-tenue); font-size:12px; margin-left:auto; padding-left:8px; white-space:nowrap; }

  /* Deporte */
  .vd-rutina { font-size:22px; font-weight:600; letter-spacing:-0.035em; }
  .vd-estado { display:inline-flex; align-items:center; gap:6px; margin-top:8px; font-size:12px; font-weight:600; padding:4px 9px; border-radius:7px; background:var(--papel-2); color:var(--tinta-suave); }
  .vd-estado.hecho { background:color-mix(in srgb, var(--c) 16%, transparent); color:var(--c); }
  .vd-ejs { display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }
  .vd-ejs span { font-size:12.5px; padding:5px 9px; border-radius:8px; box-shadow:inset 0 0 0 1px var(--linea-2); color:var(--tinta-suave); }
  .vd-dias { display:grid; grid-template-columns:repeat(14, 1fr); gap:4px; margin-top:8px; }
  .vd-dias i { aspect-ratio:1; border-radius:4px; background:var(--papel-2); position:relative; }
  .vd-dias i.g { background:var(--c); }
  .vd-dias i.p::after { content:""; position:absolute; inset:30%; border-radius:50%; background:var(--tinta); }
  .vd-dias i.hoy { box-shadow:0 0 0 1px var(--tinta-suave); }

  /* Alimentación */
  .vd-alim { display:grid; gap:18px; }
  .vd-kcal { display:flex; align-items:center; gap:16px; }
  .vd-kcal svg { flex:none; width:86px; height:86px; transform:rotate(-90deg); }
  .vd-macro { margin-top:9px; }
  .vd-macro:first-child { margin-top:0; }
  .vd-macro .n { display:flex; justify-content:space-between; font-size:12.5px; color:var(--tinta-suave); margin-bottom:5px; }
  .vd-macro .n b { color:var(--tinta); font-weight:500; }
  .vd-barra { height:5px; border-radius:3px; background:var(--papel-2); overflow:hidden; }
  .vd-barra div { height:100%; border-radius:3px; background:var(--c); }
  .vd-barra div.pasado { background:var(--rojo); }

  /* Finanzas */
  .vd-reparto { display:flex; height:6px; border-radius:3px; overflow:hidden; gap:2px; margin-top:16px; }
  .vd-ley { display:flex; flex-wrap:wrap; gap:4px 12px; margin-top:9px; font-size:11.5px; color:var(--tinta-suave); }
  .vd-ley span { display:inline-flex; align-items:center; gap:5px; }
  .vd-ley i { width:7px; height:7px; border-radius:2px; }
  .vd-top { display:flex; align-items:center; gap:10px; padding:8px 0; border-top:1px solid var(--linea); font-size:14px; width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font-family:inherit; text-align:left; }
  .vd-top:first-child { border-top:0; }
  .vd-top span { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .vd-top small { font-size:12px; color:var(--tinta-tenue); }
  .vd-top b { font-weight:600; }

  .vd-mini span em { font-style:normal; }
  .vd-c { display:none; }

  @media (min-width: 1024px) { .vd-accesos { display:none; } }
  @media (min-width: 700px) {
    .vd-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    .vd-ancha { grid-column:span 2; }
    .vd-hab-cuerpo, .vd-alim { grid-template-columns:minmax(0, 1fr) minmax(0, 1.1fr); gap:28px; align-items:start; }
    .vd-hab-cuerpo .vd-barras { margin-top:0; height:120px; }
  }
  /* ===== ORDENADOR: todo a la vez, sin desplazamiento (4 columnas × 2 filas) =====
     Los tamaños se ajustan a la altura de la ventana con vh. */
  @media (min-width: 1200px) and (min-height: 560px) {
    html:has(body[data-pantalla="vida"]), body[data-pantalla="vida"] { overflow:hidden; height:100vh; }
    body[data-pantalla="vida"] .app { height:100vh; }
    body[data-pantalla="vida"] .cuerpo { height:100vh; display:flex; flex-direction:column; overflow:hidden; }
    body[data-pantalla="vida"] .top { padding-top:clamp(16px, 3vh, 30px); padding-bottom:clamp(6px, 1.2vh, 12px); }
    body[data-pantalla="vida"] .top h1 { font-size:clamp(24px, 3.6vh, 34px); }
    body[data-pantalla="vida"] main.ancho { flex:1; min-height:0; width:100%; display:flex; flex-direction:column; padding-top:0; padding-bottom:clamp(14px, 2.6vh, 28px); }
    .vd-raiz { flex:1; min-height:0; display:flex; flex-direction:column; }
    .vd-resumen { margin:0 2px clamp(10px, 1.8vh, 18px); font-size:clamp(12.5px, 1.6vh, 14.5px); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .vd-grid { flex:1; min-height:0; grid-template-columns:repeat(4, minmax(0, 1fr)); grid-template-rows:repeat(2, minmax(0, 1fr)); gap:clamp(10px, 1.5vh, 16px); }
    .vd-ancha { grid-column:auto; }
    .vd-estudio .vd-barras { height:clamp(40px, 10vh, 110px); margin-top:clamp(6px, 1vh, 12px); }
    .vd-card { overflow:hidden; display:flex; flex-direction:column; min-height:0; padding:clamp(13px, 2vh, 20px) clamp(14px, 1.3vw, 20px); border-radius:16px; }
    .vd-card > :not(.vd-cab) { flex:none; }
    .vd-cab { margin-bottom:clamp(8px, 1.4vh, 14px); }
    .vd-cifra { font-size:clamp(22px, 3.3vh, 32px); }
    .vd-cifra small { font-size:clamp(12px, 1.5vh, 14px); }
    .vd-sub { font-size:clamp(11.5px, 1.45vh, 13px); margin-top:4px; }
    .vd-tit { margin-bottom:5px; }
    .vd-sep { margin:clamp(8px, 1.4vh, 14px) 0; }
    .vd-linea { height:clamp(30px, 5vh, 52px) !important; margin-top:clamp(8px, 1.3vh, 14px); }
    .vd-mini { margin-top:clamp(8px, 1.4vh, 14px); gap:6px; }
    .vd-mini div { padding:clamp(6px, 1vh, 9px) 8px; border-radius:9px; }
    .vd-mini span { font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .vd-mini b { font-size:clamp(13px, 1.7vh, 15px); }
    .vd-l { display:none; } .vd-c { display:inline; }
    .vd-extra { display:none; }
    .vd-reparto { margin-top:clamp(8px, 1.3vh, 14px); }
    .vd-ley { gap:2px 9px; margin-top:6px; font-size:10.5px; max-height:30px; overflow:hidden; }
    .vd-top { padding:clamp(4px, .8vh, 8px) 0; font-size:13px; }
    /* Hábitos: lista arriba, gráfico de 14 días abajo */
    .vd-hab-cuerpo { grid-template-columns:minmax(0, 1fr); grid-template-rows:minmax(0, 1fr) auto; align-items:stretch; gap:clamp(8px, 1.4vh, 14px); flex:1 !important; min-height:0; }
    .vd-hab-cuerpo > div:first-child { min-height:0; overflow:hidden; align-self:stretch; -webkit-mask-image:linear-gradient(#000 calc(100% - 26px), transparent); mask-image:linear-gradient(#000 calc(100% - 26px), transparent); }
    .vd-hab .vd-sub, .vd-estudio .vd-sub { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .vd-check { padding:clamp(6px, 1.05vh, 10px) 0; }
    .vd-check span { font-size:clamp(13px, 1.65vh, 15px); }
    .vd-check i { width:19px; height:19px; }
    .vd-hab-cuerpo .vd-barras { height:clamp(40px, 8vh, 90px); gap:3px; margin-top:0; }
    .vd-hab-cuerpo .vd-barras span { font-size:9.5px; }
    /* Agenda: lo que quepa */
    .vd-agenda .vd-ev { padding:clamp(5px, .9vh, 9px) 0; }
    .vd-evs > :nth-child(n+4) { display:none; }
    .vd-mini:has(> .vd-extra) { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    .vd-ev { grid-template-columns:42px 1fr; gap:9px; }
    .vd-ev b { font-size:14px; } .vd-ev small { font-size:11.5px; }
    .vd-tarea { font-size:13px; padding:3px 0; }
    .vd-tareas > :nth-child(n+4) { display:none; }
    /* Deporte */
    .vd-rutina { font-size:clamp(17px, 2.4vh, 22px); }
    .vd-ejs { margin-top:8px; gap:4px; max-height:52px; overflow:hidden; }
    .vd-ejs span { font-size:11.5px; padding:3px 7px; }
    .vd-dias { gap:3px; }
    /* Alimentación en una columna: peso, gráfico y calorías */
    .vd-alim { grid-template-columns:minmax(0, 1fr); gap:clamp(8px, 1.4vh, 14px); }
    .vd-kcal { gap:12px; }
    .vd-kcal svg { width:clamp(46px, 7vh, 66px); height:clamp(46px, 7vh, 66px); }
    .vd-kcal .vd-cifra { font-size:clamp(18px, 2.6vh, 24px) !important; }
    .vd-alim .vd-macro { margin-top:5px; }
    .vd-alim .vd-macro .n { margin-bottom:3px; font-size:11.5px; }
    .vd-alim .vd-macro:nth-child(4) { display:none; }   /* agua: se ve en la pantalla de Alimentación */
    .vd-alim [style*="margin-top:16px"] { margin-top:8px !important; }
  }
  @media (min-width: 1200px) and (min-height: 560px) and (max-height: 820px) {
    .vd-alim .vd-linea, .vd-fin-graf { display:none; }
    .vd-tops > :nth-child(n+3), .vd-evs > :nth-child(n+3), .vd-tareas > :nth-child(n+3) { display:none; }
    .vd-alim .vd-macro:nth-child(3) { display:none; }
    .vd-hab .vd-sub { display:none; }
    .vd-hab-cuerpo .vd-barras { height:clamp(32px, 6vh, 48px); }
    .vd-sub { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = s => { s = String(s == null ? "" : s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const hoyK = () => clave(new Date());
  const sumarK = (k, n) => { const x = aFecha(k); x.setDate(x.getDate() + n); return clave(x); };
  const fCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
  const eur0 = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(n || 0);
  const eurS0 = n => (n > 0.5 ? "+" : "") + eur0(n);
  const pct = n => { if (n === null || n === undefined || !isFinite(n)) return "–"; if (Math.abs(n) < 0.0005) n = 0; return (n > 0 ? "+" : "") + (n * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "\u00a0%"; };
  const cls = n => n > 0.00001 ? "vd-pos" : n < -0.00001 ? "vd-neg" : "";
  const f1 = n => (Math.round(n * 10) / 10).toLocaleString("es-ES", { maximumFractionDigits: 1 });
  const DIAS = ["D", "L", "M", "X", "J", "V", "S"];
  const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="var(--sobre-acento)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const flecha = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  // Línea fina con área degradada. series: [{vals, color, area, discontinua}]
  let nGraf = 0;
  function linea(series, alto = 64) {
    const W = 300, todos = series.flatMap(s => s.vals).filter(v => v != null && isFinite(v));
    if (todos.length < 2) return "";
    let min = Math.min(...todos), max = Math.max(...todos); if (max - min < 1e-9) { max += 1; min -= 1; }
    const m = (max - min) * 0.12; min -= m; max += m;
    const id = "vdg" + (++nGraf);
    let g = "";
    series.forEach(s => {
      const n = s.vals.length, pts = s.vals.map((v, i) => v == null ? null : [W * (n === 1 ? 0.5 : i / (n - 1)), alto - alto * (v - min) / (max - min)]).filter(Boolean);
      if (pts.length < 2) return;
      const p = pts.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
      if (s.area) g += `<polygon points="${p} ${pts[pts.length - 1][0]},${alto} ${pts[0][0]},${alto}" fill="url(#${id})"/>`;
      g += `<polyline points="${p}" fill="none" stroke="${s.color}" stroke-width="${s.fina ? 1.3 : 2}" ${s.discontinua ? 'stroke-dasharray="3 3"' : ""} stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
      if (s.puntos) g += pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="1.6" fill="${s.color}" opacity=".45"/>`).join("");
    });
    const c = series[0].color;
    return `<svg class="vd-linea" style="height:${alto}px" viewBox="0 0 ${W} ${alto}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".28"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>${g}</svg>`;
  }
  const tarjeta = (id, titulo, cuerpo, extra = "") => `<section class="vd-card ${extra}" style="--c:${HiperApp.color(id)}">
    <div class="vd-cab"><i></i><span>${titulo}</span><button data-ir="${id}" aria-label="Abrir ${titulo}">Abrir ${flecha}</button></div>${cuerpo}</section>`;
  const vacio = (texto, id, boton) => `<div class="vd-vacio">${texto}${boton ? `<br><button class="boton secundario" data-ir="${id}">${boton}</button>` : ""}</div>`;

  HiperApp.registrar({
    id: "vida",
    ancho: true,
    usa: ["habitos", "patrimonio", "value", "alimentacion", "gimnasio", "estudio"],   // se repinta si cambian
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="9" rx="2"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="2"/><rect x="13.5" y="11.5" width="7.5" height="9.5" rx="2"/><rect x="3" y="15" width="7.5" height="6" rx="2"/></svg>',

    render(contenedor) {
      const hoy = hoyK();
      const sto = id => HiperApp.almacen(id);
      const H = sto("habitos").get({}), A = sto("alimentacion").get({}), G = sto("gimnasio").get({}), V = sto("value").get({});
      const P = sto("patrimonio").get({});
      const Fin = window.Finanzas;
      const raiz = document.createElement("div");
      raiz.className = "vd-raiz";
      contenedor.appendChild(raiz);
      const resumen = [];
      const et = (largo, corto) => `<span><em class="vd-l">${largo}</em><em class="vd-c">${corto}</em></span>`;   // etiqueta larga (móvil) y corta (ordenador)

      // ---------- Hábitos ----------
      function cHabitos() {
        const habs = (H.habitos || []), reg = H.registro || {};
        const activos = k => habs.filter(h => h.desde <= k);
        const pctDia = k => { const a = activos(k); return a.length ? a.filter(h => (reg[k] || []).includes(h.id)).length / a.length : null; };
        if (!habs.length) return tarjeta("habitos", "Hábitos", vacio("Aún no tienes hábitos. Crea los que quieras cumplir cada día y aquí podrás marcarlos.", "habitos", "Crear hábitos"), "vd-ancha vd-hab");
        const hechos = activos(hoy).filter(h => (reg[hoy] || []).includes(h.id)).length, total = activos(hoy).length;
        resumen.push(`<b>${hechos} de ${total}</b> hábitos hechos`);
        let racha = 0; for (let k = pctDia(hoy) === 1 ? hoy : sumarK(hoy, -1); pctDia(k) === 1; k = sumarK(k, -1)) racha++;
        const dias = []; for (let i = 13; i >= 0; i--) dias.push(sumarK(hoy, -i));
        const vals = dias.map(pctDia), conDatos = vals.filter(v => v !== null), media = conDatos.length ? conDatos.reduce((a, b) => a + b, 0) / conDatos.length : null;
        const barras = dias.map((k, i) => { const v = vals[i]; return `<div class="${k === hoy ? "hoy" : ""}"><em class="${!v ? "cero" : ""}" style="height:${v ? Math.max(v * 100, 6) : 4}%;opacity:${v ? .35 + v * .65 : 1}"></em><span>${DIAS[aFecha(k).getDay()]}</span></div>`; }).join("");
        const lista = activos(hoy).map(h => `<button class="vd-check ${(reg[hoy] || []).includes(h.id) ? "on" : ""}" data-habito="${h.id}"><i>${tick}</i><span>${esc(h.nombre)}</span></button>`).join("");
        return tarjeta("habitos", "Hábitos", `<div class="vd-hab-cuerpo">
            <div><div class="vd-cifra">${hechos}<small>de ${total} hoy</small></div>
              <div class="vd-sub">${racha ? `Racha de <b style="color:var(--tinta);font-weight:500">${racha} ${racha === 1 ? "día" : "días"}</b> completos · ` : ""}media de 14 días: ${media === null ? "–" : Math.round(media * 100) + "\u00a0%"}</div>
              <div style="margin-top:14px">${lista}</div></div>
            <div><div class="vd-tit">Últimos 14 días</div><div class="vd-barras">${barras}</div></div>
          </div>`, "vd-ancha vd-hab");
      }

      // ---------- Agenda y tareas ----------
      function cAgenda() {
        const evs = ((H.agenda || {})[hoy] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));
        const manana = ((H.agenda || {})[sumarK(hoy, 1)] || []).length;
        const ahora = new Date(), min = ahora.getHours() * 60 + ahora.getMinutes();
        const aMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
        if (evs.length) resumen.push(`<b>${evs.length} ${evs.length === 1 ? "plan" : "planes"}</b> en la agenda`);
        // Un plan sin hora de fin se considera de una hora
        const lista = evs.map(e => { const ini = aMin(e.hora), fin = e.fin ? aMin(e.fin) : ini + 60, enCurso = ini <= min && min < fin, pasado = fin <= min;
          return `<div class="vd-ev ${enCurso ? "ahora" : pasado ? "pasado" : ""}"><div class="h">${e.hora}</div><div><b>${esc(e.titulo)}</b>${e.fin || e.nota ? `<small>${e.fin ? "hasta " + e.fin : ""}${e.fin && e.nota ? " · " : ""}${esc(e.nota || "")}</small>` : ""}</div></div>`; }).join("");
        const tareas = (H.tareas || []).filter(t => !t.hecha);
        return tarjeta("habitos", "Agenda de hoy", `${lista ? `<div class="vd-evs">${lista}</div>` : `<div class="vd-vacio">Nada planificado para hoy.</div>`}
          ${manana ? `<div class="vd-sub vd-extra" style="margin-top:12px">Mañana: ${manana} ${manana === 1 ? "plan" : "planes"}</div>` : ""}
          <div class="vd-sep"></div>
          <div class="vd-tit">Tareas pendientes · ${tareas.length}</div>
          ${tareas.length ? `<div class="vd-tareas">${tareas.slice(0, 4).map(t => `<div class="vd-tarea">${esc(t.texto)}<small>${esc(t.cat || "")}</small></div>`).join("")}</div>` : `<div class="vd-vacio" style="font-size:13.5px">Ninguna. Todo al día.</div>`}
          ${tareas.length > 4 ? `<div class="vd-sub">y ${tareas.length - 4} más</div>` : ""}`, "vd-agenda");
      }

      // ---------- Deporte ----------
      function cDeporte() {
        const rutina = G.rutina || {}, ses = G.sesiones || {}, ejs = G.ejercicios || {}, partidos = G.partidos || [];
        const valida = s => num(s.reps) > 0;
        const hizo = k => ses[k] && (ses[k].ejercicios || []).some(e => e.series.some(valida));
        const volumen = s => (s ? s.ejercicios : []).reduce((t, e) => t + e.series.filter(valida).reduce((a, x) => a + (num(x.kg) || 0) * num(x.reps), 0), 0);
        const r = rutina[(new Date().getDay() + 6) % 7], s = ses[hoy];
        const nombre = s ? s.nombre : r ? r.nombre : "Descanso";
        const lista = s ? s.ejercicios.map(e => (ejs[e.ex] || {}).nombre) : r ? r.ejercicios.map(id => (ejs[id] || {}).nombre) : [];
        if (r || s) resumen.push(`hoy toca <b>${esc(nombre)}</b>`);
        if (!Object.keys(rutina).length && !Object.keys(ses).length && !partidos.length) return tarjeta("gimnasio", "Deporte", vacio("Crea tu rutina semanal y aquí verás lo que toca cada día.", "gimnasio", "Crear rutina"));
        const mes = hoy.slice(0, 7), diasMes = Object.keys(ses).filter(k => k.startsWith(mes) && hizo(k)).length;
        const pDias = new Set(partidos.map(p => p.fecha));
        const tira = []; for (let i = 13; i >= 0; i--) { const k = sumarK(hoy, -i); tira.push(`<i class="${hizo(k) ? "g" : ""} ${pDias.has(k) ? "p" : ""} ${k === hoy ? "hoy" : ""}" title="${fCorta(k)}"></i>`); }
        const res = p => { let a = 0, b = 0; p.sets.forEach(([x, y]) => { if (x > y) a++; else if (y > x) b++; }); return a > b ? "V" : a < b ? "D" : "E"; };
        const c = { V: 0, E: 0, D: 0 }; partidos.forEach(p => c[res(p)]++);
        const ult = partidos.slice().sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
        return tarjeta("gimnasio", "Deporte", `<div class="vd-tit">${r || s ? "Rutina de hoy" : "Hoy"}</div>
          <div class="vd-rutina">${esc(nombre)}</div>
          ${hizo(hoy) ? `<span class="vd-estado hecho">Hecho · ${Math.round(volumen(s)).toLocaleString("es-ES")} kg de volumen</span>` : r ? `<span class="vd-estado">Pendiente · ${lista.length} ejercicios</span>` : ""}
          ${lista.length ? `<div class="vd-ejs">${lista.filter(Boolean).slice(0, 6).map(n => `<span>${esc(n)}</span>`).join("")}${lista.length > 6 ? `<span>+${lista.length - 6}</span>` : ""}</div>` : ""}
          <div class="vd-sep"></div>
          <div class="vd-tit">Últimos 14 días</div><div class="vd-dias">${tira.join("")}</div>
          <div class="vd-mini">
            <div>${et("Días de gym este mes", "Gym, mes")}<b>${diasMes} ${diasMes === 1 ? "día" : "días"}</b></div>
            <div><span>Pádel</span><b>${partidos.length ? `${c.V}V ${c.E}E ${c.D}D` : "–"}</b></div>
            <div class="vd-extra">${et("Último partido", "Último")}<b>${ult ? ult.sets.map(x => x.join("-")).join(" ") : "–"}</b></div>
          </div>`);
      }

      // ---------- Alimentación ----------
      function cAlimentacion() {
        const dias = A.dias || {}, d = dias[hoy];
        const conPeso = Object.keys(dias).filter(k => dias[k].peso && k > sumarK(hoy, -31)).sort();
        const ultimo = Object.keys(dias).filter(k => dias[k].peso && k <= hoy).sort().pop();
        if (!ultimo && !d) return tarjeta("alimentacion", "Alimentación", vacio("Pésate por la mañana y apunta lo que comes para ver aquí tu peso, calorías y macros.", "alimentacion", "Empezar"), "vd-ancha");
        const peso = ultimo ? dias[ultimo].peso : null;
        if (d && d.peso) resumen.push(`<b>${f1(d.peso)} kg</b> esta mañana`);
        const ref = Object.keys(dias).filter(k => dias[k].peso && k <= sumarK(hoy, -7)).sort().pop();
        const media = k => { const v = Object.keys(dias).filter(x => dias[x].peso && x <= k && x > sumarK(k, -7)).map(x => dias[x].peso); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
        const cambio = ref && media(hoy) !== null && media(ref) !== null ? media(hoy) - media(ref) : null;
        const serie = [], medias = []; for (let i = 29; i >= 0; i--) { const k = sumarK(hoy, -i); serie.push(dias[k] && dias[k].peso ? dias[k].peso : null); medias.push(conPeso.some(x => x <= k) ? media(k) : null); }
        const tot = (d && d.comidas || []).reduce((t, x) => ({ kcal: t.kcal + x.kcal, p: t.p + x.p, c: t.c + x.c, g: t.g + x.g }), { kcal: 0, p: 0, c: 0, g: 0 });
        const o = d && d.obj;
        const R = 36, C = 2 * Math.PI * R, fr = o ? Math.min(tot.kcal / o.kcal, 1) : 0, pasado = o && tot.kcal > o.kcal * 1.05;
        const barra = (n, v, obj, u = "g") => `<div class="vd-macro"><div class="n"><span>${n}</span><span><b>${Math.round(v)}</b> / ${obj} ${u}</span></div><div class="vd-barra"><div class="${v > obj * 1.1 ? "pasado" : ""}" style="width:${Math.min(v / obj, 1) * 100}%"></div></div></div>`;
        const pesoHtml = `<div><div class="vd-tit">Peso</div><div class="vd-cifra">${peso ? f1(peso) : "–"}<small>kg</small></div>
            <div class="vd-sub">${d && d.peso ? "Hoy" : ultimo ? "Último, " + fCorta(ultimo) + " · aún no te has pesado hoy" : ""}${cambio !== null ? ` · <span class="${cambio > 0.05 ? "vd-pos" : cambio < -0.05 ? "vd-neg" : ""}">${cambio > 0 ? "+" : ""}${f1(cambio)} kg</span> en 7 días` : ""}</div>
            ${linea([{ vals: medias, color: "var(--c)", area: true }, { vals: serie, color: "var(--tinta-suave)", fina: true, puntos: true }], 70)}
            ${conPeso.length > 1 ? `<div class="vd-ley vd-extra" style="margin-top:6px"><span><i style="background:var(--c)"></i>Media de 7 días</span><span><i style="background:var(--tinta-suave)"></i>Cada día · 30 días</span></div>` : ""}</div>`;
        const comidaHtml = o ? `<div><div class="vd-tit">Hoy</div><div class="vd-kcal">
              <svg viewBox="0 0 86 86"><circle cx="43" cy="43" r="${R}" fill="none" stroke="var(--papel-2)" stroke-width="8"/><circle cx="43" cy="43" r="${R}" fill="none" stroke="${pasado ? "var(--rojo)" : "var(--c)"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C * fr} ${C}"/></svg>
              <div><div class="vd-cifra" style="font-size:28px">${Math.round(tot.kcal).toLocaleString("es-ES")}<small>/ ${o.kcal.toLocaleString("es-ES")} kcal</small></div>
                <div class="vd-sub">${o.kcal - tot.kcal >= 0 ? "Te quedan " + Math.round(o.kcal - tot.kcal).toLocaleString("es-ES") + " kcal" : "Te has pasado " + Math.round(tot.kcal - o.kcal).toLocaleString("es-ES") + " kcal"}</div></div></div>
            <div style="margin-top:16px">${barra("Proteína", tot.p, o.p)}${barra("Hidratos", tot.c, o.c)}${barra("Grasa", tot.g, o.g)}
              <div class="vd-macro"><div class="n"><span>Agua</span><span><b>${f1(d.agua || 0)}</b> / ${f1(o.agua)} l</span></div><div class="vd-barra"><div style="width:${Math.min((d.agua || 0) / o.agua, 1) * 100}%"></div></div></div></div></div>`
          : `<div><div class="vd-tit">Hoy</div><div class="vd-vacio">Pon tu peso de hoy para calcular tus calorías y macros.<br><button class="boton secundario" data-ir="alimentacion">Pesarme</button></div></div>`;
        return tarjeta("alimentacion", "Alimentación", `<div class="vd-alim">${pesoHtml}${comidaHtml}</div>`, "vd-ancha");
      }

      // ---------- Finanzas ----------
      function cFinanzas() {
        if (!Fin) return "";
        Fin.preparar(P);
        const liq = Fin.liquidez(P), inv = Fin.totales(P.activos), T = liq + inv.valor;
        if (!P.movs.length && !P.activos.length && !P.cuentas.some(c => c.saldo)) return tarjeta("patrimonio", "Finanzas", vacio("Pon el saldo de tus cuentas y apunta tus ingresos y gastos para ver aquí tu patrimonio.", "patrimonio", "Empezar"));
        const primera = Fin.primeraFecha(P), hace30 = sumarK(hoy, -30);
        const delta = primera && primera <= hace30 ? T - Fin.patrimonio(P, hace30) : null;
        const mes = hoy.slice(0, 7), movs = P.movs.filter(m => m.fecha.startsWith(mes));
        const ing = movs.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.importe, 0), gas = movs.filter(m => m.tipo === "gasto").reduce((s, m) => s + m.importe, 0);
        const meses = []; for (let i = 5; i >= 0; i--) meses.push(Fin.mesMas(mes, -i));
        const serie = meses.map(m => Fin.patrimonio(P, Fin.corte(m)));
        const partes = [{ n: "Liquidez", v: liq, c: Fin.COLOR_LIQ }].concat(Fin.CLASES.map(c => ({ n: c.nombre, v: Fin.totales(Fin.delaClase(P, c.id)).valor, c: c.color }))).filter(p => p.v > 0);
        return tarjeta("patrimonio", "Finanzas", `<div class="vd-tit">Patrimonio total</div><div class="vd-cifra">${eur0(T)}</div>
          <div class="vd-sub">${delta !== null ? `<span class="${cls(delta)}">${eurS0(delta)}</span> en 30 días` : "Patrimonio de hoy"}</div>
          <div class="vd-fin-graf">${linea([{ vals: serie, color: "var(--c)", area: true }], 56)}</div>
          ${T > 0 ? `<div class="vd-reparto">${partes.map(p => `<div style="flex:${p.v};background:${p.c}"></div>`).join("")}</div>
            <div class="vd-ley">${partes.map(p => `<span><i style="background:${p.c}"></i>${p.n} ${Math.round(p.v / T * 100)}%</span>`).join("")}</div>` : ""}
          <div class="vd-tit" style="margin:18px 0 0">Este mes</div>
          <div class="vd-mini" style="margin-top:8px">
            <div><span>Ingresos</span><b>${eur0(ing)}</b></div>
            <div><span>Gastos</span><b>${eur0(gas)}</b></div>
            <div>${et("Tasa de ahorro", "Ahorro")}<b class="${cls(ing - gas)}">${ing > 0 ? Math.round((ing - gas) / ing * 100) + " %" : eurS0(ing - gas)}</b></div>
          </div>`);
      }

      // ---------- Inversiones ----------
      function cInversiones() {
        if (!Fin) return "";
        if (!P.activos.length) return tarjeta("inversiones", "Inversiones", vacio("Da de alta tus acciones, ETFs, materias primas o crypto para ver aquí su evolución.", "inversiones", "Añadir inversiones"));
        const t = Fin.totales(P.activos), ben = t.valor - t.coste, tir = Fin.tir(P.activos);
        const mes = hoy.slice(0, 7), meses = []; for (let i = 11; i >= 0; i--) meses.push(Fin.mesMas(mes, -i));
        const primera = P.activos.flatMap(a => a.ops.map(o => o.fecha)).sort()[0] || hoy;
        const ms = meses.filter(m => m >= primera.slice(0, 7));
        const valores = ms.map(m => Fin.totales(P.activos, Fin.corte(m)).valor), costes = ms.map(m => Fin.totales(P.activos, Fin.corte(m)).coste);
        const mejores = P.activos.filter(a => Fin.posicion(a).n > 0).map(a => { const p = Fin.posicion(a), v = Fin.valor(a); return { a, r: p.coste > 0 ? v / p.coste - 1 : 0, v }; }).sort((x, y) => y.v - x.v).slice(0, 3);
        return tarjeta("inversiones", "Inversiones", `<div class="vd-tit">Valor de mercado</div><div class="vd-cifra">${eur0(t.valor)}</div>
          <div class="vd-sub"><span class="${cls(ben)}">${eurS0(ben)} (${t.coste > 0 ? pct(t.valor / t.coste - 1) : "–"})</span> sobre ${eur0(t.coste)} aportados</div>
          ${linea([{ vals: valores, color: "var(--c)", area: true }, { vals: costes, color: "var(--tinta-suave)", fina: true, discontinua: true }], 56)}
          <div class="vd-mini">
            <div><span>TIR anual</span><b class="${cls(tir)}">${pct(tir)}</b></div>
            <div class="vd-extra"><span>Activos</span><b>${P.activos.filter(a => Fin.posicion(a).n > 0).length}</b></div>
            <div><span>Beneficio</span><b class="${cls(ben)}">${t.coste > 0 ? pct(t.valor / t.coste - 1) : "–"}</b></div>
          </div>
          ${mejores.length ? `<div class="vd-extra"><div class="vd-sep"></div><div class="vd-tit">Mayores posiciones</div>${mejores.map(x => `<div class="vd-top"><span>${esc(x.a.nombre)}</span><small>${eur0(x.v)}</small><b class="${cls(x.r)}">${pct(x.r)}</b></div>`).join("")}</div>` : ""}`);
      }

      // ---------- Value Investing ----------
      function cValue() {
        const emps = V.empresas || [], umbral = (V.umbral || 10) / 100;
        if (!emps.length) return tarjeta("value", "Value Investing", vacio("Añade empresas con tu valor intrínseco para seguir si están infravaloradas.", "value", "Añadir empresa"), "vd-value");
        const val = e => e.valoraciones.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).pop();
        const precio = e => e.precios.concat(e.valoraciones.map(v => ({ fecha: v.fecha, precio: v.precio }))).filter(x => x.fecha <= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).pop();
        const pot = e => { const v = val(e), p = precio(e); return v && p ? v.intrinseco / p.precio - 1 : null; };
        const grupo = e => { const x = pot(e); return x === null ? "bien" : x > umbral ? "infra" : x < -umbral ? "sobre" : "bien"; };
        const n = { infra: 0, bien: 0, sobre: 0 }; emps.forEach(e => n[grupo(e)]++);
        const pos = emps.flatMap(e => (e.posiciones || []).map(p => ({ e, p })));
        const rent = ({ e, p }) => (p.salida ? p.salida.precio : precio(e).precio) / p.entrada.precio - 1;
        const media = pos.length ? pos.reduce((s, x) => s + rent(x), 0) / pos.length : null;
        const top = emps.filter(e => grupo(e) === "infra").sort((a, b) => pot(b) - pot(a)).slice(0, 4);
        return tarjeta("value", "Value Investing", `<div class="vd-tit">Cartera ficticia</div><div class="vd-cifra ${cls(media)}">${pct(media)}</div>
          <div class="vd-sub">${pos.length ? `${pos.filter(x => !x.p.salida).length} abiertas, ${pos.filter(x => x.p.salida).length} vendidas · 1.000 € en cada una` : "Aún sin compras ficticias"}</div>
          <div class="vd-mini">
            <div>${et("Infravaloradas", "Infra")}<b class="vd-pos">${n.infra}</b></div>
            <div>${et("Bien valoradas", "Justas")}<b>${n.bien}</b></div>
            <div>${et("Sobrevaloradas", "Sobre")}<b class="${n.sobre ? "vd-neg" : ""}">${n.sobre}</b></div>
          </div>
          ${top.length ? `<div class="vd-sep"></div><div class="vd-tit">Más potencial</div><div class="vd-tops">${top.slice(0, 3).map(e => `<div class="vd-top"><span>${esc(e.nombre)}</span><small>${esc(e.ticker || "")}</small><b class="vd-pos">${pct(pot(e))}</b></div>`).join("")}</div>` : ""}`, "vd-value");
      }

      // ---------- Estudio ----------
      function cEstudio() {
        const Es = window.Estudio; if (!Es) return "";
        const E = sto("estudio").get({}), t = Es.porDia(E), c = E.crono, on = !!(c && c.inicio);
        if (!(E.sesiones || []).length && !c) return tarjeta("estudio", "Estudio", vacio("Usa el cronómetro o apunta tus horas para ver aquí lo que estudias cada día y cada semana.", "estudio", "Empezar a estudiar"), "vd-estudio");
        const hoyMin = t[hoy] || 0, lun = Es.lunesDe(hoy), sem = Es.rango(t, lun, hoy), nDias = ((aFecha(hoy).getDay() + 6) % 7) + 1;
        if (hoyMin) resumen.push(`<b>${Es.fDur(hoyMin)}</b> de estudio`);
        const dur = m => { m = Math.round(m); const h = Math.floor(m / 60), r = m % 60; return h ? `${h}<small>h</small>${r ? ` ${r}<small>min</small>` : ""}` : `${r}<small>min</small>`; };
        const vals = [0, 1, 2, 3, 4, 5, 6].map(i => sumarK(lun, i)), max = Math.max(60, ...vals.map(k => t[k] || 0));
        const barras = vals.map(k => { const v = t[k] || 0; return `<div class="${k === hoy ? "hoy" : ""}"><em class="${!v ? "cero" : ""}" style="height:${v ? Math.max(v / max * 100, 6) : 4}%"></em><span>${DIAS[aFecha(k).getDay()]}</span></div>`; }).join("");
        return tarjeta("estudio", "Estudio", `<div class="vd-tit">Hoy</div><div class="vd-cifra">${dur(hoyMin)}</div>
          <div class="vd-sub">${on ? `<span class="vd-vivo">Estudiando · <span data-crono>${Es.reloj(Es.transcurrido(c))}</span></span>` : c ? "Cronómetro en pausa" : `Media diaria esta semana: ${Es.fDur(sem / nDias)}`}</div>
          <div class="vd-barras">${barras}</div>
          <div class="vd-mini">
            <div>${et("Esta semana", "Semana")}<b>${Es.fDurC(sem)}</b></div>
            <div>${et("Media diaria · 30 días", "Media 30 d")}<b>${Es.fDurC(Es.rango(t, sumarK(hoy, -29), hoy) / 30)}</b></div>
          </div>`, "vd-estudio");
      }

      let vivo = null;
      function pintar() {
        resumen.length = 0;
        const tarjetas = [cHabitos(), cAgenda(), cDeporte(), cAlimentacion(), cEstudio(), cFinanzas(), cInversiones(), cValue()];
        const accesos = [...document.querySelectorAll("#menuLista button")].filter(b => b.dataset.id !== "vida")
          .map(b => `<button data-ir="${b.dataset.id}" style="--c:${HiperApp.color(b.dataset.id)}"><i>${b.querySelector("svg") ? b.querySelector("svg").outerHTML : ""}</i><span>${esc(b.textContent)}</span></button>`).join("");
        raiz.innerHTML = `${resumen.length ? `<p class="vd-resumen">${resumen.join(" · ").replace(/^./, c => c.toUpperCase())}.</p>` : `<p class="vd-resumen">Tu día de un vistazo.</p>`}
          ${accesos ? `<nav class="vd-accesos" aria-label="Ir a">${accesos}</nav>` : ""}
          <div class="vd-grid">${tarjetas.join("")}</div>`;
        // Si el cronómetro de estudio está en marcha, el tiempo se mueve también aquí
        clearInterval(vivo);
        if (raiz.querySelector("[data-crono]")) vivo = setInterval(() => {
          const el = raiz.querySelector("[data-crono]"); if (!el || !raiz.isConnected) return clearInterval(vivo);
          el.innerHTML = window.Estudio.reloj(window.Estudio.transcurrido(sto("estudio").get({}).crono));
        }, 1000);
      }

      raiz.addEventListener("click", e => {
        const h = e.target.closest("[data-habito]");
        if (h) {
          const reg = H.registro || (H.registro = {}), l = reg[hoy] || (reg[hoy] = []), i = l.indexOf(h.dataset.habito);
          if (i >= 0) l.splice(i, 1); else l.push(h.dataset.habito);
          sto("habitos").set(H); pintar(); return;
        }
        const b = e.target.closest("[data-ir]"); if (b) HiperApp.ir(b.dataset.ir);
      });
      pintar();
    }
  });
})();
