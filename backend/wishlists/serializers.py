from rest_framework import serializers
from .models import WishlistItem
from events.serializers import EventListSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ('id', 'event', 'created_at')