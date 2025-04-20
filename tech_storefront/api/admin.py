from django.contrib import admin
from .models.user_models import Admin, Customer
from .models.product_models import Laptop, PC, TV, Phone, Accessory, Console, Video_Game, DiscountedProduct
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

@admin.register(DiscountedProduct)
class DiscountedProductAdmin(admin.ModelAdmin):
    list_display = ("product_type", "product_id", "admin", "percent_discount")
    search_fields = ("product_type", "product_id", "admin__email")

    # autoset the current signed-in admin as the admin email
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        return [f for f in fields if f != "admin"]

    def save_model(self, request, obj, form, change):
        obj.admin = request.user
        super().save_model(request, obj, form, change)

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
