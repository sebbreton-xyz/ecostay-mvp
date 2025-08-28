from django.contrib import admin

# Register your models here.
from .models import Stay

@admin.register(Stay)
class StayAdmin(admin.ModelAdmin):
    list_display = ("title", "city", "price", "created_at")
    search_fields = ("title", "city")                        # barre de recherche (icontains)
    list_filter = ("city",)                                  # filtres latéraux
