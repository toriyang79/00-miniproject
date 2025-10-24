from django_filters import rest_framework as filters
from .models import Prompt


class PromptFilter(filters.FilterSet):
    """프롬프트 고급 필터"""
    title = filters.CharFilter(lookup_expr='icontains')
    content = filters.CharFilter(lookup_expr='icontains')
    category = filters.NumberFilter(field_name='category__id')
    tags = filters.CharFilter(method='filter_tags')
    is_template = filters.BooleanFilter()
    is_favorite = filters.BooleanFilter()
    color_label = filters.ChoiceFilter(choices=Prompt.LABEL_CHOICES)

    # 날짜 범위
    created_after = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Prompt
        fields = [
            'title', 'content', 'category', 'tags',
            'is_template', 'is_favorite', 'color_label',
            'created_after', 'created_before'
        ]

    def filter_tags(self, queryset, name, value):
        """태그 필터 - 쉼표로 구분된 여러 태그 지원"""
        tags = [tag.strip() for tag in value.split(',')]
        for tag in tags:
            queryset = queryset.filter(tags__name__icontains=tag)
        return queryset
