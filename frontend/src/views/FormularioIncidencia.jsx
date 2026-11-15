export default function FormularioIncidencia({
  form, editando, cambiar, guardar, cancelar, laboratorios = [], errorForm = '',
  guardando = false,
}) {
  const aulas = laboratorios.filter(l => l.activo)
  const aulaActualEnLista = aulas.some(l => l.nombre === form.aula)
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
          {errorForm && <p className="error">{errorForm}</p>}
          <label>Título<input required maxLength="120" name="titulo"
            value={form.titulo} onChange={cambiar} placeholder="PC no enciende"
            disabled={guardando} /></label>
          <label>Descripción<textarea required name="descripcion" rows="4"
            value={form.descripcion} onChange={cambiar}
            placeholder="Describe el problema..." disabled={guardando} /></label>
          <label>Aula<select required name="aula"
            value={form.aula} onChange={cambiar} disabled={guardando}>
            {!aulaActualEnLista && (
              <option value={form.aula}>{form.aula || 'Selecciona un aula'}</option>
            )}
            {aulas.map(l => (
              <option key={l.id} value={l.nombre}>
                {l.nombre}{l.ubicacion ? ` — ${l.ubicacion}` : ''}
              </option>
            ))}
          </select></label>
          <label>Responsable<input name="responsable" maxLength="100"
            value={form.responsable} onChange={cambiar}
            placeholder="Juan Pérez" disabled={guardando} /></label>
          <label>Ubicación<input name="ubicacion" maxLength="120"
            value={form.ubicacion} onChange={cambiar}
            placeholder="Lab 3 / Puesto 12" disabled={guardando} /></label>
          <label>Fecha límite<input type="datetime-local" name="fecha_limite"
            value={form.fecha_limite} onChange={cambiar} disabled={guardando} /></label>
          <label>Categoría<select name="categoria" value={form.categoria}
            onChange={cambiar} disabled={guardando}>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="red">Red / Internet</option>
          </select></label>
          <label>Prioridad<select name="prioridad" value={form.prioridad}
            onChange={cambiar} disabled={guardando}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select></label>
          <label>Estado<select name="estado" value={form.estado}
            onChange={cambiar} disabled={guardando}>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
          </select></label>
          <button className="principal" type="submit" disabled={guardando}>
            {guardando
              ? 'Guardando…'
              : editando === null ? 'Registrar' : 'Guardar cambios'}
          </button>
          {editando !== null && <button type="button" onClick={cancelar}
            disabled={guardando}>Cancelar edición</button>}
        </form>
      </section>
    </div>
  )
}
