from django.db import models

# Abstract Product
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(
        upload_to="product_images/",    # on‑disk subfolder under MEDIA_ROOT
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

class Video_Game_Product(Product):
    class Meta:
        abstract = True

class Console(Video_Game_Product):
    pass

class Accessory(Video_Game_Product):
    pass

class Video_Game(Video_Game_Product):
    age_rating = models.CharField(max_length=10)
    genre = models.CharField(max_length=10)
