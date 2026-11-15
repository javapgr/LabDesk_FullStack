from rest_framework import serializers
from .models import Comentario, Incidencia, Laboratorio


class IncidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = '__all__'
        read_only_fields = ['id', 'creado_en']


class ComentarioSerializer(serializers.ModelSerializer):
    texto = serializers.CharField(allow_blank=True, trim_whitespace=False)

    class Meta:
        model = Comentario
        fields = ['id', 'incidencia', 'texto', 'creado_en']
        read_only_fields = ['id', 'incidencia', 'creado_en']

    def validate_texto(self, value):
        if not value.strip():
            raise serializers.ValidationError('El comentario no puede estar vacío.')
        return value.strip()


class LaboratorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratorio
        fields = ['id', 'nombre', 'ubicacion', 'activo']
