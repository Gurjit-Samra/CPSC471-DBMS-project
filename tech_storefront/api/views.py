from django.shortcuts import render
from rest_framework import generics, status
from .models.user_models import Customer
from .serializers import CustomerSerializer, CreateCustomerSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class CustomerRegistrationView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class CreateCustomerView(APIView):
    serializer_class = CreateCustomerSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            queryset = Customer.objects.filter(email=email)
            if queryset.exists():
                return Response(
                    {"error": "A customer with that email already exists."},
                    status=status.HTTP_409_CONFLICT,
                )

            customer = serializer.save()
            return Response(
                CustomerSerializer(customer).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                