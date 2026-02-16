from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from mongo.collections import users_col, referrals_col
from utils.password import hash_password, verify_password
from utils.jwt import generate_tokens_for_user
from utils.jwt_helper import decode_token


# ================== HEALTH CHECK ==================
def wake_up(request):
    return JsonResponse({"status": "backend awake"})


# ================== SIGNUP ==================
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        phone = data.get("phone")
        password = data.get("password")
        name = data.get("name")
        email = data.get("email")
        referral_code = data.get("referralCode")  # optional

        if not phone or not password or not name:
            return Response({"detail": "Required fields missing"}, status=400)

        if users_col.find_one({"phone": phone}):
            return Response({"detail": "Phone already registered"}, status=400)

        # --- Create new user ---
        user_doc = {
            "phone": phone,
            "email": email,
            "name": name,
            "password": hash_password(password),
            "points": 0,  # start with 0 points
            "created_at": datetime.utcnow(),
        }
        result = users_col.insert_one(user_doc)
        user_id = str(result.inserted_id)

        # --- REFERRAL LOGIC ---
        if referral_code:
            try:
                referrer = users_col.find_one({"_id": ObjectId(referral_code)})
            except InvalidId:
                referrer = None

            if referrer and str(referrer["_id"]) != user_id:
                # Update points
                users_col.update_one(
                    {"_id": referrer["_id"]}, {"$inc": {"points": 4}}
                )
                users_col.update_one(
                    {"_id": ObjectId(user_id)}, {"$inc": {"points": 2}}
                )

                # Save referral record
                referrals_col.insert_one({
                    "referrer_id": str(referrer["_id"]),
                    "referred_user": {
                        "id": user_id,
                        "name": name,
                        "phone": phone,
                        "email": email,
                    },
                    "referrer_points": 4,
                    "referee_points": 2,
                    "created_at": datetime.utcnow(),
                })

        # --- Generate JWT tokens ---
        tokens = generate_tokens_for_user(user_id)
        user = users_col.find_one({"_id": ObjectId(user_id)})

        return Response({
            "user": {
                "id": user_id,
                "name": user["name"],
                "phone": user["phone"],
                "email": user.get("email"),
                "points": user.get("points", 0),
            },
            "tokens": tokens,
        }, status=201)


# ================== LOGIN ==================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        password = request.data.get("password")

        if not phone or not password:
            return Response({"detail": "Phone and password required"}, status=400)

        user = users_col.find_one({"phone": phone})
        if not user or not verify_password(password, user["password"]):
            return Response({"detail": "Invalid credentials"}, status=401)

        tokens = generate_tokens_for_user(str(user["_id"]))

        return Response({
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "phone": user["phone"],
                "email": user.get("email"),
                "points": user.get("points", 0),
            },
            "tokens": tokens,
        })


# ================== PROFILE ==================
class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response({"detail": "Unauthorized"}, status=401)

        try:
            token = auth.replace("Bearer ", "")
            payload = decode_token(token)
            user = users_col.find_one({"_id": ObjectId(payload["user_id"])})
            if not user:
                return Response({"detail": "User not found"}, status=404)

            return Response({
                "id": str(user["_id"]),
                "name": user["name"],
                "phone": user["phone"],
                "email": user.get("email"),
                "points": user.get("points", 0),
                "referral_code": str(user["_id"]),
            })
        except Exception as e:
            print("PROFILE ERROR:", e)
            return Response({"detail": "Invalid token"}, status=401)


# ================== MY REFERRALS ==================
class MyReferralsView(APIView):
    def get(self, request):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response([], status=200)

        try:
            token = auth.replace("Bearer ", "")
            payload = decode_token(token)

            referrals = referrals_col.find({"referrer_id": payload["user_id"]})

            return Response([
                {
                    "id": str(r["_id"]),
                    "referee_name": r["referred_user"]["name"],
                    "referee_phone": r["referred_user"]["phone"],
                    "referrer_points": r["referrer_points"],
                    "referee_points": r["referee_points"],
                    "created_at": r["created_at"],
                }
                for r in referrals
            ], status=200)
        except Exception as e:
            print("REFERRAL ERROR:", e)
            return Response([], status=200)


