from django.contrib import admin
from .models import Prompt, Category, PromptUsage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'prompt_count', 'created_at']
    search_fields = ['name']
    list_filter = ['color']

    def prompt_count(self, obj):
        return obj.prompts.count()
    prompt_count.short_description = 'Prompts'


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'user',
        'category',
        'color_label',
        'is_template',
        'is_favorite',
        'use_count',
        'created_at'
    ]
    list_filter = [
        'color_label',
        'is_template',
        'is_favorite',
        'category',
        'created_at'
    ]
    search_fields = ['title', 'content']
    readonly_fields = ['use_count', 'last_used', 'variables', 'created_at', 'updated_at']

    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'title', 'content')
        }),
        ('분류', {
            'fields': ('category', 'tags')
        }),
        ('템플릿', {
            'fields': ('is_template', 'variables'),
            'description': '변수는 {{변수명}} 형식으로 작성하면 자동 추출됩니다.'
        }),
        ('상태', {
            'fields': ('color_label', 'is_favorite', 'is_public')
        }),
        ('통계', {
            'fields': ('use_count', 'last_used', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PromptUsage)
class PromptUsageAdmin(admin.ModelAdmin):
    list_display = ['prompt', 'user', 'used_at']
    list_filter = ['used_at']
    search_fields = ['prompt__title', 'user__username']
    readonly_fields = ['used_at']
