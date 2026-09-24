/* PESTAÑA: Gimnasio y deporte
   Rutina semanal, registro de series con referencia de la última vez, calendario con volumen y pádel.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .gy-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:14px; }
  .gy-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:13.5px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .gy-seg button.on { background:var(--papel-2); color:var(--tinta); }
  .gy-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .gy-nav button { background:var(--papel); border:0; color:var(--tinta); width:40px; height:40px; border-radius:12px; font-size:20px; cursor:pointer; }
  .gy-nav button:disabled { opacity:.3; }
  .gy-nav h2 { margin:0; font-family:var(--titulos); font-weight:400; font-size:28px; }

  .gy-cab { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .gy-cab h2 { margin:0; }
  .gy-sub { font-size:13.5px; color:var(--tinta-suave); margin-top:3px; line-height:1.45; }
  .gy-cambiar { margin-top:12px; }
  .gy-vol { display:flex; justify-content:space-between; align-items:baseline; }
  .gy-vol b { font-size:26px; letter-spacing:-.02em; }

  .gy-ej h2 { font-size:23px; }
  .gy-ref { font-size:13px; color:var(--tinta-suave); margin:4px 0 10px; line-height:1.45; }
  .gy-ref b { color:var(--naranja); font-weight:600; }
  .gy-serie { display:grid; grid-template-columns:28px 1fr 1fr 44px; gap:8px; align-items:center; margin-top:8px; }
  .gy-serie span { font-size:13px; color:var(--tinta-suave); text-align:center; }
  .gy-serie input { text-align:center; padding:10px 6px; }
  .gy-serie input::placeholder { color:#5E6366; }
  .gy-ok { height:42px; border-radius:10px; border:0; background:var(--papel-2); color:var(--tinta-suave); cursor:pointer; display:grid; place-items:center; padding:0; }
  .gy-ok svg { width:18px; height:18px; }
  .gy-serie.hecha .gy-ok { background:var(--naranja); color:#1A1411; }
  .gy-serie.hecha input { background:var(--naranja-suave); }
  .gy-etq { display:grid; grid-template-columns:28px 1fr 1fr 44px; gap:8px; font-size:12px; color:var(--tinta-suave); text-align:center; margin-top:4px; }
  .gy-btns { display:flex; gap:8px; margin-top:12px; }
  .gy-btns button { flex:1; border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:14px; font-weight:600; padding:10px 0; border-radius:10px; cursor:pointer; }
  .gy-x { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:0 2px; cursor:pointer; }
  .gy-anadir { width:100%; border:1.5px dashed var(--linea); background:none; color:var(--naranja); font:inherit; font-weight:600; font-size:15px; padding:14px; border-radius:14px; cursor:pointer; margin-bottom:12px; }

  .gy-cal { display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; }
  .gy-cal .l { font-size:12px; color:var(--tinta-suave); padding-bottom:6px; }
  .gy-cal button { aspect-ratio:1; border:0; background:none; color:var(--tinta); font:inherit; font-size:14px; border-radius:50%; cursor:pointer; position:relative; padding:0; }
  .gy-cal button.gym { background:var(--naranja); color:#1A1411; font-weight:700; }
  .gy-cal button.padel::after { content:""; position:absolute; bottom:3px; left:50%; width:5px; height:5px; margin-left:-2.5px; border-radius:50%; background:var(--naranja); }
  .gy-cal button.gym.padel::after { background:#1A1411; }
  .gy-cal button.hoy { box-shadow: inset 0 0 0 1.5px var(--tinta-suave); }
  .gy-cal button.sel { box-shadow: inset 0 0 0 2px var(--tinta); }
  .gy-cal button:disabled { color:#4A4E52; cursor:default; }
  .gy-ley { display:flex; gap:16px; font-size:12.5px; color:var(--tinta-suave); margin-top:12px; }
  .gy-ley span { display:inline-flex; align-items:center; gap:6px; }
  .gy-ley i { width:10px; height:10px; border-radius:50%; background:var(--naranja); display:inline-block; }
  .gy-ley i.p { width:5px; height:5px; }
  .gy-stats { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:12px; }
  .gy-stats div { background:var(--papel); border-radius:14px; padding:12px; }
  .gy-stats b { display:block; font-size:20px; margin-top:3px; }
  .gy-graf svg { width:100%; height:auto; display:block; margin-top:10px; }
  .gy-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }

  .gy-fila { display:flex; align-items:center; gap:12px; padding:13px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .gy-fila .izq { flex:1; min-width:0; }
  .gy-fila .sub { font-size:13px; color:var(--tinta-suave); margin-top:2px; }
  .gy-fila .der { font-weight:600; white-space:nowrap; }
  .gy-desc { color:var(--tinta-suave); }

  .gy-marcador { display:flex; justify-content:space-around; text-align:center; }
  .gy-marcador b { display:block; font-size:30px; letter-spacing:-.02em; }
  .gy-marcador span { font-size:12.5px; color:var(--tinta-suave); }
  .gy-marcador .g b { color:var(--naranja); }
  .gy-res { font-size:12px; font-weight:700; padding:4px 9px; border-radius:20px; }
  .gy-res.V { background:var(--naranja); color:#1A1411; }
  .gy-res.E { background:var(--papel-2); color:var(--tinta); }
  .gy-res.D { background:rgba(229,119,107,.16); color:#E5776B; }
  .gy-tabla { width:100%; border-collapse:collapse; font-size:14px; margin-top:6px; }
  .gy-tabla th { font-weight:600; font-size:12px; color:var(--tinta-suave); text-align:right; padding:6px 0 6px 8px; }
  .gy-tabla th:first-child, .gy-tabla td:first-child { text-align:left; padding-left:0; }
  .gy-tabla td { text-align:right; padding:9px 0 9px 8px; border-top:1px solid var(--linea); }

  .gy-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .gy-form .dos { display:flex; gap:10px; }
  .gy-form .dos > div { flex:1; min-width:0; }
  .gy-sets { display:grid; grid-template-columns:auto 1fr 18px 1fr; gap:8px; align-items:center; }
  .gy-sets span { font-size:13px; color:var(--tinta-suave); text-align:center; }
  .gy-sets input { text-align:center; font-size:20px; font-weight:700; }
  .gy-acciones { display:flex; gap:8px; margin-top:20px; }
  .gy-acciones .boton { flex:1; margin:0; }
  .gy-lista-ej .gy-fila { cursor:default; padding:10px 0; }
  .gy-mover { background:var(--papel-2); border:0; color:var(--tinta-suave); width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:14px; }
  .gy-peligro { background:none; border:0; color:#E5776B; font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Utilidades ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = s => { s = String(s == null ? "" : s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const fN = (n, dec = 1) => (Math.round((n || 0) * 10 ** dec) / 10 ** dec).toLocaleString("es-ES", { maximumFractionDigits: dec, useGrouping: "always" });
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const hoyK = () => clave(new Date());
  const sumarK = (k, n) => { const x = aFecha(k); x.setDate(x.getDate() + n); return clave(x); };
  const fechaCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const fechaLarga = k => { const s = aFecha(k).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }); return s.charAt(0).toUpperCase() + s.slice(1); };
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const diaSemana = k => (aFecha(k).getDay() + 6) % 7; // 0 = lunes
  const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  let vista = "entreno", diaSel = null, mesCal = null, calSel = null, planElegido = {};

  HiperApp.registrar({
    id: "gimnasio",
    titulo: "Deporte",
    nombreCorto: "Deporte",
    color: "#F2884B",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.rutina = d.rutina || {};        // {0..6: {nombre, ejercicios:[idEjercicio]}}
      d.ejercicios = d.ejercicios || {}; // {id: {nombre}}
      d.sesiones = d.sesiones || {};    // {"AAAA-MM-DD": {plan, nombre, ejercicios:[{ex, series:[{kg, reps, hecho}]}]}}
      d.partidos = d.partidos || [];    // [{id, fecha, companero, sets:[[nos, ellos]]}]
      const guardar = () => store.set(d);
      const hoy = hoyK();
      if (!diaSel || diaSel > hoy) diaSel = hoy;
      if (!mesCal) mesCal = hoy.slice(0, 7);

      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Datos derivados ----------
      const serieValida = s => num(s.reps) > 0;
      const volumenSesion = s => (s ? s.ejercicios : []).reduce((t, e) => t + e.series.filter(serieValida).reduce((a, x) => a + (num(x.kg) || 0) * num(x.reps), 0), 0);
      const seriesSesion = s => (s ? s.ejercicios : []).reduce((t, e) => t + e.series.filter(serieValida).length, 0);
      const fueAlGym = k => seriesSesion(d.sesiones[k]) > 0;
      const idEjercicio = nombre => {
        const n = norm(nombre); const ya = Object.entries(d.ejercicios).find(([, e]) => norm(e.nombre) === n);
        if (ya) return ya[0];
        const id = nuevoId(); d.ejercicios[id] = { nombre: nombre.trim() }; return id;
      };
      const nombreEj = id => (d.ejercicios[id] || { nombre: "Ejercicio" }).nombre;
      function ultimaVez(ex, antesDe) {
        const ks = Object.keys(d.sesiones).filter(k => k < antesDe).sort().reverse();
        for (const k of ks) { const e = d.sesiones[k].ejercicios.find(x => x.ex === ex); if (e && e.series.some(serieValida)) return { k, series: e.series.filter(serieValida) }; }
        return null;
      }
      function resultado(p) {
        let g = 0, pe = 0; p.sets.forEach(([a, b]) => { if (a > b) g++; else if (b > a) pe++; });
        return g > pe ? "V" : g < pe ? "D" : "E";
      }

      // Plan que se muestra para un día: la sesión guardada o la rutina de ese día de la semana (o la elegida a mano)
      function planDe(k) {
        const s = d.sesiones[k];
        if (s) return s;
        const idx = planElegido[k] !== undefined ? planElegido[k] : diaSemana(k);
        const r = idx === "libre" ? null : d.rutina[idx];
        return { plan: idx, nombre: r ? r.nombre : "Entreno libre", ejercicios: (r ? r.ejercicios : []).map(ex => {
          const u = ultimaVez(ex, k), n = u ? u.series.length : 3;
          return { ex, series: Array.from({ length: n }, () => ({ kg: "", reps: "", hecho: false })) };
        }) };
      }
      const asegurarSesion = k => d.sesiones[k] || (d.sesiones[k] = JSON.parse(JSON.stringify(planDe(k))));

      // ---------- Vista: entreno del día ----------
      function vistaEntreno() {
        const esHoy = diaSel === hoy;
        const nav = `<div class="gy-nav"><button data-accion="dia" data-n="-1" aria-label="Día anterior">‹</button>
          <h2>${esHoy ? "Hoy" : diaSel === sumarK(hoy, -1) ? "Ayer" : fechaCorta(diaSel)}</h2>
          <button data-accion="dia" data-n="1" aria-label="Día siguiente" ${esHoy ? "disabled" : ""}>›</button></div>`;
        if (!Object.keys(d.rutina).length && !d.sesiones[diaSel]) return nav + `<div class="bloque"><h2>Crea tu rutina</h2>
          <p>Primero define qué entrenas cada día de la semana y con qué ejercicios. Luego, cada día que vayas, aquí te aparecerá la rutina que toca para apuntar tus series.</p>
          <button class="boton" data-accion="vista" data-v="rutina">Crear rutina</button></div>`;

        const p = planDe(diaSel), guardada = !!d.sesiones[diaSel];
        const opciones = DIAS.map((n, i) => d.rutina[i] ? `<option value="${i}" ${String(p.plan) === String(i) ? "selected" : ""}>${n}: ${esc(d.rutina[i].nombre)}</option>` : "").join("")
          + `<option value="libre" ${p.plan === "libre" ? "selected" : ""}>Entreno libre</option>`;
        const descanso = !p.ejercicios.length && p.plan !== "libre";

        const ejercicios = p.ejercicios.map((e, i) => {
          const u = ultimaVez(e.ex, diaSel);
          const ref = u ? `<div class="gy-ref">Última vez, ${fechaCorta(u.k)}: <b>${u.series.map(s => `${fN(num(s.kg) || 0, 2)} × ${num(s.reps)}`).join(", ")}</b></div>`
            : `<div class="gy-ref">Primera vez que lo apuntas.</div>`;
          const filas = e.series.map((s, j) => {
            const r = u ? (u.series[j] || u.series[u.series.length - 1]) : null;
            return `<div class="gy-serie ${s.hecho ? "hecha" : ""}" data-e="${i}" data-s="${j}"><span>${j + 1}</span>
              <input inputmode="decimal" data-campo="kg" value="${esc(s.kg)}" placeholder="${r ? fN(num(r.kg) || 0, 2) : "kg"}" aria-label="Kilos serie ${j + 1}">
              <input inputmode="numeric" data-campo="reps" value="${esc(s.reps)}" placeholder="${r ? num(r.reps) : "reps"}" aria-label="Repeticiones serie ${j + 1}">
              <button class="gy-ok" data-accion="ok" data-e="${i}" data-s="${j}" aria-label="Serie hecha">${tick}</button></div>`;
          }).join("");
          return `<div class="bloque gy-ej"><div class="gy-cab"><h2>${esc(nombreEj(e.ex))}</h2><button class="gy-x" data-accion="quitar-ej" data-e="${i}" aria-label="Quitar de hoy">×</button></div>
            ${ref}<div class="gy-etq"><span></span><span>kg</span><span>reps</span><span></span></div>${filas}
            <div class="gy-btns"><button data-accion="menos-serie" data-e="${i}">− Serie</button><button data-accion="mas-serie" data-e="${i}">+ Serie</button></div></div>`;
        }).join("");

        const vol = volumenSesion(d.sesiones[diaSel]), ns = seriesSesion(d.sesiones[diaSel]);
        return nav + `
          <div class="bloque">
            <div class="gy-cab"><div><h2>${descanso ? "Descanso" : esc(p.nombre)}</h2>
              <div class="gy-sub">${descanso ? "No tienes rutina para este día. Si entrenas igualmente, elige qué vas a hacer." : `Rutina del ${DIAS[p.plan] ? DIAS[p.plan].toLowerCase() : "día"}`.replace("Rutina del día", "Ejercicios que tú elijas")}</div></div></div>
            ${!guardada ? `<select class="gy-cambiar" data-accion="plan" aria-label="Cambiar rutina">${opciones}</select>` : ""}
            ${ns ? `<div class="gy-vol" style="margin-top:14px"><span class="etiqueta">Volumen de hoy</span><span><b id="gyVol">${fN(vol, 0)}</b> <span class="etiqueta">kg en <span id="gySeries">${ns}</span> series</span></span></div>` : `<div id="gyVolHueco"></div>`}
          </div>
          ${ejercicios}
          ${!descanso || p.plan === "libre" ? `<button class="gy-anadir" data-accion="anadir-ej">Añadir ejercicio${p.ejercicios.length ? " a este día" : ""}</button>` : ""}`;
      }

      // ---------- Vista: calendario ----------
      function grafVolumen() {
        const ks = Object.keys(d.sesiones).filter(k => k >= sumarK(hoy, -90) && fueAlGym(k)).sort();
        if (ks.length < 2) return `<p>El gráfico aparecerá cuando tengas al menos dos entrenos apuntados.</p>`;
        const W = 340, H = 160, pad = { t: 10, r: 6, b: 22, l: 34 };
        const vals = ks.map(k => volumenSesion(d.sesiones[k])), max = Math.max(...vals) * 1.1 || 1;
        const ancho = (W - pad.l - pad.r) / ks.length, Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        let ej = ""; for (let i = 0; i <= 3; i++) { const v = max * i / 3; ej += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 5}" y="${Y(v) + 3}" text-anchor="end">${v >= 1000 ? fN(v / 1000) + "k" : Math.round(v)}</text>`; }
        const bars = ks.map((k, i) => { const w = Math.max(ancho * 0.62, 1.5); return `<rect x="${pad.l + i * ancho + (ancho - w) / 2}" y="${Y(vals[i])}" width="${w}" height="${Y(0) - Y(vals[i])}" rx="${Math.min(w / 2, 3)}" fill="var(--naranja)"/>`; }).join("");
        return `<svg viewBox="0 0 ${W} ${H}">${ej}${bars}<text x="${pad.l}" y="${H - 5}">${fechaCorta(ks[0])}</text><text x="${W - pad.r}" y="${H - 5}" text-anchor="end">${fechaCorta(ks[ks.length - 1])}</text></svg>`;
      }
      function vistaCalendario() {
        const [a, m] = mesCal.split("-").map(Number);
        const primero = new Date(a, m - 1, 1), diasMes = new Date(a, m, 0).getDate(), hueco = (primero.getDay() + 6) % 7;
        const mesTxt = primero.toLocaleDateString("es-ES", { month: "long" });
        const padelDias = new Set(d.partidos.map(p => p.fecha));
        let celdas = ["L", "M", "X", "J", "V", "S", "D"].map(x => `<div class="l">${x}</div>`).join("") + "<div></div>".repeat(hueco);
        for (let i = 1; i <= diasMes; i++) {
          const k = mesCal + "-" + String(i).padStart(2, "0");
          const cls = [fueAlGym(k) ? "gym" : "", padelDias.has(k) ? "padel" : "", k === hoy ? "hoy" : "", k === calSel ? "sel" : ""].join(" ");
          celdas += `<button class="${cls}" data-accion="cal-dia" data-k="${k}" ${k > hoy ? "disabled" : ""}>${i}</button>`;
        }
        const delMes = Object.keys(d.sesiones).filter(k => k.startsWith(mesCal) && fueAlGym(k));
        const volMes = delMes.reduce((s, k) => s + volumenSesion(d.sesiones[k]), 0);
        const partMes = d.partidos.filter(p => p.fecha.startsWith(mesCal)).length;

        let detalle = "";
        if (calSel && calSel.startsWith(mesCal)) {
          const s = d.sesiones[calSel], ps = d.partidos.filter(p => p.fecha === calSel);
          const gym = fueAlGym(calSel) ? `<div class="gy-vol" style="margin:6px 0 4px"><span>${esc(s.nombre)}</span><span><b>${fN(volumenSesion(s), 0)}</b> <span class="etiqueta">kg</span></span></div>`
            + s.ejercicios.filter(e => e.series.some(serieValida)).map(e => `<div class="gy-fila" style="cursor:default"><div class="izq"><div>${esc(nombreEj(e.ex))}</div>
              <div class="sub">${e.series.filter(serieValida).map(x => `${fN(num(x.kg) || 0, 2)} × ${num(x.reps)}`).join(", ")}</div></div></div>`).join("") : "";
          const pad = ps.map(p => `<div class="gy-fila" style="cursor:default"><div class="izq"><div>Pádel${p.companero ? " con " + esc(p.companero) : ""}</div>
            <div class="sub">${p.sets.map(x => x.join("-")).join(", ")}</div></div><span class="gy-res ${resultado(p)}">${{ V: "Victoria", E: "Empate", D: "Derrota" }[resultado(p)]}</span></div>`).join("");
          detalle = `<div class="bloque"><h2>${fechaLarga(calSel)}</h2>${gym || pad ? gym + pad : `<p style="margin:6px 0 0">Día sin deporte.</p>`}
            ${!gym ? `<p style="margin:12px 0 0"><button class="boton secundario" data-accion="ir-dia" data-k="${calSel}">Apuntar entreno</button></p>` : `<p style="margin:12px 0 0"><button class="boton secundario" data-accion="ir-dia" data-k="${calSel}">Ver o editar</button></p>`}</div>`;
        }

        return `<div class="gy-nav"><button data-accion="mes" data-n="-1" aria-label="Mes anterior">‹</button>
            <h2>${mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1)} ${a}</h2>
            <button data-accion="mes" data-n="1" aria-label="Mes siguiente" ${mesCal >= hoy.slice(0, 7) ? "disabled" : ""}>›</button></div>
          <div class="gy-stats">
            <div><span class="etiqueta">Días de gym</span><b>${delMes.length}</b></div>
            <div><span class="etiqueta">Partidos</span><b>${partMes}</b></div>
            <div><span class="etiqueta">Volumen</span><b>${volMes >= 10000 ? fN(volMes / 1000) + "k" : fN(volMes, 0)} <span class="etiqueta">kg</span></b></div>
          </div>
          <div class="bloque"><div class="gy-cal">${celdas}</div>
            <div class="gy-ley"><span><i></i>Gimnasio</span><span><i class="p"></i>Pádel</span></div></div>
          ${detalle}
          <div class="bloque gy-graf"><h2>Volumen por entreno</h2><div class="gy-sub">Kilos × repeticiones de cada día, últimos 3 meses</div>${grafVolumen()}</div>`;
      }

      // ---------- Vista: rutina ----------
      function vistaRutina() {
        return `<div class="bloque"><h2>Tu semana</h2><div class="gy-sub" style="margin-bottom:6px">Toca un día para ponerle nombre y ejercicios. Los días sin rutina son de descanso.</div>
          ${DIAS.map((n, i) => { const r = d.rutina[i];
            return `<button class="gy-fila" data-accion="editar-dia" data-i="${i}"><div class="izq"><div>${n}</div>
              <div class="sub">${r ? r.ejercicios.map(nombreEj).map(esc).join(", ") || "Sin ejercicios" : "Descanso"}</div></div>
              <div class="der ${r ? "" : "gy-desc"}">${r ? esc(r.nombre) : "–"}</div></button>`; }).join("")}</div>`;
      }

      // ---------- Vista: pádel ----------
      function vistaPadel() {
        const ps = d.partidos.slice().sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creado - a.creado);
        const c = { V: 0, E: 0, D: 0 }; ps.forEach(p => c[resultado(p)]++);
        const porComp = {};
        ps.forEach(p => { const n = p.companero || "Sin indicar"; const x = porComp[n] || (porComp[n] = { V: 0, E: 0, D: 0 }); x[resultado(p)]++; });
        const tabla = Object.entries(porComp).sort((a, b) => (b[1].V + b[1].E + b[1].D) - (a[1].V + a[1].E + a[1].D)).map(([n, x]) => {
          const t = x.V + x.E + x.D; return `<tr><td>${esc(n)}</td><td>${t}</td><td>${x.V}</td><td>${x.E}</td><td>${x.D}</td><td>${Math.round(x.V / t * 100)}%</td></tr>`; }).join("");
        return `
          <div class="bloque">
            <div class="gy-marcador">
              <div><b>${ps.length}</b><span>Jugados</span></div>
              <div class="g"><b>${c.V}</b><span>Ganados</span></div>
              <div><b>${c.E}</b><span>Empatados</span></div>
              <div><b>${c.D}</b><span>Perdidos</span></div>
            </div>
            ${ps.length ? `<p style="margin:14px 0 0;text-align:center">Ganas el ${Math.round(c.V / ps.length * 100)} % de tus partidos.</p>` : ""}
          </div>
          <button class="gy-anadir" data-accion="nuevo-partido">Apuntar partido</button>
          ${ps.length ? `<div class="bloque"><h2>Por compañero</h2><table class="gy-tabla"><tr><th></th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>% G</th></tr>${tabla}</table></div>
          <div class="bloque"><h2>Partidos</h2>${ps.map(p => `<div class="gy-fila" style="cursor:default">
            <div class="izq"><div>${p.sets.map(x => x.join("-")).join("  ")}</div><div class="sub">${fechaCorta(p.fecha)}${p.companero ? ", con " + esc(p.companero) : ""}</div></div>
            <span class="gy-res ${resultado(p)}">${resultado(p)}</span>
            <button class="gy-x" data-accion="borrar-partido" data-id="${p.id}" aria-label="Borrar partido">×</button></div>`).join("")}</div>`
          : `<div class="bloque"><p style="margin:0">Aún no has apuntado partidos. Cuenta como empate cuando acabáis igualados en sets.</p></div>`}`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="gy-seg">${[["entreno", "Entreno"], ["calendario", "Calendario"], ["rutina", "Rutina"], ["padel", "Pádel"]].map(([id, n]) =>
          `<button class="${vista === id ? "on" : ""}" data-accion="vista" data-v="${id}">${n}</button>`).join("")}</div>
          ${{ entreno: vistaEntreno, calendario: vistaCalendario, rutina: vistaRutina, padel: vistaPadel }[vista]()}`;
      }

      // ---------- Hojas ----------
      function hoja(html, alGuardar, extra) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel gy-form" role="dialog">${html}<div class="gy-acciones"><button class="boton secundario" data-h="cancelar">Cancelar</button><button class="boton" data-h="guardar">Guardar</button></div>${extra || ""}</div>`;
        raiz.appendChild(f);
        f.addEventListener("click", e => {
          if (e.target === f || e.target.dataset.h === "cancelar") f.remove();
          if (e.target.dataset.h === "guardar" && alGuardar(f) !== false) { f.remove(); guardar(); pintar(); }
        });
        return f;
      }
      const datalistEj = () => `<datalist id="gyEjs">${Object.values(d.ejercicios).map(e => `<option value="${esc(e.nombre)}">`).join("")}</datalist>`;

      function hojaDia(i) {
        const r = d.rutina[i];
        let lista = r ? r.ejercicios.slice() : [];
        const f = hoja(`<h2>${DIAS[i]}</h2>
          <label>Nombre del día</label><input id="gyNom" value="${r ? esc(r.nombre) : ""}" placeholder="Pecho y tríceps, Pierna…" maxlength="40">
          <label>Ejercicios</label><div class="gy-lista-ej" id="gyLista"></div>
          <div style="display:flex;gap:8px;margin-top:8px"><input id="gyNuevoEj" list="gyEjs" placeholder="Añadir ejercicio" enterkeyhint="done" style="flex:1;min-width:0">
            <button class="boton" data-h="mas" style="flex:none;padding:0 16px">+</button></div>${datalistEj()}`,
          f => {
            const nombre = f.querySelector("#gyNom").value.trim();
            const pend = f.querySelector("#gyNuevoEj").value.trim(); if (pend) lista.push(idEjercicio(pend));
            if (!nombre && !lista.length) { delete d.rutina[i]; return; }
            d.rutina[i] = { nombre: nombre || DIAS[i], ejercicios: lista };
          }, r ? `<button class="gy-peligro" data-h="descanso">Convertir en día de descanso</button>` : "");
        const pintarLista = () => f.querySelector("#gyLista").innerHTML = lista.length ? lista.map((ex, j) => `<div class="gy-fila"><div class="izq">${esc(nombreEj(ex))}</div>
          <button class="gy-mover" data-sube="${j}" aria-label="Subir" ${j === 0 ? "disabled" : ""}>↑</button><button class="gy-x" data-quita="${j}" aria-label="Quitar">×</button></div>`).join("")
          : `<p class="gy-sub" style="margin:0">Aún sin ejercicios.</p>`;
        const anadir = () => { const i2 = f.querySelector("#gyNuevoEj"); const n = i2.value.trim(); if (!n) return; lista.push(idEjercicio(n)); i2.value = ""; pintarLista(); i2.focus(); };
        pintarLista();
        f.addEventListener("click", e => {
          const t = e.target;
          if (t.dataset.h === "mas") anadir();
          if (t.dataset.sube) { const j = +t.dataset.sube; [lista[j - 1], lista[j]] = [lista[j], lista[j - 1]]; pintarLista(); }
          if (t.dataset.quita) { lista.splice(+t.dataset.quita, 1); pintarLista(); }
          if (t.dataset.h === "descanso") { delete d.rutina[i]; f.remove(); guardar(); pintar(); }
        });
        f.querySelector("#gyNuevoEj").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); anadir(); } });
      }

      function hojaEjercicioHoy() {
        const f = hoja(`<h2>Añadir ejercicio</h2><p class="gy-sub" style="margin:0">Solo para este día. Para que salga siempre, añádelo en Rutina.</p>
          <label>Ejercicio</label><input id="gyEjHoy" list="gyEjs" placeholder="Nombre del ejercicio">${datalistEj()}`,
          f => {
            const n = f.querySelector("#gyEjHoy").value.trim(); if (!n) return false;
            const s = asegurarSesion(diaSel), ex = idEjercicio(n), u = ultimaVez(ex, diaSel);
            s.ejercicios.push({ ex, series: Array.from({ length: u ? u.series.length : 3 }, () => ({ kg: "", reps: "", hecho: false })) });
          });
        setTimeout(() => f.querySelector("#gyEjHoy").focus(), 50);
      }

      function hojaPartido() {
        const comps = [...new Set(d.partidos.map(p => p.companero).filter(Boolean))];
        const f = hoja(`<h2>Nuevo partido</h2>
          <div class="dos"><div><label>Fecha</label><input type="date" id="gyPF" value="${hoy}" max="${hoy}"></div>
            <div><label>Compañero</label><input id="gyPC" list="gyComps" maxlength="30"><datalist id="gyComps">${comps.map(c => `<option value="${esc(c)}">`).join("")}</datalist></div></div>
          <label>Resultado por sets (vosotros – rivales)</label>
          <div class="gy-sets">${[1, 2, 3].map(i => `<span>Set ${i}</span><input inputmode="numeric" id="gyS${i}a" maxlength="2"><span>–</span><input inputmode="numeric" id="gyS${i}b" maxlength="2">`).join("")}</div>
          <p class="gy-sub">Deja vacíos los sets que no jugasteis.</p>`,
          f => {
            const sets = [1, 2, 3].map(i => [parseInt(f.querySelector(`#gyS${i}a`).value), parseInt(f.querySelector(`#gyS${i}b`).value)]).filter(([a, b]) => !isNaN(a) && !isNaN(b));
            if (!sets.length) { f.querySelector("#gyS1a").style.borderColor = "#E5776B"; return false; }
            d.partidos.push({ id: nuevoId(), creado: Date.now(), fecha: f.querySelector("#gyPF").value || hoy, companero: f.querySelector("#gyPC").value.trim(), sets });
          });
        setTimeout(() => f.querySelector("#gyS1a").focus(), 50);
      }

      // ---------- Eventos ----------
      function refrescarVolumen() {
        const s = d.sesiones[diaSel], v = raiz.querySelector("#gyVol"), n = raiz.querySelector("#gySeries");
        if (v && n && seriesSesion(s)) { v.textContent = fN(volumenSesion(s), 0); n.textContent = seriesSesion(s); }
        else pintarConservandoFoco();
      }
      function pintarConservandoFoco() {
        const a = document.activeElement, fila = a && a.closest && a.closest(".gy-serie");
        const pos = fila ? [fila.dataset.e, fila.dataset.s, a.dataset.campo] : null;
        pintar();
        if (pos) { const el = raiz.querySelector(`.gy-serie[data-e="${pos[0]}"][data-s="${pos[1]}"] [data-campo="${pos[2]}"]`); if (el) { el.focus(); const l = el.value.length; try { el.setSelectionRange(l, l); } catch (e) {} } }
      }

      raiz.addEventListener("input", e => {
        const fila = e.target.closest(".gy-serie"); if (!fila) return;
        const s = asegurarSesion(diaSel), serie = s.ejercicios[+fila.dataset.e].series[+fila.dataset.s];
        serie[e.target.dataset.campo] = e.target.value;
        guardar(); refrescarVolumen();
      });
      raiz.addEventListener("change", e => {
        if (e.target.dataset.accion !== "plan") return;
        planElegido[diaSel] = e.target.value === "libre" ? "libre" : +e.target.value; pintar();
      });

      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b || b.tagName === "SELECT") return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "dia") { const n = sumarK(diaSel, +b.dataset.n); if (n <= hoy) diaSel = n; }
        else if (a === "ok") {
          const s = asegurarSesion(diaSel), e2 = s.ejercicios[+b.dataset.e], serie = e2.series[+b.dataset.s];
          if (!serie.hecho) {
            const u = ultimaVez(e2.ex, diaSel), r = u ? (u.series[+b.dataset.s] || u.series[u.series.length - 1]) : null;
            if (serie.kg === "" && r) serie.kg = String(num(r.kg) || 0).replace(".", ",");
            if (serie.reps === "" && r) serie.reps = String(num(r.reps));
            if (!(num(serie.reps) > 0)) { const inp = raiz.querySelector(`.gy-serie[data-e="${b.dataset.e}"][data-s="${b.dataset.s}"] [data-campo=reps]`); inp.style.borderColor = "#E5776B"; inp.focus(); return; }
          }
          serie.hecho = !serie.hecho; guardar();
        }
        else if (a === "mas-serie") { const s = asegurarSesion(diaSel); s.ejercicios[+b.dataset.e].series.push({ kg: "", reps: "", hecho: false }); guardar(); }
        else if (a === "menos-serie") { const s = asegurarSesion(diaSel); const ss = s.ejercicios[+b.dataset.e].series; if (ss.length > 1) ss.pop(); guardar(); }
        else if (a === "quitar-ej") { const s = asegurarSesion(diaSel); s.ejercicios.splice(+b.dataset.e, 1); if (!s.ejercicios.length && !seriesSesion(s)) delete d.sesiones[diaSel]; guardar(); }
        else if (a === "anadir-ej") return hojaEjercicioHoy();
        else if (a === "mes") { const [y, m] = mesCal.split("-").map(Number); const n = new Date(y, m - 1 + +b.dataset.n, 1); mesCal = clave(n).slice(0, 7); calSel = null; }
        else if (a === "cal-dia") calSel = b.dataset.k;
        else if (a === "ir-dia") { diaSel = b.dataset.k; vista = "entreno"; }
        else if (a === "editar-dia") return hojaDia(+b.dataset.i);
        else if (a === "nuevo-partido") return hojaPartido();
        else if (a === "borrar-partido") { if (!confirm("¿Borrar este partido?")) return; d.partidos = d.partidos.filter(p => p.id !== b.dataset.id); guardar(); }
        pintar();
      });

      pintar();
    }
  });
})();