# ================== LEADERBOARD ==================
class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = users_col.find().sort("points", -1).limit(50)

        return Response([
            {
                "id": str(u["_id"]),
                "name": u["name"],
                "points": u.get("points", 0),
            }
            for u in users
        ])








# =============================== Order placed with coin =====================
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from utils.jwt_helper import decode_token
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://sssuppliment2025_db_user:hvwSArrVRQFhEsAD@supplimentcluster.q0id4n0.mongodb.net/sssuppliment_db?retryWrites=true&w=majority"
)

mongo_client = MongoClient(MONGO_URI)
db = mongo_client["sssuppliment_db"]  
orders_collection = db['orders']
users_collection = db['users']

@api_view(['POST'])
def create_order(request):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)
        
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        user_id = payload['user_id']
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=404)
        
        data = request.data
        
        subtotal = sum(float(item.get('price', 0)) * int(item.get('quantity', 0)) for item in data.get('items', []))
        coins_used = float(data.get('coins_used', 0))
        final_total = float(data.get('total', 0))  

       
        min_cash_payment = max(subtotal * 0.2, 50)  
        if final_total < min_cash_payment:
            return Response({
                'error': f'Minimum 20% cash payment required. Min: ₹{int(min_cash_payment)}, Got: ₹{int(final_total)}'
            }, status=400)
        
        
        max_coins_allowed = subtotal * 0.8
        if coins_used > max_coins_allowed:
            return Response({
                'error': f'Maximum 80% coins allowed. Max: ₹{int(max_coins_allowed)}, Requested: ₹{int(coins_used)}'
            }, status=400)
        
        
        current_points = user.get('points', 0)
        
       
        if coins_used > 0:
            if current_points < coins_used:
                return Response({
                    'error': f'Insufficient coins. Available: {int(current_points)}, Required: {int(coins_used)}'
                }, status=400)
            
           
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"points": -coins_used}}
            )
        
   
        updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
        new_points = int(updated_user.get('points', 0))
        
      
        order_id = str(uuid.uuid4())[:8].upper()
        
    
        address_data = data.get('address', {})
        address_array = [
            {"type": "fullName", "value": address_data.get('fullName', '')},
            {"type": "phone", "value": address_data.get('phone', '')},
            {"type": "email", "value": address_data.get('email', '')},
            {"type": "address", "value": address_data.get('address', '')},
            {"type": "city", "value": address_data.get('city', '')},
            {"type": "state", "value": address_data.get('state', '')},
            {"type": "pincode", "value": address_data.get('pincode', '')},
            {"type": "landmark", "value": address_data.get('landmark', '')}
        ]
        
        
        enhanced_items = []
        for item in data.get('items', []):
            flavor = (item.get('selectedFlavor') or 
                     item.get('flavor') or 
                     item.get('variant') or 
                     item.get('flavour') or 
                     'N/A')
            
            weight = (item.get('selectedWeight') or 
                     item.get('weight') or 
                     item.get('size') or 
                     item.get('variantWeight') or
                     'N/A')
            
            enhanced_items.append({
                "product_id": str(item.get('productId', '')),
                "name": item.get('name', ''),
                "quantity": int(item.get('quantity', 0)),
                "price": float(item.get('price', 0)),
                "total": float(item.get('price', 0)) * int(item.get('quantity', 0)),
                "flavor": flavor,
                "weight": weight
            })
        
      
        earned_points = int(final_total * 0.05)
        
        
        order_data = {
            '_id': ObjectId(),
            'order_id': order_id,
            'user_id': user_id,
            'user_phone': user.get('phone', ''),
            'user_name': user.get('name', ''),
            'user_email': user.get('email', ''),
            'address_details': address_array,
            'order_items': enhanced_items,
            'subtotal': float(subtotal),
            'coins_used': float(coins_used),
            'final_total': float(final_total),
            'payment_method': data.get('payment_method', 'cod'),
            'utr_number': data.get('utr_number'),
            'status': 'pending',
            'earned_points': earned_points,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        }
        
       
        orders_collection.insert_one(order_data)
        
        
        print(f"Order created: {order_id}")
        print(f"Subtotal: ₹{subtotal}, Coins: ₹{coins_used}, Final: ₹{final_total}")
        print(f"User coins before: {int(current_points)}, after: {new_points}")
        
        return Response({
            'success': True,
            'order': {
                'id': order_id,
                'earnedPoints': earned_points  
            },
            'user': {
                'points': new_points
            }
        }, status=201)
        
    except Exception as e:
        print(f"Order error: {str(e)}")
        print(f"Request data: {request.data}")
        return Response({
            'error': str(e),
            'detail': 'Order creation failed'
        }, status=500)




