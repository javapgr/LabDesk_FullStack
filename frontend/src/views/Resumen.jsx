import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

const COLORES_ESTADO = {
  Pendientes: '#f59e0b',
  'En proceso': '#3b82f6',
  Resueltas: '#22c55e',
}

const COLORES_PRIORIDAD = {
  Alta: '#ef4444',
  Media: '#f59e0b',
  Baja: '#22c55e',
}

export default function Resumen({
  datos, pendientes, proceso, resueltos, vencidas, porcentajeResolucion,
  prioridadAlta, prioridadMedia, prioridadBaja,
  hardware, software, red, impresora, totalCategorias,
  porcentajeHardware, porcentajeSoftware, porcentajeRed,
}) {
  const datosEstado = [
    { nombre: 'Pendientes', valor: pendientes },
    { nombre: 'En proceso', valor: proceso },
    { nombre: 'Resueltas', valor: resueltos },
  ]
  const datosPrioridad = [
    { nombre: 'Alta', valor: prioridadAlta },
    { nombre: 'Media', valor: prioridadMedia },
    { nombre: 'Baja', valor: prioridadBaja },
  ]

  return (
    <>
      <section className="estadisticas">
        <div className="kpi"><strong>{datos.length}</strong><span>Total registradas</span></div>
        <div className="kpi"><strong>{pendientes}</strong><span>Pendientes</span></div>
        <div className="kpi"><strong>{proceso}</strong><span>En proceso</span></div>
        <div className="kpi"><strong>{resueltos}</strong><span>Resueltas</span></div>
        <div className="kpi kpi-alerta"><strong>{vencidas}</strong><span>Vencidas</span></div>
        <div className="kpi"><strong>{porcentajeResolucion} %</strong><span>Resolución</span></div>
        <div className="kpi"><strong>{prioridadAlta}</strong><span>Prioridad alta</span></div>
        <div className="kpi"><strong>{prioridadMedia}</strong><span>Prioridad media</span></div>
        <div className="kpi"><strong>{prioridadBaja}</strong><span>Prioridad baja</span></div>
      </section>

      <section className="graficos">
        <div className="grafico panel">
          <div className="grafico-cabecera"><h2>Incidencias por estado</h2>
            <span>Datos de la API</span></div>
          <div className="rechart-caja">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={datosEstado}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
                <XAxis dataKey="nombre" stroke="var(--texto-suave)" />
                <YAxis allowDecimals={false} stroke="var(--texto-suave)" />
                <Tooltip />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {datosEstado.map(item => (
                    <Cell key={item.nombre} fill={COLORES_ESTADO[item.nombre]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grafico panel">
          <div className="grafico-cabecera"><h2>Distribución por categoría</h2>
            <span>Total: {datos.length}</span></div>
          <div className="pastel-contenido">
            <div className="pastel" style={{ background: totalCategorias
              ? `conic-gradient(#8b5cf6 0 ${porcentajeHardware}%, #ec4899 ${porcentajeHardware}% ${porcentajeHardware + porcentajeSoftware}%, #06b6d4 ${porcentajeHardware + porcentajeSoftware}% ${porcentajeHardware + porcentajeSoftware + porcentajeRed}%, #f97316 ${porcentajeHardware + porcentajeSoftware + porcentajeRed}% 100%)`
              : 'var(--fondo-suave)' }}>
              <div className="pastel-centro"><strong>{datos.length}</strong><span>Total</span></div>
            </div>
            <div className="leyenda">
              <span><i className="punto hardware" />Hardware <strong>{hardware}</strong></span>
              <span><i className="punto software" />Software <strong>{software}</strong></span>
              <span><i className="punto red" />Red <strong>{red}</strong></span>
              <span><i className="punto impresora" />Impresora <strong>{impresora}</strong></span>
            </div>
          </div>
        </div>
        <div className="grafico panel">
          <div className="grafico-cabecera"><h2>Incidencias por prioridad</h2>
            <span>Datos de la API</span></div>
          <div className="rechart-caja">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={datosPrioridad}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
                <XAxis dataKey="nombre" stroke="var(--texto-suave)" />
                <YAxis allowDecimals={false} stroke="var(--texto-suave)" />
                <Tooltip />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {datosPrioridad.map(item => (
                    <Cell key={item.nombre} fill={COLORES_PRIORIDAD[item.nombre]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  )
}
