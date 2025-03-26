from django.urls import path
from .views import CustomerRegistrationView

urlpatterns = [
    path('home', CustomerRegistrationView.as_view()),
    path('', CustomerRegistrationView.as_view())
]