# LabDesk — Instrucciones para Cursor

Sistema de gestión de incidencias (hardware, software, red) de un laboratorio.
**Stack:** Django + Django REST Framework + SQLite (backend) · React + Vite (frontend).
**Meta:** CRUD completo, filtros y panel de estadísticas consumiendo la API real. Local, sin autenticación.

---

## Reglas para el agente

1. Trabaja **por etapas**. No avances a la siguiente sin mostrar la evidencia de la actual.
2. Nunca digas "listo" sin **salida real** de comandos (curl, `manage.py check`, build, etc.).
3. Si algo falla, reporta en este formato corto:
   - **Problema** → **Causa** → **Fix** (archivo y línea) → **Verificación** (salida real) → **Estado**
4. No instales librerías fuera de las listadas. No agregues autenticación.
5. Frontend: solo `fetch`, `useState`, `useEffect`. CSS plano en `App.css`, responsive.
6. Excluir `.venv` y `node_modules` de cualquier entrega.

---

## Estructura esperada

```
labdesk/
├── backend/
│   ├── manage.py
│   ├── config/            (settings.py, urls.py)
│   ├── incidencias/       (models.py, serializers.py, views.py)
│   └── db.sqlite3
└── frontend/
    ├── package.json
    └── src/ (main.jsx, App.jsx, App.css)
```

---

## Etapa 1 — Backend Django

Desde `labdesk/backend/`:

```bash
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1   |   Linux/macOS: source .venv/bin/activate
python -m pip install django djangorestframework django-cors-headers
django-admin startproject config .
python manage.py startapp incidencias
```

**`config/settings.py`**

- `INSTALLED_APPS` += `'rest_framework'`, `'corsheaders'`, `'incidencias'`
- `MIDDLEWARE`: `corsheaders.middleware.CorsMiddleware` **antes** de `CommonMiddleware`
- Al final:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

**`incidencias/models.py`**

```python
from django.db import models

class Incidencia(models.Model):
    CATEGORIAS = [('hardware', 'Hardware'), ('software', 'Software'), ('red', 'Red / Internet')]
    PRIORIDADES = [('baja', 'Baja'), ('media', 'Media'), ('alta', 'Alta')]
    ESTADOS = [('pendiente', 'Pendiente'), ('en_proceso', 'En proceso'), ('resuelto', 'Resuelto')]

    titulo = models.CharField(max_length=120)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='hardware')
    prioridad = models.CharField(max_length=10, choices=PRIORIDADES, default='media')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
```

**`incidencias/serializers.py`**

```python
from rest_framework import serializers
from .models import Incidencia

class IncidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = '__all__'
        read_only_fields = ['id', 'creado_en']
```

**`incidencias/views.py`**

```python
from rest_framework import viewsets
from .models import Incidencia
from .serializers import IncidenciaSerializer

class IncidenciaViewSet(viewsets.ModelViewSet):
    queryset = Incidencia.objects.all().order_by('-creado_en')
    serializer_class = IncidenciaSerializer
```

**`config/urls.py`**

```python
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from incidencias.views import IncidenciaViewSet

router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
```

Luego:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Contrato de la API

| Método | URL | Operación | Resultado |
|---|---|---|---|
| GET | `/api/incidencias/` | Listar | JSON con todas |
| POST | `/api/incidencias/` | Crear | 201 |
| PUT | `/api/incidencias/1/` | Editar | Registro actualizado |
| PATCH | `/api/incidencias/1/` | Cambiar estado | Actualización parcial |
| DELETE | `/api/incidencias/1/` | Eliminar | 204 |

Campos: `titulo` (máx. 120), `descripcion`, `categoria` (hardware/software/red), `prioridad` (baja/media/alta), `estado` (pendiente/en_proceso/resuelto), `creado_en` (automático).

### ✅ Checkpoint 1 — evidencia requerida

```bash
python manage.py check
curl -i http://127.0.0.1:8000/api/incidencias/
curl -i -X POST http://127.0.0.1:8000/api/incidencias/ -H "Content-Type: application/json" \
  -d '{"titulo":"PC no enciende","descripcion":"No da video","categoria":"hardware","prioridad":"alta","estado":"pendiente"}'
```

Debe responder `200` con `[]` y luego `201` al crear. Pegar la salida real.

---

