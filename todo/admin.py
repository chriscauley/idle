from django.contrib import admin

from todo.models import Activity, Action, Task, Project

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_filter = ['project']


@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    pass


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_filter = ['project']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    pass
