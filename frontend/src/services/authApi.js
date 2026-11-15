const API = 'http://127.0.0.1:8000/api'

const CLAVE_ACCESS = 'labdesk_access'
const CLAVE_REFRESH = 'labdesk_refresh'
const CLAVE_USUARIO = 'labdesk_usuario'

export function obtenerToken() {
  return localStorage.getItem(CLAVE_ACCESS)
}

export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO)) || null
  } catch {
    return null
  }
}

export function encabezadoAuth(extra = {}) {
  const token = obtenerToken()
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra
}

function guardarSesion(access, refresh, usuario) {
  localStorage.setItem(CLAVE_ACCESS, access)
  if (refresh) localStorage.setItem(CLAVE_REFRESH, refresh)
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_ACCESS)
  localStorage.removeItem(CLAVE_REFRESH)
  localStorage.removeItem(CLAVE_USUARIO)
}

export async function iniciarSesion(username, password) {
  const respuesta = await fetch(`${API}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    throw new Error(datos.detail || 'No se pudo iniciar sesión')
  }

  localStorage.setItem(CLAVE_ACCESS, datos.access)
  localStorage.setItem(CLAVE_REFRESH, datos.refresh)

  const perfil = await fetch(`${API}/auth/me/`, {
    headers: { Authorization: `Bearer ${datos.access}` },
  })
  const usuario = await perfil.json().catch(() => ({}))
  if (!perfil.ok) {
    borrarSesion()
    throw new Error(usuario.detail || 'No se pudo obtener el perfil')
  }

  guardarSesion(datos.access, datos.refresh, usuario)
  return usuario
}

export async function cerrarSesion() {
  borrarSesion()
}

export async function obtenerPerfil() {
  const token = obtenerToken()
  if (!token) return null
  const respuesta = await fetch(`${API}/auth/me/`, {
    headers: encabezadoAuth(),
  })
  if (respuesta.status === 401) {
    borrarSesion()
    return null
  }
  if (!respuesta.ok) {
    borrarSesion()
    return null
  }
  return respuesta.json()
}
