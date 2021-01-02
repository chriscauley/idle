from django.conf import settings
from django.db import models
from unrest.models import BaseModel, _choices


class DataModel(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    data = models.JSONField(default=dict, blank=True)
    __str__ = lambda self: self.name
    def to_json(self, attrs):
        data = super().to_json(attrs)
        data.update(self.data)
        return data
    class Meta:
        abstract = True

# TODO this should be deprecated in favor of task instead
class Action(BaseModel):
    activity = models.ForeignKey('Activity', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data = models.JSONField(default=dict, blank=True)
    __str__ = lambda self: self.activity.name


class Thing(DataModel):
    pass


class Project(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    __str__ = lambda self: self.name


class Activity(DataModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    pass


class Task(DataModel):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    pass