from django.contrib import admin
from .models import Venue, Hall, HallImage, HallBooking


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'contact_phone', 'contact_email')
    search_fields = ('name', 'location')


class HallImageInline(admin.TabularInline):
    model = HallImage
    extra = 1


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'location', 'capacity', 'price_per_day', 'is_active')
    list_filter = ('is_active', 'category', 'owner')
    search_fields = ('name', 'location', 'owner__username')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [HallImageInline]


@admin.register(HallBooking)
class HallBookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'hall', 'user', 'event_name', 'event_date', 'status', 'total_price')
    list_filter = ('status', 'payment_status', 'event_date')
    search_fields = ('booking_id', 'event_name', 'user__username', 'hall__name')
    readonly_fields = ('created_at', 'confirmed_at', 'updated_at')

