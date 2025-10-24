---
name: drf-react-secure-frontend
description: Django REST Framework 백엔드와 연동되는 보안 강화 React 프론트엔드 개발. BE API 분석부터 요구사항 도출, 보안 설정(XSS/CSRF 방어, JWT 인증), 환경설정 분리, 성능 최적화까지 단계별 승인 프로세스로 진행. Vite+Axios 기반 프로덕션급 웹앱 구축.
version: 2.0.0
---

# DRF-React Secure Frontend Development

Django REST Framework 백엔드와 연동되는 보안 강화 React 프론트엔드를 단계별 승인 프로세스로 개발하는 종합 가이드입니다. **모든 커맨드는 사용자가 직접 수행하며**, Claude는 각 단계를 안내하고 검증합니다.

## 🎯 스킬 목적

이 스킬은 다음과 같은 상황에서 자동으로 활성화됩니다:
- DRF(Django REST Framework) 백엔드와 React 프론트엔드 연동 작업
- 보안이 강화된 프로덕션급 웹 애플리케이션 개발
- JWT 인증, XSS/CSRF 방어가 필요한 프로젝트
- 단계별 검토와 승인이 필요한 체계적인 개발 프로세스

## 🏗️ 프로젝트 개요

### 백엔드 환경 (제공된 정보)
```yaml
서버 주소: http://127.0.0.1:8000
인증 방식: JWT (access/refresh token)
주요 엔드포인트:
  - 회원가입: POST /api/auth/register/
  - 로그인: POST /api/auth/login/
  - 프롬프트 목록: GET /api/prompts/
  - 프롬프트 생성: POST /api/prompts/
API 문서: http://127.0.0.1:8000/api/schema/swagger-ui/
CORS: localhost:3000, localhost:5173 허용됨
```

### 기술 스택
```yaml
Framework: React 18+ with TypeScript
Build Tool: Vite 6+
HTTP Client: Axios
State Management: Zustand / React Context API
Styling: Tailwind CSS 3+
Routing: React Router v6
Security: 
  - JWT 인증
  - XSS/CSRF 방어
  - 환경변수 암호화
  - 의존성 보안 스캔
Optimization:
  - Code Splitting & Lazy Loading
  - React.memo, useMemo, useCallback
  - Image/Media 최적화
  - Bundle Size 최적화
```

## 📋 개발 프로세스 (Development Workflow)

```
┌─────────────────────────────────────────────────────┐
│ Phase 0: 프로젝트 분석 & 요구사항 도출              │
│  0.1 BE API 분석                                    │
│  0.2 요구사항 도출 및 정리                          │
│  0.3 디자인 분석 (선택)                             │
│  ↓ [사용자 승인: 요구사항 문서 확정]                │
├─────────────────────────────────────────────────────┤
│ Phase 1: 프로젝트 초기화 & 보안 설정               │
│  1.1 Vite 프로젝트 생성 (사용자 실행)              │
│  1.2 환경변수 설정 (.env 분리)                     │
│  1.3 보안 설정 (CSP, HTTPS)                        │
│  ↓ [사용자 승인: 기본 설정 완료]                   │
├─────────────────────────────────────────────────────┤
│ Phase 2: API 연동 레이어 (보안 강화)               │
│  2.1 Axios 인스턴스 설정                            │
│  2.2 JWT 인터셉터 (토큰 관리)                      │
│  2.3 CSRF 토큰 처리                                 │
│  2.4 XSS 방어 유틸리티                              │
│  ↓ [사용자 테스트: API 호출 성공]                  │
├─────────────────────────────────────────────────────┤
│ Phase 3: 인증 시스템 (보안 중심)                   │
│  3.1 로그인/회원가입 폼                             │
│  3.2 Secure Storage (토큰 저장)                    │
│  3.3 Protected Routes                               │
│  3.4 권한 관리 (RBAC)                               │
│  ↓ [사용자 테스트: 인증 흐름 검증]                 │
├─────────────────────────────────────────────────────┤
│ Phase 4: 레이아웃 & 컴포넌트                        │
│  4.1 레이아웃 구조                                  │
│  4.2 재사용 컴포넌트                                │
│  4.3 반응형 디자인                                  │
│  ↓ [사용자 승인: UI/UX 확인]                       │
├─────────────────────────────────────────────────────┤
│ Phase 5-8: 핵심 기능 개발                           │
│  (프롬프트 CRUD, 검색, 필터링 등)                   │
│  ↓ [각 단계별 사용자 승인]                         │
├─────────────────────────────────────────────────────┤
│ Phase 9: 성능 최적화                                │
│  9.1 렌더링 최적화                                  │
│  9.2 코드 스플리팅 & Lazy Loading                  │
│  9.3 이미지/미디어 최적화                           │
│  9.4 네트워크 최적화                                │
│  9.5 빌드 최적화                                    │
│  ↓ [사용자 승인: 성능 지표 확인]                   │
├─────────────────────────────────────────────────────┤
│ Phase 10: 보안 검증 & 배포 준비                    │
│  10.1 보안 체크리스트                               │
│  10.2 의존성 보안 스캔                              │
│  10.3 프로덕션 빌드                                 │
│  ↓ [최종 승인: 배포 준비 완료]                     │
└─────────────────────────────────────────────────────┘
```

