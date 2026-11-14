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
    error, mostrarFormulario, filtrados, pendientes, resueltos, proceso,
    prioridadAlta, hardware, software, red, maxEstado, totalCategorias,
    porcentajeHardware, porcentajeSoftware,
    abrirNueva, cambiar, guardar, editar, cancelar, actualizarEstado, eliminar,
    exportarCsv
  } = useIncidencias()
  const { vista, navegar } = useNavegacion()

  // laboratorios se obtiene de la API y baja hasta el formulario de incidencia.
  return (
    <Layout vista={vista} onNavegar={navegar} error={error}
      usuario={usuario} onSalir={onSalir}>
      {vista === 'resumen' && (
        <Resumen
          datos={datos}
          pendientes={pendientes} proceso={proceso} resueltos={resueltos}
          prioridadAlta={prioridadAlta}
          hardware={hardware} software={software} red={red}
          maxEstado={maxEstado} totalCategorias={totalCategorias}
          porcentajeHardware={porcentajeHardware} porcentajeSoftware={porcentajeSoftware}
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
        />
      )}
      {vista === 'configuracion' && <Configuracion />}
    </Layout>
  )
}
