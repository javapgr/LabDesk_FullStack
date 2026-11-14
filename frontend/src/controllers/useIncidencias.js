import { useEffect, useState } from 'react'
import {
  listarIncidencias, crearIncidencia, actualizarIncidencia,
  cambiarEstadoIncidencia, eliminarIncidencia
} from '../services/incidenciasApi.js'
import { listarLaboratorios } from '../services/laboratoriosApi.js'

const vacio = {
  titulo: '', descripcion: '', aula: '', categoria: 'hardware',
  prioridad: 'media', estado: 'pendiente'
}

export function useIncidencias() {
  const [datos, setDatos] = useState([])
  const [laboratorios, setLaboratorios] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas')
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  async function cargar() {
    try {
      setDatos(await listarIncidencias())
      setError('')
    } catch (e) { setError(e.message) }
  }

  async function cargarLaboratorios() {
    try {
      setLaboratorios(await listarLaboratorios())
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { cargar(); cargarLaboratorios() }, [])

  function aulaPorDefecto() {
    return laboratorios.length ? laboratorios[0].nombre : 'Sin asignar'
  }

  function abrirNueva() {
    setEditando(null)
    setForm({ ...vacio, aula: aulaPorDefecto() })
    setMostrarFormulario(true)
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function editar(item) {
    setMostrarFormulario(true)
    setEditando(item.id)
    setForm({
      titulo: item.titulo, descripcion: item.descripcion,
      aula: item.aula,
      categoria: item.categoria, prioridad: item.prioridad,
      estado: item.estado
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditando(null)
    setForm({ ...vacio, aula: aulaPorDefecto() })
    setMostrarFormulario(false)
  }

  function exportarCsv() {
    const separador = ';'
    const encabezados = ['ID', 'Título', 'Descripción', 'Aula', 'Categoría', 'Prioridad', 'Estado', 'Creado en']
    const escapar = valor => `"${String(valor ?? '').replaceAll('"', '""')}"`
    const filas = filtrados.map(item => [
      item.id, item.titulo, item.descripcion, item.aula, item.categoria,
      item.prioridad, item.estado, item.creado_en
    ].map(escapar).join(separador))
    const csv = `\uFEFF${[encabezados.join(separador), ...filas].join('\r\n')}`
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    enlace.download = 'incidencias.csv'
    enlace.click()
    URL.revokeObjectURL(enlace.href)
  }

  async function guardar(e) {
    e.preventDefault()
    try {
      if (editando === null) await crearIncidencia(form)
      else await actualizarIncidencia(editando, form)
      cancelar()
      await cargar()
    } catch (e) { setError(e.message) }
  }

  async function actualizarEstado(id, estado) {
    try {
      await cambiarEstadoIncidencia(id, estado)
      await cargar()
    } catch (e) { setError(e.message) }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar esta incidencia?')) return
    try {
      await eliminarIncidencia(id)
      await cargar()
    } catch (e) { setError(e.message) }
  }

  const filtrados = datos.filter(item => {
    const texto = `${item.titulo} ${item.descripcion}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase()) &&
      (filtroEstado === 'todos' || item.estado === filtroEstado) &&
      (filtroPrioridad === 'todas' || item.prioridad === filtroPrioridad)
  })
  const pendientes = datos.filter(x => x.estado === 'pendiente').length
  const resueltos = datos.filter(x => x.estado === 'resuelto').length
  const proceso = datos.filter(x => x.estado === 'en_proceso').length
  const prioridadAlta = datos.filter(x => x.prioridad === 'alta').length
  const hardware = datos.filter(x => x.categoria === 'hardware').length
  const software = datos.filter(x => x.categoria === 'software').length
  const red = datos.filter(x => x.categoria === 'red').length
  const maxEstado = Math.max(pendientes, proceso, resueltos, 1)
  const totalCategorias = hardware + software + red
  const porcentajeHardware = totalCategorias ? hardware / totalCategorias * 100 : 0
  const porcentajeSoftware = totalCategorias ? software / totalCategorias * 100 : 0

  return {
    datos, laboratorios, form, editando, busqueda, setBusqueda, filtroEstado, setFiltroEstado,
    filtroPrioridad, setFiltroPrioridad, error, mostrarFormulario,
    filtrados, pendientes, resueltos, proceso, prioridadAlta, hardware, software, red,
    maxEstado, totalCategorias, porcentajeHardware, porcentajeSoftware,
    abrirNueva, cambiar, guardar, editar, cancelar, actualizarEstado, eliminar,
    exportarCsv
  }
}
