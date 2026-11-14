import { useAuth } from './controllers/useAuth.js'
import Login from './views/Login.jsx'
import Panel from './views/Panel.jsx'

export default function App() {
  const { usuario, comprobando, error, entrar, salir } = useAuth()

  if (comprobando) {
    return <div className="cargando-sesion">Verificando sesión…</div>
  }

  if (!usuario) {
    return <Login onEntrar={entrar} error={error} />
  }

  return <Panel usuario={usuario} onSalir={salir} />
}
