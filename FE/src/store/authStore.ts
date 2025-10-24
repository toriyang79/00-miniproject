import { create } from 'zustand';
import { authAPI } from '@/api/auth';
import { storage } from '@/utils/storage';
import toast from 'react-hot-toast';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }) => Promise<void>;
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
