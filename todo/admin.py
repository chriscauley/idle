from django.contrib import admin

from todo.models import Activity, Action

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    pass


@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    pass
