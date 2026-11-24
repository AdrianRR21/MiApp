/* PESTAÑA: Hábitos y tareas
   Para cambiarla, sustituye solo este archivo. */
(() => {
  // ---------- Estilos propios de esta pestaña ----------
  const css = `
  .hb-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:16px; }
  .hb-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }

  /* ===== Hábitos ===== */
  .hb-hero { position:relative; overflow:hidden; display:grid; grid-template-columns:auto minmax(0, 1fr); gap:20px; align-items:center;
    background:var(--naranja); color:var(--sobre-acento); border-radius:28px; padding:22px; margin-bottom:14px; box-shadow:0 22px 44px -26px var(--naranja); }
  .hb-hero::after { content:""; position:absolute; right:-60px; top:-60px; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,.14); pointer-events:none; }
  .hb-anillo { position:relative; width:118px; height:118px; flex:none; }
  .hb-anillo svg { width:100%; height:100%; transform:rotate(-90deg); }
  .hb-anillo .c { position:absolute; inset:0; display:grid; place-content:center; text-align:center; }
  .hb-anillo b { font-size:34px; font-weight:800; letter-spacing:-0.06em; line-height:1; }
  .hb-anillo span { font-size:12px; font-weight:600; opacity:.75; margin-top:3px; }
  .hb-hero h2 { margin:0; font-size:26px; font-weight:800; letter-spacing:-0.045em; line-height:1.05; color:inherit; }
  .hb-hero p { margin:6px 0 0; font-size:14px; line-height:1.45; color:inherit; opacity:.78; }
  .hb-hero .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
  .hb-hero .chips span { font-size:12px; font-weight:700; padding:5px 10px; border-radius:999px; background:rgba(0,0,0,.14); }
  :root[data-tema="claro"] .hb-hero .chips span { background:rgba(255,255,255,.2); }

  .hb-dias { display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:6px; margin-bottom:18px; }
  .hb-dia { border:0; background:none; color:var(--tinta-suave); font:inherit; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px; padding:0; }
  .hb-dia span { font-size:11.5px; font-weight:600; }
  .hb-dia .r { position:relative; width:42px; height:42px; border-radius:50%; display:grid; place-items:center;
    background:conic-gradient(var(--naranja) calc(var(--p) * 1%), color-mix(in srgb, var(--naranja) 16%, var(--papel-2)) 0); }
  .hb-dia .r::before { content:""; position:absolute; inset:4px; border-radius:50%; background:var(--fondo); }
  .hb-dia b { position:relative; font-size:14.5px; font-weight:800; color:var(--tinta); }
  .hb-dia.sel .r::before { background:var(--naranja); }
  .hb-dia.sel b { color:var(--sobre-acento); }
  .hb-dia.sel span { color:var(--naranja); }

  .hb-cab { display:flex; justify-content:space-between; align-items:center; margin:0 2px 12px; gap:10px; }
  .hb-cab h2, .hb-cab h3 { margin:0; font-size:20px; font-weight:800; letter-spacing:-0.04em; }
  .hb-enlace { background:var(--tinte); border:0; color:var(--naranja); font:inherit; font-weight:700; font-size:13px; cursor:pointer; padding:7px 13px; border-radius:999px; }
  .hb-tiles { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:10px; margin-bottom:12px; }
  .hb-tile { position:relative; min-height:96px; text-align:left; border:0; border-radius:22px; padding:14px 14px 13px; cursor:pointer; font:inherit;
    background:var(--papel); color:var(--tinta); box-shadow:inset 0 0 0 1.5px var(--linea-2); display:flex; flex-direction:column; justify-content:space-between; gap:10px; transition:transform .12s, background .2s; }
  .hb-tile:active { transform:scale(.97); }
  .hb-tile .ck { width:30px; height:30px; border-radius:50%; display:grid; place-items:center; box-shadow:inset 0 0 0 2px var(--linea-2); color:var(--sobre-acento); }
  .hb-tile .ck svg { width:15px; height:15px; opacity:0; }
  .hb-tile .nm { font-size:15px; font-weight:700; letter-spacing:-0.02em; line-height:1.25; word-break:break-word; }
  .hb-tile .rc { position:absolute; top:14px; right:14px; font-size:11.5px; font-weight:700; color:var(--tinta-suave); }
  .hb-tile.on { background:var(--naranja); color:var(--sobre-acento); box-shadow:0 14px 30px -18px var(--naranja); }
  .hb-tile.on .ck { background:var(--sobre-acento); box-shadow:none; color:var(--naranja); }
  .hb-tile.on .ck svg { opacity:1; }
  .hb-tile.on .rc { color:inherit; opacity:.75; }
  .hb-tile .hb-borrar { position:absolute; top:8px; right:8px; width:30px; height:30px; border-radius:50%; background:var(--rojo); color:#fff; border:0; font-size:18px; line-height:1; cursor:pointer; }
  .hb-nuevo { display:flex; gap:8px; margin-top:4px; }
  .hb-nuevo input { flex:1; min-width:0; border-radius:999px; padding-left:18px; }
  .hb-nuevo select { width:auto; max-width:40%; border-radius:999px; }
  .hb-mas { flex:none; width:48px; height:48px; border:0; border-radius:50%; background:var(--naranja); color:var(--sobre-acento); font-size:26px; font-weight:500; cursor:pointer; box-shadow:0 10px 22px -12px var(--naranja); }

  .hb-pct-top { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:6px; gap:10px; }
  .hb-pct-top .cifra { font-size:46px; color:var(--naranja); }
  .hb-mini-seg { display:flex; gap:4px; }
  .hb-mini-seg button { border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 11px; border-radius:8px; cursor:pointer; }
  .hb-graf svg { width:100%; height:auto; display:block; margin-top:6px; }
  .hb-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }
  .hb-mapa { display:grid; gap:4px; margin-top:18px; align-items:center; }
  .hb-mapa .nom { font-size:13px; font-weight:600; color:var(--tinta); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-right:8px; }
  .hb-mapa .pc { font-size:12.5px; font-weight:800; color:var(--naranja); text-align:right; padding-left:6px; }
  .hb-mapa i { display:block; aspect-ratio:1; border-radius:30%; background:color-mix(in srgb, var(--naranja) 12%, var(--papel-2)); }
  .hb-mapa i.si { background:var(--naranja); }
  .hb-mapa i.no-aplica { background:transparent; box-shadow:inset 0 0 0 1px var(--linea); }

  /* ===== Tareas ===== */
  .tk-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:14px; margin:4px 2px 14px; }
  .tk-hero b { display:block; font-size:64px; font-weight:800; letter-spacing:-0.07em; line-height:.9; color:var(--naranja); }
  .tk-hero span { font-size:14px; font-weight:600; color:var(--tinta-suave); }
  .tk-hero .pr { text-align:right; font-size:13px; color:var(--tinta-suave); font-weight:600; }
  .tk-barra { height:10px; border-radius:5px; background:var(--tinte); overflow:hidden; margin-bottom:16px; }
  .tk-barra i { display:block; height:100%; border-radius:5px; background:var(--naranja); }
  .tk-nuevo { background:var(--tinte); border-radius:24px; padding:10px; margin-bottom:16px; }
  .tk-nuevo .hb-nuevo { margin:0; }
  .tk-nuevo input, .tk-nuevo select { background:var(--papel); border-color:transparent; }
  .tk-grupos { display:grid; gap:12px; }
  .tk-cat { background:var(--papel); border:1px solid var(--linea); border-radius:24px; padding:16px 16px 8px; box-shadow:var(--sombra-tarjeta); }
  .tk-cat-cab { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
  .tk-cat-cab h3 { flex:1; margin:0; font-size:19px; font-weight:800; letter-spacing:-0.04em; }
  .tk-cat-cab .n { min-width:28px; height:28px; padding:0 8px; border-radius:999px; background:var(--naranja); color:var(--sobre-acento); font-size:13px; font-weight:800; display:grid; place-items:center; }
  .hb-fila { display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid var(--linea); }
  .tk-cat-cab + .hb-fila { border-top:0; }
  .hb-fila .txt { flex:1; line-height:1.35; word-break:break-word; font-weight:500; }
  .hb-check { flex:none; width:28px; height:28px; border-radius:9px; border:2px solid var(--linea-2); background:none; cursor:pointer; display:grid; place-items:center; padding:0; color:var(--sobre-acento); }
  .hb-check.on { background:var(--naranja); border-color:var(--naranja); }
  .hb-check svg { width:15px; height:15px; opacity:0; }
  .hb-check.on svg { opacity:1; }
  .hb-fila.hecha .txt { color:var(--tinta-tenue); text-decoration:line-through; }
  .hb-borrar { flex:none; background:none; border:0; color:var(--tinta-tenue); font-size:22px; line-height:1; padding:2px 6px; cursor:pointer; }

  /* ===== Agenda ===== */
  .ag-tira { display:flex; gap:8px; overflow-x:auto; margin:0 -16px 14px; padding:2px 16px 6px; scrollbar-width:none; }
  .ag-tira::-webkit-scrollbar { display:none; }
  .ag-tira button { flex:none; width:58px; padding:10px 0 9px; border:0; border-radius:18px; background:var(--papel); box-shadow:inset 0 0 0 1px var(--linea); color:var(--tinta); font:inherit; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:2px; }
  .ag-tira button span { font-size:11px; font-weight:700; color:var(--tinta-suave); text-transform:uppercase; }
  .ag-tira button b { font-size:20px; font-weight:800; letter-spacing:-0.04em; }
  .ag-tira button i { width:5px; height:5px; border-radius:50%; background:transparent; margin-top:2px; }
  .ag-tira button.tiene i { background:var(--naranja); }
  .ag-tira button.sel { background:var(--naranja); box-shadow:0 10px 22px -12px var(--naranja); }
  .ag-tira button.sel span, .ag-tira button.sel b { color:var(--sobre-acento); }
  .ag-tira button.sel i { background:var(--sobre-acento); }
  .ag-cal-b summary { list-style:none; cursor:pointer; display:flex; align-items:center; justify-content:space-between; font-weight:700; font-size:14px; color:var(--tinta-suave); }
  .ag-cal-b summary::-webkit-details-marker { display:none; }
  .ag-cal-b summary::after { content:"Ver mes ▾"; font-size:13px; color:var(--naranja); }
  .ag-cal-b[open] summary::after { content:"Ocultar ▴"; }
  .ag-cal-b[open] summary { margin-bottom:12px; }
  .ag-cal { display:grid; grid-template-columns:repeat(7, 1fr); gap:3px; text-align:center; }
  .ag-cal .l { font-size:11.5px; font-weight:600; color:var(--tinta-suave); padding-bottom:6px; }
  .ag-cal button { position:relative; aspect-ratio:1; border:0; background:none; color:var(--tinta); font:inherit; font-size:14px; font-weight:600; border-radius:50%; cursor:pointer; padding:0; }
  .ag-cal button.pasado { color:var(--tinta-tenue); }
  .ag-cal button.hoy { box-shadow:inset 0 0 0 1.5px var(--linea-2); }
  .ag-cal button.sel { background:var(--naranja); color:var(--sobre-acento); }
  .ag-cal button.tiene::after { content:""; position:absolute; bottom:4px; left:50%; margin-left:-2px; width:4px; height:4px; border-radius:50%; background:var(--naranja); }
  .ag-cal button.sel.tiene::after { background:var(--sobre-acento); }
  .ag-mes { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .ag-mes b { font-weight:800; font-size:16px; letter-spacing:-0.03em; }
  .ag-mes button { background:var(--papel-2); border:0; color:var(--tinta); width:34px; height:34px; border-radius:50%; font-size:16px; cursor:pointer; }
  .ag-dia-cab { display:flex; justify-content:space-between; align-items:flex-end; margin:6px 2px 14px; gap:10px; }
  .ag-dia-cab h3 { margin:0; font-size:30px; font-weight:800; letter-spacing:-0.055em; line-height:1; }
  .ag-dia-cab .etiqueta { text-align:right; }
  .ag-linea-t { position:relative; padding-left:74px; }
  .ag-linea-t::before { content:""; position:absolute; left:60px; top:8px; bottom:8px; width:2px; border-radius:1px; background:color-mix(in srgb, var(--naranja) 25%, var(--linea)); }
  .ag-linea { position:relative; margin-bottom:10px; }
  .ag-hora { position:absolute; left:-74px; width:50px; top:14px; text-align:right; font-size:14px; font-weight:800; letter-spacing:-0.02em; font-variant-numeric:tabular-nums; color:var(--tinta); }
  .ag-linea::before { content:""; position:absolute; left:-19px; top:17px; width:12px; height:12px; border-radius:50%; background:var(--fondo); box-shadow:inset 0 0 0 3px var(--naranja); }
  .ag-ev { width:100%; text-align:left; font:inherit; color:inherit; background:var(--tinte); border:0; border-radius:18px; padding:13px 15px; cursor:pointer; }
  .ag-ev b { display:block; font-weight:700; font-size:15.5px; letter-spacing:-0.02em; }
  .ag-ev span { font-size:12.5px; color:var(--tinta-suave); }
  .ag-ev.ahora { background:var(--naranja); color:var(--sobre-acento); box-shadow:0 14px 28px -16px var(--naranja); }
  .ag-ev.ahora span { color:inherit; opacity:.75; }
  .ag-linea.ahora::before { background:var(--naranja); }
  .ag-ev.pasado { opacity:.45; }
  .ag-vacio { text-align:center; padding:34px 20px; border-radius:24px; border:1.5px dashed var(--linea-2); color:var(--tinta-suave); font-size:14.5px; line-height:1.5; margin-bottom:12px; }
  .ag-anadir { width:100%; border:0; font:inherit; font-weight:700; font-size:15px; padding:15px; border-radius:18px; cursor:pointer; margin:6px 0 12px; }
  .hb-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .hb-form .dos { display:flex; gap:10px; }
  .hb-form .dos > div { flex:1; min-width:0; }
  .hb-acciones { display:flex; gap:8px; margin-top:20px; }
  .hb-acciones .boton { flex:1; margin:0; }
  .hb-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }

  @media (min-width:700px) { .hb-tiles { grid-template-columns:repeat(3, minmax(0, 1fr)); } }
  /* ===== Ordenador ===== */
  @media (min-width:1024px) {
    body[data-pantalla="habitos"] main > div:has(> .hb-hero) { grid-template-columns:minmax(0, 1.15fr) minmax(0, 1fr); align-items:start; }
    body[data-pantalla="habitos"] main > div:has(> .hb-hero) > .hb-hero { grid-column:1; grid-row:2; margin:0; }
    body[data-pantalla="habitos"] main > div:has(> .hb-hero) > .hb-dias { grid-column:2; grid-row:2; align-self:center; margin:0; }
    body[data-pantalla="habitos"] main > div:has(> .hb-hero) > .hb-lista { grid-column:1; grid-row:3; }
    body[data-pantalla="habitos"] main > div:has(> .hb-hero) > .bloque { grid-column:2; grid-row:3; }
    body[data-pantalla="habitos"] .hb-tiles { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    body[data-pantalla="habitos"] .hb-dia .r { width:52px; height:52px; }
    body[data-pantalla="habitos"] .hb-anillo { width:140px; height:140px; }
    body[data-pantalla="habitos"] .hb-hero { padding:28px; }
    body[data-pantalla="habitos"] .hb-hero h2 { font-size:32px; }
    body[data-pantalla="habitos"] main > div:has(> .tk-grupos) { grid-template-columns:minmax(0, 1fr) minmax(0, 1.6fr); }
    body[data-pantalla="habitos"] main > div:has(> .tk-grupos) > .tk-hero, body[data-pantalla="habitos"] main > div:has(> .tk-grupos) > .tk-barra, body[data-pantalla="habitos"] main > div:has(> .tk-grupos) > .tk-nuevo { grid-column:1; }
    body[data-pantalla="habitos"] main > div:has(> .tk-grupos) > .tk-grupos { grid-column:2; grid-row:2 / span 4; grid-template-columns:repeat(2, minmax(0, 1fr)); align-items:start; }
    body[data-pantalla="habitos"] .tk-hero b { font-size:88px; }
    body[data-pantalla="habitos"] main > div:has(> .ag-linea-t, > .ag-vacio) { grid-template-columns:minmax(300px, 380px) minmax(0, 1fr); column-gap:32px; }
    body[data-pantalla="habitos"] main > div:has(> .ag-linea-t, > .ag-vacio) > * { grid-column:2; }
    body[data-pantalla="habitos"] main > div:has(> .ag-linea-t, > .ag-vacio) > .hb-seg { grid-column:1 / -1; }
    body[data-pantalla="habitos"] main > div:has(> .ag-linea-t, > .ag-vacio) > .ag-cal-b { grid-column:1; grid-row:2 / span 6; position:sticky; top:150px; }
    body[data-pantalla="habitos"] .ag-cal-b summary { display:none; }
    body[data-pantalla="habitos"] .ag-tira { margin:0 0 6px; padding:2px 0 6px; }
    body[data-pantalla="habitos"] .ag-dia-cab h3 { font-size:40px; }
    body[data-pantalla="habitos"] .ag-anadir { justify-self:start; width:auto; padding:13px 26px; }
  }
  `;
  const estilo = document.createElement("style");
  estilo.textContent = css;
  document.head.appendChild(estilo);

  // ---------- Utilidades ----------
  const DIAS = ["D", "L", "M", "X", "J", "V", "S"];
  const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoy = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const sumar = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const aFecha = k => { const [y, m, dd] = k.split("-").map(Number); return new Date(y, m - 1, dd); };
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Estado de la pantalla (no se guarda, solo mientras usas la app)
  let vista = "habitos";      // "habitos", "tareas" o "agenda"
  let agendaSel = null, agendaMes = null;
  let periodo = "semana";     // "semana" o "mes"
  let editando = false;
  let diaSel = null;
  let ultimaCat = null;
  let calAbierto = false;

  HiperApp.registrar({
    id: "habitos",
    titulo: "Hábitos",
    nombreCorto: "Hábitos",
    color: "#F2884B",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',

    render(contenedor, store) {
      // Datos guardados de esta pestaña
      const d = store.get({});
      d.habitos = d.habitos || [];            // [{id, nombre, desde:"AAAA-MM-DD"}]
      d.registro = d.registro || {};          // {"AAAA-MM-DD": [ids cumplidos]}
      d.tareas = d.tareas || [];              // [{id, texto, cat, hecha}]
      d.categorias = d.categorias || ["Uni", "Personal"];
      d.agenda = d.agenda || {};              // {"AAAA-MM-DD": [{id, hora, fin, titulo, nota}]}
      const guardar = () => store.set(d);

      // Si la app se quedó abierta de un día para otro, vuelve a "hoy"
      const hoyK = clave(hoy());
      if (!diaSel || diaSel > hoyK || diaSel < clave(sumar(hoy(), -6))) diaSel = hoyK;

      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // % cumplido desde una fecha hasta hoy (cada hábito cuenta solo desde que lo creaste)
      function porcentaje(desde, habitos) {
        let posibles = 0, hechos = 0;
        for (let f = new Date(desde); f <= hoy(); f = sumar(f, 1)) {
          const k = clave(f), marcados = d.registro[k] || [];
          habitos.forEach(h => {
            if (h.desde <= k) { posibles++; if (marcados.includes(h.id)) hechos++; }
          });
        }
        return posibles ? Math.round((hechos / posibles) * 100) : null;
      }
      function inicioPeriodo() {
        const h = hoy();
        return sumar(h, periodo === "mes" ? -29 : -6);   // últimos 7 o 30 días, hoy incluido
      }

      // Racha: días seguidos (hasta ayer, o hasta hoy si hoy ya está completo) con todos los hábitos hechos
      function racha() {
        let n = 0;
        const completo = k => { const act = d.habitos.filter(h => h.desde <= k); return act.length && act.every(h => (d.registro[k] || []).includes(h.id)); };
        let f = completo(hoyK) ? hoy() : sumar(hoy(), -1);
        while (completo(clave(f)) && n < 3650) { n++; f = sumar(f, -1); }
        return n;
      }
      // Racha de un hábito concreto
      const rachaDe = h => { let n = 0, f = (d.registro[hoyK] || []).includes(h.id) ? hoy() : sumar(hoy(), -1); while ((d.registro[clave(f)] || []).includes(h.id) && n < 3650) { n++; f = sumar(f, -1); } return n; };

      function pintarHabitos() {
        // Tira con los últimos 7 días: cada día es un anillo con lo que cumpliste
        let tira = "";
        for (let i = 6; i >= 0; i--) {
          const f = sumar(hoy(), -i), k = clave(f);
          const activos = d.habitos.filter(h => h.desde <= k);
          const n = activos.filter(h => (d.registro[k] || []).includes(h.id)).length;
          const p = activos.length ? Math.round(n / activos.length * 100) : 0;
          tira += `<button class="hb-dia ${k === diaSel ? "sel" : ""}" data-accion="dia" data-k="${k}" aria-label="${f.toLocaleDateString("es-ES", { weekday: "long", day: "numeric" })}: ${p}%">
            <span>${i === 0 ? "Hoy" : DIAS[f.getDay()]}</span><div class="r" style="--p:${p}"><b>${f.getDate()}</b></div></button>`;
        }

        const activos = d.habitos.filter(h => h.desde <= diaSel);
        const marcados = d.registro[diaSel] || [];
        const hechos = activos.filter(h => marcados.includes(h.id)).length;
        const esHoy = diaSel === hoyK;
        const pDia = activos.length ? hechos / activos.length : 0;
        const R = 52, C = 2 * Math.PI * R;
        const anillo = `<div class="hb-anillo"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="12"/>
          <circle cx="60" cy="60" r="${R}" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pDia)}" style="transition:stroke-dashoffset .5s"/></svg>
          <div class="c"><b>${hechos}/${activos.length}</b><span>${Math.round(pDia * 100)} %</span></div></div>`;
        const rc = racha();
        const fraseDia = !activos.length ? "Sin hábitos ese día" : hechos === activos.length ? "¡Día completo!" : esHoy ? (hechos ? "Vas por buen camino" : "Empieza el día") : "Ese día";
        const fechaTxt = aFecha(diaSel).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

        let tiles = activos.map(h => { const on = marcados.includes(h.id), r = rachaDe(h);
          return `<button class="hb-tile ${on ? "on" : ""}" data-accion="${editando ? "" : "marcar"}" data-id="${h.id}" aria-pressed="${on}" aria-label="Marcar ${esc(h.nombre)}">
            <span class="ck">${tick}</span><span class="nm">${esc(h.nombre)}</span>${r > 1 && !editando ? `<span class="rc">${r} días</span>` : ""}
            ${editando ? `<span class="hb-borrar" data-accion="borrar-habito" data-id="${h.id}" role="button" aria-label="Borrar">×</span>` : ""}</button>`; }).join("");
        let lista = activos.length ? `<div class="hb-tiles">${tiles}</div>` : "";
        if (!d.habitos.length) lista = `<p style="color:var(--tinta-suave);margin:0 2px 12px">Añade tu primer hábito: algo que quieras hacer cada día.</p>`;
        else if (!activos.length) lista = `<p style="color:var(--tinta-suave);margin:0 2px 12px">Aún no tenías hábitos ese día.</p>`;

        const pct = porcentaje(inicioPeriodo(), d.habitos);
        const ini = inicioPeriodo(), finP = hoy();
        const diasP = []; for (let f = new Date(ini); f <= finP; f = sumar(f, 1)) diasP.push(new Date(f));
        const pctDia = f => { const k = clave(f); if (f > hoy()) return null; const act = d.habitos.filter(h => h.desde <= k); if (!act.length) return null;
          return Math.round(act.filter(h => (d.registro[k] || []).includes(h.id)).length / act.length * 100); };
        const vals = diasP.map(pctDia);
        // Barras del % diario
        const W = 340, H = 140, pad = { t: 8, r: 4, b: 20, l: 30 }, n = diasP.length, paso = (W - pad.l - pad.r) / n;
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / 100;
        let svg = ""; [0, 50, 100].forEach(v => { svg += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v}%</text>`; });
        vals.forEach((v, i) => { const w = Math.max(paso * (n > 10 ? 0.62 : 0.5), 2), x = pad.l + i * paso + (paso - w) / 2;
          svg += `<rect x="${x}" y="${Y(v || 0) - (v ? 0 : 3)}" width="${w}" height="${v ? Y(0) - Y(v) : 3}" rx="${Math.min(w / 2, 6)}" fill="var(--naranja)" opacity="${v === null ? 0 : v ? (i === n - 1 ? 1 : .8) : .2}"/>`; });
        svg += diasP.map((f, i) => (n <= 7 || f.getDate() === 1 || f.getDate() % 5 === 0) ? `<text x="${pad.l + i * paso + paso / 2}" y="${H - 5}" text-anchor="middle">${n <= 7 ? DIAS[f.getDay()] : f.getDate()}</text>` : "").join("");
        const grafico = `<div class="hb-graf"><svg viewBox="0 0 ${W} ${H}">${svg}</svg></div>`;
        const mapa = `<div class="hb-mapa" style="grid-template-columns:minmax(70px, 30%) repeat(${n}, 1fr) 44px">
          ${d.habitos.map(h => `<div class="nom">${esc(h.nombre)}</div>${diasP.map(f => { const k = clave(f);
            if (f > hoy() || h.desde > k) return `<i class="no-aplica"></i>`;
            return `<i class="${(d.registro[k] || []).includes(h.id) ? "si" : ""}"></i>`; }).join("")}<div class="pc">${(p => p === null ? "–" : p + "%")(porcentaje(ini, [h]))}</div>`).join("")}
        </div>`;

        return `
          <div class="hb-hero">${anillo}<div>
            <h2>${fraseDia}</h2><p>${fechaTxt.charAt(0).toUpperCase() + fechaTxt.slice(1)}</p>
            <div class="chips"><span>Racha ${rc} ${rc === 1 ? "día" : "días"}</span>${pct !== null ? `<span>${pct}% en ${periodo === "semana" ? "7" : "30"} días</span>` : ""}</div></div></div>
          <div class="hb-dias">${tira}</div>
          <div class="hb-lista">
            <div class="hb-cab"><h2>${esHoy ? "Hoy" : "Ese día"}</h2>${d.habitos.length ? `<button class="hb-enlace" data-accion="editar">${editando ? "Listo" : "Editar"}</button>` : ""}</div>
            ${lista}
            ${editando || !d.habitos.length ? `
            <div class="hb-nuevo">
              <input id="hbNuevoHabito" placeholder="Nuevo hábito" maxlength="60" enterkeyhint="done">
              <button class="hb-mas" data-accion="nuevo-habito" aria-label="Añadir hábito">+</button>
            </div>` : ""}
          </div>
          ${d.habitos.length ? `
          <div class="bloque">
            <div class="hb-pct-top">
              <div><div class="etiqueta">Cumplimiento, últimos ${periodo === "semana" ? "7" : "30"} días</div>
                <div class="cifra">${pct === null ? "–" : pct + "%"}</div></div>
              <div class="hb-mini-seg">
                <button class="${periodo === "semana" ? "on" : ""}" data-accion="periodo" data-p="semana">7 días</button>
                <button class="${periodo === "mes" ? "on" : ""}" data-accion="periodo" data-p="mes">30 días</button>
              </div>
            </div>
            ${grafico + mapa}
          </div>` : ""}`;
      }

      function pintarTareas() {
        const opciones = d.categorias.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("") + `<option value="__nueva">+ Nueva…</option>`;
        const pendientes = d.tareas.filter(t => !t.hecha).length, total = d.tareas.length;
        const grupos = d.categorias.map(cat => {
          const ts = d.tareas.filter(t => t.cat === cat);
          if (!ts.length) return "";
          const pend = ts.filter(t => !t.hecha), ordenadas = pend.concat(ts.filter(t => t.hecha));
          const hechas = ts.length - pend.length;
          return `<div class="tk-cat">
            <div class="tk-cat-cab"><h3>${esc(cat)}</h3>${pend.length ? `<span class="n">${pend.length}</span>` : ""}
              ${hechas ? `<button class="hb-enlace" data-accion="limpiar" data-cat="${esc(cat)}">Quitar hechas</button>` : ""}</div>
            ${ordenadas.map(t => `
              <div class="hb-fila ${t.hecha ? "hecha" : ""}">
                <button class="hb-check ${t.hecha ? "on" : ""}" data-accion="tarea" data-id="${t.id}" aria-label="Completar">${tick}</button>
                <div class="txt">${esc(t.texto)}</div>
                <button class="hb-borrar" data-accion="borrar-tarea" data-id="${t.id}" aria-label="Borrar">×</button>
              </div>`).join("")}
          </div>`;
        }).join("");

        return `
          <div class="tk-hero"><div><b>${pendientes}</b><span>${pendientes === 1 ? "tarea pendiente" : pendientes ? "tareas pendientes" : "Nada pendiente"}</span></div>
            ${total ? `<div class="pr">${total - pendientes} de ${total}<br>hechas</div>` : ""}</div>
          ${total ? `<div class="tk-barra"><i style="width:${(total - pendientes) / total * 100}%"></i></div>` : ""}
          <div class="tk-nuevo">
            <div class="hb-nuevo">
              <input id="hbNuevaTarea" placeholder="Nueva tarea" maxlength="120" enterkeyhint="done">
              <select id="hbCat" aria-label="Categoría">${opciones}</select>
              <button class="hb-mas" data-accion="nueva-tarea" aria-label="Añadir tarea">+</button>
            </div>
          </div>
          <div class="tk-grupos">${grupos}</div>`;
      }

      // ---------- Agenda: planifica cualquier día con horas ----------
      function pintarAgenda() {
        const manana = clave(sumar(hoy(), 1));
        if (!agendaSel) agendaSel = manana;
        if (!agendaMes) agendaMes = agendaSel.slice(0, 7);
        const [y, m] = agendaMes.split("-").map(Number);
        const primero = new Date(y, m - 1, 1), diasMes = new Date(y, m, 0).getDate(), hueco = (primero.getDay() + 6) % 7;
        const mesTxt = primero.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        let celdas = ["L", "M", "X", "J", "V", "S", "D"].map(x => `<div class="l">${x}</div>`).join("") + "<div></div>".repeat(hueco);
        for (let i = 1; i <= diasMes; i++) {
          const k = agendaMes + "-" + String(i).padStart(2, "0");
          const c = [k < hoyK ? "pasado" : "", k === hoyK ? "hoy" : "", k === agendaSel ? "sel" : "", (d.agenda[k] || []).length ? "tiene" : ""].join(" ");
          celdas += `<button class="${c}" data-accion="ag-dia" data-k="${k}">${i}</button>`;
        }
        const evs = (d.agenda[agendaSel] || []).slice().sort((a, b) => a.hora.localeCompare(b.hora));
        const ahora = new Date(), horaAhora = String(ahora.getHours()).padStart(2, "0") + ":" + String(ahora.getMinutes()).padStart(2, "0");
        const fSel = aFecha(agendaSel), nombreDia = agendaSel === hoyK ? "Hoy" : agendaSel === manana ? "Mañana" : "";
        const largo = fSel.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
        // Tira con los próximos 14 días (desde hoy) para saltar rápido
        let tira = "";
        for (let i = 0; i < 14; i++) {
          const f = sumar(hoy(), i), k = clave(f);
          tira += `<button class="${k === agendaSel ? "sel" : ""} ${(d.agenda[k] || []).length ? "tiene" : ""}" data-accion="ag-dia" data-k="${k}"><span>${i === 0 ? "Hoy" : DIAS[f.getDay()]}</span><b>${f.getDate()}</b><i></i></button>`;
        }
        const lista = evs.map(e => {
          const pasado = agendaSel < hoyK || (agendaSel === hoyK && (e.fin || e.hora) < horaAhora);
          const enCurso = agendaSel === hoyK && e.hora <= horaAhora && (e.fin ? e.fin > horaAhora : false);
          return `<div class="ag-linea ${enCurso ? "ahora" : ""}"><div class="ag-hora">${e.hora}</div><button class="ag-ev ${pasado ? "pasado" : ""} ${enCurso ? "ahora" : ""}" data-accion="ag-editar" data-id="${e.id}"><b>${esc(e.titulo)}</b>
            <span>${enCurso ? "Ahora · " : ""}${e.hora}${e.fin ? " a " + e.fin : ""}${e.nota ? " · " + esc(e.nota) : ""}</span></button></div>`; }).join("");
        return `
          <div class="ag-tira">${tira}</div>
          <details class="bloque ag-cal-b"><summary>${mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1)}</summary>
            <div class="ag-mes"><button data-accion="ag-mes" data-n="-1" aria-label="Mes anterior">‹</button><b>${mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1)}</b><button data-accion="ag-mes" data-n="1" aria-label="Mes siguiente">›</button></div>
            <div class="ag-cal">${celdas}</div>
          </details>
          <div class="ag-dia-cab"><h3>${nombreDia || largo.charAt(0).toUpperCase() + largo.slice(1)}</h3><span class="etiqueta">${nombreDia ? largo + "<br>" : ""}${evs.length ? evs.length + (evs.length === 1 ? " plan" : " planes") : ""}</span></div>
          ${lista ? `<div class="ag-linea-t">${lista}</div>` : `<div class="ag-vacio">Nada planificado.<br>Añade lo que vas a hacer y a qué hora.</div>`}
          <button class="ag-anadir" data-accion="ag-nuevo">+ Añadir a este día</button>`;
      }
      function hojaAgenda(ev) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel hb-form" role="dialog"><h2>${ev ? "Editar" : "Nuevo plan"}</h2>
          <label>Qué</label><input id="agT" value="${ev ? esc(ev.titulo) : ""}" placeholder="Gimnasio, clase, estudiar…" maxlength="60">
          <div class="dos"><div><label>Empieza</label><input type="time" id="agH" value="${ev ? ev.hora : "09:00"}"></div>
            <div><label>Termina (opcional)</label><input type="time" id="agF" value="${ev && ev.fin ? ev.fin : ""}"></div></div>
          <label>Día</label><input type="date" id="agD" value="${agendaSel}">
          <label>Nota (opcional)</label><input id="agN" value="${ev && ev.nota ? esc(ev.nota) : ""}" maxlength="80">
          <div class="hb-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>
          ${ev ? `<button class="hb-peligro" data-h="b">Borrar</button>` : ""}</div>`;
        contenedor.appendChild(f);
        const $ = q => f.querySelector(q);
        const quitar = () => { Object.keys(d.agenda).forEach(k => { d.agenda[k] = d.agenda[k].filter(x => x !== ev); if (!d.agenda[k].length) delete d.agenda[k]; }); };
        f.addEventListener("click", e => {
          const h = e.target.dataset.h;
          if (e.target === f || h === "c") f.remove();
          if (h === "b") { quitar(); guardar(); f.remove(); pintar(); }
          if (h === "g") {
            const titulo = $("#agT").value.trim(); if (!titulo) { $("#agT").style.borderColor = "var(--rojo)"; $("#agT").focus(); return; }
            const hora = $("#agH").value || "09:00", fin = $("#agF").value && $("#agF").value > hora ? $("#agF").value : "", dia = $("#agD").value || agendaSel;
            if (ev) quitar();
            (d.agenda[dia] = d.agenda[dia] || []).push({ id: ev ? ev.id : nuevoId(), hora, fin, titulo, nota: $("#agN").value.trim() });
            agendaSel = dia; agendaMes = dia.slice(0, 7);
            guardar(); f.remove(); pintar();
          }
        });
        if (!ev) setTimeout(() => $("#agT").focus(), 50);
      }

      function pintar() {
        raiz.innerHTML = `
          <div class="hb-seg">
            <button class="${vista === "habitos" ? "on" : ""}" data-accion="vista" data-v="habitos">Hábitos</button>
            <button class="${vista === "tareas" ? "on" : ""}" data-accion="vista" data-v="tareas">Tareas</button>
            <button class="${vista === "agenda" ? "on" : ""}" data-accion="vista" data-v="agenda">Agenda</button>
          </div>
          ${vista === "habitos" ? pintarHabitos() : vista === "tareas" ? pintarTareas() : pintarAgenda()}`;
        const det = raiz.querySelector(".ag-cal-b"); if (det) { det.open = calAbierto || innerWidth >= 1024; det.addEventListener("toggle", () => calAbierto = det.open); }
        const sel = raiz.querySelector("#hbCat");
        if (sel && ultimaCat && d.categorias.includes(ultimaCat)) sel.value = ultimaCat;
      }

      function nuevoHabito() {
        const inp = raiz.querySelector("#hbNuevoHabito");
        const nombre = inp && inp.value.trim();
        if (!nombre) return;
        d.habitos.push({ id: nuevoId(), nombre, desde: hoyK });
        editando = true; // deja el campo abierto para añadir más
        guardar(); pintar();
        const otro = raiz.querySelector("#hbNuevoHabito"); if (otro) otro.focus();
      }
      function nuevaTarea() {
        const inp = raiz.querySelector("#hbNuevaTarea");
        const texto = inp && inp.value.trim();
        if (!texto) return;
        const cat = raiz.querySelector("#hbCat").value;
        if (cat === "__nueva") return;
        d.tareas.push({ id: nuevoId(), texto, cat, hecha: false });
        ultimaCat = cat;
        guardar(); pintar();
        raiz.querySelector("#hbNuevaTarea").focus();
      }

      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]");
        if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") { vista = b.dataset.v; editando = false; }
        else if (a === "dia") diaSel = b.dataset.k;
        else if (a === "periodo") periodo = b.dataset.p;
        else if (a === "ag-dia") agendaSel = b.dataset.k;
        else if (a === "ag-mes") { calAbierto = true; const [y, m] = agendaMes.split("-").map(Number); agendaMes = clave(new Date(y, m - 1 + Number(b.dataset.n), 1)).slice(0, 7); }
        else if (a === "ag-nuevo") return hojaAgenda(null);
        else if (a === "ag-editar") return hojaAgenda((d.agenda[agendaSel] || []).find(x => x.id === b.dataset.id));
        else if (a === "editar") editando = !editando;
        else if (a === "marcar") {
          const lista = d.registro[diaSel] || (d.registro[diaSel] = []);
          const i = lista.indexOf(b.dataset.id);
          if (i >= 0) lista.splice(i, 1); else lista.push(b.dataset.id);
          guardar();
        }
        else if (a === "borrar-habito") {
          const h = d.habitos.find(x => x.id === b.dataset.id);
          if (!confirm("¿Borrar el hábito \"" + h.nombre + "\"? También desaparecerá de las estadísticas.")) return;
          d.habitos = d.habitos.filter(x => x.id !== h.id); guardar();
        }
        else if (a === "nuevo-habito") return nuevoHabito();
        else if (a === "nueva-tarea") return nuevaTarea();
        else if (a === "tarea") { const t = d.tareas.find(x => x.id === b.dataset.id); t.hecha = !t.hecha; guardar(); }
        else if (a === "borrar-tarea") { d.tareas = d.tareas.filter(x => x.id !== b.dataset.id); guardar(); }
        else if (a === "limpiar") { d.tareas = d.tareas.filter(t => !(t.cat === b.dataset.cat && t.hecha)); guardar(); }
        pintar();
      });

      raiz.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        if (e.target.id === "hbNuevoHabito") nuevoHabito();
        if (e.target.id === "hbNuevaTarea") nuevaTarea();
      });

      raiz.addEventListener("change", e => {
        if (e.target.id !== "hbCat") return;
        if (e.target.value === "__nueva") {
          const nombre = (prompt("Nombre de la nueva categoría") || "").trim();
          if (nombre && !d.categorias.includes(nombre)) { d.categorias.push(nombre); guardar(); }
          ultimaCat = nombre || ultimaCat || d.categorias[0];
          const texto = raiz.querySelector("#hbNuevaTarea").value;
          pintar();
          raiz.querySelector("#hbNuevaTarea").value = texto;
        } else ultimaCat = e.target.value;
      });

      pintar();
    }
  });
})();
