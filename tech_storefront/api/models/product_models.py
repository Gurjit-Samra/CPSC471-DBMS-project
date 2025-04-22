from django.db import models
from .user_models import Admin
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

# Abstract Product
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(
        upload_to="product_images/",
        blank=True,
        null=True
    )
    
    class Meta:
        abstract = True

    def __str__(self):
        return self.name

# Abstract Computer
class Computer(Product):
    ram = models.PositiveIntegerField(help_text="RAM in GB")
    graphics_card = models.CharField(max_length=255)
    proccessor = models.CharField(max_length=255)
    
    class Meta:
        abstract = True

class Laptop(Computer):
    screen_size = models.PositiveIntegerField(help_text="Size in inches")
    resolution = models.CharField(max_length=10)

class PC(Computer):
    pass

class TV(Product):
    screen_size = models.PositiveIntegerField(help_text="Size in inches")
    resolution = models.CharField(max_length=10)

class Phone(Product):
    screen_size = models.PositiveIntegerField(help_text="Size in inches")
    resolution = models.CharField(max_length=10)

# Abstract video game product
class Video_Game_Product(Product):
    class Meta:
        abstract = True


class Accessory(Video_Game_Product):
    pass

class Console(Video_Game_Product):
    pass

class Video_Game(Video_Game_Product):
    age_rating = models.CharField(max_length=10)
    genre = models.CharField(max_length=25)

class DiscountedProduct(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ('laptop', 'Laptop'),
        ('pc', 'PC'),
        ('tv', 'TV'),
        ('phone', 'Phone'),
        ('console', 'Console'),
        ('video_game', 'Video Game'),
        ('accessory', 'Accessory'),
    ]
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    product_id = models.PositiveIntegerField()
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    percent_discount = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = (('product_type', 'product_id', 'admin'),)

class ProductViewHistory(models.Model):
    """
    Records when a user (identified by email) has viewed a given product.
    """
    user_email = models.EmailField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    viewed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user_email} viewed {self.product} at {self.viewed_at}"
