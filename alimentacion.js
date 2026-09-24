/* PESTAÑA: Alimentación
   Para cambiarla, sustituye solo este archivo. */
HiperApp.registrar({
  id: "alimentacion",
  titulo: "Alimentación",
  nombreCorto: "Comida",
  color: "#B07A1E",
  icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18"/><path d="M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',
  render(contenedor, store) {
    // store.get(valorPorDefecto) lee los datos de esta pestaña; store.set(valor) los guarda.
    contenedor.innerHTML = `
      <div class="bloque vacio">
        <h2>Alimentación</h2>
        <p>Aquí irá el registro de lo que comes y tus planes de comidas.</p>
      </div>`;
  }
});
