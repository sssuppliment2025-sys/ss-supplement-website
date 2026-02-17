from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from mongo.collections import users_col, referrals_col
from Mail.mail import MailFunction
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





################################################################################################################
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
import secrets


try:
    from utils.password import hash_password
except ImportError:
    def hash_password(password):
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

from mongo.collections import users_col, otps_col

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    print("🔥 FORGOT_PASSWORD START")
    print("🔥 DATA:", request.data)
    
    phone = request.data.get('phone', '').strip()
    email = request.data.get('email', '').strip()

    if not phone or not email:
        return Response({
            "success": False, 
            "error": "Phone and email required"
        }, status=status.HTTP_400_BAD_REQUEST)

    user_data = users_col.find_one({
        '$or': [
            {'phone': phone},
            {'email': email}
        ]
    })
    
    print(f"USER FOUND: {user_data is not None}")

    if not user_data:
        return Response({
            "success": True,
            "message": "If account exists, OTP sent to your email"
        }, status=status.HTTP_200_OK)

    otps_col.delete_many({
        '$or': [{'phone': phone}, {'email': email}]
    })

    otp_code = str(secrets.randbelow(900000) + 100000)
    expires_at = datetime.now() + timedelta(minutes=10)
    otp_doc = {
        'user_id': str(user_data['_id']),
        'phone': phone,
        'email': email,
        'name': user_data.get('name', 'User'),
        'otp': otp_code,
        'is_used': False,
        'expires_at': expires_at,
        'created_at': datetime.now()
    }
    
    otps_col.insert_one(otp_doc)
    print(f"✅ OTP SAVED: {otp_code}")
    if otp_code :
        MailFunction(settings, email, otp_code)
    else :
        print('Mail error...')
    
    return Response({
        "success": True,
        "message": "OTP sent successfully! Check inbox/spam.",
        "debug_otp": otp_code  
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP - Step 2"""
    print("🔥 VERIFY_OTP")
    print("🔥 DATA:", request.data)
    
    phone = request.data.get('phone', '').strip()
    email = request.data.get('email', '').strip()
    otp_code = request.data.get('otp', '').strip()
    

    if not phone or not email or not otp_code:
        return Response({
            "success": False, 
            "error": "Phone, email, OTP required"
        }, status=status.HTTP_400_BAD_REQUEST)
    

    otp_doc = otps_col.find_one({
        '$or': [
            {'phone': phone, 'email': email},
            {'phone': phone},
            {'email': email}
        ],
        'otp': otp_code,
        'is_used': False,
        'expires_at': {'$gt': datetime.now()}
    })
    
    if not otp_doc:
        return Response({
            "success": False, 
            "error": "Invalid or expired OTP"
        }, status=status.HTTP_400_BAD_REQUEST)
    

    otps_col.update_one(
        {'_id': otp_doc['_id']},
        {'$set': {'is_used': True}}
    )
    
    print("✅ OTP VERIFIED!")
    return Response({
        "success": True,
        "message": "OTP verified! Reset your password."
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """🔥 ULTRA-SIMPLE - Shows EXACT frontend data"""
    print("🔥 RESET_PASSWORD - FULL DEBUG")
    print("🔥 RAW request.data:", request.data)
    print("🔥 request.data.keys():", list(request.data.keys()))
    

    phone_raw = request.data.get('phone')
    email_raw = request.data.get('email') 
    otp_raw = request.data.get('otp')
    password_raw = request.data.get('new_password')
    
    print(f"📱 PHONE RAW: '{phone_raw}' (type: {type(phone_raw)})")
    print(f"📧 EMAIL RAW: '{email_raw}' (type: {type(email_raw)})")
    print(f"🔑   OTP RAW: '{otp_raw}' (type: {type(otp_raw)})")
    print(f"🔑 PASS RAW: '{password_raw}' (type: {type(password_raw)})")
    

    phone = str(phone_raw or '').strip() if phone_raw else ''
    email = str(email_raw or '').strip() if email_raw else ''
    otp_code = str(otp_raw or '').strip() if otp_raw else ''
    new_password = str(password_raw or '').strip() if password_raw else ''
    
    print(f"📱 PHONE CLEAN: '{phone}' (len: {len(phone)})")
    print(f"📧 EMAIL CLEAN: '{email}' (len: {len(email)})")
    print(f"🔑   OTP CLEAN: '{otp_code}' (len: {len(otp_code)})")
    print(f"🔑 PASS CLEAN: '{new_password}' (len: {len(new_password)})")
    

    if len(phone) == 0:
        return Response({"success": False, "error": f"Phone empty. Got: '{phone_raw}'"}, status=400)
    if len(email) == 0:
        return Response({"success": False, "error": f"Email empty. Got: '{email_raw}'"}, status=400)
    if len(otp_code) == 0:
        return Response({"success": False, "error": f"OTP empty. Got: '{otp_raw}'"}, status=400)
    if len(new_password) == 0:
        return Response({"success": False, "error": f"NEW_PASSWORD EMPTY. Got: '{password_raw}' (type: {type(password_raw)})"}, status=400)
    if len(new_password) < 6:
        return Response({"success": False, "error": "Password too short"}, status=400)
    
    print("ALL FIELDS VALID!")
    
    otp_doc = otps_col.find_one({
        '$or': [
            {'phone': phone, 'email': email},
            {'phone': phone},
            {'email': email}
        ],
        'otp': otp_code,
        'is_used': True,
        'expires_at': {'$gt': datetime.now()}
    })
    
    if not otp_doc:
        return Response({"success": False, "error": "Verify OTP first"}, status=400)
    
    try:
        from utils.password import hash_password
        hashed_password = hash_password(new_password)
    except:
        import hashlib
        hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
    
    result = users_col.update_one(
        {'$or': [{'phone': phone}, {'email': email}]},
        {'$set': {'password': hashed_password}}
    )
    
    otps_col.delete_one({'_id': otp_doc['_id']})
    
    print("✅ PASSWORD RESET SUCCESS!")
    return Response({"success": True, "message": "Password reset successful!"})
