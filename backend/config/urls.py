from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from incidencias.views import (
    IncidenciaViewSet, cerrar_sesion, iniciar_sesion, perfil
)

router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', iniciar_sesion, name='login'),
    path('api/auth/logout/', cerrar_sesion, name='logout'),
    path('api/auth/me/', perfil, name='perfil'),
    path('api/', include(router.urls)),
]
