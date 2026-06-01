from rest_framework import generics, permissions
from events.models import Event, EventLike
from events.serializers import EventListSerializer
from django.db.models import Count, Q

class RecommendedEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get categories the user has liked
        liked_categories = Event.objects.filter(
            likes__user=user
        ).values_list('category', flat=True).distinct()

        # Exclude events already liked or booked by user
        excluded_ids = Event.objects.filter(
            Q(likes__user=user) | Q(bookings__user=user, bookings__status='confirmed')
        ).values_list('id', flat=True)

        # Get upcoming events in those categories with high average rating
        recommended = Event.objects.filter(
            category__in=liked_categories,
            date__gte=timezone.now()
        ).exclude(id__in=excluded_ids).annotate(
            avg_rating=Avg('reviews__rating'),
            likes_count=Count('likes')
        ).order_by('-avg_rating', '-likes_count')[:10]

        # Fallback: popular events if no liked categories
        if not recommended.exists():
            recommended = Event.objects.filter(
                date__gte=timezone.now()
            ).exclude(id__in=excluded_ids).annotate(
                avg_rating=Avg('reviews__rating'),
                likes_count=Count('likes')
            ).order_by('-avg_rating', '-likes_count')[:10]
        return recommended