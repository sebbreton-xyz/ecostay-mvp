from rest_framework import serializers
from .models import Stay, Category

class CategorySerializer(serializers.ModelSerializer):
    stays_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name_fr", "name_en", "slug", "stays_count")


class StaySerializer(serializers.ModelSerializer):
    # lecture : catégorie imbriquée
    category = CategorySerializer(read_only=True)
    # écriture : passer un id
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False
    )

    class Meta:
        model = Stay
        fields = "__all__"   # inclut title, city, price, latitude, longitude, is_demo, category, category_id, etc.
