/* PANTALLA: Estudio
   Cronómetro de estudio, registro de horas por día (también a mano), calendario con el total de cada día
   y de cada semana, y un resumen con medias diarias.
   Datos: { sesiones: [{id, fecha, min, materia}], crono: {inicio, acum, dia, materia} }
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .es-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:14px; }
  .es-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:13.5px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .es-seg button.on { background:var(--papel-2); color:var(--tinta); }

  /* Cronómetro */
  .es-crono { text-align:center; padding:26px 18px 22px; position:relative; overflow:hidden; }
  .es-crono::before { content:""; position:absolute; inset:-40% -20% auto; height:120%; background:radial-gradient(closest-side, var(--naranja-suave), transparent); opacity:0; transition:opacity .6s; pointer-events:none; }
  .es-crono.on::before { opacity:1; }
  .es-crono > * { position:relative; }
  .es-estado { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--tinta-suave); }
  .es-estado i { width:7px; height:7px; border-radius:50%; background:var(--tinta-tenue); }
  .es-crono.on .es-estado { color:var(--naranja); }
  .es-crono.on .es-estado i { background:var(--naranja); box-shadow:0 0 10px var(--naranja); animation:esLatido 1.6s ease-in-out infinite; }
  @keyframes esLatido { 50% { opacity:.35; } }
  .es-reloj { font-family:var(--mono); font-weight:500; font-size:clamp(52px, 17vw, 84px); letter-spacing:-0.06em; line-height:1; margin:16px 0 6px; color:var(--tinta); }
  .es-reloj .s { color:var(--tinta-tenue); }
  .es-crono.on .es-reloj .s { color:var(--tinta-suave); }
  .es-materia { max-width:280px; margin:10px auto 0; text-align:center; background:none; border:0; border-bottom:1px solid var(--linea-2); border-radius:0; padding:8px 4px; font-size:15px; }
  .es-materia:focus { border-color:var(--naranja); }
  .es-botones { display:flex; justify-content:center; gap:10px; margin-top:22px; }
  .es-botones .boton { min-width:132px; padding:14px 20px; border-radius:999px; font-size:15.5px; margin:0; }
  .es-descartar { background:none; border:0; color:var(--tinta-tenue); font:inherit; font-size:13px; margin-top:14px; cursor:pointer; padding:4px 8px; }
  .es-descartar:hover { color:var(--rojo); }

  .es-stats { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:8px; margin-bottom:12px; }
  .es-stats div { background:var(--papel); border:1px solid var(--linea); border-radius:14px; padding:13px 14px; min-width:0; }
  .es-stats span { display:block; font-size:12px; color:var(--tinta-suave); }
  .es-stats b { display:block; font-size:22px; font-weight:600; letter-spacing:-0.04em; margin-top:4px; white-space:nowrap; }
  .es-stats small { font-size:12px; color:var(--tinta-suave); font-weight:500; letter-spacing:0; margin-left:5px; }

  .es-fila { display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid var(--linea); }
  .es-fila:first-of-type { border-top:0; }
  .es-fila .izq { flex:1; min-width:0; }
  .es-fila .sub { font-size:12.5px; color:var(--tinta-suave); margin-top:2px; }
  .es-fila b { font-family:var(--mono); font-weight:500; font-size:15px; white-space:nowrap; }
  .es-x { background:none; border:0; color:var(--tinta-tenue); font-size:20px; line-height:1; padding:0 2px; cursor:pointer; }
  .es-x:hover { color:var(--rojo); }
  .es-anadir { width:100%; border:1.5px dashed var(--linea-2); background:none; color:var(--naranja); font:inherit; font-weight:600; font-size:15px; padding:14px; border-radius:14px; cursor:pointer; margin-top:4px; }

  /* Calendario */
  .es-mes { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .es-mes h2 { margin:0; font-size:19px; font-weight:600; letter-spacing:-0.035em; }
  .es-mes button { background:none; border:1px solid var(--linea-2); color:var(--tinta); width:36px; height:36px; border-radius:10px; font-size:18px; cursor:pointer; }
  .es-mes button:disabled { opacity:.3; cursor:default; }
  .es-cal { display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)) minmax(0, 1.15fr); gap:4px; }
  .es-cal .l { font-size:11px; color:var(--tinta-suave); text-align:center; padding-bottom:4px; letter-spacing:.04em; }
  .es-cal .l.sem { color:var(--naranja); }
  .es-dia { position:relative; aspect-ratio:1/1.08; border:0; border-radius:10px; background:var(--papel-2); color:var(--tinta); font:inherit; cursor:pointer; padding:5px 0 0; display:flex; flex-direction:column; align-items:center; justify-content:space-between; min-width:0; overflow:hidden; }
  .es-dia::before { content:""; position:absolute; inset:0; background:var(--naranja); opacity:var(--o, 0); border-radius:inherit; }
  .es-dia > * { position:relative; }
  .es-dia .n { font-size:12.5px; font-weight:500; }
  .es-dia .h { font-family:var(--mono); font-size:10.5px; padding-bottom:5px; color:var(--tinta-suave); white-space:nowrap; }
  .es-dia.fuerte .n, .es-dia.fuerte .h { color:var(--sobre-acento); font-weight:600; }
  .es-dia.fuera { visibility:hidden; }
  .es-dia.futuro { background:none; box-shadow:inset 0 0 0 1px var(--linea); color:var(--tinta-tenue); cursor:default; }
  .es-dia.hoy { box-shadow:inset 0 0 0 1.5px var(--tinta); }
  .es-dia.sel { outline:2px solid var(--naranja); outline-offset:1px; }
  .es-semana { display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:10px; box-shadow:inset 0 0 0 1px var(--linea); min-width:0; }
  .es-semana b { font-family:var(--mono); font-size:12px; font-weight:600; color:var(--tinta); }
  .es-semana span { font-size:9.5px; color:var(--tinta-suave); margin-top:2px; white-space:nowrap; }
  .es-ley { display:flex; align-items:center; gap:6px; margin-top:12px; font-size:11.5px; color:var(--tinta-suave); }
  .es-ley i { width:12px; height:12px; border-radius:3px; background:var(--naranja); }

  /* Resumen */
  .es-graf svg { display:block; width:100%; height:auto; margin-top:10px; overflow:visible; }
  .es-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }
  .es-mat { margin-top:12px; }
  .es-mat .n { display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:6px; }
  .es-mat .n span:last-child { font-family:var(--mono); color:var(--tinta-suave); font-size:12.5px; }
  .es-mat .b { height:6px; border-radius:3px; background:var(--papel-2); overflow:hidden; }
  .es-mat .b i { display:block; height:100%; border-radius:3px; background:var(--naranja); }
  .es-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .es-form .dos { display:flex; gap:10px; }
  .es-form .dos > div { flex:1; min-width:0; }
  .es-form .acc { display:flex; gap:8px; margin-top:20px; }
  .es-form .acc .boton { flex:1; margin:0; }
  .es-rapidos { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
  .es-rapidos button { border:1px solid var(--linea-2); background:none; color:var(--tinta); font:inherit; font-size:13px; padding:7px 12px; border-radius:999px; cursor:pointer; }

  @media (min-width:700px) { .es-stats { grid-template-columns:repeat(4, minmax(0, 1fr)); } }
  @media (min-width:1024px) {
    body[data-pantalla="estudio"] main > div:has(> .es-crono) { grid-template-columns:minmax(0, 1.25fr) minmax(0, 1fr); }
    body[data-pantalla="estudio"] main > div > .es-crono { grid-column:1; grid-row:2 / span 2; padding:56px 28px 44px; display:flex; flex-direction:column; justify-content:center; min-height:420px; }
    body[data-pantalla="estudio"] main > div > .es-crono .es-reloj { font-size:104px; }
    body[data-pantalla="estudio"] main > div:has(> .es-crono) > .es-stats { grid-column:2; grid-template-columns:repeat(2, minmax(0, 1fr)); margin:0; }
    body[data-pantalla="estudio"] main > div:has(> .es-crono) > .es-hoy { grid-column:2; }
    body[data-pantalla="estudio"] main > div:has(> .es-cal-b) { grid-template-columns:minmax(0, 1.5fr) minmax(0, 1fr); }
    body[data-pantalla="estudio"] main > div > .es-cal-b { grid-column:1; grid-row:2 / span 3; }
    body[data-pantalla="estudio"] main > div:has(> .es-cal-b) > :not(.es-seg):not(.es-cal-b) { grid-column:2; }
    body[data-pantalla="estudio"] main > div:has(> .es-cal-b) > .es-stats { grid-template-columns:repeat(2, minmax(0, 1fr)); margin:0; }
    body[data-pantalla="estudio"] .es-dia .n { font-size:14px; }
    body[data-pantalla="estudio"] .es-dia .h { font-size:12px; }
    body[data-pantalla="estudio"] main > div:has(> .es-graf-b) > .bloque { grid-column:auto; }
    body[data-pantalla="estudio"] main > div:has(> .es-graf-b) > .es-graf-b.ancho { grid-column:1 / -1; }
  }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const hoyK = () => clave(new Date());
  const sumarK = (k, n) => { const x = aFecha(k); x.setDate(x.getDate() + n); return clave(x); };
  const lunesDe = k => sumarK(k, -((aFecha(k).getDay() + 6) % 7));
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const fechaLarga = k => { const s = aFecha(k).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }); return s.charAt(0).toUpperCase() + s.slice(1); };
  const fCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  // Duraciones (en minutos)
  const fDur = m => { m = Math.round(m || 0); const h = Math.floor(m / 60), r = m % 60; return h ? h + " h" + (r ? " " + r + " min" : "") : r + " min"; };
  const fDurC = m => { m = Math.round(m || 0); const h = Math.floor(m / 60), r = m % 60; return h ? h + "h" + (r ? String(r).padStart(2, "0") : "") : r + "m"; };   // corta: 2h15, 45m
  const fH = m => (Math.round((m || 0) / 6) / 10).toLocaleString("es-ES", { maximumFractionDigits: 1 });   // horas con un decimal
  const reloj = ms => { const s = Math.floor(Math.max(0, ms) / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return `${h}:${String(m).padStart(2, "0")}<span class="s">:${String(s % 60).padStart(2, "0")}</span>`; };

  // Cálculos compartidos (también los usa Vida)
  const Est = {
    porDia(d) { const t = {}; (d.sesiones || []).forEach(s => { t[s.fecha] = (t[s.fecha] || 0) + s.min; }); return t; },
    transcurrido(c) { return c ? (c.acum || 0) + (c.inicio ? Date.now() - c.inicio : 0) : 0; },
    rango(t, desde, hasta) { let s = 0; for (let k = desde; k <= hasta; k = sumarK(k, 1)) s += t[k] || 0; return s; },
    racha(t, hoy) { let n = 0; for (let k = t[hoy] ? hoy : sumarK(hoy, -1); t[k]; k = sumarK(k, -1)) n++; return n; },
    fDur, fDurC, fH, lunesDe, reloj
  };
  window.Estudio = Est;

  let vista = "hoy", mesCal = null, diaSel = null, tic = null;

  HiperApp.registrar({
    id: "estudio",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5 12 2l9.5 4.5L12 11z"/><path d="M6 8.6V14c0 1.7 2.7 3.5 6 3.5s6-1.8 6-3.5V8.6"/><path d="M21.5 6.5v6"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.sesiones = d.sesiones || [];
      d.crono = d.crono || null;
      const guardar = () => store.set(d);
      const hoy = hoyK();
      if (!mesCal) mesCal = hoy.slice(0, 7);
      if (!diaSel || diaSel > hoy) diaSel = hoy;

      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);
      const materias = () => [...new Set(d.sesiones.map(s => s.materia).filter(Boolean))];
      const totalDia = k => d.sesiones.filter(s => s.fecha === k).reduce((a, s) => a + s.min, 0);

      // ---------- Vista: hoy (cronómetro) ----------
      function vistaHoy() {
        const c = d.crono, on = !!(c && c.inicio), hay = !!c;
        const t = Est.porDia(d), lun = lunesDe(hoy), diasSemana = ((aFecha(hoy).getDay() + 6) % 7) + 1;
        const semana = Est.rango(t, lun, hoy), media7 = Est.rango(t, sumarK(hoy, -6), hoy) / 7, racha = Est.racha(t, hoy);
        const ses = d.sesiones.filter(s => s.fecha === hoy).sort((a, b) => (b.creado || 0) - (a.creado || 0));
        return `
          <div class="bloque es-crono ${on ? "on" : ""}">
            <div class="es-estado"><i></i>${on ? "Estudiando" : hay ? "En pausa" : "Cronómetro"}</div>
            <div class="es-reloj" id="esReloj">${reloj(Est.transcurrido(c))}</div>
            <input class="es-materia" id="esMateria" list="esMats" placeholder="¿Qué estudias? (opcional)" value="${esc(c ? c.materia || "" : "")}" maxlength="40" enterkeyhint="done">
            <datalist id="esMats">${materias().map(m => `<option value="${esc(m)}">`).join("")}</datalist>
            <div class="es-botones">
              ${on ? `<button class="boton secundario" data-accion="pausar">Pausar</button>` : `<button class="boton ${hay ? "secundario" : ""}" data-accion="empezar">${hay ? "Seguir" : "Empezar"}</button>`}
              ${hay ? `<button class="boton" data-accion="terminar">Terminar y guardar</button>` : ""}
            </div>
            ${hay ? `<button class="es-descartar" data-accion="descartar">Descartar este tiempo</button>` : ""}
          </div>
          <div class="es-stats">
            <div><span>Hoy</span><b>${fDur(totalDia(hoy))}</b></div>
            <div><span>Esta semana</span><b>${fDur(semana)}</b></div>
            <div><span>Media diaria · semana</span><b>${fDur(semana / diasSemana)}</b></div>
            <div><span>Racha</span><b>${racha}<small>${racha === 1 ? "día" : "días"}</small></b></div>
          </div>
          <div class="bloque es-hoy"><h2>Hoy</h2>
            ${ses.length ? ses.map(filaSesion).join("") : `<p style="margin:4px 0 6px">Aún no has estudiado hoy. Usa el cronómetro o apunta el tiempo a mano.</p>`}
            <button class="es-anadir" data-accion="manual" data-k="${hoy}">Añadir tiempo a mano</button>
          </div>`;
      }
      const filaSesion = s => `<div class="es-fila"><div class="izq"><div>${esc(s.materia || "Estudio")}</div>${s.desde ? `<div class="sub">${s.desde}${s.hasta ? " – " + s.hasta : ""}</div>` : `<div class="sub">Apuntado a mano</div>`}</div>
        <b>${fDur(s.min)}</b><button class="es-x" data-accion="borrar" data-id="${s.id}" aria-label="Borrar">×</button></div>`;

      // ---------- Vista: calendario ----------
      function vistaCalendario() {
        const t = Est.porDia(d);
        const [y, m] = mesCal.split("-").map(Number);
        const primero = new Date(y, m - 1, 1), ultimo = new Date(y, m, 0);
        const ini = lunesDe(clave(primero));
        const max = Math.max(240, ...Object.values(t));   // la intensidad llega al máximo con 4 h (o tu mejor día)
        let celdas = ["L", "M", "X", "J", "V", "S", "D"].map(l => `<div class="l">${l}</div>`).join("") + `<div class="l sem">Semana</div>`;
        for (let k = ini; k <= clave(ultimo); k = sumarK(k, 7)) {
          for (let i = 0; i < 7; i++) {
            const dk = sumarK(k, i), fuera = dk.slice(0, 7) !== mesCal, fut = dk > hoy, v = t[dk] || 0;
            const o = v ? 0.18 + 0.82 * Math.min(v / max, 1) : 0;
            celdas += `<button class="es-dia ${fuera ? "fuera" : ""} ${fut ? "futuro" : ""} ${dk === hoy ? "hoy" : ""} ${dk === diaSel ? "sel" : ""} ${o > 0.55 ? "fuerte" : ""}" style="--o:${o.toFixed(2)}" ${fut || fuera ? "disabled" : ""} data-accion="dia" data-k="${dk}">
              <span class="n">${+dk.slice(8)}</span><span class="h">${v ? fDurC(v) : ""}</span></button>`;
          }
          const fin = sumarK(k, 6), sem = Est.rango(t, k, fin > hoy ? hoy : fin), dias = Math.max(1, Math.min(7, Math.round((aFecha(fin > hoy ? hoy : fin) - aFecha(k)) / 864e5) + 1));
          celdas += k > hoy ? `<div class="es-semana"></div>` : `<div class="es-semana"><b>${sem ? fDurC(sem) : "–"}</b><span>${sem ? fDurC(sem / dias) + "/día" : ""}</span></div>`;
        }
        const finMes = clave(ultimo) > hoy ? hoy : clave(ultimo), diasMes = mesCal > hoy.slice(0, 7) ? 0 : +finMes.slice(8);
        const totalMes = Est.rango(t, clave(primero), finMes);
        const estudiados = Object.keys(t).filter(k => k.startsWith(mesCal) && t[k] > 0).length;
        const mejor = Object.keys(t).filter(k => k.startsWith(mesCal)).sort((a, b) => t[b] - t[a])[0];
        const ses = d.sesiones.filter(s => s.fecha === diaSel);
        return `
          <div class="bloque es-cal-b">
            <div class="es-mes"><button data-accion="mes" data-n="-1" aria-label="Mes anterior">‹</button><h2>${MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1)} ${y}</h2><button data-accion="mes" data-n="1" aria-label="Mes siguiente" ${mesCal >= hoy.slice(0, 7) ? "disabled" : ""}>›</button></div>
            <div class="es-cal">${celdas}</div>
            <div class="es-ley"><i style="opacity:.25"></i><i style="opacity:.6"></i><i></i><span>Más color, más horas</span></div>
          </div>
          <div class="es-stats">
            <div><span>Total del mes</span><b>${fDur(totalMes)}</b></div>
            <div><span>Media diaria</span><b>${fDur(diasMes ? totalMes / diasMes : 0)}</b></div>
            <div><span>Días estudiados</span><b>${estudiados}<small>de ${diasMes}</small></b></div>
            <div><span>Mejor día</span><b>${mejor && t[mejor] ? fDurC(t[mejor]) : "–"}${mejor && t[mejor] ? `<small>${fCorta(mejor)}</small>` : ""}</b></div>
          </div>
          <div class="bloque"><h2>${diaSel === hoy ? "Hoy" : fechaLarga(diaSel)}</h2>
            ${ses.length ? ses.map(filaSesion).join("") + `<div class="es-fila"><div class="izq etiqueta">Total</div><b>${fDur(totalDia(diaSel))}</b><span style="width:22px"></span></div>` : `<p style="margin:4px 0 6px">Sin estudio apuntado este día.</p>`}
            <button class="es-anadir" data-accion="manual" data-k="${diaSel}">Añadir tiempo a este día</button>
          </div>`;
      }

      // ---------- Vista: resumen ----------
      function barras(vals, etiquetas, alto = 150, media) {
        const W = 340, pad = { t: 12, r: 4, b: 20, l: 30 }, max = Math.max(...vals, media || 0, 60) * 1.12;
        const paso = max / 60 > 12 ? 300 : max / 60 > 6 ? 120 : 60;   // líneas cada 1, 2 o 5 horas
        const ancho = (W - pad.l - pad.r) / vals.length, Y = v => alto - pad.b - (alto - pad.t - pad.b) * v / max;
        let g = "";
        for (let v = 0; v <= max; v += paso) g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v / 60}h</text>`;
        vals.forEach((v, i) => {
          const w = Math.max(ancho * 0.6, 2), x = pad.l + i * ancho + (ancho - w) / 2;
          g += `<rect x="${x}" y="${Y(v)}" width="${w}" height="${Math.max(Y(0) - Y(v), v ? 2 : 0)}" rx="${Math.min(w / 2, 4)}" fill="var(--naranja)" opacity="${i === vals.length - 1 ? 1 : .72}"/>`;
          if (etiquetas[i]) g += `<text x="${x + w / 2}" y="${alto - 5}" text-anchor="middle">${etiquetas[i]}</text>`;
        });
        if (media) g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(media)}" y2="${Y(media)}" stroke="var(--tinta)" stroke-dasharray="3 3" opacity=".55"/>`;
        return `<svg viewBox="0 0 ${W} ${alto}" role="img">${g}</svg>`;
      }
      function vistaResumen() {
        const t = Est.porDia(d);
        if (!d.sesiones.length) return `<div class="bloque vacio"><h2>Aún no hay horas</h2><p>Cuando estudies con el cronómetro o apuntes horas a mano, aquí verás tus semanas y tus medias.</p><button class="boton" data-accion="vista" data-v="hoy" style="margin-top:14px">Ir al cronómetro</button></div>`;
        const m7 = Est.rango(t, sumarK(hoy, -6), hoy) / 7, m30 = Est.rango(t, sumarK(hoy, -29), hoy) / 30;
        const anio = hoy.slice(0, 4), totalAnio = Est.rango(t, anio + "-01-01", hoy);
        const total = d.sesiones.reduce((a, s) => a + s.min, 0);
        // Últimas 12 semanas
        const lun = lunesDe(hoy), sems = []; for (let i = 11; i >= 0; i--) sems.push(sumarK(lun, -7 * i));
        const vSem = sems.map(k => Est.rango(t, k, sumarK(k, 6) > hoy ? hoy : sumarK(k, 6)));
        const mediaSem = vSem.slice(0, -1).filter(Boolean).length ? vSem.slice(0, -1).reduce((a, b) => a + b, 0) / vSem.slice(0, -1).length : 0;
        // Últimos 14 días
        const dias = []; for (let i = 13; i >= 0; i--) dias.push(sumarK(hoy, -i));
        const L = ["D", "L", "M", "X", "J", "V", "S"];
        // Por materia (30 días)
        const pm = {}; d.sesiones.filter(s => s.fecha > sumarK(hoy, -30)).forEach(s => { const n = s.materia || "Sin materia"; pm[n] = (pm[n] || 0) + s.min; });
        const mats = Object.entries(pm).sort((a, b) => b[1] - a[1]), maxM = mats.length ? mats[0][1] : 1;
        return `
          <div class="es-stats">
            <div><span>Media diaria · 7 días</span><b>${fDur(m7)}</b></div>
            <div><span>Media diaria · 30 días</span><b>${fDur(m30)}</b></div>
            <div><span>Este año</span><b>${fH(totalAnio)}<small>h</small></b></div>
            <div><span>Desde el principio</span><b>${fH(total)}<small>h</small></b></div>
          </div>
          <div class="bloque es-graf-b ancho es-graf"><h2>Horas por semana</h2><p style="margin:0">Últimas 12 semanas${mediaSem ? ` · la línea es tu media semanal (${fDur(mediaSem)})` : ""}.</p>
            ${barras(vSem, sems.map((k, i) => i % 2 === 1 || i === 11 ? fCorta(k).replace(/ .*/, "") + "/" + (aFecha(k).getMonth() + 1) : ""), 170, mediaSem)}</div>
          <div class="bloque es-graf-b es-graf"><h2>Últimos 14 días</h2><p style="margin:0">La línea es tu media diaria de esos días (${fDur(Est.rango(t, dias[0], hoy) / 14)}).</p>
            ${barras(dias.map(k => t[k] || 0), dias.map(k => L[aFecha(k).getDay()]), 150, Est.rango(t, dias[0], hoy) / 14)}</div>
          <div class="bloque es-graf-b"><h2>Por materia</h2><p style="margin:0">Últimos 30 días.</p>
            ${mats.map(([n, v]) => `<div class="es-mat"><div class="n"><span>${esc(n)}</span><span>${fDur(v)}</span></div><div class="b"><i style="width:${v / maxM * 100}%"></i></div></div>`).join("") || `<p style="margin-top:10px">Nada en los últimos 30 días.</p>`}
          </div>`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="es-seg">${[["hoy", "Cronómetro"], ["calendario", "Calendario"], ["resumen", "Resumen"]].map(([id, n]) =>
          `<button class="${vista === id ? "on" : ""}" data-accion="vista" data-v="${id}">${n}</button>`).join("")}</div>
          ${{ hoy: vistaHoy, calendario: vistaCalendario, resumen: vistaResumen }[vista]()}`;
        // El reloj se actualiza cada segundo mientras esta pantalla esté abierta
        clearInterval(tic);
        if (vista === "hoy" && d.crono && d.crono.inicio) tic = setInterval(() => {
          const el = document.getElementById("esReloj");
          if (!el || !raiz.isConnected) return clearInterval(tic);
          el.innerHTML = reloj(Est.transcurrido(d.crono));
        }, 1000);
      }

      // ---------- Formulario: añadir a mano ----------
      function hojaManual(k) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel es-form" role="dialog" aria-label="Añadir tiempo"><h2>Añadir tiempo</h2>
          <label>Día</label><input type="date" id="esF" value="${k}" max="${hoy}">
          <div class="dos"><div><label>Horas</label><input id="esH" inputmode="numeric" placeholder="0" maxlength="2"></div>
            <div><label>Minutos</label><input id="esM" inputmode="numeric" placeholder="0" maxlength="3"></div></div>
          <div class="es-rapidos">${[30, 60, 90, 120, 180, 240].map(m => `<button data-min="${m}">${fDur(m)}</button>`).join("")}</div>
          <label>Materia (opcional)</label><input id="esMat" list="esMats2" maxlength="40" placeholder="Contabilidad, inglés…"><datalist id="esMats2">${materias().map(m => `<option value="${esc(m)}">`).join("")}</datalist>
          <div class="acc"><button class="boton secundario" data-h="cancelar">Cancelar</button><button class="boton" data-h="guardar">Guardar</button></div></div>`;
        raiz.appendChild(f);
        f.addEventListener("click", e => {
          const r = e.target.closest("[data-min]");
          if (r) { const m = +r.dataset.min; f.querySelector("#esH").value = Math.floor(m / 60) || ""; f.querySelector("#esM").value = m % 60 || ""; return; }
          if (e.target === f || e.target.dataset.h === "cancelar") return f.remove();
          if (e.target.dataset.h === "guardar") {
            const min = (parseInt(f.querySelector("#esH").value) || 0) * 60 + (parseInt(f.querySelector("#esM").value) || 0);
            if (min <= 0 || min > 24 * 60) { f.querySelector("#esH").style.borderColor = "var(--rojo)"; f.querySelector("#esM").style.borderColor = "var(--rojo)"; return; }
            const fecha = f.querySelector("#esF").value || k;
            d.sesiones.push({ id: nuevoId(), creado: Date.now(), fecha: fecha > hoy ? hoy : fecha, min, materia: f.querySelector("#esMat").value.trim() });
            f.remove(); guardar(); pintar();
          }
        });
        setTimeout(() => f.querySelector("#esH").focus(), 60);
      }

      // ---------- Eventos ----------
      const hora = ms => new Date(ms).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      raiz.addEventListener("change", e => {
        if (e.target.id === "esMateria" && d.crono) { d.crono.materia = e.target.value.trim(); guardar(); }
      });
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion, ahora = Date.now();
        const mat = () => { const i = raiz.querySelector("#esMateria"); return i ? i.value.trim() : ""; };
        if (a === "vista") vista = b.dataset.v;
        else if (a === "empezar") {
          if (!d.crono) d.crono = { inicio: ahora, acum: 0, dia: hoy, desde: ahora, materia: mat() };
          else { d.crono.inicio = ahora; d.crono.materia = mat() || d.crono.materia; }
          guardar();
        }
        else if (a === "pausar") { if (d.crono && d.crono.inicio) { d.crono.acum += ahora - d.crono.inicio; d.crono.inicio = null; d.crono.materia = mat(); guardar(); } }
        else if (a === "terminar") {
          const c = d.crono, min = Math.round(Est.transcurrido(c) / 60000);
          if (min < 1 && !confirm("Llevas menos de un minuto. ¿Terminar sin guardar?")) return;
          if (min >= 1) d.sesiones.push({ id: nuevoId(), creado: ahora, fecha: c.dia || hoy, min, materia: mat() || c.materia || "", desde: hora(c.desde || ahora - min * 60000), hasta: hora(ahora) });
          d.crono = null; guardar();
        }
        else if (a === "descartar") { if (!confirm("¿Descartar el tiempo del cronómetro sin guardarlo?")) return; d.crono = null; guardar(); }
        else if (a === "manual") return hojaManual(b.dataset.k || hoy);
        else if (a === "borrar") { if (!confirm("¿Borrar este tiempo?")) return; d.sesiones = d.sesiones.filter(s => s.id !== b.dataset.id); guardar(); }
        else if (a === "mes") { const [y, m] = mesCal.split("-").map(Number); mesCal = clave(new Date(y, m - 1 + +b.dataset.n, 1)).slice(0, 7); }
        else if (a === "dia") diaSel = b.dataset.k;
        pintar();
      });

      pintar();
    }
  });
})();
