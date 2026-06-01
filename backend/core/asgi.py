import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from chat import consumers as chat_consumers
from notifications import consumers as notif_consumers
from bookings import consumers as booking_consumers  # for live seat availability

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/chat/<room_id>/', chat_consumers.ChatConsumer.as_asgi()),
            path('ws/notifications/', notif_consumers.NotificationConsumer.as_asgi()),
            path('ws/seat-availability/<hall_id>/', booking_consumers.SeatAvailabilityConsumer.as_asgi()),
        ])
    ),
})