from rest_framework import serializers
from .models.user_models import User, Customer, Admin
from .models.product_models import Laptop, PC, TV, Phone, Accessory, Video_Game, Console
from .models.cart_models import Cart_Includes, WishlistItem
from .models.review_models import Review

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

class VideoGameSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Video_Game
        fields = '__all__'

    def get_type(self, obj):
        return "video_game"
    
class ConsoleSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Console
        fields = '__all__'

    def get_type(self, obj):
        return "console"

class AccessorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    type = serializers.SerializerMethodField()

    class Meta:
        model = Accessory
        fields = '__all__'

    def get_type(self, obj):
        return "accessory"

# Cart serializers
class CartItemSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product_type = serializers.SerializerMethodField()

    class Meta:
        model = Cart_Includes
        fields = ['object_id', 'quantity', 'name', 'price', 'product_type']
    
    def get_product_name(self, obj):
        return obj.product.name if obj.product else ""

    def get_product_price(self, obj):
        return obj.product.price if obj.product else 0
    
    def get_product_type(self, obj):
        return obj.content_type.model

# Review serializer
class ReviewSerializer(serializers.ModelSerializer):
    customer_first_name = serializers.CharField(source="customer.first_name", read_only=True)
    customer_last_name = serializers.CharField(source="customer.last_name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "review_text",
            "rating",
            "customer_first_name",
            "customer_last_name",
            "product_type",
            "product_id",
        ]

class WishlistItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    product_type = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = ['object_id', 'product_type', 'name', 'description', 'price', 'image']

    def get_product(self, obj):
        model = obj.content_type.model_class()
        return model.objects.get(id=obj.object_id)

    def get_name(self, obj):
        return self.get_product(obj).name

    def get_description(self, obj):
        return self.get_product(obj).description

    def get_price(self, obj):
        return self.get_product(obj).price

    def get_image(self, obj):
        product = self.get_product(obj)
        return product.image.url if product.image else None

    def get_product_type(self, obj):
        return obj.content_type.model