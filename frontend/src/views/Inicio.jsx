export default function Inicio({ onEntrar }) {
  return (
    <main className="inicio">
      <nav className="inicio-nav">
        <a className="inicio-marca" href="#inicio" aria-label="LabDesk inicio">
          <img src="/labdesk-logo.png" alt="LabDesk" />
        </a>
        <button className="inicio-login" type="button" onClick={onEntrar}>
          Iniciar sesión
        </button>
      </nav>

      <section className="inicio-hero" id="inicio">
        <div className="inicio-hero-contenido">
          <p className="inicio-eyebrow">GESTIÓN DE LABORATORIOS</p>
          <h1>Tu laboratorio, <span>bajo control.</span></h1>
          <p className="inicio-descripcion">
            LabDesk centraliza tus incidencias de hardware, software, red e
            impresoras para que tu equipo resuelva más rápido y trabaje mejor.
          </p>
          <div className="inicio-acciones">
            <button className="principal inicio-cta" type="button" onClick={onEntrar}>
              Entrar al panel <span aria-hidden="true">→</span>
            </button>
            <span className="inicio-confianza">Simple, claro y listo para usar</span>
          </div>
        </div>
        <div className="inicio-dashboard" aria-label="Vista previa del panel de LabDesk">
          <img src="/dashboard-preview.png" alt="Panel de resumen de LabDesk" />
        </div>
      </section>

      <section className="inicio-beneficios" aria-label="Beneficios de LabDesk">
        <article>
          <span className="inicio-beneficio-icono">◈</span>
          <div><h2>Todo en un lugar</h2><p>Registra y consulta cada incidencia sin perder información.</p></div>
        </article>
        <article>
          <span className="inicio-beneficio-icono">⌁</span>
          <div><h2>Prioriza lo importante</h2><p>Visualiza estados, prioridades y alertas de vencimiento.</p></div>
        </article>
        <article>
          <span className="inicio-beneficio-icono">✓</span>
          <div><h2>Decide con datos</h2><p>Un resumen claro para mantener tus laboratorios operativos.</p></div>
        </article>
      </section>

      <footer className="inicio-footer">LabDesk · Gestión de incidencias de laboratorio</footer>
    </main>
  )
}
