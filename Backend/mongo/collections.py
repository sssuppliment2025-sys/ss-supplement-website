from pymongo import MongoClient
from django.conf import settings

client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[settings.MONGO_DB_NAME]

users_col = db["users"]
referrals_col = db["referrals"]
otps_col = db["otps"]  
orders_col = db["orders"]
user_addresses_col = db['user_address']
carts_col = db["carts"]
wishlists_col = db["wishlists"]
