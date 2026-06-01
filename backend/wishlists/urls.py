from django.urls import path
from . import views

urlpatterns = [
    path('wishlist/', views.WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/toggle/<int:event_id>/', views.WishlistToggleView.as_view(), name='wishlist-toggle'),
]