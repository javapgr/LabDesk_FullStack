import { useState } from 'react'
import { useEstadoApi } from '../controllers/useEstadoApi.js'
import { descargarRespaldo } from '../services/configuracionApi.js'

function exportarLaboratorios(laboratorios) {
  const separador = ';'
  const encabezados = ['ID', 'Laboratorio', 'Ubicación', 'Activo']
  const escapar = valor => `"${String(valor ?? '').replaceAll('"', '""')}"`
  const filas = laboratorios.map(l => [
    l.id, l.nombre, l.ubicacion, l.activo ? 'Sí' : 'No'
  ].map(escapar).join(separador))
  const csv = `\uFEFF${[encabezados.join(separador), ...filas].join('\r\n')}`
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  enlace.download = 'laboratorios.csv'
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

export default function Configuracion({ usuario, laboratorios = [] }) {
  const { estado, comprobar } = useEstadoApi()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function respaldar() {
    setError('')
    setMensaje('')
    try {
      const nombre = await descargarRespaldo()
      setMensaje(`Respaldo descargado: ${nombre}`)
    } catch (e) { setError(e.message) }
  }

  function exportar() {
    setError('')
    if (!laboratorios.length) {
      setMensaje('')
      setError('No hay laboratorios para exportar')
      return
    }
    exportarLaboratorios(laboratorios)
    setMensaje(`Laboratorios exportados: ${laboratorios.length} registros (laboratorios.csv)`)
  }

  const hora = estado.comprobadoEn
    ? estado.comprobadoEn.toLocaleTimeString('es-PE')
    : '—'

  return (
    <section className="panel configuracion">
      <div className="configuracion-cabecera">
        <div><h2>Configuración del sistema</h2>
          <p>Estado real de la API, respaldos y exportación de datos.</p></div>
      </div>

      <h3 className="configuracion-subtitulo">Estado de la API</h3>
      <div className="configuracion-datos">
        <div><span>Conexión</span>
          <strong>{estado.comprobando ? 'Comprobando...' : estado.conectado ? 'Correcta' : 'Fallida'}</strong></div>
        <div><span>Latencia</span>
          <strong>{estado.latencia === null ? '—' : `${estado.latencia} ms`}</strong></div>
        <div><span>Incidencias</span><strong>{estado.incidencias}</strong></div>
        <div><span>Laboratorios</span><strong>{estado.laboratorios}</strong></div>
      </div>
      <p className="configuracion-nota">
        Última comprobación: {hora}
        {estado.error && <> · <span className="configuracion-error-texto">{estado.error}</span></>}
      </p>
      <div className="configuracion-acciones">
        <button type="button" onClick={comprobar} disabled={estado.comprobando}>
          {estado.comprobando ? 'Comprobando...' : 'Volver a comprobar'}
        </button>
      </div>

      <h3 className="configuracion-subtitulo">Respaldo y exportación</h3>
      <p className="configuracion-texto">
        El respaldo JSON incluye laboratorios e incidencias. El CSV de laboratorios
        se abre en Excel con los acentos correctos.
      </p>
      <div className="configuracion-acciones">
        <button className="principal" type="button" onClick={respaldar}>
          Descargar respaldo JSON
        </button>
        <button type="button" onClick={exportar}>
          Exportar laboratorios CSV
        </button>
      </div>
      {mensaje && <p className="configuracion-ok">{mensaje}</p>}
      {error && <p className="error">Error: {error}</p>}

      <h3 className="configuracion-subtitulo">Entorno</h3>
      <div className="configuracion-datos">
        <div><span>Entorno</span><strong>Desarrollo local</strong></div>
        <div><span>Servidor de datos</span><strong>SQLite</strong></div>
        <div><span>API</span><strong>127.0.0.1:8000</strong></div>
        <div><span>Interfaz</span><strong>React + Vite</strong></div>
        <div><span>Usuario</span>
          <strong>{usuario?.nombre || usuario?.username || '—'}</strong></div>
        <div><span>Autenticación</span><strong>Token</strong></div>
      </div>
    </section>
  )
}
