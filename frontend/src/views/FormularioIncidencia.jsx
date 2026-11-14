export default function FormularioIncidencia({ form, editando, cambiar, guardar, cancelar }) {
  return (
    <div className="modal-fondo" role="presentation">
      <section className="modal-formulario" role="dialog" aria-modal="true"
        aria-labelledby="titulo-formulario">
        <div className="modal-cabecera">
          <h2 id="titulo-formulario">
            {editando === null ? 'Nueva incidencia' : 'Editar incidencia'}
          </h2>
          <button className="cerrar-modal" type="button" aria-label="Cerrar formulario"
            onClick={cancelar}>×</button>
        </div>
        <form onSubmit={guardar}>
          <label>Título<input required maxLength="120" name="titulo"
            value={form.titulo} onChange={cambiar} placeholder="PC no enciende" /></label>
          <label>Descripción<textarea required name="descripcion" rows="4"
            value={form.descripcion} onChange={cambiar}
            placeholder="Describe el problema..." /></label>
          <label>Categoría<select name="categoria" value={form.categoria} onChange={cambiar}>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="red">Red / Internet</option>
          </select></label>
          <label>Prioridad<select name="prioridad" value={form.prioridad} onChange={cambiar}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select></label>
          <label>Estado<select name="estado" value={form.estado} onChange={cambiar}>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
          </select></label>
          <button className="principal" type="submit">
            {editando === null ? 'Registrar' : 'Guardar cambios'}
          </button>
          {editando !== null && <button type="button" onClick={cancelar}>
            Cancelar edición</button>}
        </form>
      </section>
    </div>
  )
}
