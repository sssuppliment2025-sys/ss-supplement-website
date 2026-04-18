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
from .db import get_products_collection


from .RouterFunctions.Signup import signup_logic
from .RouterFunctions.login import LoginLogic
from .RouterFunctions.ProfileShowForRefferPoint import ProfileForRefferal
from .RouterFunctions.Refferal import get_my_referrals
from .RouterFunctions.CreateUserOrder import CreateOrderUser, calculate_order_quote, get_user_id_from_auth
import requests
import hmac
import hashlib
from .RouterFunctions.ForgotPassword import FPassword
from .RouterFunctions.ResetPassword import RPassword
from .RouterFunctions.VerifyOTP import VOtp
from .RouterFunctions.ProfileView import ProfiView
from .RouterFunctions.LboardView import board
from utils.CuJWTAuthenticat import CustomJWTAuthentication
# .................................................. UserAccount Portion ...........................................
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from mongo.collections import users_col, user_addresses_col, orders_col, carts_col, wishlists_col
import jwt
from django.conf import settings
from datetime import datetime
from utils.password import verify_password, hash_password
from bson import ObjectId
import traceback




load_dotenv()

#MONGO_URI = os.getenv(
#    "MONGO_URI",
#    "mongodb+srv://sssuppliment2025_db_user:hvwSArrVRQFhEsAD@supplimentcluster.q0id4n0.mongodb.net/sssuppliment_db?retryWrites=true&w=majority"
#)
#mongo_client = MongoClient(MONGO_URI)
#db = mongo_client["sssuppliment_db"]  
#orders_collection = db['orders']
#users_collection = db['users']
#user_addresses_col = db['user_address']






