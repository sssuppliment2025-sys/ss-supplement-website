"""Accounts app URL configuration."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import viewsAdmin

urlpatterns = [
    path("wake-up/", viewsAdmin.wake_up, name="wake_up"),            
]
