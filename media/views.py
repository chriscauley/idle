import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from unrest.user.views import user_json
from unrest.decorators import login_required

from media.models import Photo, PhotoCrop
import media.forms

def add_photos(user):
    photos = Photo.objects.filter(user=user)
    photos = [p.to_json(['id', 'src', 'thumbnail']) for p in photos]
    return {
        'photos': photos,
    }


user_json.get_extra = add_photos


@login_required
def delete_photo(request):
    data = json.loads(request.body.decode('utf-8') or "{}")
    photo = get_object_or_404(Photo, id=data.get('id'), user=request.user)
    photo.delete()
    return JsonResponse({})


@login_required
def delete_photocrop(request):
    data = json.loads(request.body.decode('utf-8') or "{}")
    photo = get_object_or_404(PhotoCrop, id=data.get('id'), photo__user=request.user)
    photo.delete()
    return JsonResponse({})
