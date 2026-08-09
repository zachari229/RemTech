import api from './axios';
import type { Order } from '../types';

export const ordersApi = {
  create: async (payload: {
    courseId: number;
    phoneNumber: string;
    countryCode: string;
  }) => {
    const response = await api.post('/orders', payload);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOne: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  confirmPayment: async (data: {
    reference: string;
    paymentRef: string;
  }) => {
    const response = await api.post('/orders/confirm-payment', data);
    return response.data;
  },
};