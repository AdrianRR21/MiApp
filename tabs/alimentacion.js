/* PESTAÑA: Alimentación
   Peso diario, objetivo de calorías/macros/agua según el día, registro de comidas y evolución.
   Para cambiarla, sustituye solo este archivo. */
(() => {
  const css = `
  .al-seg { display:flex; background:var(--papel); border-radius:12px; padding:4px; margin-bottom:14px; }
  .al-seg button { flex:1; border:0; background:none; color:var(--tinta-suave); font:inherit; font-weight:600; font-size:14px; padding:9px 0; border-radius:9px; cursor:pointer; }
  .al-seg button.on { background:var(--papel-2); color:var(--tinta); }
  .al-dia { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .al-dia button { background:var(--papel); border:0; color:var(--tinta); width:40px; height:40px; border-radius:12px; font-size:20px; cursor:pointer; }
  .al-dia button:disabled { opacity:.3; }
  .al-dia h2 { margin:0; font-family:var(--titulos); font-weight:400; font-size:28px; }

  .al-kcal { display:flex; align-items:center; gap:18px; }
  .al-anillo { flex:none; width:118px; height:118px; position:relative; }
  .al-anillo svg { width:100%; height:100%; transform:rotate(-90deg); }
  .al-anillo div { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .al-anillo b { font-size:24px; letter-spacing:-.02em; }
  .al-anillo span { font-size:12px; color:var(--tinta-suave); }
  .al-macros { flex:1; min-width:0; }
  .al-macro { margin-bottom:10px; }
  .al-macro:last-child { margin-bottom:0; }
  .al-macro .n { display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:5px; }
  .al-macro .n span:last-child { color:var(--tinta-suave); }
  .al-barra { height:6px; background:var(--papel-2); border-radius:3px; overflow:hidden; }
  .al-barra div { height:100%; background:var(--naranja); border-radius:3px; }
  .al-barra div.pasado { background:#E5776B; }
  .al-resumen { display:flex; justify-content:space-between; margin-top:14px; font-size:14px; color:var(--tinta-suave); }

  .al-peso { display:flex; justify-content:space-between; align-items:center; width:100%; background:var(--papel); border:0; border-radius:18px; padding:16px 20px; margin-bottom:12px; color:inherit; font:inherit; cursor:pointer; text-align:left; }
  .al-peso b { font-size:22px; }
  .al-chips { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
  .al-chip { font-size:12.5px; font-weight:600; padding:5px 10px; border-radius:20px; background:var(--naranja-suave); color:var(--naranja); }
  .al-chip.gris { background:var(--papel-2); color:var(--tinta-suave); }

  .al-toggle { display:flex; gap:8px; margin-top:6px; }
  .al-toggle button { flex:1; border:1.5px solid var(--papel-2); background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-weight:600; font-size:15px; padding:14px 8px; border-radius:12px; cursor:pointer; }
  .al-toggle button.on { border-color:var(--naranja); background:var(--naranja-suave); color:var(--naranja); }

  .al-agua-top { display:flex; justify-content:space-between; align-items:baseline; }
  .al-agua-btns { display:flex; gap:8px; margin-top:12px; }
  .al-agua-btns button { flex:1; border:0; background:var(--papel-2); color:var(--tinta); font:inherit; font-weight:600; font-size:14px; padding:11px 0; border-radius:10px; cursor:pointer; }
  .al-agua-btns button.mas { background:var(--naranja-suave); color:var(--naranja); }

  .al-cab { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px; }
  .al-cab h2 { margin:0; }
  .al-cab .v { font-size:14px; color:var(--tinta-suave); }
  .al-fila { display:flex; align-items:center; gap:10px; padding:11px 0; border-top:1px solid var(--linea); width:100%; background:none; border-left:0; border-right:0; border-bottom:0; color:inherit; font:inherit; text-align:left; }
  .al-fila .izq { flex:1; min-width:0; }
  .al-fila .izq div:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .al-fila .sub { font-size:13px; color:var(--tinta-suave); margin-top:2px; }
  .al-fila .der { font-weight:600; white-space:nowrap; }
  .al-borrar { background:none; border:0; color:var(--tinta-suave); font-size:22px; line-height:1; padding:2px 4px 2px 8px; cursor:pointer; }
  .al-anadir { width:100%; border:0; background:var(--naranja); color:#1A1411; font:inherit; font-weight:700; font-size:16px; padding:15px; border-radius:14px; cursor:pointer; margin-bottom:12px; }

  .al-form label { display:block; font-size:13px; color:var(--tinta-suave); margin:14px 0 6px; }
  .al-form .dos { display:flex; gap:10px; }
  .al-form .dos > div { flex:1; min-width:0; }
  .al-grande { font-size:28px !important; font-weight:700; }
  .al-acciones { display:flex; gap:8px; margin-top:20px; }
  .al-acciones .boton { flex:1; margin:0; }
  .al-busca { display:flex; gap:8px; }
  .al-busca input { flex:1; min-width:0; }
  .al-busca button { flex:none; border:0; background:var(--naranja-suave); color:var(--naranja); font:inherit; font-weight:700; padding:0 14px; border-radius:10px; cursor:pointer; }
  .al-res { margin-top:8px; }
  .al-res .al-fila { cursor:pointer; }
  .al-grupo { font-size:13px; color:var(--tinta-suave); margin:16px 0 2px; }
  .al-nota { font-size:13.5px; color:var(--tinta-suave); margin:12px 0 0; line-height:1.5; }
  .al-cuad { display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-top:14px; }
  .al-cuad div { background:var(--papel-2); border-radius:10px; padding:9px 4px; text-align:center; font-size:12px; color:var(--tinta-suave); }
  .al-cuad b { display:block; font-size:17px; color:var(--tinta); }
  .al-rapidas { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
  .al-rapidas button { border:0; background:var(--papel-2); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:7px 10px; border-radius:8px; cursor:pointer; }
  .al-enlace { background:none; border:0; color:var(--naranja); font:inherit; font-weight:600; font-size:14px; cursor:pointer; padding:10px 0 0; }

  .al-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
  .al-stats div { background:var(--papel); border-radius:14px; padding:14px; }
  .al-stats b { display:block; font-size:21px; margin-top:3px; }
  .al-rangos { display:flex; gap:4px; justify-content:flex-end; margin-bottom:12px; }
  .al-rangos button { border:0; background:var(--papel); color:var(--tinta-suave); font:inherit; font-size:13px; font-weight:600; padding:6px 11px; border-radius:8px; cursor:pointer; }
  .al-rangos button.on { background:var(--naranja-suave); color:var(--naranja); }
  .al-graf svg { width:100%; height:auto; display:block; margin-top:10px; }
  .al-graf text { font-family:var(--texto); font-size:10px; fill:var(--tinta-suave); }
  .al-leyenda { display:flex; gap:14px; font-size:12.5px; color:var(--tinta-suave); margin-top:8px; }
  .al-leyenda span { display:inline-flex; align-items:center; gap:6px; }
  .al-leyenda i { width:10px; height:3px; border-radius:2px; display:inline-block; }
  .panel { max-height:88vh; overflow-y:auto; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- Alimentos básicos incluidos (valores por 100 g, aproximados) ----------
  // [nombre, kcal, proteína, hidratos, grasa, gramos por unidad (opcional)]
  const BASE = [
    ["Arroz blanco (crudo)", 360, 7, 79, 0.6], ["Arroz blanco (cocido)", 130, 2.7, 28, 0.3],
    ["Pasta (cruda)", 355, 12.5, 72, 1.5], ["Pasta (cocida)", 158, 5.8, 31, 0.9],
    ["Pan blanco", 265, 9, 49, 3.2], ["Pan integral", 250, 12, 41, 3.5], ["Pan de molde", 260, 8.5, 46, 4, 25],
    ["Copos de avena", 379, 13, 67, 6.5], ["Tortitas de arroz", 387, 8, 81, 3, 8], ["Corn flakes", 357, 7.5, 84, 0.4],
    ["Patata (cocida)", 87, 1.9, 20, 0.1], ["Boniato (asado)", 90, 2, 21, 0.2], ["Quinoa (cocida)", 120, 4.4, 21, 1.9],
    ["Pechuga de pollo (cruda)", 120, 22.5, 0, 2.6], ["Pechuga de pollo (a la plancha)", 165, 31, 0, 3.6],
    ["Pechuga de pavo (cruda)", 114, 23.7, 0, 1.5], ["Ternera magra (cruda)", 137, 21.4, 0, 5],
    ["Carne picada de ternera", 254, 17, 0, 20], ["Lomo de cerdo", 143, 21, 0, 6], ["Jamón serrano", 241, 30.5, 0, 13],
    ["Salmón", 208, 20, 0, 13], ["Merluza", 86, 17.5, 0, 1.8], ["Atún en lata al natural", 116, 26, 0, 1],
    ["Huevo", 143, 12.6, 0.7, 9.5, 55], ["Clara de huevo", 52, 10.9, 0.7, 0.2, 33],
    ["Leche entera", 63, 3.1, 4.7, 3.6], ["Leche semidesnatada", 46, 3.2, 4.8, 1.6], ["Leche desnatada", 35, 3.4, 5, 0.1],
    ["Yogur natural", 61, 3.5, 4.7, 3.3, 125], ["Yogur griego natural", 120, 4, 4, 10, 125], ["Skyr natural", 63, 11, 4, 0.2, 150],
    ["Queso fresco batido 0%", 46, 8, 3.5, 0.2], ["Queso fresco (Burgos)", 174, 12, 3, 12.8], ["Queso curado", 400, 28, 0, 32],
    ["Proteína whey", 385, 76, 8, 6, 30],
    ["Plátano", 89, 1.1, 23, 0.3, 120], ["Manzana", 52, 0.3, 14, 0.2, 180], ["Naranja", 47, 0.9, 12, 0.1, 180],
    ["Fresas", 32, 0.7, 7.7, 0.3], ["Arándanos", 57, 0.7, 14, 0.3], ["Aguacate", 160, 2, 8.5, 14.7, 150],
    ["Tomate", 18, 0.9, 3.9, 0.2, 120], ["Lechuga", 15, 1.4, 2.9, 0.2], ["Brócoli", 34, 2.8, 7, 0.4],
    ["Espinacas", 23, 2.9, 3.6, 0.4], ["Cebolla", 40, 1.1, 9.3, 0.1], ["Pimiento rojo", 31, 1, 6, 0.3], ["Zanahoria", 41, 0.9, 9.6, 0.2],
    ["Garbanzos (cocidos)", 164, 8.9, 27, 2.6], ["Lentejas (cocidas)", 116, 9, 20, 0.4], ["Alubias (cocidas)", 127, 8.7, 22.8, 0.5],
    ["Aceite de oliva", 884, 0, 0, 100, 10], ["Mantequilla de cacahuete", 588, 25, 20, 50, 15], ["Almendras", 579, 21, 22, 50],
    ["Nueces", 654, 15, 14, 65], ["Chocolate negro 70%", 598, 7.8, 46, 43], ["Miel", 304, 0.3, 82, 0, 20], ["Mantequilla", 717, 0.9, 0.1, 81],
    ["Tortilla de patatas", 190, 6.5, 15, 11.5], ["Zumo de naranja", 45, 0.7, 10.4, 0.2], ["Cerveza", 43, 0.5, 3.6, 0, 330]
  ].map((a, i) => ({ id: "b" + i, nombre: a[0], kcal: a[1], p: a[2], c: a[3], g: a[4], u: a[5] || null, base: true }));

  // ---------- Utilidades ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = s => { s = String(s).trim(); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); return parseFloat(s); };
  const r0 = n => Math.round(n || 0), r1 = n => Math.round((n || 0) * 10) / 10;
  const f1 = n => r1(n).toLocaleString("es-ES", { maximumFractionDigits: 1 });
  const clave = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const aFecha = k => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const hoyK = () => clave(new Date());
  const sumarK = (k, n) => { const x = aFecha(k); x.setDate(x.getDate() + n); return clave(x); };
  const fechaCorta = k => aFecha(k).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const MOMENTOS = ["Desayuno", "Comida", "Merienda", "Cena", "Picoteo"];
  const momentoAhora = () => { const h = new Date().getHours() + new Date().getMinutes() / 60; return h < 11 ? "Desayuno" : h < 16.5 ? "Comida" : h < 20 ? "Merienda" : "Cena"; };

  let vista = "hoy", diaSel = null, rango = "1m", editPeso = false;

  HiperApp.registrar({
    id: "alimentacion",
    titulo: "Alimentación",
    nombreCorto: "Comida",
    color: "#F2884B",
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18"/><path d="M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',

    render(contenedor, store) {
      const d = store.get({});
      d.perfil = d.perfil || { sexo: "", edad: "", altura: "", minGym: 60, minPadel: 90, objetivo: "volumen", actividad: "poco" };
      d.dias = d.dias || {};          // {"AAAA-MM-DD": {peso, gym, padel, obj:{kcal,p,c,g,agua}, comidas:[], agua}}
      d.alimentos = d.alimentos || {}; // tus alimentos: {id: {nombre, marca, kcal, p, c, g, u, usos, ultimo}}
      const guardar = () => store.set(d);
      const hoy = hoyK();
      if (!diaSel || diaSel > hoy) diaSel = hoy;
      const perfilListo = () => d.perfil.sexo && d.perfil.edad && d.perfil.altura;

      // ---------- Cálculo de objetivos ----------
      // Gasto en reposo: Mifflin-St Jeor. Actividad diaria sin deporte: x1,2 / 1,3 / 1,45.
      // Deporte: (MET - 1) x kg x horas (gimnasio MET 5, pádel MET 7). Objetivo: volumen +10 %, definición -20 %, recomposición -5 %.
      // Proteína 2 g/kg (2,2 en definición), grasa 0,9 g/kg, resto hidratos. Agua: 35 ml/kg + 0,5 l/h de gimnasio + 0,75 l/h de pádel.
      function calcular(peso, gym, padel) {
        const P = d.perfil, alt = num(P.altura), edad = num(P.edad);
        const bmr = 10 * peso + 6.25 * alt - 5 * edad + (P.sexo === "mujer" ? -161 : 5);
        const fAct = { poco: 1.2, algo: 1.3, muy: 1.45 }[P.actividad] || 1.2;
        const hGym = gym ? (num(P.minGym) || 60) / 60 : 0, hPad = padel ? (num(P.minPadel) || 90) / 60 : 0;
        const deporte = (5 - 1) * peso * hGym + (7 - 1) * peso * hPad;
        const fObj = { volumen: 1.10, mantener: 1, definir: 0.80, recomp: 0.95 }[P.objetivo] || 1;
        const kcal = Math.round((bmr * fAct + deporte) * fObj / 10) * 10;
        const p = Math.round(peso * (P.objetivo === "definir" ? 2.2 : 2)), g = Math.round(peso * 0.9);
        const c = Math.max(0, Math.round((kcal - p * 4 - g * 9) / 4));
        const agua = Math.round((peso * 35 + hGym * 500 + hPad * 750) / 100) / 10;
        return { kcal, p, c, g, agua };
      }
      const ultimoPeso = (hasta) => { const ks = Object.keys(d.dias).filter(k => k <= hasta && d.dias[k].peso).sort(); return ks.length ? d.dias[ks[ks.length - 1]].peso : null; };
      const dia = k => d.dias[k] || (d.dias[k] = { comidas: [], agua: 0 });
      const totales = dd => (dd.comidas || []).reduce((t, x) => ({ kcal: t.kcal + x.kcal, p: t.p + x.p, c: t.c + x.c, g: t.g + x.g }), { kcal: 0, p: 0, c: 0, g: 0 });

      const raiz = document.createElement("div");
      contenedor.appendChild(raiz);

      // ---------- Vistas ----------
      function formPerfil(titulo, texto) {
        const P = d.perfil;
        const sel = (id, ops, v) => `<select id="${id}">${ops.map(([k, n]) => `<option value="${k}" ${k === v ? "selected" : ""}>${n}</option>`).join("")}</select>`;
        return `<div class="bloque al-form">
          <h2>${titulo}</h2>${texto ? `<p>${texto}</p>` : ""}
          <div class="dos">
            <div><label>Sexo</label>${sel("alSexo", [["", "Elige"], ["hombre", "Hombre"], ["mujer", "Mujer"]], P.sexo)}</div>
            <div><label>Edad</label><input id="alEdad" inputmode="numeric" value="${esc(P.edad)}" placeholder="años"></div>
            <div><label>Altura</label><input id="alAltura" inputmode="numeric" value="${esc(P.altura)}" placeholder="cm"></div>
          </div>
          <label>Objetivo</label>${sel("alObj", [["volumen", "Ganar músculo"], ["mantener", "Mantener peso"], ["recomp", "Recomposición"], ["definir", "Perder grasa"]], P.objetivo)}
          <label>Día a día sin contar deporte</label>${sel("alAct", [["poco", "Poco activo"], ["algo", "Algo activo"], ["muy", "Muy activo"]], P.actividad)}
          <div class="dos">
            <div><label>Minutos de gimnasio</label><input id="alMinGym" inputmode="numeric" value="${esc(P.minGym)}"></div>
            <div><label>Minutos de pádel</label><input id="alMinPadel" inputmode="numeric" value="${esc(P.minPadel)}"></div>
          </div>
          <div class="al-acciones"><button class="boton" data-accion="guardar-perfil">Guardar</button></div>
        </div>`;
      }

      function vistaDatos() {
        return formPerfil("Tus datos", "Se usan para calcular tus objetivos. Si los cambias, se recalcula el objetivo de hoy.") + `
          <div class="bloque"><h2>Cómo se calcula</h2>
            <p>El gasto en reposo sale de la fórmula de Mifflin-St Jeor con tu peso del día. Se multiplica por tu nivel de actividad diaria y se le suma lo que gastas en el gimnasio o el pádel ese día. Para ganar músculo se añade un 10 % extra.</p>
            <p>Proteína: 2 g por kilo. Grasa: 0,9 g por kilo. El resto de calorías, en hidratos. Agua: 35 ml por kilo, más medio litro por hora de gimnasio y tres cuartos por hora de pádel.</p>
            <p style="margin:0">Son estimaciones: si tras dos o tres semanas tu peso no sube al ritmo que buscas (lo verás en Evolución), ajusta el objetivo o dímelo y afinamos las fórmulas.</p>
          </div>`;
      }

      function vistaHoy() {
        if (!perfilListo()) return formPerfil("Antes de empezar", "Necesito unos datos para calcular tus calorías, macros y agua. Solo se piden una vez.");
        const dd = d.dias[diaSel] || { comidas: [], agua: 0 };
        const esHoy = diaSel === hoy;
        const nav = `<div class="al-dia">
          <button data-accion="dia" data-n="-1" aria-label="Día anterior">‹</button>
          <h2>${esHoy ? "Hoy" : diaSel === sumarK(hoy, -1) ? "Ayer" : fechaCorta(diaSel)}</h2>
          <button data-accion="dia" data-n="1" aria-label="Día siguiente" ${esHoy ? "disabled" : ""}>›</button></div>`;

        // Sin peso ese día: formulario de la mañana
        if (!dd.obj || editPeso) {
          const ult = dd.peso || ultimoPeso(diaSel), pre = editPeso || !esHoy;
          return nav + `<div class="bloque al-form">
            <h2>${esHoy ? "Buenos días" : "Peso de ese día"}</h2>
            <p>${esHoy ? "Pésate recién levantado y dime qué deporte tienes hoy." : "Si no te pesaste, deja el último peso conocido."}</p>
            <label>Peso (kg)</label><input class="al-grande" id="alPeso" inputmode="decimal" placeholder="${ult ? f1(ult) : "0,0"}" value="${pre && ult ? f1(ult) : ""}">
            <label>${esHoy ? "¿Qué toca hoy?" : "¿Qué deporte hiciste?"}</label>
            <div class="al-toggle"><button data-accion="t-gym" id="alTGym" class="${editPeso && dd.gym ? "on" : ""}">Gimnasio</button><button data-accion="t-padel" id="alTPadel" class="${editPeso && dd.padel ? "on" : ""}">Pádel</button></div>
            <div class="al-acciones">${editPeso ? `<button class="boton secundario" data-accion="cancelar-peso">Cancelar</button>` : ""}<button class="boton" data-accion="calcular">${editPeso ? "Recalcular" : "Calcular mi día"}</button></div>
          </div>`;
        }

        const t = totales(dd), o = dd.obj;
        const frac = Math.min(t.kcal / o.kcal, 1), R = 50, C = 2 * Math.PI * R;
        const pasado = t.kcal > o.kcal * 1.05;
        const anillo = `<div class="al-anillo"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--papel-2)" stroke-width="10"/>
          <circle cx="60" cy="60" r="${R}" fill="none" stroke="${pasado ? "#E5776B" : "var(--naranja)"}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C * frac} ${C}"/></svg>
          <div><b>${r0(t.kcal)}</b><span>de ${o.kcal} kcal</span></div></div>`;
        const macro = (n, v, obj) => `<div class="al-macro"><div class="n"><span>${n}</span><span>${r0(v)} / ${obj} g</span></div>
          <div class="al-barra"><div class="${v > obj * 1.1 ? "pasado" : ""}" style="width:${Math.min(v / obj, 1) * 100}%"></div></div></div>`;
        const restan = o.kcal - r0(t.kcal);

        const aguaPct = Math.min(dd.agua / o.agua, 1) * 100;
        const grupos = MOMENTOS.map(m => {
          const xs = dd.comidas.filter(x => x.momento === m);
          if (!xs.length) return "";
          const k = xs.reduce((s, x) => s + x.kcal, 0);
          return `<div class="bloque"><div class="al-cab"><h2>${m}</h2><span class="v">${r0(k)} kcal</span></div>
            ${xs.map(x => `<div class="al-fila"><div class="izq"><div>${esc(x.nombre)}</div>
              <div class="sub">${r0(x.gramos)} g, P ${r0(x.p)} C ${r0(x.c)} G ${r0(x.g)}</div></div>
              <div class="der">${r0(x.kcal)} kcal</div>
              <button class="al-borrar" data-accion="borrar-comida" data-id="${x.id}" aria-label="Borrar">×</button></div>`).join("")}</div>`;
        }).join("");

        return nav + `
          <button class="al-peso" data-accion="editar-peso">
            <div><div class="etiqueta">Peso</div><b>${f1(dd.peso)} kg</b></div>
            <div class="al-chips">${dd.gym ? `<span class="al-chip">Gimnasio</span>` : ""}${dd.padel ? `<span class="al-chip">Pádel</span>` : ""}${!dd.gym && !dd.padel ? `<span class="al-chip gris">Descanso</span>` : ""}</div>
          </button>
          <div class="bloque">
            <div class="al-kcal">${anillo}<div class="al-macros">${macro("Proteína", t.p, o.p)}${macro("Hidratos", t.c, o.c)}${macro("Grasa", t.g, o.g)}</div></div>
            <div class="al-resumen"><span>${restan >= 0 ? "Te quedan " + restan + " kcal" : "Te has pasado " + (-restan) + " kcal"}</span></div>
          </div>
          <div class="bloque">
            <div class="al-agua-top"><h2>Agua</h2><span><b>${f1(dd.agua)}</b> <span class="etiqueta">de ${f1(o.agua)} l</span></span></div>
            <div class="al-barra" style="margin-top:10px"><div style="width:${aguaPct}%"></div></div>
            <div class="al-agua-btns"><button data-accion="agua" data-l="-0.25">−</button><button class="mas" data-accion="agua" data-l="0.25">+ Vaso</button><button class="mas" data-accion="agua" data-l="0.5">+ Botella</button></div>
          </div>
          <button class="al-anadir" data-accion="anadir">Añadir comida</button>
          ${grupos}`;
      }

      // ---------- Evolución ----------
      function grafPeso(ks) {
        const W = 340, H = 180, pad = { t: 10, r: 8, b: 22, l: 34 };
        const pesos = ks.map(k => d.dias[k].peso);
        const media = ks.map((k, i) => { const vent = ks.filter(x => x <= k && x > sumarK(k, -7)).map(x => d.dias[x].peso); return vent.reduce((a, b) => a + b, 0) / vent.length; });
        let min = Math.min(...pesos), max = Math.max(...pesos); const m = Math.max((max - min) * 0.2, 0.5); min -= m; max += m;
        const t0 = aFecha(ks[0]).getTime(), t1 = aFecha(ks[ks.length - 1]).getTime();
        const X = k => pad.l + (W - pad.l - pad.r) * (t1 === t0 ? 1 : (aFecha(k).getTime() - t0) / (t1 - t0));
        const Y = v => H - pad.b - (H - pad.t - pad.b) * (v - min) / (max - min);
        let ej = ""; for (let i = 0; i <= 3; i++) { const v = min + (max - min) * i / 3, y = Y(v); ej += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" stroke="var(--linea)"/><text x="${pad.l - 5}" y="${y + 3}" text-anchor="end">${f1(v)}</text>`; }
        const puntos = ks.map((k, i) => `<circle cx="${X(k)}" cy="${Y(pesos[i])}" r="2.2" fill="var(--tinta-suave)"/>`).join("");
        return `<svg viewBox="0 0 ${W} ${H}">${ej}${puntos}
          <polyline points="${ks.map((k, i) => `${X(k)},${Y(media[i])}`).join(" ")}" fill="none" stroke="var(--naranja)" stroke-width="2.2" stroke-linejoin="round"/>
          <text x="${pad.l}" y="${H - 5}">${fechaCorta(ks[0])}</text><text x="${W - pad.r}" y="${H - 5}" text-anchor="end">${fechaCorta(ks[ks.length - 1])}</text></svg>`;
      }
      function grafKcal(ks) {
        const W = 340, H = 170, pad = { t: 10, r: 8, b: 22, l: 34 };
        const vals = ks.map(k => totales(d.dias[k]).kcal), objs = ks.map(k => d.dias[k].obj ? d.dias[k].obj.kcal : null);
        const max = Math.max(...vals, ...objs.filter(Boolean), 1) * 1.1;
        const n = ks.length, ancho = (W - pad.l - pad.r) / n;
        const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
        let ej = ""; for (let i = 0; i <= 3; i++) { const v = max * i / 3, y = Y(v); ej += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" stroke="var(--linea)"/><text x="${pad.l - 5}" y="${y + 3}" text-anchor="end">${v >= 1000 ? f1(v / 1000) + "k" : r0(v)}</text>`; }
        const barras = ks.map((k, i) => { const x = pad.l + i * ancho + ancho * 0.18, w = Math.max(ancho * 0.64, 1);
          return `<rect x="${x}" y="${Y(vals[i])}" width="${w}" height="${Y(0) - Y(vals[i])}" rx="${Math.min(w / 2, 3)}" fill="var(--naranja)" opacity="${objs[i] && vals[i] > objs[i] * 1.05 ? 1 : 0.75}"/>`; }).join("");
        const objLinea = ks.map((k, i) => objs[i] ? `${pad.l + (i + 0.5) * ancho},${Y(objs[i])}` : null).filter(Boolean).join(" ");
        return `<svg viewBox="0 0 ${W} ${H}">${ej}${barras}<polyline points="${objLinea}" fill="none" stroke="var(--tinta)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <text x="${pad.l}" y="${H - 5}">${fechaCorta(ks[0])}</text><text x="${W - pad.r}" y="${H - 5}" text-anchor="end">${fechaCorta(ks[ks.length - 1])}</text></svg>`;
      }
      function vistaEvolucion() {
        const desde = rango === "todo" ? "0000" : sumarK(hoy, rango === "1m" ? -30 : -90);
        const conPeso = Object.keys(d.dias).filter(k => k >= desde && d.dias[k].peso).sort();
        const conComida = Object.keys(d.dias).filter(k => k >= desde && k < hoy && (d.dias[k].comidas || []).length).sort();
        const rangos = `<div class="al-rangos">${[["1m", "1 mes"], ["3m", "3 meses"], ["todo", "Todo"]].map(([id, n]) => `<button class="${rango === id ? "on" : ""}" data-accion="rango" data-r="${id}">${n}</button>`).join("")}</div>`;

        // Ritmo: media de 7 días de ahora frente a la de hace 14 días
        const media7 = hasta => { const v = Object.keys(d.dias).filter(k => k <= hasta && k > sumarK(hasta, -7) && d.dias[k].peso).map(k => d.dias[k].peso); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
        const mA = media7(hoy), mB = media7(sumarK(hoy, -14));
        const ritmo = mA && mB ? (mA - mB) / 2 : null;
        const ult7 = Object.keys(d.dias).filter(k => k < hoy && k >= sumarK(hoy, -7) && (d.dias[k].comidas || []).length);
        const mediaKcal = ult7.length ? ult7.reduce((s, k) => s + totales(d.dias[k]).kcal, 0) / ult7.length : null;
        const pesoAct = ultimoPeso(hoy);

        const stats = `<div class="al-stats">
          <div><span class="etiqueta">Peso actual</span><b>${pesoAct ? f1(pesoAct) + " kg" : "–"}</b></div>
          <div><span class="etiqueta">Ritmo semanal</span><b>${ritmo === null ? "–" : (ritmo > 0 ? "+" : "") + f1(ritmo) + " kg"}</b></div>
          <div><span class="etiqueta">Media diaria (7 días)</span><b>${mediaKcal ? r0(mediaKcal) + " kcal" : "–"}</b></div>
          <div><span class="etiqueta">Días registrados</span><b>${Object.keys(d.dias).filter(k => d.dias[k].peso).length}</b></div>
        </div>`;
        const nota = ritmo === null ? "" : `<p class="al-nota">Para ganar músculo con poca grasa, un ritmo razonable suele estar entre +0,1 y +0,3 kg por semana. Si llevas varias semanas por debajo o por encima, conviene ajustar el objetivo.</p>`;

        return rangos + stats + `
          <div class="bloque al-graf"><h2>Peso</h2>
            ${conPeso.length >= 2 ? grafPeso(conPeso) + `<div class="al-leyenda"><span><i style="background:var(--tinta-suave);width:6px;height:6px;border-radius:50%"></i>Cada día</span><span><i style="background:var(--naranja)"></i>Media de 7 días</span></div>` + nota
              : `<p>La gráfica aparecerá cuando tengas al menos dos días con peso.</p>`}
          </div>
          <div class="bloque al-graf"><h2>Calorías</h2>
            ${conComida.length >= 2 ? grafKcal(conComida) + `<div class="al-leyenda"><span><i style="background:var(--naranja)"></i>Consumidas</span><span><i style="background:var(--tinta)"></i>Objetivo</span></div>`
              : `<p>La gráfica aparecerá cuando tengas al menos dos días completos con comidas apuntadas (el día de hoy no cuenta hasta que termine).</p>`}
          </div>`;
      }

      function pintar() {
        raiz.innerHTML = `<div class="al-seg">${[["hoy", "Día"], ["evolucion", "Evolución"], ["datos", "Tus datos"]].map(([id, n]) =>
          `<button class="${vista === id ? "on" : ""}" data-accion="vista" data-v="${id}">${n}</button>`).join("")}</div>
          ${vista === "hoy" ? vistaHoy() : vista === "evolucion" ? vistaEvolucion() : vistaDatos()}`;
      }

      // ---------- Hoja para añadir comida ----------
      function hojaComida() {
        const fondo = document.createElement("div");
        fondo.className = "panel-fondo";
        fondo.innerHTML = `<div class="panel al-form" role="dialog"><div id="alPaso"></div></div>`;
        raiz.appendChild(fondo);
        const paso = fondo.querySelector("#alPaso");
        const cerrar = () => fondo.remove();
        fondo.addEventListener("click", e => { if (e.target === fondo) cerrar(); });
        let resultadosWeb = [], buscando = false, errorWeb = "";

        function habituales() { return Object.values(d.alimentos).sort((a, b) => (b.ultimo || 0) - (a.ultimo || 0)); }
        function filaAlimento(a, origen) {
          return `<button class="al-fila" data-elegir="${origen}:${a.id}"><div class="izq"><div>${esc(a.nombre)}</div>
            <div class="sub">${a.marca ? esc(a.marca) + ", " : ""}${r0(a.kcal)} kcal por 100 g</div></div></button>`;
        }
        function pasoBuscar(texto) {
          const q = norm(texto || "");
          const mios = habituales().filter(a => !q || norm(a.nombre + " " + (a.marca || "")).includes(q)).slice(0, q ? 20 : 12);
          const base = q ? BASE.filter(a => norm(a.nombre).includes(q)).slice(0, 20) : [];
          paso.innerHTML = `<h2>Añadir comida</h2>
            <div class="al-busca"><input id="alQ" placeholder="Buscar alimento o marca" value="${esc(texto || "")}" enterkeyhint="search" autocomplete="off"><button data-h="web">Buscar</button></div>
            <div class="al-res">
              ${mios.length ? `<div class="al-grupo">${q ? "Tus alimentos" : "Tus habituales"}</div>` + mios.map(a => filaAlimento(a, "mio")).join("") : ""}
              ${base.length ? `<div class="al-grupo">Básicos</div>` + base.map(a => filaAlimento(a, "base")).join("") : ""}
              ${buscando ? `<p class="al-nota">Buscando en la base de datos…</p>` : ""}
              ${errorWeb ? `<p class="al-nota">${errorWeb}</p>` : ""}
              ${resultadosWeb.length ? `<div class="al-grupo">Productos (Open Food Facts)</div>` + resultadosWeb.map(a => filaAlimento(a, "web")).join("") : ""}
              ${!q && !mios.length ? `<p class="al-nota">Escribe un alimento (arroz, pollo, avena…) y aparecerán los básicos. Para productos de marca, pulsa Buscar. Lo que añadas se guardará en tus habituales.</p>` : ""}
              ${q && !mios.length && !base.length && !resultadosWeb.length && !buscando && !errorWeb ? `<p class="al-nota">No está entre los básicos. Pulsa Buscar para buscar productos de supermercado, o créalo tú.</p>` : ""}
            </div>
            <button class="al-enlace" data-h="crear">Crear alimento a mano</button>
            <div class="al-acciones"><button class="boton secundario" data-h="cerrar">Cerrar</button></div>`;
          const inp = paso.querySelector("#alQ");
          inp.addEventListener("input", () => { resultadosWeb = []; errorWeb = ""; const pos = inp.selectionStart; pasoBuscar(inp.value); const n = paso.querySelector("#alQ"); n.focus(); n.setSelectionRange(pos, pos); });
          inp.addEventListener("keydown", e => { if (e.key === "Enter") buscarWeb(inp.value); });
        }
        async function buscarWeb(texto) {
          texto = (texto || "").trim(); if (!texto) return;
          buscando = true; errorWeb = ""; resultadosWeb = []; pasoBuscar(texto);
          try {
            const url = "https://es.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=25&lc=es&fields=code,product_name,product_name_es,brands,nutriments,serving_quantity&search_terms=" + encodeURIComponent(texto);
            const r = await fetch(url);
            if (!r.ok) throw new Error();
            const j = await r.json();
            resultadosWeb = (j.products || []).map(p => {
              const n = p.nutriments || {};
              const kcal = n["energy-kcal_100g"] != null ? n["energy-kcal_100g"] : (n["energy_100g"] ? n["energy_100g"] / 4.184 : null);
              return { id: "off" + p.code, nombre: (p.product_name_es || p.product_name || "").trim(), marca: (p.brands || "").split(",")[0].trim(),
                kcal: Number(kcal), p: Number(n.proteins_100g) || 0, c: Number(n.carbohydrates_100g) || 0, g: Number(n.fat_100g) || 0, u: Number(p.serving_quantity) || null };
            }).filter(a => a.nombre && isFinite(a.kcal) && a.kcal > 0).slice(0, 15);
            if (!resultadosWeb.length) errorWeb = "No he encontrado productos con ese nombre. Prueba con la marca o créalo a mano.";
          } catch (e) { errorWeb = "No se ha podido buscar ahora (¿sin conexión?). Prueba en un momento o crea el alimento a mano."; }
          buscando = false; if (fondo.isConnected) pasoBuscar(texto);
        }

        function pasoCantidad(a) {
          const momento = diaSel === hoy ? momentoAhora() : "Comida";
          const g0 = a.ultimosGramos || a.u || 100;
          paso.innerHTML = `<h2>${esc(a.nombre)}</h2>${a.marca ? `<p style="margin:0">${esc(a.marca)}</p>` : ""}
            <label>Cantidad (g o ml)</label><input class="al-grande" id="alG" inputmode="decimal" value="${g0}">
            <div class="al-rapidas">${a.u ? `<button data-g="${a.u}">1 unidad (${r0(a.u)} g)</button><button data-g="${a.u * 2}">2 unidades</button>` : ""}<button data-g="50">50 g</button><button data-g="100">100 g</button><button data-g="200">200 g</button></div>
            <div class="al-cuad" id="alCuad"></div>
            <label>Momento</label><select id="alMom">${MOMENTOS.map(m => `<option ${m === momento ? "selected" : ""}>${m}</option>`).join("")}</select>
            <div class="al-acciones"><button class="boton secundario" data-h="volver">Volver</button><button class="boton" data-h="anadir">Añadir</button></div>`;
          const inp = paso.querySelector("#alG");
          const actualizar = () => { const g = num(inp.value) || 0, f = g / 100;
            paso.querySelector("#alCuad").innerHTML = `<div><b>${r0(a.kcal * f)}</b>kcal</div><div><b>${r0(a.p * f)}</b>prot.</div><div><b>${r0(a.c * f)}</b>hidr.</div><div><b>${r0(a.g * f)}</b>grasa</div>`; };
          inp.addEventListener("input", actualizar); actualizar();
          paso.querySelectorAll("[data-g]").forEach(b => b.addEventListener("click", () => { inp.value = String(r1(num(b.dataset.g))).replace(".", ","); actualizar(); }));
          paso.querySelector("[data-h=volver]").addEventListener("click", () => pasoBuscar(""));
          paso.querySelector("[data-h=anadir]").addEventListener("click", () => {
            const g = num(inp.value); if (!(g > 0)) { inp.style.borderColor = "#E5776B"; return; }
            const f = g / 100, momento = paso.querySelector("#alMom").value;
            // Guardar en tus habituales
            const idH = a.id;
            d.alimentos[idH] = Object.assign({}, d.alimentos[idH] || {}, { id: idH, nombre: a.nombre, marca: a.marca || "", kcal: a.kcal, p: a.p, c: a.c, g: a.g, u: a.u || null, ultimo: Date.now(), ultimosGramos: g, usos: ((d.alimentos[idH] || {}).usos || 0) + 1 });
            dia(diaSel).comidas.push({ id: nuevoId(), alimento: idH, nombre: a.nombre, gramos: g, momento, kcal: r1(a.kcal * f), p: r1(a.p * f), c: r1(a.c * f), g: r1(a.g * f) });
            guardar(); cerrar(); pintar();
          });
          setTimeout(() => { inp.focus(); inp.select(); }, 50);
        }

        function pasoCrear() {
          paso.innerHTML = `<h2>Nuevo alimento</h2><p style="margin:0">Copia los valores por 100 g de la etiqueta.</p>
            <label>Nombre</label><input id="alNN" maxlength="50">
            <div class="dos"><div><label>Calorías</label><input id="alNK" inputmode="decimal"></div><div><label>Proteína (g)</label><input id="alNP" inputmode="decimal"></div></div>
            <div class="dos"><div><label>Hidratos (g)</label><input id="alNC" inputmode="decimal"></div><div><label>Grasa (g)</label><input id="alNG" inputmode="decimal"></div></div>
            <label>Gramos por unidad o ración (opcional)</label><input id="alNU" inputmode="decimal">
            <div class="al-acciones"><button class="boton secundario" data-h="volver">Volver</button><button class="boton" data-h="crear-ok">Siguiente</button></div>`;
          paso.querySelector("[data-h=volver]").addEventListener("click", () => pasoBuscar(""));
          paso.querySelector("[data-h=crear-ok]").addEventListener("click", () => {
            const v = id => num(paso.querySelector(id).value);
            const nombre = paso.querySelector("#alNN").value.trim(), kcal = v("#alNK");
            if (!nombre || !(kcal >= 0)) { paso.querySelector(nombre ? "#alNK" : "#alNN").style.borderColor = "#E5776B"; return; }
            pasoCantidad({ id: "u" + nuevoId(), nombre, kcal, p: v("#alNP") || 0, c: v("#alNC") || 0, g: v("#alNG") || 0, u: v("#alNU") || null });
          });
          setTimeout(() => paso.querySelector("#alNN").focus(), 50);
        }

        paso.addEventListener("click", e => {
          const el = e.target.closest("[data-elegir],[data-h]"); if (!el) return;
          if (el.dataset.h === "cerrar") return cerrar();
          if (el.dataset.h === "web") return buscarWeb(paso.querySelector("#alQ").value);
          if (el.dataset.h === "crear") return pasoCrear();
          if (el.dataset.elegir) {
            const [origen, id] = [el.dataset.elegir.slice(0, el.dataset.elegir.indexOf(":")), el.dataset.elegir.slice(el.dataset.elegir.indexOf(":") + 1)];
            const a = origen === "mio" ? d.alimentos[id] : origen === "base" ? BASE.find(x => x.id === id) : resultadosWeb.find(x => x.id === id);
            if (a) pasoCantidad(Object.assign({}, a, origen === "mio" ? {} : { ultimosGramos: (d.alimentos[a.id] || {}).ultimosGramos }));
          }
        });
        pasoBuscar("");
        setTimeout(() => { const i = paso.querySelector("#alQ"); if (i) i.focus(); }, 50);
      }

      // ---------- Eventos ----------
      raiz.addEventListener("click", e => {
        const b = e.target.closest("[data-accion]"); if (!b) return;
        const a = b.dataset.accion;
        if (a === "vista") { vista = b.dataset.v; editPeso = false; }
        else if (a === "rango") rango = b.dataset.r;
        else if (a === "dia") { const n = sumarK(diaSel, Number(b.dataset.n)); if (n <= hoy) { diaSel = n; editPeso = false; } }
        else if (a === "t-gym" || a === "t-padel") { b.classList.toggle("on"); return; }
        else if (a === "calcular") {
          const inp = raiz.querySelector("#alPeso"); const peso = num(inp.value || inp.placeholder);
          if (!(peso > 25 && peso < 300)) { inp.style.borderColor = "#E5776B"; inp.focus(); return; }
          const dd = dia(diaSel);
          dd.peso = r1(peso); dd.gym = raiz.querySelector("#alTGym").classList.contains("on"); dd.padel = raiz.querySelector("#alTPadel").classList.contains("on");
          dd.obj = calcular(dd.peso, dd.gym, dd.padel); editPeso = false; guardar();
        }
        else if (a === "cancelar-peso") editPeso = false;
        else if (a === "editar-peso") editPeso = true;
        else if (a === "agua") { const dd = dia(diaSel); dd.agua = Math.max(0, Math.round(((dd.agua || 0) + Number(b.dataset.l)) * 100) / 100); guardar(); }
        else if (a === "anadir") return hojaComida();
        else if (a === "borrar-comida") { const dd = dia(diaSel); dd.comidas = dd.comidas.filter(x => x.id !== b.dataset.id); guardar(); }
        else if (a === "guardar-perfil") {
          const v = id => raiz.querySelector(id).value.trim();
          const P = { sexo: v("#alSexo"), edad: v("#alEdad"), altura: v("#alAltura"), objetivo: v("#alObj"), actividad: v("#alAct"), minGym: v("#alMinGym") || 60, minPadel: v("#alMinPadel") || 90 };
          const mal = !P.sexo ? "#alSexo" : !(num(P.edad) >= 14 && num(P.edad) <= 100) ? "#alEdad" : !(num(P.altura) >= 120 && num(P.altura) <= 230) ? "#alAltura" : null;
          if (mal) { raiz.querySelector(mal).style.borderColor = "#E5776B"; raiz.querySelector(mal).focus(); return; }
          d.perfil = P;
          const dh = d.dias[hoy]; if (dh && dh.peso) dh.obj = calcular(dh.peso, dh.gym, dh.padel);
          guardar(); vista = "hoy";
        }
        pintar();
      });
      raiz.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "alPeso") raiz.querySelector("[data-accion=calcular]").click(); });

      pintar();
    }
  });
})();
