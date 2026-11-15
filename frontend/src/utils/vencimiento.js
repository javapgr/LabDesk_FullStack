export function estadoVencimiento(inc, ahora = new Date()) {
  if (!inc.fecha_limite || inc.estado === 'resuelto') return null
  const limite = new Date(inc.fecha_limite)
  if (limite < ahora) return 'vencida'
  if (limite - ahora <= 24 * 60 * 60 * 1000) return 'proxima'
  return null
}

export function etiquetaVencimiento(estado) {
  if (estado === 'vencida') return 'Vencida'
  if (estado === 'proxima') return 'Próxima a vencer'
  return null
}
