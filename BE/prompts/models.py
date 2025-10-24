from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from taggit.managers import TaggableManager
import re


class Category(models.Model):
    """프롬프트 카테고리"""
    COLOR_CHOICES = [
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('yellow', 'Yellow'),
        ('red', 'Red'),
        ('purple', 'Purple'),
    ]

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='blue')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Prompt(models.Model):
    """프롬프트 모델 - 변수 템플릿 지원"""
    LABEL_CHOICES = [
        ('ready', '🟢 Ready to use'),
        ('draft', '🟡 Draft'),
        ('template', '🔵 Template'),
        ('update', '🔴 Needs Update'),
    ]

    # 기본 정보
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prompts')
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(3)]
    )
    content = models.TextField(
        validators=[MinLengthValidator(10)]
    )

    # 분류
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prompts'
    )
    tags = TaggableManager(blank=True)

    # 템플릿 시스템
    is_template = models.BooleanField(default=False)
    variables = models.JSONField(
        default=list,
        blank=True,
        help_text="템플릿 변수 목록 (예: ['language', 'feature'])"
    )

    # 상태 관리
    color_label = models.CharField(
        max_length=20,
        choices=LABEL_CHOICES,
        default='ready'
    )
    is_favorite = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)

    # 통계
    use_count = models.PositiveIntegerField(default=0)
    last_used = models.DateTimeField(null=True, blank=True)

    # 메타
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['-use_count']),
            models.Index(fields=['is_favorite', '-last_used']),
            models.Index(fields=['category', '-created_at']),
        ]

    def __str__(self):
        return self.title

    def extract_variables(self):
        """프롬프트 내용에서 {{변수}} 추출"""
        pattern = r'\{\{(\w+)\}\}'
        found_vars = re.findall(pattern, self.content)
        return list(set(found_vars))  # 중복 제거

    def save(self, *args, **kwargs):
        """저장 시 자동으로 변수 추출"""
        if self.is_template:
            self.variables = self.extract_variables()
        super().save(*args, **kwargs)

    def apply_variables(self, variable_values: dict) -> str:
        """
        변수에 값을 대입하여 최종 프롬프트 생성

        Args:
            variable_values: {'language': 'Python', 'feature': 'file upload'}

        Returns:
            변수가 대체된 프롬프트 문자열
        """
        result = self.content
        for var_name, var_value in variable_values.items():
            pattern = r'\{\{' + var_name + r'\}\}'
            result = re.sub(pattern, var_value, result)
        return result


class PromptUsage(models.Model):
    """프롬프트 사용 이력"""
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='usages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)
    variables_used = models.JSONField(
        null=True,
        blank=True,
        help_text="사용 시 적용한 변수 값"
    )

    class Meta:
        ordering = ['-used_at']
        indexes = [
            models.Index(fields=['prompt', '-used_at']),
            models.Index(fields=['user', '-used_at']),
        ]

    def __str__(self):
        return f"{self.prompt.title} - {self.used_at}"
