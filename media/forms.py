from django import forms

from media.models import Photo
from unrest import schema


@schema.register
class PhotoForm(forms.ModelForm):
    def save(self, commit=True):
        photo = super().save(commit=False)
        self.instance.user = self.request.user
        photo.save()
        return photo

    class Meta:
        model = Photo
        fields = ('src', )
        login_required = True
