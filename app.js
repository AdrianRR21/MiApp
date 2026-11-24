/*
  NÚCLEO DE LA APP
  - Guarda los datos en el dispositivo (IndexedDB), cada pantalla en su "cajón".
  - Si conectas la nube (Firebase), sincroniza cada cajón entre tus dispositivos.
    Gana siempre el cambio más reciente de cada cajón. Sin conexión, todo sigue funcionando
    y los cambios se suben en cuanto vuelve internet.
  - Monta la navegación (barra lateral en el ordenador, menú desplegable en el móvil).
  - Exporta e importa copias de seguridad.
  Normalmente no hará falta tocar este archivo al trabajar en una pantalla.
*/
const HiperApp = (() => {
  const CLAVE = "hiperapp-datos";

  // NOMBRE, COLOR Y GRUPO DE CADA PANTALLA (se cambian aquí, para todas a la vez)
  // "color" es el del tema oscuro y "claro" el del tema claro (algo más intenso para que se lea sobre blanco)
  const PANTALLAS = {
    vida:         { titulo: "Vida",            color: "#F5F5F7", claro: "#0B0B0C", grupo: "" },
    habitos:      { titulo: "Hábitos",         color: "#BF5AF2", claro: "#9A3BD6", grupo: "Día a día" },
    estudio:      { titulo: "Estudio",         color: "#FF6FB1", claro: "#D6266F", grupo: "Día a día" },
    alimentacion: { titulo: "Alimentación",    color: "#FF9F0A", claro: "#E07000", grupo: "Día a día" },
    gimnasio:     { titulo: "Deporte",         color: "#0A84FF", claro: "#0062D6", grupo: "Día a día" },
    patrimonio:   { titulo: "Finanzas",        color: "#30D158", claro: "#14923F", grupo: "Dinero" },
    inversiones:  { titulo: "Inversiones",     color: "#FFD60A", claro: "#B98500", grupo: "Dinero" },
    value:        { titulo: "Value Investing", color: "#7D7AFF", claro: "#5653D9", grupo: "Dinero" },
    ocio:         { titulo: "Ocio",            color: "#C49A6C", claro: "#9C6A3A", grupo: "Tiempo libre" },
    viajes:       { titulo: "Viajes",          color: "#40C8E0", claro: "#0A8BA6", grupo: "Tiempo libre" }
  };
  const GRUPOS = ["", "Día a día", "Dinero", "Tiempo libre"];
  const suave = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pestanas = [];
  let datos = {};   // {cajón: datos de esa pantalla}
  let meta = {};    // {cajón: momento (ms) del último cambio}
  let nube = null;  // {apiKey, dbUrl, email, uid, refresh, token, expira, ultimo}
  let actual = null;

  // =====================================================================
  //  GUARDADO EN EL DISPOSITIVO (IndexedDB, con localStorage de respaldo)
  // =====================================================================
  let bd = null, cola = Promise.resolve(), avisado = false;
  const abrirBD = () => new Promise((ok, mal) => {
    const r = indexedDB.open("hiperapp", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("datos");
    r.onsuccess = () => ok(r.result); r.onerror = () => mal(r.error);
  });
  const leerBD = clave => new Promise((ok, mal) => { const r = bd.transaction("datos").objectStore("datos").get(clave); r.onsuccess = () => ok(r.result); r.onerror = () => mal(r.error); });
  const escribirBD = (pares) => new Promise((ok, mal) => {
    const t = bd.transaction("datos", "readwrite"), s = t.objectStore("datos");
    Object.entries(pares).forEach(([k, v]) => v === undefined ? s.delete(k) : s.put(v, k));
    t.oncomplete = ok; t.onerror = () => mal(t.error); t.onabort = () => mal(t.error);
  });
  const lsLeer = k => { try { const v = localStorage.getItem(CLAVE + (k === "todo" ? "" : "-" + k)); return v === null ? undefined : v; } catch (e) { return undefined; } };
  const lsEscribir = (k, v) => { const n = CLAVE + (k === "todo" ? "" : "-" + k); if (v === undefined) localStorage.removeItem(n); else localStorage.setItem(n, v); };

  async function cargar() {
    let texto, textoMeta, textoNube;
    try {
      bd = await abrirBD();
      texto = await leerBD("todo"); textoMeta = await leerBD("meta"); textoNube = await leerBD("nube");
      if (!texto) {   // primera vez con IndexedDB: se traen los datos que había en localStorage
        const viejo = lsLeer("todo");
        if (viejo) { texto = viejo; await escribirBD({ todo: viejo }); if (await leerBD("todo") === viejo) localStorage.removeItem(CLAVE); }
      }
    } catch (e) {
      bd = null; texto = lsLeer("todo"); textoMeta = lsLeer("meta"); textoNube = lsLeer("nube");
    }
    try { datos = texto ? JSON.parse(texto) : {}; } catch (e) { datos = {}; }
    try { meta = textoMeta ? JSON.parse(textoMeta) : {}; } catch (e) { meta = {}; }
    try { nube = textoNube ? JSON.parse(textoNube) : null; } catch (e) { nube = null; }
    // Datos de antes de la nube: se marcan como "antiguos" para que no pisen los de otro dispositivo
    Object.keys(datos).forEach(k => { if (!meta[k]) meta[k] = 1; });
  }
  function persistir(extra = {}) {
    const pares = Object.assign({ todo: JSON.stringify(datos), meta: JSON.stringify(meta) }, extra);
    const fallo = () => { if (!avisado) { avisado = true; alert("No se han podido guardar los datos. Haz una copia de seguridad desde Ajustes."); } };
    if (!bd) { try { Object.entries(pares).forEach(([k, v]) => lsEscribir(k, v)); } catch (e) { fallo(); } return; }
    cola = cola.then(() => escribirBD(pares)).catch(() => { try { Object.entries(pares).forEach(([k, v]) => lsEscribir(k, v)); } catch (e) { fallo(); } });
  }
  const guardarNube = () => persistir({ nube: nube ? JSON.stringify(nube) : undefined });
  function guardar(id) {
    meta[id] = Date.now();
    persistir();
    Nube.programar(id);
  }

  // Cada pantalla recibe un almacén propio: store.get() y store.set(valor)
  function almacen(id) {
    return {
      get: (porDefecto) => (datos[id] === undefined ? porDefecto : datos[id]),
      set: (valor) => { datos[id] = valor; guardar(id); }
    };
  }

  // =====================================================================
  //  NUBE (Firebase Realtime Database + Firebase Auth con email, por REST)
  //  Estructura: /usuarios/{uid}/meta/{cajón} = momento,  /usuarios/{uid}/datos/{cajón} = texto JSON
  // =====================================================================
  const Nube = (() => {
    let estado = "local", temporizador = null, enCurso = null, repetir = false, mensaje = "";
    const pendientes = new Set();
    const conectada = () => !!(nube && nube.uid && nube.refresh);
    const ERRORES = {
      EMAIL_NOT_FOUND: "No hay ninguna cuenta con ese email. Usa \"Crear cuenta\" la primera vez.",
      INVALID_PASSWORD: "Contraseña incorrecta.", INVALID_LOGIN_CREDENTIALS: "Email o contraseña incorrectos.",
      INVALID_EMAIL: "El email no es válido.", EMAIL_EXISTS: "Ya existe una cuenta con ese email: pulsa \"Entrar\".",
      OPERATION_NOT_ALLOWED: "En Firebase falta activar el acceso con email y contraseña (Authentication → Sign-in method).",
      ADMIN_ONLY_OPERATION: "En Firebase está desactivada la creación de cuentas. Créala desde la consola o vuelve a activarla.",
      USER_DISABLED: "Esta cuenta está desactivada en Firebase.", TOO_MANY_ATTEMPTS_TRY_LATER: "Demasiados intentos. Espera unos minutos."
    };
    const traducir = m => { m = String(m || ""); if (m.startsWith("WEAK_PASSWORD")) return "La contraseña debe tener al menos 6 caracteres."; if (/API key not valid|API_KEY_INVALID/.test(m)) return "La clave de API (apiKey) no es válida."; return ERRORES[m.split(" ")[0]] || m || "Error desconocido."; };

    function pintarEstado() {
      const textos = { local: "Solo en este dispositivo", ok: "Sincronizado", sync: "Sincronizando…", offline: "Sin conexión · se subirá luego", error: "Error de sincronización" };
      let t = textos[estado];
      if (estado === "ok" && nube && nube.ultimo) { const min = Math.round((Date.now() - nube.ultimo) / 60000); t += min < 1 ? " · ahora" : min < 60 ? " · hace " + min + " min" : ""; }
      document.querySelectorAll(".nube-estado, .nube-punto").forEach(el => { el.dataset.estado = estado; el.title = mensaje || t; });
      const tx = document.getElementById("nubeTexto"); if (tx) tx.textContent = t;
    }
    const poner = (e, m = "") => { estado = e; mensaje = m; pintarEstado(); };

    async function authFetch(url, cuerpo, form) {
      const r = await fetch(url, form ? { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: cuerpo }
        : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(traducir(j.error && j.error.message));
      return j;
    }
    async function token() {
      if (nube.token && Date.now() < nube.expira - 60000) return nube.token;
      const j = await authFetch("https://securetoken.googleapis.com/v1/token?key=" + encodeURIComponent(nube.apiKey),
        "grant_type=refresh_token&refresh_token=" + encodeURIComponent(nube.refresh), true);
      nube.token = j.id_token; nube.refresh = j.refresh_token; nube.expira = Date.now() + (Number(j.expires_in) || 3600) * 1000;
      guardarNube();
      return nube.token;
    }
    async function bd_(ruta, opciones = {}) {
      const t = await token();
      const r = await fetch(`${nube.dbUrl}/usuarios/${nube.uid}${ruta}.json?auth=${encodeURIComponent(t)}`, opciones);
      if (r.status === 401 || r.status === 403) throw new Error("La base de datos ha rechazado el acceso. Revisa las reglas de Firebase (paso 4).");
      if (r.status === 404) throw new Error("No se encuentra la base de datos. Revisa la dirección (databaseURL).");
      if (!r.ok) throw new Error("La base de datos ha respondido con un error (" + r.status + ").");
      return r.json();
    }

    // Compara cajón a cajón con la nube: baja lo que es más nuevo allí y sube lo que es más nuevo aquí
    async function sincronizar() {
      if (!conectada()) { poner("local"); return; }
      if (enCurso) { repetir = true; return enCurso; }
      clearTimeout(temporizador);
      enCurso = (async () => {
        if (!navigator.onLine) { poner("offline"); return; }
        poner("sync");
        try {
          const remoto = (await bd_("/meta")) || {};
          const bajar = Object.keys(remoto).filter(k => remoto[k] > (meta[k] || 0));
          const subir = Object.keys(datos).filter(k => (meta[k] || 0) > (remoto[k] || 0) || (pendientes.has(k) && !bajar.includes(k)));
          const cambiados = [];
          await Promise.all(bajar.map(async k => {
            const v = await bd_("/datos/" + encodeURIComponent(k));
            if (typeof v === "string") { datos[k] = JSON.parse(v); meta[k] = remoto[k]; cambiados.push(k); }
          }));
          if (subir.length) {
            const cuerpo = {};
            subir.forEach(k => { cuerpo["datos/" + k] = JSON.stringify(datos[k]); cuerpo["meta/" + k] = meta[k]; });
            const texto = JSON.stringify(cuerpo);
            await bd_("", { method: "PATCH", body: texto, keepalive: texto.length < 60000 });
          }
          subir.forEach(k => pendientes.delete(k)); bajar.forEach(k => pendientes.delete(k));
          nube.ultimo = Date.now();
          if (cambiados.length) persistir({ nube: JSON.stringify(nube) }); else guardarNube();
          poner("ok");
          if (cambiados.length) refrescarSiSeguro(cambiados);
        } catch (e) {
          if (!navigator.onLine || e instanceof TypeError) poner("offline", "Sin conexión"); else poner("error", e.message);
        }
      })();
      try { await enCurso; } finally { enCurso = null; if (repetir) { repetir = false; programar(); } }
    }
    function programar(id) {
      if (id) pendientes.add(id);
      if (!conectada()) return;
      clearTimeout(temporizador);
      temporizador = setTimeout(sincronizar, 1500);
    }

    // Entrar o crear cuenta. Si ya hay datos en los dos sitios, se pregunta cuáles conservar.
    async function entrar(apiKey, dbUrl, email, clave, crear) {
      apiKey = apiKey.trim(); dbUrl = dbUrl.trim().replace(/\/+$/, "");
      if (!/^https:\/\/.+/.test(dbUrl)) throw new Error("La dirección de la base de datos debe empezar por https://");
      const j = await authFetch(`https://identitytoolkit.googleapis.com/v1/accounts:${crear ? "signUp" : "signInWithPassword"}?key=` + encodeURIComponent(apiKey),
        { email: email.trim(), password: clave, returnSecureToken: true });
      nube = { apiKey, dbUrl, email: j.email || email.trim(), uid: j.localId, refresh: j.refreshToken, token: j.idToken, expira: Date.now() + (Number(j.expiresIn) || 3600) * 1000, ultimo: 0 };
      const remoto = (await bd_("/meta")) || {};
      const hayRemoto = Object.keys(remoto).length > 0;
      const hayLocal = Object.keys(datos).some(k => datos[k] && JSON.stringify(datos[k]).length > 2);
      let eleccion = hayRemoto ? "nube" : "local";
      if (hayRemoto && hayLocal) eleccion = await preguntarOrigen();
      if (!eleccion) { nube = null; throw new Error("Conexión cancelada."); }
      if (eleccion === "nube") {
        // Por si acaso, se guarda aparte lo que había en este dispositivo antes de sustituirlo
        persistir({ "antes-de-nube": JSON.stringify({ fecha: new Date().toISOString(), datos }) });
        Object.keys(meta).forEach(k => { meta[k] = 0; });
      } else {
        const ahora = Date.now(); Object.keys(datos).forEach(k => { meta[k] = ahora; });
      }
      guardarNube();
      await sincronizar();
      if (estado === "error") throw new Error(mensaje);
      mostrar(actual, true);
    }
    function preguntarOrigen() {
      return new Promise(ok => {
        const f = document.createElement("div"); f.className = "panel-fondo"; f.style.zIndex = 40;
        f.innerHTML = `<div class="panel" role="dialog"><h2>¿Qué datos conservas?</h2>
          <p class="aviso">Hay datos tanto en la nube como en este dispositivo. Si ya conectaste otro dispositivo antes, lo normal es usar los de la nube.</p>
          <div class="ajustes-botones"><button class="boton" data-o="nube">Usar los de la nube</button>
          <button class="boton secundario" data-o="local">Subir los de este dispositivo</button></div>
          <p class="aviso">La opción que no elijas se sustituye. Si eliges la nube, lo de este dispositivo queda guardado aparte por seguridad.</p>
          <button class="ajustes-enlace" data-o="">Cancelar</button></div>`;
        document.body.appendChild(f);
        f.addEventListener("click", e => { const o = e.target.dataset.o; if (o === undefined) return; f.remove(); ok(o || null); });
      });
    }
    function salir() { nube = null; pendientes.clear(); guardarNube(); poner("local"); }

    // Avisos para sincronizar: al volver a la app, al recuperar conexión, cada 30 s y al salir
    function vigilar() {
      document.addEventListener("visibilitychange", () => { if (!conectada()) return; if (document.hidden) { if (pendientes.size) sincronizar(); } else sincronizar(); });
      window.addEventListener("online", () => sincronizar());
      window.addEventListener("offline", () => { if (conectada()) poner("offline"); });
      setInterval(() => { if (!document.hidden && conectada()) sincronizar(); else pintarEstado(); }, 30000);
    }
    return { sincronizar, programar, entrar, salir, conectada, vigilar, pintarEstado, poner, estado: () => estado, mensaje: () => mensaje };
  })();

  // Si llegan cambios de otro dispositivo, se vuelve a pintar la pantalla, salvo que estés escribiendo
  function refrescarSiSeguro(cambiados) {
    const p = pestanas.find(x => x.id === actual); if (!p) return;
    const usa = p.usa || [p.datos || p.id];
    if (!usa.some(k => cambiados.includes(k))) return;
    const a = document.activeElement;
    if (document.querySelector(".panel-fondo") || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) { refrescoPendiente = true; return; }
    mostrar(actual, true);
  }
  let refrescoPendiente = false;
  document.addEventListener("click", () => { if (refrescoPendiente && !document.querySelector(".panel-fondo")) { refrescoPendiente = false; setTimeout(() => mostrar(actual, true), 0); } }, true);

  // =====================================================================
  //  PANTALLAS Y NAVEGACIÓN
  // =====================================================================
  function registrar(p) { Object.assign(p, PANTALLAS[p.id] || {}); p.nombreCorto = p.titulo; pestanas.push(p); }

  // =====================================================================
  //  TEMA CLARO / OSCURO (se recuerda en cada dispositivo)
  // =====================================================================
  const TEMA = "hiperapp-tema";
  const sistemaClaro = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  const temaElegido = () => { try { return localStorage.getItem(TEMA) || "oscuro"; } catch (e) { return "oscuro"; } };   // oscuro | claro | auto
  const temaReal = () => { const t = temaElegido(); return t === "auto" ? (sistemaClaro && sistemaClaro.matches ? "claro" : "oscuro") : t; };
  const claroActivo = () => document.documentElement.dataset.tema === "claro";
  // Color de una pantalla en el tema actual
  function icono(id) { const p = pestanas.find(x => x.id === id); return p ? p.icono || "" : ""; }
  function color(id) { const p = PANTALLAS[id]; return p ? (claroActivo() ? p.claro : p.color) : "#888888"; }
  function aplicarTema(animar) {
    const raiz = document.documentElement, nuevo = temaReal();
    if (animar) { raiz.classList.add("cambiando-tema"); setTimeout(() => raiz.classList.remove("cambiando-tema"), 450); }
    raiz.dataset.tema = nuevo;
    const fondo = nuevo === "claro" ? "#F3F2EF" : "#000000";
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute("content", fondo));
    document.querySelectorAll("#menuLista button").forEach(b => { const c = color(b.dataset.id); b.style.setProperty("--c", c); b.style.setProperty("--c-suave", suave(c, nuevo === "claro" ? 0.12 : 0.16)); });
    document.querySelectorAll("[data-tema-op]").forEach(b => b.classList.toggle("on", b.dataset.temaOp === temaElegido()));
    if (actual) mostrar(actual, true);
  }
  function ponerTema(t) { try { localStorage.setItem(TEMA, t); } catch (e) {} aplicarTema(true); }
  if (sistemaClaro && sistemaClaro.addEventListener) sistemaClaro.addEventListener("change", () => { if (temaElegido() === "auto") aplicarTema(true); });
  const ordenadas = () => GRUPOS.flatMap(g => pestanas.filter(p => (p.grupo || "") === g));

  function mostrar(id, mantenerScroll) {
    const p = pestanas.find(x => x.id === id) || pestanas.find(x => x.id === "vida") || pestanas[0];
    actual = p.id;
    const raizCss = document.documentElement.style, c = color(p.id), claro = claroActivo();
    raizCss.setProperty("--naranja", c);        // color de acento que usan todas las pantallas
    raizCss.setProperty("--naranja-suave", suave(c, claro ? 0.1 : 0.14));
    raizCss.setProperty("--brillo", suave(p.id === "vida" ? (claro ? "#9A3BD6" : "#7D7AFF") : c, claro ? 0.07 : 0.11));
    raizCss.setProperty("--acento", c);
    document.body.dataset.pantalla = p.id;
    const fechaHoy = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: innerWidth < 520 ? "short" : "long" }).replace(".", "");
    const tit = document.getElementById("titulo"); tit.textContent = p.titulo; tit.classList.toggle("largo", p.titulo.length > 11);
    document.getElementById("tituloIcono").innerHTML = p.icono || "";
    document.getElementById("bmIcono").innerHTML = p.icono || "";
    document.getElementById("bmTitulo").textContent = p.titulo;
    if (!mantenerScroll) document.body.classList.remove("desplazado");
    document.getElementById("supertitulo").textContent = p.id === "vida" ? fechaHoy : (p.grupo || "");
    document.title = p.titulo + " · Mi app";
    document.querySelectorAll("#menuLista button").forEach(b => {
      if (b.dataset.id === p.id) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    const cont = document.getElementById("contenido");
    const y = window.scrollY;
    cont.className = (p.ancho ? "ancho" : "") + (mantenerScroll ? "" : " entra");
    clearTimeout(mostrar.t); mostrar.t = setTimeout(() => cont.classList.remove("entra"), 450);   // la animación de entrada no debe quedarse puesta
    cont.innerHTML = "";
    p.render(cont, almacen(p.datos || p.id));   // "datos" permite que una pantalla comparta los datos de otra
    window.scrollTo(0, mantenerScroll ? y : 0);
    try { localStorage.setItem("hiperapp-ultima", p.id); } catch (e) {}
  }
  function ir(id) { location.hash = id; }

  function abrirMenu(abrir) {
    document.body.classList.toggle("menu-abierto", abrir);
    document.getElementById("btnMenu").setAttribute("aria-expanded", abrir);
  }
  function montarMenu() {
    const lista = document.getElementById("menuLista");
    let grupo = null;
    ordenadas().forEach(p => {
      if ((p.grupo || "") !== grupo) {
        grupo = p.grupo || "";
        if (grupo) { const t = document.createElement("div"); t.className = "menu-grupo"; t.textContent = grupo; lista.appendChild(t); }
      }
      const b = document.createElement("button");
      b.dataset.id = p.id;
      b.innerHTML = "<i>" + p.icono + "</i><span>" + p.titulo + "</span>";
      b.addEventListener("click", () => { abrirMenu(false); if (location.hash.slice(1) === p.id) mostrar(p.id); else ir(p.id); });
      lista.appendChild(b);
    });
    document.getElementById("btnMenu").onclick = () => abrirMenu(true);
    document.querySelectorAll("[data-abrir-menu]").forEach(b => b.onclick = () => abrirMenu(true));
    // Al bajar, la cabecera grande se va y aparece una barra compacta
    addEventListener("scroll", () => document.body.classList.toggle("desplazado", scrollY > 96), { passive: true });
    document.getElementById("menuFondo").onclick = () => abrirMenu(false);
    document.getElementById("btnCopias").onclick = () => { abrirMenu(false); abrirAjustes(); };
    document.getElementById("btnNube").onclick = () => { abrirMenu(false); abrirAjustes(); };
    document.getElementById("btnNubeTop").onclick = () => abrirAjustes();
    document.getElementById("btnTema").onclick = () => ponerTema(claroActivo() ? "oscuro" : "claro");
    document.querySelectorAll("#menu [data-tema-op]").forEach(b => b.onclick = () => ponerTema(b.dataset.temaOp));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { abrirMenu(false); const f = [...document.querySelectorAll(".panel-fondo")].pop(); if (f) f.remove(); } });
    let x0 = null;
    const menu = document.getElementById("menu");
    menu.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    menu.addEventListener("touchend", e => { if (x0 !== null && x0 - e.changedTouches[0].clientX > 50) abrirMenu(false); x0 = null; });
  }

  // =====================================================================
  //  AJUSTES: NUBE Y COPIAS DE SEGURIDAD
  // =====================================================================
  async function exportar() {
    const fecha = new Date().toISOString().slice(0, 10);
    const nombre = "copia-miapp-" + fecha + ".json";
    const blob = new Blob([JSON.stringify({ app: "hiperapp", fecha, datos }, null, 2)], { type: "application/json" });
    const archivo = new File([blob], nombre, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: nombre }); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nombre; a.click();
  }
  function importar() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = async () => {
      try {
        const contenido = JSON.parse(await input.files[0].text());
        if (contenido.app !== "hiperapp") throw new Error();
        if (!confirm("Esto sustituirá todos los datos actuales por los de la copia del " + contenido.fecha + (Nube.conectada() ? ", también en la nube" : "") + ". ¿Continuar?")) return;
        datos = contenido.datos || {};
        const ahora = Date.now(); Object.keys(datos).forEach(k => { meta[k] = ahora; Nube.programar(k); });
        persistir();
        cerrarAjustes(); mostrar(actual);
        alert("Copia restaurada.");
      } catch (e) { alert("Ese archivo no es una copia de seguridad de esta app."); }
    };
    input.click();
  }

  let conexionPendiente = null;   // datos de conexión que llegan por enlace desde otro dispositivo
  function abrirAjustes() {
    cerrarAjustes();
    const fondo = document.createElement("div");
    fondo.className = "panel-fondo"; fondo.id = "ajustes";
    fondo.innerHTML = `<div class="panel ajustes" role="dialog" aria-label="Ajustes">
      <div class="ajustes-seccion"><div class="ajustes-tit">Apariencia</div>
        <div class="temas">${[["oscuro", "Oscuro", "o"], ["claro", "Claro", "c"], ["auto", "Automático", "a"]].map(([id, n, k]) => `<button data-tema-op="${id}" class="${temaElegido() === id ? "on" : ""}"><span class="mini ${k}"></span>${n}</button>`).join("")}</div>
        <p class="aviso">Automático sigue el modo claro u oscuro del dispositivo. Se recuerda en cada dispositivo por separado.</p></div>
      <div id="ajNube"></div>
      <div class="ajustes-seccion"><div class="ajustes-tit">Copias de seguridad</div>
        <p class="aviso">Un archivo con todos tus datos, para guardarlo donde quieras (Archivos, iCloud Drive…). ${Nube.conectada() ? "Con la nube no es imprescindible, pero es una buena red de seguridad." : "Mientras no conectes la nube, es la única forma de no perder nada si borras la app o cambias de dispositivo."}</p>
        <div class="ajustes-botones"><button class="boton secundario" id="btnExportar">Guardar copia</button><button class="boton secundario" id="btnImportar">Restaurar copia</button></div>
      </div>
      <button class="ajustes-enlace" id="btnCerrarAj">Cerrar</button></div>`;
    fondo.addEventListener("click", e => { if (e.target === fondo) cerrarAjustes(); });
    document.body.appendChild(fondo);
    document.getElementById("btnExportar").onclick = exportar;
    document.getElementById("btnImportar").onclick = importar;
    document.getElementById("btnCerrarAj").onclick = cerrarAjustes;
    fondo.querySelectorAll("[data-tema-op]").forEach(b => b.onclick = () => ponerTema(b.dataset.temaOp));
    pintarNube();
  }
  function cerrarAjustes() { const a = document.getElementById("ajustes"); if (a) a.remove(); }

  function pintarNube(error) {
    const caja = document.getElementById("ajNube"); if (!caja) return;
    // Si se repinta por un error, se conserva lo que ya estaba escrito
    const previo = {}; ["ajKey", "ajUrl", "ajEmail"].forEach(id => { const el = document.getElementById(id); if (el) previo[id] = el.value; });
    if (Nube.conectada()) {
      const enlace = location.origin + location.pathname + "#conectar=" + btoa(JSON.stringify({ k: nube.apiKey, u: nube.dbUrl }));
      caja.innerHTML = `<div class="ajustes-seccion"><div class="ajustes-tit">Nube</div>
        <div class="nube-tarjeta" data-estado="${Nube.estado()}"><i></i><div><b>${esc(nube.email)}</b><span>${Nube.estado() === "error" ? esc(Nube.mensaje()) : Nube.estado() === "offline" ? "Sin conexión: los cambios se subirán al volver internet" : nube.ultimo ? "Última sincronización: " + new Date(nube.ultimo).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Conectado"}</span></div></div>
        <div class="ajustes-botones"><button class="boton" id="ajSync">Sincronizar ahora</button><button class="boton secundario" id="ajEnlace">Copiar enlace para otro dispositivo</button></div>
        <p class="aviso">Abre ese enlace en el otro dispositivo (el ordenador, por ejemplo) y entra con el mismo email y contraseña. El enlace no incluye tu contraseña.</p>
        <button class="ajustes-enlace peligro" id="ajSalir">Desconectar este dispositivo</button></div>`;
      document.getElementById("ajSync").onclick = async () => { await Nube.sincronizar(); pintarNube(); };
      document.getElementById("ajEnlace").onclick = async () => {
        try { await navigator.clipboard.writeText(enlace); alert("Enlace copiado. Ábrelo en el otro dispositivo."); }
        catch (e) { prompt("Copia este enlace y ábrelo en el otro dispositivo:", enlace); }
      };
      document.getElementById("ajSalir").onclick = () => {
        if (!confirm("¿Desconectar este dispositivo de la nube? Tus datos se quedan aquí y en la nube; solo deja de sincronizar.")) return;
        Nube.salir(); pintarNube();
      };
      return;
    }
    const pre = Object.assign({}, conexionPendiente || {});
    if (previo.ajKey) pre.k = previo.ajKey; if (previo.ajUrl) pre.u = previo.ajUrl;
    const oculto = conexionPendiente && conexionPendiente.k && !error;
    caja.innerHTML = `<div class="ajustes-seccion"><div class="ajustes-tit">Nube</div>
      <p class="aviso" style="margin-top:0">${pre.k ? "Datos de conexión recibidos. Entra con tu email y contraseña para sincronizar este dispositivo." : "Conecta tu base de datos de Firebase para tener los mismos datos en el móvil y en el ordenador. Solo se configura una vez."}</p>
      <div class="ajustes-form" ${oculto ? 'style="display:none"' : ""}>
        <label>Clave de API (apiKey)</label><input id="ajKey" value="${esc(pre.k || "")}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="AIza…">
        <label>Dirección de la base de datos</label><input id="ajUrl" value="${esc(pre.u || "")}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://….firebasedatabase.app">
      </div>
      <label>Email</label><input id="ajEmail" type="email" autocomplete="username" autocapitalize="off" value="${esc(previo.ajEmail || "")}">
      <label>Contraseña</label><input id="ajPass" type="password" autocomplete="current-password">
      ${error ? `<p class="aviso error">${esc(error)}</p>` : ""}
      <div class="ajustes-botones"><button class="boton" id="ajEntrar">Entrar</button><button class="boton secundario" id="ajCrear">Crear cuenta</button></div>
      <p class="aviso">"Crear cuenta" solo la primera vez, en el primer dispositivo. En los demás, "Entrar".</p></div>`;
    const go = async crear => {
      const v = id => document.getElementById(id).value;
      if (!v("ajKey").trim() || !v("ajUrl").trim()) return pintarNube("Falta la clave de API o la dirección de la base de datos.");
      if (!v("ajEmail").trim() || !v("ajPass")) return pintarNube("Escribe tu email y tu contraseña.");
      const btn = document.getElementById(crear ? "ajCrear" : "ajEntrar"); btn.disabled = true; btn.textContent = "Conectando…";
      try { await Nube.entrar(v("ajKey"), v("ajUrl"), v("ajEmail"), v("ajPass"), crear); conexionPendiente = null; pintarNube(); }
      catch (e) { Nube.poner(Nube.conectada() ? "error" : "local"); pintarNube(e instanceof TypeError ? "No se ha podido conectar. Revisa la dirección de la base de datos y tu conexión." : e.message); }
    };
    document.getElementById("ajEntrar").onclick = () => go(false);
    document.getElementById("ajCrear").onclick = () => go(true);
  }

  // =====================================================================
  //  ARRANQUE
  // =====================================================================
  async function iniciar() {
    await cargar();
    montarMenu();
    aplicarTema(false);
    document.getElementById("btnAjustes").onclick = abrirAjustes;
    // ¿Llega un enlace de conexión desde otro dispositivo?
    const h = location.hash;
    if (h.startsWith("#conectar=")) {
      try { conexionPendiente = JSON.parse(atob(h.slice(10))); } catch (e) {}
      history.replaceState(null, "", location.pathname);
    }
    window.addEventListener("hashchange", () => mostrar(location.hash.slice(1)));
    mostrar(location.hash.slice(1) || "vida");
    if (conexionPendiente && !Nube.conectada()) abrirAjustes();
    Nube.pintarEstado();
    Nube.vigilar();
    Nube.sincronizar();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

    // Cambio de día: si la app se quedó abierta de un día para otro, se recarga para volver a "hoy"
    const fecha = () => new Date().toDateString();
    const diaInicio = fecha();
    const comprobarDia = () => { if (fecha() !== diaInicio) location.reload(); };
    document.addEventListener("visibilitychange", () => { if (!document.hidden) comprobarDia(); });
    window.addEventListener("focus", comprobarDia);
    setInterval(comprobarDia, 60000);
  }

  return { registrar, iniciar, almacen, ir, color, icono, tema: () => document.documentElement.dataset.tema, nombre: "Adrián" };
})();
