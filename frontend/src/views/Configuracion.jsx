export default function Configuracion() {
  return (
    <section className="panel configuracion">
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
    </section>
  )
}
