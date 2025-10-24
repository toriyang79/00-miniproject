from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Count, Q
from django.http import JsonResponse
from .models import Prompt, Category, PromptUsage
from .serializers import (
    PromptListSerializer,
    PromptDetailSerializer,
    PromptApplyVariablesSerializer,
    CategorySerializer,
    PromptUsageSerializer
)
from .filters import PromptFilter


class CategoryViewSet(viewsets.ModelViewSet):
    """카테고리 CRUD"""
    queryset = Category.objects.annotate(
        prompt_count=Count('prompts')
    ).all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PromptViewSet(viewsets.ModelViewSet):
    """프롬프트 CRUD + 변수 적용"""
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PromptFilter
    search_fields = ['title', 'content', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'use_count', 'last_used']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Prompt.objects.select_related('user', 'category').prefetch_related('tags')

        # 본인 또는 공개 프롬프트만
        if self.request.user.is_authenticated:
            queryset = queryset.filter(
                Q(user=self.request.user) | Q(is_public=True)
            )
        else:
            queryset = queryset.filter(is_public=True)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return PromptListSerializer
        return PromptDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply_variables(self, request, pk=None):
        """
        변수 템플릿에 값을 대입하여 최종 프롬프트 생성

        POST /api/prompts/{id}/apply_variables/
        {
            "variable_values": {
                "language": "Python",
                "feature": "file upload"
            }
        }
        """
        prompt = self.get_object()

        if not prompt.is_template:
            return Response(
                {"error": "This prompt is not a template"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PromptApplyVariablesSerializer(
            data=request.data,
            context={'prompt': prompt}
        )
        serializer.is_valid(raise_exception=True)

        variable_values = serializer.validated_data['variable_values']
        result = prompt.apply_variables(variable_values)

        # 사용 이력 기록
        PromptUsage.objects.create(
            prompt=prompt,
            user=request.user,
            variables_used=variable_values
        )

        # 사용 횟수 증가
        prompt.use_count += 1
        prompt.last_used = timezone.now()
        prompt.save(update_fields=['use_count', 'last_used'])

        return Response({
            "original": prompt.content,
            "variables": variable_values,
            "result": result
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        """즐겨찾기 토글"""
        prompt = self.get_object()

        if prompt.user != request.user:
            return Response(
                {"error": "You can only favorite your own prompts"},
                status=status.HTTP_403_FORBIDDEN
            )

        prompt.is_favorite = not prompt.is_favorite
        prompt.save(update_fields=['is_favorite'])

        return Response({
            "is_favorite": prompt.is_favorite
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_used(self, request, pk=None):
        """프롬프트 사용 기록 (변수 없는 일반 프롬프트용)"""
        prompt = self.get_object()

        # 사용 이력 기록
        PromptUsage.objects.create(
            prompt=prompt,
            user=request.user
        )

        # 사용 횟수 증가
        prompt.use_count += 1
        prompt.last_used = timezone.now()
        prompt.save(update_fields=['use_count', 'last_used'])

        return Response({"status": "recorded"})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        """내 즐겨찾기 목록"""
        favorites = self.get_queryset().filter(
            user=request.user,
            is_favorite=True
        )
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        통합 검색 - 제목, 내용, 태그에서 검색

        GET /api/prompts/search/?q=python
        """
        query = request.query_params.get('q', '')

        if not query:
            return Response([])

        results = self.get_queryset().filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()

        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def export(self, request):
        """
        내 프롬프트를 JSON으로 export

        GET /api/prompts/export/
        """
        prompts = self.get_queryset().filter(user=request.user)

        export_data = []
        for prompt in prompts:
            export_data.append({
                'title': prompt.title,
                'content': prompt.content,
                'category': prompt.category.name if prompt.category else None,
                'tags': list(prompt.tags.names()),
                'is_template': prompt.is_template,
                'variables': prompt.variables,
                'color_label': prompt.color_label,
                'is_favorite': prompt.is_favorite,
                'is_public': prompt.is_public,
            })

        response = JsonResponse({
            'version': '1.0',
            'exported_at': timezone.now().isoformat(),
            'count': len(export_data),
            'prompts': export_data
        }, json_dumps_params={'ensure_ascii': False, 'indent': 2})

        response['Content-Disposition'] = f'attachment; filename="prompts_export_{timezone.now().strftime("%Y%m%d")}.json"'
        return response

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def import_prompts(self, request):
        """
        JSON 파일에서 프롬프트 일괄 import

        POST /api/prompts/import_prompts/
        {
            "prompts": [
                {
                    "title": "...",
                    "content": "...",
                    "category": "Coding",
                    "tags": ["python", "coding"]
                }
            ],
            "overwrite": false
        }
        """
        data = request.data
        prompts_data = data.get('prompts', [])
        overwrite = data.get('overwrite', False)

        imported = 0
        skipped = 0
        errors = []

        for prompt_data in prompts_data:
            try:
                # 카테고리 찾기 or 생성
                category = None
                category_name = prompt_data.get('category')
                if category_name:
                    category, _ = Category.objects.get_or_create(name=category_name)

                # 중복 체크
                existing = Prompt.objects.filter(
                    user=request.user,
                    title=prompt_data['title']
                ).first()

                if existing and not overwrite:
                    skipped += 1
                    continue

                if existing and overwrite:
                    # 업데이트
                    for key, value in prompt_data.items():
                        if key not in ['tags', 'category']:
                            setattr(existing, key, value)
                    existing.category = category
                    existing.save()

                    if 'tags' in prompt_data:
                        existing.tags.set(*prompt_data['tags'])

                    imported += 1
                else:
                    # 새로 생성
                    tags = prompt_data.pop('tags', [])
                    prompt_data.pop('category', None)

                    prompt = Prompt.objects.create(
                        user=request.user,
                        category=category,
                        **prompt_data
                    )

                    if tags:
                        prompt.tags.set(*tags)

                    imported += 1

            except Exception as e:
                errors.append({
                    'title': prompt_data.get('title', 'Unknown'),
                    'error': str(e)
                })

        return Response({
            'status': 'completed',
            'imported': imported,
            'skipped': skipped,
            'errors': errors
        })
