from .views import *
from django.urls import path

urlpatterns = [
    path('posts/', index, name='home'),
    path('posts/<int:pk>/', getPost, name='detail'),
    path('create/', createPost, name='create'),
]
