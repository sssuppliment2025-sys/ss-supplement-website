"""
JWT Authentication for SSSupplement API.
"""

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework import authentication, exceptions


class AdminUser:
    """Simple admin user object for DRF compatibility."""
    def __init__(self, admin_data):
        self.id = str(admin_data.get('_id', ''))
        self.email = admin_data.get('email', '')
        self.name = admin_data.get('name', 'Admin')
        self.is_authenticated = True

    def __str__(self):
        return self.email


class JWTAuthentication(authentication.BaseAuthentication):
    """Custom JWT authentication class."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None

        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')

        admin_data = {
            '_id': payload.get('admin_id'),
            'email': payload.get('email'),
            'name': payload.get('name', 'Admin'),
        }

        user = AdminUser(admin_data)
        return (user, token)


def generate_token(admin_data):
    """Generate a JWT token for an admin user."""
    payload = {
        'admin_id': str(admin_data.get('_id', '')),
        'email': admin_data.get('email', ''),
        'name': admin_data.get('name', 'Admin'),
        'exp': datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