---

## Phase 0: 프로젝트 분석 & 요구사항 도출

### 0.1 백엔드 API 분석

**Claude의 역할**:
사용자가 제공한 Swagger 문서나 API 정보를 기반으로 다음을 분석합니다.

```markdown
## API 분석 리포트

### 1. 인증 엔드포인트
- POST /api/auth/register/
  - 입력: { username, email, password }
  - 출력: { user, tokens }
  
- POST /api/auth/login/
  - 입력: { username/email, password }
  - 출력: { access, refresh }

### 2. 프롬프트 API
- GET /api/prompts/
  - 인증: Bearer Token 필요
  - 쿼리 파라미터: ?search=&category=&tag=
  - 응답: Paginated List

- POST /api/prompts/
  - 인증: Bearer Token 필요
  - 입력: { title, content, category, tags, ... }

### 3. 기타 엔드포인트
- (통계, Export/Import 등)

### 4. 타입 정의 필요 사항
- User 타입
- Prompt 타입
- Category 타입
- API Response 타입
```

**사용자 작업**:
```bash
# Swagger 문서 확인
# http://127.0.0.1:8000/api/schema/swagger-ui/ 접속
# API 엔드포인트 목록 확인
```

### 0.2 요구사항 도출 및 정리

**Claude의 역할**:
백엔드 API를 기반으로 프론트엔드 요구사항을 도출합니다.

```markdown
## 프론트엔드 요구사항 문서

### 기능적 요구사항

#### 1. 사용자 인증
- [ ] 회원가입 (이메일 인증 포함 여부?)
- [ ] 로그인 (소셜 로그인 필요?)
- [ ] 자동 로그인 (Remember Me)
- [ ] 로그아웃
- [ ] 토큰 갱신 (Refresh Token)
- [ ] 비밀번호 재설정

#### 2. 프롬프트 관리
- [ ] 프롬프트 목록 조회 (페이지네이션)
- [ ] 프롬프트 상세 보기
- [ ] 프롬프트 생성
- [ ] 프롬프트 수정
- [ ] 프롬프트 삭제
- [ ] 프롬프트 복사
- [ ] 변수 템플릿 처리

#### 3. 검색 & 필터링
- [ ] 실시간 검색 (제목, 내용, 태그)
- [ ] 카테고리별 필터
- [ ] 태그별 필터
- [ ] 상태별 필터
- [ ] 정렬 (최신순, 사용 많은 순 등)

#### 4. 즐겨찾기 & 통계
- [ ] 즐겨찾기 추가/제거
- [ ] 통계 대시보드
- [ ] Export/Import

### 비기능적 요구사항

#### 1. 보안
- [ ] XSS 방어 (입력 sanitization)
- [ ] CSRF 토큰 처리
- [ ] JWT 안전한 저장
- [ ] API 요청 암호화 (HTTPS)
- [ ] 민감 정보 로깅 제외

#### 2. 성능
- [ ] 초기 로딩 < 2초
- [ ] 페이지 전환 < 500ms
- [ ] 검색 응답 < 300ms
- [ ] 번들 크기 < 500KB (gzipped)

#### 3. 접근성
- [ ] ARIA 레이블
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원

#### 4. 반응형
- [ ] 모바일 (< 768px)
- [ ] 태블릿 (768px ~ 1024px)
- [ ] 데스크탑 (> 1024px)
```

**사용자 승인**:
```
🔍 요구사항 검토:

위 요구사항 문서를 검토해주세요.
- 추가할 기능이 있나요?
- 제거할 기능이 있나요?
- 우선순위 변경이 필요한가요?

승인하시면 다음 단계로 진행합니다.
```

### 0.3 디자인 사이트 분석 (선택)

**사용자가 참고 디자인 URL 제공 시**:

