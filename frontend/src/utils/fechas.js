/** ISO (API) → valor para input datetime-local (hora local, sin Z). */
export function isoADatetimeLocal(iso) {
  if (!iso) return ''
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const pad = n => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}` +
    `T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`
}

/** datetime-local → ISO UTC para la API; vacío → null. */
export function datetimeLocalAIso(valor) {
  if (!valor) return null
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return null
  return fecha.toISOString()
}

export function formatearFecha(iso) {
  if (!iso) return 'Sin fecha'
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return 'Sin fecha'
  return fecha.toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
