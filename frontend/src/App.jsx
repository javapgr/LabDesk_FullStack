import { useIncidencias } from './controllers/useIncidencias.js'
import { useNavegacion } from './controllers/useNavegacion.js'
import Layout from './views/Layout.jsx'
import Resumen from './views/Resumen.jsx'
import Incidencias from './views/Incidencias.jsx'
import Configuracion from './views/Configuracion.jsx'

export default function App() {
  const {
    datos, form, editando, busqueda, setBusqueda,
    filtroEstado, setFiltroEstado, filtroPrioridad, setFiltroPrioridad,
    error, mostrarFormulario, filtrados, pendientes, resueltos, proceso,
    hardware, software, red, maxEstado, totalCategorias,
    porcentajeHardware, porcentajeSoftware,
    abrirNueva, cambiar, guardar, editar, cancelar, actualizarEstado, eliminar
  } = useIncidencias()
  const { vista, navegar } = useNavegacion()

  return (
    <Layout vista={vista} onNavegar={navegar} error={error}>
      {vista === 'resumen' && (
        <Resumen
          datos={datos}
          pendientes={pendientes} proceso={proceso} resueltos={resueltos}
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
          abrirNueva={abrirNueva}
          mostrarFormulario={mostrarFormulario}
          form={form} cambiar={cambiar} guardar={guardar} cancelar={cancelar}
          editando={editando}
        />
      )}
      {vista === 'configuracion' && <Configuracion />}
    </Layout>
  )
}
