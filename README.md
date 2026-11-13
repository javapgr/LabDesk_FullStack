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

## 2. Frontend (terminal B)

Requisitos: Node.js compatible con Vite 7 y npm.

```bash
cd frontend
npm install
npm run dev
```

Web: http://127.0.0.1:5173/

## 3. Prueba

Crea 5 incidencias, edita una, cambia un estado, filtra y elimina un registro.

IMPORTANTE: Está configurado exclusivamente para entorno local y aprendizaje.
No publicar con DEBUG=True ni con esta SECRET_KEY. Agregar autenticación, controles
por usuario y configuración segura antes de usarlo en producción.
