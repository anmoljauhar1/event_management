from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HallViewSet, VenueViewSet, HallBookingCreateView

router = DefaultRouter()
router.register(r'halls', HallViewSet, basename='hall')
router.register(r'venues', VenueViewSet, basename='venue')

urlpatterns = [
    path('', include(router.urls)),
    path('hall-bookings/create/', HallBookingCreateView.as_view(), name='hall-booking-create'),
]
