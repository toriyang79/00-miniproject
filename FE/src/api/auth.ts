import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';
import { storage } from '@/utils/storage';

export const authAPI = {
  // 로그인
  async login(data: LoginRequest): Promise<LoginResponse> {
    // 1. 토큰 발급
    const tokenResponse = await apiClient.post<{ access: string; refresh: string }>(
      '/api/auth/login/',
      data
    );

    // 2. 토큰 임시 저장
    storage.setAccessToken(tokenResponse.data.access);
    storage.setRefreshToken(tokenResponse.data.refresh);

    // 3. 프로필 정보 가져오기
    const profileResponse = await apiClient.get('/api/auth/profile/');
    const user = profileResponse.data;

    // 4. 사용자 정보 저장
    storage.setUserInfo(user);

    return {
      access: tokenResponse.data.access,
      refresh: tokenResponse.data.refresh,
      user: user,
    };
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

  // 프로필 조회
  async getProfile() {
    const response = await apiClient.get('/api/auth/profile/');
    return response.data;
  },

  // 프로필 수정
  async updateProfile(data: { username?: string; email?: string }) {
    const response = await apiClient.patch('/api/auth/profile/', data);
    storage.setUserInfo(response.data);
    return response.data;
  },
};
