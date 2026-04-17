from datetime import datetime
import math
import uuid
from bson import ObjectId

from utils.jwt_helper import decode_token
from accounts.coupon_codes import (
    COUPON_DISCOUNT_RATE,
    COUPON_FLAT_DISCOUNT,
    COUPON_FLAT_DISCOUNT_THRESHOLD,
    is_valid_coupon_code,
    normalize_coupon_code,
)


SHIPPING_THRESHOLD = 0 #//shipping fee
SHIPPING_FEE = 50
RAZORPAY_FEE_RATE = 0.020
COIN_PERCENT = 0.04
COIN_VALUE = 0.2
EARN_PERCENT = 0.04


def _to_float(value, fallback=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def _to_int(value, fallback=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def calculate_order_quote(items, user_points, use_coins=False, payment_method="cod", coupon_code=""):
    if not items:
        raise ValueError("No items in order")

    normalized_items = []
    actual_subtotal = 0.0

    for item in items:
        price = _to_float(item.get("price"))
        quantity = max(1, _to_int(item.get("quantity"), 1))
        line_total = round(price * quantity, 2)
        actual_subtotal += line_total

        normalized_items.append(
            {
                "product_id": str(item.get("productId") or item.get("product_id") or ""),
                "name": item.get("name", ""),
                "price": round(price, 2),
                "quantity": quantity,
                "total": line_total,
                "flavor": item.get("selectedFlavor") or item.get("flavor") or "N/A",
                "weight": item.get("selectedWeight") or item.get("weight") or "N/A",
            }
        )

    actual_subtotal = round(actual_subtotal, 2)
    shipping_fee = 0.0 if actual_subtotal >= SHIPPING_THRESHOLD else SHIPPING_FEE
    cart_total = round(actual_subtotal + shipping_fee, 2)

    normalized_coupon_code = normalize_coupon_code(coupon_code)
    is_coupon_applied = is_valid_coupon_code(normalized_coupon_code)
    if is_coupon_applied:
        if cart_total > COUPON_FLAT_DISCOUNT_THRESHOLD:
            coupon_discount_value = float(COUPON_FLAT_DISCOUNT)
        else:
            coupon_discount_value = round(cart_total * COUPON_DISCOUNT_RATE, 2)
    else:
        coupon_discount_value = 0.0

    max_coin_discount_value = round(cart_total * COIN_PERCENT, 2)
    max_coins_allowed = math.floor(max_coin_discount_value / COIN_VALUE)

    coins_used = min(max(user_points, 0), max_coins_allowed) if use_coins else 0
    coin_discount_value = round(coins_used * COIN_VALUE, 2)
    subtotal_after_discount = round(max(cart_total - coupon_discount_value - coin_discount_value, 0.0), 2)
    payment_surcharge = (
        round(subtotal_after_discount * RAZORPAY_FEE_RATE, 2)
        if payment_method == "online"
        else 0.0
    )
    final_total = round(subtotal_after_discount + payment_surcharge, 2)

    earned_points = math.floor((actual_subtotal * EARN_PERCENT) / COIN_VALUE)

    return {
        "items_subtotal": actual_subtotal,
        "shipping_fee": round(shipping_fee, 2),
        "is_free_shipping": shipping_fee == 0.0,
        "cart_total": cart_total,
        "coupon_code": normalized_coupon_code if is_coupon_applied else "",
        "coupon_requested_code": normalized_coupon_code,
        "coupon_applied": is_coupon_applied,
        "coupon_discount_rate": COUPON_DISCOUNT_RATE,
        "coupon_flat_discount": COUPON_FLAT_DISCOUNT,
        "coupon_flat_discount_threshold": COUPON_FLAT_DISCOUNT_THRESHOLD,
        "coupon_discount_value": coupon_discount_value,
        "max_coins_allowed": max_coins_allowed,
        "coins_used": coins_used,
        "coin_value": COIN_VALUE,
        "coin_percent": COIN_PERCENT,
        "coin_discount_value": coin_discount_value,
        "payment_surcharge": payment_surcharge,
        "payment_surcharge_rate": RAZORPAY_FEE_RATE,
        "final_total": final_total,
        "earned_points": earned_points,
        "normalized_items": normalized_items,
    }


def get_user_id_from_auth(auth_header):
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    return payload["user_id"]


def CreateOrderUser(auth_header, data, users_collection, orders_collection):
    try:
        user_id = get_user_id_from_auth(auth_header)

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")

        items = data.get("items", [])
        use_coins = bool(data.get("use_coins", False))
        coupon_code = data.get("coupon_code", "")

        payment_method = data.get("payment_method", "cod")
        quote = calculate_order_quote(
            items,
            user.get("points", 0),
            use_coins=use_coins,
            payment_method=payment_method,
            coupon_code=coupon_code,
        )
        coins_used = quote["coins_used"]
        earned_points = quote["earned_points"]

        if coins_used > 0:
            deduct_result = users_collection.update_one(
                {"_id": ObjectId(user_id), "points": {"$gte": coins_used}},
                {"$inc": {"points": -coins_used}},
            )
            if deduct_result.modified_count == 0:
                raise ValueError("Insufficient coins balance")

        order_id = str(uuid.uuid4())[:8].upper()

        order_status = "confirmed" if payment_method == "online" else "pending"
        created_at = datetime.utcnow()

        orders_collection.insert_one(
            {
                "_id": ObjectId(),
                "order_id": order_id,
                "user_id": user_id,
                "actual_subtotal": quote["items_subtotal"],
                "shipping_fee": quote["shipping_fee"],
                "cart_total": quote["cart_total"],
                "coupon_code": quote["coupon_code"],
                "coupon_discount_value": quote["coupon_discount_value"],
                "coins_used": coins_used,
                "coin_discount_value": quote["coin_discount_value"],
                "payment_surcharge": quote["payment_surcharge"],
                "cash_paid": quote["final_total"],
                "earned_points": earned_points,
                "order_items": quote["normalized_items"],
                "payment_method": payment_method,
                "utr_number": data.get("utr_number"),
                "razorpay_order_id": data.get("razorpay_order_id"),
                "razorpay_payment_id": data.get("razorpay_payment_id"),
                "razorpay_signature": data.get("razorpay_signature"),
                "address": data.get("address", {}),
                "status": order_status,
                "status_timeline": {
                    order_status: created_at,
                },
                "created_at": created_at,
            }
        )

        if earned_points > 0:
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"points": earned_points}},
            )

        final_user = users_collection.find_one({"_id": ObjectId(user_id)})
        final_points = final_user.get("points", 0) if final_user else 0

        return order_id, earned_points, final_points, quote

    except Exception as e:
        raise ValueError(str(e))
