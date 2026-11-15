# LabDesk 2.0 — Instrucciones para Cursor

Continuación de **LabDesk** (Django REST + React/Vite + SQLite). **No** se crea un proyecto nuevo: se extiende el existente.
**Meta:** responsables, ubicación y fecha límite, historial de comentarios, alertas de vencimiento y dashboard con datos reales de la API.

---

## Reglas para el agente

1. Antes de tocar nada, **lee el proyecto actual** (`models.py`, `serializers.py`, `views.py`, `urls.py`, `App.jsx`) y respeta su estructura. No lo reescribas desde cero.
2. Trabaja **por etapas**. No avances sin mostrar evidencia de la etapa actual.
3. Nunca digas "listo" sin **salida real** (curl, `manage.py check`, `npm run build`, etc.).
4. Si algo falla, reporta así: **Problema** → **Causa** → **Fix** (archivo y línea) → **Verificación** (salida real) → **Estado**
5. Todo debe persistir en SQLite vía API. **Prohibido** usar datos simulados.
6. Conservar el CRUD de incidencias que ya funciona (no romperlo).
7. Sin contraseñas, tokens, `.venv` ni `node_modules` en el repo.

---

## Etapa 1 — Backend: campos nuevos en Incidencia (4 pts)

**`incidencias/models.py`** — agregar a `Incidencia`:

```python
responsable = models.CharField(max_length=100, blank=True, default='')
ubicacion = models.CharField(max_length=120, blank=True, default='')
fecha_limite = models.DateTimeField(null=True, blank=True)
```

- `null/blank/default` para que la migración no falle con las filas existentes.
- Verificar que `USE_TZ = True` en `settings.py` (por defecto lo está).
- El serializer ya usa `fields = '__all__'`; confirmar que expone los 3 campos nuevos.

```bash
python manage.py makemigrations
python manage.py migrate
```

### ✅ Checkpoint 1

```bash
python manage.py check
curl -i -X PATCH http://127.0.0.1:8000/api/incidencias/1/ -H "Content-Type: application/json" \
  -d '{"responsable":"Juan Pérez","ubicacion":"Lab 3","fecha_limite":"2026-11-20T18:00:00Z"}'
```

Debe devolver `200` con los 3 campos. Pegar la salida real.

---

## Etapa 2 — Backend: comentarios (5 pts)

**Modelo**

```python
class Comentario(models.Model):
    incidencia = models.ForeignKey(
        Incidencia, on_delete=models.CASCADE, related_name='comentarios'
    )
    texto = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f'Comentario #{self.pk} de incidencia {self.incidencia_id}'
```

**Serializer**

```python
class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'incidencia', 'texto', 'creado_en']
        read_only_fields = ['id', 'incidencia', 'creado_en']

    def validate_texto(self, value):
        if not value.strip():
            raise serializers.ValidationError('El comentario no puede estar vacío.')
        return value.strip()
```

**Vista** — acción anidada en `IncidenciaViewSet`:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

@action(detail=True, methods=['get', 'post'], url_path='comentarios')
def comentarios(self, request, pk=None):
    incidencia = self.get_object()
    if request.method == 'GET':
        data = ComentarioSerializer(incidencia.comentarios.all(), many=True).data
        return Response(data)
    serializer = ComentarioSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(incidencia=incidencia)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
