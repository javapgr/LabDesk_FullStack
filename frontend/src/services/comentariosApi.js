import { borrarSesion, encabezadoAuth } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/incidencias/'

async function pedir(url, opciones = {}, mensajeError) {
  const respuesta = await fetch(url, opciones)
  if (respuesta.status === 401) {
    borrarSesion()
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }
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
    { headers: encabezadoAuth() },
    'No se pudieron cargar los comentarios',
  )
  return respuesta.json()
}

export async function crearComentario(incidenciaId, texto) {
  const respuesta = await pedir(
    `${API}${incidenciaId}/comentarios/`,
    {
      method: 'POST',
      headers: encabezadoAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ texto }),
    },
    'No se pudo guardar el comentario',
  )
  return respuesta.json()
}
