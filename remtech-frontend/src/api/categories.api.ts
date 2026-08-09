import api from './axios';
import type { Category } from '../types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getOne: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getAllAdmin: async (): Promise<Category[]> => {
    const response = await api.get('/categories/admin/all');
    return response.data;
  },

  create: async (data: { name: string; icon?: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: number, data: { name?: string; icon?: string; isActive?: boolean }) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  remove: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};