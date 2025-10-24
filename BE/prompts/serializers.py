from rest_framework import serializers
from .models import Prompt, Category, PromptUsage
from taggit.serializers import TagListSerializerField, TaggitSerializer


class CategorySerializer(serializers.ModelSerializer):
    prompt_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'prompt_count', 'created_at']


class PromptListSerializer(TaggitSerializer, serializers.ModelSerializer):
    """목록용 간략 Serializer"""
    tags = TagListSerializerField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Prompt
        fields = [
            'id', 'title', 'category', 'category_name',
            'tags', 'color_label', 'is_favorite', 'is_template',
            'use_count', 'last_used', 'username', 'created_at'
        ]


class PromptDetailSerializer(TaggitSerializer, serializers.ModelSerializer):
    """상세용 Serializer - 변수 정보 포함"""
    tags = TagListSerializerField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Prompt
        fields = [
            'id', 'user', 'username', 'title', 'content',
            'category', 'category_name', 'tags',
            'is_template', 'variables',
            'color_label', 'is_favorite', 'is_public',
            'use_count', 'last_used',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'variables', 'use_count', 'last_used']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        validated_data['user'] = self.context['request'].user
        prompt = Prompt.objects.create(**validated_data)
        prompt.tags.set(*tags)
        return prompt


class PromptApplyVariablesSerializer(serializers.Serializer):
    """변수 적용 요청"""
    variable_values = serializers.DictField(
        child=serializers.CharField(),
        help_text="변수명:값 쌍 (예: {'language': 'Python', 'feature': 'file upload'})"
    )

    def validate_variable_values(self, value):
        """필수 변수가 모두 제공되었는지 확인"""
        prompt = self.context.get('prompt')
        if not prompt or not prompt.is_template:
            return value

        required_vars = set(prompt.variables)
        provided_vars = set(value.keys())

        missing = required_vars - provided_vars
        if missing:
            raise serializers.ValidationError(
                f"Missing required variables: {', '.join(missing)}"
            )

        return value


class PromptUsageSerializer(serializers.ModelSerializer):
    prompt_title = serializers.CharField(source='prompt.title', read_only=True)

    class Meta:
        model = PromptUsage
        fields = ['id', 'prompt', 'prompt_title', 'used_at', 'variables_used']
