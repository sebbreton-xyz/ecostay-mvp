# stays/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StayViewSet, CategoryViewSet  # import local

router = DefaultRouter()
router.register(r"stays", StayViewSet, basename="stay")
router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path("", include(router.urls)),
]
