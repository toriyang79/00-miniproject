from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from prompts.models import Prompt, Category, PromptUsage
from prompts.serializers import PromptListSerializer


class AnalyticsView(APIView):
    """사용 통계 대시보드"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """전체 통계"""
        user = request.user

        # 기본 통계
        total_prompts = Prompt.objects.filter(user=user).count()
        total_categories = Category.objects.filter(prompts__user=user).distinct().count()
        total_uses = PromptUsage.objects.filter(user=user).count()
        favorites_count = Prompt.objects.filter(user=user, is_favorite=True).count()

        # 최근 7일 사용 통계
        week_ago = timezone.now() - timedelta(days=7)
        recent_uses = PromptUsage.objects.filter(
            user=user,
            used_at__gte=week_ago
        ).count()

        # 가장 많이 사용한 프롬프트 Top 5
        most_used = Prompt.objects.filter(user=user).order_by('-use_count')[:5]

        # 최근 사용한 프롬프트
        recent_usages = PromptUsage.objects.filter(user=user).select_related('prompt')[:10]

        return Response({
            'overview': {
                'total_prompts': total_prompts,
                'total_categories': total_categories,
                'total_uses': total_uses,
                'favorites_count': favorites_count,
                'recent_uses_7days': recent_uses,
            },
            'most_used': PromptListSerializer(most_used, many=True).data,
            'recent_usages': [{
                'id': usage.id,
                'prompt_id': usage.prompt.id,
                'prompt_title': usage.prompt.title,
                'used_at': usage.used_at,
                'variables_used': usage.variables_used,
            } for usage in recent_usages]
        })


class TrendingPromptsView(APIView):
    """인기 프롬프트"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        기간별 인기 프롬프트

        GET /api/analytics/trending/?period=7d
        period: 24h, 7d, 30d
        """
        period = request.query_params.get('period', '7d')

        if period == '24h':
            date_from = timezone.now() - timedelta(hours=24)
        elif period == '7d':
            date_from = timezone.now() - timedelta(days=7)
        else:  # 30d
            date_from = timezone.now() - timedelta(days=30)

        # 기간 내 사용된 프롬프트
        trending = Prompt.objects.filter(
            usages__used_at__gte=date_from
        ).annotate(
            recent_use_count=Count('usages')
        ).order_by('-recent_use_count')[:10]

        serializer = PromptListSerializer(trending, many=True)
        return Response(serializer.data)
