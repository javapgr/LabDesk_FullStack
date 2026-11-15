import { useEffect, useState } from 'react'

function leerPreferencia() {
  try {
    const guardado = localStorage.getItem('labdesk-tema')
    if (guardado === 'oscuro' || guardado === 'claro') return guardado
  } catch { /* ignore */ }
  if (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'oscuro'
  }
  return 'claro'
}

export function useTema() {
  const [tema, setTema] = useState(leerPreferencia)

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    try {
      localStorage.setItem('labdesk-tema', tema)
    } catch { /* ignore */ }
  }, [tema])

  function alternarTema() {
    setTema(actual => (actual === 'oscuro' ? 'claro' : 'oscuro'))
  }

  return { tema, alternarTema }
}
