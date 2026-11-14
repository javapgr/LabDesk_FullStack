# LabDesk — Proyecto práctico Django + React

Sistema CRUD de incidencias del laboratorio (actividad de clase).

## 1. Backend (terminal A)

Requisitos: Python 3.10+ y pip disponibles.

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

API: http://127.0.0.1:8000/api/incidencias/

La API exige autenticación por token. Para crear tu usuario:

```bash
python manage.py createsuperuser
# o un usuario normal desde el panel /admin/ > Usuarios
```

Cuenta de práctica incluida en la base de datos local:

| Usuario | Contraseña |
|---|---|
| `tecnico` | `labdesk123` |

Cámbiala con `python manage.py changepassword tecnico`.

## 2. Frontend (terminal B)

Requisitos: Node.js compatible con Vite 7 y npm.

```bash
cd frontend
npm install
npm run dev
```

Web: http://127.0.0.1:5173/

## 3. Autenticación

El frontend muestra una pantalla de login antes de entrar al panel. El token se
guarda en `localStorage` y se envía en cada petición como
`Authorization: Token <token>`.

Endpoints:

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login/` | Recibe `username` y `password`, devuelve el token y los datos del usuario |
| GET | `/api/auth/me/` | Devuelve el usuario del token |
| POST | `/api/auth/logout/` | Invalida el token actual |

Probar desde la terminal:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"tecnico\",\"password\":\"labdesk123\"}"
```

## 4. Prueba

Crea 5 incidencias, edita una, cambia un estado, filtra y elimina un registro.
En la vista de incidencias también puedes exportar a CSV los registros visibles
después de aplicar los filtros.

IMPORTANTE: Está configurado exclusivamente para entorno local y aprendizaje.
No publicar con DEBUG=True ni con esta SECRET_KEY. Para producción faltan HTTPS,
tokens con expiración (JWT), límites de intentos de login y variables de entorno.
