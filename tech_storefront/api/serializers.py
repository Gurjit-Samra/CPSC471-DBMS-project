from rest_framework import serializers
from .models.user_models import User, Customer, Admin
from .models.product_models import Laptop, PC, TV, Phone, Video_Game, Console, Accessory

# User serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('email', 'country', 'city', 'state', 'zip_code', 'street_address')

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


# Product serializers
class LaptopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laptop
        fields = '__all__'

class PCSerializer(serializers.ModelSerializer):
    class Meta:
        model = PC
        fields = '__all__'

class TVSerializer(serializers.ModelSerializer):
    class Meta:
        model = TV
        fields = '__all__'

class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = '__all__'