from django.contrib import admin
from .models import Incidencia, Laboratorio


@admin.register(Incidencia)
class IncidenciaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'prioridad', 'estado', 'creado_en')
    list_filter = ('categoria', 'prioridad', 'estado')
    search_fields = ('titulo', 'descripcion')


@admin.register(Laboratorio)
class LaboratorioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ubicacion', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre', 'ubicacion')