**Claude의 역할**:
```python
# 디자인 사이트 분석 예시
url = "https://example-design-site.com"

분석 항목:
1. 색상 팔레트 추출
2. 타이포그래피 (폰트, 크기, 행간)
3. 레이아웃 구조 (Grid, Flexbox)
4. 컴포넌트 패턴
5. 인터랙션 (호버, 클릭 효과)
6. 반응형 브레이크포인트
```

**디자인 분석 리포트**:
```markdown
## 디자인 분석 리포트

### 색상 팔레트
- Primary: #3B82F6
- Secondary: #8B5CF6
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Neutral: #6B7280

### 타이포그래피
- Heading Font: Inter, -apple-system, sans-serif
- Body Font: Inter, -apple-system, sans-serif
- H1: 32px / 40px (line-height)
- H2: 24px / 32px
- Body: 16px / 24px

### 레이아웃
- Max Width: 1280px
- Gutter: 24px
- Grid: 12 columns
- Card Radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

### 컴포넌트
- Button Height: 40px
- Input Height: 40px
- Modal Max Width: 600px

### 적용 가능한 Tailwind 클래스
```css
/* 추출된 클래스를 tailwind.config.js에 적용 */
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
    }
  }
}
```
```

**사용자 승인**:
```
🎨 디자인 분석 완료:

위 디자인 가이드를 프로젝트에 적용할까요?
- 색상 팔레트 승인
- 타이포그래피 승인
- 레이아웃 승인

승인 시 Tailwind 설정에 반영합니다.
```

---

## Phase 1: 프로젝트 초기화 & 보안 설정

### 1.1 Vite 프로젝트 생성

**사용자가 실행할 커맨드**:
```bash
# 1. Vite 프로젝트 생성
npm create vite@latest prompt-library-frontend -- --template react-ts

# 2. 프로젝트 디렉토리 이동
cd prompt-library-frontend

# 3. 의존성 설치
npm install

# 4. 필수 패키지 설치
npm install react-router-dom axios zustand react-hot-toast lucide-react
npm install @headlessui/react react-hook-form date-fns

# 5. Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 6. 개발 도구 설치
npm install -D @types/node

# 7. 보안 관련 패키지
npm install dompurify
npm install -D @types/dompurify
```

**설치 완료 확인**:
```bash
npm run dev
```

### 1.2 환경변수 설정 (보안 중요!)

**Claude가 제공하는 파일**:

**.env.local** (개발 환경):
```env
# API 설정
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_TIMEOUT=10000

# 환경
VITE_APP_ENV=development

# 기능 플래그
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_EXPORT=true
```

**.env.production** (프로덕션 환경):
```env
# API 설정
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=10000

# 환경
VITE_APP_ENV=production

# 기능 플래그
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_EXPORT=true
```

**.env.example** (Git에 커밋):
```env
# API 설정
VITE_API_BASE_URL=
VITE_API_TIMEOUT=

# 환경
VITE_APP_ENV=

# 기능 플래그
VITE_FEATURE_ANALYTICS=
VITE_FEATURE_EXPORT=
```

**.gitignore** (추가):
```gitignore
# 환경변수
.env
.env.local
.env.production
.env.*.local

# 민감 정보
*.pem
*.key
.secrets/
```

**환경변수 타입 정의**:

**src/types/env.d.ts**:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_ENV: 'development' | 'production' | 'test';
  readonly VITE_FEATURE_ANALYTICS: string;
  readonly VITE_FEATURE_EXPORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**환경변수 유틸리티**:

**src/utils/env.ts**:
```typescript
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  appEnv: import.meta.env.VITE_APP_ENV,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    export: import.meta.env.VITE_FEATURE_EXPORT === 'true',
  },
} as const;

// 환경변수 검증
export function validateEnv() {
  const required = ['VITE_API_BASE_URL', 'VITE_APP_ENV'];
  
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

### 1.3 보안 설정

**vite.config.ts** (보안 강화):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 3000,
    strictPort: true,
    // HTTPS 활성화 (개발 환경)
    https: false, // 프로덕션에서는 true
    // CORS 프록시
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    // CSP 헤더
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  build: {
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // 번들 크기 제한
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 코드 스플리팅
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@headlessui/react'],
        },
      },
    },
  },
  
  // 환경변수 접두사
  envPrefix: 'VITE_',
});
```

**index.html** (CSP 메타 태그):
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- 보안 헤더 -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    
    <!-- Content Security Policy -->
    <meta
      http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        connect-src 'self' http://127.0.0.1:8000 https://api.yourdomain.com;
        frame-ancestors 'none';
      "
    />
    
    <title>Prompt Library</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**사용자 확인**:
