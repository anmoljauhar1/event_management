from rest_framework import serializers
from .models import Event, EventImage, EventLike, Category, DancePartner
from django.contrib.auth.models import User

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ('id', 'image', 'order')

class EventListSerializer(serializers.ModelSerializer):
    # Show only first image for list view
    first_image = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'category', 'date', 'time', 'location',
            'first_image', 'likes_count', 'is_liked', 'is_wishlisted', 'created_at', 'is_private', 'price'
        )

    def get_first_image(self, obj):
        first_img = obj.images.first()
        if first_img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_img.image.url)
            return first_img.image.url
        return None

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from wishlists.models import WishlistItem
            return WishlistItem.objects.filter(user=request.user, event=obj).exists()
        return False

class EventDetailSerializer(serializers.ModelSerializer):
    images = EventImageSerializer(many=True, read_only=True)
    organizer = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    chat_room_id = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_organizer(self, obj):
        return {
            'id': obj.organizer.id,
            'username': obj.organizer.username,
            'first_name': obj.organizer.first_name,
            'last_name': obj.organizer.last_name,
        }

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from wishlists.models import WishlistItem
            return WishlistItem.objects.filter(user=request.user, event=obj).exists()
        return False

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.organizer:
            return True
        return False

    def get_chat_room_id(self, obj):
        if hasattr(obj, 'chat_room'):
            return obj.chat_room.id
        return None

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'description', 'category', 'date', 'time', 'location', 'address', 'price', 'is_private')

    def validate_category(self, value):
        valid_categories = [c[0] for c in Category.choices]
        if value not in valid_categories:
            raise serializers.ValidationError("Invalid category.")
        return value

class DancePartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DancePartner
        fields = '__all__'