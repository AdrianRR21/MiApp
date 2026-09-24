/* PESTAÑA: Patrimonio
   Para cambiarla, sustituye solo este archivo. */
HiperApp.registrar({
  id: "patrimonio",
  titulo: "Patrimonio",
  nombreCorto: "Patrimonio",
  color: "#2F5D8A",
  icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/></svg>',
  render(contenedor, store) {
    // store.get(valorPorDefecto) lee los datos de esta pestaña; store.set(valor) los guarda.
    contenedor.innerHTML = `
      <div class="bloque vacio">
        <h2>Patrimonio</h2>
        <p>Aquí irán tus cuentas, gastos, ingresos e inversiones.</p>
      </div>`;
  }
});
