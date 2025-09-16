# stays/models.py
from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name_fr = models.CharField(max_length=120, unique=True)
    name_en = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name_fr"]

    def __str__(self):
        return self.name_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_fr)
        super().save(*args, **kwargs)


class Stay(models.Model):
    title = models.CharField(max_length=120)
    city = models.CharField(max_length=80, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    category = models.ForeignKey(
        Category, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="stays"
    )

    # ✅ pour la carte
    latitude  = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # ✅ badge démo
    is_demo = models.BooleanField(default=False)

    def __str__(self):
        return self.title
