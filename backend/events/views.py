from django.shortcuts import get_object_or_404, render
from django.db.models import Count, Q
from geopy.distance import geodesic


from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from .models import Event, EventImage, EventLike
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    EventImageSerializer
)
from .filters import EventFilter
from .permissions import IsOwnerOrReadOnly

def event_share_preview(request, pk):
    event = get_object_or_404(Event, pk=pk)
    return render(request, 'events/share_preview.html', {'event': event})

class EventViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = EventFilter
    search_fields = ['title', 'description', 'location']

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.all()
        if user and user.is_authenticated:
            queryset = queryset.filter(
                Q(is_private=False) | Q(organizer=user)
            )
        else:
            queryset = queryset.filter(is_private=False)
        return queryset.annotate(likes_count=Count('likes'))

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action == 'retrieve':
            return EventDetailSerializer
        return EventCreateUpdateSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]

        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [
                permissions.IsAuthenticated,
                IsOwnerOrReadOnly
            ]

        else:
            permission_classes = [permissions.AllowAny]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'profile') or self.request.user.profile.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only Event Hosts (admins) are allowed to host events.")
        serializer.save(organizer=self.request.user)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated]
    )
    def like(self, request, pk=None):
        event = self.get_object()
        user = request.user

        like, created = EventLike.objects.get_or_create(
            user=user,
            event=event
        )

        if not created:
            like.delete()
            return Response({
                'detail': 'Event unliked.',
                'liked': False
            })

        return Response({
            'detail': 'Event liked.',
            'liked': True
        })

    @action(
        detail=True,
        methods=['post'],
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[permissions.IsAuthenticated]
    )
    def upload_images(self, request, pk=None):
        event = self.get_object()

        if event.organizer != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        images = request.FILES.getlist('images')

        if not images:
            return Response(
                {'error': 'No images provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_images = []

        for img in images:
            instance = EventImage.objects.create(
                event=event,
                image=img,
                order=0
            )

            new_images.append(
                EventImageSerializer(
                    instance,
                    context={'request': request}
                ).data
            )

        return Response(
            new_images,
            status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=['delete'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='images/(?P<image_id>[^/.]+)'
    )
    def delete_image(self, request, pk=None, image_id=None):
        event = self.get_object()

        if event.organizer != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        image = get_object_or_404(
            EventImage,
            id=image_id,
            event=event
        )

        image.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.AllowAny]
    )
    def recommendations(self, request):
        user = request.user
        events = Event.objects.all()
        if user and user.is_authenticated:
            events = events.filter(
                Q(is_private=False) | Q(organizer=user)
            )
        else:
            events = events.filter(is_private=False)
        events = events.order_by('-created_at')[:6]
        serializer = EventListSerializer(
            events,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)


class TrendingEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        events = Event.objects.annotate(
            likes_count=Count('likes')
        ).filter(
            likes_count__gt=0
        )
        if user and user.is_authenticated:
            events = events.filter(
                Q(is_private=False) | Q(organizer=user)
            )
        else:
            events = events.filter(is_private=False)
        return events.order_by('-likes_count')[:10]


@api_view(['GET'])
@permission_classes([AllowAny])
def nearby_events(request):
    lat = request.query_params.get('lat')
    lng = request.query_params.get('lng')
    radius = request.query_params.get('radius', 10)

    if not lat or not lng:
        return Response(
            {"error": "lat and lng required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        lat = float(lat)
        lng = float(lng)
        radius = float(radius)

    except ValueError:
        return Response(
            {"error": "Invalid coordinates"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = request.user
    if user and user.is_authenticated:
        all_events = Event.objects.filter(
            Q(is_private=False) | Q(organizer=user),
            latitude__isnull=False,
            longitude__isnull=False
        )
    else:
        all_events = Event.objects.filter(
            is_private=False,
            latitude__isnull=False,
            longitude__isnull=False
        )

    nearby = []

    for event in all_events:
        dist = geodesic(
            (lat, lng),
            (event.latitude, event.longitude)
        ).km

        if dist <= radius:
            nearby.append((dist, event))

    nearby.sort(key=lambda x: x[0])

    events = [e for d, e in nearby]

    serializer = EventListSerializer(
        events,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)

from .models import DancePartner
from .serializers import DancePartnerSerializer

class DancePartnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DancePartner.objects.all()
    serializer_class = DancePartnerSerializer
    permission_classes = [permissions.AllowAny]