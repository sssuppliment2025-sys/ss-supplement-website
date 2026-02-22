from utils.jwt_helper import decode_token
from bson import ObjectId
from datetime import datetime
import uuid
import math

def CreateOrderUser(auth_header, data, users_collection, orders_collection):
    try:
        # -------- AUTH --------
        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        user_id = payload["user_id"]

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")

        # -------- VALIDATE INPUT --------
        items = data.get("items", [])
        coins_used = int(data.get("coins_used", 0))  # Frontend sends flexible amount
        total_paid = float(data.get("total", 0))
        
        if not items:
            raise ValueError("No items in order")

        # -------- CALCULATE SUBTOTAL --------
        subtotal = sum(
            float(i["price"]) * int(i["quantity"])
            for i in items
        )

        # -------- ✅ FLEXIBLE 4% MAX COINS --------
        MAX_COIN_PERCENT = 0.04  # MAXIMUM 4%
        COIN_VALUE = 0.2
        
        max_coin_discount_value = subtotal * MAX_COIN_PERCENT  # ₹224.24 max
        max_coins_allowed = math.floor(max_coin_discount_value / COIN_VALUE)  # 1121 max
        
        # ✅ ACCEPT 0 to MAX coins (flexible)
        if coins_used < 0 or coins_used > max_coins_allowed:
            raise ValueError(f"Coins must be 0-{max_coins_allowed} (max 4% = ₹{max_coin_discount_value:.0f})")
        
        # ✅ Validate total matches coins used
        expected_total = subtotal - (coins_used * COIN_VALUE)
        if abs(total_paid - expected_total) > 0.01:  # Allow tiny float diff
            raise ValueError(f"Total mismatch. Expected ₹{expected_total:.2f}, got ₹{total_paid}")

        # ✅ Check user has enough coins
        if user.get("points", 0) < coins_used:
            raise ValueError(f"Insufficient coins. Need {coins_used}, have {user.get('points', 0)}")

        # -------- DEDUCT COINS --------
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"points": -coins_used}}  # ✅ Use actual coins_used
        )

        # -------- ORDER ID --------
        order_id = str(uuid.uuid4())[:8].upper()

        # -------- ORDER ITEMS --------
        order_items = []
        for item in items:
            order_items.append({
                "product_id": str(item.get("productId")),
                "name": item.get("name"),
                "price": float(item.get("price")),
                "quantity": int(item.get("quantity")),
                "total": float(item.get("price")) * int(item.get("quantity")),
                "flavor": item.get("selectedFlavor", "N/A"),
                "weight": item.get("selectedWeight", "N/A"),
            })

        # -------- COINS EARNED (SAME AS USED) --------
        earned_coins = 0  # ✅ Flexible earned coins

        # -------- SAVE ORDER --------
        orders_collection.insert_one({
            "_id": ObjectId(),
            "order_id": order_id,
            "user_id": user_id,
            "subtotal": subtotal,
            "coins_used": coins_used,  # ✅ Flexible amount
            "coin_discount_value": coins_used * COIN_VALUE,
            "cash_paid": total_paid,
            "earned_points": earned_coins,
            "order_items": order_items,
            "payment_method": data.get("payment_method", "cod"),
            "utr_number": data.get("utr_number"),
            "address": data.get("address", {}),
            "status": "pending",
            "created_at": datetime.utcnow()
        })

        # -------- ADD EARNED COINS BACK --------
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"points": earned_coins}}
        )

        # -------- RETURN UPDATED USER POINTS --------
        final_user = users_collection.find_one({"_id": ObjectId(user_id)})
        final_points = final_user["points"] if final_user else user.get("points", 0)

        return {
            "order_id": order_id,
            "earnedPoints": earned_coins,  # ✅ Frontend expects this
            "new_points": final_points     # ✅ Frontend expects this
        }

    except Exception as e:
        print("Order Error:", str(e))
        raise ValueError(str(e))
