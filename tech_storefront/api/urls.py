from django.urls import path
from .views import CustomerRegistrationView
from .views import CustomerSignInView
from .views import AdminSignInView

urlpatterns = [
    path('home', CustomerRegistrationView.as_view()),
    path('', CustomerRegistrationView.as_view()),
    path('customer-registration/', CustomerRegistrationView.as_view(), name='customer-registration'),
    path('sign-in/', CustomerSignInView.as_view(), name='sign-in'),
    path('admin-sign-in/', AdminSignInView.as_view(), name='admin-sign-in'),


]