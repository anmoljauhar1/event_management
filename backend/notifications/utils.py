from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

def send_notification(user, message, link=''):
    notif = Notification.objects.create(user=user, message=message, link=link)
    # Push via WebSocket to the user's group
    channel_layer = get_channel_layer()
    group_name = f"user_{user.id}_notifications"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'notification_message',
            'message': message,
            'link': link,
            'id': notif.id,
        }
    )