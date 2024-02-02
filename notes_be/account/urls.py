from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    MyTokenObtainPairView, 
    registerUser, 
    verify_otp, 
    resend_otp, 
    reset_password, 
    submit_reset_passowrd,
    loginView,
    registerView,
    logoutView,
    getCurrentUser,
    CookieTokenRefreshView
    )

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('register/', registerUser, name='register'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('resend_otp/', resend_otp, name='resend_otp'),
    path('reset_password/', reset_password, name='reset_password'),
    path('submit_reset_password/', submit_reset_passowrd, name='submit_reset_password'),
    path('signin/', loginView, name='login'),
    path('signup/', registerView, name='register'),
    path('signout/', logoutView, name='logout'),
    path('current_user/', getCurrentUser, name='current_user'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]