@api_view(['GET'])
def profile_view(request):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)
        
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        user_id = payload['user_id']
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=404)
        
        return Response({
            'points': int(user.get('points', 0)),
            'phone': user.get('phone', ''),
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'referral_code': user.get('referral_code', '')
        })
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=401)



# ================================================== Mail =============================================
# your_app/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone  # ✅ FIXED: Import added
from .models import User, OTP
from .serializers import ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer
import re

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Send OTP to user's email for password reset."""
    serializer = ForgotPasswordSerializer(data=request.data)
    
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    phone = serializer.validated_data['phone']
    email = serializer.validated_data['email']
    
    # Validate Indian phone format (+91 followed by 10 digits)
    if not re.match(r'^\+?91[6-9]\d{9}$', phone.replace(" ", "")):
        return Response({"error": "Invalid phone number format (+91XXXXXXXXXX)"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find exact user match (security - don't reveal if user exists)
        user = User.objects.filter(phone=phone, email=email).first()
        if not user:
            # Don't reveal if user doesn't exist (security)
            return Response({
                "success": True,
                "message": "If account exists, OTP sent to your email"
            }, status=status.HTTP_200_OK)
        
        # Delete old OTPs for this user
        OTP.objects.filter(phone=phone, email=email).delete()
        
        # Create new OTP
        otp = OTP.objects.create(user=user, phone=phone, email=email)
        
        # Send email with OTP
        subject = 'Password Reset OTP - Your App Name'
        message = f'''
Your password reset OTP is: {otp.otp}

This OTP is valid for only 10 minutes.

If you did not request this password reset, please ignore this email.

---
Your App Team
        '''
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            "success": True,
            "message": "OTP sent successfully! Check your inbox (and spam folder)."
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "success": False, 
            "error": "Failed to send OTP. Please try again."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP sent to user's email."""
    serializer = VerifyOTPSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    phone = serializer.validated_data['phone']
    email = serializer.validated_data['email']
    otp_code = serializer.validated_data['otp']
    
    try:
        # Find valid OTP record
        otp_record = OTP.objects.filter(
            phone=phone, 
            email=email, 
            otp=otp_code,
            is_used=False,
            expires_at__gt=timezone.now()  # ✅ Now works with import
        ).first()
        
        if not otp_record:
            return Response({
                "success": False,
                "error": "Invalid or expired OTP. Please request a new one."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as used
        otp_record.is_used = True
        otp_record.save(update_fields=['is_used'])
        
        return Response({
            "success": True,
            "message": "OTP verified successfully! You can now reset your password.",
            "data": {
                "phone": phone,
                "email": email
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "success": False,
            "error": "OTP verification failed. Please try again."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset user password after OTP verification."""
    serializer = ResetPasswordSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    phone = serializer.validated_data['phone']
    email = serializer.validated_data['email']
    otp_code = serializer.validated_data['otp']
    new_password = serializer.validated_data['new_password']
    
    try:
        # Check if OTP was verified (is_used=True) and not expired
        otp_record = OTP.objects.filter(
            phone=phone, 
            email=email, 
            otp=otp_code,
            is_used=True,  # ✅ Must be verified first
            expires_at__gt=timezone.now()  # ✅ Not expired
        ).first()
        # In forgot_password view, before send_mail()
        print("=== EMAIL DEBUG ===")
        print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
        print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
        print("===================")

        if not otp_record:
            return Response({
                "success": False,
                "error": "Please verify OTP first or request a new one."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user and reset password
        user = User.objects.get(phone=phone, email=email)
        user.set_password(new_password)
        user.save(update_fields=['password'])
        
        # Clean up used OTP
        otp_record.delete()
        
        return Response({
            "success": True,
            "message": "Password reset successfully! Please login with your new password.",
            "data": {
                "phone": phone,
                "email": email
            }
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            "success": False,
            "error": "User not found with this phone and email combination."
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "success": False,
            "error": "Password reset failed. Please try again."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
