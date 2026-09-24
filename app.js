/*
  NÚCLEO DE LA APP
  - Guarda los datos en el propio iPhone (cada pestaña en su propio "cajón").
  - Monta la barra de pestañas y cambia entre ellas.
  - Exporta e importa copias de seguridad.
  Normalmente no hará falta tocar este archivo al trabajar en una pestaña.
*/
const HiperApp = (() => {
  const CLAVE = "hiperapp-datos";
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

  function registrar(p) { pestanas.push(p); }

  function mostrar(id) {
    const p = pestanas.find(x => x.id === id) || pestanas[0];
    document.documentElement.style.setProperty("--acento", p.color);
    document.getElementById("titulo").textContent = p.titulo;
    document.title = p.titulo;
    document.querySelectorAll(".barra button").forEach(b => {
      if (b.dataset.id === p.id) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    const cont = document.getElementById("contenido");
    cont.innerHTML = "";
    p.render(cont, almacen(p.id));
    window.scrollTo(0, 0);
    try { localStorage.setItem("hiperapp-ultima", p.id); } catch (e) {}
  }

  function montarBarra() {
    const barra = document.getElementById("barra");
    pestanas.forEach(p => {
      const b = document.createElement("button");
      b.dataset.id = p.id;
      b.style.setProperty("--tab-color", p.color);
      b.innerHTML = p.icono + "<span>" + p.nombreCorto + "</span>";
      b.addEventListener("click", () => { location.hash = p.id; });
      barra.appendChild(b);
    });
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
    montarBarra();
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
