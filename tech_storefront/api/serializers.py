from rest_framework import serializers
from .models.user_models import User, Customer, Admin
from .models.product_models import Laptop, PC, TV, Phone, Accessory

# User serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = (
            'email', 'first_name', 'last_name', 'country', 'city', 'state', 'zip_code', 'street_address'
        )

class CreateCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = (
            'email', 'first_name', 'last_name', 'country', 'city', 'state', 'zip_code', 'street_address', 'password'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


# Product serializers
class LaptopSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)    
    type = serializers.SerializerMethodField()

    class Meta:
        model = Laptop
        fields = '__all__'

    def get_type(self, obj):
        return "laptop"

class PCSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = PC
        fields = '__all__'

    def get_type(self, obj):
        return "pc"

class TVSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = TV
        fields = '__all__'

    def get_type(self, obj):
        return "tv"

class PhoneSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Phone
        fields = '__all__'

    def get_type(self, obj):
        return "phone"

# class VideoGameSerializer(serializers.ModelSerializer):
#     image = serializers.ImageField(use_url=True)
#     type = serializers.SerializerMethodField()

#     class Meta:
#         model = Video_Game
#         fields = '__all__'

#     def get_type(self, obj):
#         return "video_game"