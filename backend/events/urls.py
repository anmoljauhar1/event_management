from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TrendingEventsView, DancePartnerViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'dance-partners', DancePartnerViewSet, basename='dance-partner')

urlpatterns = [
    path('events/trending/', TrendingEventsView.as_view(), name='trending-events'),
    path('', include(router.urls)),
]