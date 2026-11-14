const API = 'http://127.0.0.1:8000/api'

const CLAVE_TOKEN = 'labdesk_token'
const CLAVE_USUARIO = 'labdesk_usuario'

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO)) || null
  } catch {
    return null
  }
}

function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token)
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN)
  localStorage.removeItem(CLAVE_USUARIO)
}

export async function iniciarSesion(username, password) {
  const respuesta = await fetch(`${API}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) throw new Error(datos.detail || 'No se pudo iniciar sesión')
  guardarSesion(datos.token, datos.usuario)
  return datos.usuario
}

export async function cerrarSesion() {
  const token = obtenerToken()
  if (token) {
    await fetch(`${API}/auth/logout/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` }
    }).catch(() => {})
  }
  borrarSesion()
}

export async function obtenerPerfil() {
  const token = obtenerToken()
  if (!token) return null
  const respuesta = await fetch(`${API}/auth/me/`, {
    headers: { Authorization: `Token ${token}` }
  })
  if (!respuesta.ok) {
    borrarSesion()
    return null
  }
  return respuesta.json()
}
