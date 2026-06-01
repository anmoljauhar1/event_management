# chat/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from events.models import Event
from .models import ChatRoom

@receiver(post_save, sender=Event)
def create_chat_room(sender, instance, created, **kwargs):
    if created:
        ChatRoom.objects.get_or_create(event=instance)