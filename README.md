
# 🧠 Prompt Library (DRF + React)

> **AI 프롬프트 관리 플랫폼**  
> Django REST Framework(백엔드) + React(프론트엔드)를 이용해  
> 프롬프트를 저장, 분류, 검색, 변수 템플릿으로 재활용할 수 있는 풀스택 프로젝트입니다.

---

## 🏗️ 프로젝트 구조

```

00-miniproject/
├── backend/     # Django REST Framework (API 서버)
└── frontend/    # React (웹 UI)

````

---

## ⚙️ 기술 스택

### 🔸 Backend
- **Framework:** Django 5.0 + Django REST Framework 3.14  
- **Auth:** JWT (djangorestframework-simplejwt)  
- **Docs:** drf-spectacular (Swagger / OpenAPI)  
- **Tags:** django-taggit  
- **DB:** SQLite (개발용) → PostgreSQL (배포용)  
- **CORS / 필터:** django-cors-headers, django-filter  

### 🔸 Frontend
- **Framework:** React (또는 Next.js)  
- **HTTP:** Axios  
- **Styling:** Tailwind CSS (또는 기본 CSS)  
- **State:** React Hooks 기반  
- **API 통신:** JWT 기반 REST API  

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 🔐 **회원가입 / 로그인** | JWT 인증 기반 사용자 관리 |
| 📋 **프롬프트 CRUD** | 제목, 본문, 태그, 템플릿 여부 등 관리 |
| 🧩 **변수 템플릿 시스템** | `{{language}}`, `{{feature}}` 형식 변수 자동 추출 및 치환 |
| 🏷️ **태그 / 카테고리** | 태그 기반 분류 및 필터링 |
| 🔍 **검색 / 필터링** | 제목, 내용, 태그 기반 검색 기능 |
| 📈 **사용 통계** | 사용 횟수, 최근 사용일, 인기 프롬프트 |
| 📦 **Export / Import** | JSON 형식으로 백업 및 일괄 등록 |
| 🧾 **Swagger 문서 자동 생성** | `/api/schema/swagger-ui/` 에서 확인 가능 |

---

## 🧩 백엔드 실행 방법

```bash
# 1️⃣ 환경 세팅
cd backend
conda create -n promptlib python=3.12 -y
conda activate promptlib

# 2️⃣ 패키지 설치
pip install -r requirements.txt

# 3️⃣ 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 4️⃣ 관리자 계정 생성
python manage.py createsuperuser

# 5️⃣ 서버 실행
python manage.py runserver
````

✅ Swagger UI: [http://127.0.0.1:8000/api/schema/swagger-ui/](http://127.0.0.1:8000/api/schema/swagger-ui/)
✅ Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 💻 프론트엔드 실행 방법

```bash
# 1️⃣ 설치 및 실행
cd frontend
npm install
npm start
```

✅ 실행 후: [http://localhost:3000](http://localhost:3000)

> `.env` 파일에 백엔드 주소를 설정해야 해요:
>
> ```
> REACT_APP_API_URL=http://127.0.0.1:8000
> ```

---

## 🌐 API 엔드포인트 요약

### 인증

```
POST   /api/auth/register/        - 회원가입  
POST   /api/auth/login/           - 로그인 (JWT 발급)  
GET    /api/auth/profile/         - 내 프로필 조회
```

### 프롬프트

```
GET    /api/prompts/              - 프롬프트 목록  
POST   /api/prompts/              - 프롬프트 생성  
GET    /api/prompts/{id}/         - 프롬프트 상세  
POST   /api/prompts/{id}/apply_variables/  - 변수 대체 실행
```

### 통계

```
GET    /api/analytics/overview/   - 전체 사용 통계  
GET    /api/analytics/trending/   - 인기 프롬프트
```

---

## 🧠 예시 시나리오

### 1️⃣ 템플릿 프롬프트 생성

```json
POST /api/prompts/
{
  "title": "Code Generator",
  "content": "Write {{language}} code for {{feature}}",
  "is_template": true
}
```

자동 추출된 변수:

```json
"variables": ["language", "feature"]
```

---

### 2️⃣ 변수 적용

```json
POST /api/prompts/1/apply_variables/
{
  "variable_values": {
    "language": "Python",
    "feature": "file upload"
  }
}
```

응답:

```json
{
  "result": "Write Python code for file upload"
}
```

---

## 🧾 개발 단계별 플로우 (요약)

1️⃣ **프로젝트 초기화** → DRF + Swagger 세팅
2️⃣ **모델 설계** → Prompt, Category, Usage
3️⃣ **JWT 인증 API** → 회원가입/로그인 구현
4️⃣ **CRUD API** → 프롬프트 생성/조회/수정/삭제
5️⃣ **템플릿 시스템** → 변수 추출 & 치환 기능
6️⃣ **검색 / 필터 / 통계** → 확장 기능 추가
7️⃣ **Export / Import** → JSON 데이터 백업

---

## 🧩 배포 구성(선택)

| 서비스       | 내용                                        |
| --------- | ----------------------------------------- |
| **백엔드**   | Render / Railway / Heroku (PostgreSQL 포함) |
| **프론트엔드** | Vercel / Netlify (CORS 허용)                |
| **DB**    | PostgreSQL (환경 변수 관리)                     |

---

## 📚 학습 포인트

* Django REST Framework의 **API 설계 전 과정**
* JWT 인증과 **프론트엔드 토큰 연동**
* DRF + Swagger 문서화 실습
* React에서 **Axios 비동기 통신 및 CRUD UI 구현**
* 실제 서비스형 프로젝트 구조 경험

---

## 📄 License

MIT License © 2025 [Tori]

---
