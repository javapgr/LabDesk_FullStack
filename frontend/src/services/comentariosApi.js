import { obtenerToken } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/incidencias/'

function conAutorizacion(extra = {}) {
  const token = obtenerToken()
  return token ? { ...extra, Authorization: `Token ${token}` } : extra
}

async function pedir(url, opciones = {}, mensajeError) {
  const respuesta = await fetch(url, opciones)
  if (respuesta.status === 401) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  if (!respuesta.ok) {
    let detalle = mensajeError
    try {
      const data = await respuesta.json()
      if (data.texto) detalle = Array.isArray(data.texto) ? data.texto[0] : data.texto
      else if (data.detail) detalle = data.detail
    } catch { /* usar mensaje genérico */ }
    throw new Error(detalle)
  }
  return respuesta
}

export async function listarComentarios(incidenciaId) {
  const respuesta = await pedir(
    `${API}${incidenciaId}/comentarios/`,
    { headers: conAutorizacion() },
    'No se pudieron cargar los comentarios',
  )
  return respuesta.json()
}

export async function crearComentario(incidenciaId, texto) {
  const respuesta = await pedir(
    `${API}${incidenciaId}/comentarios/`,
    {
      method: 'POST',
      headers: conAutorizacion({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ texto }),
    },
    'No se pudo guardar el comentario',
  )
  return respuesta.json()
}
