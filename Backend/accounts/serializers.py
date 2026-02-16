"""
Complete serializers for authentication, profile, referrals, and password reset.
Works perfectly with existing frontend expectations.
"""

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Referral, OTP, User

User = get_user_model()

# ---------------------------------------------------------------------------
# Auth Serializers (Existing + OTP)
# ---------------------------------------------------------------------------
class SignupSerializer(serializers.Serializer):
    """Register new user - matches frontend exactly."""
    
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=8)
    confirmPassword = serializers.CharField(write_only=True, min_length=8)
    referralCode = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=""
    )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def validate_referralCode(self, value):
        if value:
            if not User.objects.filter(referral_code=value).exists():
                raise serializers.ValidationError("Invalid referral code.")
        return value

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError(
                {"confirmPassword": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        referral_code = validated_data.pop("referralCode", "")
        name = validated_data.pop("name")
        
        # Split name into first_name / last_name
        name_parts = name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Create user
        user = User(
            username=validated_data["phone"],  # required by AbstractUser
            phone=validated_data["phone"],
            email=validated_data["email"],
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(validated_data["password"])
        user.save()

        # Process referral
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
            except User.DoesNotExist:
                pass  # Invalid code, ignore
            else:
                if referrer.pk != user.pk:  # can't refer yourself
                    referrer_pts = getattr(settings, "REFERRAL_POINTS_FOR_REFERRER", 4)
                    referee_pts = getattr(settings, "REFERRAL_POINTS_FOR_REFEREE", 2)
                    
                    # Award points
                    referrer.points += referrer_pts
                    referrer.save(update_fields=["points"])
                    
                    user.points += referee_pts
                    user.referred_by = referrer
                    user.save(update_fields=["points", "referred_by"])
                    
                    # Create referral record
                    Referral.objects.create(
                        referrer=referrer,
                        referee=user,
                        referrer_points_awarded=referrer_pts,
                        referee_points_awarded=referee_pts,
                    )
        
        return user

class LoginSerializer(serializers.Serializer):
    """Login with phone + password."""
    phone = serializers.CharField()
    password = serializers.CharField()

# ---------------------------------------------------------------------------
# Password Reset OTP Serializers
# ---------------------------------------------------------------------------
class ForgotPasswordSerializer(serializers.Serializer):
    """Send OTP for password reset."""
    phone = serializers.CharField(max_length=15)
    email = serializers.EmailField()

    def validate_phone(self, value):
        if not User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("No user found with this phone number.")
        return value

    def validate_email(self, value):
        phone = self.initial_data.get('phone')
        if not User.objects.filter(phone=phone, email=value).exists():
            raise serializers.ValidationError("Email does not match phone number.")
        return value

class VerifyOTPSerializer(serializers.Serializer):
    """Verify OTP for password reset."""
    phone = serializers.CharField(max_length=15)
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    """Reset password after OTP verification."""
    phone = serializers.CharField(max_length=15)
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        # Verify OTP exists and is valid
        try:
            otp_record = OTP.objects.filter(
                phone=data['phone'],
                email=data['email'],
                otp=data['otp'],
                is_used=False
            ).select_related('user').first()
            
            if not otp_record or not otp_record.is_valid():
                raise serializers.ValidationError("Invalid or expired OTP.")
                
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP.")
        
        return data

# ---------------------------------------------------------------------------
# Profile & Referral Serializers (Unchanged)
# ---------------------------------------------------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    """User profile for dashboard."""
    name = serializers.SerializerMethodField()
    total_referrals = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "name", "email", "phone", "points",
            "referral_code", "total_referrals", "date_joined"
        ]
        read_only_fields = fields

    def get_name(self, obj):
        return obj.name

    def get_total_referrals(self, obj):
        return obj.total_referrals

class ReferralSerializer(serializers.ModelSerializer):
    """Single referral record."""
    referrer_phone = serializers.CharField(source="referrer.phone", read_only=True)
    referrer_name = serializers.SerializerMethodField()
    referee_phone = serializers.CharField(source="referee.phone", read_only=True)
    referee_name = serializers.SerializerMethodField()

    class Meta:
        model = Referral
        fields = [
            "id", "referrer_phone", "referrer_name",
            "referee_phone", "referee_name",
            "referrer_points_awarded", "referee_points_awarded", "created_at"
        ]
        read_only_fields = fields

    def get_referrer_name(self, obj):
        return obj.referrer.name

    def get_referee_name(self, obj):
        return obj.referee.name

class LeaderboardSerializer(serializers.ModelSerializer):
    """Leaderboard user data."""
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "phone", "points"]
        read_only_fields = fields

    def get_name(self, obj):
        return obj.name
