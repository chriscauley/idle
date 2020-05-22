from django import forms

from todo.models import Action, Activity
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
        print(new, activity, name, self.photo)
        return action