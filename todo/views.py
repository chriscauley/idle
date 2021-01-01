from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json

from todo.models import Project, Activity, Task

def project_list(request):
    projects = Project.objects.filter(user=request.user)
    return JsonResponse({'projects': [p.to_json(['id', 'name']) for p in projects]})

def activity_list(request):
    activities = Activity.objects.filter(user=request.user)
    return JsonResponse({'activities': [p.to_json(['id', 'name', 'project_id']) for p in activities]})

def task_list(request):
    tasks = Task.objects.filter(user=request.user)
    return JsonResponse({'tasks': [p.to_json(['id', 'name', 'activity_id', 'project_id']) for p in tasks]})

def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    data = json.loads(request.body.decode('utf-8'))
    task.data.update(data)
    task.save()
    return JsonResponse({})