from rest_framework import status
from .models.user_models import Customer, Admin
from .models.cart_models import Cart_Includes
from .serializers import CreateCustomerSerializer, CustomerSerializer, UserSerializer, CartItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models.product_models import Laptop, PC, TV, Phone, Console, Video_Game, Accessory
from .serializers import LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer, ConsoleSerializer, AccessorySerializer, VideoGameSerializer
from django.db.models import Q
from rest_framework.decorators import api_view

PRODUCT_MODEL_MAP = {
    "laptop": (Laptop, LaptopSerializer),
    "pc": (PC, PCSerializer),
    "tv": (TV, TVSerializer),
    "phone": (Phone, PhoneSerializer),
    "console": (Console, ConsoleSerializer),
    "video_game": (Video_Game, VideoGameSerializer),
    "accessory": (Accessory, AccessorySerializer)
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
        consoles = Console.objects.all()
        video_games = Video_Game.objects.all()
        accessories = Accessory.objects.all()

        type_keywords = {
            "laptop": laptops,
            "pc": pcs,
            "tv": tvs,
            "phone": phones,
            "console": consoles,
            "video_game": video_games,
            "accessory": accessories
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
            video_games = video_games.none()
            consoles = consoles.none()
            accessories = accessories.none()

            if matched_type in ("laptop", "laptops"):
                laptops = Laptop.objects.filter(query)
            elif matched_type in ("pc", "pcs"):
                pcs = PC.objects.filter(query)
            elif matched_type in ("tv", "tvs"):
                tvs = TV.objects.filter(query)
            elif matched_type in ("phone", "phones"):
                phones = Phone.objects.filter(query)
            elif matched_type in ("console", "consoles"):
                consoles = Console.objects.filter(query)
            elif matched_type in ("video game", "video games", "game", "games"):
                video_games = Video_Game.objects.filter(query)
            elif matched_type in ("accessory", "accessories"):
                accessories = Accessory.objects.filter(query)
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
            console_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            accessory_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            video_game_query = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search) |
                Q(genre__icontains=search)
            )

            laptops = laptops.filter(laptop_query)
            pcs = pcs.filter(pc_query)
            tvs = tvs.filter(tv_query)
            phones = phones.filter(phone_query)
            consoles = Console.objects.filter(console_query)
            video_games = Video_Game.objects.filter(video_game_query)
            accessories = Accessory.objects.filter(accessory_query)

        laptops = LaptopSerializer(laptops, many=True).data
        pcs = PCSerializer(pcs, many=True).data
        tvs = TVSerializer(tvs, many=True).data
        phones = PhoneSerializer(phones, many=True).data
        consoles = ConsoleSerializer(consoles, many=True).data
        video_games = VideoGameSerializer(video_games, many=True).data
        accessories = AccessorySerializer(accessories, many=True).data

        products = (
            [{"type": "laptop", **item} for item in laptops] +
            [{"type": "pc", **item} for item in pcs] +
            [{"type": "tv", **item} for item in tvs] +
            [{"type": "phone", **item} for item in phones] +
            [{"type": "console", **item} for item in consoles] +
            [{"type": "video_game", **item} for item in video_games] +
            [{"type": "accessory", **item} for item in accessories]
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
        suggestions.update(Laptop.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(PC.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(TV.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(Phone.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(Console.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(Video_Game.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])
        suggestions.update(Accessory.objects.filter(name__icontains=q).values_list('name', flat=True)[:5])

        suggestions.update(Laptop.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(PC.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(TV.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(Phone.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(Console.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(Video_Game.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])
        suggestions.update(Accessory.objects.filter(brand__icontains=q).values_list('brand', flat=True)[:5])

    # Remove empty strings and return as a list
    return Response([s for s in suggestions if s])

class CartView(APIView):

    def get(self, request):
        customer_email = request.user_email
        cart_items = Cart_Includes.objects.filter(customer_email=customer_email)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        cart_item, created = Cart_Includes.objects.get_or_create(
            customer_email=data["user_email"],
            product_id=data["product_id"],
            defaults={
                "quantity": data["quantity"],
            },
        )
        if not created:
            cart_item.quantity += data["quantity"]
            cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        customer_email = request.user_email
        product_id = request.product_id
        Cart_Includes.objects.filter(customer_email=customer_email, product_id=product_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)