from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('products/', index),
    path('customer-registration/', index),
    path('sign-in/', index),
    path('admin-sign-in/', index)
]

