from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'event', 'rating', 'comment', 'created_at')
        read_only_fields = ('user', 'event', 'created_at')

    def validate(self, data):
        if self.context['request'].method == 'POST':
            user = self.context['request'].user
            event_id = self.context['view'].kwargs.get('event_id')
            if Review.objects.filter(user=user, event_id=event_id).exists():
                raise serializers.ValidationError("You have already reviewed this event.")
        return data