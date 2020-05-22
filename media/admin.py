from django.contrib import admin

from media.models import Photo
from django.utils.safestring import mark_safe


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'activity', '_thumbnail')
    def _thumbnail(self, obj):
        return mark_safe(f'<img src="{obj.admin_thumbnail}" />')