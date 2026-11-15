from django.db import models

class Laboratorio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    ubicacion = models.CharField(max_length=120, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Laboratorio'
        verbose_name_plural = 'Laboratorios'

    def __str__(self):
        return self.nombre


class Incidencia(models.Model):
    CATEGORIAS = [
        ('hardware', 'Hardware'),
        ('software', 'Software'),
        ('red', 'Red / Internet'),
        ('impresora', 'Impresora'),
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
    responsable = models.CharField(max_length=100, blank=True, default='')
    ubicacion = models.CharField(max_length=120, blank=True, default='')
    fecha_limite = models.DateTimeField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Comentario(models.Model):
    incidencia = models.ForeignKey(
        Incidencia, on_delete=models.CASCADE, related_name='comentarios'
    )
    texto = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f'Comentario #{self.pk} de incidencia {self.incidencia_id}'
