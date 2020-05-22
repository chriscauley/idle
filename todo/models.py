from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField
from unrest.models import BaseModel, _choices


class Action(BaseModel):
    activity = models.ForeignKey('Activity', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data = JSONField(default=dict)
    __str__ = lambda self: self.activity.name

class Thing(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    data = JSONField(default=dict)
    __str__ = lambda self: self.name


class Activity(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    __str__ = lambda self: self.name
