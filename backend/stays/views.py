from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Stay
from .serializers import StaySerializer

class StayViewSet(viewsets.ModelViewSet):  # ou ReadOnlyModelViewSet si tu veux bloquer POST
    queryset = Stay.objects.all().order_by("-created_at")   # <-- remis ici
    serializer_class = StaySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()  # part de queryset ci-dessus
        city = self.request.query_params.get("city")
        if city:
            qs = qs.filter(city__iexact=city)
        return qs
