import { useCallback, useEffect, useState } from 'react'
import { listarIncidencias } from '../services/incidenciasApi.js'
import { listarLaboratorios } from '../services/laboratoriosApi.js'

const inicial = {
  comprobando: true, conectado: false, latencia: null,
  incidencias: 0, laboratorios: 0, error: '', comprobadoEn: null
}

export function useEstadoApi() {
  const [estado, setEstado] = useState(inicial)

  const comprobar = useCallback(async () => {
    setEstado(actual => ({ ...actual, comprobando: true, error: '' }))
    const inicio = performance.now()
    try {
      const [incidencias, laboratorios] = await Promise.all([
        listarIncidencias(), listarLaboratorios()
      ])
      setEstado({
        comprobando: false, conectado: true,
        latencia: Math.round(performance.now() - inicio),
        incidencias: incidencias.length, laboratorios: laboratorios.length,
        error: '', comprobadoEn: new Date()
      })
    } catch (e) {
      setEstado({
        comprobando: false, conectado: false, latencia: null,
        incidencias: 0, laboratorios: 0,
        error: e.message, comprobadoEn: new Date()
      })
    }
  }, [])

  useEffect(() => { comprobar() }, [comprobar])

  return { estado, comprobar }
}
