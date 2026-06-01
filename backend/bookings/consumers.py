import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import HallSeat, SeatReservation, Hall

class SeatAvailabilityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.hall_id = self.scope['url_route']['kwargs']['hall_id']
        self.group_name = f"hall_{self.hall_id}_seats"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        # Send initial seat status
        await self.send_seat_status()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        seat_id = data.get('seat_id')
        if action == 'select':
            await self.select_seat(seat_id)
        elif action == 'release':
            await self.release_seat(seat_id)

    @database_sync_to_async
    def select_seat(self, seat_id):
        user = self.scope['user']
        if user.is_anonymous:
            return
        # Check if seat is already reserved (active reservations not expired)
        now = timezone.now()
        active_res = SeatReservation.objects.filter(
            hall_seat_id=seat_id,
            expires_at__gt=now
        ).exists()
        if active_res:
            return  # already taken
        # Create reservation for this user with a session (for simplicity, use hall_id + user.id)
        session_id = f"{self.hall_id}_{user.id}"
        SeatReservation.objects.create(
            hall_seat_id=seat_id,
            user=user,
            booking_session=session_id,
            expires_at=now + timezone.timedelta(minutes=10)  # 10-minute hold
        )
        # Broadcast updated seat status
        self.group_send_seat_status()

    async def group_send_seat_status(self):
        await self.channel_layer.group_send(
            self.group_name,
            {'type': 'seat_status_update'}
        )

    async def seat_status_update(self, event):
        await self.send_seat_status()

    async def send_seat_status(self):
        seats_status = await self.get_seats_status()
        await self.send(text_data=json.dumps(seats_status))

    @database_sync_to_async
    def get_seats_status(self):
        now = timezone.now()
        hall_seats = HallSeat.objects.filter(hall_id=self.hall_id)
        reserved_seats = SeatReservation.objects.filter(
            hall_seat__hall_id=self.hall_id,
            expires_at__gt=now
        ).values_list('hall_seat_id', flat=True)
        seats = []
        for seat in hall_seats:
            seats.append({
                'id': seat.id,
                'row': seat.row,
                'number': seat.number,
                'is_active': seat.is_active,
                'reserved': seat.id in reserved_seats
            })
        return seats