# Generated by Django 3.0.6 on 2020-05-22 12:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
        ('media', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='action',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='todo.Action'),
        ),
        migrations.AddField(
            model_name='photo',
            name='activity',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='todo.Activity'),
        ),
        migrations.AddField(
            model_name='photo',
            name='thing',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='todo.Thing'),
        ),
    ]
