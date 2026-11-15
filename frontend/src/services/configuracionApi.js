import { borrarSesion, encabezadoAuth } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/respaldo/'

export async function descargarRespaldo() {
  const respuesta = await fetch(API, { headers: encabezadoAuth() })
  if (respuesta.status === 401) {
    borrarSesion()
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }
  if (!respuesta.ok) throw new Error('No se pudo descargar el respaldo')

  const blob = await respuesta.blob()
  const disposicion = respuesta.headers.get('Content-Disposition') || ''
  const match = /filename="?([^"]+)"?/.exec(disposicion)
  const nombre = match?.[1] || 'labdesk-respaldo.json'
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(blob)
  enlace.download = nombre
  enlace.click()
  URL.revokeObjectURL(enlace.href)
  return nombre
}
