import api from './axios';

export const contactsApi = {
  send: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  reply: async (id: number, reply: string) => {
    const response = await api.patch(`/contacts/${id}/reply`, { reply });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};