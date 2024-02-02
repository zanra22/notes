from django.shortcuts import render
from django.middleware import csrf
from rest_framework.request import Request
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError
from rest_framework_simplejwt.views import TokenRefreshView


from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


from notes_be import settings
from .serializers import UserSerializerWithToken, UserSerializer, LoginSerializer, RegisterSerializer, AccountSerializer
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
import pyotp
from .models import OTP

from django.core.mail import send_mail, BadHeaderError, EmailMessage
from datetime import datetime, timezone

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.core.exceptions import ValidationError, ObjectDoesNotExist


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request: Request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if username is None or password is None:
            return Response({"detail": "Please provide both username and password"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(username=username).first()

        if not user or not user.check_password(password):
            return Response({"detail": "The provided credentials are not valid"}, status=status.HTTP_401_UNAUTHORIZED)
        return super().post(request, *args, **kwargs)



@api_view(['POST'])
def registerUser(request):
    data = request.data
    if User.objects.filter(username=data["username"]).exists():
        print(User.objects.filter(username=data["username"]))
        message = {"detail": "User with this username already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(email=data["email"]).exists():
        message = {"detail": "User with this email already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    try:
        
        otp_key = pyotp.random_base32()
        otp_instance = pyotp.TOTP(otp_key, digits=6)
        otp_code = otp_instance.now()

        user = User.objects.create(
            username=data["username"],
            email=data["email"], 
            password=make_password(data["password"]),
            is_active=False
            )
        
        otp = OTP.objects.create(
            user=user,
            otp_secret=otp_key
        )
        print(otp_code)
        send_otp_email(data["email"], otp_code)

        
        serializer = UserSerializerWithToken(user, many=False)

        response_data = {
            "detail": "User created successfully",
            "user_id": user.id,
            "otp_id": otp.id
        }
        return Response(response_data)
    except:
        message = {"error": "Something went wrong"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_otp(request):
    data = request.data

    try:
        user_id = data["user_id"]
        otp_id = data["otp_id"]
        otp_code = data["otp"]

        # Retrieve the user and OTP
        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)
        print(otp_code)
        print(otp.otp_secret)
        if otp.is_verified:
            message = {"detail": "This OTP has been verified already"}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        totp = pyotp.TOTP(otp.otp_secret)
        # Validate the provided OTP
        if totp.verify(otp_code, valid_window=7):
            user.is_active = True
            user.save()

            otp.is_verified = True
            otp.save()

            return Response({"detail": "User verified and registered successfully."})
        else:
            raise Exception("Invalid OTP")
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def resend_otp(request):
    data = request.data
    try:
        user_id = data["user_id"]
        otp_id = data["otp_id"]
        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)
        if user and otp:
            print(user.email)
            print('old',otp, otp.otp_secret)
            otp_key = pyotp.random_base32()
            otp_instance = pyotp.TOTP(otp_key, digits=6)
            otp_code = otp_instance.now()
            otp = OTP.objects.update(user=user, otp_secret=otp_key)
            send_otp_email(user.email, otp_code)
        else:
            print("User or OTP not found")
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    return Response({"detail": "OTP resent successfully"})

def send_otp_email(email, otp_code):
    subject = 'OTP Verification'
    body = f'''Your OTP is: {otp_code}.
    Please do not share this code with anyone. 
    If you did not request this OTP, please contact our support team.
    '''
    recipient_list = [email]

    message_data = {
        'subject': subject,
        'body': body,
        'recipient_list': recipient_list
    }

    html_message = render_to_string('account/otp_email.html', message_data)
    plain_message = strip_tags(html_message)

    try:
        message = EmailMessage(
            subject,
            html_message,
            from_email='Inkcognito <{}>'.format(settings.EMAIL_HOST_USER),
            to=recipient_list,
        )
        message.message()
        message.content_subtype = 'html'
        message.send(fail_silently=False)
        return Response({'success': 'OTP email sent successfully'}, status=status.HTTP_200_OK)
    except (BadHeaderError, ValidationError, ObjectDoesNotExist) as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.db.models import Q
@api_view(['POST'])
def reset_password(request):
    data = request.data

    try:
        userData = data['user']
        if userData:
            try:
                user = User.objects.get(Q(email=userData) | Q(username=userData))
                if not user.is_active:
                    return Response({'error': 'User is inactive'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    otp_key = pyotp.random_base32()
                    otp_instance = pyotp.TOTP(otp_key, digits=6)
                    otp_code = otp_instance.now()
                    otp = OTP.objects.create(user=user, otp_secret=otp_key)
                    send_otp_email(user.email, otp_code)

                    response_data = {
                        'user_id': user.id,
                        'otp_id': otp.id,
                    }
                    return Response(response_data, status=status.HTTP_200_OK)
                # send_otp_email(user.email, otp_code)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Please provide either email or username'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def submit_reset_passowrd(request):
    data = request.data
    try:
        user_id = data.get('user_id')
        otp_id = data.get('otp_id')
        newPassword = data.get('newPassword')
        confirmNewPassword = data.get('confirmNewPassword')
        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)
        if newPassword == confirmNewPassword:
            if check_password(newPassword, user.password):
                return Response({'detail': 'New password cannot be old password'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if user and otp.is_verified and otp.is_used == False:
                    User.objects.update(password=make_password(newPassword))
                    otp.is_used = True
                    otp.save()
                    return Response({'detail': 'OTP verified successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Something went wrong.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    

import json
from django.http import JsonResponse
# -------------------------------------Under Testing-------------------------
@api_view(['POST'])
@permission_classes([])
def loginView(request):
    data = request.data
    serializer = LoginSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)


    if user is not None:
        tokens = LoginSerializer.get_token(user)
        # tokens['X-CSRFToken'] = csrf.get_token(request)
        # print(tokens)
        res = Response()
        res.set_cookie(
            key = settings.SIMPLE_JWT['AUTH_COOKIE'],
            value = tokens['access'],
            expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        res.set_cookie(
            key = settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value = tokens['refresh'],
            expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        # res.set_cookie('userCookie', value=tokens, httponly=True, secure=True, samesite='None')

        res.data = json.dumps(tokens)
        csrf_token = csrf.get_token(request)
        res['X-CSRFToken'] = csrf_token
        return res

    raise AuthenticationFailed("Invalid credentials, please try again")

@api_view(['POST'])
@permission_classes([])
def registerView(request):
    data = request.data
    serializer = RegisterSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    if user is not None:
        return Response({
            "user": AccountSerializer(user, context = {"request": request}).data,
        })
    return AuthenticationFailed("Invalid credentials, please try again")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logoutView(request):
    try:
        refreshToken = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        token = tokens.RefreshToken(refreshToken)
        token.blacklist()

        res = Response()
        res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        res.delete_cookie('X-CSRFToken')
        res.delete_cookie('user_info')
        res.delete_cookie('csrftoken')
        return res

    except:
        raise ParseError("Invalid Token")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurrentUser(request):
    try:
        user = User.objects.get(id=request.user.id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data)
    

class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                key = settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value = response.data['refresh'],
                expires = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            del response.data['refresh']
        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)