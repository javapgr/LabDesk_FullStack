import { useIncidencias } from '../controllers/useIncidencias.js'
import { useNavegacion } from '../controllers/useNavegacion.js'
import Layout from './Layout.jsx'
import Resumen from './Resumen.jsx'
import Incidencias from './Incidencias.jsx'
import Configuracion from './Configuracion.jsx'

export default function Panel({ usuario, onSalir }) {
  const {
    datos, laboratorios, form, editando, busqueda, setBusqueda,
    filtroEstado, setFiltroEstado, filtroPrioridad, setFiltroPrioridad,
    error, errorForm, mostrarFormulario, cargando, guardando, detalle,
    filtrados, pendientes, resueltos, proceso, vencidas, porcentajeResolucion,
    prioridadAlta, prioridadMedia, prioridadBaja, hardware, software, red, impresora,
    maxEstado, maxPrioridad, totalCategorias,
    porcentajeHardware, porcentajeSoftware, porcentajeRed,
    abrirNueva, cambiar, guardar, editar, cancelar, actualizarEstado, eliminar,
    exportarCsv, abrirDetalle, cerrarDetalle,
  } = useIncidencias()
  const { vista, navegar } = useNavegacion()

  return (
    <Layout vista={vista} onNavegar={navegar} error={error}
      usuario={usuario} onSalir={onSalir}>
      {vista === 'resumen' && (
        <Resumen
          datos={datos}
          pendientes={pendientes} proceso={proceso} resueltos={resueltos}
          vencidas={vencidas} porcentajeResolucion={porcentajeResolucion}
          prioridadAlta={prioridadAlta} prioridadMedia={prioridadMedia}
          prioridadBaja={prioridadBaja} maxPrioridad={maxPrioridad}
          hardware={hardware} software={software} red={red} impresora={impresora}
          maxEstado={maxEstado} totalCategorias={totalCategorias}
          porcentajeHardware={porcentajeHardware} porcentajeSoftware={porcentajeSoftware}
          porcentajeRed={porcentajeRed}
        />
      )}
      {vista === 'incidencias' && (
        <Incidencias
          filtrados={filtrados}
          busqueda={busqueda} setBusqueda={setBusqueda}
          filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado}
          filtroPrioridad={filtroPrioridad} setFiltroPrioridad={setFiltroPrioridad}
          actualizarEstado={actualizarEstado} editar={editar} eliminar={eliminar}
          exportarCsv={exportarCsv}
          abrirNueva={abrirNueva}
          mostrarFormulario={mostrarFormulario}
          form={form} cambiar={cambiar} guardar={guardar} cancelar={cancelar}
          editando={editando} laboratorios={laboratorios}
          errorForm={errorForm} guardando={guardando} cargando={cargando}
          detalle={detalle} abrirDetalle={abrirDetalle} cerrarDetalle={cerrarDetalle}
        />
      )}
      {vista === 'configuracion' && (
        <Configuracion usuario={usuario} laboratorios={laboratorios} />
      )}
    </Layout>
  )
}
