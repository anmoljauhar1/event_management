import razorpay
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db import transaction
from django.http import HttpResponse
import uuid
from datetime import datetime
from .models import (
    EventTicketType, Booking, BookingItem,
    Hall, HallSeat, HallBooking, HallBookingSeat, Payment
)
from .serializers import (
    EventTicketTypeSerializer, BookingSerializer, CreateBookingSerializer,
    HallSerializer, HallBookingCreateSerializer, HallBookingSerializer,
    CancelBookingSerializer, PaymentSerializer
)
from .utils import generate_qr_code, send_booking_confirmation_email
from events.models import Event

# Razorpay client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class EventTicketTypesView(generics.ListAPIView):
    serializer_class = EventTicketTypeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return EventTicketType.objects.filter(event_id=event_id)

class CreateBookingView(generics.CreateAPIView):
    serializer_class = CreateBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items_data = serializer.validated_data['items']

        event_id = request.data.get('event')  # Frontend must send event id
        event = get_object_or_404(Event, id=event_id)

        # Calculate total and reserve tickets
        total = 0
        with transaction.atomic():
            booking = Booking.objects.create(
                user=request.user,
                event=event,
                total_amount=0,  # will update
                status='pending'
            )
            for item in items_data:
                ticket_type_id = item['ticket_type_id']
                quantity = item['quantity']
                tt = EventTicketType.objects.select_for_update().get(id=ticket_type_id)
                # Double-check availability
                if tt.available < quantity:
                    raise serializers.ValidationError(f"Insufficient tickets for {tt.name}.")
                unit_price = tt.price
                tt.available -= quantity
                tt.save()
                BookingItem.objects.create(
                    booking=booking,
                    ticket_type=tt,
                    quantity=quantity,
                    unit_price=unit_price
                )
                total += unit_price * quantity
            booking.total_amount = total
            booking.save()

        # If total is 0 (free event), confirm immediately
        if total == 0:
            booking.status = 'confirmed'
            generate_qr_code(booking)
            send_booking_confirmation_email(booking)
            booking.save()

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'booking_id'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class BookingHistoryView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

class CancelBookingView(generics.UpdateAPIView):
    serializer_class = CancelBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()
    lookup_field = 'booking_id'

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.user != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        if booking.status != 'confirmed':
            return Response({"error": "Only confirmed bookings can be cancelled."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Restore ticket availability
        with transaction.atomic():
            for item in booking.items.all():
                tt = item.ticket_type
                tt.available += item.quantity
                tt.save()
            booking.status = 'cancelled'
            booking.save()
        return Response(BookingSerializer(booking).data)

# Razorpay payment views
class CreateRazorpayOrderView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Expect booking_id or hall_booking_id and type
        booking_type = request.data.get('type')  # 'event' or 'hall'
        booking_id = request.data.get('booking_id')
        amount = request.data.get('amount')  # in smallest currency unit (paise)

        if not booking_type or not booking_id or not amount:
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Razorpay order
        order_data = {
            'amount': int(amount) * 100,  # convert rupees to paise
            'currency': 'INR',
            'receipt': str(booking_id)[:20],
            'payment_capture': 1
        }
        order = client.order.create(order_data)

        # Save payment record
        if booking_type == 'event':
            booking = get_object_or_404(Booking, booking_id=booking_id)
            Payment.objects.create(
                payment_for='event',
                event_booking=booking,
                razorpay_order_id=order['id'],
                amount=amount,
                status='created'
            )
        elif booking_type == 'hall':
            booking = get_object_or_404(HallBooking, booking_id=booking_id)
            Payment.objects.create(
                payment_for='hall',
                hall_booking=booking,
                razorpay_order_id=order['id'],
                amount=amount,
                status='created'
            )
        else:
            return Response({"error": "Invalid type"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key': settings.RAZORPAY_KEY_ID
        })

class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        try:
            client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

        payment = get_object_or_404(Payment, razorpay_order_id=razorpay_order_id)
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'captured'
        payment.save()

        # Confirm the booking
        if payment.payment_for == 'event':
            booking = payment.event_booking
            booking.status = 'confirmed'
            generate_qr_code(booking)
            send_booking_confirmation_email(booking)
            booking.save()
        elif payment.payment_for == 'hall':
            booking = payment.hall_booking
            booking.status = 'confirmed'
            booking.save()
            # Send email for hall booking
            # send_hall_booking_confirmation_email(booking)

        return Response({"status": "success", "message": "Payment verified and booking confirmed."})

# Hall views
class HallListView(generics.ListAPIView):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [permissions.AllowAny]

class HallDetailView(generics.RetrieveAPIView):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [permissions.AllowAny]

class CreateHallBookingView(generics.CreateAPIView):
    serializer_class = HallBookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        hall = Hall.objects.get(id=data['hall'])
        start_time = data['start_time']
        end_time = data['end_time']
        seat_ids = data.get('seat_ids', [])

        # Calculate amount (price per hour * number of hours)
        hours = (end_time - start_time).total_seconds() / 3600
        total_amount = hall.price_per_hour * hours

        with transaction.atomic():
            booking = HallBooking.objects.create(
                user=request.user,
                hall=hall,
                start_time=start_time,
                end_time=end_time,
                total_amount=total_amount,
                status='pending'
            )
            if seat_ids:
                seats = HallSeat.objects.filter(hall=hall, id__in=seat_ids, is_active=True)
                HallBookingSeat.objects.bulk_create([
                    HallBookingSeat(booking=booking, seat=seat) for seat in seats
                ])
        serializer = HallBookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HallBookingListView(generics.ListAPIView):
    serializer_class = HallBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HallBooking.objects.filter(user=self.request.user)

# QR code download view
class DownloadQRCodeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, booking_id=booking_id, user=request.user)
        if not booking.qr_code:
            return Response({"error": "QR code not available"}, status=status.HTTP_404_NOT_FOUND)
        with open(booking.qr_code.path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='image/png')
            response['Content-Disposition'] = f'attachment; filename="ticket_{booking.booking_id}.png"'
            return response

# ICS calendar file generation
from icalendar import Calendar, Event as CalEvent
import pytz

class GenerateCalendarFileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, booking_id=booking_id, user=request.user)
        if booking.status != 'confirmed':
            return Response({"error": "Only confirmed bookings"}, status=status.HTTP_400_BAD_REQUEST)
        cal = Calendar()
        cal.add('prodid', '-//EventPro//EN')
        cal.add('version', '2.0')
        event = CalEvent()
        event.add('summary', f'Event: {booking.event.title}')
        event.add('dtstart', datetime.combine(booking.event.date, booking.event.time))
        event.add('dtend', datetime.combine(booking.event.date, booking.event.time))  # Add duration?
        event.add('location', booking.event.location)
        cal.add_component(event)

        response = HttpResponse(cal.to_ical(), content_type='text/calendar')
        response['Content-Disposition'] = f'attachment; filename="event_{booking.booking_id}.ics"'
        return response

from .models import DancePartnerBooking
from .serializers import DancePartnerBookingSerializer

class DancePartnerBookingViewSet(viewsets.ModelViewSet):
    queryset = DancePartnerBooking.objects.all()
    serializer_class = DancePartnerBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)