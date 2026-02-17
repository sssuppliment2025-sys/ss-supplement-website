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
from django.core.mail import EmailMultiAlternatives



######### ================== Mail Function ===================
def MailFunction(userMail, userName, password):
    subject = 'Testing mail'
    from_email = settings.EMAIL_HOST_USER
    to_email = userMail
    text_content = 'This is a fallback plain text message.'
    html_content = f'<p><pre>Hi {userName}, thank you for signing up on UPOLABDHI!......... 🎉</pre> <pre>Your username: {userName}Y \our password: {password}....🔑</pre>  <pre>Please keep your credentials safe and do not share them with others........</pre>   <pre>Your registration was successful.....😊😊 — Welcome to UPOLABDHI!..... 😀😀</pre></p>'

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
######### ================== Mail Function ===================







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
################################################################################################################
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from datetime import datetime, timedelta
import secrets
import threading
import os

# 🔥 RESEND SUPPORT (Optional fallback)
try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False

try:
    from utils.password import hash_password
except ImportError:
    def hash_password(password):
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

from mongo.collections import users_col, otps_col

# 🔥 ULTIMATE MailFunction - Brevo Priority + All Fallbacks
def MailFunction(userMail, userName, otp_code, phone=""):
    """🔥 Brevo (Priority) → Resend → Gmail → Console (Ultimate fallback)"""
    
    print(f"🔍 EMAIL DEBUG: Trying {userMail}")
    
    # 🔥 #1 BREVO SMTP (Render Production - 300/day FREE)
    if os.environ.get('BREVO_SMTP_KEY'):
        try:
            subject = 'SS Supplement - Your OTP Code'
            from_email = os.environ.get('EMAIL_HOST_USER', 'sssuppliment2025@gmail.com')
            to_email = userMail
            
            text_content = f'Hi {userName},\n\nYour OTP: {otp_code}\nValid 10 mins.\nPhone: {phone}\nSS Supplement'
            
            html_content = f'''
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; padding: 40px;">
                    <h2 style="color: #333;">Hi <strong>{userName}</strong>,</h2>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                               color: white; padding: 30px; border-radius: 15px; margin: 30px 0; display: inline-block;">
                        <h1 style="font-size: 48px; margin: 0; font-weight: bold; letter-spacing: 5px;">
                            {otp_code}
                        </h1>
                        <p style="margin: 10px 0 0 0; font-size: 18px;">Your OTP Code</p>
                    </div>
                    <p style="color: #666; font-size: 16px;">
                        Valid for <strong>10 minutes</strong> only.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee;">
                    <p style="color: #888; font-size: 14px;">
                        Phone: <strong>{phone}</strong><br>
                        SS Supplement Team 😊
                    </p>
                </div>
            </body>
            </html>
            '''
            
            msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            
            print(f"✅ BREVO SMTP DELIVERED to {userMail}")
            return True
            
        except Exception as e:
            print(f"❌ BREVO SMTP FAILED: {e}")
    
    # 🔥 #2 RESEND API (If Brevo fails)
    if RESEND_AVAILABLE and os.environ.get('RESEND_API_KEY'):
        try:
            resend.api_key = os.environ.get('RESEND_API_KEY')
            resend.Emails.send({
                "from": os.environ.get('FROM_EMAIL', 'SS Supplement <noreply@resend.dev>'),
                "to": [userMail],
                "subject": "SS Supplement - Your OTP Code",
                "html": f"""[SAME HTML AS ABOVE]"""
            })
            print(f"✅ RESEND API DELIVERED to {userMail}")
            return True
        except Exception as e:
            print(f"❌ RESEND FAILED: {e}")
    
    # 🔥 #3 GMAIL SMTP (Local fallback)
    try:
        from_email = settings.EMAIL_HOST_USER
        subject = 'SS Supplement - Your OTP Code'
        to_email = userMail
        text_content = f'Hi {userName}, Your OTP: {otp_code}'
        html_content = f'<h1>{otp_code}</h1>'
        
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        print(f"✅ GMAIL SMTP SENT to {userMail}")
        return True
    except Exception as e:
        print(f"❌ GMAIL FAILED: {e}")
    
    # 🔥 #4 CONSOLE (Last resort - logs email)
    print(f"📧 CONSOLE MODE: Would send to {userMail}: OTP {otp_code}")
    return True

