from rest_framework import serializers
from .models import Stay

class StaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Stay
        fields = "__all__"
