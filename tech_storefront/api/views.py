from rest_framework import status
from .models.user_models import Customer, Admin
from .serializers import CreateCustomerSerializer, CustomerSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from .models.product_models import Laptop, PC, TV, Phone
from .serializers import LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer
from django.db.models import Q
from rest_framework.decorators import api_view

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
        search = request.GET.get('search', '').strip().lower()
        laptops = Laptop.objects.all()
        pcs = PC.objects.all()
        tvs = TV.objects.all()
        phones = Phone.objects.all()

        type_keywords = {
            "laptop": laptops,
            "pc": pcs,
            "tv": tvs,
            "phone": phones,
        }

        # Split search into words and check for type keyword
        search_words = search.split()
        matched_type = None
        for word in search_words:
            if word in type_keywords:
                matched_type = word
                break

        # If a type keyword is present, filter only that type with the rest of the search
        if matched_type:
            # Remove the type keyword from the search string
            rest_search = " ".join(w for w in search_words if w != matched_type).strip()
            query = (
                Q(name__icontains=rest_search) |
                Q(description__icontains=rest_search) |
                Q(brand__icontains=rest_search)
            ) if rest_search else Q()  # If no other search, match all

            # Set all others to none
            laptops = laptops.none()
            pcs = pcs.none()
            tvs = tvs.none()
            phones = phones.none()

            if matched_type == "laptop":
                laptops = Laptop.objects.filter(query)
            elif matched_type == "pc":
                pcs = PC.objects.filter(query)
            elif matched_type == "tv":
                tvs = TV.objects.filter(query)
            elif matched_type == "phone":
                phones = Phone.objects.filter(query)
        elif search:
            laptop_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            pc_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            tv_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            phone_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )

            laptops = laptops.filter(laptop_query)
            pcs = pcs.filter(pc_query)
            tvs = tvs.filter(tv_query)
            phones = phones.filter(phone_query)

        laptops = LaptopSerializer(laptops, many=True).data
        pcs = PCSerializer(pcs, many=True).data
        tvs = TVSerializer(tvs, many=True).data
        phones = PhoneSerializer(phones, many=True).data

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

@api_view(['GET'])
def product_suggestions(request):
    q = request.GET.get('q', '').strip()
    suggestions = set()

    if q:
        # You can add more models or fields as needed
        suggestions.update(Laptop.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(PC.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(TV.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(Phone.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        # Optionally add brand suggestions:
        suggestions.update(Laptop.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(PC.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(TV.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(Phone.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])

    # Remove empty strings and return as a list
    return Response([s for s in suggestions if s])