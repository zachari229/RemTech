import api from './axios';
import type { Review } from '../types';

export const reviewsApi = {
  getByCourse: async (courseId: number): Promise<Review[]> => {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
  },

  create: async (data: {
    courseId: number;
    rating: number;
    comment: string;
  }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getAll: async (): Promise<Review[]> => {
    const response = await api.get('/reviews');
    return response.data;
  },

  approve: async (id: number) => {
    const response = await api.patch(`/reviews/${id}/approve`);
    return response.data;
  },

  reply: async (id: number, reply: string) => {
    const response = await api.patch(`/reviews/${id}/reply`, { reply });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  getPublicStats: async (): Promise<{ averageRating: number | null; totalReviews: number }> => {
  const response = await api.get('/reviews/stats');
  return response.data;
},
};