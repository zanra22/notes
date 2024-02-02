from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.user.username