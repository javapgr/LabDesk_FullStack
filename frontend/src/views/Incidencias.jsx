import FormularioIncidencia from './FormularioIncidencia.jsx'

// La lista de aulas viene de la tabla Laboratorio (API /api/laboratorios/).
export default function Incidencias({
  filtrados, busqueda, setBusqueda,
  filtroEstado, setFiltroEstado, filtroPrioridad, setFiltroPrioridad,
  actualizarEstado, editar, eliminar, abrirNueva,
  mostrarFormulario, form, cambiar, guardar, cancelar, editando, exportarCsv,
  laboratorios
}) {
  return (
    <>
      <div className="acciones-vista">
        <button type="button" onClick={exportarCsv}>
          Exportar CSV
        </button>
        <button className="principal" type="button"
          onClick={abrirNueva}>
          Nueva incidencia
        </button>
      </div>
      <div className="columnas sin-formulario">
        <section className="panel panel-incidencias">
          <div className="cabecera-lista"><h2>Incidencias recientes</h2>
            <span>{filtrados.length} mostradas</span></div>
          <div className="filtros">
            <input placeholder="Buscar por título o descripción..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
              <option value="todas">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="lista">
            {filtrados.length === 0 && <p className="sin-datos">No hay incidencias.</p>}
            {filtrados.map(item => (
              <article className="incidencia" key={item.id}>
                <div className="item-top"><h3>{item.titulo}</h3>
                  <span className={`prioridad ${item.prioridad}`}>{item.prioridad}</span></div>
                <p>{item.descripcion}</p>
                <div className="item-meta"><span>{item.categoria}</span>
                  <span>{item.aula}</span>
                  <span>ID #{item.id}</span></div>
                <div className="item-acciones">
                  <select aria-label="Cambiar estado" value={item.estado}
                    onChange={e => actualizarEstado(item.id, e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                  <button onClick={() => editar(item)}>Editar</button>
                  <button className="peligro" onClick={() => eliminar(item.id)}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {mostrarFormulario && <FormularioIncidencia
        form={form} editando={editando} cambiar={cambiar}
        guardar={guardar} cancelar={cancelar} laboratorios={laboratorios} />}
    </>
  )
}
