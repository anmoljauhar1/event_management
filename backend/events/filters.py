import django_filters
from .models import Event, Category
from django.db import models
from django.db.models import Q


class EventFilter(django_filters.FilterSet):
    category = django_filters.ChoiceFilter(choices=Category.choices)
    date = django_filters.DateFilter(field_name='date', lookup_expr='exact')
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Event
        fields = ['category', 'date', 'location']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(description__icontains=value) |
            models.Q(location__icontains=value)
        )