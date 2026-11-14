# Arquitectura del frontend (MVC)

```
src/
├── services/incidenciasApi.js      → las 5 llamadas HTTP a la API
├── controllers/
│   ├── useIncidencias.js           → estado, filtros, KPIs, acciones
│   └── useNavegacion.js            → vista activa y navegación
├── views/
│   ├── Layout.jsx                  → shell: sidebar, topbar, footer
│   ├── Resumen.jsx                 → KPIs y gráficos
│   ├── Incidencias.jsx             → lista y filtros
│   ├── FormularioIncidencia.jsx    → modal crear/editar
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

## Nota para la defensa

React no es MVC puro: el hook actúa como **controlador/ViewModel** y las vistas
son componentes presentacionales. El backend Django ya trae su propio MVC/MTV:
`models.py` (Model), `views.py` (Controller), `serializers.py` (salida).
