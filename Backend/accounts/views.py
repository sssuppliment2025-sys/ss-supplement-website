from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
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
from mongo.collections import users_col, referrals_col
from Mail.mail import MailFunction
from utils.password import hash_password, verify_password
from utils.jwt import generate_tokens_for_user
from utils.jwt_helper import decode_token
from django.core.mail import EmailMultiAlternatives
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings
from datetime import datetime, timedelta
from mongo.collections import users_col, otps_col
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import api_view, permission_classes


from .RouterFunctions.Signup import signup_logic
from .RouterFunctions.login import LoginLogic
from .RouterFunctions.ProfileShowForRefferPoint import ProfileForRefferal
from .RouterFunctions.Refferal import refferalsLogic
from .RouterFunctions.CreateUserOrder import CreateOrderUser
from .RouterFunctions.ForgotPassword import FPassword
from .RouterFunctions.ResetPassword import RPassword
from .RouterFunctions.VerifyOTP import VOtp
from .RouterFunctions.ProfileView import ProfiView




load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://sssuppliment2025_db_user:hvwSArrVRQFhEsAD@supplimentcluster.q0id4n0.mongodb.net/sssuppliment_db?retryWrites=true&w=majority"
)
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["sssuppliment_db"]  
orders_collection = db['orders']
users_collection = db['users']



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


# .............................................. SIGNUP ...............................................

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        phone = data.get("phone")
        password = data.get("password")
        name = data.get("name")
        email = data.get("email")
        referral_code = data.get("referralCode")  
        print(data)
        
        user_id, user, tokens = signup_logic(data, phone, password, name, email, referral_code)
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
        


# ....................................... LOGIN ...................................................
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        password = request.data.get("password")

        tokens, user = LoginLogic(phone, password)


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


# .............................................. PROFILE ..................................................
class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return Response({"detail": "Unauthorized"}, status=401)

        try:
            user = ProfileForRefferal(auth)

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


# # .............................................. MY REFERRALS ..................................................
# Future Test <<<<-----  Target codes.... 
class MyReferralsView(APIView):
    def get(self, request):
        auth = request.headers.get("Authorization")
        try :
            referrals = refferalsLogic(auth)

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


# .................................................. LEADERBOARD ...................................................
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








# ................................................ Order placed with coin =.............................................
@api_view(['POST'])
def create_order(request):
    try:
        auth_header = request.headers.get('Authorization')
        data = request.data
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)
        
        order_id, earned_points, new_points = CreateOrderUser(auth_header, data, users_collection, orders_collection)
        
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
        #print(f"Request data: {request.data}")
        return Response({
            'error': str(e),
            'detail': 'Order creation failed'
        }, status=500)



# ................................................ profile_view .............................................
@api_view(['GET'])
def profile_view(request):
    return ProfiView(request, users_collection)





################################################################################################################
################################################################################################################
# ................................................ forgot_password .............................................
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Generate OTP and return user info to frontend for email"""
    #print("FORGOT_PASSWORD START")
    #print("DATA:", request.data)
    return FPassword(request)

    
# ................................................ verify_otp .............................................
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP from frontend"""
    #print("VERIFY_OTP")
    #print("DATA:", request.data)
    return VOtp(request, otps_col)

# ................................................ reset_password .............................................
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    return RPassword(request, otps_col, users_col, hash_password)
