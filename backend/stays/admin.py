from django.contrib import admin
from .models import Category, Stay


# --- Category ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name_fr", "name_en", "slug")
    search_fields = ("name_fr", "name_en", "slug")
    prepopulated_fields = {"slug": ("name_fr",)}  # auto-remplit le slug depuis name_fr
    ordering = ("name_fr",)


# --- Stay ---
@admin.register(Stay)
class StayAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "city",
        "price",
        "category",
        "is_demo",  # badge démo en admin
        "latitude",
        "longitude",  # coordonnées (si présentes dans le modèle)
        "created_at",
    )
    list_filter = ("city", "category", "is_demo")  # filtre par démo
    search_fields = ("title", "city")
    autocomplete_fields = ("category",)  # champ de sélection avec recherche
    date_hierarchy = "created_at"  # navigation par date en haut de la liste
    ordering = ("-created_at",)

    # Actions pratiques pour (dé)marquer en démo
    actions = ["mark_demo", "unmark_demo"]

    @admin.action(description="Marquer comme démo")
    def mark_demo(self, request, queryset):
        updated = queryset.update(is_demo=True)
        self.message_user(request, f"{updated} séjour(s) marqué(s) comme démo.")

    @admin.action(description="Retirer le marqueur démo")
    def unmark_demo(self, request, queryset):
        updated = queryset.update(is_demo=False)
        self.message_user(request, f"{updated} séjour(s) sans le marqueur démo.")

    # Optionnel: petit gain perf si beaucoup de lignes
    def get_queryset(self, request):
        return super().get_queryset(request).select_related("category")
