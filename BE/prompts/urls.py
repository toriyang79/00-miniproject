from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PromptViewSet, CategoryViewSet

router = DefaultRouter()
router.register('prompts', PromptViewSet, basename='prompt')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
