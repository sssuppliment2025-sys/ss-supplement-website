"""
API views for authentication, profile, referrals, and leaderboard.
"""

from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PointTransaction, Referral
from .serializers import (
    LeaderboardSerializer,
    LoginSerializer,
    PointTransactionSerializer,
    ReferralSerializer,
    SignupSerializer,
    UserProfileSerializer,
)

User = get_user_model()


# ---------------------------------------------------------------------------
# Auth views
# ---------------------------------------------------------------------------


class SignupView(generics.CreateAPIView):
    """
    POST /api/auth/signup/
    Body: { username, email, password, password2, referral_code? }
    """

    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for immediate login
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "referral_code": user.referral_code,
                    "points": user.points,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { username, password }
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"error": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "referral_code": user.referral_code,
                    "points": user.points,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Body: { refresh }   – blacklists the refresh token.
    """

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"message": "Logged out (token already expired or invalid)."},
                status=status.HTTP_200_OK,
            )


# ---------------------------------------------------------------------------
# Profile & Dashboard views
# ---------------------------------------------------------------------------


class ProfileView(generics.RetrieveAPIView):
    """
    GET /api/auth/profile/
    Returns the authenticated user's full profile with referral stats.
    """

    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class MyReferralsView(generics.ListAPIView):
    """
    GET /api/auth/referrals/
    Lists everyone the authenticated user has referred.
    """

    serializer_class = ReferralSerializer

    def get_queryset(self):
        return Referral.objects.filter(referrer=self.request.user)


class PointHistoryView(generics.ListAPIView):
    """
    GET /api/auth/points/history/
    Full ledger of point transactions for the authenticated user.
    """

    serializer_class = PointTransactionSerializer

    def get_queryset(self):
        return PointTransaction.objects.filter(user=self.request.user)


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------


class LeaderboardView(generics.ListAPIView):
    """
    GET /api/auth/leaderboard/
    Top 50 users by points (public).
    """

    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.order_by("-points")[:50]


class ValidateReferralCodeView(APIView):
    """
    GET /api/auth/validate-referral/?code=XXXXXX
    Checks if a referral code is valid (public, used during signup form).
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        code = request.query_params.get("code", "")
        if not code:
            return Response(
                {"valid": False, "error": "No code provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(referral_code=code)
            return Response(
                {"valid": True, "referrer_username": user.username}
            )
        except User.DoesNotExist:
            return Response({"valid": False, "error": "Invalid referral code."})
        









###########################################################################################################################

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.conf import settings
from django.core.mail import send_mail

from datetime import datetime, timedelta
import secrets
import threading
import hashlib

from mongo.collections import users_col, otps_col


# -------------------------------------------------------------------
# 🔥 EMAIL SENDER (ASYNC — NON BLOCKING)
# -------------------------------------------------------------------
def send_otp_email_async(email, otp, name="User"):
    try:
        subject = "Your Password Reset OTP"
        message = f"""
Hi {name},

Your OTP for password reset is:

🔐 OTP: {otp}

This OTP is valid for 10 minutes.

If you didn’t request this, please ignore this email.

– SS Supplement Team
"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
            timeout=10
        )
        print("✅ EMAIL SENT")
    except Exception as e:
        print("❌ EMAIL ERROR:", e)


# -------------------------------------------------------------------
# 🔥 FORGOT PASSWORD – STEP 1
# -------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    phone = request.data.get('phone', '').strip()
    email = request.data.get('email', '').strip()

    if not phone or not email:
        return Response(
            {"success": False, "error": "Phone and email required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = users_col.find_one({
        '$or': [{'phone': phone}, {'email': email}]
    })

    # Always return success (security best practice)
    if not user:
        return Response({
            "success": True,
            "message": "If account exists, OTP sent"
        })

    # Remove old OTPs
    otps_col.delete_many({
        '$or': [{'phone': phone}, {'email': email}]
    })

    otp_code = str(secrets.randbelow(900000) + 100000)

    otps_col.insert_one({
        "user_id": str(user["_id"]),
        "phone": phone,
        "email": email,
        "otp": otp_code,
        "is_used": False,
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
        "created_at": datetime.utcnow()
    })

    # 🚀 SEND EMAIL IN BACKGROUND (FAST RESPONSE)
    threading.Thread(
        target=send_otp_email_async,
        args=(email, otp_code, user.get("name", "User")),
        daemon=True
    ).start()

    return Response({
        "success": True,
        "message": "OTP sent successfully! Check inbox/spam."
    })


# -------------------------------------------------------------------
# 🔥 VERIFY OTP – STEP 2
# -------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get('phone', '').strip()
    email = request.data.get('email', '').strip()
    otp = request.data.get('otp', '').strip()

    if not phone or not email or not otp:
        return Response(
            {"success": False, "error": "Phone, email and OTP required"},
            status=400
        )

    otp_doc = otps_col.find_one({
        '$or': [{'phone': phone}, {'email': email}],
        'otp': otp,
        'is_used': False,
        'expires_at': {'$gt': datetime.utcnow()}
    })

    if not otp_doc:
        return Response(
            {"success": False, "error": "Invalid or expired OTP"},
            status=400
        )

    otps_col.update_one(
        {'_id': otp_doc['_id']},
        {'$set': {'is_used': True}}
    )

    return Response({
        "success": True,
        "message": "OTP verified successfully"
    })


# -------------------------------------------------------------------
# 🔥 RESET PASSWORD – STEP 3
# -------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    phone = str(request.data.get('phone', '')).strip()
    email = str(request.data.get('email', '')).strip()
    otp = str(request.data.get('otp', '')).strip()
    new_password = str(request.data.get('new_password', '')).strip()

    if not phone or not email or not otp or not new_password:
        return Response(
            {"success": False, "error": "All fields required"},
            status=400
        )

    if len(new_password) < 6:
        return Response(
            {"success": False, "error": "Password too short"},
            status=400
        )

    otp_doc = otps_col.find_one({
        '$or': [{'phone': phone}, {'email': email}],
        'otp': otp,
        'is_used': True,
        'expires_at': {'$gt': datetime.utcnow()}
    })

    if not otp_doc:
        return Response(
            {"success": False, "error": "OTP not verified"},
            status=400
        )

    hashed_password = hashlib.sha256(new_password.encode()).hexdigest()

    users_col.update_one(
        {'$or': [{'phone': phone}, {'email': email}]},
        {'$set': {'password': hashed_password}}
    )

    otps_col.delete_one({'_id': otp_doc['_id']})

    return Response({
        "success": True,
        "message": "Password reset successful"
    })

