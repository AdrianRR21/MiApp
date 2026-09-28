/* PESTAÑA: Hábitos y tareas
   Para cambiarla, sustituye solo este archivo. */
(() => {
  // ---------- Estilos propios de esta pestaña ----------
  const css = `
  .hb-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:16px; }
  .hb-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .hb-seg button.on { background:var(--papel-2); color:var(--tinta); }

  .hb-dias { display:flex; gap:6px; margin-bottom:16px; }
  .hb-dia { flex:1; border:0; background:var(--papel); color:var(--tinta-suave); border-radius:12px; padding:9px 0 8px; font:inherit; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:3px; }
  .hb-dia b { font-size:17px; color:var(--tinta); font-weight:600; }
  .hb-dia span { font-size:11px; }
  .hb-dia i { width:5px; height:5px; border-radius:50%; background:transparent; }
  .hb-dia i.medio { background:var(--tinta-suave); }
  .hb-dia i.lleno { background:var(--naranja); }
  .hb-dia.sel { background:var(--naranja-suave); box-shadow: inset 0 0 0 1.5px var(--naranja); }
  .hb-dia.sel b { color:var(--naranja); }

  .hb-cab { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
  .hb-cab h2 { margin:0; }
  .hb-enlace { background:none; border:0; color:var(--naranja); font:inherit; font-weight:600; font-size:14px; cursor:pointer; padding:4px 0; }

  .hb-fila { display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid var(--linea); }
  .hb-fila:first-of-type { border-top:0; }
  .hb-fila .txt { flex:1; line-height:1.35; word-break:break-word; }
  .hb-check { flex:none; width:28px; height:28px; border-radius:50%; border:2px solid var(--tinta-suave); background:none; cursor:pointer; display:grid; place-items:center; padding:0; color:#1A1411; }
  .hb-check.on { background:var(--naranja); border-color:var(--naranja); }
  .hb-check svg { width:15px; height:15px; opacity:0; }
  .hb-check.on svg { opacity:1; }
  .hb-fila.hecha .txt { color:var(--tinta-suave); text-decoration:line-through; }
  .hb-borrar { flex:none; background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:2px 6px; cursor:pointer; }

  .hb-nuevo { display:flex; gap:8px; margin-top:12px; }
  .hb-nuevo input { flex:1; min-width:0; }
  .hb-nuevo select { width:auto; max-width:40%; }
  .hb-mas { flex:none; width:46px; border:0; border-radius:10px; background:var(--naranja); color:#1A1411; font-size:24px; cursor:pointer; }

  .hb-pct-top { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:14px; }
  .hb-mini-seg { display:flex; gap:4px; }
  .hb-mini-seg button { border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 11px; border-radius:8px; cursor:pointer; }
  .hb-mini-seg button.on { background:var(--naranja-suave); color:var(--naranja); }
  .hb-barra-fila { margin-top:12px; }
  .hb-barra-fila .n { display:flex; justify-content:space-between; font-size:14px; margin-bottom:6px; }
  .hb-barra-fila .n span:last-child { color:var(--tinta-suave); }
  .hb-barra { height:6px; background:var(--papel-2); border-radius:3px; overflow:hidden; }
  .hb-barra div { height:100%; background:var(--naranja); border-radius:3px; }

  .hb-graf svg { width:100%; height:auto; display:block; margin-top:6px; }
  .hb-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }
  .hb-mapa { display:grid; gap:4px; margin-top:16px; align-items:center; }
  .hb-mapa .nom { font-size:13px; color:var(--tinta); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-right:6px; }
  .hb-mapa .pc { font-size:12.5px; color:var(--tinta-suave); text-align:right; padding-left:6px; }
  .hb-mapa i { display:block; aspect-ratio:1; border-radius:3px; background:var(--papel-2); }
  .hb-mapa i.si { background:var(--naranja); }
  .hb-mapa i.no-aplica { background:transparent; box-shadow:inset 0 0 0 1px var(--linea); }
  .hb-mapa .dia { font-size:10px; color:var(--tinta-suave); text-align:center; }

  .ag-cal { display:grid; grid-template-columns:repeat(7, 1fr); gap:2px; text-align:center; }
  .ag-cal .l { font-size:11.5px; color:var(--tinta-suave); padding-bottom:6px; }
  .ag-cal button { position:relative; aspect-ratio:1; border:0; background:none; color:var(--tinta); font:inherit; font-size:14px; border-radius:10px; cursor:pointer; padding:0; }
  .ag-cal button.pasado { color:#4A4A50; }
  .ag-cal button.hoy { box-shadow:inset 0 0 0 1px var(--linea); }
  .ag-cal button.sel { background:var(--naranja); color:#000; font-weight:600; }
  .ag-cal button.tiene::after { content:""; position:absolute; bottom:5px; left:50%; margin-left:-2px; width:4px; height:4px; border-radius:50%; background:var(--naranja); }
  .ag-cal button.sel.tiene::after { background:#000; }
  .ag-mes { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .ag-mes b { font-weight:600; font-size:15px; letter-spacing:-0.02em; }
  .ag-mes button { background:none; border:1px solid var(--linea); color:var(--tinta); width:32px; height:32px; border-radius:9px; font-size:16px; cursor:pointer; }
  .ag-dia-cab { display:flex; justify-content:space-between; align-items:baseline; margin:4px 2px 12px; }
  .ag-dia-cab h3 { margin:0; font-size:19px; font-weight:600; letter-spacing:-0.03em; }
  .ag-linea { display:grid; grid-template-columns:52px 1fr; gap:12px; }
  .ag-hora { font-size:13px; color:var(--tinta-suave); padding-top:13px; text-align:right; font-variant-numeric:tabular-nums; }
  .ag-ev { width:100%; text-align:left; font:inherit; color:inherit; background:var(--papel); border:1px solid var(--linea); border-left:3px solid var(--naranja); border-radius:10px; padding:11px 13px; margin-bottom:8px; cursor:pointer; }
  .ag-ev b { display:block; font-weight:600; font-size:15px; letter-spacing:-0.01em; }
  .ag-ev span { font-size:12.5px; color:var(--tinta-suave); }
  .ag-ev.pasado { opacity:.5; }
  .ag-anadir { width:100%; border:0; background:none; color:var(--naranja); box-shadow:inset 0 0 0 1px var(--naranja); font:inherit; font-weight:600; font-size:15px; padding:13px; border-radius:12px; cursor:pointer; margin:4px 0 12px; }
  .hb-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .hb-form .dos { display:flex; gap:10px; }
  .hb-form .dos > div { flex:1; min-width:0; }
  .hb-acciones { display:flex; gap:8px; margin-top:20px; }
  .hb-acciones .boton { flex:1; margin:0; }
  .hb-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .hb-cat { font-family:var(--titulos); font-weight:400; font-size:24px; margin:0; }
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

      function pintarHabitos() {
        // Tira con los últimos 7 días (para poder marcar un día que se te olvidó)
        let tira = "";
        for (let i = 6; i >= 0; i--) {
          const f = sumar(hoy(), -i), k = clave(f);
          const activos = d.habitos.filter(h => h.desde <= k);
          const n = activos.filter(h => (d.registro[k] || []).includes(h.id)).length;
          const punto = activos.length && n === activos.length ? "lleno" : n > 0 ? "medio" : "";
          tira += `<button class="hb-dia ${k === diaSel ? "sel" : ""}" data-accion="dia" data-k="${k}">
            <span>${i === 0 ? "Hoy" : DIAS[f.getDay()]}</span><b>${f.getDate()}</b><i class="${punto}"></i></button>`;
        }

        const activos = d.habitos.filter(h => h.desde <= diaSel);
        const marcados = d.registro[diaSel] || [];
        const hechos = activos.filter(h => marcados.includes(h.id)).length;
        const esHoy = diaSel === hoyK;

        let lista = activos.map(h => `
          <div class="hb-fila">
            <button class="hb-check ${marcados.includes(h.id) ? "on" : ""}" data-accion="marcar" data-id="${h.id}" aria-label="Marcar ${esc(h.nombre)}">${tick}</button>
            <div class="txt">${esc(h.nombre)}</div>
            ${editando ? `<button class="hb-borrar" data-accion="borrar-habito" data-id="${h.id}" aria-label="Borrar">×</button>` : ""}
          </div>`).join("");
        if (!d.habitos.length) lista = `<p>Añade tu primer hábito: algo que quieras hacer cada día.</p>`;
        else if (!activos.length) lista = `<p>Aún no tenías hábitos ese día.</p>`;

        const pct = porcentaje(inicioPeriodo(), d.habitos);
        // Días del periodo (la semana entera o el mes entero; los que aún no han llegado quedan vacíos)
        const ini = inicioPeriodo(), finP = hoy();
        const diasP = []; for (let f = new Date(ini); f <= finP; f = sumar(f, 1)) diasP.push(new Date(f));
        const pctDia = f => { const k = clave(f); if (f > hoy()) return null; const act = d.habitos.filter(h => h.desde <= k); if (!act.length) return null;
          return Math.round(act.filter(h => (d.registro[k] || []).includes(h.id)).length / act.length * 100); };
        const vals = diasP.map(pctDia);
        // Línea con área del % diario
        const W = 340, H = 150, pad = { t: 10, r: 6, b: 20, l: 30 }, n = diasP.length;
        const X = i => pad.l + (W - pad.l - pad.r) * (n === 1 ? 0.5 : i / (n - 1)), Y = v => H - pad.b - (H - pad.t - pad.b) * v / 100;
        let svg = ""; [0, 50, 100].forEach(v => { svg += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linea)"/><text x="${pad.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v}%</text>`; });
        const pts = vals.map((v, i) => v === null ? null : [X(i), Y(v)]).filter(Boolean);
        if (pts.length > 1) svg += `<polygon points="${pts.map(p => p.join(",")).join(" ")} ${pts[pts.length - 1][0]},${Y(0)} ${pts[0][0]},${Y(0)}" fill="url(#hbDeg)"/><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--naranja)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        svg += pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${n > 10 ? 2 : 3}" fill="var(--naranja)"/>`).join("");
        svg += diasP.map((f, i) => (n <= 7 || f.getDate() === 1 || f.getDate() % 5 === 0) ? `<text x="${X(i)}" y="${H - 5}" text-anchor="middle">${n <= 7 ? DIAS[f.getDay()] : f.getDate()}</text>` : "").join("");
        const grafico = `<div class="hb-graf"><svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="hbDeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--naranja)" stop-opacity=".35"/><stop offset="1" stop-color="var(--naranja)" stop-opacity="0"/></linearGradient></defs>${svg}</svg></div>`;
        // Mapa de cada hábito: un cuadrado por día
        const mapa = `<div class="hb-mapa" style="grid-template-columns:minmax(70px, 30%) repeat(${n}, 1fr) 40px">
          ${d.habitos.map(h => `<div class="nom">${esc(h.nombre)}</div>${diasP.map(f => { const k = clave(f);
            if (f > hoy() || h.desde > k) return `<i class="no-aplica"></i>`;
            return `<i class="${(d.registro[k] || []).includes(h.id) ? "si" : ""}"></i>`; }).join("")}<div class="pc">${(p => p === null ? "–" : p + "%")(porcentaje(ini, [h]))}</div>`).join("")}
        </div>`;
        const porHabito = grafico + mapa;

        return `
          <div class="hb-dias">${tira}</div>
          <div class="bloque">
            <div class="hb-cab">
              <h2>${esHoy ? "Hoy" : "Ese día"}</h2>
              ${d.habitos.length ? `<span class="etiqueta">${hechos} de ${activos.length}</span>` : ""}
            </div>
            ${lista}
            ${editando || !d.habitos.length ? `
            <div class="hb-nuevo">
              <input id="hbNuevoHabito" placeholder="Nuevo hábito" maxlength="60" enterkeyhint="done">
              <button class="hb-mas" data-accion="nuevo-habito" aria-label="Añadir hábito">+</button>
            </div>` : ""}
            ${d.habitos.length ? `<p style="margin:14px 0 0"><button class="hb-enlace" data-accion="editar">${editando ? "Listo" : "Añadir o quitar hábitos"}</button></p>` : ""}
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
            ${porHabito}
          </div>` : ""}`;
      }

      function pintarTareas() {
        const opciones = d.categorias.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("") + `<option value="__nueva">+ Nueva…</option>`;
        const pendientes = d.tareas.filter(t => !t.hecha).length;
        const grupos = d.categorias.map(cat => {
          const ts = d.tareas.filter(t => t.cat === cat);
          if (!ts.length) return "";
          const ordenadas = ts.filter(t => !t.hecha).concat(ts.filter(t => t.hecha));
          const hechas = ts.length - ts.filter(t => !t.hecha).length;
          return `<div class="bloque">
            <div class="hb-cab"><h3 class="hb-cat">${esc(cat)}</h3>
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
          <div class="bloque">
            <h2>${pendientes ? pendientes + (pendientes === 1 ? " pendiente" : " pendientes") : "Nada pendiente"}</h2>
            <div class="hb-nuevo">
              <input id="hbNuevaTarea" placeholder="Nueva tarea" maxlength="120" enterkeyhint="done">
              <select id="hbCat" aria-label="Categoría">${opciones}</select>
              <button class="hb-mas" data-accion="nueva-tarea" aria-label="Añadir tarea">+</button>
            </div>
          </div>
          ${grupos}`;
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
        const lista = evs.map(e => { const pasado = agendaSel < hoyK || (agendaSel === hoyK && (e.fin || e.hora) < horaAhora);
          return `<div class="ag-linea"><div class="ag-hora">${e.hora}</div><button class="ag-ev ${pasado ? "pasado" : ""}" data-accion="ag-editar" data-id="${e.id}"><b>${esc(e.titulo)}</b>
            <span>${e.hora}${e.fin ? " a " + e.fin : ""}${e.nota ? ", " + esc(e.nota) : ""}</span></button></div>`; }).join("");
        return `
          <div class="bloque">
            <div class="ag-mes"><button data-accion="ag-mes" data-n="-1" aria-label="Mes anterior">‹</button><b>${mesTxt.charAt(0).toUpperCase() + mesTxt.slice(1)}</b><button data-accion="ag-mes" data-n="1" aria-label="Mes siguiente">›</button></div>
            <div class="ag-cal">${celdas}</div>
          </div>
          <div class="ag-dia-cab"><h3>${nombreDia || largo.charAt(0).toUpperCase() + largo.slice(1)}</h3>${nombreDia ? `<span class="etiqueta">${largo}</span>` : ""}</div>
          ${lista || `<div class="bloque"><p style="margin:0">Nada planificado. Añade lo que vas a hacer y a qué hora.</p></div>`}
          <button class="ag-anadir" data-accion="ag-nuevo">Añadir a este día</button>`;
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
        else if (a === "ag-mes") { const [y, m] = agendaMes.split("-").map(Number); agendaMes = clave(new Date(y, m - 1 + Number(b.dataset.n), 1)).slice(0, 7); }
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
