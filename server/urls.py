from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.urls import path, re_path, include

from unrest.views import spa
from media.views import delete_photo
import todo.forms

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path('', include('unrest.urls')),
    path('api/media/photo/delete/', delete_photo),
]
