const ICONOS = {
  hardware: '/icon-pc.jpg',
  red: '/icon-router.jpg',
  impresora: '/icon-impresora.jpg',
}

export function iconoCategoria(categoria) {
  return ICONOS[categoria] || null
}

export function etiquetaCategoria(categoria) {
  const mapa = {
    hardware: 'Hardware',
    software: 'Software',
    red: 'Red / Internet',
    impresora: 'Impresora',
  }
  return mapa[categoria] || categoria
}
