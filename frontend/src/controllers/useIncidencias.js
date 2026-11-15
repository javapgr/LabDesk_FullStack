import { useEffect, useState } from 'react'
import {
  listarIncidencias, crearIncidencia, actualizarIncidencia,
  cambiarEstadoIncidencia, eliminarIncidencia
} from '../services/incidenciasApi.js'
import { listarLaboratorios } from '../services/laboratoriosApi.js'
import { datetimeLocalAIso, isoADatetimeLocal } from '../utils/fechas.js'
import { estadoVencimiento } from '../utils/vencimiento.js'

const vacio = {
  titulo: '', descripcion: '', aula: '', responsable: '', ubicacion: '',
  fecha_limite: '', categoria: 'hardware', prioridad: 'media', estado: 'pendiente',
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
  const [errorForm, setErrorForm] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [detalle, setDetalle] = useState(null)

  async function cargar() {
    setCargando(true)
    try {
      setDatos(await listarIncidencias())
      setError('')
    } catch (e) { setError(e.message) }
    finally { setCargando(false) }
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
    setErrorForm('')
    setForm({ ...vacio, aula: aulaPorDefecto() })
    setMostrarFormulario(true)
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function editar(item) {
    setMostrarFormulario(true)
    setEditando(item.id)
    setErrorForm('')
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      aula: item.aula,
      responsable: item.responsable || '',
      ubicacion: item.ubicacion || '',
      fecha_limite: isoADatetimeLocal(item.fecha_limite),
      categoria: item.categoria,
      prioridad: item.prioridad,
      estado: item.estado,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditando(null)
    setErrorForm('')
    setForm({ ...vacio, aula: aulaPorDefecto() })
    setMostrarFormulario(false)
  }

  function abrirDetalle(item) {
    setDetalle(item)
  }

  function cerrarDetalle() {
    setDetalle(null)
  }

  function payloadDesdeForm() {
    return {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      aula: form.aula,
      responsable: form.responsable.trim(),
      ubicacion: form.ubicacion.trim(),
      fecha_limite: datetimeLocalAIso(form.fecha_limite),
      categoria: form.categoria,
      prioridad: form.prioridad,
      estado: form.estado,
    }
  }

  function exportarCsv() {
    const separador = ';'
    const encabezados = [
      'ID', 'Título', 'Descripción', 'Aula', 'Responsable', 'Ubicación',
      'Fecha límite', 'Categoría', 'Prioridad', 'Estado', 'Creado en',
    ]
    const escapar = valor => `"${String(valor ?? '').replaceAll('"', '""')}"`
    const filas = filtrados.map(item => [
      item.id, item.titulo, item.descripcion, item.aula, item.responsable,
      item.ubicacion, item.fecha_limite, item.categoria, item.prioridad,
      item.estado, item.creado_en,
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
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setErrorForm('El título y la descripción son obligatorios.')
      return
    }
    setGuardando(true)
    setErrorForm('')
    try {
      const payload = payloadDesdeForm()
      if (editando === null) await crearIncidencia(payload)
      else await actualizarIncidencia(editando, payload)
      cancelar()
      await cargar()
    } catch (err) {
      setErrorForm(err.message)
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function actualizarEstado(id, estado) {
    try {
      await cambiarEstadoIncidencia(id, estado)
      await cargar()
      if (detalle?.id === id) {
        setDetalle(prev => prev ? { ...prev, estado } : null)
      }
    } catch (e) { setError(e.message) }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar esta incidencia?')) return
    try {
      await eliminarIncidencia(id)
      if (detalle?.id === id) setDetalle(null)
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
  const vencidas = datos.filter(x => estadoVencimiento(x) === 'vencida').length
  const porcentajeResolucion = datos.length
    ? Math.round((resueltos / datos.length) * 100)
    : 0
  const prioridadAlta = datos.filter(x => x.prioridad === 'alta').length
  const prioridadMedia = datos.filter(x => x.prioridad === 'media').length
  const prioridadBaja = datos.filter(x => x.prioridad === 'baja').length
  const hardware = datos.filter(x => x.categoria === 'hardware').length
  const software = datos.filter(x => x.categoria === 'software').length
  const red = datos.filter(x => x.categoria === 'red').length
  const impresora = datos.filter(x => x.categoria === 'impresora').length
  const maxEstado = Math.max(pendientes, proceso, resueltos, 1)
  const maxPrioridad = Math.max(prioridadAlta, prioridadMedia, prioridadBaja, 1)
  const totalCategorias = hardware + software + red + impresora
  const porcentajeHardware = totalCategorias ? hardware / totalCategorias * 100 : 0
  const porcentajeSoftware = totalCategorias ? software / totalCategorias * 100 : 0
  const porcentajeRed = totalCategorias ? red / totalCategorias * 100 : 0

  return {
    datos, laboratorios, form, editando, busqueda, setBusqueda, filtroEstado, setFiltroEstado,
    filtroPrioridad, setFiltroPrioridad, error, errorForm, mostrarFormulario,
    cargando, guardando, detalle,
    filtrados, pendientes, resueltos, proceso, vencidas, porcentajeResolucion,
    prioridadAlta, prioridadMedia, prioridadBaja,
    hardware, software, red, impresora, maxEstado, maxPrioridad, totalCategorias,
    porcentajeHardware, porcentajeSoftware, porcentajeRed,
    abrirNueva, cambiar, guardar, editar, cancelar, actualizarEstado, eliminar,
    exportarCsv, abrirDetalle, cerrarDetalle,
  }
}
