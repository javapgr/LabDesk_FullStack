import { obtenerToken } from './authApi.js'

const API = 'http://127.0.0.1:8000/api/respaldo/'

function conAutorizacion(extra = {}) {
  const token = obtenerToken()
  return token ? { ...extra, Authorization: `Token ${token}` } : extra
}

function nombreDesdeCabecera(respuesta) {
  const disposicion = respuesta.headers.get('Content-Disposition') || ''
  const coincidencia = /filename="?([^";]+)"?/.exec(disposicion)
  return coincidencia ? coincidencia[1] : 'labdesk-respaldo.json'
}

export async function descargarRespaldo() {
  const respuesta = await fetch(API, { headers: conAutorizacion() })
  if (respuesta.status === 401) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  if (!respuesta.ok) throw new Error('No se pudo generar el respaldo')

  const nombre = nombreDesdeCabecera(respuesta)
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(await respuesta.blob())
  enlace.download = nombre
  enlace.click()
  URL.revokeObjectURL(enlace.href)
  return nombre
}
