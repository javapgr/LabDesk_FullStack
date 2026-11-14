from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Incidencia, Laboratorio
from .serializers import IncidenciaSerializer, LaboratorioSerializer


def datos_usuario(usuario):
    return {
        'id': usuario.id,
        'username': usuario.username,
        'nombre': usuario.get_full_name() or usuario.username,
        'email': usuario.email,
    }


class IncidenciaViewSet(viewsets.ModelViewSet):
    queryset = Incidencia.objects.all().order_by('-creado_en')
    serializer_class = IncidenciaSerializer
    permission_classes = [IsAuthenticated]


class LaboratorioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([AllowAny])
def iniciar_sesion(request):
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    usuario = authenticate(request, username=username, password=password)
    if usuario is None:
        return Response(
            {'detail': 'Usuario o contraseña incorrectos.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    token, _ = Token.objects.get_or_create(user=usuario)
    return Response({'token': token.key, 'usuario': datos_usuario(usuario)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cerrar_sesion(request):
    if isinstance(request.auth, Token):
        request.auth.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil(request):
    return Response(datos_usuario(request.user))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def respaldo(request):
    incidencias = IncidenciaSerializer(
        Incidencia.objects.all().order_by('id'), many=True
    ).data
    laboratorios = LaboratorioSerializer(
        Laboratorio.objects.all(), many=True
    ).data
    datos = {
        'generado_en': timezone.now().isoformat(),
        'generado_por': request.user.username,
        'totales': {
            'incidencias': len(incidencias),
            'laboratorios': len(laboratorios),
        },
        'laboratorios': laboratorios,
        'incidencias': incidencias,
    }
    respuesta = Response(datos)
    fecha = timezone.localdate().isoformat()
    respuesta['Content-Disposition'] = (
        f'attachment; filename="labdesk-respaldo-{fecha}.json"'
    )
    return respuesta
