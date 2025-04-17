from rest_framework import status
from .models.user_models import Customer, Admin
from .serializers import CreateCustomerSerializer, CustomerSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from .models.product_models import Laptop, PC, TV, Phone
from .serializers import LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer

PRODUCT_MODEL_MAP = {
    "laptop": (Laptop, LaptopSerializer),
    "pc": (PC, PCSerializer),
    "tv": (TV, TVSerializer),
    "phone": (Phone, PhoneSerializer),
}

# Create your views here.
class CustomerRegistrationView(APIView):
    def post(self, request):
        serializer = CreateCustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerSignInView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        # make sure the user is a customer
        if user is not None and Customer.objects.filter(email=user.email).exists():
            login(request, user) # create a new session
            return Response({'message': 'Sign in successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminSignInView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        # Check if user is an instance of Admin
        if user is not None and Admin.objects.filter(email=user.email).exists():
            return Response({'message': 'Admin sign in successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            # If the user is a customer, return full customer info
            if Customer.objects.filter(email=request.user.email).exists():
                customer = Customer.objects.get(email=request.user.email)
                return Response(CustomerSerializer(customer).data)
            # Otherwise, return basic user info
            return Response(UserSerializer(request.user).data)
        return Response({"email": None})

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": True})

class AllProductsView(APIView):
    def get(self, request):
        laptops = LaptopSerializer(Laptop.objects.all(), many=True).data
        pcs = PCSerializer(PC.objects.all(), many=True).data
        tvs = TVSerializer(TV.objects.all(), many=True).data
        phones = PhoneSerializer(Phone.objects.all(), many=True).data
        # Combine all products into one list
        products = (
            [{"type": "laptop", **item} for item in laptops] +
            [{"type": "pc", **item} for item in pcs] +
            [{"type": "tv", **item} for item in tvs] +
            [{"type": "phone", **item} for item in phones]
        )
        return Response(products)

class ProductDetailView(APIView):
    def get(self, request, type, id):
        type = type.lower()
        if type not in PRODUCT_MODEL_MAP:
            return Response({"detail": "Invalid product type."}, status=status.HTTP_404_NOT_FOUND)
        Model, Serializer = PRODUCT_MODEL_MAP[type]
        try:
            product = Model.objects.get(id=id)
        except Model.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(Serializer(product).data)