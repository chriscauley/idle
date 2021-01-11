from django import forms

from todo.models import Action, Activity
from todo.models import Project, Activity, Task
from media.models import Photo
from unrest import schema

@schema.register
class ActionForm(forms.Form):
    name = forms.CharField(max_length=32)
    bees = forms.ChoiceField(choices=[('a', 'a')])

    def clean(self):
        # photo doesn't have a form field because it requires additional validation
        # also we don't display it to the user, so it complicates the schema-form to include it
        self.photo = Photo.objects.filter(
            user=self.request.user,
            id=self.data.get('photo_id')
        ).first()
        if not self.photo:
            raise forms.ValidationError("Invalid Photo")
        return self.cleaned_data

    def save(self, commit=True):
        name = self.cleaned_data['name']
        user = self.request.user

        activity, new = Activity.objects.get_or_create(name=name, user=user)
        action = Action.objects.create(activity=activity, user=user)
        self.photo.activity = activity
        self.photo.action = action
        self.photo.save()
        return action

@schema.register
class ProjectForm(forms.ModelForm):
    def save(self, *args, **kwargs):
        self.instance.user = self.request.user
        return super().save(*args, **kwargs)
    class Meta:
        model = Project
        fields = ['name']

@schema.register
class ActivityForm(forms.ModelForm):
    def save(self, *args, **kwargs):
        data = self.cleaned_data['data']
        self.instance.user = self.request.user
        return super().save(*args, **kwargs)
    class Meta:
        model = Activity
        fields = ['name', 'data']

def validate_user_owns(user, model, id):
    item = model.objects.filter(user=user, id=id).first()
    if id and not item:
        raise forms.ValidationError(f'User does not have permission to edit {model.__name__} #{id}')
    return item

def get_users_object(user, model, id):
    return model.objects.get(user=user, id=id)


class DataForm(forms.ModelForm):
    def clean_data(self):
        data = self.instance.data
        data.update(self.cleaned_data['data'] or {})
        self._project = validate_user_owns(self.request.user, Project, data.get('project_id'))
        self._activity = validate_user_owns(self.request.user, Activity, data.get('activity_id'))
        if data.get('create_activity') and not (self._project or self.instance.project):
            raise forms.ValidationError('Cannot create activity without a project.')
        return data

@schema.register
class TaskForm(DataForm):
    def save(self, *args, **kwargs):
        data = self.cleaned_data['data']
        activity_id = data.pop('activity_id', None)
        project_id = data.pop('project_id', None)
        create_activity = data.pop('create_activity', None)
        if create_activity and not self.instance.activity:
            project_id = (self._project or self.instance.project).id
            activity_id = Activity.objects.create(
                name=self.instance.name,
                user=self.request.user,
                project_id=project_id
            ).id
        self.instance.activity_id = activity_id
        self.instance.project_id = project_id
        self.instance.user = self.request.user
        return super().save(*args, **kwargs)
    class Meta:
        model = Task
        fields = ['name', 'data']

@schema.register
class ActiveTaskForm(DataForm):
    def __init__(self, *args, **kwargs):
        if len(args) > 0:
            data = args[0]
            if 'data' not in data:
                data = { 'data': data }
            args = [data] + list(args[1:])
        return super().__init__(*args, **kwargs)
    class Meta:
        model = Task
        fields = ['data']
