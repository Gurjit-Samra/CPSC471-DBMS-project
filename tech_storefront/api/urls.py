from django.urls import path
from .views import CustomerRegistrationView
from .views import CustomerSignInView
from .views import AdminSignInView
from .views import CurrentUserView
from .views import LogoutView

urlpatterns = [
    path('home', CustomerRegistrationView.as_view()),
    path('', CustomerRegistrationView.as_view()),
    path('customer-registration/', CustomerRegistrationView.as_view(), name='customer-registration'),
    path('sign-in/', CustomerSignInView.as_view(), name='sign-in'),
    path('admin-sign-in/', AdminSignInView.as_view(), name='admin-sign-in'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
]