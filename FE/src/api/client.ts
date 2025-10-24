import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/utils/env';
import { storage } from '@/utils/storage';
import toast from 'react-hot-toast';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
