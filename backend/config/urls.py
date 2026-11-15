from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from incidencias.views import (
    IncidenciaViewSet, LaboratorioViewSet, cerrar_sesion, iniciar_sesion, perfil,
    respaldo
)

router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet)
router.register(r'laboratorios', LaboratorioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/login/', iniciar_sesion, name='login'),
    path('api/auth/logout/', cerrar_sesion, name='logout'),
    path('api/auth/me/', perfil, name='perfil'),
    path('api/respaldo/', respaldo, name='respaldo'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
]
