from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import CustomerRegistrationView
from .views import CustomerSignInView
from .views import AdminSignInView
from .views import CurrentUserView
from .views import LogoutView
from .views import AllProductsView
from .views import ProductDetailView
from .views import product_suggestions
from .views import CartView
from .views import ReviewCreateView
from .views import WishlistView
from .views import OrderView

urlpatterns = [
    path('home', CustomerRegistrationView.as_view()),
    path('', CustomerRegistrationView.as_view()),
    path('customer-registration/', CustomerRegistrationView.as_view(), name='customer-registration'),
    path('sign-in/', CustomerSignInView.as_view(), name='sign-in'),
    path('admin-sign-in/', AdminSignInView.as_view(), name='admin-sign-in'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('products/', AllProductsView.as_view(), name='all-products'),
    path('products/<str:type>/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/suggestions/', product_suggestions, name='product-suggestions'),
    path('cart/', CartView.as_view(), name='cart'),
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('order/', OrderView.as_view(), name='order'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)