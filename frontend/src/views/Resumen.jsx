export default function Resumen({
  datos, pendientes, proceso, resueltos,
  hardware, software, red, maxEstado, totalCategorias,
  porcentajeHardware, porcentajeSoftware
}) {
  return (
    <>
      <section className="estadisticas">
        <div className="kpi"><strong>{datos.length}</strong><span>Total registradas</span></div>
        <div className="kpi"><strong>{pendientes}</strong><span>Pendientes</span></div>
        <div className="kpi"><strong>{proceso}</strong><span>En proceso</span></div>
        <div className="kpi"><strong>{resueltos}</strong><span>Resueltas</span></div>
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
      </section>
    </>
  )
}
