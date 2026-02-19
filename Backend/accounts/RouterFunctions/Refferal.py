from rest_framework.response import Response
from utils.jwt_helper import decode_token
from mongo.collections import referrals_col


def refferalsLogic(auth) :
    if not auth or not auth.startswith("Bearer "):
        return Response([], status=200)
    token = auth.replace("Bearer ", "")
    payload = decode_token(token)

    referrals = referrals_col.find({"referrer_id": payload["user_id"]})
    return referrals