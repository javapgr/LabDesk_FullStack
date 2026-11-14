import { useState } from 'react'

export function useNavegacion(inicial = 'resumen') {
  const [vista, setVista] = useState(inicial)

  function navegar(destino) {
    setVista(destino)
    document.querySelector('.contenido')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { vista, navegar }
}
