from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from post.models import Post

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class UserSerializer(ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)
    posted = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['username', 'id', '_id', 'posted']

    def get__id(self, obj):
        return obj.id
    
    def get_posted(self, obj):
            if Post.objects.get(user=obj):
                 return False
            else:
                 return True
        # return Post.objects.get(user=obj)


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'token', 'id', '_id', 'posted']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)
    

class RegisterSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password', 'write_only': True})
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True},
            }

    def save(self):
    
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            is_active=False,
        )
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password', 'write_only': True})

    class Meta:
        model = User
        fields = ['username', 'password']

    def get_token(self):
        token = RefreshToken.for_user(self)
        posted = Post.objects.filter(user=self).exists()
        return {
            'refresh': str(token),
            'access': str(token.access_token),
            'username': self.username,
            'posted': posted
        }
    

class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid Token")



