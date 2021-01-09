# Generated by Django 3.1 on 2021-01-03 22:09

from django.db import migrations

def weight_to_lbs(apps, schema_editor):
    for task in apps.get_model('todo', 'Task').objects.all():
        if task.data.get('weight'):
            task.data['lbs'] = task.data.pop('weight')
            task.save()
    for activity in apps.get_model('todo', 'Activity').objects.all():
        if 'weight' in activity.data.get('measurements', []):
            activity.data['measurements'].remove('weight')
            activity.data['measurements'].append('lbs')
            activity.save()


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0004_auto_20210102_1355'),
    ]

    operations = [
        migrations.RunPython(weight_to_lbs, lambda a,b:None)
    ]