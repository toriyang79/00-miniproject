import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Prompt, PromptFormData } from '@/types/prompt';

export const promptsAPI = {
  // 프롬프트 목록 조회
  async getAll(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    category?: number;
    tags?: string;
    is_favorite?: boolean;
    is_template?: boolean;
    color_label?: string;
    ordering?: string;
  }) {
    const response = await apiClient.get<PaginatedResponse<Prompt>>(
      '/api/prompts/',
      { params }
    );
    return response.data;
  },

  // 프롬프트 상세 조회
  async getById(id: number) {
    const response = await apiClient.get<Prompt>(`/api/prompts/${id}/`);
    return response.data;
  },

  // 프롬프트 생성
  async create(data: PromptFormData) {
    const response = await apiClient.post<Prompt>('/api/prompts/', data);
    return response.data;
  },

  // 프롬프트 수정
  async update(id: number, data: Partial<PromptFormData>) {
    const response = await apiClient.patch<Prompt>(
      `/api/prompts/${id}/`,
      data
    );
    return response.data;
  },

  // 프롬프트 삭제
  async delete(id: number) {
    await apiClient.delete(`/api/prompts/${id}/`);
  },

  // 즐겨찾기 토글
  async toggleFavorite(id: number) {
    const response = await apiClient.post<Prompt>(
      `/api/prompts/${id}/toggle_favorite/`
    );
    return response.data;
  },

  // 사용 기록
  async markUsed(id: number) {
    const response = await apiClient.post<Prompt>(
      `/api/prompts/${id}/mark_used/`
    );
    return response.data;
  },

  // 변수 적용
  async applyVariables(id: number, variableValues: Record<string, string>) {
    const response = await apiClient.post(
      `/api/prompts/${id}/apply_variables/`,
      { variable_values: variableValues }
    );
    return response.data;
  },

  // 즐겨찾기 목록
  async getFavorites() {
    const response = await apiClient.get<Prompt[]>('/api/prompts/favorites/');
    return response.data;
  },

  // Export
  async export() {
    const response = await apiClient.get('/api/prompts/export/');
    return response.data;
  },

  // Import
  async import(data: { prompts: any[]; overwrite?: boolean }) {
    const response = await apiClient.post('/api/prompts/import_prompts/', data);
    return response.data;
  },
};