#####################################################################################################################
# .................................................. UserAccount Portion ...........................................
class ProfileForAccountView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    def get(self, request):
        try:
            if not request.user or 'id' not in request.user:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
            user_id = request.user['id']
            
            
            user_data = users_col.find_one({"_id": ObjectId(str(user_id))})
            if not user_data:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
         
            address_data = user_addresses_col.find_one({"user_id": str(user_id)})
            
          
            if address_data:
                address_dict = dict(address_data)
                if '_id' in address_dict:
                    address_dict['id'] = str(address_dict['_id'])
                    del address_dict['_id']
            else:
                address_dict = {}
            
            response_data = {
                "id": str(user_id),
                "email": user_data.get('email', '') or '',
                "name": user_data.get('name', '') or '',
                "phone": user_data.get('phone', '') or '',
                "address": address_data.get('full_address', '') if address_data else '',
                "points": user_data.get('points', 0),
                "address_fields": address_dict  
            }
            
            #print(f"Returning: {response_data}") 
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            #print(f"GET Profile ERROR: {str(e)}")
            #print(traceback.format_exc())
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        try:
            #print(f"PUT Profile - request.user: {request.user}")
            
            if not request.user or 'id' not in request.user:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
            user_id = request.user['id']
            data = request.data
            #print(f"Frontend sent: {data}")
            
           
            address_fields = data.get('address_fields', {})
            full_address = data.get('address', '')
            
            #print(f"Full address: {full_address}")
            #print(f"Address fields: {address_fields}")
            
            
            address_doc = {
                "user_id": str(user_id),  
                "full_address": full_address or '',
                "delivery_phone": address_fields.get('delivery_phone', '') or '',
                "flat_house": address_fields.get('flat_house', '') or '',
                "address2": address_fields.get('address2', '') or '',
                "address3": address_fields.get('address3', '') or '',
                "area_street": address_fields.get('area_street', '') or '',
                "town_city": address_fields.get('town_city', '') or '',
                "state": address_fields.get('state', '') or '',
                "pincode": address_fields.get('pincode', '') or '',
                "landmark": address_fields.get('landmark', '') or '',
                "updated_at": datetime.utcnow()
            }
            
            #print(f"Saving address_doc: {address_doc}")
            
           
            result = user_addresses_col.update_one(
                {"user_id": str(user_id)},
                {"$set": address_doc},
                upsert=True
            )
            
            #print(f"Update result: {result.modified_count} modified, {result.upserted_id}") 
            
            return Response({
                "message": "Profile updated successfully",
                "address": full_address,
                "address_fields": address_fields
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            #print(f"PUT Profile ERROR: {str(e)}")
            #print(traceback.format_exc())
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    
    def post(self, request):
        try:
            if not request.user or 'id' not in request.user:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
            user_id = request.user['id']
            data = request.data
            
            user_data = users_col.find_one({"_id": ObjectId(str(user_id))})
            if not user_data:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            
            current_password = data.get('current_password', '')
            if not current_password:
                return Response({"error": "Current password required"}, status=status.HTTP_400_BAD_REQUEST)
                
            if not verify_password(current_password, user_data.get('password')):
                return Response({"error": "Current password incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            
            
            new_password = data.get('new_password', '')
            confirm_password = data.get('confirm_password', '')
            
            if new_password != confirm_password:
                return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
            
            if len(new_password) < 6:
                return Response({"error": "New password must be at least 6 characters"}, status=status.HTTP_400_BAD_REQUEST)
            
            
            new_hashed = hash_password(new_password)
            users_col.update_one(
                {"_id": ObjectId(str(user_id))}, 
                {"$set": {"password": new_hashed, "updated_at": datetime.utcnow()}}
            )
            
            return Response({"message": "Password changed successfully"})
            
        except Exception as e:
            #print(f"Change Password ERROR: {str(e)}")
            #print(traceback.format_exc())
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





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

# Add to your utils or signup_logic file
#import random
#import string

#def generate_referral_code(length=8):
#    """Generate unique referral code like 'ABCD1234'"""
#    chars = string.ascii_uppercase + string.digits
#    code = ''.join(random.choices(chars, k=length))
#    return code











# ================== HEALTH CHECK ==================
def wake_up(request):
    return JsonResponse({"status": "backend awake"})


@api_view(['GET'])
@permission_classes([AllowAny])
def products_public(request):
    """Public read-only products endpoint for frontend runtime sync."""
    try:
        collection = get_products_collection()
        products = list(collection.find({}))
        for product in products:
            if "_id" in product:
                product["_id"] = str(product["_id"])
            if "id" in product:
                product["id"] = str(product["id"])

        return Response({"success": True, "data": products}, status=status.HTTP_200_OK)
    except Exception as exc:
        return Response(
            {"success": False, "data": [], "error": str(exc)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


# .............................................. SIGNUP ...............................................
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            phone = data.get("phone")
            password = data.get("password")
            name = data.get("name")
            email = data.get("email")
            referral_code = data.get("referralCode")
            
            print("📱 Signup request:", {
                "phone": phone[:4] + "****" if phone else None,
                "name": name,
                "has_referral": bool(referral_code)
            })

            user_id, user, tokens = signup_logic(
                data, phone, password, name, email, referral_code
            )
            
            return Response({
                "success": True,
                "user": {
                    "id": user_id,
                    "name": user["name"],
                    "phone": user["phone"],
                    "email": user.get("email"),
                    "points": user.get("points", 0), 
                    "referral_code": user.get("referral_code"),
                },
                "tokens": tokens,
            }, status=201)
            
        except ValueError as ve:
            print(f"Validation error: {str(ve)}")
            return Response({
                "success": False,
                "error": str(ve)
            }, status=400)
            
        except Exception as e:
            print(f"Signup error: {str(e)}")
            return Response({
                "success": False,
                "error": "Signup failed. Please try again."
            }, status=500)

        


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
                "referral_code": user.get("referral_code") or str(user["_id"]),
                "total_referrals": referrals_col.count_documents({"referrer_id": str(user["_id"])}),
            })
        except Exception as e:
            print("PROFILE ERROR:", e)
            return Response({"detail": "Invalid token"}, status=401)


# # .............................................. MY REFERRALS .................................................. 
class MyReferralsView(APIView):
    def get(self, request):
        try:
            auth = request.headers.get("Authorization")
            referrals = get_my_referrals(auth)  
            return Response(referrals, status=status.HTTP_200_OK)
            
        except Exception as e:
            print("REFERRAL VIEW ERROR:", e)
            return Response([], status=status.HTTP_200_OK)


# .................................................. LEADERBOARD ...................................................
class LeaderboardView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
            print('Leaderboard requested...')
            users_cursor = users_col.find().sort("points", -1).limit(50)
            return board(users_cursor)
            









# ................................................ Order placed with coin =.............................................
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def order_quote(request):
    try:
        auth_header = request.headers.get('Authorization')
        data = request.data

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)

        user_id = get_user_id_from_auth(auth_header)
        user = users_col.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=404)

        items = data.get("items", [])
        use_coins = bool(data.get("use_coins", False))
        payment_method = data.get("payment_method", "cod")
        coupon_code = data.get("coupon_code", "")
        quote = calculate_order_quote(
            items,
            user.get("points", 0),
            use_coins=use_coins,
            payment_method=payment_method,
            coupon_code=coupon_code,
        )

        return Response(
            {
                "success": True,
                "data": {
                    "points": user.get("points", 0),
                    "items_subtotal": quote["items_subtotal"],
                    "shipping_fee": quote["shipping_fee"],
                    "is_free_shipping": quote["is_free_shipping"],
                    "cart_total_with_shipping": quote["cart_total"],
                    "coupon_code": quote["coupon_code"],
                    "coupon_discount": quote["coupon_discount_value"],
                    "coupon_discount_rate": quote["coupon_discount_rate"],
                    "coupon_applied": quote["coupon_applied"],
                    "coupon_requested_code": quote["coupon_requested_code"],
                    "max_coins_allowed": quote["max_coins_allowed"],
                    "coins_used": quote["coins_used"],
                    "coin_discount": quote["coin_discount_value"],
                    "payment_surcharge": quote["payment_surcharge"],
                    "payment_surcharge_rate": quote["payment_surcharge_rate"],
                    "final_total": quote["final_total"],
                    "coin_value": quote["coin_value"],
                    "coin_percent": quote["coin_percent"],
                    "earned_points": quote["earned_points"],
                },
            },
            status=200,
        )
    except ValueError as ve:
        return Response({'error': str(ve)}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def create_order(request):
    try:
        auth_header = request.headers.get('Authorization')
        data = request.data
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)
        
        order_id, earned_points, new_points, quote = CreateOrderUser(
            auth_header, 
            data, 
            users_col, 
            orders_col
        )
        
        print(f"✅ Order {order_id} created! Earned: {earned_points}, New points: {new_points}")
        
        return Response({
            'order': {
                'id': order_id,
                'earnedPoints': earned_points,
                'summary': {
                    'items_subtotal': quote["items_subtotal"],
                    'shipping_fee': quote["shipping_fee"],
                    'cart_total_with_shipping': quote["cart_total"],
                    'coupon_code': quote["coupon_code"],
                    'coupon_discount': quote["coupon_discount_value"],
                    'coins_used': quote["coins_used"],
                    'coin_discount': quote["coin_discount_value"],
                    'payment_surcharge': quote["payment_surcharge"],
                    'payment_surcharge_rate': quote["payment_surcharge_rate"],
                    'final_total': quote["final_total"],
                }
            },
            'earnedPoints': earned_points,  
            'user': {
                'points': new_points         
            }
        }, status=201)
        
    except ValueError as ve:
        print(f"Validation error: {str(ve)}")
        return Response({'error': str(ve)}, status=400)
        
    except Exception as e:
        print(f"Order error: {str(e)}")
        print(f"Request data: {request.data}")
        return Response({
            'error': str(e),
            'detail': 'Order creation failed'
        }, status=500)


def _serialize_customer_order(order):
    created_at = order.get("created_at")
    if hasattr(created_at, "isoformat"):
        created_at = created_at.isoformat()

    raw_status_timeline = order.get("status_timeline") or {}
    status_timeline = {}
    if isinstance(raw_status_timeline, dict):
        for key, value in raw_status_timeline.items():
            normalized_key = "confirmed" if key == "paid" else key
            if hasattr(value, "isoformat"):
                status_timeline[normalized_key] = value.isoformat()
            elif isinstance(value, str):
                status_timeline[normalized_key] = value

    return {
        "id": order.get("order_id") or str(order.get("_id", "")),
        "_id": str(order.get("_id", "")),
        "items": [
            {
                "product": item.get("name", ""),
                "flavor": item.get("flavor", ""),
                "weight": item.get("weight", ""),
                "quantity": item.get("quantity", 1),
                "price": item.get("price", 0),
            }
            for item in order.get("order_items", [])
        ],
        "total": order.get("cash_paid", 0),
        "address": order.get("address", {}),
        "paymentMethod": order.get("payment_method", ""),
        "status": "confirmed" if order.get("status") == "paid" else order.get("status", "pending"),
        "createdAt": created_at,
        "statusTimeline": status_timeline,
        "shippingFee": order.get("shipping_fee", 0),
        "couponCode": order.get("coupon_code", ""),
        "couponDiscount": order.get("coupon_discount_value", 0),
        "coinsUsed": order.get("coins_used", 0),
        "earnedPoints": order.get("earned_points", 0),
    }


@api_view(['GET'])
def my_orders(request):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)

        user_id = get_user_id_from_auth(auth_header)
        orders = list(
            orders_col.find({"user_id": str(user_id)})
            .sort("created_at", -1)
        )

        return Response({
            "success": True,
            "data": [_serialize_customer_order(order) for order in orders],
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


MAX_SAVED_PRODUCTS_PER_USER = 10


def _get_authenticated_user_id(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise ValueError('Token required')
    return str(get_user_id_from_auth(auth_header))


def _safe_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _cart_item_key(item):
    return (
        str(item.get("product_id", "")),
        str(item.get("selected_flavor", "")),
        str(item.get("selected_weight", "")),
    )


def _serialize_cart_items(items):
    serialized = []
    for item in items:
        serialized.append({
            "productId": str(item.get("product_id", "")),
            "selectedFlavor": str(item.get("selected_flavor", "")),
            "selectedWeight": str(item.get("selected_weight", "")),
            "quantity": max(1, _safe_int(item.get("quantity"), 1)),
            "product": item.get("product", {}),
        })
    return serialized


def _cart_unique_product_count(items):
    return len({str(item.get("product_id", "")).strip() for item in items if str(item.get("product_id", "")).strip()})


def _cart_response_payload(items):
    return {
        "items": _serialize_cart_items(items),
        "product_count": _cart_unique_product_count(items),
        "max_products": MAX_SAVED_PRODUCTS_PER_USER,
    }


@api_view(['GET', 'DELETE'])
def cart_collection(request):
    try:
        user_id = _get_authenticated_user_id(request)

        if request.method == 'GET':
            cart_doc = carts_col.find_one({"user_id": user_id}) or {}
            items = cart_doc.get("items", [])
            if not isinstance(items, list):
                items = []
            return Response({"success": True, "data": _cart_response_payload(items)}, status=200)

        carts_col.update_one(
            {"user_id": user_id},
            {"$set": {"items": [], "updated_at": datetime.utcnow()}},
            upsert=True,
        )
        return Response({"success": True, "message": "Cart cleared", "data": _cart_response_payload([])}, status=200)

    except ValueError as ve:
        return Response({"success": False, "error": str(ve)}, status=401 if "Token" in str(ve) else 400)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)


@api_view(['POST', 'PATCH', 'DELETE'])
def cart_item(request):
    try:
        user_id = _get_authenticated_user_id(request)

        cart_doc = carts_col.find_one({"user_id": user_id}) or {}
        items = cart_doc.get("items", [])
        if not isinstance(items, list):
            items = []

        payload = request.data.get("item") if isinstance(request.data, dict) and "item" in request.data else request.data
        if not isinstance(payload, dict):
            payload = {}

        product_id = str(payload.get("productId") or payload.get("product_id") or "").strip()
        selected_flavor = str(payload.get("selectedFlavor") or payload.get("selected_flavor") or "")
        selected_weight = str(payload.get("selectedWeight") or payload.get("selected_weight") or "")

        if not product_id:
            return Response({"success": False, "error": "productId is required"}, status=400)

        target_index = next(
            (idx for idx, item in enumerate(items) if _cart_item_key(item) == (product_id, selected_flavor, selected_weight)),
            -1,
        )

        if request.method == 'POST':
            quantity = max(1, _safe_int(payload.get("quantity"), 1))
            product_snapshot = payload.get("product") if isinstance(payload.get("product"), dict) else {}

            if target_index >= 0:
                items[target_index]["quantity"] = max(1, _safe_int(items[target_index].get("quantity"), 1) + quantity)
                if product_snapshot:
                    items[target_index]["product"] = product_snapshot
            else:
                unique_products = {str(item.get("product_id", "")).strip() for item in items if str(item.get("product_id", "")).strip()}
                if product_id not in unique_products and len(unique_products) >= MAX_SAVED_PRODUCTS_PER_USER:
                    return Response(
                        {
                            "success": False,
                            "error": f"You can store only {MAX_SAVED_PRODUCTS_PER_USER} products in cart.",
                        },
                        status=400,
                    )
                items.append({
                    "product_id": product_id,
                    "selected_flavor": selected_flavor,
                    "selected_weight": selected_weight,
                    "quantity": quantity,
                    "product": product_snapshot,
                    "updated_at": datetime.utcnow(),
                })

        elif request.method == 'PATCH':
            quantity = _safe_int(payload.get("quantity"), 1)
            if target_index < 0:
                return Response({"success": False, "error": "Cart item not found"}, status=404)

            if quantity <= 0:
                items.pop(target_index)
            else:
                items[target_index]["quantity"] = quantity
                items[target_index]["updated_at"] = datetime.utcnow()

        else:  # DELETE
            if target_index >= 0:
                items.pop(target_index)

        carts_col.update_one(
            {"user_id": user_id},
            {"$set": {"items": items, "updated_at": datetime.utcnow()}},
            upsert=True,
        )

        return Response({"success": True, "data": _cart_response_payload(items)}, status=200)

    except ValueError as ve:
        return Response({"success": False, "error": str(ve)}, status=401 if "Token" in str(ve) else 400)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)


def _sanitize_wishlist_ids(product_ids):
    if not isinstance(product_ids, list):
        return []
    unique_ids = []
    seen = set()
    for product_id in product_ids:
        normalized = str(product_id).strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        unique_ids.append(normalized)
    return unique_ids


def _wishlist_response_payload(product_ids):
    normalized_ids = _sanitize_wishlist_ids(product_ids)
    return {
        "product_ids": normalized_ids,
        "product_count": len(normalized_ids),
        "max_products": MAX_SAVED_PRODUCTS_PER_USER,
    }


@api_view(['GET', 'DELETE'])
def wishlist_collection(request):
    try:
        user_id = _get_authenticated_user_id(request)

        if request.method == 'GET':
            wishlist_doc = wishlists_col.find_one({"user_id": user_id}) or {}
            product_ids = _sanitize_wishlist_ids(wishlist_doc.get("product_ids", []))
            return Response({"success": True, "data": _wishlist_response_payload(product_ids)}, status=200)

        wishlists_col.update_one(
            {"user_id": user_id},
            {"$set": {"product_ids": [], "updated_at": datetime.utcnow()}},
            upsert=True,
        )
        return Response({"success": True, "message": "Wishlist cleared", "data": _wishlist_response_payload([])}, status=200)

    except ValueError as ve:
        return Response({"success": False, "error": str(ve)}, status=401 if "Token" in str(ve) else 400)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)


@api_view(['POST', 'DELETE'])
def wishlist_item(request):
    try:
        user_id = _get_authenticated_user_id(request)
        payload = request.data if isinstance(request.data, dict) else {}
        product_id = str(payload.get("productId") or payload.get("product_id") or "").strip()

        if not product_id:
            return Response({"success": False, "error": "productId is required"}, status=400)

        wishlist_doc = wishlists_col.find_one({"user_id": user_id}) or {}
        product_ids = _sanitize_wishlist_ids(wishlist_doc.get("product_ids", []))

        if request.method == 'POST':
            if product_id in product_ids:
                return Response({"success": True, "data": _wishlist_response_payload(product_ids)}, status=200)

            if len(product_ids) >= MAX_SAVED_PRODUCTS_PER_USER:
                return Response(
                    {
                        "success": False,
                        "error": f"You can store only {MAX_SAVED_PRODUCTS_PER_USER} products in wishlist.",
                    },
                    status=400,
                )
            product_ids.append(product_id)

        else:  # DELETE
            product_ids = [pid for pid in product_ids if pid != product_id]

        wishlists_col.update_one(
            {"user_id": user_id},
            {"$set": {"product_ids": product_ids, "updated_at": datetime.utcnow()}},
            upsert=True,
        )

        return Response({"success": True, "data": _wishlist_response_payload(product_ids)}, status=200)

    except ValueError as ve:
        return Response({"success": False, "error": str(ve)}, status=401 if "Token" in str(ve) else 400)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)







