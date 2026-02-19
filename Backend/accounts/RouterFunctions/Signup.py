from rest_framework.response import Response
from mongo.collections import users_col, referrals_col
from utils.password import hash_password, verify_password
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from utils.jwt import generate_tokens_for_user

def signup_logic(data, phone, password, name, email, referral_code) :
    print('coming...')
    if not phone or not password or not name:
        return Response({"detail": "Required fields missing"}, status=400)

    if users_col.find_one({"phone": phone}):
        return Response({"detail": "Phone already registered"}, status=400)


    user_doc = {
        "phone": phone,
        "email": email,
        "name": name,
        "password": hash_password(password),
        "points": 0,  
        "created_at": datetime.utcnow(),
    }
    result = users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    
    if referral_code:
        try:
            referrer = users_col.find_one({"_id": ObjectId(referral_code)})
        except InvalidId:
            referrer = None

        if referrer and str(referrer["_id"]) != user_id:
                
            users_col.update_one(
                {"_id": referrer["_id"]}, {"$inc": {"points": 4}}
            )
            users_col.update_one(
                {"_id": ObjectId(user_id)}, {"$inc": {"points": 2}}
            )

                
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

       
    tokens = generate_tokens_for_user(user_id)
    user = users_col.find_one({"_id": ObjectId(user_id)})
    #output = [user_id, name, phone, email, user.get("points", 0), tokens]
    username = user["name"]
    userphone = user["phone"]
    useremail = user.get("email")
    userGetPoins = user.get("points", 0)
    return user_id, user, tokens