```
🔒 보안 설정 확인:

다음 사항을 확인해주세요:
✅ .env.local 파일 생성됨
✅ .gitignore에 .env* 추가됨
✅ vite.config.ts 보안 헤더 설정
✅ index.html CSP 메타 태그 추가

터미널 실행:
npm run dev

브라우저 접속:
http://localhost:3000

승인 시 다음 단계로 진행합니다.
```

---

## Phase 2: API 연동 레이어 (보안 강화)

### 2.1 TypeScript 타입 정의

**src/types/api.ts**:
```typescript
// API 응답 공통 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// 인증 관련
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}
```

**src/types/prompt.ts**:
```typescript
export interface Prompt {
  id: number;
  user: number;
  username: string;
  title: string;
  content: string;
  category: number | null;
  category_name?: string;
  tags: string[];
  is_template: boolean;
  variables: string[];
  color_label: 'ready' | 'draft' | 'template' | 'update';
  is_favorite: boolean;
  is_public: boolean;
  use_count: number;
  last_used: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  prompt_count?: number;
}

export interface PromptFormData {
  title: string;
  content: string;
  category?: number | null;
  tags: string[];
  is_template: boolean;
  color_label: string;
  is_favorite: boolean;
  is_public: boolean;
}
```

### 2.2 Axios 인스턴스 설정 (보안 강화)

**src/api/client.ts**:
```typescript
import axios, { 
  AxiosError, 
  AxiosInstance, 
  InternalAxiosRequestConfig 
} from 'axios';
import { env } from '@/utils/env';
import { storage } from '@/utils/storage';
import toast from 'react-hot-toast';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // CSRF 쿠키 포함
});

// 요청 인터셉터 (JWT 토큰 추가)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // CSRF 토큰 추가 (POST, PUT, DELETE 요청)
    if (['post', 'put', 'delete', 'patch'].includes(config.method || '')) {
      const csrfToken = storage.getCsrfToken();
      if (csrfToken && config.headers) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    // 요청 로깅 (개발 환경만)
    if (env.isDevelopment) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (토큰 갱신 & 에러 처리)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경만)
    if (env.isDevelopment) {
      console.log('[API Response]', response.status, response.config.url);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
    // 401 에러 && 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = storage.getRefreshToken();
      
      if (!refreshToken) {
        // Refresh 토큰 없음 → 로그아웃
        storage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        // 토큰 갱신 요청
        const response = await axios.post(
          `${env.apiBaseUrl}/api/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const newAccessToken = response.data.access;
        storage.setAccessToken(newAccessToken);
        
        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken);
        
        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 → 로그아웃
        processQueue(refreshError, null);
        storage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 에러 처리
    handleApiError(error);
    
    return Promise.reject(error);
  }
);

// 에러 처리 함수
function handleApiError(error: AxiosError) {
  if (!error.response) {
    // 네트워크 에러
    toast.error('네트워크 연결을 확인해주세요.');
    return;
  }
  
  const status = error.response.status;
  const data = error.response.data as any;
  
  switch (status) {
    case 400:
      toast.error(data?.message || '잘못된 요청입니다.');
      break;
    case 401:
      // 이미 인터셉터에서 처리됨
      break;
    case 403:
      toast.error('접근 권한이 없습니다.');
      break;
    case 404:
      toast.error('요청한 리소스를 찾을 수 없습니다.');
      break;
    case 429:
      toast.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      break;
    case 500:
    case 502:
    case 503:
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      break;
    default:
      toast.error('오류가 발생했습니다.');
  }
  
  // 에러 로깅 (개발 환경만)
  if (env.isDevelopment) {
    console.error('[API Error]', status, data);
  }
}

export default apiClient;
```

### 2.3 안전한 Storage 유틸리티

**src/utils/storage.ts**:
```typescript
// 민감 정보 저장 유틸리티 (XSS 방어)

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CSRF_TOKEN: 'csrf_token',
  USER_INFO: 'user_info',
} as const;

class SecureStorage {
  // 토큰 저장 (HttpOnly 쿠키가 이상적이지만, SPA에서는 sessionStorage 사용)
  // 프로덕션에서는 백엔드에서 HttpOnly 쿠키로 전환 권장
  
