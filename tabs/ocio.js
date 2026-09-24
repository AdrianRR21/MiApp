/* PESTAÑA: Ocio
   Películas, series y libros vistos con nota y portada, y lista de pendientes.
   Portadas: TMDB (pelis y series, necesita tu clave) y Google Books / Open Library (libros).
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .oc-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:14px; }
  .oc-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:13.5px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .oc-seg button.on { background:var(--papel-2); color:var(--tinta); }
  .oc-top { display:flex; justify-content:space-between; align-items:flex-end; margin:4px 2px 14px; gap:10px; }
  .oc-top .cifra { font-size:30px; }
  .oc-orden { display:flex; gap:4px; }
  .oc-orden button { border:0; background:var(--papel); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 10px; border-radius:8px; cursor:pointer; }
  .oc-orden button.on { background:var(--naranja-suave); color:var(--naranja); }
  .oc-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:14px 10px; align-items:start; }
  .oc-item { display:flex; flex-direction:column; width:100%; background:none; border:0; padding:0; color:inherit; font:inherit; text-align:left; cursor:pointer; min-width:0; }
  .oc-poster { position:relative; aspect-ratio:2/3; border-radius:10px; overflow:hidden; background:var(--papel-2); }
  .oc-poster img { width:100%; height:100%; object-fit:cover; display:block; }
  .oc-poster .sin { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:8px; text-align:center; font-family:var(--titulos); font-size:17px; line-height:1.1; color:var(--tinta-suave); }
  .oc-nota { position:absolute; left:6px; bottom:6px; background:var(--naranja); color:#1A1411; font-weight:700; font-size:13px; padding:3px 7px; border-radius:7px; }
  .oc-tit { font-size:13px; font-weight:600; margin-top:6px; line-height:1.25; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .oc-anio { font-size:12px; color:var(--tinta-suave); margin-top:1px; }
  .oc-anadir { width:100%; border:0; background:var(--naranja); color:#1A1411; font:inherit; font-weight:700; font-size:16px; padding:14px; border-radius:14px; cursor:pointer; margin-bottom:16px; }
  .oc-enlace { background:none; border:0; color:var(--tinta-suave); font:inherit; font-size:13px; cursor:pointer; padding:18px 0 0; text-decoration:underline; }

  .oc-chips { display:flex; gap:6px; margin-bottom:12px; }
  .oc-chips button { border:0; background:var(--papel); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:7px 12px; border-radius:20px; cursor:pointer; }
  .oc-chips button.on { background:var(--naranja-suave); color:var(--naranja); }
  .oc-fila { display:flex; align-items:center; gap:12px; padding:10px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; }
  .oc-fila:first-child { border-top:0; }
  .oc-mini { flex:none; width:46px; aspect-ratio:2/3; border-radius:6px; overflow:hidden; background:var(--papel-2); }
  .oc-mini img { width:100%; height:100%; object-fit:cover; display:block; }
  .oc-fila .izq { flex:1; min-width:0; }
  .oc-fila .izq div:first-child { font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .oc-fila .sub { font-size:13px; color:var(--tinta-suave); margin-top:2px; }
  .oc-visto { flex:none; border:0; background:var(--naranja-suave); color:var(--naranja); font:inherit; font-weight:700; font-size:13px; padding:8px 10px; border-radius:9px; cursor:pointer; }
  .oc-x { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:0 2px; cursor:pointer; }

  .oc-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .oc-busca { display:flex; gap:8px; }
  .oc-busca input { flex:1; min-width:0; }
  .oc-busca button { flex:none; border:0; background:var(--naranja); color:#1A1411; font:inherit; font-weight:700; padding:0 14px; border-radius:10px; cursor:pointer; }
  .oc-res { margin-top:8px; }
  .oc-res .oc-fila { cursor:pointer; }
  .oc-nota-grande { text-align:center; font-size:54px; font-weight:700; letter-spacing:-.03em; color:var(--naranja); margin:6px 0 0; }
  .oc-rango { width:100%; accent-color:var(--naranja); padding:0; background:none; height:32px; }
  .oc-marcas { display:flex; justify-content:space-between; font-size:12px; color:var(--tinta-suave); }
  .oc-elegido { display:flex; gap:14px; align-items:center; }
  .oc-elegido .oc-mini { width:64px; }
  .oc-acciones { display:flex; gap:8px; margin-top:20px; }
  .oc-acciones .boton { flex:1; margin:0; }
  .oc-nota-txt { font-size:13.5px; color:var(--tinta-suave); line-height:1.55; margin:10px 0 0; }
  .oc-nota-txt ol { padding-left:20px; margin:8px 0; }
  .oc-peligro { background:none; border:0; color:#E5776B; font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const fechaCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const fNota = n => String(n).replace(".", ",");
  const TIPOS = { peli: { uno: "película", varios: "películas", pest: "Pelis" }, serie: { uno: "serie", varios: "series", pest: "Series" }, libro: { uno: "libro", varios: "libros", pest: "Libros" } };

  let vista = "peli", orden = "fecha", filtro = "todo";

  HiperApp.registrar({
    id: "ocio",
    titulo: "Ocio",
    nombreCorto: "Ocio",
    color: "#F2884B",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.items = d.items || [];   // [{id, tipo, titulo, anio, autor, img, nota, fecha, estado:"visto"|"pendiente", creado}]
      d.tmdb = d.tmdb || "";
      const guardar = () => store.set(d);
      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Búsquedas ----------
      async function buscarTMDB(tipo, q) {
        const ruta = tipo === "peli" ? "movie" : "tv";
        const bearer = d.tmdb.length > 40;
        const url = `https://api.themoviedb.org/3/search/${ruta}?language=es-ES&include_adult=false&query=${encodeURIComponent(q)}` + (bearer ? "" : "&api_key=" + encodeURIComponent(d.tmdb));
        const r = await fetch(url, bearer ? { headers: { Authorization: "Bearer " + d.tmdb } } : {});
        if (r.status === 401) throw new Error("clave");
        if (!r.ok) throw new Error("red");
        const j = await r.json();
        return (j.results || []).slice(0, 12).map(x => ({
          titulo: x.title || x.name, original: x.original_title || x.original_name, anio: (x.release_date || x.first_air_date || "").slice(0, 4),
          img: x.poster_path ? "https://image.tmdb.org/t/p/w342" + x.poster_path : null
        }));
      }
      async function buscarLibros(q) {
        try {
          const r = await fetch("https://www.googleapis.com/books/v1/volumes?maxResults=12&printType=books&q=" + encodeURIComponent(q));
          if (!r.ok) throw new Error();
          const j = await r.json();
          const res = (j.items || []).map(x => { const v = x.volumeInfo || {}; const im = v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail);
            return { titulo: v.title + (v.subtitle ? ": " + v.subtitle : ""), autor: (v.authors || [])[0] || "", anio: (v.publishedDate || "").slice(0, 4),
              img: im ? im.replace("http://", "https://").replace("&edge=curl", "") : null }; });
          if (res.length) return res;
        } catch (e) { /* si falla, se prueba con Open Library */ }
        const r = await fetch("https://openlibrary.org/search.json?limit=12&fields=title,author_name,first_publish_year,cover_i&q=" + encodeURIComponent(q));
        if (!r.ok) throw new Error("red");
        const j = await r.json();
        return (j.docs || []).map(x => ({ titulo: x.title, autor: (x.author_name || [])[0] || "", anio: x.first_publish_year ? String(x.first_publish_year) : "",
          img: x.cover_i ? `https://covers.openlibrary.org/b/id/${x.cover_i}-M.jpg` : null }));
      }

      // ---------- Vistas ----------
      const poster = (x, cls) => x.img ? `<img src="${esc(x.img)}" alt="" loading="lazy">` : (cls === "mini" ? "" : `<div class="sin">${esc(x.titulo)}</div>`);

      function vistaVistos(tipo) {
        let xs = d.items.filter(x => x.tipo === tipo && x.estado === "visto");
        xs.sort(orden === "nota" ? (a, b) => (b.nota ?? -1) - (a.nota ?? -1) || (b.fecha || "").localeCompare(a.fecha || "")
          : (a, b) => (b.fecha || "").localeCompare(a.fecha || "") || b.creado - a.creado);
        const conNota = xs.filter(x => x.nota != null);
        const media = conNota.length ? conNota.reduce((s, x) => s + x.nota, 0) / conNota.length : null;
        const T = TIPOS[tipo];
        return `<div class="oc-top">
            <div><div class="cifra">${xs.length}</div><div class="etiqueta">${xs.length === 1 ? T.uno : T.varios}${media !== null ? ", nota media " + fNota(Math.round(media * 10) / 10) : ""}</div></div>
            ${xs.length > 1 ? `<div class="oc-orden"><button class="${orden === "fecha" ? "on" : ""}" data-accion="orden" data-o="fecha">Recientes</button><button class="${orden === "nota" ? "on" : ""}" data-accion="orden" data-o="nota">Mejor nota</button></div>` : ""}
          </div>
          <button class="oc-anadir" data-accion="anadir" data-tipo="${tipo}" data-estado="visto">Añadir ${T.uno}</button>
          ${xs.length ? `<div class="oc-grid">${xs.map(x => `<button class="oc-item" data-accion="editar" data-id="${x.id}">
            <div class="oc-poster">${poster(x)}${x.nota != null ? `<span class="oc-nota">${fNota(x.nota)}</span>` : ""}</div>
            <div class="oc-tit">${esc(x.titulo)}</div><div class="oc-anio">${esc(x.autor || x.anio || "")}</div></button>`).join("")}</div>`
          : `<div class="bloque"><p style="margin:0">Aún no has apuntado ${T.varios}. Busca por título y la portada se añade sola.</p></div>`}
          ${tipo !== "libro" ? `<button class="oc-enlace" data-accion="clave">${d.tmdb ? "Cambiar clave de TMDB" : "Configurar clave de TMDB"}</button>` : ""}`;
      }

      function vistaProximo() {
        const xs = d.items.filter(x => x.estado === "pendiente" && (filtro === "todo" || x.tipo === filtro)).sort((a, b) => a.creado - b.creado);
        const total = d.items.filter(x => x.estado === "pendiente").length;
        return `<div class="oc-top"><div><div class="cifra">${total}</div><div class="etiqueta">en tu lista</div></div></div>
          <button class="oc-anadir" data-accion="anadir" data-tipo="${filtro === "todo" ? "peli" : filtro}" data-estado="pendiente">Añadir a la lista</button>
          <div class="oc-chips">${[["todo", "Todo"], ["peli", "Pelis"], ["serie", "Series"], ["libro", "Libros"]].map(([k, n]) => `<button class="${filtro === k ? "on" : ""}" data-accion="filtro" data-f="${k}">${n}</button>`).join("")}</div>
          <div class="bloque">${xs.length ? xs.map(x => `<div class="oc-fila">
            <div class="oc-mini">${poster(x, "mini")}</div>
            <div class="izq"><div>${esc(x.titulo)}</div><div class="sub">${TIPOS[x.tipo].uno.charAt(0).toUpperCase() + TIPOS[x.tipo].uno.slice(1)}${x.autor ? ", " + esc(x.autor) : x.anio ? ", " + esc(x.anio) : ""}</div></div>
            <button class="oc-visto" data-accion="ya-visto" data-id="${x.id}">${x.tipo === "libro" ? "Leído" : "Visto"}</button>
            <button class="oc-x" data-accion="quitar" data-id="${x.id}" aria-label="Quitar de la lista">×</button></div>`).join("")
            : `<p style="margin:0">${total ? "Nada de este tipo en tu lista." : "Apunta aquí lo que quieres ver o leer. Cuando lo termines, pulsa Visto y le pones nota."}</p>`}</div>`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="oc-seg">${[["peli", "Pelis"], ["serie", "Series"], ["libro", "Libros"], ["proximo", "Próximo"]].map(([k, n]) =>
          `<button class="${vista === k ? "on" : ""}" data-accion="vista" data-v="${k}">${n}</button>`).join("")}</div>
          ${vista === "proximo" ? vistaProximo() : vistaVistos(vista)}`;
      }

      // ---------- Hojas ----------
      function abrirHoja() {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel oc-form" role="dialog"><div class="oc-paso"></div></div>`;
        raiz.appendChild(f);
        f.addEventListener("click", e => { if (e.target === f) f.remove(); });
        return { f, paso: f.querySelector(".oc-paso"), cerrar: () => f.remove() };
      }

      function htmlClave() {
        return `<h2>Clave de TMDB</h2>
          <div class="oc-nota-txt">Para las portadas de pelis y series se usa TMDB, que pide una clave gratuita. Solo hay que hacerlo una vez:
            <ol><li>Crea una cuenta en themoviedb.org y confirma el correo.</li>
            <li>Entra en tu perfil, Ajustes y luego API. Pide una clave para uso personal y rellena el formulario (puedes poner como web la dirección de tu app).</li>
            <li>Copia la "Clave de la API" (o el "Token de acceso de lectura") y pégala aquí.</li></ol>
            La clave se guarda solo en este iPhone, nunca en GitHub.</div>
          <label>Clave</label><input id="ocClave" value="${esc(d.tmdb)}" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      }
      function hojaClave(despues) {
        const h = abrirHoja();
        h.paso.innerHTML = htmlClave() + `<div class="oc-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>`;
        h.paso.addEventListener("click", e => {
          if (e.target.dataset.h === "c") h.cerrar();
          if (e.target.dataset.h === "g") { d.tmdb = h.paso.querySelector("#ocClave").value.trim(); guardar(); h.cerrar(); pintar(); if (despues) despues(); }
        });
      }

      // Añadir: elegir tipo (solo en Próximo), buscar, elegir resultado, poner nota y fecha
      function hojaAnadir(tipo, estado) {
        const h = abrirHoja();
        let resultados = [], estadoBusq = "";
        function pasoBuscar(q) {
          const T = TIPOS[tipo];
          h.paso.innerHTML = `<h2>${estado === "pendiente" ? "Añadir a la lista" : "Añadir " + T.uno}</h2>
            ${estado === "pendiente" ? `<div class="oc-chips" style="margin-top:8px">${["peli", "serie", "libro"].map(k => `<button class="${tipo === k ? "on" : ""}" data-t="${k}">${TIPOS[k].pest}</button>`).join("")}</div>` : ""}
            <div class="oc-busca" style="margin-top:${estado === "pendiente" ? 0 : 12}px"><input id="ocQ" placeholder="${tipo === "libro" ? "Título o autor" : "Título"}" value="${esc(q || "")}" enterkeyhint="search" autocomplete="off"><button data-h="buscar">Buscar</button></div>
            <div class="oc-res">${estadoBusq ? `<p class="oc-nota-txt">${estadoBusq}</p>` : ""}
              ${resultados.map((x, i) => `<button class="oc-fila" data-r="${i}"><div class="oc-mini">${poster(x, "mini")}</div>
                <div class="izq"><div>${esc(x.titulo)}</div><div class="sub">${esc([x.autor, x.anio].filter(Boolean).join(", "))}${x.original && x.original !== x.titulo ? ` <span>(${esc(x.original)})</span>` : ""}</div></div></button>`).join("")}</div>
            ${q ? `<button class="oc-enlace" data-h="manual">No aparece: añadir sin portada</button>` : ""}
            <div class="oc-acciones"><button class="boton secundario" data-h="cerrar">Cerrar</button></div>`;
          const inp = h.paso.querySelector("#ocQ");
          inp.addEventListener("keydown", e => { if (e.key === "Enter") buscar(inp.value); });
          if (!q) setTimeout(() => inp.focus(), 50);
        }
        async function buscar(q) {
          q = (q || "").trim(); if (!q) return;
          if (tipo !== "libro" && !d.tmdb) { h.cerrar(); return hojaClave(() => hojaAnadir(tipo, estado)); }
          resultados = []; estadoBusq = "Buscando…"; pasoBuscar(q);
          try {
            resultados = tipo === "libro" ? await buscarLibros(q) : await buscarTMDB(tipo, q);
            estadoBusq = resultados.length ? "" : "Sin resultados. Prueba con otro título o añádelo sin portada.";
          } catch (e) {
            estadoBusq = e.message === "clave" ? "La clave de TMDB no funciona. Revísala en \"Configurar clave de TMDB\", abajo del todo en Pelis o Series." : "No se ha podido buscar (¿sin conexión?). Prueba de nuevo en un momento.";
          }
          if (h.f.isConnected) pasoBuscar(q);
        }
        h.paso.addEventListener("click", e => {
          const el = e.target.closest("[data-h],[data-r],[data-t]"); if (!el) return;
          if (el.dataset.t) { tipo = el.dataset.t; resultados = []; estadoBusq = ""; return pasoBuscar(h.paso.querySelector("#ocQ").value); }
          if (el.dataset.h === "cerrar") return h.cerrar();
          if (el.dataset.h === "buscar") return buscar(h.paso.querySelector("#ocQ").value);
          const base = { id: nuevoId(), tipo, estado, creado: Date.now() };
          if (el.dataset.h === "manual") return siguiente(Object.assign(base, { titulo: h.paso.querySelector("#ocQ").value.trim(), anio: "", autor: "", img: null }));
          if (el.dataset.r) { const r = resultados[+el.dataset.r]; return siguiente(Object.assign(base, { titulo: r.titulo, anio: r.anio, autor: r.autor || "", img: r.img })); }
        });
        function siguiente(item) {
          if (!item.titulo) return;
          if (estado === "pendiente") { d.items.push(item); guardar(); h.cerrar(); pintar(); return; }
          h.cerrar(); hojaNota(item, true);
        }
        pasoBuscar("");
      }

      // Nota y fecha (para añadir, editar o pasar de pendiente a visto)
      function hojaNota(item, nuevo) {
        const h = abrirHoja();
        const nota = item.nota != null ? item.nota : 7;
        const existe = d.items.includes(item) && item.estado === "visto";
        h.paso.innerHTML = `<div class="oc-elegido"><div class="oc-mini">${poster(item, "mini")}</div>
            <div><h2 style="margin:0">${esc(item.titulo)}</h2><div class="oc-nota-txt" style="margin:2px 0 0">${esc([item.autor, item.anio].filter(Boolean).join(", "))}</div></div></div>
          <label>Tu nota</label>
          <div class="oc-nota-grande" id="ocN">${fNota(nota)}</div>
          <input type="range" class="oc-rango" id="ocR" min="0" max="10" step="0.5" value="${nota}">
          <div class="oc-marcas"><span>0</span><span>5</span><span>10</span></div>
          <label>${item.tipo === "libro" ? "Terminado el" : "Visto el"}</label><input type="date" id="ocF" value="${item.fecha || hoyK()}" max="${hoyK()}">
          <div class="oc-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>
          ${existe ? `<button class="oc-peligro" data-h="borrar">Borrar</button>` : ""}`;
        const rango = h.paso.querySelector("#ocR");
        rango.addEventListener("input", () => h.paso.querySelector("#ocN").textContent = fNota(rango.value));
        h.paso.addEventListener("click", e => {
          const a = e.target.dataset.h;
          if (a === "c") h.cerrar();
          if (a === "g") {
            item.nota = parseFloat(rango.value); item.fecha = h.paso.querySelector("#ocF").value || hoyK(); item.estado = "visto";
            if (!d.items.includes(item)) d.items.push(item);
            guardar(); h.cerrar(); vista = item.tipo; pintar();
          }
          if (a === "borrar" && confirm("¿Borrar " + item.titulo + "?")) { d.items = d.items.filter(x => x !== item); guardar(); h.cerrar(); pintar(); }
        });
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion, item = d.items.find(x => x.id === b.dataset.id);
        if (a === "vista") vista = b.dataset.v;
        else if (a === "orden") orden = b.dataset.o;
        else if (a === "filtro") filtro = b.dataset.f;
        else if (a === "anadir") return hojaAnadir(b.dataset.tipo, b.dataset.estado);
        else if (a === "editar") return hojaNota(item);
        else if (a === "ya-visto") return hojaNota(item);
        else if (a === "quitar") { d.items = d.items.filter(x => x !== item); guardar(); }
        else if (a === "clave") return hojaClave();
        pintar();
      });

      pintar();
    }
  });
})();
