from django.db import models

class Incidencia(models.Model):
    CATEGORIAS = [
        ('hardware', 'Hardware'),
        ('software', 'Software'),
        ('red', 'Red / Internet'),
    ]
    PRIORIDADES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
    ]
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('resuelto', 'Resuelto'),
    ]

    titulo = models.CharField(max_length=120)
    descripcion = models.TextField()
    aula = models.CharField(max_length=100, default='Sin asignar')
    categoria = models.CharField(
        max_length=20, choices=CATEGORIAS, default='hardware'
    )
    prioridad = models.CharField(
        max_length=10, choices=PRIORIDADES, default='media'
    )
    estado = models.CharField(
        max_length=20, choices=ESTADOS, default='pendiente'
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
