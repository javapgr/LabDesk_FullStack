import { useEffect, useState } from 'react'
import { crearComentario, listarComentarios } from '../services/comentariosApi.js'
import { formatearFecha } from '../utils/fechas.js'
import { iconoCategoria, etiquetaCategoria } from '../utils/iconosCategoria.js'
import { estadoVencimiento, etiquetaVencimiento } from '../utils/vencimiento.js'

export default function DetalleIncidencia({ incidencia, onCerrar, onEditar }) {
  const [comentarios, setComentarios] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const alerta = estadoVencimiento(incidencia)
  const etiqueta = etiquetaVencimiento(alerta)

  async function cargarComentarios() {
    setCargando(true)
    setError('')
    try {
      setComentarios(await listarComentarios(incidencia.id))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarComentarios()
  }, [incidencia.id])

  async function enviar(e) {
    e.preventDefault()
    if (!texto.trim()) {
      setError('El comentario no puede estar vacío.')
      return
    }
    setGuardando(true)
    setError('')
    try {
      await crearComentario(incidencia.id, texto)
      setTexto('')
      await cargarComentarios()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="modal-fondo" role="presentation" onClick={onCerrar}>
      <section
        className="modal-formulario modal-detalle"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-cabecera">
          <h2 id="titulo-detalle">Detalle #{incidencia.id}</h2>
          <button className="cerrar-modal" type="button" aria-label="Cerrar"
            onClick={onCerrar}>×</button>
        </div>

        <div className="detalle-cabecera">
          <div className="detalle-titulo">
            {iconoCategoria(incidencia.categoria) && (
              <img className="icono-categoria icono-detalle"
                src={iconoCategoria(incidencia.categoria)}
                alt={etiquetaCategoria(incidencia.categoria)} />
            )}
            <h3>{incidencia.titulo}</h3>
          </div>
          <span className={`prioridad ${incidencia.prioridad}`}>{incidencia.prioridad}</span>
        </div>
        {etiqueta && (
          <span className={`alerta-vencimiento ${alerta}`}>{etiqueta}</span>
        )}

        <p className="detalle-descripcion">{incidencia.descripcion}</p>

        <dl className="detalle-datos">
          <div><dt>Estado</dt><dd>{incidencia.estado}</dd></div>
          <div><dt>Categoría</dt><dd>{etiquetaCategoria(incidencia.categoria)}</dd></div>
          <div><dt>Aula</dt><dd>{incidencia.aula || '—'}</dd></div>
          <div><dt>Responsable</dt><dd>{incidencia.responsable || '—'}</dd></div>
          <div><dt>Ubicación</dt><dd>{incidencia.ubicacion || '—'}</dd></div>
          <div><dt>Fecha límite</dt><dd>{formatearFecha(incidencia.fecha_limite)}</dd></div>
          <div><dt>Creado</dt><dd>{formatearFecha(incidencia.creado_en)}</dd></div>
        </dl>

        <div className="detalle-acciones">
          <button type="button" onClick={() => onEditar(incidencia)}>Editar</button>
        </div>

        <h3 className="detalle-subtitulo">Historial de comentarios</h3>
        {cargando && <p className="sin-datos">Cargando comentarios…</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && comentarios.length === 0 && (
          <p className="sin-datos">Aún no hay comentarios.</p>
        )}
        <ul className="lista-comentarios">
          {comentarios.map(c => (
            <li key={c.id}>
              <p>{c.texto}</p>
              <time dateTime={c.creado_en}>{formatearFecha(c.creado_en)}</time>
            </li>
          ))}
        </ul>

        <form className="form-comentario" onSubmit={enviar}>
          <label>Nuevo comentario
            <textarea
              rows="3"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escribe un comentario…"
              disabled={guardando}
            />
          </label>
          <button className="principal" type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Agregar comentario'}
          </button>
        </form>
      </section>
    </div>
  )
}
