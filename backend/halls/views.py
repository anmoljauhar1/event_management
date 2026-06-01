from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Venue, Hall, HallImage, HallBooking
from .serializers import VenueSerializer, HallSerializer, HallImageSerializer, HallBookingSerializer
from django.db import transaction
import uuid


class IsAdminOrReadOnly(permissions.BasePermission):
	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		# Allow authenticated users to create (POST) and update their own objects;
		# staff users still have full rights.
		return request.user and request.user.is_authenticated

	def has_object_permission(self, request, view, obj):
		if request.method in permissions.SAFE_METHODS:
			return True
		# Allow staff to modify any object, otherwise only the owner can modify.
		return request.user and (request.user.is_staff or request.user == obj.owner)


class HallViewSet(viewsets.ModelViewSet):
	queryset = Hall.objects.filter(is_active=True).select_related('venue')
	serializer_class = HallSerializer
	permission_classes = [IsAdminOrReadOnly]

	def get_queryset(self):
		qs = Hall.objects.filter(is_active=True).select_related('venue')
		return qs

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)


class HallBookingCreateView(generics.CreateAPIView):
	serializer_class = HallBookingSerializer
	permission_classes = [permissions.IsAuthenticated]

	@transaction.atomic
	def post(self, request, *args, **kwargs):
		data = request.data.copy()
		# assign booking id
		data['booking_id'] = data.get('booking_id') or str(uuid.uuid4()).split('-')[0]
		data['user'] = request.user.id
		serializer = self.get_serializer(data=data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


class VenueViewSet(viewsets.ModelViewSet):
	queryset = Venue.objects.all()
	serializer_class = VenueSerializer
	permission_classes = [IsAdminOrReadOnly]

