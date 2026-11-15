import FormularioIncidencia from './FormularioIncidencia.jsx'
import DetalleIncidencia from './DetalleIncidencia.jsx'
import { formatearFecha } from '../utils/fechas.js'
import { iconoCategoria, etiquetaCategoria } from '../utils/iconosCategoria.js'
import { estadoVencimiento, etiquetaVencimiento } from '../utils/vencimiento.js'

export default function Incidencias({
  filtrados, busqueda, setBusqueda,
  filtroEstado, setFiltroEstado, filtroPrioridad, setFiltroPrioridad,
  actualizarEstado, editar, eliminar, abrirNueva,
  mostrarFormulario, form, cambiar, guardar, cancelar, editando, exportarCsv,
  laboratorios, errorForm, guardando, cargando,
  detalle, abrirDetalle, cerrarDetalle,
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
          {cargando && <p className="sin-datos">Cargando incidencias…</p>}
          <div className="lista">
            {!cargando && filtrados.length === 0 && (
              <p className="sin-datos">No hay incidencias.</p>
            )}
            {filtrados.map(item => {
              const alerta = estadoVencimiento(item)
              const etiqueta = etiquetaVencimiento(alerta)
              const icono = iconoCategoria(item.categoria)
              return (
                <article className={`incidencia${alerta ? ` alerta-${alerta}` : ''}`}
                  key={item.id}>
                  <div className="incidencia-cuerpo">
                    {icono && (
                      <img className="icono-categoria" src={icono}
                        alt={etiquetaCategoria(item.categoria)} />
                    )}
                    <div className="incidencia-info">
                  <div className="item-top"><h3>{item.titulo}</h3>
                    <span className={`prioridad ${item.prioridad}`}>{item.prioridad}</span>
                  </div>
                  {etiqueta && (
                    <span className={`alerta-vencimiento ${alerta}`}>{etiqueta}</span>
                  )}
                  <p>{item.descripcion}</p>
                  <div className="item-meta">
                    <span>{etiquetaCategoria(item.categoria)}</span>
                    <span>{item.aula}</span>
                    <span>{item.responsable || 'Sin responsable'}</span>
                    <span>{item.ubicacion || 'Sin ubicación'}</span>
                    <span>Límite: {formatearFecha(item.fecha_limite)}</span>
                    <span>ID #{item.id}</span>
                  </div>
                    </div>
                  </div>
                  <div className="item-acciones">
                    <select aria-label="Cambiar estado" value={item.estado}
                      onChange={e => actualizarEstado(item.id, e.target.value)}>
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="resuelto">Resuelto</option>
                    </select>
                    <button type="button" onClick={() => abrirDetalle(item)}>Ver</button>
                    <button type="button" onClick={() => editar(item)}>Editar</button>
                    <button className="peligro" type="button"
                      onClick={() => eliminar(item.id)}>Eliminar</button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
      {mostrarFormulario && <FormularioIncidencia
        form={form} editando={editando} cambiar={cambiar}
        guardar={guardar} cancelar={cancelar} laboratorios={laboratorios}
        errorForm={errorForm} guardando={guardando} />}
      {detalle && (
        <DetalleIncidencia
          incidencia={detalle}
          onCerrar={cerrarDetalle}
          onEditar={item => { cerrarDetalle(); editar(item) }}
        />
      )}
    </>
  )
}
