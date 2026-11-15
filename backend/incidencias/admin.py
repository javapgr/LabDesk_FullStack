from django.contrib import admin
from .models import Comentario, Incidencia, Laboratorio


class ComentarioInline(admin.TabularInline):
    model = Comentario
    extra = 0
    readonly_fields = ('creado_en',)


@admin.register(Incidencia)
class IncidenciaAdmin(admin.ModelAdmin):
    list_display = (
        'titulo', 'responsable', 'ubicacion', 'categoria',
        'prioridad', 'estado', 'fecha_limite', 'creado_en',
    )
    list_filter = ('categoria', 'prioridad', 'estado')
    search_fields = ('titulo', 'descripcion', 'responsable', 'ubicacion')
    inlines = [ComentarioInline]


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'incidencia', 'texto', 'creado_en')
    search_fields = ('texto',)


@admin.register(Laboratorio)
class LaboratorioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ubicacion', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre', 'ubicacion')
