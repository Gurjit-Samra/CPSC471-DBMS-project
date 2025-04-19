from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .user_models import Customer
from .product_models import Laptop, PC, TV, Phone, Console, Video_Game, Accessory

class Review(models.Model):
    review_text = models.TextField(blank=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    # a review should involve a customer and a product
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="reviews")
    product_type = models.CharField(max_length=30)
    product_id = models.PositiveIntegerField()