  setAccessToken(token: string) {
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
  
  getAccessToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  
  setRefreshToken(token: string) {
    // Refresh 토큰은 localStorage에 저장 (자동 로그인 지원)
    // 보안을 위해 암호화 권장
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  setCsrfToken(token: string) {
    sessionStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
  }
  
  getCsrfToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
  }
  
  setUserInfo(user: any) {
    // 민감 정보 제외
    const safeUserInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      // 비밀번호, 토큰 등 제외
    };
    sessionStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(safeUserInfo)
    );
  }
  
  getUserInfo(): any | null {
    const data = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);
    return data ? JSON.parse(data) : null;
  }
  
  clear() {
    // 모든 인증 정보 삭제
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
  }
}

export const storage = new SecureStorage();
```

### 2.4 XSS 방어 유틸리티

**src/utils/sanitize.ts**:
```typescript
import DOMPurify from 'dompurify';

/**
 * HTML 입력 sanitization (XSS 방어)
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

/**
 * 일반 텍스트 입력 sanitization
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * URL 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
```

**사용자 테스트**:
```
🔐 API 레이어 테스트:

1. 개발자 도구 → Network 탭 열기
2. 다음 테스트 실행:

[ ] API 요청 헤더에 Authorization 포함 확인
[ ] CSRF 토큰 포함 확인 (POST 요청)
[ ] 401 에러 시 자동 토큰 갱신 확인
[ ] XSS 공격 시도 (입력창에 <script>alert('XSS')</script> 입력)
    → sanitize되어 실행 안 됨

승인 시 다음 단계로 진행합니다.
```

---

## Phase 3: 인증 시스템 (보안 중심)

### 3.1 인증 API

**src/api/auth.ts**:
```typescript
import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';
import { storage } from '@/utils/storage';

export const authAPI = {
  // 로그인
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login/',
      data
    );
    
    // 토큰 저장
    storage.setAccessToken(response.data.access);
    storage.setRefreshToken(response.data.refresh);
    storage.setUserInfo(response.data.user);
    
    return response.data;
  },
  
  // 회원가입
  async register(data: RegisterRequest) {
    const response = await apiClient.post('/api/auth/register/', data);
    return response.data;
  },
  
  // 로그아웃
  async logout() {
    try {
      await apiClient.post('/api/auth/logout/');
    } finally {
      storage.clear();
    }
  },
  
  // 비밀번호 재설정 요청
  async requestPasswordReset(email: string) {
    const response = await apiClient.post('/api/auth/password/reset/', {
      email,
    });
    return response.data;
  },
  
  // 비밀번호 재설정 확인
  async resetPassword(data: {
    uid: string;
    token: string;
    new_password: string;
  }) {
    const response = await apiClient.post(
      '/api/auth/password/reset/confirm/',
      data
    );
    return response.data;
  },
};
```

### 3.2 인증 상태 관리 (Zustand)

**src/store/authStore.ts**:
```typescript
import { create } from 'zustand';
import { authAPI } from '@/api/auth';
import { storage } from '@/utils/storage';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // 로그인
  login: async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      
      set({
        user: response.user,
        isAuthenticated: true,
      });
      
      toast.success('로그인되었습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '로그인 실패');
      throw error;
    }
  },
  
  // 회원가입
  register: async (data) => {
    try {
      await authAPI.register(data);
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((msgs: any) => {
          msgs.forEach((msg: string) => toast.error(msg));
        });
      } else {
        toast.error('회원가입 실패');
      }
      throw error;
    }
  },
  
  // 로그아웃
  logout: async () => {
    try {
      await authAPI.logout();
    } finally {
      storage.clear();
      set({
        user: null,
        isAuthenticated: false,
      });
      toast.success('로그아웃되었습니다.');
    }
  },
  
  // 인증 상태 확인
  checkAuth: () => {
    const token = storage.getAccessToken();
    const user = storage.getUserInfo();
    
    if (token && user) {
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
```

### 3.3 Protected Routes

**src/components/auth/ProtectedRoute.tsx**:
```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
```

### 3.4 로그인 페이지

**src/pages/Login.tsx**:
```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import { sanitizeText } from '@/utils/sanitize';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // XSS 방어: 입력값 sanitize
      const sanitizedData = {
        username: sanitizeText(formData.username),
        password: formData.password, // 비밀번호는 sanitize하지 않음
      };
      
      await login(sanitizedData.username, sanitizedData.password);
      navigate('/');
    } catch (error) {
      // 에러는 authStore에서 처리
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">로그인</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            프롬프트 라이브러리에 오신 것을 환영합니다
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              사용자명 또는 이메일
            </label>
            <input
              id="username"
              type="text"
              required
              className="input"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoComplete="username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input pr-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm">로그인 상태 유지</span>
            </label>
            
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              비밀번호 찾기
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          
          <p className="text-center text-sm">
            계정이 없으신가요?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

**사용자 테스트**:
```
🔐 인증 시스템 테스트:

1. 로그인 테스트:
   [ ] 잘못된 자격증명 → 에러 메시지 표시
   [ ] 올바른 자격증명 → 로그인 성공
   [ ] 토큰이 sessionStorage에 저장됨 확인
   [ ] 로그인 후 대시보드로 리다이렉트 확인

2. 보안 테스트:
   [ ] 비인증 상태에서 /dashboard 접근 → /login 리다이렉트
   [ ] XSS 시도: username에 <script> 입력 → sanitize 확인
   [ ] 개발자 도구에서 토큰 확인 (노출되지 않아야 함)

3. 로그아웃 테스트:
   [ ] 로그아웃 → 토큰 삭제 확인
   [ ] 로그아웃 후 /dashboard 접근 불가

승인 시 다음 단계로 진행합니다.
```

**단계별 리포트**:
```markdown
## Phase 3 완료 리포트

### 구현된 기능
✅ JWT 인증 시스템
✅ 로그인/회원가입 폼
✅ Protected Routes
✅ 자동 토큰 갱신
✅ XSS 방어 (입력 sanitization)
✅ 안전한 토큰 저장 (sessionStorage)

### 보안 조치
✅ 비밀번호 표시/숨김
✅ CSRF 토큰 처리
✅ 401 에러 시 자동 로그아웃
✅ 민감 정보 로깅 제외

### 테스트 결과
✅ 로그인 성공
✅ Protected Route 동작
✅ XSS 공격 차단
✅ 토큰 갱신 동작

### 다음 단계
Phase 4: 레이아웃 & 컴포넌트 개발
```

---

## Phase 4-8: 핵심 기능 개발

**(기존 SKILL.md의 Phase 4-8 내용 유지, 보안 관련 내용 추가)**

각 단계마다 다음 형식으로 리포트 제공:

```markdown
## Phase N 완료 리포트

### 구현된 기능
- 기능 1
- 기능 2

### 보안 조치
- 조치 1
- 조치 2

### 최적화
- 최적화 1
- 최적화 2

### 테스트 결과
- 결과 1
- 결과 2

### 다음 단계
Phase N+1: ...
```

---

## Phase 9: 성능 최적화

### 9.1 렌더링 최적화

**React.memo 적용**:
```typescript
import { memo } from 'react';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: number) => void;
}

const PromptCard = memo(({ prompt, onCopy, onEdit, onDelete }: PromptCardProps) => {
  // 컴포넌트 구현
  return (
    <div className="card">
      {/* ... */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.prompt.id === nextProps.prompt.id &&
    prevProps.prompt.updated_at === nextProps.prompt.updated_at
  );
});

