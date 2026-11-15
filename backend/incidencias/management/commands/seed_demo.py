from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from incidencias.models import Comentario, Incidencia, Laboratorio


class Command(BaseCommand):
    help = 'Crea usuario tecnico (si falta) y las 5 incidencias de demo con comentarios.'

    def handle(self, *args, **options):
        User = get_user_model()
        user, created = User.objects.get_or_create(
            username='tecnico',
            defaults={'is_staff': True, 'is_superuser': True},
        )
        user.set_password('labdesk123')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        self.stdout.write(
            self.style.SUCCESS(
                'Usuario tecnico listo' + (' (creado)' if created else ' (actualizado)')
            )
        )

        labs = [
            ('Laboratorio 1', 'Pabellón A'),
            ('Laboratorio 2', 'Pabellón A'),
            ('Laboratorio 3', 'Pabellón B'),
            ('Laboratorio de Redes', 'Pabellón B'),
            ('Laboratorio de Hardware', 'Pabellón C'),
            ('Aula 101', 'Pabellón A'),
        ]
        for nombre, ubicacion in labs:
            Laboratorio.objects.get_or_create(
                nombre=nombre, defaults={'ubicacion': ubicacion, 'activo': True}
            )

        ahora = timezone.now()
        ayer = ahora - timedelta(days=1)
        en_5h = ahora + timedelta(hours=5)
        en_3d = ahora + timedelta(days=3)

        ejemplos = [
            dict(
                titulo='PC no enciende',
                descripcion='No da video al encender. Revisar fuente y cableado.',
                aula='Laboratorio 1', categoria='hardware', prioridad='alta',
                estado='pendiente', responsable='Juan', ubicacion='Lab 1',
                fecha_limite=ayer,
            ),
            dict(
                titulo='Python no abre',
                descripcion='Error al ejecutar Python. Revisar PATH.',
                aula='Laboratorio 2', categoria='software', prioridad='media',
                estado='en_proceso', responsable='Carlos', ubicacion='Lab 2',
                fecha_limite=en_3d,
            ),
            dict(
                titulo='Wi-Fi lento',
                descripcion='Conexion inalambrica muy lenta en varias PCs.',
                aula='Laboratorio de Redes', categoria='red', prioridad='alta',
                estado='pendiente', responsable='María', ubicacion='Lab Redes',
                fecha_limite=en_5h,
            ),
            dict(
                titulo='Teclado defectuoso',
                descripcion='Varias teclas no responden.',
                aula='Laboratorio 3', categoria='hardware', prioridad='baja',
                estado='resuelto', responsable='Ana', ubicacion='Lab 3',
                fecha_limite=ayer,
            ),
            dict(
                titulo='Navegador desactualizado',
                descripcion='Chrome/Edge desactualizado.',
                aula='Aula 101', categoria='software', prioridad='media',
                estado='resuelto', responsable='Luis', ubicacion='Aula 101',
                fecha_limite=None,
            ),
        ]

        Comentario.objects.all().delete()
        Incidencia.objects.all().delete()
        creadas = [Incidencia.objects.create(**e) for e in ejemplos]
        pc = next(i for i in creadas if i.titulo == 'PC no enciende')
        Comentario.objects.create(incidencia=pc, texto='Se revisó la fuente de poder')
        Comentario.objects.create(incidencia=pc, texto='Pendiente cambiar cable HDMI')

        self.stdout.write(
            self.style.SUCCESS(
                f'Demo lista: {Incidencia.objects.count()} incidencias, '
                f'{Comentario.objects.count()} comentarios.'
            )
        )
        self.stdout.write('Login: tecnico / labdesk123')
