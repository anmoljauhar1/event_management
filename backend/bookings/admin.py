from django.contrib import admin
from .models import (
    EventTicketType, Booking, BookingItem,
    Hall, HallSeat, HallBooking, HallBookingSeat, Payment
)

admin.site.register(EventTicketType)
admin.site.register(Booking)
admin.site.register(BookingItem)
admin.site.register(Hall)
admin.site.register(HallSeat)
admin.site.register(HallBooking)
admin.site.register(HallBookingSeat)
admin.site.register(Payment)