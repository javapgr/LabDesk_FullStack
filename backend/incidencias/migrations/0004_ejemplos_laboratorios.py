from django.db import migrations

LABORATORIOS = [
    ('Laboratorio 1', 'Pabellón A'),
    ('Laboratorio 2', 'Pabellón A'),
    ('Laboratorio 3', 'Pabellón B'),
    ('Laboratorio de Redes', 'Pabellón B'),
    ('Laboratorio de Hardware', 'Pabellón C'),
    ('Aula 101', 'Pabellón A'),
]


def crear_laboratorios(apps, schema_editor):
    Laboratorio = apps.get_model('incidencias', 'Laboratorio')
    Incidencia = apps.get_model('incidencias', 'Incidencia')

    for nombre, ubicacion in LABORATORIOS:
        Laboratorio.objects.get_or_create(
            nombre=nombre, defaults={'ubicacion': ubicacion, 'activo': True}
        )

    # A las incidencias que aún no tienen aula asignada se les pone un
    # laboratorio de ejemplo, repartido en orden, para que la demo se vea real.
    nombres = [nombre for nombre, _ in LABORATORIOS]
    pendientes = Incidencia.objects.filter(aula__in=['', 'Sin asignar']).order_by('id')
    for indice, incidencia in enumerate(pendientes):
        incidencia.aula = nombres[indice % len(nombres)]
        incidencia.save(update_fields=['aula'])


def borrar_laboratorios(apps, schema_editor):
    Laboratorio = apps.get_model('incidencias', 'Laboratorio')
    Incidencia = apps.get_model('incidencias', 'Incidencia')

    nombres = [nombre for nombre, _ in LABORATORIOS]
    Incidencia.objects.filter(aula__in=nombres).update(aula='Sin asignar')
    Laboratorio.objects.filter(nombre__in=nombres).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('incidencias', '0003_laboratorio'),
    ]

    operations = [
        migrations.RunPython(crear_laboratorios, borrar_laboratorios),
    ]
