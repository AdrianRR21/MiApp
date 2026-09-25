/*
  NÚCLEO DE LA APP
  - Guarda los datos en el propio iPhone (cada pestaña en su propio "cajón").
  - Monta el menú lateral y cambia entre pantallas.
  - Exporta e importa copias de seguridad.
  Normalmente no hará falta tocar este archivo al trabajar en una pestaña.
*/
const HiperApp = (() => {
  const CLAVE = "hiperapp-datos";

  // NOMBRE Y COLOR DE CADA PANTALLA (se cambian aquí, para todas a la vez)
  const PANTALLAS = {
    habitos:      { titulo: "Hábitos",      color: "#A970FF" },
    patrimonio:   { titulo: "Finanzas",     color: "#1FD67A" },
    alimentacion: { titulo: "Alimentación", color: "#FF7A1A" },
    gimnasio:     { titulo: "Deporte",      color: "#3B9EFF" },
    ocio:         { titulo: "Ocio",         color: "#B8814F" }
  };
  const suave = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
  const pestanas = [];
  let datos = {};

  function cargar() {
    try { datos = JSON.parse(localStorage.getItem(CLAVE)) || {}; }
    catch (e) { datos = {}; }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); }
    catch (e) { alert("No se han podido guardar los datos. Haz una copia de seguridad desde Ajustes."); }
  }

  // Cada pestaña recibe un almacén propio: store.get() y store.set(valor)
  function almacen(id) {
    return {
      get: (porDefecto) => (datos[id] === undefined ? porDefecto : datos[id]),
      set: (valor) => { datos[id] = valor; guardar(); }
    };
  }

  function registrar(p) { Object.assign(p, PANTALLAS[p.id] || {}); p.nombreCorto = p.titulo; pestanas.push(p); }

  function mostrar(id) {
    const p = pestanas.find(x => x.id === id) || pestanas[0];
    const raizCss = document.documentElement.style;
    raizCss.setProperty("--naranja", p.color);        // color de acento que usan todas las pantallas
    raizCss.setProperty("--naranja-suave", suave(p.color, 0.16));
    raizCss.setProperty("--acento", p.color);
    document.getElementById("titulo").textContent = p.titulo;
    document.title = p.titulo;
    document.querySelectorAll("#menuLista button").forEach(b => {
      if (b.dataset.id === p.id) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    const cont = document.getElementById("contenido");
    cont.innerHTML = "";
    p.render(cont, almacen(p.id));
    window.scrollTo(0, 0);
    try { localStorage.setItem("hiperapp-ultima", p.id); } catch (e) {}
  }

  // ---------- Menú lateral ----------
  function abrirMenu(abrir) {
    document.body.classList.toggle("menu-abierto", abrir);
    document.getElementById("menu").setAttribute("aria-hidden", !abrir);
    document.getElementById("btnMenu").setAttribute("aria-expanded", abrir);
  }
  function montarMenu() {
    const lista = document.getElementById("menuLista");
    pestanas.forEach(p => {
      const b = document.createElement("button");
      b.dataset.id = p.id;
      b.style.setProperty("--c", p.color);
      b.style.setProperty("--c-suave", suave(p.color, 0.14));
      b.innerHTML = p.icono + "<span>" + p.titulo + "</span>";
      b.addEventListener("click", () => { abrirMenu(false); location.hash = p.id; });
      lista.appendChild(b);
    });
    document.getElementById("btnMenu").onclick = () => abrirMenu(true);
    document.getElementById("menuFondo").onclick = () => abrirMenu(false);
    document.getElementById("btnCopias").onclick = () => { abrirMenu(false); abrirAjustes(); };
    // Deslizar hacia la izquierda cierra el menú
    let x0 = null;
    const menu = document.getElementById("menu");
    menu.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    menu.addEventListener("touchend", e => { if (x0 !== null && x0 - e.changedTouches[0].clientX > 50) abrirMenu(false); x0 = null; });
  }

  // ---------- Copias de seguridad ----------
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
        if (!confirm("Esto sustituirá todos los datos actuales por los de la copia del " + contenido.fecha + ". ¿Continuar?")) return;
        datos = contenido.datos || {}; guardar();
        cerrarAjustes(); mostrar(location.hash.slice(1));
        alert("Copia restaurada.");
      } catch (e) { alert("Ese archivo no es una copia de seguridad de esta app."); }
    };
    input.click();
  }

  function abrirAjustes() {
    const fondo = document.createElement("div");
    fondo.className = "panel-fondo"; fondo.id = "ajustes";
    fondo.innerHTML = `
      <div class="panel" role="dialog" aria-label="Ajustes">
        <h2>Copias de seguridad</h2>
        <p class="aviso">Tus datos solo están en este iPhone. Guarda una copia de vez en cuando (por ejemplo en Archivos o iCloud Drive) para no perderlos si borras la app o cambias de móvil.</p>
        <p style="margin-top:18px">
          <button class="boton" id="btnExportar">Guardar copia</button>
          <button class="boton secundario" id="btnImportar">Restaurar copia</button>
        </p>
      </div>`;
    fondo.addEventListener("click", e => { if (e.target === fondo) cerrarAjustes(); });
    document.body.appendChild(fondo);
    document.getElementById("btnExportar").onclick = exportar;
    document.getElementById("btnImportar").onclick = importar;
  }
  function cerrarAjustes() { const a = document.getElementById("ajustes"); if (a) a.remove(); }

  function iniciar() {
    cargar();
    montarMenu();
    document.getElementById("btnAjustes").onclick = abrirAjustes;
    window.addEventListener("hashchange", () => mostrar(location.hash.slice(1)));
    let inicial = location.hash.slice(1);
    if (!inicial) { try { inicial = localStorage.getItem("hiperapp-ultima"); } catch (e) {} }
    mostrar(inicial);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

    // Cambio de día: si la app se quedó abierta (o en segundo plano) de un día para otro,
    // se recarga sola para que todas las pestañas vuelvan a "hoy". Los datos no se tocan.
    const fecha = () => new Date().toDateString();
    const diaInicio = fecha();
    const comprobarDia = () => { if (fecha() !== diaInicio) location.reload(); };
    document.addEventListener("visibilitychange", () => { if (!document.hidden) comprobarDia(); });
    window.addEventListener("focus", comprobarDia);
    setInterval(comprobarDia, 60000);
  }

  return { registrar, iniciar };
})();
