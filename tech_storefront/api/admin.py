from django.contrib import admin
from .models.user_models import Admin, Customer
from .models.product_models import Laptop, PC, TV, Phone, Accessory, Console, Video_Game
from .models.review_models import Review

@admin.register(Admin)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "is_staff", "is_superuser")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "country", "city")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

@admin.register(Laptop)
class LaptopAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "screen_size", "resolution")

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("review_text", "rating", "customer", "product_type", "product_id")

@admin.register(PC)
class PCAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "ram", "graphics_card", "proccessor")

@admin.register(TV)
class TVAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "screen_size", "resolution")

@admin.register(Phone)
class PhoneAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "screen_size", "resolution")

@admin.register(Console)
class ConsoleAdmin(admin.ModelAdmin):
    list_display = ("name", "price")

@admin.register(Video_Game)
class VideoGameAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "age_rating", "genre")

@admin.register(Accessory)
class AccessoryAdmin(admin.ModelAdmin):
    list_display = ("name", "price")
