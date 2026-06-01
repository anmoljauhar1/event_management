from django.urls import path
from . import views

urlpatterns = [
    path('chat/<int:room_id>/messages/', views.ChatRoomMessagesView.as_view(), name='chat-messages'),
]