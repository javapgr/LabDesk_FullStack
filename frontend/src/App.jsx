import { useEffect, useState } from 'react'

const API = 'http://127.0.0.1:8000/api/incidencias/'
const vacio = {
  titulo: '', descripcion: '', categoria: 'hardware',
  prioridad: 'media', estado: 'pendiente'
}

export default function App() {
  const [datos, setDatos] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas')
  const [error, setError] = useState('')
  const [vista, setVista] = useState('resumen')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  function irAIncidencias() {
    setVista('incidencias')
    document.querySelector('.contenido')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function irAResumen() {
    setVista('resumen')
    document.querySelector('.contenido')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function irAConfiguracion() {
    setVista('configuracion')
    document.querySelector('.contenido')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function abrirNueva() {
    setEditando(null)
    setForm({ ...vacio })
    setMostrarFormulario(true)
  }

  async function cargar() {
    try {
      const respuesta = await fetch(API)
      if (!respuesta.ok) throw new Error('No se pudo cargar la API')
      setDatos(await respuesta.json())
      setError('')
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { cargar() }, [])

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      const url = editando === null ? API : `${API}${editando}/`
      const metodo = editando === null ? 'POST' : 'PUT'
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!respuesta.ok) throw new Error('Verifica los campos enviados')
      cancelar()
      await cargar()
    } catch (e) { setError(e.message) }
  }

  function editar(item) {
    setMostrarFormulario(true)
    setEditando(item.id)
    setForm({
      titulo: item.titulo, descripcion: item.descripcion,
      categoria: item.categoria, prioridad: item.prioridad,
      estado: item.estado
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditando(null)
    setForm({ ...vacio })
    setMostrarFormulario(false)
  }

  async function actualizarEstado(id, estado) {
    try {
      const respuesta = await fetch(`${API}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      })
      if (!respuesta.ok) throw new Error('No se pudo cambiar el estado')
      await cargar()
    } catch (e) { setError(e.message) }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar esta incidencia?')) return
    try {
      const respuesta = await fetch(`${API}${id}/`, { method: 'DELETE' })
      if (!respuesta.ok) throw new Error('No se pudo eliminar')
      await cargar()
    } catch (e) { setError(e.message) }
  }

  const filtrados = datos.filter(item => {
    const texto = `${item.titulo} ${item.descripcion}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase()) &&
      (filtroEstado === 'todos' || item.estado === filtroEstado) &&
      (filtroPrioridad === 'todas' || item.prioridad === filtroPrioridad)
  })
  const pendientes = datos.filter(x => x.estado === 'pendiente').length
  const resueltos = datos.filter(x => x.estado === 'resuelto').length
  const proceso = datos.filter(x => x.estado === 'en_proceso').length
  const hardware = datos.filter(x => x.categoria === 'hardware').length
  const software = datos.filter(x => x.categoria === 'software').length
  const red = datos.filter(x => x.categoria === 'red').length
  const maxEstado = Math.max(pendientes, proceso, resueltos, 1)
  const totalCategorias = hardware + software + red
  const porcentajeHardware = totalCategorias ? hardware / totalCategorias * 100 : 0
  const porcentajeSoftware = totalCategorias ? software / totalCategorias * 100 : 0

  return (
    <main className="app-shell">
      <aside className="barra-lateral">
        <div className="marca"><span className="marca-icono">L</span><strong>LabDesk</strong></div>
        <div className="perfil"><span className="avatar">AD</span>
          <div><strong>Administrador</strong><small>Panel local</small></div>
        </div>
        <nav className="navegacion">
          <span className={vista === 'resumen' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={irAResumen}
            onKeyDown={e => e.key === 'Enter' && irAResumen()}>
            ▦ &nbsp; Resumen</span>
          <span className={vista === 'incidencias' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={irAIncidencias}
            onKeyDown={e => e.key === 'Enter' && irAIncidencias()}>
            ▤ &nbsp; Incidencias</span>
          <span className={vista === 'configuracion' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={irAConfiguracion}
            onKeyDown={e => e.key === 'Enter' && irAConfiguracion()}>
            ⚙ &nbsp; Configuración</span>
        </nav>
        <div className="barra-ayuda"><strong>Centro de ayuda</strong>
          <small>Gestiona el laboratorio desde un solo lugar.</small>
        </div>
      </aside>

      <div className="contenido">
        <div className="barra-superior">
          <span className="ruta">{vista === 'resumen' ? 'Resumen'
            : vista === 'incidencias' ? 'Incidencias' : 'Configuración'}</span>
          <div className="acciones-superiores"><span className="estado-api">● API conectada</span>
            <span className="avatar avatar-pequeno">AD</span></div>
        </div>

        <div className="contenedor">
          {vista === 'resumen' && <section className="estadisticas">
            <div className="kpi"><strong>{datos.length}</strong><span>Total registradas</span></div>
            <div className="kpi"><strong>{pendientes}</strong><span>Pendientes</span></div>
            <div className="kpi"><strong>{proceso}</strong><span>En proceso</span></div>
            <div className="kpi"><strong>{resueltos}</strong><span>Resueltas</span></div>
          </section>}

          {error && <p className="error">Error: {error}</p>}

          {vista === 'resumen' && <section className="graficos">
            <div className="grafico panel">
              <div className="grafico-cabecera"><h2>Incidencias por estado</h2>
                <span>Datos actuales</span></div>
              <div className="barras">
                <div className="barra-fila"><span>Pendientes</span>
                  <div className="barra-fondo"><i className="barra pendiente"
                    style={{ width: `${pendientes / maxEstado * 100}%` }} /></div>
                  <strong>{pendientes}</strong></div>
                <div className="barra-fila"><span>En proceso</span>
                  <div className="barra-fondo"><i className="barra proceso"
                    style={{ width: `${proceso / maxEstado * 100}%` }} /></div>
                  <strong>{proceso}</strong></div>
                <div className="barra-fila"><span>Resueltas</span>
                  <div className="barra-fondo"><i className="barra resuelto"
                    style={{ width: `${resueltos / maxEstado * 100}%` }} /></div>
                  <strong>{resueltos}</strong></div>
              </div>
            </div>
            <div className="grafico panel">
              <div className="grafico-cabecera"><h2>Distribución por categoría</h2>
                <span>Total: {datos.length}</span></div>
              <div className="pastel-contenido">
                <div className="pastel" style={{ background: totalCategorias
                  ? `conic-gradient(#8b5cf6 0 ${porcentajeHardware}%, #ec4899 ${porcentajeHardware}% ${porcentajeHardware + porcentajeSoftware}%, #06b6d4 ${porcentajeHardware + porcentajeSoftware}% 100%)`
                  : '#e8eef5' }}>
                  <div className="pastel-centro"><strong>{datos.length}</strong><span>Total</span></div>
                </div>
                <div className="leyenda">
                  <span><i className="punto hardware" />Hardware <strong>{hardware}</strong></span>
                  <span><i className="punto software" />Software <strong>{software}</strong></span>
                  <span><i className="punto red" />Red <strong>{red}</strong></span>
                </div>
              </div>
            </div>
          </section>}

          {vista === 'incidencias' && <>
            <div className="acciones-vista">
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
            {mostrarFormulario && <div className="modal-fondo" role="presentation">
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
            </div>}
          </>}
          {vista === 'configuracion' && <section className="panel configuracion">
            <div className="configuracion-cabecera">
              <div><h2>Configuración del sistema</h2>
                <p>Información del entorno y conexión de LabDesk.</p></div>
              <span className="api api-config">Django API + React</span>
            </div>
            <div className="configuracion-datos">
              <div><span>Entorno</span><strong>Desarrollo local</strong></div>
              <div><span>Servidor de datos</span><strong>SQLite</strong></div>
              <div><span>API</span><strong>127.0.0.1:8000</strong></div>
              <div><span>Interfaz</span><strong>React + Vite</strong></div>
            </div>
          </section>}
          <footer>LabDesk · Uso local · Sin autenticación</footer>
        </div>
      </div>
    </main>
  )
}
