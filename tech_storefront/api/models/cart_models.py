from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Cart_Includes(models.Model):
    customer_email = models.EmailField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)  # the product model (Laptop, Phone, etc.)
    object_id = models.PositiveIntegerField()  # the product’s ID
    product = GenericForeignKey("content_type", "object_id")  # links to actual product instance
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("customer_email", "content_type", "object_id")