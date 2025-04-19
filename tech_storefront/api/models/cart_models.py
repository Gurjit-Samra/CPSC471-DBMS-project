from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Cart_Includes(models.Model):
    customer_email = models.EmailField()  # Email of the customer
    product_id = models.IntegerField()  # ID of the product
    quantity = models.PositiveIntegerField(default=1)  # Quantity of the product

    class Meta:
        unique_together = ("customer_email", "product_id")  # Ensure unique combination

    def __str__(self):
        return f"Customer: {self.customer_email}, Product ID: {self.product_id}, Quantity: {self.quantity}"