import { useState } from 'react'

const RUTAS = {
  resumen: 'Resumen',
  incidencias: 'Incidencias',
  configuracion: 'Configuración'
}

function iniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return 'US'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

export default function Layout({ vista, onNavegar, error, usuario, onSalir, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const nombre = (usuario?.nombre || usuario?.username || 'Usuario')
    .replace(/\s+LabDesk\b/gi, '').trim() || 'Usuario'

  function navegar(destino) {
    onNavegar(destino)
    setMenuAbierto(false)
  }

  return (
    <main className="app-shell">
      {menuAbierto && (
        <button className="menu-fondo" type="button" aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)} />
      )}

      <aside id="menu-lateral" className={`barra-lateral${menuAbierto ? ' abierta' : ''}`}>
        <div className="marca">
          <img className="logo" src="/labdesk-logo.jpg" alt="LabDesk" />
        </div>
        <div className="perfil"><span className="avatar">{iniciales(nombre)}</span>
          <div><strong>{nombre}</strong><small>Sesión activa</small></div>
        </div>
        <nav className="navegacion">
          <span className={vista === 'resumen' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => navegar('resumen')}
            onKeyDown={e => e.key === 'Enter' && navegar('resumen')}>
            ▦ &nbsp; Resumen</span>
          <span className={vista === 'incidencias' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => navegar('incidencias')}
            onKeyDown={e => e.key === 'Enter' && navegar('incidencias')}>
            ▤ &nbsp; Incidencias</span>
          <span className={vista === 'configuracion' ? 'nav-activo' : ''} role="button"
            tabIndex="0" onClick={() => navegar('configuracion')}
            onKeyDown={e => e.key === 'Enter' && navegar('configuracion')}>
            ⚙ &nbsp; Configuración</span>
        </nav>
        <button className="boton-salir boton-salir-lateral" type="button" onClick={onSalir}>
          Cerrar sesión
        </button>
      </aside>

      <div className="contenido">
        <div className="barra-superior">
          <div className="barra-titulo">
            <button className="boton-menu" type="button"
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuAbierto} aria-controls="menu-lateral"
              onClick={() => setMenuAbierto(abierto => !abierto)}>☰</button>
            <span className="ruta">{RUTAS[vista]}</span>
          </div>
          <div className="acciones-superiores"><span className="estado-api">● API conectada</span>
            <span className="avatar avatar-pequeno">{iniciales(nombre)}</span>
          </div>
        </div>

        <div className="contenedor">
          {error && <p className="error">Error: {error}</p>}
          {children}
          <footer>LabDesk · Uso local · Sesión autenticada</footer>
        </div>
      </div>
    </main>
  )
}
