---
name: prompt-library-backend
description: Django REST Framework 기반 프롬프트 관리 서비스 백엔드 개발. 변수 템플릿 시스템, 태그 관리, 검색/필터링, 사용 통계 추적을 포함한 프롬프트 라이브러리 API 구축 시 사용. 단계별 개발 워크플로우와 프롬프트 도메인 특화 기능 제공.
---

# Prompt Library Backend Development

Django REST Framework 기반 프롬프트 관리 서비스 백엔드를 단계별로 개발하기 위한 종합 가이드입니다. 프롬프트 CRUD, 변수 템플릿 시스템, 태그/카테고리 관리, 검색 및 통계 기능을 포함합니다.


## 핵심 원칙

### 개발 철학
- **API 문서 우선 개발**: drf-spectacular를 통한 OpenAPI 문서 기반 개발
- **다층 검증 시스템**: Model Validator → Serializer → View 단계별 검증
- **단계별 승인 프로세스**: 각 단계 완료 시 사용자 테스트 및 승인 필수
- **도메인 기반 설계**: 요구사항에 따른 명확한 앱 분리
- **최신 기술 스택**: 패키지 최신 버전 우선 적용

## 프로젝트 개요

### 핵심 기능
- **프롬프트 관리**: CRUD + 버전 관리
- **변수 템플릿 시스템**: 재사용 가능한 프롬프트 템플릿 (예: `{{language}}`, `{{feature}}`)
- **태그/카테고리**: 유연한 분류 시스템
- **검색 & 필터링**: 제목, 내용, 태그 기반 검색
- **사용 통계**: 사용 빈도, 최근 사용일 추적
- **컬러 라벨**: 프롬프트 상태 관리 (완성/초안/템플릿/수정필요)
- **즐겨찾기**: 자주 쓰는 프롬프트 빠른 접근
- **Export/Import**: JSON 형식 백업/공유

### 기술 스택
- **Framework**: Django 5.0+ / DRF 3.14+
- **인증**: JWT (djangorestframework-simplejwt)
- **태그**: django-taggit
- **API 문서**: drf-spectacular (Swagger UI)
- **검색**: Django Q objects + Full-text search
- **DB**: SQLite (개발) / PostgreSQL (프로덕션)

### 앱 구조
```
prompts/      - 프롬프트 모델 및 CRUD API
categories/   - 카테고리 관리
templates/    - 변수 템플릿 처리
analytics/    - 사용 통계 및 분석
accounts/     - 사용자 인증 (JWT)
```

## 개발 프로세스 (Development Flow)

```
Phase 1: 프로젝트 초기화
  1.1 환경 설정 → 1.2 앱 구조 생성 → 1.3 Swagger 설정
  ↓ [사용자 승인: Swagger UI 접근 확인]

Phase 2: 데이터베이스 설계
  2.1 ERD 설계 → 2.2 모델 구현 → 2.3 Admin 설정
  ↓ [사용자 테스트: Admin에서 데이터 생성]

Phase 3: 인증 시스템
  3.1 JWT 설정 → 3.2 회원가입/로그인 API
  ↓ [사용자 테스트: 토큰 발급 확인]

Phase 4: 프롬프트 CRUD
  4.1 Serializer → 4.2 ViewSet → 4.3 권한 설정
  ↓ [사용자 테스트: 기본 CRUD 작동]

Phase 5: 카테고리 & 태그
  5.1 카테고리 API → 5.2 태그 통합 → 5.3 필터링
  ↓ [사용자 테스트: 카테고리/태그별 조회]

Phase 6: 변수 템플릿 시스템 ⭐
  6.1 템플릿 파싱 → 6.2 변수 추출 → 6.3 변수 대체 API
  ↓ [사용자 테스트: 템플릿 변환]

Phase 7: 검색 & 필터링
  7.1 통합 검색 → 7.2 고급 필터 → 7.3 정렬
  ↓ [사용자 테스트: 검색 정확도]

Phase 8: 통계 시스템
  8.1 사용 횟수 추적 → 8.2 통계 API → 8.3 인기 프롬프트
  ↓ [사용자 테스트: 통계 데이터 확인]

Phase 9: Export/Import
  9.1 JSON Export → 9.2 Bulk Import → 9.3 검증
  ↓ [사용자 테스트: 백업/복원]

Phase 10: 최적화 & 배포
  10.1 쿼리 최적화 → 10.2 PostgreSQL 전환
  ↓ [프로덕션 준비 완료]
```

## Phase 1: 프로젝트 초기화

