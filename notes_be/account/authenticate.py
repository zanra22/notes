from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework.exceptions import PermissionDenied
from rest_framework.authentication import CSRFCheck


def enforce_csrf(request):
    check = CSRFCheck(request)
    reason = check.process_view(request)
    if reason:
        raise PermissionDenied('CSRF Failed: %s' % reason)
    

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None

        if header is None:
            return None
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None
        
        validated_token = self.get_validated_token(raw_token)
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token