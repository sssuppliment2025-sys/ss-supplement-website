"""
Models for authentication, referrals, and password reset OTP.
Compatible with MongoDB via Djongo and existing Django User model.
"""

import uuid
import random
import string
from datetime import timedelta
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from djongo import models as djongo_models

def generate_otp():
    """Generate 6-digit random OTP"""
    return ''.join(random.choices(string.digits, k=6))

def generate_referral_code():
    """Generate unique 12-char referral code"""
    return uuid.uuid4().hex[:12].upper()

class User(AbstractUser):
    """Extended Django User with phone login, referral points and unique referral code."""
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    points = models.PositiveIntegerField(default=0)
    referral_code = models.CharField(max_length=12, unique=True, blank=True)
    referred_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referrals_made",
    )

    # Login via phone number
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["username", "email"]

    def save(self, *args, **kwargs):
        # Auto-generate unique referral code on first save
        if not self.referral_code:
            self.referral_code = generate_referral_code()
        super().save(*args, **kwargs)

    @property
    def name(self):
        """Frontend expects 'name' field"""
        full = f"{self.first_name} {self.last_name}".strip()
        return full if full else self.username

    @property
    def total_referrals(self):
        """Total referrals made by this user"""
        return self.referrals_given.count()

    def __str__(self):
        return f"{self.phone} - {self.name} ({self.points} pts)"

class Referral(models.Model):
    """Audit log for referral relationships."""
    
    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referrals_given",
    )
    referee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referrals_received",
    )
    referrer_points_awarded = models.PositiveIntegerField()
    referee_points_awarded = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["referrer", "referee"],
                name="unique_referral",
            )
        ]

    def __str__(self):
        return f"{self.referrer.phone} -> {self.referee.phone}"

class OTP(djongo_models.Model):
    """OTP model for password reset - MongoDB optimized"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=15, db_index=True)
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            djongo_models.Index(fields=['phone', 'email']),
            djongo_models.Index(fields=['otp', 'is_used', 'expires_at'])
        ]

    def save(self, *args, **kwargs):
        if not self.pk:
            self.otp = generate_otp()
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        """Check if OTP is valid and not expired"""
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"OTP {self.otp} for {self.phone} - {self.email}"
