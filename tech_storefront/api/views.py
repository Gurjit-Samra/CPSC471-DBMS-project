from django.shortcuts import render
from rest_framework import generics
from .models.user_models import Customer
from .serializers import CustomerSerializer

# Create your views here.
class CustomerRegistrationView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer