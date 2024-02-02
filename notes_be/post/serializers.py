from rest_framework.serializers import ModelSerializer
from .models import Post
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Post
        fields = '__all__'

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'