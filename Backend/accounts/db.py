"""
MongoDB connection manager using pymongo.
Provides a singleton database connection.
"""

from pymongo import MongoClient
from django.conf import settings


class MongoDB:
    """Singleton MongoDB connection."""
    _client = None
    _db = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
            )
        return cls._client

    @classmethod
    def get_db(cls):
        if cls._db is None:
            client = cls.get_client()
            cls._db = client[settings.MONGODB_NAME]
        return cls._db

    @classmethod
    def get_collection(cls, collection_name):
        db = cls.get_db()
        return db[collection_name]

    @classmethod
    def close(cls):
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None


# Shortcut functions
def get_users_collection():
    return MongoDB.get_collection('users')


def get_referrals_collection():
    return MongoDB.get_collection('referrals')


def get_orders_collection():
    return MongoDB.get_collection('orders')


def get_products_collection():
    return MongoDB.get_collection('products')


def get_admins_collection():
    return MongoDB.get_collection('admins')