```

Endpoints resultantes:

| Método | URL | Resultado |
|---|---|---|
| GET | `/api/incidencias/<id>/comentarios/` | Lista de comentarios (más nuevos primero) |
| POST | `/api/incidencias/<id>/comentarios/` | Crea comentario → 201 |

```bash
python manage.py makemigrations
python manage.py migrate
```

### ✅ Checkpoint 2

```bash
curl -i -X POST http://127.0.0.1:8000/api/incidencias/1/comentarios/ -H "Content-Type: application/json" -d '{"texto":"Se revisó la fuente de poder"}'
curl -i http://127.0.0.1:8000/api/incidencias/1/comentarios/
curl -i -X POST http://127.0.0.1:8000/api/incidencias/1/comentarios/ -H "Content-Type: application/json" -d '{"texto":"   "}'
```

Esperado: `201`, luego lista con el comentario y `creado_en`, luego `400` por texto vacío. Pegar las 3 salidas.

---

## Etapa 3 — Frontend: formulario y detalle

Modificar el `App.jsx` existente (o dividir en componentes si ayuda a la legibilidad: `IncidenciaForm`, `IncidenciaCard`, `DetalleIncidencia`, `Dashboard`, `utils/vencimiento.js`).

**Formulario**

- Agregar inputs: `responsable` (texto), `ubicacion` (texto), `fecha_limite` (`datetime-local`).
- Al editar, convertir `fecha_limite` ISO → valor `datetime-local` (hora local, sin `Z`).
- Al enviar, convertir a ISO con `new Date(valor).toISOString()`; si está vacío, enviar `null`.
- Validar `titulo` y `descripcion` obligatorios antes de enviar; mostrar mensaje de error claro (no solo `alert`).

**Tarjetas / tabla**

- Mostrar responsable, ubicación y fecha límite formateada.

**Vista de detalle de una incidencia** (modal, panel lateral o ruta — lo que sea más simple)

- Datos completos de la incidencia.
- Historial de comentarios (`GET .../comentarios/`) con fecha y hora.
- Formulario para agregar comentario (`POST`), que recarga el historial.
- Estados de carga y de error para el historial.

### ✅ Checkpoint 3

- `npm run build` sin errores (pegar salida).
- Desde la UI: crear incidencia con los campos nuevos, editarla, agregar 2 comentarios, recargar la página y confirmar que todo persiste.

---

## Etapa 4 — Alertas por vencimiento (4 pts)

Crear un helper único (`utils/vencimiento.js`) y usarlo en tarjetas, detalle y dashboard:

```js
export function estadoVencimiento(inc, ahora = new Date()) {
  if (!inc.fecha_limite || inc.estado === 'resuelto') return null
  const limite = new Date(inc.fecha_limite)
  if (limite < ahora) return 'vencida'
  if (limite - ahora <= 24 * 60 * 60 * 1000) return 'proxima'
  return null
}
```

Reglas:

| Condición | Etiqueta |
|---|---|
| `fecha_limite` pasada y estado ≠ resuelto | **Vencida** (rojo) |
| Vence en las próximas 24 h y estado ≠ resuelto | **Próxima a vencer** (ámbar/naranja) |
| Estado = resuelto | Nunca vencida ni próxima |
| Sin `fecha_limite` | Sin alerta |

### ✅ Checkpoint 4

Con los datos de prueba (ver abajo), mostrar que:
- la vencida sale en rojo,
- la próxima a vencer sale con su etiqueta,
- la resuelta con fecha pasada **no** sale vencida.

---

## Etapa 5 — Dashboard con datos reales (4 pts)

Calcular desde lo que devuelve `GET /api/incidencias/` (no hardcodear nada):

- Total de incidencias
- Cantidad por estado: pendiente, en proceso, resuelto
- Cantidad de **vencidas** (usando `estadoVencimiento`)
- Distribución por prioridad: baja, media, alta
- **% de resolución** = `(resueltas / total) × 100`; si `total === 0` mostrar `0 %`

Los contadores se calculan sobre **todas** las incidencias, no sobre las filtradas.

### ✅ Checkpoint 5

Comparar los números del dashboard contra el JSON real:

```bash
curl -s http://127.0.0.1:8000/api/incidencias/
```

Pegar el conteo manual y el del dashboard; deben coincidir. Probar también el caso con 0 incidencias (porcentaje 0 %).

---

## Etapa 6 — Calidad técnica (3 pts)

- Validaciones de campos obligatorios en el formulario.
- Estado de **carga** al pedir datos y al guardar.
- Mensajes de **error** visibles si la API falla.
- Interfaz responsive (probar a ~375 px de ancho).
- Código organizado (componentes/utilidades separados, sin duplicar la lógica de vencimiento).
- CORS sigue permitiendo `localhost:5173` y `127.0.0.1:5173`.

---

## Datos de prueba (mínimo 5 incidencias)

Cargar vía API o admin, cubriendo todos los casos:

| Título | Prioridad | Estado | Responsable | Fecha límite |
|---|---|---|---|---|
| PC no enciende | alta | pendiente | Juan | **Ayer** (→ vencida) |
| Wi-Fi lento | alta | pendiente | María | **En ~5 horas** (→ próxima a vencer) |
| Python no abre | media | en_proceso | Carlos | En 3 días (sin alerta) |
| Teclado defectuoso | baja | resuelto | Ana | **Ayer** (resuelta → NO vencida) |
| Navegador desactualizado | media | resuelto | Luis | Sin fecha |

Agregar al menos 2 comentarios en alguna incidencia.

---

## Entrega (evidencias obligatorias)

- [ ] Repo de GitHub con backend y frontend actualizados
- [ ] `.gitignore` (excluye `.venv`, `node_modules`, `db.sqlite3` si aplica, `__pycache__`, `.env`)
- [ ] `README.md` con: requisitos, instalación, migraciones y cómo correr los **dos** servidores
- [ ] 5+ incidencias de prueba con distintos estados/prioridades
- [ ] Capturas: formulario, historial de comentarios, alertas y dashboard
- [ ] Video de 3 a 5 min: una operación completa + explicar cómo React habla con Django

### Checklist final

- [ ] La API responde y React consume datos reales
- [ ] Crear, editar y eliminar incidencias persiste tras recargar
- [ ] Se puede asignar responsable y registrar comentarios
- [ ] Alertas e indicadores calculan bien
- [ ] CRUD original de LabDesk sigue funcionando
- [ ] Sin errores bloqueantes en consola del navegador

---

## Errores comunes

| Síntoma | Causa | Fix |
|---|---|---|
| `no such column` | Migración sin aplicar | `makemigrations` + `migrate` |
| Falla al migrar con filas existentes | Campo nuevo sin `null`/`default` | Agregar `blank=True` + `default`/`null=True` |
| Fecha límite con hora corrida | `datetime-local` sin conversión a ISO/UTC | Usar `new Date(valor).toISOString()` |
| 404 en comentarios | Falta la barra final o `url_path` | Usar `/api/incidencias/<id>/comentarios/` |
| Resuelta aparece vencida | La regla no revisa el estado | Usar `estadoVencimiento` en todos lados |
| CORS | Origen no permitido | Revisar `CORS_ALLOWED_ORIGINS` |

---

## Desafío opcional (solo si todo lo obligatorio está verificado)

JWT, exportación CSV, gráficos con Recharts, filtros avanzados o modo oscuro. Cuentan como evidencia adicional, **no** sustituyen lo obligatorio.
