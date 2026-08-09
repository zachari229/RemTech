import api from './axios';
import type { User } from '../types';

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/users/my-orders');
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/users/my-enrollments');
    return response.data;
  },

  getAll: async (search?: string) => {
    const params = search ? `?search=${search}` : '';
    const response = await api.get(`/users${params}`);
    return response.data;
  },

  getOne: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  toggleStatus: async (id: number) => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  remove: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};