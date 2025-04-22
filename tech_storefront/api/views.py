import os
import json
import requests

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import authenticate, login, logout
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.db.models import Count, F, Q, Sum, OuterRef, Subquery, IntegerField
from django.db.models.functions import TruncDate, Coalesce
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models.cart_models import Cart_Includes, WishlistItem
from .models.order_models import Order, OrderItem
from .models.product_models import (
    Accessory,
    Console,
    DiscountedProduct,
    Laptop,
    PC,
    Phone,
    TV,
    Video_Game,
    ProductViewHistory,
)
from .models.review_models import Review
from .models.user_models import Admin, Customer
from .models.site_settings import SiteSettings

from .serializers import (
    AccessorySerializer,
    CartItemSerializer,
    ConsoleSerializer,
    CreateCustomerSerializer,
    CustomerSerializer,
    LaptopSerializer,
    OrderItemSerializer,
    OrderSerializer,
    PCSerializer,
    PhoneSerializer,
    ReviewSerializer,
    TVSerializer,
    UserSerializer,
    VideoGameSerializer,
    WishlistItemSerializer,
)

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

"""
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
            login(request, user) # create a new session
            return Response({'message': 'Admin sign in successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)
"""
        
class SignInView(APIView):
    """
    Unified sign-in: works for both Customer and Admin
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Sign in successful'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class CurrentUserView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"email": None})

        user = request.user

        # Check if they're a Customer (based on your custom Customer model).
        # If so, return detailed customer info.
        if Customer.objects.filter(email=user.email).exists():
            customer = Customer.objects.get(email=user.email)
            data = CustomerSerializer(customer).data
        else:
            # Otherwise, just use the basic user fields
            data = UserSerializer(user).data

        # Add these so the frontend knows if they’re staff or superuser
        data["is_staff"] = user.is_staff
        data["is_superuser"] = user.is_superuser

        return Response(data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": True})

class AllProductsView(APIView):
    def get(self, request):

        search = request.GET.get('search', '').strip().lower()

        brand_filter = request.GET.get('brand', '').strip()
        price_min = request.GET.get('price_min', '').strip()
        price_max = request.GET.get('price_max', '').strip()
        ram_filter = request.GET.get('ram', '').strip()
        screen_size_filter = request.GET.get('screen_size', '').strip()

        laptops = Laptop.objects.all()
        pcs = PC.objects.all()
        tvs = TV.objects.all()
        phones = Phone.objects.all()
        consoles = Console.objects.all()
        video_games = Video_Game.objects.all()
        accessories = Accessory.objects.all()

        search_words = search.split()
        matched_type = None
        type_keywords = {
            "laptop": laptops,
            "pc": pcs,
            "tv": tvs,
            "phone": phones,
            "console": consoles,
            "video_game": video_games,
            "accessory": accessories
        }
        for word in search_words:
            if word in type_keywords:
                matched_type = word
                break

        if matched_type:
            rest_search = " ".join([w for w in search_words if w != matched_type]).strip()
            query = (
                Q(name__icontains=rest_search) |
                Q(description__icontains=rest_search) |
                Q(brand__icontains=rest_search)
            ) if rest_search else Q()

            laptops = laptops.none()
            pcs = pcs.none()
            tvs = tvs.none()
            phones = phones.none()
            consoles = consoles.none()
            video_games = video_games.none()
            accessories = accessories.none()

            if matched_type == "laptop":
                laptops = Laptop.objects.filter(query)
            elif matched_type == "pc":
                pcs = PC.objects.filter(query)
            elif matched_type == "tv":
                tvs = TV.objects.filter(query)
            elif matched_type == "phone":
                phones = Phone.objects.filter(query)
            elif matched_type == "console":
                consoles = Console.objects.filter(query)
            elif matched_type == "video_game":
                video_games = Video_Game.objects.filter(query)
            elif matched_type == "accessory":
                accessories = Accessory.objects.filter(query)

        elif search:
            common_q = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(brand__icontains=search)
            )
            video_game_q = common_q | Q(genre__icontains=search)

            laptops = laptops.filter(common_q)
            pcs = pcs.filter(common_q)
            tvs = tvs.filter(common_q)
            phones = phones.filter(common_q)
            consoles = consoles.filter(common_q)
            video_games = video_games.filter(video_game_q)
            accessories = accessories.filter(common_q)

        if brand_filter:
            brand_list = [b.strip() for b in brand_filter.split(",") if b.strip()]

            if "All" not in brand_list and len(brand_list) > 0:
                from django.db.models import Q

                brand_q = Q()
                for brand_item in brand_list:
                    brand_q |= Q(brand__iexact=brand_item)

                laptops = laptops.filter(brand_q)
                pcs = pcs.filter(brand_q)
                phones = phones.filter(brand_q)
                tvs = tvs.filter(brand_q)
                consoles = consoles.filter(brand_q)
                video_games = video_games.filter(brand_q)
                accessories = accessories.filter(brand_q)

        if price_min.isdigit():
            price_min_val = float(price_min)
            laptops = laptops.filter(price__gte=price_min_val)
            pcs = pcs.filter(price__gte=price_min_val)
            tvs = tvs.filter(price__gte=price_min_val)
            phones = phones.filter(price__gte=price_min_val)
            consoles = consoles.filter(price__gte=price_min_val)
            video_games = video_games.filter(price__gte=price_min_val)
            accessories = accessories.filter(price__gte=price_min_val)

        if price_max.isdigit():
            price_max_val = float(price_max)
            laptops = laptops.filter(price__lte=price_max_val)
            pcs = pcs.filter(price__lte=price_max_val)
            tvs = tvs.filter(price__lte=price_max_val)
            phones = phones.filter(price__lte=price_max_val)
            consoles = consoles.filter(price__lte=price_max_val)
            video_games = video_games.filter(price__lte=price_max_val)
            accessories = accessories.filter(price__lte=price_max_val)

        if ram_filter.isdigit():
            ram_val = int(ram_filter)
            # apply only to laptops/pcs:
            laptops = laptops.filter(ram__gte=ram_val)
            pcs = pcs.filter(ram__gte=ram_val)

        if screen_size_filter.isdigit():
            screen_val = int(screen_size_filter)
            # apply to phones & tvs (or whichever you want):
            phones = phones.filter(screen_size__gte=screen_val)
            tvs = tvs.filter(screen_size__gte=screen_val)

        # Serialize all
        laptops_data = LaptopSerializer(laptops, many=True).data
        pcs_data = PCSerializer(pcs, many=True).data
        tvs_data = TVSerializer(tvs, many=True).data
        phones_data = PhoneSerializer(phones, many=True).data
        consoles_data = ConsoleSerializer(consoles, many=True).data
        video_games_data = VideoGameSerializer(video_games, many=True).data
        accessories_data = AccessorySerializer(accessories, many=True).data

        # Helper to add discount if any
        def add_discount(product_list, type_name):
            for product in product_list:
                discount = DiscountedProduct.objects.filter(
                    product_type=type_name, product_id=product["id"]
                ).order_by('-percent_discount').first()
                if discount:
                    product["percent_discount"] = float(discount.percent_discount)
                else:
                    product["percent_discount"] = None
            return product_list

        laptops_data = add_discount(laptops_data, "laptop")
        pcs_data = add_discount(pcs_data, "pc")
        tvs_data = add_discount(tvs_data, "tv")
        phones_data = add_discount(phones_data, "phone")
        consoles_data = add_discount(consoles_data, "console")
        video_games_data = add_discount(video_games_data, "video_game")
        accessories_data = add_discount(accessories_data, "accessory")

        # Combine into a single list, but tag each with "type"
        products = (
            [{"type": "laptop", **item} for item in laptops_data] +
            [{"type": "pc", **item} for item in pcs_data] +
            [{"type": "tv", **item} for item in tvs_data] +
            [{"type": "phone", **item} for item in phones_data] +
            [{"type": "console", **item} for item in consoles_data] +
            [{"type": "video_game", **item} for item in video_games_data] +
            [{"type": "accessory", **item} for item in accessories_data]
        )

        return Response(products, status=status.HTTP_200_OK)

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
        
        if request.user.is_authenticated:
            # content type for the product model
            ctype = ContentType.objects.get_for_model(Model)
            ProductViewHistory.objects.create(
                user_email=request.user.email,
                content_type=ctype,
                object_id=id,
            )

            total_count = ProductViewHistory.objects.filter(
                user_email=request.user.email
            ).count()
            if total_count > 100:
                to_remove = total_count - 100
                ProductViewHistory.objects.filter(
                    user_email=request.user.email
                ).order_by("viewed_at")[:to_remove].delete()

        product_data = Serializer(product).data
        reviews = Review.objects.filter(product_type=type, product_id=id)
        product_data["reviews"] = ReviewSerializer(reviews, many=True).data
        try:
            print("Looking for discount:", type, id)
            discounts = DiscountedProduct.objects.filter(product_type=type, product_id=id)
            print("Discounts found:", discounts)
            discount = discounts.order_by('-percent_discount').first()
            if discount:
                product_data["percent_discount"] = float(discount.percent_discount)
            else:
                product_data["percent_discount"] = None
        except Exception as e:
            print("Discount lookup error:", e)
            product_data["percent_discount"] = None

        similar_qs = Model.objects.exclude(id=id)

        # If product.brand is set, get up to 3 brand matches
        if product.brand:
            brand_match = list(similar_qs.filter(brand__iexact=product.brand)[:3])
            if len(brand_match) < 3:
                needed = 3 - len(brand_match)
                # Exclude the ones already in brand_match
                brand_ids = [p.id for p in brand_match]
                same_type = list(similar_qs.exclude(id__in=brand_ids)[:needed])
                final_recs_list = brand_match + same_type
            else:
                final_recs_list = brand_match
        else:
            # no brand, just get first 3
            final_recs_list = list(similar_qs[:3])

        rec_serializer = Serializer(final_recs_list, many=True)
        rec_data = rec_serializer.data

        for r in rec_data:
            disc = DiscountedProduct.objects.filter(
                product_type=type, product_id=r["id"]
            ).order_by('-percent_discount').first()
            if disc:
                r["percent_discount"] = float(disc.percent_discount)
            else:
                r["percent_discount"] = None

        product_data["recommendations"] = rec_data

        return Response(product_data)

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
        cart_items = Cart_Includes.objects.filter(customer_email=request.user.email)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data

        product_type = data["product_type"]
        product_id = data["product_id"]
        quantity = data["quantity"]

        model_map = {
        "laptop": Laptop,
        "phone": Phone,
        "tv": TV,
        "pc": PC,
        "video_game": Video_Game,
        "accessory": Accessory,
        "console": Console
        }

        product_model = model_map[product_type]
        content_type = ContentType.objects.get_for_model(product_model)


        cart_item, created = Cart_Includes.objects.get_or_create(
            customer_email=request.user.email,
            content_type=content_type,
            object_id=product_id,
            defaults={"quantity": quantity}
        )

        if not created:
            if quantity == 0:
                cart_item.delete()
                return Response({"removed": True})
            else:
                cart_item.quantity = quantity
                cart_item.save()
        elif quantity == 0:
            cart_item.delete()
            return Response({"removed": True})
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def delete(self, request):
        customer_email = request.user.email
        product_id = request.data.get("product_id")
        product_type = request.data.get("product_type")
        model_map = {
            "laptop": Laptop,
            "phone": Phone,
            "tv": TV,
            "pc": PC,
            "video_game": Video_Game,
            "accessory": Accessory,
            "console": Console
        }
        product_model = model_map[product_type]
        content_type = ContentType.objects.get_for_model(product_model)
        Cart_Includes.objects.filter(
            customer_email=customer_email,
            content_type=content_type,
            object_id=product_id
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user.customer)

class WishlistView(APIView):
    def get(self, request):
        customer_email = request.user.email
        items = WishlistItem.objects.filter(customer_email=customer_email)
        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        customer_email = request.user.email
        product_id = request.data.get("product_id")
        product_type = request.data.get("product_type")
        content_type = ContentType.objects.get(model=product_type)

        item, created = WishlistItem.objects.get_or_create(
            customer_email=customer_email,
            content_type=content_type,
            object_id=product_id,
        )
        serializer = WishlistItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        customer_email = request.user.email
        product_id = request.data.get("product_id")
        product_type = request.data.get("product_type")
        content_type = ContentType.objects.get(model=product_type)

        WishlistItem.objects.filter(
            customer_email=customer_email,
            content_type=content_type,
            object_id=product_id,
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class OrderView(APIView):
    """
    POST /api/order/ to place a new order
    GET /api/order/ to list or retrieve orders
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns a list of all orders for the currently authenticated user.
        """
        orders = Order.objects.filter(customer=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Expect data for shipping/billing. Example fields:
        shipping_first_name = request.data.get('shipping_first_name')
        shipping_last_name = request.data.get('shipping_last_name')
        shipping_address = request.data.get('shipping_address')
        shipping_address2 = request.data.get('shipping_address2', '')
        shipping_city = request.data.get('shipping_city')
        shipping_state = request.data.get('shipping_state', '')
        shipping_province = request.data.get('shipping_province', '')
        shipping_postal_code = request.data.get('shipping_postal_code')
        shipping_phone = request.data.get('shipping_phone')

        billing_first_name = request.data.get('billing_first_name')
        billing_last_name = request.data.get('billing_last_name')
        billing_address = request.data.get('billing_address')
        billing_address2 = request.data.get('billing_address2', '')
        billing_city = request.data.get('billing_city')
        billing_state = request.data.get('billing_state', '')
        billing_province = request.data.get('billing_province', '')
        billing_postal_code = request.data.get('billing_postal_code')
        billing_phone = request.data.get('billing_phone')

        if not all([shipping_first_name, shipping_last_name, shipping_address, shipping_city,
                    shipping_postal_code, shipping_phone,
                    billing_first_name, billing_last_name, billing_address, billing_city,
                    billing_postal_code, billing_phone]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Cart items for the current user
        cart_items = Cart_Includes.objects.filter(customer_email=request.user.email)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the Order
        order = Order.objects.create(
            customer=request.user,
            shipping_first_name=shipping_first_name,
            shipping_last_name=shipping_last_name,
            shipping_address=shipping_address,
            shipping_address2=shipping_address2,
            shipping_city=shipping_city,
            shipping_state=shipping_state,
            shipping_province=shipping_province,
            shipping_postal_code=shipping_postal_code,
            shipping_phone=shipping_phone,
            billing_first_name=billing_first_name,
            billing_last_name=billing_last_name,
            billing_address=billing_address,
            billing_address2=billing_address2,
            billing_city=billing_city,
            billing_state=billing_state,
            billing_province=billing_province,
            billing_postal_code=billing_postal_code,
            billing_phone=billing_phone,
            total=Decimal("0.00"),  # will update after creating items
        )

        total = Decimal("0.00")

        # Create OrderItem for each cart item
        for cart_item in cart_items:
            product = cart_item.product
            price = Decimal(str(product.price))
            quantity = cart_item.quantity

            OrderItem.objects.create(
                order=order,
                content_type=cart_item.content_type,
                object_id=cart_item.object_id,
                name=product.name,
                price=price,
                quantity=quantity
            )

            total += (price * quantity)

        order.total = total
        order.save()

        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class OrderDetailView(APIView):
    """
    Retrieve details of a single order by ID,
    ensuring the user can only view their own order.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)

        if order.customer != request.user and not request.user.is_superuser:
            return Response(
                {"error": "You do not have permission to view this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        now = timezone.now().date()
        date_14_days_ago = now - timedelta(days=13)

        total_orders = Order.objects.count()
        total_sales = Order.objects.aggregate(total=Sum('total'))['total'] or 0
        total_customers = Customer.objects.count()

        daily_sales_qs = (
            Order.objects.filter(created_at__date__gte=date_14_days_ago)
            .annotate(day=F('created_at__date'))
            .values('day')
            .annotate(revenue=Sum('total'), count=Count('id'))
            .order_by('day')
        )
        daily_sales = []
        for i in range(14):
            d = date_14_days_ago + timedelta(days=i)
            match = next((x for x in daily_sales_qs if x['day'] == d), None)
            daily_sales.append({
                "day": str(d),
                "revenue": float(match['revenue']) if match else 0.0,
                "orders": match['count'] if match else 0,
            })

        recent_orders = (
            Order.objects.select_related('customer')
            .order_by('-created_at')[:5]
        )
        recent_orders_data = []
        for o in recent_orders:
            recent_orders_data.append({
                "id": o.id,
                "customer_email": o.customer.email,
                "total": float(o.total),
                "status": o.status,
                "created_at": o.created_at.isoformat(),
            })


        new_customers_qs = (
            Customer.objects.filter(date_joined__date__gte=date_14_days_ago)
            .annotate(day=TruncDate('date_joined'))
            .values('day')
            .annotate(count=Count('email'))
            .order_by('day')
        )
        daily_signups = []
        for i in range(14):
            d = date_14_days_ago + timedelta(days=i)
            match = next((x for x in new_customers_qs if x['day'] == d), None)
            daily_signups.append({
                "day": str(d),
                "signups": match['count'] if match else 0,
            })

        content_types_map = {
            "laptop": ContentType.objects.get_for_model(Laptop),
            "pc": ContentType.objects.get_for_model(PC),
            "tv": ContentType.objects.get_for_model(TV),
            "phone": ContentType.objects.get_for_model(Phone),
            "console": ContentType.objects.get_for_model(Console),
            "video_game": ContentType.objects.get_for_model(Video_Game),
            "accessory": ContentType.objects.get_for_model(Accessory),
        }

        category_revenue = {}
        for key, ctype in content_types_map.items():
            agg = (
                OrderItem.objects.filter(content_type=ctype)
                .aggregate(
                    total_revenue=Sum(F('price')*F('quantity')),
                    total_qty=Sum('quantity'),
                )
            )
            rev = agg['total_revenue'] or 0
            qty = agg['total_qty'] or 0
            category_revenue[key] = {
                "revenue": float(rev),
                "units_sold": qty,
            }

        top_sellers = {}

        def get_top_sellers_for_model(model_cls, model_str, limit=5):
            ctype = content_types_map[model_str]
            sales_data = (
                OrderItem.objects.filter(content_type=ctype)
                .values('object_id')
                .annotate(total_qty=Sum('quantity'), total_revenue=Sum(F('price')*F('quantity')))
                .order_by('-total_qty')[:limit]
            )
            results = []
            for row in sales_data:
                try:
                    product_obj = model_cls.objects.get(id=row['object_id'])
                    results.append({
                        "id": product_obj.id,
                        "name": product_obj.name,
                        "total_qty": row['total_qty'],
                        "total_revenue": float(row['total_revenue'] or 0),
                        "price": float(product_obj.price),
                    })
                except model_cls.DoesNotExist:
                    pass
            return results

        top_sellers["laptop"] = get_top_sellers_for_model(Laptop, "laptop")
        top_sellers["pc"] = get_top_sellers_for_model(PC, "pc")
        top_sellers["tv"] = get_top_sellers_for_model(TV, "tv")
        top_sellers["phone"] = get_top_sellers_for_model(Phone, "phone")
        top_sellers["console"] = get_top_sellers_for_model(Console, "console")
        top_sellers["video_game"] = get_top_sellers_for_model(Video_Game, "video_game")
        top_sellers["accessory"] = get_top_sellers_for_model(Accessory, "accessory")

        data = {
            "total_orders": total_orders,
            "total_sales": float(total_sales),
            "total_customers": total_customers,
            "daily_sales": daily_sales,
            "recent_orders": recent_orders_data,
            "daily_signups": daily_signups,
            "category_revenue": category_revenue,
            "top_sellers": top_sellers,
        }
        return Response(data, status=status.HTTP_200_OK)

class ChatBotView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = request.data.get("userMessage", "")
        current_page = request.data.get("currentPage", "unknown")
        
        laptops = Laptop.objects.all()
        pcs = PC.objects.all()
        tvs = TV.objects.all()
        phones = Phone.objects.all()
        consoles = Console.objects.all()
        video_games = Video_Game.objects.all()
        accessories = Accessory.objects.all()

        laptops_data = LaptopSerializer(laptops, many=True).data
        pcs_data = PCSerializer(pcs, many=True).data
        tvs_data = TVSerializer(tvs, many=True).data
        phones_data = PhoneSerializer(phones, many=True).data
        consoles_data = ConsoleSerializer(consoles, many=True).data
        video_games_data = VideoGameSerializer(video_games, many=True).data
        accessories_data = AccessorySerializer(accessories, many=True).data

        db_data = {
            "laptops": laptops_data,
            "pcs": pcs_data,
            "tvs": tvs_data,
            "phones": phones_data,
            "consoles": consoles_data,
            "video_games": video_games_data,
            "accessories": accessories_data,
        }
        db_string = json.dumps(db_data)

        site_structure = {
            "pages": [
                "/",
                "/sign-in",
                "/customer-registration",
                "/products",
                "/products/<type>/<id>",
                "/checkout",
                "/wishlist",
                "/my-orders",
                "/admin-dashboard"
            ],
            "description": "This site sells electronics: laptops, phones, TVs, consoles, etc."
        }
        website_string = json.dumps(site_structure)

        
        site_settings, _ = SiteSettings.objects.get_or_create(id=1)
        OPENAI_API_KEY = site_settings.openai_api_key or "EMPTY_KEY"
        support_email_address = site_settings.support_email or "support@example.com"


        first_name = getattr(request.user, "first_name", None) or None
        last_name = getattr(request.user, "last_name", None) or None
        email = getattr(request.user, "email", None) or None

        openai_request_body = {
            "model": "o4-mini",
            "input": [
                {
                    "role": "system",
                    "content": [
                        {
                        "type": "input_text",
                        "text": f"You are a ChatBot for an eCommerce website called FGG Tech who is capable of answering customer queries. You will be provided with the database and website structure as a string.\n\n# Instructions\n\n- Understand and interpret the provided database and website structure.\n- Develop logical responses to customer inquiries related to product searches and other common customer service topics.\n- Reference the database structure for information retrieval and ensure responses are accurate and aligned with the given data source.\n- You will also be given the current website page the customer inquired from, as well as basic customer information.\n- The database data can be found below under the heading DATABASE_DATA.\n- The website data can be found below under the heading WEBSITE_DATA.\n- The customer inquiry/message will have a heading called CUSTOMER_INQUIRY.\n- The customer\'s current website page will have a heading called CUSTOMER_INQUIRY_FROM_URL.\n- The customer\'s basic information (name and email) will have a heading called CUSTOMER_INFO\n  \n# Output Format\n\n- Responses should be clear, concise, and assist the customer effectively. The responses should also be personalized for the customer\n  \n# Example Queries\n\n1. **Customer Query:** \"Can you tell me the price of [Product Name]?\"\n   - **Response:** \"The price of [Product Name] is [Product Price].\"\n\n2. **Customer Query:** \"What is the status of my order [Order Number]?\"\n   - **Response:** \"Your order [Order Number] is currently [Order Status].\"\n\n# Notes\n\n- Ensure the ChatBot can handle various customer service queries using the information from the provided database and website structure.\n- Incorporate error handling for situations where the information requested isn\'t available in the database, if information is missing, say so, and suggest to email {support_email_address}.\n\n# DATABASE_DATA\n{db_string}\n\n# WEBSITE_DATA\n{website_string}"
                        }
                    ]
                },

                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": f"# CUSTOMER_INQUIRY\n {user_message}\n\n"
                                    f"# CUSTOMER_INQUIRY_FROM_URL\n {current_page}\n\n"
                                    f"# CUSTOMER_INFO\n Name: {first_name} {last_name}, Email: {email}"
                        }
                    ]
                }
            ],
            "text": {
                "format": {
                    "type": "text"
                }
            },
            "reasoning": {
                "effort": "medium"
            },
            "tools": [],
            "store": True
        }

        try:
            response = requests.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENAI_API_KEY}"
                },
                json=openai_request_body,
                timeout=40
            )
            if response.status_code == 200:
                api_json = response.json()
                
                def extract_assistant_text(json_data):
                    for item in json_data.get("output", []):
                        if item.get("type") == "message":
                            for block in item.get("content", []):
                                if block.get("type") == "output_text":
                                    return block.get("text", "")
                    return "No reply text found."

                assistant_text = extract_assistant_text(api_json)

                return Response({"assistantReply": assistant_text}, status=status.HTTP_200_OK)

            else:
                return Response({
                    "error": "OpenAI request failed",
                    "status_code": response.status_code,
                    "details": response.text
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.exceptions.RequestException as e:
            return Response({
                "error": "Exception calling OpenAI",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SiteSettingsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ensure only staff or superuser can see it
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        # We only expect one row
        obj, created = SiteSettings.objects.get_or_create(id=1)
        data = {
            "openai_api_key": obj.openai_api_key or "",
            "support_email": obj.support_email or "",
        }
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request):
        # Ensure only staff or superuser can update
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        obj, created = SiteSettings.objects.get_or_create(id=1)
        openai_api_key = request.data.get("openai_api_key", "").strip()
        support_email = request.data.get("support_email", "").strip()

        obj.openai_api_key = openai_api_key
        obj.support_email = support_email
        obj.save()

        return Response({
            "openai_api_key": obj.openai_api_key,
            "support_email": obj.support_email
        }, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def recommend_or_trending(request):
    """
    Returns either "Recommended Products" (based on user’s view history)
    or "Trending Products" (if the user has no history or is not logged in).
    """
    user = request.user
    if not user.is_authenticated:
        # Not logged in => default to trending
        return Response({
            "mode": "trending",
            "products": get_trending_products()
        })

    # Check how many total views the user has
    total_views = ProductViewHistory.objects.filter(user_email=user.email).count()
    if total_views == 0:
        return Response({
            "mode": "trending",
            "products": get_trending_products()
        })

    # Count how many times each content_type was viewed
    ctype_counts = (ProductViewHistory.objects
                    .filter(user_email=user.email)
                    .values('content_type')
                    .annotate(count=Count('id'))
                    .order_by('-count'))
    if not ctype_counts:
        return Response({
            "mode": "trending",
            "products": get_trending_products()
        })

    top_ctype_id = ctype_counts[0]['content_type']
    top_ctype = ContentType.objects.get(id=top_ctype_id)
    model_cls = top_ctype.model_class()
    queryset = model_cls.objects.all().order_by('-id')[:6]

    from .serializers import (
        LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer,
        ConsoleSerializer, VideoGameSerializer, AccessorySerializer
    )

    serializer_map = {
        'laptop': LaptopSerializer,
        'pc': PCSerializer,
        'tv': TVSerializer,
        'phone': PhoneSerializer,
        'console': ConsoleSerializer,
        'video_game': VideoGameSerializer,
        'accessory': AccessorySerializer
    }
    model_name = top_ctype.model
    SerializerClass = serializer_map.get(model_name)
    if not SerializerClass:
        return Response({
            "mode": "trending",
            "products": get_trending_products()
        })

    serialized = SerializerClass(queryset, many=True).data

    for item in serialized:
        item["type"] = model_name

    return Response({
        "mode": "recommended",
        "products": serialized
    })


def get_trending_products():
    """
    Returns a list of 'trending' products by count of reviews.
    """
    trending_candidates = []

    def add_candidates(model_cls, serializer_cls, product_type_name):
        review_count_subq = (
            Review.objects
            .filter(
                product_type=product_type_name,
                product_id=OuterRef('pk')
            )
            .values('product_id')
            .annotate(count=Count('id'))
            .values('count')[:1]
        )

        products_with_count = model_cls.objects.annotate(
            review_count=Coalesce(Subquery(review_count_subq, output_field=IntegerField()), 0)
        )

        for product in products_with_count:
            trending_candidates.append(
                (product, product.review_count, product_type_name, serializer_cls)
            )

    from .serializers import (
        LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer,
        ConsoleSerializer, VideoGameSerializer, AccessorySerializer
    )
    add_candidates(Laptop,  LaptopSerializer,  'laptop')
    add_candidates(PC,      PCSerializer,      'pc')
    add_candidates(TV,      TVSerializer,      'tv')
    add_candidates(Phone,   PhoneSerializer,   'phone')
    add_candidates(Console, ConsoleSerializer, 'console')
    add_candidates(Video_Game, VideoGameSerializer, 'video_game')
    add_candidates(Accessory, AccessorySerializer, 'accessory')

    trending_candidates.sort(key=lambda x: x[1], reverse=True)
    top6 = trending_candidates[:6]

    results = []
    for obj, review_count, tname, ser_cls in top6:
        ser_data = ser_cls(obj).data
        ser_data["type"] = tname
        results.append(ser_data)

    return results