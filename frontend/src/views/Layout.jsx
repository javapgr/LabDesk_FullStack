const RUTAS = {
  resumen: 'Resumen',
  incidencias: 'Incidencias',
  configuracion: 'Configuración'
}

export default function Layout({ vista, onNavegar, error, children }) {
  return (
    <main className="app-shell">
      <aside className="barra-lateral">
        <div className="marca"><span className="marca-icono">L</span><strong>LabDesk</strong></div>
        <div className="perfil"><span className="avatar">AD</span>
          <div><strong>Administrador</strong><small>Panel local</small></div>
        </div>
        <nav className="navegacion">
          <span className={vista === 'resumen' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => onNavegar('resumen')}
            onKeyDown={e => e.key === 'Enter' && onNavegar('resumen')}>
            ▦ &nbsp; Resumen</span>
          <span className={vista === 'incidencias' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => onNavegar('incidencias')}
            onKeyDown={e => e.key === 'Enter' && onNavegar('incidencias')}>
            ▤ &nbsp; Incidencias</span>
          <span className={vista === 'configuracion' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => onNavegar('configuracion')}
            onKeyDown={e => e.key === 'Enter' && onNavegar('configuracion')}>
            ⚙ &nbsp; Configuración</span>
        </nav>
        <div className="barra-ayuda"><strong>Centro de ayuda</strong>
          <small>Gestiona el laboratorio desde un solo lugar.</small>
        </div>
      </aside>

      <div className="contenido">
        <div className="barra-superior">
          <span className="ruta">{RUTAS[vista]}</span>
          <div className="acciones-superiores"><span className="estado-api">● API conectada</span>
            <span className="avatar avatar-pequeno">AD</span></div>
        </div>

        <div className="contenedor">
          {error && <p className="error">Error: {error}</p>}
          {children}
          <footer>LabDesk · Uso local · Sin autenticación</footer>
        </div>
      </div>
    </main>
  )
}
