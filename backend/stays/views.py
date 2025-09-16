from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Count, Q
from .models import Stay, Category
from .serializers import StaySerializer, CategorySerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name_fr", "name_en", "slug"]
    ordering_fields = ["name_fr", "name_en", "slug", "stays_count"]
    ordering = ["name_fr"]

    def get_queryset(self):
        # annote stays_count pour lister "combien de séjours" par catégorie
        return Category.objects.annotate(stays_count=Count("stays"))


class StayViewSet(viewsets.ModelViewSet):  # mets ReadOnlyModelViewSet si tu veux bloquer POST
    queryset = Stay.objects.all().order_by("-created_at")
    serializer_class = StaySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # recherche + tri
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "city"]
    ordering_fields = ["price", "created_at", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()

        city = self.request.query_params.get("city")
        cat_slug = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        is_demo = self.request.query_params.get("is_demo")
        has_coords = self.request.query_params.get("has_coords")

        if city:
            qs = qs.filter(city__iexact=city)
        if cat_slug:
            qs = qs.filter(category__slug=cat_slug)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        if is_demo is not None:
            val = str(is_demo).lower() in ("1", "true", "yes", "on")
            qs = qs.filter(is_demo=val)
        if has_coords is not None:
            val = str(has_coords).lower() in ("1", "true", "yes", "on")
            if val:
                qs = qs.filter(latitude__isnull=False, longitude__isnull=False)
            else:
                qs = qs.filter(Q(latitude__isnull=True) | Q(longitude__isnull=True))

        return qs