### 1.0 요구사항 수집

**목표**: 프로젝트 범위 명확화 및 앱 구조 설계

**작업 프로세스**:
1. 사용자와 상세 인터뷰 진행
2. 기능 요구사항 문서화
3. 앱 분리 전략 수립
4. API 엔드포인트 초안 작성

**완료 기준**:
- [ ] 요구사항 문서 작성 완료
- [ ] 앱 구조 다이어그램 완료
- [ ] API 엔드포인트 목록 완료
- [ ] 우선순위 설정 완료

**사용자 승인 요청**:
```
📋 검토 요청:

1. 앱 구조
   [제시한 앱 구조]
   
   적절한가요? 추가/변경 필요한 앱이 있나요?

2. API 엔드포인트
   [엔드포인트 목록]
   
   필요한 API가 모두 포함되었나요?

3. 우선순위
   MVP: [기능 목록]
   Phase 2: [기능 목록]
   
   우선순위가 적절한가요?

승인 시 다음 단계로 진행하겠습니다.
```

### 1.1 환경 설정

**필수 패키지** (requirements.txt):
```
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
drf-spectacular==0.27.1
django-taggit==5.0.1
django-filter==23.5
django-cors-headers==4.3.1
python-dotenv==1.0.1
psycopg2-binary==2.9.9
pytest==7.4.4
pytest-django==4.7.0
```

**환경 변수** (.env.example):
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**프로젝트 생성 명령어**:
```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate      # Windows

# 패키지 설치
pip install -r requirements.txt

# Django 프로젝트 생성
django-admin startproject config .

# 앱 생성
python manage.py startapp prompts
python manage.py startapp categories
python manage.py startapp analytics
python manage.py startapp accounts

# 초기 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 슈퍼유저 생성
python manage.py createsuperuser
```

### 1.2 Settings 구성

**config/settings.py 주요 설정**:
```python
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'drf_spectacular',
    'taggit',
    'django_filters',
    'corsheaders',
    
    # Local apps
    'prompts',
    'categories',
    'analytics',
    'accounts',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Prompt Library API',
    'DESCRIPTION': 'API for managing reusable prompts with variable templates',
    'VERSION': '1.0.0',
}
```

**사용자 테스트**:
```
🧪 환경 설정 확인:

1. 서버 실행
   python manage.py runserver

2. 접속 확인
   ✅ http://127.0.0.1:8000/admin/ - Admin 로그인
   ✅ http://127.0.0.1:8000/api/schema/swagger-ui/ - Swagger UI

승인 시 다음 단계로 진행합니다.
```

---

## Phase 2: 데이터베이스 설계

### 2.1 ERD 설계

**핵심 엔티티**:
- **User**: 사용자 (Django AbstractUser)
- **Prompt**: 프롬프트 본문
- **Category**: 카테고리
- **Tag**: 태그 (django-taggit)
- **PromptUsage**: 사용 이력
- **PromptVersion**: 버전 관리 (선택)

**관계 정의**:
- User ↔ Prompt: 1:N
- Prompt ↔ Category: N:1
- Prompt ↔ Tag: M:N (taggit)
- Prompt ↔ PromptUsage: 1:N

### 2.2 모델 구현

**prompts/models.py**:
```python
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from taggit.managers import TaggableManager
import json
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
```

**마이그레이션**:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2.3 Admin 커스터마이징

**prompts/admin.py**:
```python
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
```

**사용자 테스트**:
```
🧪 모델 & Admin 테스트:

1. Admin 접속
   http://127.0.0.1:8000/admin/

2. 데이터 생성 테스트
   ✅ 카테고리 2-3개 생성
   ✅ 일반 프롬프트 생성
   ✅ 템플릿 프롬프트 생성 (예: "{{language}}로 {{feature}} 코드 작성")
   ✅ 변수가 자동 추출되는지 확인

3. 관계 확인
   ✅ 카테고리별 프롬프트 필터링
   ✅ 태그 추가 및 검색

승인 시 다음 단계로 진행합니다.
```

---

## Phase 3: JWT 인증 시스템

### 3.1 JWT 설정

**config/settings.py**:
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME', 60))),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME', 1440))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
}
```

### 3.2 인증 API

**accounts/serializers.py**:
```python
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
```

**accounts/views.py**:
```python
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    """회원가입"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """프로필 조회/수정"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
```

**accounts/urls.py**:
```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
```

**config/urls.py**:
```python
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

