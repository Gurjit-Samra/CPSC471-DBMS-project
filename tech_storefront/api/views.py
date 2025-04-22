from rest_framework import status, generics, permissions
from .models.user_models import Customer, Admin
from .models.cart_models import Cart_Includes, WishlistItem
from .serializers import CreateCustomerSerializer, CustomerSerializer, UserSerializer, ReviewSerializer, CartItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models.product_models import Laptop, PC, TV, Phone, Console, Video_Game, Accessory, DiscountedProduct
from .serializers import LaptopSerializer, PCSerializer, TVSerializer, PhoneSerializer, ConsoleSerializer, AccessorySerializer, VideoGameSerializer
from django.db.models import Q
from rest_framework.decorators import api_view
from .models.review_models import Review
from django.contrib.contenttypes.models import ContentType
from .serializers import WishlistItemSerializer
from .models.order_models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.contenttypes.models import ContentType
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta
from django.contrib.contenttypes.models import ContentType
from django.db.models.functions import TruncDate




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

        # Helper to add percent_discount
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

        laptops = add_discount(laptops, "laptop")
        pcs = add_discount(pcs, "pc")
        tvs = add_discount(tvs, "tv")
        phones = add_discount(phones, "phone")
        consoles = add_discount(consoles, "console")
        video_games = add_discount(video_games, "video_game")
        accessories = add_discount(accessories, "accessory")

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

        product_type = data["product_type"]  # e.g., "laptop"
        product_id = data["product_id"]
        quantity = data["quantity"]

        from api.models.product_models import Laptop, Phone, TV, PC, Video_Game, Accessory, Console

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
            price = Decimal(str(product.price))  # make sure we have a Decimal
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

        # Ensure that only the owner of the order (or an admin) can view it
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
