# Generated by Django 3.1 on 2021-01-02 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_auto_20210101_1555'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='activity',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='task',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='thing',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
