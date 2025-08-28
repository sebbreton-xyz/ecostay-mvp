from django.db import models

# Create your models here.
from django.db import models

class Stay(models.Model):
    title = models.CharField(max_length=120)
    city = models.CharField(max_length=80, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
