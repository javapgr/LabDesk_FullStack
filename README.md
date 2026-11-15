# LabDesk 2.0

Sistema de gestión de incidencias de laboratorio (hardware, software, red, impresora).

**Stack:** Django + Django REST Framework + SQLite · React + Vite  
**Uso:** solo local (`127.0.0.1`). `DEBUG=False`. No publicar en internet con esta configuración ni con la `SECRET_KEY` de práctica.

---

## Requisitos

- Python 3.10+ y pip
- Node.js compatible con Vite 7 y npm
- Dos terminales (backend y frontend)

---

## 1. Backend (terminal A)

```bash
cd backend
python -m venv .venv
```

Activar el entorno virtual:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Instalar, migrar, cargar datos de demo y correr:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

`seed_demo` crea:

- Usuario de prueba: `tecnico` / `labdesk123`
- 6 laboratorios (si faltan)
- 5 incidencias de la guía (con responsable, ubicación y fechas de alerta)
- 2 comentarios en «PC no enciende»

- API: http://127.0.0.1:8000/api/
- Admin: http://127.0.0.1:8000/admin/
- Login browsable API: http://127.0.0.1:8000/api-auth/login/

Dependencias (`requirements.txt`): Django, djangorestframework, django-cors-headers.

---

## 2. Frontend (terminal B)

```bash
cd frontend
npm install
npm run dev
```

Web: http://127.0.0.1:5173/

Inicia sesión con `tecnico` / `labdesk123`.

---

## 3. Autenticación

La API usa **JWT** (simplejwt). El frontend guarda `access`/`refresh` en `localStorage` y envía:

`Authorization: Bearer <access>`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/token/` | Login → access + refresh |
| POST | `/api/token/refresh/` | Renueva el access |
| GET | `/api/auth/me/` | Usuario del access token |

Ejemplo:

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"tecnico\",\"password\":\"labdesk123\"}"
```

Opcional: copia `backend/.env.example` a `backend/.env` para personalizar `DJANGO_SECRET_KEY`.

---

## 4. Funcionalidades (LabDesk 2.0)

- CRUD de incidencias (crear, listar, editar, cambiar estado, eliminar)
- Campos: responsable, ubicación, fecha límite, aula, categoría, prioridad, estado
- Comentarios por incidencia (`/api/incidencias/<id>/comentarios/`)
- Alertas de vencimiento (vencida / próxima a vencer)
- Dashboard con KPIs reales (total, estados, vencidas, % resolución, prioridades)
- Filtros por texto, estado y prioridad
- Exportar CSV (con BOM UTF-8)
- Iconos por categoría: hardware (PC), red (router), impresora; software sin icono
- Laboratorios desde la API (`/api/laboratorios/`)

**Nota:** el campo `aula` de cada incidencia es texto (`CharField`). La tabla `Laboratorio` es un catálogo aparte que alimenta el selector del formulario; no es ForeignKey.

---

## 5. Estructura

```
LabDesk_FullStack/
├── backend/          # Django + DRF + SQLite
├── frontend/         # React + Vite
├── .gitignore
└── README.md
```

No subir: `.venv/`, `node_modules/`, `db.sqlite3`, `__pycache__/`, `.env`.

---

## 6. Prueba rápida

1. Arranca backend y frontend.
2. Inicia sesión en http://127.0.0.1:5173/ con `tecnico` / `labdesk123`.
3. Crea o edita una incidencia con responsable y fecha límite.
4. Abre **Ver** → agrega comentarios.
5. Revisa Resumen (KPIs) e Incidencias (alertas de color).
