"""
Django settings for the Referral Coin Backend.
"""

import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-change-this-in-production",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [
    "ss-supplement-website.onrender.com",
    "localhost",
    "127.0.0.1",
]
DATABASES = {}
# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Local
    "accounts",
]

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    # ❌ CSRF stays enabled globally (safe)
    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ---------------------------------------------------------------------------
# CORS (REACT → DJANGO)
# ---------------------------------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://ss-supplement-website.vercel.app",
    "https://www.sssupplement.com",
]

CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------------
# CSRF (ONLY FOR DJANGO ADMIN / TEMPLATES)
# React + JWT APIs DO NOT USE CSRF
# ---------------------------------------------------------------------------

CSRF_TRUSTED_ORIGINS = [
    "https://www.sssupplement.com",
    "https://ss-supplement-website.vercel.app",
    "https://ss-supplement-website.onrender.com",
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"

# ---------------------------------------------------------------------------
# URLs / Templates
# ---------------------------------------------------------------------------

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

AUTH_USER_MODEL = "accounts.User"

AUTHENTICATION_BACKENDS = [
    "accounts.backends.PhoneBackend",
]

# ---------------------------------------------------------------------------
# Django REST Framework (JWT ONLY — NO CSRF)
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),    
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ---------------------------------------------------------------------------
# Referral Points
# ---------------------------------------------------------------------------

REFERRAL_POINTS_FOR_REFERRER = 4
REFERRAL_POINTS_FOR_REFEREE = 2

# ---------------------------------------------------------------------------
# Internationalization / Static
# ---------------------------------------------------------------------------

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"







import os
from dotenv import load_dotenv
load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")


SECRET_KEY = os.getenv("SECRET_KEY")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
}



from decouple import config

# 🔥 PRIMARY: Gmail SMTP (Local/Render Paid)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='sssuppliment2025@gmail.com')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='komp phxt crhh ermr')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='sssuppliment2025@gmail.com')

# 🔥 BACKUP: SendGrid API Key (Render FREE + High Limits)
SENDGRID_API_KEY = config('SENDGRID_API_KEY', default='SG.your-sendgrid-key')

# 🔥 SMS: Fast2SMS (India - ₹0.10/SMS)
FAST2SMS_KEY = config('FAST2SMS_KEY', default='your-fast2sms-key')

# 🔥 FAILOVER: Enable Dual System
DUAL_EMAIL_FAILOVER = config('DUAL_EMAIL_FAILOVER', default=True, cast=bool)

# 🔥 Email Logging (Debug)
EMAIL_LOGGING_ENABLED = config('EMAIL_LOGGING_ENABLED', default=False, cast=bool)

