/* PESTAÑA: Series, pelis y libros
   Para cambiarla, sustituye solo este archivo. */
HiperApp.registrar({
  id: "ocio",
  titulo: "Series, pelis y libros",
  nombreCorto: "Ocio",
  color: "#6B4E8C",
  icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/></svg>',
  render(contenedor, store) {
    // store.get(valorPorDefecto) lee los datos de esta pestaña; store.set(valor) los guarda.
    contenedor.innerHTML = `
      <div class="bloque vacio">
        <h2>Series, pelis y libros</h2>
        <p>Aquí irá lo que has visto y leído y lo que tienes pendiente.</p>
      </div>`;
  }
});
