"""Root URL configuration."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", include("accounts.AccountUrls")),
    path("api/", include("accounts.urls")),
]
