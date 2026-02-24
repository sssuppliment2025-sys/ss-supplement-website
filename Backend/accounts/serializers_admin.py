"""Serializers used by admin MongoDB CRUD views."""

from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(required=False, allow_blank=True, default="default123")
    points = serializers.IntegerField(required=False, default=0)
    referral_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class UserUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True)
    points = serializers.IntegerField(required=False)
    referral_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class ReferralSerializer(serializers.Serializer):
    referrer_id = serializers.CharField(required=False, allow_blank=True)
    referred_user = serializers.DictField(required=False)
    status = serializers.CharField(required=False, allow_blank=True)


class ReferralUpdateSerializer(serializers.Serializer):
    referrer_id = serializers.CharField(required=False, allow_blank=True)
    referred_user = serializers.DictField(required=False)
    status = serializers.CharField(required=False, allow_blank=True)


class OrderSerializer(serializers.Serializer):
    order_id = serializers.CharField(required=False, allow_blank=True)
    user_id = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(required=False)
    address = serializers.DictField(required=False)
    payment_method = serializers.CharField(required=False, allow_blank=True)
    status = serializers.CharField(required=False, allow_blank=True, default="pending")
    cash_paid = serializers.FloatField(required=False, default=0)


class OrderUpdateSerializer(serializers.Serializer):
    order_id = serializers.CharField(required=False, allow_blank=True)
    user_id = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(required=False)
    address = serializers.DictField(required=False)
    payment_method = serializers.CharField(required=False, allow_blank=True)
    status = serializers.CharField(required=False, allow_blank=True)
    cash_paid = serializers.FloatField(required=False)


class ProductSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(max_length=250)
    brand = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    inStock = serializers.BooleanField(required=False, default=True)
    price = serializers.FloatField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)


class ProductUpdateSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(max_length=250, required=False, allow_blank=True)
    brand = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    inStock = serializers.BooleanField(required=False)
    price = serializers.FloatField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
