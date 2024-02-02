from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer, CreatePostSerializer
from django.contrib.auth.models import User
from rest_framework import status
# Create your views here.

@api_view(['GET'])
def index(request):
    qs = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getPost(request, pk):
    qs = Post.objects.get(id=pk)
    serializer = PostSerializer(qs, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createPost(request):
    data = request.data.copy()
    
    try:
        username = data.pop('user', None)
        user = User.objects.get(username=username)
        if user:
            existing = Post.objects.filter(user=user).first()
            data['user'] = user.id
            if existing:
                return Response({'error': 'User already has a post'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                
                serializer = CreatePostSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

        
    print("Original data:", data)
    username = data.pop('user', None)
    user = User.objects.get(username=username[0])
    existing = Post.objects.filter(user=user).first()
    if existing:
        return Response({"error": "User already has a post"}, status=status.HTTP_400_BAD_REQUEST)
    data['user'] = user.id
    print(user)
    print("Modified data:", data)

    serializer = CreatePostSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)