export default PromptCard;
```

**useMemo, useCallback 활용**:
```typescript
import { useMemo, useCallback } from 'react';

function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // 검색 & 필터링 (메모이제이션)
  const filteredPrompts = useMemo(() => {
    let result = prompts;
    
    // 검색
    if (searchQuery) {
      result = result.filter((prompt) =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 필터
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    
    return result;
  }, [prompts, searchQuery, filters]);
  
  // 이벤트 핸들러 (메모이제이션)
  const handleCopy = useCallback(async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('복사되었습니다!');
    } catch (error) {
      toast.error('복사 실패');
    }
  }, []);
  
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    
    try {
      await promptsAPI.delete(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 실패');
    }
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onCopy={handleCopy}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

**가상 스크롤 (대용량 리스트)**:
```bash
# 사용자 실행
npm install react-window
```

```typescript
import { FixedSizeList as List } from 'react-window';

function VirtualPromptList({ prompts }: { prompts: Prompt[] }) {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <PromptCard prompt={prompts[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={prompts.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### 9.2 코드 스플리팅 & Lazy Loading

**Route-based 코드 스플리팅**:
```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy loading
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Prompts = lazy(() => import('@/pages/Prompts'));
const Analytics = lazy(() => import('@/pages/Analytics'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**컴포넌트 Lazy Loading**:
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

function ParentComponent() {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 9.3 이미지/미디어 최적화

**이미지 최적화**:
```typescript
// Lazy 이미지 로딩
function LazyImage({ src, alt, ...props }: any) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}

// WebP 포맷 사용
function OptimizedImage({ src, alt }: any) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <source srcSet={`${src}.jpg`} type="image/jpeg" />
      <img src={`${src}.jpg`} alt={alt} loading="lazy" />
    </picture>
  );
}
```

### 9.4 네트워크 최적화

**요청 디바운싱**:
```typescript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // 디바운싱된 검색
  useEffect(() => {
    const debouncedSearch = debounce(async (q: string) => {
      if (!q) return;
      
      const response = await promptsAPI.search(q);
      setResults(response.data.results);
    }, 300); // 300ms 지연
    
    debouncedSearch(query);
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색..."
    />
  );
}
```

**Request Cancellation (AbortController)**:
```typescript
import { useEffect, useRef } from 'react';

function DataFetcher() {
  const abortControllerRef = useRef<AbortController | null>(null);
  
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    fetchData(abortControllerRef.current.signal);
    
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  
  async function fetchData(signal: AbortSignal) {
    try {
      const response = await fetch('/api/data', { signal });
      const data = await response.json();
      // ...
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      }
    }
  }
}
```

**SWR / React Query (캐싱)**:
```bash
# 사용자 실행
npm install swr
```

```typescript
import useSWR from 'swr';

function PromptsWithCache() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/prompts',
    promptsAPI.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>에러 발생</div>;
  
  return (
    <div>
      {data?.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
```

### 9.5 빌드 최적화

**vite.config.ts** (빌드 최적화):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@headlessui/react', 'react-hot-toast'],
          'state-vendor': ['zustand'],
          'http-vendor': ['axios'],
        },
      },
    },
    
    // 청크 크기 경고
    chunkSizeWarningLimit: 500,
  },
});
```

**Gzip/Brotli 압축 (서버 설정)**:
```nginx
# Nginx 예시
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 9.6 메모리 관리

