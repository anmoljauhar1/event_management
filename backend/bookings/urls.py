from django.urls import path
from . import views

urlpatterns = [
    # Event ticket types
    path('events/<int:event_id>/ticket-types/', views.EventTicketTypesView.as_view(), name='event-ticket-types'),
    # Booking endpoints
    path('bookings/create/', views.CreateBookingView.as_view(), name='create-booking'),
    path('bookings/history/', views.BookingHistoryView.as_view(), name='booking-history'),
    path('bookings/<uuid:booking_id>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<uuid:booking_id>/cancel/', views.CancelBookingView.as_view(), name='cancel-booking'),
    path('bookings/<uuid:booking_id>/qr/', views.DownloadQRCodeView.as_view(), name='download-qr'),
    path('bookings/<uuid:booking_id>/calendar/', views.GenerateCalendarFileView.as_view(), name='calendar-file'),
    # Payment
    path('payment/create-order/', views.CreateRazorpayOrderView.as_view(), name='create-order'),
    path('payment/verify/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    # Halls
    path('halls/', views.HallListView.as_view(), name='hall-list'),
    path('halls/<int:pk>/', views.HallDetailView.as_view(), name='hall-detail'),
    path('hall-bookings/create/', views.CreateHallBookingView.as_view(), name='create-hall-booking'),
    path('hall-bookings/history/', views.HallBookingListView.as_view(), name='hall-booking-history'),
    # Dance partner bookings
    path('dance-partners/bookings/', views.DancePartnerBookingViewSet.as_view({'get': 'list', 'post': 'create'}), name='dance-partner-booking-list'),
    path('dance-partners/bookings/<int:pk>/', views.DancePartnerBookingViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='dance-partner-booking-detail'),
]