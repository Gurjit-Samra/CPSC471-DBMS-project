from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('products/', index),
    path('customer-registration/', index),
    path('sign-in/', index),
    path('admin-sign-in/', index),
    path('wishlist/', index),
    path('checkout/', index),
    re_path(r'^products/.+$', index),
]

