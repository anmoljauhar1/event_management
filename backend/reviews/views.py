from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer

class EventReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return Review.objects.filter(event_id=event_id).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, event_id=self.kwargs['event_id'])