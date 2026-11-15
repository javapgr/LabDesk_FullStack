import { useAuth } from './controllers/useAuth.js'
import { useState } from 'react'
import Inicio from './views/Inicio.jsx'
import Login from './views/Login.jsx'
import Panel from './views/Panel.jsx'

export default function App() {
  const { usuario, comprobando, error, entrar, salir } = useAuth()
  const [mostrarLogin, setMostrarLogin] = useState(false)

  if (comprobando) {
    return <div className="cargando-sesion">Verificando sesión…</div>
  }

  if (!usuario) {
    return mostrarLogin
      ? <Login onEntrar={entrar} error={error} onVolver={() => setMostrarLogin(false)} />
      : <Inicio onEntrar={() => setMostrarLogin(true)} />
  }

  return <Panel usuario={usuario} onSalir={salir} />
}
