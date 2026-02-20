from utils.jwt_helper import decode_token
from bson import ObjectId
from datetime import datetime
import uuid

def CreateOrderUser(auth_header, data, users_collection, orders_collection):
    """
    FIXED: Always returns tuple (order_id, earned_points, new_points)
    No Response objects inside this function!
    """
    try:
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        user_id = payload['user_id']
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError('User not found')
        
        
        subtotal = sum(float(item.get('price', 0)) * int(item.get('quantity', 0)) for item in data.get('items', []))
        coins_used = float(data.get('coins_used', 0))
        final_total = float(data.get('total', 0))

       
        min_cash_payment = max(subtotal * 0.2, 50)
        if final_total < min_cash_payment:
            raise ValueError(f'Minimum 20% cash payment required. Min: ₹{int(min_cash_payment)}, Got: ₹{int(final_total)}')

        
        max_coins_allowed = subtotal * 0.8
        if coins_used > max_coins_allowed:
            raise ValueError(f'Maximum 80% coins allowed. Max: ₹{int(max_coins_allowed)}, Requested: ₹{int(coins_used)}')

       
        current_points = user.get('points', 0)
        if coins_used > 0:
            if current_points < coins_used:
                raise ValueError(f'Insufficient coins. Available: {int(current_points)}, Required: {int(coins_used)}')
            
           
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"points": -coins_used}}
            )
        
     
        updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
        new_points_after_deduction = int(updated_user.get('points', 0))
        
       
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
        
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"points": earned_points}}  
        )
        
        
        final_user = users_collection.find_one({"_id": ObjectId(user_id)})
        final_points = int(final_user.get('points', 0))
        
        print(f"Order created: {order_id}")
        print(f"Subtotal: ₹{subtotal}, Coins Used: ₹{coins_used}, Final: ₹{final_total}")
        print(f"Points: Before={int(current_points)}, After Deduction={new_points_after_deduction}, Earned=+{earned_points}, Final={final_points}")
        
       
        return order_id, earned_points, final_points
        
    except Exception as e:
        print(f"CreateOrderUser error: {str(e)}")
        raise e 