# ................................................ profile_view .............................................

@api_view(['POST'])
def razorpay_create_order(request):
    try:
        auth_header = request.headers.get('Authorization')
        data = request.data

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)

        items = data.get('items', [])
        use_coins = bool(data.get('use_coins', False))
        coupon_code = data.get('coupon_code', '')

        user_id = get_user_id_from_auth(auth_header)
        user = users_col.find_one({'_id': ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=404)

        quote = calculate_order_quote(
            items,
            user.get('points', 0),
            use_coins=use_coins,
            payment_method='online',
            coupon_code=coupon_code,
        )
        amount_in_paise = int(round(quote['final_total'] * 100))

        key_id = getattr(settings, 'RAZORPAY_KEY_ID', None)
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
        if not key_id or not key_secret:
            return Response({'error': 'Razorpay keys are not configured.'}, status=500)

        payload = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'order_{uuid.uuid4().hex[:12]}',
            'payment_capture': 1,
        }

        response = requests.post(
            'https://api.razorpay.com/v1/orders',
            auth=(key_id, key_secret),
            json=payload,
        )

        if response.status_code not in (200, 201):
            return Response({'error': 'Failed to create Razorpay order', 'detail': response.text}, status=500)

        razorpay_data = response.json()
        return Response({
            'success': True,
            'razorpayOrderId': razorpay_data.get('id'),
            'amount': razorpay_data.get('amount'),
            'currency': razorpay_data.get('currency'),
            'keyId': key_id,
            'quote': {
                'final_total': quote['final_total'],
                'items_subtotal': quote['items_subtotal'],
                'shipping_fee': quote['shipping_fee'],
                'cart_total_with_shipping': quote['cart_total'],
                'coupon_code': quote['coupon_code'],
                'coupon_discount': quote['coupon_discount_value'],
                'coins_used': quote['coins_used'],
                'coin_discount': quote['coin_discount_value'],
                'payment_surcharge': quote['payment_surcharge'],
                'payment_surcharge_rate': quote['payment_surcharge_rate'],
            },
        }, status=201)

    except Exception as e:
        print(f"Razorpay create order error: {e}")
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def razorpay_verify_payment(request):
    try:
        auth_header = request.headers.get('Authorization')
        data = request.data

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token required'}, status=401)

        user_id = get_user_id_from_auth(auth_header)
        user = users_col.find_one({'_id': ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=404)

        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        items = data.get('items', [])
        use_coins = bool(data.get('use_coins', False))
        address = data.get('address', {})
        coupon_code = data.get('coupon_code', '')

        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return Response({'error': 'Razorpay payment details are required'}, status=400)

        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
        expected_signature = hmac.new(
            key_secret.encode('utf-8'),
            msg=f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
            digestmod=hashlib.sha256,
        ).hexdigest()

        if expected_signature != razorpay_signature:
            return Response({'error': 'Invalid Razorpay signature'}, status=400)

        order_id, earned_points, new_points, quote = CreateOrderUser(
            auth_header,
            {
                'items': items,
                'use_coins': use_coins,
                'payment_method': 'online',
                'address': address,
                'coupon_code': coupon_code,
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature,
            },
            users_col,
            orders_col,
        )

        return Response({
            'success': True,
            'order': {
                'id': order_id,
                'earnedPoints': earned_points,
                'summary': {
                    'items_subtotal': quote['items_subtotal'],
                    'shipping_fee': quote['shipping_fee'],
                    'cart_total_with_shipping': quote['cart_total'],
                    'coupon_code': quote['coupon_code'],
                    'coupon_discount': quote['coupon_discount_value'],
                    'coins_used': quote['coins_used'],
                    'coin_discount': quote['coin_discount_value'],
                    'payment_surcharge': quote['payment_surcharge'],
                    'payment_surcharge_rate': quote['payment_surcharge_rate'],
                    'final_total': quote['final_total'],
                },
            },
            'user': {'points': new_points},
        }, status=201)

    except Exception as e:
        print(f"Razorpay verify payment error: {e}")
        return Response({'error': str(e)}, status=500)


# ................................................ profile_view .............................................
@api_view(['GET'])
def profile_view(request):
    return ProfiView(request, users_col)





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





