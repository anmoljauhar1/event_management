from rest_framework import serializers
from .models import (
    EventTicketType, Booking, BookingItem,
    Hall, HallSeat, HallBooking, HallBookingSeat, Payment
)
from django.utils import timezone
from django.core.mail import send_mail
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
import uuid
from django.conf import settings

class EventTicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTicketType
        fields = ('id', 'name', 'price', 'quantity', 'available')

class BookingItemSerializer(serializers.ModelSerializer):
    ticket_type = EventTicketTypeSerializer(read_only=True)

    class Meta:
        model = BookingItem
        fields = ('id', 'ticket_type', 'quantity', 'unit_price')

class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True, read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'booking_id', 'event', 'event_title', 'event_date',
                  'status', 'total_amount', 'qr_code', 'items', 'created_at')

class CreateBookingSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField(min_value=1)
        )
    )  # format: [{"ticket_type_id": quantity}, ...]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one ticket must be selected.")
        for item in value:
            ticket_type_id = item.get('ticket_type_id')
            quantity = item.get('quantity')
            if not ticket_type_id or not quantity:
                raise serializers.ValidationError("Each item must have ticket_type_id and quantity.")
            # Check ticket type exists and availability
            try:
                tt = EventTicketType.objects.get(id=ticket_type_id)
            except EventTicketType.DoesNotExist:
                raise serializers.ValidationError(f"Ticket type {ticket_type_id} does not exist.")
            if tt.available < quantity:
                raise serializers.ValidationError(
                    f"Not enough tickets for {tt.name}. Available: {tt.available}, requested: {quantity}."
                )
        return value

class CancelBookingSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)

# Hall serializers
class HallSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = HallSeat
        fields = ('id', 'row', 'number', 'is_active')

class HallSerializer(serializers.ModelSerializer):
    seats = HallSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Hall
        fields = '__all__'

class HallBookingCreateSerializer(serializers.Serializer):
    hall = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    seat_ids = serializers.ListField(child=serializers.IntegerField(), required=False)

    def validate(self, data):
        # Check hall exists
        hall_id = data['hall']
        try:
            hall = Hall.objects.get(id=hall_id)
        except Hall.DoesNotExist:
            raise serializers.ValidationError("Hall not found.")
        # Check time conflicts
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")
        # Check overlapping bookings
        existing = HallBooking.objects.filter(
            hall=hall,
            status='confirmed',
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time']
        ).exists()
        if existing:
            raise serializers.ValidationError("Hall is already booked for the requested time slot.")
        # Check seats validity (if provided)
        seat_ids = data.get('seat_ids', [])
        if seat_ids:
            seats = HallSeat.objects.filter(hall=hall, id__in=seat_ids, is_active=True)
            if seats.count() != len(seat_ids):
                raise serializers.ValidationError("One or more seats are invalid or inactive.")
            # Check if any seat is already booked for this time
            already_booked = HallBookingSeat.objects.filter(
                booking__hall=hall,
                booking__status='confirmed',
                booking__start_time__lt=data['end_time'],
                booking__end_time__gt=data['start_time'],
                seat__id__in=seat_ids
            ).exists()
            if already_booked:
                raise serializers.ValidationError("Some selected seats are already booked for this time.")
        return data

class HallBookingSerializer(serializers.ModelSerializer):
    hall_name = serializers.CharField(source='hall.name', read_only=True)
    selected_seats = HallSeatSerializer(source='hallbookingseat_set', many=True, read_only=True)  # Correct related_name? related_name is 'selected_seats'
    class Meta:
        model = HallBooking
        fields = '__all__'

# Payment serializers
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

from .models import DancePartnerBooking
from events.serializers import DancePartnerSerializer

class DancePartnerBookingSerializer(serializers.ModelSerializer):
    partner_details = DancePartnerSerializer(source='partner', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DancePartnerBooking
        fields = '__all__'
        read_only_fields = ('user',)