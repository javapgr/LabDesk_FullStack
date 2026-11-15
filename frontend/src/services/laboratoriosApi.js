import { borrarSesion, encabezadoAuth } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/laboratorios/'

export async function listarLaboratorios() {
  const respuesta = await fetch(API, { headers: encabezadoAuth() })
  if (respuesta.status === 401) {
    borrarSesion()
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }
  if (!respuesta.ok) throw new Error('No se pudieron cargar los laboratorios')
  return respuesta.json()
}
