from django.db import models
from django.contrib.auth.models import User
from events.models import Event
from django.core.validators import MinValueValidator
import uuid
from .constants import BOOKING_STATUS_CHOICES, PAYMENT_FOR_CHOICES, DEFAULT_BOOKING_STATUS, DEFAULT_PAYMENT_STATUS

class EventTicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(max_length=100)  # e.g., General, VIP
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity = models.PositiveIntegerField()  # total tickets available
    available = models.PositiveIntegerField(blank=True, null=True)  # dynamically updated

    def save(self, *args, **kwargs):
        if self.available is None:
            self.available = self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.event.title} - {self.name}"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    booking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default=DEFAULT_BOOKING_STATUS)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    qr_code = models.ImageField(upload_to='tickets/qr/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking {self.booking_id} by {self.user.username}"

class BookingItem(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    ticket_type = models.ForeignKey(EventTicketType, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot price

    def __str__(self):
        return f"{self.quantity}x {self.ticket_type.name}"

class Hall(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    capacity = models.PositiveIntegerField()
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='halls/', blank=True, null=True)

    def __str__(self):
        return self.name

class HallSeat(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='seats')
    row = models.CharField(max_length=10)
    number = models.CharField(max_length=10)
    # seat might be unavailable if under maintenance
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('hall', 'row', 'number')

    def __str__(self):
        return f"{self.row}-{self.number}"

class HallBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hall_bookings')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='bookings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default=DEFAULT_BOOKING_STATUS)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    booking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class HallBookingSeat(models.Model):
    booking = models.ForeignKey(HallBooking, on_delete=models.CASCADE, related_name='selected_seats')
    seat = models.ForeignKey(HallSeat, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('booking', 'seat')

class Payment(models.Model):
    payment_for = models.CharField(max_length=10, choices=PAYMENT_FOR_CHOICES)
    event_booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    hall_booking = models.ForeignKey(HallBooking, on_delete=models.SET_NULL, null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default=DEFAULT_PAYMENT_STATUS)  # created, captured, failed
    created_at = models.DateTimeField(auto_now_add=True)

class SeatReservation(models.Model):
    hall_seat = models.ForeignKey(HallSeat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_session = models.UUIDField()  # unique session for this reservation
    reserved_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        unique_together = ('hall_seat', 'booking_session')

class DancePartnerBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='partner_bookings')
    partner = models.ForeignKey('events.DancePartner', on_delete=models.CASCADE, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='partner_bookings')
    status = models.CharField(max_length=20, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} booked {self.partner.name} for {self.event.title}"