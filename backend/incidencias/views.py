from rest_framework import viewsets
from .models import Incidencia
from .serializers import IncidenciaSerializer

class IncidenciaViewSet(viewsets.ModelViewSet):
    queryset = Incidencia.objects.all().order_by('-creado_en')
    serializer_class = IncidenciaSerializer
