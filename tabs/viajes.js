/* PANTALLA: Viajes
   Mapa oscuro con los países visitados, lista de países con sus ciudades y registro de viajes con fechas.
   El mapa se descarga la primera vez (hace falta conexión) y luego queda guardado.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  // Tabla de países: código numérico ISO (3 cifras) + código de 2 letras + continente
  const TABLA = "533AWNA,004AFAS,024AOAF,660AINA,248AXEU,008ALEU,020ADEU,784AEAS,032ARSA,051AMAS,016ASOC,010AQAN,260TFAN,028AGNA,036AUOC,040ATEU,031AZAS,108BIAF,056BEEU,204BJAF,535BQNA,854BFAF,050BDAS,100BGEU,048BHAS,044BSNA,070BAEU,652BLNA,112BYEU,084BZNA,060BMNA,068BOSA,076BRSA,052BBNA,096BNAS,064BTAS,074BVAN,072BWAF,140CFAF,124CANA,166CCAS,756CHEU,152CLSA,156CNAS,384CIAF,120CMAF,180CDAF,178CGAF,184CKOC,170COSA,174KMAF,132CVAF,188CRNA,192CUNA,531CWNA,162CXAS,136KYNA,196CYAS,203CZEU,276DEEU,262DJAF,212DMNA,208DKEU,214DONA,012DZAF,218ECSA,818EGAF,232ERAF,732EHAF,724ESEU,233EEEU,231ETAF,246FIEU,242FJOC,238FKSA,250FREU,234FOEU,583FMOC,266GAAF,826GBEU,268GEAS,831GGEU,288GHAF,292GIEU,324GNAF,312GPNA,270GMAF,624GWAF,226GQAF,300GREU,308GDNA,304GLNA,320GTNA,254GFSA,316GUOC,328GYSA,344HKAS,334HMAN,340HNNA,191HREU,332HTNA,348HUEU,360IDAS,833IMEU,356INAS,086IOAS,372IEEU,364IRAS,368IQAS,352ISEU,376ILAS,380ITEU,388JMNA,832JEEU,400JOAS,392JPAS,398KZAS,404KEAF,417KGAS,116KHAS,296KIOC,659KNNA,410KRAS,414KWAS,418LAAS,422LBAS,430LRAF,434LYAF,662LCNA,438LIEU,144LKAS,426LSAF,440LTEU,442LUEU,428LVEU,446MOAS,663MFNA,504MAAF,492MCEU,498MDEU,450MGAF,462MVAS,484MXNA,584MHOC,807MKEU,466MLAF,470MTEU,104MMAS,499MEEU,496MNAS,580MPOC,508MZAF,478MRAF,500MSNA,474MQNA,480MUAF,454MWAF,458MYAS,175YTAF,516NAAF,540NCOC,562NEAF,574NFOC,566NGAF,558NINA,570NUOC,528NLEU,578NOEU,524NPAS,520NROC,554NZOC,512OMAS,586PKAS,591PANA,612PNOC,604PESA,608PHAS,585PWOC,598PGOC,616PLEU,630PRNA,408KPAS,620PTEU,600PYSA,275PSAS,258PFOC,634QAAS,638REAF,642ROEU,643RUEU,646RWAF,682SAAS,729SDAF,686SNAF,702SGAS,239GSSA,654SHAF,744SJEU,090SBOC,694SLAF,222SVNA,674SMEU,706SOAF,666PMNA,688RSEU,728SSAF,678STAF,740SRSA,703SKEU,705SIEU,752SEEU,748SZAF,534SXNA,690SCAF,760SYAS,796TCNA,148TDAF,768TGAF,764THAS,762TJAS,772TKOC,795TMAS,626TLAS,776TOOC,780TTNA,788TNAF,792TRAS,798TVOC,158TWAS,834TZAF,800UGAF,804UAEU,581UMOC,858UYSA,840USNA,860UZAS,336VAEU,670VCNA,862VESA,092VGNA,850VINA,704VNAS,548VUOC,876WFOC,882WSOC,887YEAS,710ZAAF,894ZMAF,716ZWAF";
  const PAISES = {};      // a2 -> {a2, num, cont}
  const POR_NUM = {};     // num -> a2
  TABLA.split(",").forEach(x => { const num = x.slice(0, 3), a2 = x.slice(3, 5), cont = x.slice(5, 7); PAISES[a2] = { a2, num, cont }; POR_NUM[num] = a2; });
  PAISES.XK = { a2: "XK", num: "", cont: "EU" };
  const SIN_CODIGO = { "Kosovo": "XK", "N. Cyprus": "CY", "Somaliland": "SO" };   // zonas del mapa sin código oficial
  const CONTINENTES = { EU: "Europa", AS: "Asia", NA: "América del Norte", SA: "América del Sur", AF: "África", OC: "Oceanía" };
  let nombres = null;
  try { nombres = new Intl.DisplayNames(["es"], { type: "region" }); } catch (e) {}
  const nombrePais = a2 => a2 === "XK" ? "Kosovo" : (nombres ? nombres.of(a2) : a2) || a2;
  const bandera = a2 => String.fromCodePoint(...[...a2].map(c => 127397 + c.charCodeAt(0)));
  const TOTAL_MUNDO = 195;
  const URLS = {
    d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js",
    topo: "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js",
    mapa: "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json"
  };

  const css = `
  .vj-seg { display:flex; background:none; border:1px solid var(--linea); border-radius:11px; padding:3px; margin-bottom:14px; }
  .vj-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:500; font-size:13.5px; padding:9px 0; border-radius:8px; cursor:pointer; }
  .vj-seg button.on { background:#1A1A1E; color:var(--tinta); }
  .vj-stats { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:12px; }
  .vj-stats div { border:1px solid var(--linea); border-radius:12px; padding:11px 10px; }
  .vj-stats b { display:block; font-size:22px; font-weight:600; letter-spacing:-0.04em; }
  .vj-stats span { font-size:11.5px; color:var(--tinta-suave); }
  .vj-mapa { position:relative; background:var(--papel); border:1px solid var(--linea); border-radius:14px; overflow:hidden; margin-bottom:12px; touch-action:none; }
  .vj-mapa svg { display:block; width:100%; height:auto; }
  .vj-mapa path.pais { fill:#26262C; stroke:#000; stroke-width:.5; vector-effect:non-scaling-stroke; cursor:pointer; transition:fill .2s; }
  .vj-mapa path.pais.si { fill:var(--naranja); }
  .vj-mapa path.pais.sel { stroke:#fff; stroke-width:1.2; }
  .vj-mapa .vj-ayuda { position:absolute; left:10px; bottom:8px; font-size:11px; color:var(--tinta-suave); pointer-events:none; }
  .vj-mapa .vj-zoom { position:absolute; right:8px; bottom:8px; display:flex; gap:4px; }
  .vj-mapa .vj-zoom button { width:30px; height:30px; border-radius:8px; border:1px solid var(--linea); background:rgba(0,0,0,.7); color:var(--tinta); font-size:16px; cursor:pointer; }
  .vj-cargando { padding:60px 20px; text-align:center; color:var(--tinta-suave); font-size:14px; }
  .vj-boton { width:100%; border:0; background:none; color:var(--naranja); box-shadow:inset 0 0 0 1px var(--naranja); font:inherit; font-weight:600; font-size:15px; padding:13px; border-radius:12px; cursor:pointer; margin-bottom:12px; }
  .vj-cont { display:flex; align-items:center; gap:10px; font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--tinta-suave); margin:20px 2px 8px; }
  .vj-cont::after { content:""; flex:1; height:1px; background:var(--linea); }
  .vj-cont span { letter-spacing:0; text-transform:none; font-weight:500; }
  .vj-pais { border:1px solid var(--linea); border-radius:12px; margin-bottom:8px; background:var(--papel); }
  .vj-pais summary { list-style:none; display:flex; align-items:center; gap:12px; padding:12px 14px; cursor:pointer; }
  .vj-pais summary::-webkit-details-marker { display:none; }
  .vj-pais .fl { font-size:26px; line-height:1; }
  .vj-pais .nm { flex:1; min-width:0; }
  .vj-pais .nm b { display:block; font-weight:600; font-size:15px; letter-spacing:-0.01em; }
  .vj-pais .nm span { font-size:12.5px; color:var(--tinta-suave); }
  .vj-pais .fle { color:var(--tinta-suave); transition:transform .2s; }
  .vj-pais[open] .fle { transform:rotate(90deg); }
  .vj-pais .dentro { padding:0 14px 12px 52px; }
  .vj-ciudad { display:flex; justify-content:space-between; gap:10px; padding:8px 0; border-top:1px solid var(--linea); font-size:14.5px; }
  .vj-ciudad span { font-size:12.5px; color:var(--tinta-suave); text-align:right; }
  .vj-enlace { background:none; border:0; color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:500; padding:8px 0 0; cursor:pointer; }
  .vj-anio { font-size:12px; font-weight:600; letter-spacing:.1em; color:var(--tinta-suave); margin:20px 2px 8px; display:flex; align-items:center; gap:10px; }
  .vj-anio::after { content:""; flex:1; height:1px; background:var(--linea); }
  .vj-viaje { display:block; width:100%; text-align:left; font:inherit; color:inherit; background:var(--papel); border:1px solid var(--linea); border-radius:12px; padding:14px; margin-bottom:8px; cursor:pointer; }
  .vj-viaje .fls { font-size:20px; letter-spacing:2px; }
  .vj-viaje b { display:block; font-weight:600; font-size:16px; letter-spacing:-0.02em; margin-top:6px; }
  .vj-viaje span { font-size:13px; color:var(--tinta-suave); }
  .vj-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .vj-form .dos { display:flex; gap:10px; }
  .vj-form .dos > div { flex:1; min-width:0; }
  .vj-dest { border:1px solid var(--linea); border-radius:12px; padding:12px; margin-top:10px; }
  .vj-dest .fila { display:flex; gap:8px; align-items:center; }
  .vj-dest .fila select { flex:1; }
  .vj-x { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:0 4px; cursor:pointer; }
  .vj-acciones { display:flex; gap:8px; margin-top:20px; }
  .vj-acciones .boton { flex:1; margin:0; }
  .vj-peligro { background:none; border:0; color:var(--rojo); font:inherit; font-weight:600; margin-top:14px; cursor:pointer; padding:6px 0; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const hoyK = () => clave(new Date());
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const normC = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  function rangoFechas(v) {
    const a = aFecha(v.inicio), b = v.fin ? aFecha(v.fin) : a;
    const mes = f => f.toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
    if (+a === +b) return a.getDate() + " " + mes(a) + " " + a.getFullYear();
    if (a.getFullYear() !== b.getFullYear()) return a.getDate() + " " + mes(a) + " " + a.getFullYear() + " a " + b.getDate() + " " + mes(b) + " " + b.getFullYear();
    if (a.getMonth() !== b.getMonth()) return a.getDate() + " " + mes(a) + " a " + b.getDate() + " " + mes(b) + " " + b.getFullYear();
    return a.getDate() + " a " + b.getDate() + " " + mes(a) + " " + a.getFullYear();
  }
  const diasViaje = v => Math.round(((v.fin ? aFecha(v.fin) : aFecha(v.inicio)) - aFecha(v.inicio)) / 864e5) + 1;

  // Carga de librerías y del mapa (una sola vez)
  const cargarScript = src => new Promise((ok, mal) => { if ([...document.scripts].some(s => s.src === src)) return ok(); const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = mal; document.head.appendChild(s); });
  let geoPromesa = null;
  function cargarMapa() {
    if (!geoPromesa) geoPromesa = (async () => {
      await cargarScript(URLS.d3); await cargarScript(URLS.topo);
      const topo = await (await fetch(URLS.mapa)).json();
      const fc = topojson.feature(topo, topo.objects.countries);
      fc.features = fc.features.filter(f => f.id !== "010");   // sin la Antártida
      fc.features.forEach(f => { f.a2 = f.id ? POR_NUM[f.id] : SIN_CODIGO[f.properties.name]; });
      return fc;
    })().catch(e => { geoPromesa = null; throw e; });
    return geoPromesa;
  }

  let vista = "mapa";

  HiperApp.registrar({
    id: "viajes",
    titulo: "Viajes",
    color: "#40C8E0",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.viajes = d.viajes || [];     // [{id, nombre, inicio, fin, destinos:[{pais, ciudades:[...]}], nota}]
      d.marcados = d.marcados || []; // países marcados a mano, sin viaje
      const guardar = () => store.set(d);
      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Datos derivados ----------
      const deViajes = () => new Set(d.viajes.flatMap(v => v.destinos.map(x => x.pais)));
      const visitados = () => new Set([...deViajes(), ...d.marcados]);
      const viajesDe = a2 => d.viajes.filter(v => v.destinos.some(x => x.pais === a2)).sort((a, b) => b.inicio.localeCompare(a.inicio));
      function ciudadesDe(a2) {   // [{nombre, viajes:[...]}] sin repetir
        const m = new Map();
        viajesDe(a2).forEach(v => v.destinos.filter(x => x.pais === a2).forEach(x => x.ciudades.forEach(c => { const k = normC(c); if (!m.has(k)) m.set(k, { nombre: c, viajes: [] }); m.get(k).viajes.push(v); })));
        return [...m.values()];
      }
      const opcionesPaises = sel => Object.keys(PAISES).filter(a => PAISES[a].cont !== "AN").map(a => [a, nombrePais(a)]).sort((x, y) => x[1].localeCompare(y[1], "es"))
        .map(([a, n]) => `<option value="${a}" ${a === sel ? "selected" : ""}>${bandera(a)} ${esc(n)}</option>`).join("");

      // ---------- Vista 1: mapa ----------
      function vistaMapa() {
        const vis = visitados(), conts = new Set([...vis].map(a => PAISES[a] && PAISES[a].cont).filter(c => c && c !== "AN"));
        const nCiudades = [...vis].reduce((s, a) => s + ciudadesDe(a).length, 0);
        return `<div class="vj-stats">
            <div><b>${vis.size}</b><span>países</span></div>
            <div><b>${Math.round(vis.size / TOTAL_MUNDO * 100)}%</b><span>del mundo</span></div>
            <div><b>${conts.size}/6</b><span>continentes</span></div>
            <div><b>${nCiudades}</b><span>ciudades</span></div>
          </div>
          <div class="vj-mapa" id="vjMapa"><div class="vj-cargando">Cargando el mapa…</div></div>
          <button class="vj-boton" data-accion="nuevo-viaje">Añadir viaje</button>`;
      }
      async function dibujarMapa() {
        const caja = raiz.querySelector("#vjMapa"); if (!caja) return;
        let fc;
        try { fc = await cargarMapa(); }
        catch (e) { caja.innerHTML = `<div class="vj-cargando">No se ha podido descargar el mapa. Conéctate a internet y vuelve a abrir esta pantalla (solo hace falta la primera vez).</div>`; return; }
        if (!caja.isConnected) return;
        const W = 700, H = 360, vis = visitados();
        const proy = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], fc);
        const camino = d3.geoPath(proy);
        caja.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de países visitados"><g>${fc.features.map(f => f.a2 ? `<path class="pais ${vis.has(f.a2) ? "si" : ""}" data-a2="${f.a2}" d="${camino(f)}"><title>${esc(nombrePais(f.a2))}</title></path>` : `<path class="pais" d="${camino(f)}"/>`).join("")}</g></svg>
          <span class="vj-ayuda">Toca un país para marcarlo</span>
          <div class="vj-zoom"><button data-z="1.6" aria-label="Acercar">+</button><button data-z="0.625" aria-label="Alejar">−</button></div>`;
        const svg = d3.select(caja.querySelector("svg")), g = svg.select("g");
        const zoom = d3.zoom().scaleExtent([1, 12]).translateExtent([[0, 0], [W, H]]).on("zoom", e => g.attr("transform", e.transform));
        svg.call(zoom);
        caja.querySelectorAll("[data-z]").forEach(b => b.onclick = () => svg.transition().duration(250).call(zoom.scaleBy, +b.dataset.z));
        caja.querySelector("svg").addEventListener("click", e => { const p = e.target.closest("path[data-a2]"); if (p) hojaPais(p.dataset.a2); });
      }

      // ---------- Vista 2: países ----------
      function vistaPaises() {
        const vis = [...visitados()].filter(a => PAISES[a]);
        const orden = ["EU", "AS", "NA", "SA", "AF", "OC"];
        const grupos = orden.map(c => {
          const xs = vis.filter(a => PAISES[a].cont === c).sort((x, y) => nombrePais(x).localeCompare(nombrePais(y), "es"));
          if (!xs.length) return "";
          return `<div class="vj-cont">${CONTINENTES[c]} <span>${xs.length}</span></div>` + xs.map(a => {
            const vs = viajesDe(a), cs = ciudadesDe(a), manual = d.marcados.includes(a) && !vs.length;
            return `<details class="vj-pais"><summary><span class="fl">${bandera(a)}</span><div class="nm"><b>${esc(nombrePais(a))}</b>
                <span>${manual ? "Marcado sin viaje" : vs.length + (vs.length === 1 ? " viaje" : " viajes") + (cs.length ? ", " + cs.length + (cs.length === 1 ? " ciudad" : " ciudades") : "")}</span></div><span class="fle">›</span></summary>
              <div class="dentro">
                ${cs.map(c => `<div class="vj-ciudad">${esc(c.nombre)}<span>${c.viajes.map(v => aFecha(v.inicio).getFullYear()).filter((y, i, arr) => arr.indexOf(y) === i).join(", ")}</span></div>`).join("")}
                ${!cs.length && !manual ? `<div class="vj-ciudad" style="color:var(--tinta-suave)">Sin ciudades apuntadas</div>` : ""}
                <button class="vj-enlace" data-accion="pais" data-a2="${a}">Ver o editar</button>
              </div></details>`;
          }).join("");
        }).join("");
        return `<button class="vj-boton" data-accion="marcar">Marcar un país</button>
          ${grupos || `<div class="bloque"><p style="margin:0">Aún no hay países. Añade un viaje o toca un país en el mapa.</p></div>`}`;
      }

      // ---------- Vista 3: viajes ----------
      function vistaViajes() {
        const vs = d.viajes.slice().sort((a, b) => b.inicio.localeCompare(a.inicio));
        const este = hoyK().slice(0, 4), diasAnio = vs.filter(v => v.inicio.startsWith(este)).reduce((s, v) => s + diasViaje(v), 0);
        let html = `<div class="vj-stats" style="grid-template-columns:repeat(3,1fr)">
            <div><b>${vs.length}</b><span>viajes</span></div>
            <div><b>${vs.filter(v => v.inicio.startsWith(este)).length}</b><span>en ${este}</span></div>
            <div><b>${diasAnio}</b><span>días fuera en ${este}</span></div></div>
          <button class="vj-boton" data-accion="nuevo-viaje">Añadir viaje</button>`;
        let anio = "";
        vs.forEach(v => {
          const y = v.inicio.slice(0, 4);
          if (y !== anio) { anio = y; html += `<div class="vj-anio">${y}</div>`; }
          const cs = v.destinos.flatMap(x => x.ciudades);
          html += `<button class="vj-viaje" data-accion="viaje" data-id="${v.id}"><div class="fls">${v.destinos.map(x => bandera(x.pais)).join("")}</div>
            <b>${esc(v.nombre)}</b><span>${rangoFechas(v)}, ${diasViaje(v)} ${diasViaje(v) === 1 ? "día" : "días"}${cs.length ? ". " + esc(cs.join(", ")) : ""}</span></button>`;
        });
        if (!vs.length) html += `<div class="bloque"><p style="margin:0">Apunta tu primer viaje con sus fechas, países y ciudades.</p></div>`;
        return html;
      }

      function pintar() {
        raiz.innerHTML = `<div class="vj-seg">${[["mapa", "Mapa"], ["paises", "Países"], ["viajes", "Viajes"]].map(([k, n]) => `<button class="${vista === k ? "on" : ""}" data-accion="vista" data-v="${k}">${n}</button>`).join("")}</div>
          ${{ mapa: vistaMapa, paises: vistaPaises, viajes: vistaViajes }[vista]()}`;
        if (vista === "mapa") dibujarMapa();
      }

      // ---------- Hojas ----------
      function panel(html) {
        const f = document.createElement("div"); f.className = "panel-fondo";
        f.innerHTML = `<div class="panel vj-form" role="dialog">${html}</div>`;
        contenedor.appendChild(f);
        f.addEventListener("click", e => { if (e.target === f) f.remove(); });
        return { f, p: f.querySelector(".panel"), cerrar: () => f.remove() };
      }

      // Ficha de un país (al tocarlo en el mapa o en la lista)
      function hojaPais(a2) {
        const vs = viajesDe(a2), manual = d.marcados.includes(a2), cs = ciudadesDe(a2);
        const h = panel(`<div style="font-size:44px;line-height:1">${bandera(a2)}</div><h2 style="margin-top:10px">${esc(nombrePais(a2))}</h2>
          <div class="etiqueta">${CONTINENTES[PAISES[a2] && PAISES[a2].cont] || ""}</div>
          ${vs.length ? `<label>Viajes</label>${vs.map(v => `<button class="vj-viaje" data-v="${v.id}" style="margin-bottom:6px"><b style="margin-top:0">${esc(v.nombre)}</b><span>${rangoFechas(v)}</span></button>`).join("")}` : ""}
          ${cs.length ? `<label>Ciudades</label><div>${cs.map(c => `<div class="vj-ciudad">${esc(c.nombre)}</div>`).join("")}</div>` : ""}
          ${!vs.length ? `<p class="aviso">${manual ? "Lo tienes marcado como visitado, sin ningún viaje apuntado." : "Aún no lo has visitado."}</p>` : ""}
          <div class="vj-acciones">
            ${!vs.length ? `<button class="boton secundario" data-h="marcar">${manual ? "Desmarcar" : "Marcar visitado"}</button>` : ""}
            <button class="boton" data-h="viaje">Añadir viaje</button>
          </div>
          <button class="vj-enlace" data-h="cerrar" style="width:100%;text-align:center;padding-top:14px">Cerrar</button>`);
        h.p.addEventListener("click", e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.dataset.v) { h.cerrar(); return hojaViaje(d.viajes.find(v => v.id === b.dataset.v)); }
          if (b.dataset.h === "cerrar") h.cerrar();
          if (b.dataset.h === "marcar") { d.marcados = manual ? d.marcados.filter(x => x !== a2) : d.marcados.concat(a2); guardar(); h.cerrar(); pintar(); }
          if (b.dataset.h === "viaje") { h.cerrar(); hojaViaje(null, a2); }
        });
      }

      // Crear o editar un viaje
      function hojaViaje(v, paisInicial) {
        let destinos = v ? v.destinos.map(x => ({ pais: x.pais, ciudades: x.ciudades.join(", ") })) : [{ pais: paisInicial || "", ciudades: "" }];
        const h = panel(`<h2>${v ? "Editar viaje" : "Nuevo viaje"}</h2>
          <label>Nombre (opcional)</label><input id="vjN" value="${v ? esc(v.nombre) : ""}" placeholder="Verano en Italia, Erasmus…" maxlength="50">
          <div class="dos"><div><label>Ida</label><input type="date" id="vjI" value="${v ? v.inicio : hoyK()}"></div><div><label>Vuelta</label><input type="date" id="vjF" value="${v ? (v.fin || v.inicio) : hoyK()}"></div></div>
          <label>Países y ciudades</label><div id="vjDest"></div>
          <button class="vj-enlace" data-h="mas" style="color:var(--naranja);font-weight:600">+ Añadir otro país</button>
          <label>Nota (opcional)</label><input id="vjNota" value="${v && v.nota ? esc(v.nota) : ""}" maxlength="100">
          <div class="vj-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Guardar</button></div>
          ${v ? `<button class="vj-peligro" data-h="b">Borrar viaje</button>` : ""}`);
        const $ = q => h.p.querySelector(q);
        const leerDest = () => { h.p.querySelectorAll(".vj-dest").forEach((el, i) => { destinos[i] = { pais: el.querySelector("select").value, ciudades: el.querySelector("input").value }; }); };
        function pintarDest() {
          $("#vjDest").innerHTML = destinos.map((x, i) => `<div class="vj-dest"><div class="fila"><select aria-label="País"><option value="">Elige país…</option>${opcionesPaises(x.pais)}</select>
            ${destinos.length > 1 ? `<button class="vj-x" data-quitar="${i}" aria-label="Quitar">×</button>` : ""}</div>
            <input placeholder="Ciudades, separadas por comas" value="${esc(x.ciudades)}" style="margin-top:8px"></div>`).join("");
        }
        pintarDest();
        h.p.addEventListener("click", e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.dataset.quitar) { leerDest(); destinos.splice(+b.dataset.quitar, 1); pintarDest(); }
          if (b.dataset.h === "mas") { leerDest(); destinos.push({ pais: "", ciudades: "" }); pintarDest(); }
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h === "b" && confirm("¿Borrar este viaje?")) { d.viajes = d.viajes.filter(x => x !== v); guardar(); h.cerrar(); pintar(); }
          if (b.dataset.h === "g") {
            leerDest();
            const ds = []; destinos.forEach(x => { if (!x.pais) return; const cs = [...new Map(x.ciudades.split(",").map(c => c.trim()).filter(Boolean).map(c => [normC(c), c])).values()];
              const ya = ds.find(y => y.pais === x.pais); if (ya) cs.forEach(c => { if (!ya.ciudades.some(z => normC(z) === normC(c))) ya.ciudades.push(c); }); else ds.push({ pais: x.pais, ciudades: cs }); });
            if (!ds.length) { alert("Elige al menos un país."); return; }
            const inicio = $("#vjI").value || hoyK(), fin = $("#vjF").value && $("#vjF").value >= inicio ? $("#vjF").value : inicio;
            const nombre = $("#vjN").value.trim() || ds.map(x => nombrePais(x.pais)).join(" y ").replace(/ y (?=.* y )/g, ", ");
            const datos = { nombre, inicio, fin, destinos: ds, nota: $("#vjNota").value.trim() };
            if (v) Object.assign(v, datos); else d.viajes.push(Object.assign({ id: nuevoId() }, datos));
            d.marcados = d.marcados.filter(a => !ds.some(x => x.pais === a));   // ya cuentan por el viaje
            guardar(); h.cerrar(); pintar();
          }
        });
      }

      function hojaMarcar() {
        const h = panel(`<h2>Marcar un país</h2><p class="aviso">Para países que visitaste pero de los que no quieres apuntar el viaje. También puedes tocarlos en el mapa.</p>
          <label>País</label><select id="vjM"><option value="">Elige país…</option>${opcionesPaises("")}</select>
          <div class="vj-acciones"><button class="boton secundario" data-h="c">Cancelar</button><button class="boton" data-h="g">Marcar</button></div>`);
        h.p.addEventListener("click", e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.dataset.h === "c") h.cerrar();
          if (b.dataset.h === "g") { const a = h.p.querySelector("#vjM").value; if (!a) return; if (!visitados().has(a)) d.marcados.push(a); guardar(); h.cerrar(); pintar(); }
        });
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") vista = b.dataset.v;
        else if (a === "nuevo-viaje") return hojaViaje(null);
        else if (a === "viaje") return hojaViaje(d.viajes.find(v => v.id === b.dataset.id));
        else if (a === "pais") return hojaPais(b.dataset.a2);
        else if (a === "marcar") return hojaMarcar();
        pintar();
      });

      pintar();
    }
  });
})();