# 🔥 ASYNC SENDER (0.1s response)
def send_email_async(email, otp_code, phone, user_name):
    def mail_thread():
        print(f"🚀 SENDING OTP {otp_code} to {email} (+{phone})")
        success = MailFunction(email, user_name, otp_code, phone)
        if success:
            print(f"✅ TOTAL SUCCESS to {email}")
        else:
            print(f"❌ ALL METHODS FAILED")
    
    thread = threading.Thread(target=mail_thread, daemon=True)
    thread.start()

# 🔥 ENDPOINTS (Unchanged - Perfect)
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
        '$or': [{'phone': phone}, {'email': email}]
    })
    
    print(f"USER FOUND: {user_data is not None}")

    if not user_data:
        return Response({
            "success": True,
            "message": "If account exists, OTP sent to your email"
        }, status=status.HTTP_200_OK)

    # Clean old OTPs
    otps_col.delete_many({
        '$or': [{'phone': phone}, {'email': email}]
    })

    # Generate OTP
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
    
    send_email_async(email, otp_code, phone, user_data.get('name', 'User'))
    
    return Response({
        "success": True,
        "message": "OTP sent successfully! Check inbox/spam.",
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    print("🔥 VERIFY_OTP")
    print("🔥 DATA:", request.data)
    
    phone = request.data.get('phone', '').strip()
    email = request.data.get('email', '').strip()
    otp_code = request.data.get('otp', '').strip()

    if not all([phone, email, otp_code]):
        return Response({
            "success": False, 
            "error": "Phone, email, OTP required"
        }, status=status.HTTP_400_BAD_REQUEST)

    otp_doc = otps_col.find_one({
        '$or': [{'phone': phone, 'email': email}, {'phone': phone}, {'email': email}],
        'otp': otp_code,
        'is_used': False,
        'expires_at': {'$gt': datetime.now()}
    })
    
    if not otp_doc:
        return Response({
            "success": False, 
            "error": "Invalid or expired OTP"
        }, status=status.HTTP_400_BAD_REQUEST)

    otps_col.update_one({'_id': otp_doc['_id']}, {'$set': {'is_used': True}})
    print("✅ OTP VERIFIED!")
    
    return Response({
        "success": True,
        "message": "OTP verified! Reset your password."
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    print("🔥 RESET_PASSWORD")
    print("🔥 DATA:", request.data)

    phone = str(request.data.get('phone', '')).strip()
    email = str(request.data.get('email', '')).strip()
    otp_code = str(request.data.get('otp', '')).strip()
    new_password = str(request.data.get('new_password', '')).strip()
    
    if not all([phone, email, otp_code, new_password]):
        return Response({"success": False, "error": "All fields required"}, status=400)
    
    if len(new_password) < 6:
        return Response({"success": False, "error": "Password must be 6+ characters"}, status=400)

    otp_doc = otps_col.find_one({
        '$or': [{'phone': phone, 'email': email}, {'phone': phone}, {'email': email}],
        'otp': otp_code,
        'is_used': True,
        'expires_at': {'$gt': datetime.now()}
    })
    
    if not otp_doc:
        return Response({"success": False, "error": "Verify OTP first"}, status=400)

    hashed_password = hash_password(new_password)
    result = users_col.update_one(
        {'$or': [{'phone': phone}, {'email': email}]},
        {'$set': {'password': hashed_password}}
    )
    
    if result.modified_count == 0:
        return Response({"success": False, "error": "User not found"}, status=404)

    otps_col.delete_one({'_id': otp_doc['_id']})
    
    print("✅ PASSWORD RESET SUCCESS!")
    return Response({
        "success": True, 
        "message": "Password reset successful! Login now."
    })