**사용자 테스트**:
```
🧪 인증 테스트:

1. Swagger UI 접속
   http://127.0.0.1:8000/api/schema/swagger-ui/

2. 회원가입
   POST /api/auth/register/
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "SecurePass123!",
     "password2": "SecurePass123!"
   }
   ✅ 201 Created

3. 로그인
   POST /api/auth/login/
   {
     "username": "testuser",
     "password": "SecurePass123!"
   }
   ✅ access, refresh 토큰 발급

4. 프로필 조회 (인증 필요)
   GET /api/auth/profile/
   Header: Authorization: Bearer {access_token}
   ✅ 사용자 정보 반환

승인 시 다음 단계로 진행합니다.
```

---

## Phase 4: 프롬프트 CRUD API

### 4.1 Serializer

**prompts/serializers.py**:
```python
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
```

### 4.2 ViewSet

**prompts/views.py**:
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.utils import timezone
from django.db.models import Count
from .models import Prompt, Category, PromptUsage
from .serializers import (
    PromptListSerializer,
    PromptDetailSerializer,
    PromptApplyVariablesSerializer,
    CategorySerializer,
    PromptUsageSerializer
)

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
    
    def get_queryset(self):
        queryset = Prompt.objects.select_related('user', 'category').prefetch_related('tags')
        
        # 본인 또는 공개 프롬프트만
        if self.request.user.is_authenticated:
            queryset = queryset.filter(
                models.Q(user=self.request.user) | models.Q(is_public=True)
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
```

### 4.3 URL 라우팅

**prompts/urls.py**:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PromptViewSet, CategoryViewSet

router = DefaultRouter()
router.register('prompts', PromptViewSet, basename='prompt')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
```

**config/urls.py 업데이트**:
```python
urlpatterns = [
    # ... 기존 URL
    path('api/', include('prompts.urls')),
]
```

**사용자 테스트**:
```
🧪 프롬프트 CRUD 테스트:

1. 카테고리 생성
   POST /api/categories/
   {
     "name": "Coding",
     "description": "프로그래밍 관련",
     "color": "blue"
   }

2. 프롬프트 생성
   POST /api/prompts/
   Header: Authorization: Bearer {token}
   {
     "title": "Code Review Expert",
     "content": "Please review this {{language}} code...",
     "category": 1,
     "tags": ["coding", "review"],
     "is_template": true,
     "color_label": "ready"
   }
   ✅ variables 자동 추출: ["language"]

3. 프롬프트 목록 조회
   GET /api/prompts/
   ✅ 본인 + 공개 프롬프트 조회

4. 변수 적용
   POST /api/prompts/1/apply_variables/
   {
     "variable_values": {
       "language": "Python"
     }
   }
   ✅ 변수가 대체된 최종 프롬프트 반환

5. 즐겨찾기
   POST /api/prompts/1/toggle_favorite/
   ✅ is_favorite 토글

승인 시 다음 단계로 진행합니다.
```

---

## Phase 5: 검색 & 필터링

### 5.1 필터 설정

**prompts/filters.py**:
```python
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
```

### 5.2 검색 기능

**prompts/views.py에 추가**:
```python
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .filters import PromptFilter

class PromptViewSet(viewsets.ModelViewSet):
    # ... 기존 코드
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = PromptFilter
    search_fields = ['title', 'content', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'use_count', 'last_used']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        통합 검색 - 제목, 내용, 태그에서 검색
        
        GET /api/prompts/search/?q=python
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response([])
        
        from django.db.models import Q
        
        results = self.get_queryset().filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()
        
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)
```

**사용자 테스트**:
```
🧪 검색 & 필터링 테스트:

1. 제목 검색
   GET /api/prompts/?title=review
   ✅ 제목에 "review" 포함된 프롬프트

2. 통합 검색
   GET /api/prompts/search/?q=python
   ✅ 제목, 내용, 태그에서 검색

3. 카테고리 필터
   GET /api/prompts/?category=1
   ✅ 특정 카테고리 프롬프트

4. 태그 필터
   GET /api/prompts/?tags=coding,python
   ✅ 여러 태그 동시 필터

5. 템플릿만 조회
   GET /api/prompts/?is_template=true
   ✅ 템플릿 프롬프트만

6. 정렬
   GET /api/prompts/?ordering=-use_count
   ✅ 사용 횟수 많은 순

7. 복합 필터
   GET /api/prompts/?category=1&is_favorite=true&ordering=-created_at
   ✅ 여러 조건 동시 적용

승인 시 다음 단계로 진행합니다.
```

---

## Phase 6: 통계 시스템

### 6.1 통계 API

**analytics/views.py**:
```python
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Q
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
```

**analytics/urls.py**:
```python
from django.urls import path
from .views import AnalyticsView, TrendingPromptsView

urlpatterns = [
    path('overview/', AnalyticsView.as_view(), name='analytics-overview'),
    path('trending/', TrendingPromptsView.as_view(), name='trending-prompts'),
]
```

**config/urls.py 업데이트**:
```python
urlpatterns = [
    # ... 기존 URL
    path('api/analytics/', include('analytics.urls')),
]
```

**사용자 테스트**:
```
🧪 통계 테스트:

1. 전체 통계
   GET /api/analytics/overview/
   ✅ 프롬프트 수, 카테고리 수, 사용 횟수
   ✅ 가장 많이 사용한 프롬프트 Top 5
   ✅ 최근 사용 이력

2. 인기 프롬프트 (24시간)
   GET /api/analytics/trending/?period=24h
   ✅ 최근 24시간 많이 사용된 프롬프트

3. 인기 프롬프트 (7일)
   GET /api/analytics/trending/?period=7d
   ✅ 최근 7일 트렌드

승인 시 다음 단계로 진행합니다.
```

---

## Phase 7: Export / Import

### 7.1 Export API

**prompts/views.py에 추가**:
```python
import json
from django.http import JsonResponse

class PromptViewSet(viewsets.ModelViewSet):
    # ... 기존 코드
    
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
                        if key != 'tags':
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
```

**사용자 테스트**:
```
🧪 Export/Import 테스트:

1. Export
   GET /api/prompts/export/
   ✅ JSON 파일 다운로드
   ✅ 모든 프롬프트 데이터 포함

2. Import (신규)
   POST /api/prompts/import_prompts/
   {
     "prompts": [
       {
         "title": "New Prompt",
         "content": "...",
         "category": "Writing",
         "tags": ["blog"],
         "is_template": false
       }
     ],
     "overwrite": false
   }
   ✅ 새 프롬프트 생성

3. Import (덮어쓰기)
   POST /api/prompts/import_prompts/
   {
     "prompts": [...],
     "overwrite": true
   }
   ✅ 기존 프롬프트 업데이트

승인 시 다음 단계로 진행합니다.
```

---

## Phase 8: 최적화 & 프로덕션 준비

### 8.1 쿼리 최적화

**prompts/views.py 업데이트**:
```python
class PromptViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # select_related: ForeignKey
        # prefetch_related: ManyToMany, reverse ForeignKey
        queryset = Prompt.objects.select_related(
            'user', 
            'category'
        ).prefetch_related(
            'tags',
            'usages'
        )
        
        # ... 필터링 로직
        
        return queryset
```

### 8.2 PostgreSQL 전환

**.env 파일 수정**:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=prompt_library_db
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

**config/settings.py**:
```python
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
    }
}
```

**마이그레이션**:
```bash
# PostgreSQL 데이터베이스 생성
createdb prompt_library_db

# 마이그레이션 실행
python manage.py migrate

# 슈퍼유저 재생성
python manage.py createsuperuser
```

### 8.3 CORS 설정

**config/settings.py**:
```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True
```

**사용자 테스트**:
```
🧪 최종 검증:

1. PostgreSQL 연결 확인
   python manage.py runserver
   ✅ 서버 정상 실행

2. 전체 기능 테스트
   ✅ 회원가입/로그인
   ✅ 프롬프트 CRUD
   ✅ 카테고리/태그 관리
   ✅ 변수 템플릿 적용
   ✅ 검색/필터링
   ✅ 통계 조회
   ✅ Export/Import

3. 성능 확인
   ✅ 목록 조회 속도 (< 200ms)
   ✅ 검색 응답 속도

모두 정상이면 프로덕션 준비 완료!
```

---

## API 엔드포인트 요약

### 인증
```
POST   /api/auth/register/          - 회원가입
POST   /api/auth/login/              - 로그인 (토큰 발급)
POST   /api/auth/token/refresh/      - 토큰 갱신
GET    /api/auth/profile/            - 내 프로필 조회
PATCH  /api/auth/profile/            - 프로필 수정
```

### 프롬프트
```
GET    /api/prompts/                 - 프롬프트 목록
POST   /api/prompts/                 - 프롬프트 생성
GET    /api/prompts/{id}/            - 프롬프트 상세
PUT    /api/prompts/{id}/            - 프롬프트 수정
DELETE /api/prompts/{id}/            - 프롬프트 삭제

GET    /api/prompts/search/?q=...    - 통합 검색
GET    /api/prompts/favorites/       - 내 즐겨찾기
POST   /api/prompts/{id}/toggle_favorite/  - 즐겨찾기 토글
POST   /api/prompts/{id}/apply_variables/  - 변수 적용
POST   /api/prompts/{id}/mark_used/  - 사용 기록

GET    /api/prompts/export/          - Export JSON
POST   /api/prompts/import_prompts/  - Import JSON
```

### 카테고리
```
GET    /api/categories/              - 카테고리 목록
POST   /api/categories/              - 카테고리 생성
PUT    /api/categories/{id}/         - 카테고리 수정
DELETE /api/categories/{id}/         - 카테고리 삭제
```

### 통계
```
GET    /api/analytics/overview/      - 전체 통계
GET    /api/analytics/trending/?period=7d  - 인기 프롬프트
```

### 필터링 & 정렬 예시
```
GET /api/prompts/?category=1&is_template=true&ordering=-use_count
GET /api/prompts/?tags=coding,python&is_favorite=true
GET /api/prompts/?title=review&created_after=2024-01-01
```

---

## 핵심 기능 구현 팁

### 1. 변수 템플릿 시스템

**프론트엔드 연동 예시**:
```javascript
// 1. 템플릿 생성
POST /api/prompts/
{
  "title": "Code Generator",
  "content": "Write {{language}} code for {{feature}} with {{framework}}",
  "is_template": true
}

// 2. 변수 자동 추출
Response: {
  "variables": ["language", "feature", "framework"]
}

// 3. 사용 시 변수 입력
POST /api/prompts/1/apply_variables/
{
  "variable_values": {
    "language": "Python",
    "feature": "file upload",
    "framework": "Django"
  }
}

// 4. 최종 프롬프트 생성
Response: {
  "result": "Write Python code for file upload with Django"
}
```

### 2. 사용 통계 자동 추적

**mark_used vs apply_variables**:
- `mark_used`: 일반 프롬프트 사용 시
- `apply_variables`: 템플릿 프롬프트 사용 시 (자동 기록)

둘 다 `use_count` 증가 + `last_used` 업데이트 + `PromptUsage` 레코드 생성

### 3. 태그 시스템

**django-taggit 활용**:
```python
# 태그 추가
prompt.tags.add("python", "coding")

# 태그 조회
prompt.tags.all()  # QuerySet

# 태그별 필터링
Prompt.objects.filter(tags__name__in=["python"])
```

---

## 추가 개선 아이디어

### 프로젝트 완성 후 검토 가능한 기능들:

1. **프롬프트 버전 관리**
   - 수정 히스토리 저장
   - 이전 버전으로 롤백

2. **프롬프트 공유**
   - 공개 프롬프트 갤러리
   - 다른 사용자 프롬프트 북마크

3. **팀 워크스페이스**
   - 팀별 프롬프트 공유
   - 권한 관리

4. **AI 기능**
   - 프롬프트 자동 개선 제안
   - 유사 프롬프트 추천

5. **고급 검색**
   - Elasticsearch 연동
   - 자동완성

6. **브라우저 확장**
   - 원클릭으로 현재 페이지에 프롬프트 적용
   - ChatGPT/Claude 연동

---

## 프로토콜

### 단계 시작 시
```
📍 Phase X - 단계명

목표: [목표 설명]
작업: [작업 목록]

시작하겠습니다.
```

### 단계 완료 시
```
✅ Phase X 완료

구현 완료:
- [기능 1]
- [기능 2]

🧪 테스트 방법:
[Swagger UI에서 테스트하는 구체적인 방법]

승인해주시면 다음 단계로 진행합니다.
```

---

## 트러블슈팅

### 1. 태그 검색 안 됨
```python
# 잘못된 방법
Prompt.objects.filter(tags='python')

# 올바른 방법
Prompt.objects.filter(tags__name__icontains='python')
```

### 2. 변수 추출 실패
- `{{variable}}` 형식 확인
- 공백 없이 작성: `{{language}}` ✅, `{{ language }}` ❌

### 3. CORS 오류
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

### 4. JWT 토큰 만료
- Access Token 갱신: `/api/auth/token/refresh/`
- Refresh Token 재발급

---

## 리소스

### 공식 문서
- Django: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/
- django-taggit: https://django-taggit.readthedocs.io/
- drf-spectacular: https://drf-spectacular.readthedocs.io/

### 추천 도구
- **Postman**: API 테스트
- **DB Browser for SQLite**: SQLite DB 관리
- **pgAdmin**: PostgreSQL 관리

---

