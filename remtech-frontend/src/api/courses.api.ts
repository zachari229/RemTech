import api from './axios';
import type { Course } from '../types';

export const coursesApi = {
  getAll: async (filters?: {
    search?: string;
    categoryId?: number;
    level?: string;
    sortBy?: string;
  }): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', String(filters.categoryId));
    if (filters?.level) params.append('level', filters.level);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Course> => {
    const response = await api.get(`/courses/${slug}`);
    return response.data;
  },

  getAllAdmin: async (): Promise<Course[]> => {
    const response = await api.get('/courses/admin/all');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  update: (id: number, data: FormData) =>
    api.patch(`/courses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  publish: async (id: number) => {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  },

  unpublish: async (id: number) => {
    const response = await api.patch(`/courses/${id}/unpublish`);
    return response.data;
  },

  remove: async (id: number) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};