# Arquitectura del frontend (MVC)

```
src/
├── services/
│   ├── incidenciasApi.js           → CRUD de incidencias
│   └── comentariosApi.js           → GET/POST comentarios anidados
├── controllers/
│   ├── useIncidencias.js           → estado, filtros, KPIs, vencimiento, acciones
│   └── useNavegacion.js            → vista activa y navegación
├── utils/
│   ├── vencimiento.js              → estadoVencimiento (vencida/proxima)
│   └── fechas.js                   → ISO ↔ datetime-local
├── views/
│   ├── Layout.jsx                  → shell: sidebar, topbar, footer
│   ├── Resumen.jsx                 → KPIs y gráficos (incl. vencidas / % resolución)
│   ├── Incidencias.jsx             → lista, filtros y alertas
│   ├── FormularioIncidencia.jsx    → modal crear/editar
│   ├── DetalleIncidencia.jsx       → detalle + historial de comentarios
│   └── Configuracion.jsx           → información del entorno
├── App.jsx                         → compone controller + vista
└── main.jsx                        → monta React en el DOM
```

## Responsabilidades

| Capa | Archivo | Qué hace | Qué NO hace |
|---|---|---|---|
| Modelo/API | `services/` | `fetch`, valida `respuesta.ok`, lanza errores | no guarda estado ni pinta |
| Controlador | `controllers/` | `useState`, `useEffect`, filtros, cálculos | no pinta JSX |
| Vista | `views/` | recibe datos y callbacks por props | no llama a `fetch` |
| Composición | `App.jsx` | conecta controller con vista | no tiene lógica de negocio |

## Flujo de una petición (crear incidencia)

```
FormularioIncidencia (submit)
  → App pasa guardar()
    → useIncidencias.guardar()
      → incidenciasApi.crearIncidencia()  → POST /api/incidencias/
        → Django: IncidenciaViewSet + IncidenciaSerializer
      → cargar()  → GET /api/incidencias/
  → setDatos() actualiza las props de las vistas
```

## Endpoints

| Método | URL | Servicio |
|---|---|---|
| GET | `/api/incidencias/` | `listarIncidencias()` |
| POST | `/api/incidencias/` | `crearIncidencia()` |
| PUT | `/api/incidencias/{id}/` | `actualizarIncidencia()` |
| PATCH | `/api/incidencias/{id}/` | `cambiarEstadoIncidencia()` |
| DELETE | `/api/incidencias/{id}/` | `eliminarIncidencia()` |
| GET | `/api/incidencias/{id}/comentarios/` | `listarComentarios()` |
| POST | `/api/incidencias/{id}/comentarios/` | `crearComentario()` |

## Nota para la defensa

React no es MVC puro: el hook actúa como **controlador/ViewModel** y las vistas
son componentes presentacionales. El backend Django ya trae su propio MVC/MTV:
`models.py` (Model), `views.py` (Controller), `serializers.py` (salida).
