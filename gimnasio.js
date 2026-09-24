/* PESTAÑA: Gimnasio y deporte
   Para cambiarla, sustituye solo este archivo. */
HiperApp.registrar({
  id: "gimnasio",
  titulo: "Gimnasio y deporte",
  nombreCorto: "Deporte",
  color: "#B4463C",
  icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/></svg>',
  render(contenedor, store) {
    // store.get(valorPorDefecto) lee los datos de esta pestaña; store.set(valor) los guarda.
    contenedor.innerHTML = `
      <div class="bloque vacio">
        <h2>Gimnasio y deporte</h2>
        <p>Aquí irán tus rutinas, entrenamientos y marcas.</p>
      </div>`;
  }
});
