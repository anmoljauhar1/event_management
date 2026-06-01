# bookings/constants.py
# Shared status constants to avoid duplication

BOOKING_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('cancelled', 'Cancelled'),
]

PAYMENT_STATUS_CHOICES = [
    ('created', 'Created'),
    ('captured', 'Captured'),
    ('failed', 'Failed'),
]

PAYMENT_FOR_CHOICES = [
    ('event', 'Event Booking'),
    ('hall', 'Hall Booking'),
]

# Default statuses
DEFAULT_BOOKING_STATUS = 'pending'
DEFAULT_PAYMENT_STATUS = 'created'