## Etapa 2 — Datos de prueba (obligatorios)

Cargar por API (script o curl), mínimo estos 5:

| Título | Categoría | Prioridad | Estado |
|---|---|---|---|
| PC no enciende | hardware | alta | pendiente |
| Python no abre | software | media | en_proceso |
| Wi-Fi lento | red | alta | pendiente |
| Teclado defectuoso | hardware | baja | resuelto |
| Navegador desactualizado | software | media | resuelto |

**Evidencia:** `GET /api/incidencias/` devuelve 5 registros.

---

## Etapa 3 — Frontend React

Desde `labdesk/`:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

Reemplazar `src/App.jsx` y `src/App.css`. `const API = 'http://127.0.0.1:8000/api/incidencias/'`

**`App.jsx` debe incluir:**

- Estado: `datos`, `form`, `editando`, `busqueda`, `filtroEstado`, `filtroPrioridad`, `error`
- `cargar()` con GET dentro de `useEffect`
- `guardar(e)`: POST si `editando === null`, PUT si no; limpia el form y recarga
- `actualizarEstado(id, estado)`: PATCH solo con `{ estado }`
- `eliminar(id)`: `window.confirm` antes del DELETE
- `editar(item)`: copia el registro al form y guarda el id; botón **Cancelar**
- Filtros del lado cliente: texto (título + descripción), estado y prioridad
- 4 tarjetas KPI: **Total, Pendiente, En proceso, Resuelto** (calculadas desde `datos`, no desde lo filtrado)
- Formulario con título, descripción, categoría, prioridad y estado
- Mostrar `error` en pantalla si falla la API
- Diseño responsive y limpio (formulario claro, tarjetas legibles)

### ✅ Checkpoint 2 — evidencia requerida

- `npm run build` sin errores (pegar salida)
- Crear, editar, cambiar estado y eliminar desde la UI, y que persista al refrescar

---

## Etapa 4 — Pruebas

| Prueba | Acción | Aprobación |
|---|---|---|
| Crear | Registrar nueva incidencia | Aparece en la lista y en Django |
| Leer | Recargar la página | Los datos siguen |
| Editar | Cambiar título o prioridad | Se refleja el nuevo valor |
| Estado | Cambiar a resuelto | Cambia el contador |
| Eliminar | Con confirmación | Desaparece y baja el total |
| Filtros | Buscar "Wi-Fi" / prioridad alta | Solo coincidencias |

Verificar también por `curl` que los contadores de la UI coinciden con `GET /api/incidencias/`.

---

## Checklist final

- [ ] Django corre en `http://127.0.0.1:8000/`
- [ ] `/api/incidencias/` responde bien
- [ ] React corre en `http://localhost:5173/`
- [ ] Mínimo 5 incidencias registradas
- [ ] Crear, editar, cambiar estado y eliminar funcionan
- [ ] Filtros de texto, estado y prioridad funcionan
- [ ] Contadores coinciden con Django
- [ ] Sin errores bloqueantes en consola del navegador
- [ ] Puedo explicar GET, POST, PUT, PATCH y DELETE

---

## Errores comunes

| Síntoma | Causa | Fix |
|---|---|---|
| `ModuleNotFoundError` | venv inactivo o paquete faltante | Activar `.venv` e instalar |
| `No module named incidencias` | App no registrada | Revisar `INSTALLED_APPS` |
| `no such table` | Migraciones pendientes | `makemigrations` + `migrate` |
| `Failed to fetch` | Django apagado / URL mala | Abrir la API en el navegador |
| Bloqueo CORS | Origen 5173 no permitido | Revisar middleware y `CORS_ALLOWED_ORIGINS` |
| 404 en la API | Falta `/api` o la barra final | Usar `/api/incidencias/` |
| 400 Bad Request | Campos inválidos | Ver respuesta JSON en Network |

---

## Reto extra (solo si todo lo anterior está verificado)

- Contador de prioridad alta
- Ordenar por fecha de creación
- Exportar a CSV
- Campo nuevo `aula` (migración + API + formulario)

---

## Notas

- API local sin auth. **No** subir a un servidor público con `DEBUG=True` ni con la clave de desarrollo.
- Entrega: demo en vivo antes de las 10:00 p. m. (crear, buscar, editar, resolver, eliminar) + carpeta o repo sin `.venv` ni `node_modules`.
