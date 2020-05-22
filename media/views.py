import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from unrest.user.views import user_json
from unrest.decorators import login_required

from media.models import Photo, PhotoCrop
from todo.models import Activity, Action
import media.forms

def add_photos(user):
    photos = Photo.objects.filter(user=user)
    activities = Activity.objects.filter(user=user)
    actions = Action.objects.filter(user=user)
    return {
        'activities': [a.to_json(['id', 'name']) for a in activities],
        'actions': [a.to_json(['id', 'activity_id']) for a in actions],
        'photos': [p.to_json(['id', 'src', 'thumbnail', 'activity_id', 'action_id', 'thing_id']) for p in photos],
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
