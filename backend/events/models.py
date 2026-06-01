from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.TextChoices):
    MARRIAGE = 'marriage', 'Marriage'
    HALDI = 'haldi', 'Haldi'
    MEHNDI = 'mehndi', 'Mehndi'
    BIRTHDAY = 'birthday', 'Birthday'
    WEBINAR = 'webinar', 'Webinar'
    CLUB_PARTY = 'club_party', 'Club Party'
    DJ_NIGHT = 'dj_night', 'DJ Night'
    COLLEGE_FEST = 'college_fest', 'College Fest'
    DANCE_CLUB = 'dance_club', 'Dance Club'

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200)
    address = models.TextField(blank=True)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_private = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return self.title

class EventImage(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='events/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.event.title}"

class EventLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')  # one like per user per event

    def __str__(self):
        return f"{self.user.username} likes {self.event.title}"

class DancePartner(models.Model):
    name = models.CharField(max_length=150)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    style = models.CharField(max_length=100)
    bio = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    rating = models.FloatField(default=5.0)

    def __str__(self):
        return self.name