**메모리 누수 방지**:
```typescript
import { useEffect } from 'react';

function ComponentWithCleanup() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup 함수
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      console.log('Resized');
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
```

**사용자 확인**:
```
⚡ 성능 최적화 확인:

1. 빌드 실행:
   npm run build
   
2. 번들 크기 확인:
   [ ] dist/ 폴더 확인
   [ ] 총 크기 < 500KB (gzipped)
   [ ] Visualizer 리포트 확인

3. 성능 테스트:
   [ ] Lighthouse 점수 > 90
   [ ] LCP < 2.5초
   [ ] FID < 100ms
   [ ] CLS < 0.1

4. 메모리 테스트:
   [ ] Chrome DevTools → Memory 탭
   [ ] 페이지 전환 시 메모리 증가 < 10MB

승인 시 다음 단계로 진행합니다.
```

---

## Phase 10: 보안 검증 & 배포 준비

### 10.1 보안 체크리스트

```markdown
## 보안 체크리스트

### 인증 & 권한
- [ ] JWT 토큰이 안전하게 저장됨 (sessionStorage)
- [ ] Refresh 토큰이 안전하게 저장됨 (localStorage 또는 HttpOnly 쿠키)
- [ ] 401 에러 시 자동 토큰 갱신 동작
- [ ] Protected Routes 동작 확인
- [ ] RBAC (역할 기반 접근 제어) 구현됨

### XSS 방어
- [ ] 모든 사용자 입력이 sanitize됨
- [ ] innerHTML 사용 금지 (또는 DOMPurify 사용)
- [ ] URL 검증 구현됨
- [ ] 외부 스크립트 로딩 제한됨
- [ ] CSP 헤더 설정됨

### CSRF 방어
- [ ] CSRF 토큰이 POST/PUT/DELETE 요청에 포함됨
- [ ] SameSite 쿠키 설정됨
- [ ] Origin 헤더 검증됨

### 환경변수 & 민감 정보
- [ ] .env 파일이 .gitignore에 추가됨
- [ ] 프로덕션 환경변수가 별도 관리됨
- [ ] API 키가 노출되지 않음
- [ ] 비밀번호가 평문으로 저장되지 않음
- [ ] 민감 정보가 로그에 출력되지 않음

### HTTPS & 전송 보안
- [ ] HTTPS 강제 리다이렉트 설정됨
- [ ] HSTS 헤더 설정됨
- [ ] Secure 쿠키 플래그 설정됨

### 의존성 보안
- [ ] npm audit 실행 (취약점 없음)
- [ ] 오래된 패키지 업데이트됨
- [ ] package-lock.json 커밋됨

### 기타
- [ ] 에러 메시지에 민감 정보 노출 안 됨
- [ ] Rate Limiting 구현됨 (백엔드)
- [ ] CORS 설정이 올바름
- [ ] 파일 업로드 제한 설정됨
```

### 10.2 의존성 보안 스캔

