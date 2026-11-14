import { useEffect, useState } from 'react'
import {
  iniciarSesion, cerrarSesion, obtenerPerfil, obtenerUsuario, obtenerToken
} from '../services/authApi.js'

export function useAuth() {
  const [usuario, setUsuario] = useState(() => obtenerUsuario())
  const [comprobando, setComprobando] = useState(() => Boolean(obtenerToken()))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!obtenerToken()) return
    let activo = true
    obtenerPerfil().then(perfil => {
      if (!activo) return
      setUsuario(perfil)
      setComprobando(false)
    })
    return () => { activo = false }
  }, [])

  async function entrar(username, password) {
    setError('')
    try {
      setUsuario(await iniciarSesion(username, password))
      return true
    } catch (e) {
      setError(e.message)
      return false
    }
  }

  async function salir() {
    await cerrarSesion()
    setUsuario(null)
    setError('')
  }

  return { usuario, comprobando, error, entrar, salir }
}
