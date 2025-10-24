from django.urls import path
from .views import AnalyticsView, TrendingPromptsView

urlpatterns = [
    path('overview/', AnalyticsView.as_view(), name='analytics-overview'),
    path('trending/', TrendingPromptsView.as_view(), name='trending-prompts'),
]
