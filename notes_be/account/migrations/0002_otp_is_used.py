# Generated by Django 4.2.9 on 2024-01-23 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='otp',
            name='is_used',
            field=models.BooleanField(default=False),
        ),
    ]
