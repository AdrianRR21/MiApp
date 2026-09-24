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
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Estado de la pantalla (no se guarda, solo mientras usas la app)
  let vista = "habitos";      // "habitos" o "tareas"
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
        if (periodo === "mes") return new Date(h.getFullYear(), h.getMonth(), 1);
        return sumar(h, -((h.getDay() + 6) % 7)); // lunes de esta semana
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
        const porHabito = d.habitos.map(h => {
          const p = porcentaje(inicioPeriodo(), [h]);
          return `<div class="hb-barra-fila"><div class="n"><span>${esc(h.nombre)}</span><span>${p === null ? "–" : p + "%"}</span></div>
            <div class="hb-barra"><div style="width:${p || 0}%"></div></div></div>`;
        }).join("");

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
              <div><div class="etiqueta">Cumplimiento ${periodo === "semana" ? "esta semana" : "este mes"}</div>
                <div class="cifra">${pct === null ? "–" : pct + "%"}</div></div>
              <div class="hb-mini-seg">
                <button class="${periodo === "semana" ? "on" : ""}" data-accion="periodo" data-p="semana">Semana</button>
                <button class="${periodo === "mes" ? "on" : ""}" data-accion="periodo" data-p="mes">Mes</button>
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

      function pintar() {
        raiz.innerHTML = `
          <div class="hb-seg">
            <button class="${vista === "habitos" ? "on" : ""}" data-accion="vista" data-v="habitos">Hábitos</button>
            <button class="${vista === "tareas" ? "on" : ""}" data-accion="vista" data-v="tareas">Tareas</button>
          </div>
          ${vista === "habitos" ? pintarHabitos() : pintarTareas()}`;
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
