import { borrarSesion, encabezadoAuth } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/incidencias/'

async function pedir(url, opciones = {}, mensajeError) {
  const respuesta = await fetch(url, opciones)
  if (respuesta.status === 401) {
    borrarSesion()
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }
  if (!respuesta.ok) throw new Error(mensajeError)
  return respuesta
}

export async function listarIncidencias() {
  const respuesta = await pedir(API, { headers: encabezadoAuth() }, 'No se pudo cargar la API')
  return respuesta.json()
}

export async function crearIncidencia(datos) {
  const respuesta = await pedir(API, {
    method: 'POST',
    headers: encabezadoAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(datos),
  }, 'Verifica los campos enviados')
  return respuesta.json()
}

export async function actualizarIncidencia(id, datos) {
  const respuesta = await pedir(`${API}${id}/`, {
    method: 'PUT',
    headers: encabezadoAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(datos),
  }, 'Verifica los campos enviados')
  return respuesta.json()
}

export async function cambiarEstadoIncidencia(id, estado) {
  const respuesta = await pedir(`${API}${id}/`, {
    method: 'PATCH',
    headers: encabezadoAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ estado }),
  }, 'No se pudo cambiar el estado')
  return respuesta.json()
}

export async function eliminarIncidencia(id) {
  await pedir(`${API}${id}/`, {
    method: 'DELETE',
    headers: encabezadoAuth(),
  }, 'No se pudo eliminar')
}
