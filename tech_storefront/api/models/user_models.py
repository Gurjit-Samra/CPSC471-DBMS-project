from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = None # Remove username since we have Email as primary key
    email = models.EmailField('email address', unique=True, primary_key=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # remove other required fields

    def __str__(self):
        return self.email

class Customer(User):
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20)
    street_address = models.CharField(max_length=255)

class Admin(User):
    # Just email for admin (inherited from User)
    pass