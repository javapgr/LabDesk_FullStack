export default function Resumen({
  datos, pendientes, proceso, resueltos, vencidas, porcentajeResolucion,
  prioridadAlta, prioridadMedia, prioridadBaja, maxPrioridad,
  hardware, software, red, maxEstado, totalCategorias,
  porcentajeHardware, porcentajeSoftware,
}) {
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
            <span>Datos actuales</span></div>
          <div className="barras">
            <div className="barra-fila"><span>Pendientes</span>
              <div className="barra-fondo"><i className="barra pendiente"
                style={{ width: `${pendientes / maxEstado * 100}%` }} /></div>
              <strong>{pendientes}</strong></div>
            <div className="barra-fila"><span>En proceso</span>
              <div className="barra-fondo"><i className="barra proceso"
                style={{ width: `${proceso / maxEstado * 100}%` }} /></div>
              <strong>{proceso}</strong></div>
            <div className="barra-fila"><span>Resueltas</span>
              <div className="barra-fondo"><i className="barra resuelto"
                style={{ width: `${resueltos / maxEstado * 100}%` }} /></div>
              <strong>{resueltos}</strong></div>
          </div>
        </div>
        <div className="grafico panel">
          <div className="grafico-cabecera"><h2>Distribución por categoría</h2>
            <span>Total: {datos.length}</span></div>
          <div className="pastel-contenido">
            <div className="pastel" style={{ background: totalCategorias
              ? `conic-gradient(#8b5cf6 0 ${porcentajeHardware}%, #ec4899 ${porcentajeHardware}% ${porcentajeHardware + porcentajeSoftware}%, #06b6d4 ${porcentajeHardware + porcentajeSoftware}% 100%)`
              : '#e8eef5' }}>
              <div className="pastel-centro"><strong>{datos.length}</strong><span>Total</span></div>
            </div>
            <div className="leyenda">
              <span><i className="punto hardware" />Hardware <strong>{hardware}</strong></span>
              <span><i className="punto software" />Software <strong>{software}</strong></span>
              <span><i className="punto red" />Red <strong>{red}</strong></span>
            </div>
          </div>
        </div>
        <div className="grafico panel">
          <div className="grafico-cabecera"><h2>Incidencias por prioridad</h2>
            <span>Datos actuales</span></div>
          <div className="barras">
            <div className="barra-fila"><span>Alta</span>
              <div className="barra-fondo"><i className="barra alta"
                style={{ width: `${prioridadAlta / maxPrioridad * 100}%` }} /></div>
              <strong>{prioridadAlta}</strong></div>
            <div className="barra-fila"><span>Media</span>
              <div className="barra-fondo"><i className="barra media"
                style={{ width: `${prioridadMedia / maxPrioridad * 100}%` }} /></div>
              <strong>{prioridadMedia}</strong></div>
            <div className="barra-fila"><span>Baja</span>
              <div className="barra-fondo"><i className="barra baja"
                style={{ width: `${prioridadBaja / maxPrioridad * 100}%` }} /></div>
              <strong>{prioridadBaja}</strong></div>
          </div>
        </div>
      </section>
    </>
  )
}
