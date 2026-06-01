from rest_framework import serializers
from .models import Venue, Hall, HallImage, HallBooking


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name', 'address', 'location', 'latitude', 'longitude', 'contact_phone', 'contact_email']


class HallImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HallImage
        fields = ['id', 'image', 'is_primary']


class HallSerializer(serializers.ModelSerializer):
    images = HallImageSerializer(many=True, read_only=True)
    venue = VenueSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(source='venue', queryset=Venue.objects.all(), write_only=True, required=False, allow_null=True)

    class Meta:
        model = Hall
        fields = [
            'id', 'name', 'description', 'category', 'location', 'latitude', 'longitude', 'capacity',
            'price_per_day', 'amenities', 'is_active', 'owner', 'venue', 'venue_id', 'images', 'created_at'
        ]
        read_only_fields = ['owner', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        if user and not user.is_anonymous:
            validated_data['owner'] = user
        return super().create(validated_data)


class HallBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HallBooking
        fields = '__all__'
        read_only_fields = ['booking_id', 'created_at', 'confirmed_at']
