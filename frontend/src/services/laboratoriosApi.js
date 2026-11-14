import { obtenerToken } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/laboratorios/'

function conAutorizacion(extra = {}) {
  const token = obtenerToken()
  return token ? { ...extra, Authorization: `Token ${token}` } : extra
}

export async function listarLaboratorios() {
  const respuesta = await fetch(API, { headers: conAutorizacion() })
  if (respuesta.status === 401) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  if (!respuesta.ok) throw new Error('No se pudo cargar la lista de laboratorios')
  return respuesta.json()
}
