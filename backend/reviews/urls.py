from django.urls import path
from . import views

urlpatterns = [
    path('events/<int:event_id>/reviews/', views.EventReviewListCreateView.as_view(), name='event-reviews'),
]