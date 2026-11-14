const API = 'http://127.0.0.1:8000/api/incidencias/'

async function pedir(url, opciones, mensajeError) {
  const respuesta = await fetch(url, opciones)
  if (!respuesta.ok) throw new Error(mensajeError)
  return respuesta
}

export async function listarIncidencias() {
  const respuesta = await pedir(API, undefined, 'No se pudo cargar la API')
  return respuesta.json()
}

export async function crearIncidencia(datos) {
  const respuesta = await pedir(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  }, 'Verifica los campos enviados')
  return respuesta.json()
}

export async function actualizarIncidencia(id, datos) {
  const respuesta = await pedir(`${API}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  }, 'Verifica los campos enviados')
  return respuesta.json()
}

export async function cambiarEstadoIncidencia(id, estado) {
  const respuesta = await pedir(`${API}${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  }, 'No se pudo cambiar el estado')
  return respuesta.json()
}

export async function eliminarIncidencia(id) {
  await pedir(`${API}${id}/`, { method: 'DELETE' }, 'No se pudo eliminar')
}