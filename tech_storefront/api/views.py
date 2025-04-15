from django.shortcuts import render
from rest_framework import generics, status
from .models.user_models import Customer, Admin
from .serializers import CustomerSerializer, CreateCustomerSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate

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