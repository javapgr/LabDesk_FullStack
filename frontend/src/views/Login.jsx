import { useState } from 'react'

export default function Login({ onEntrar, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    await onEntrar(username.trim(), password)
    setEnviando(false)
  }

  return (
    <main className="login-pantalla">
      <section className="login-tarjeta">
        <div className="login-marca">
          <img className="logo logo-login" src="/labdesk-logo.jpg" alt="LabDesk" />
        </div>

        <h1>Inicia sesión</h1>

        <form onSubmit={enviar}>
          <label>Usuario
            <input
              name="username" value={username} autoComplete="username" autoFocus
              onChange={e => setUsername(e.target.value)} placeholder="tu usuario" required
            />
          </label>
          <label>Contraseña
            <input
              name="password" type="password" value={password}
              autoComplete="current-password" placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="principal" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>

      </section>
    </main>
  )
}