**사용자 실행**:
```bash
# 취약점 스캔
npm audit

# 자동 수정 (가능한 경우)
npm audit fix

# 강제 수정 (주의!)
npm audit fix --force

# 의존성 업데이트
npm outdated
npm update

# 특정 패키지 업데이트
npm install package-name@latest
```

**package.json**에 스크립트 추가:
```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated"
  }
}
```

### 10.3 프로덕션 빌드

**환경변수 설정 (.env.production)**:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=10000
VITE_APP_ENV=production
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_EXPORT=true
```

**빌드 & 배포**:
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 빌드 파일 확인
ls -lh dist/
```

**빌드 최적화 확인**:
```bash
# 번들 사이즈 분석
npm run build -- --mode production

# Gzip 압축 크기 확인
gzip -c dist/assets/*.js | wc -c
```

**배포 (Vercel 예시)**:
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

**배포 (Netlify 예시)**:
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

**사용자 확인**:
```
🚀 배포 준비 완료:

1. 보안 체크리스트 확인
   [ ] 모든 항목 체크 완료

2. 의존성 보안
   [ ] npm audit 결과: 0 vulnerabilities

3. 빌드
   [ ] npm run build 성공
   [ ] 번들 크기 확인 (< 500KB gzipped)

4. 배포
   [ ] 환경변수 설정 확인
   [ ] 배포 플랫폼 선택
   [ ] 배포 성공

최종 승인 시 프로덕션 배포를 진행합니다.
```

**최종 리포트**:
```markdown
## 🎉 프로젝트 완료 리포트

### 구현된 기능
✅ JWT 인증 (로그인/회원가입/로그아웃)
✅ 프롬프트 CRUD
✅ 실시간 검색 & 필터링
✅ 변수 템플릿 처리
✅ 즐겨찾기
✅ 통계 대시보드
✅ Export/Import

### 보안 조치
✅ XSS 방어 (DOMPurify)
✅ CSRF 토큰 처리
✅ JWT 안전한 저장
✅ 환경변수 분리
✅ CSP 헤더 설정
✅ 의존성 보안 스캔

### 성능 최적화
✅ 코드 스플리팅
✅ Lazy Loading
✅ React.memo / useMemo / useCallback
✅ 이미지 최적화
✅ 네트워크 최적화 (디바운싱, 캐싱)
✅ 빌드 최적화

### 테스트 결과
✅ Lighthouse 점수: 95+
✅ 번들 크기: 450KB (gzipped)
✅ LCP: 1.8초
✅ npm audit: 0 vulnerabilities

### 배포 정보
- 환경: Production
- URL: https://yourdomain.com
- 배포 플랫폼: Vercel / Netlify

프로덕션 준비 완료! 🎉
```

---

## 📚 참고 자료

### 공식 문서
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- Zustand: https://zustand-demo.pmnd.rs

### 보안 가이드
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- CSRF Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

### 성능 최적화
- Web.dev Performance: https://web.dev/performance/
- React Performance: https://react.dev/learn/render-and-commit
- Lighthouse: https://developer.chrome.com/docs/lighthouse/

---

## 🎓 단계별 학습 포인트

### Phase 0: 분석
- REST API 설계 이해
- 요구사항 도출 방법론
- 디자인 시스템 분석

### Phase 1-2: 초기화
- Vite 프로젝트 구조
- 환경변수 관리
- Axios 인터셉터 패턴

### Phase 3: 인증
- JWT 인증 흐름
- 토큰 갱신 전략
- Protected Routes 패턴

### Phase 4-8: 기능 개발
- 컴포넌트 설계
- 상태 관리 (Zustand)
- React Hook Form

### Phase 9: 최적화
- 렌더링 최적화
- 코드 스플리팅
- 네트워크 최적화

### Phase 10: 보안 & 배포
- 보안 체크리스트
- 의존성 관리
- CI/CD 파이프라인

---

## 🔧 트러블슈팅

### CORS 에러
```
에러: Access to XMLHttpRequest has been blocked by CORS policy

해결:
1. 백엔드에서 CORS 설정 확인
2. vite.config.ts에서 proxy 설정 확인
3. 환경변수 URL 확인
```

### 토큰 갱신 실패
```
에러: 401 Unauthorized (토큰 갱신 실패)

해결:
1. Refresh 토큰 만료 확인
2. 토큰 갱신 API 엔드포인트 확인
3. 인터셉터 로직 확인
```

### 빌드 에러
```
에러: Module not found

해결:
1. import 경로 확인
2. tsconfig.json의 paths 설정 확인
3. node_modules 재설치 (npm install)
```

---

