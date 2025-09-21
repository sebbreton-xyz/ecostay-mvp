# stays/views.py
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django.db import connection
from django.db.models import Count, Q, Func, Value
from django.db.models.functions import Lower, Replace

from .models import Stay, Category
from .serializers import StaySerializer, CategorySerializer

import unicodedata, re


# PostgreSQL: fonction unaccent()
class Unaccent(Func):
    function = "unaccent"
    arity = 1


def _normalize_py(s: str) -> str:
    if not s:
        return ""
    s = unicodedata.normalize("NFD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")  # sans diacritiques
    s = re.sub(r"\bqu'\s*", "", s, flags=re.I)  # qu'  -> …
    s = re.sub(r"\b[ldjtnsmc]'\s*", "", s, flags=re.I)  # l'/d'/j'/t'/n'/s'/m'/c' -> …
    s = re.sub(r"[’'`]\s*", "", s)  # apostrophes restantes
    s = re.sub(r"[—–-]", " ", s)  # tirets -> espace
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


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


class StayViewSet(viewsets.ModelViewSet):  # mets ReadOnlyModelViewSet si besoin
    queryset = Stay.objects.all().order_by("-created_at")
    serializer_class = StaySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # DRF SearchFilter (param ?search=) → insensible à la casse
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "city"]
    ordering_fields = ["price", "created_at", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()

        # filtres
        city = self.request.query_params.get("city")
        cat_slug = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        is_demo = self.request.query_params.get("is_demo")
        has_coords = self.request.query_params.get("has_coords")
        q_norm = self.request.query_params.get(
            "q"
        )  # requête normalisée envoyée par le front

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

        # --- Recherche accent-insensible ---
        if q_norm:
            if connection.vendor == "postgresql":
                # Normalisation côté colonnes: replace → unaccent → lower
                qv = q_norm.lower()
                for ch in ("’", "'", "`"):
                    qv = qv.replace(ch, "")
                for ch in ("—", "–", "-"):
                    qv = qv.replace(ch, " ")
                qv = " ".join(qv.split())

                def norm(field_name):
                    expr = Replace(field_name, Value("’"), Value(""))
                    expr = Replace(expr, Value("'"), Value(""))
                    expr = Replace(expr, Value("`"), Value(""))
                    expr = Replace(expr, Value("—"), Value(" "))
                    expr = Replace(expr, Value("–"), Value(" "))
                    expr = Replace(expr, Value("-"), Value(" "))
                    return Lower(Unaccent(expr))

                qs = qs.annotate(
                    title_norm=norm("title"),
                    city_norm=norm("city"),
                ).filter(Q(title_norm__icontains=qv) | Q(city_norm__icontains=qv))
            else:
                # SQLite/dev : fallback Python (accent-insensible)
                qv = _normalize_py(q_norm)
                if qv:
                    ids = []
                    for s in qs:
                        title = getattr(s, "title", "") or ""
                        city_val = getattr(s, "city", "") or ""
                        if qv in _normalize_py(title) or qv in _normalize_py(city_val):
                            ids.append(s.id)
                    qs = qs.filter(id__in=ids)

        return qs
