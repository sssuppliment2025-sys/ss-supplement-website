from pymongo import MongoClient
from django.conf import settings

client = MongoClient(settings.MONGO_URI)
db = client[str(settings.MONGO_DB_NAME)] 

users_col = db["users"]
referrals_col = db["referrals"]
otps_col = db["otps"]  
orders_col = db["orders"]
