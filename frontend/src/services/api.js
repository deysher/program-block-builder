import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const exercisesAPI = {
  search: (params) => api.get('/exercises', { params }),
};

export const programsAPI = {
  getAll: () => api.get('/programs'),
  create: (data) => api.post('/programs', data),
  getOne: (id) => api.get(`/programs/${id}`),
  update: (id, data) => api.patch(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
};

export const blocksAPI = {
  create: (programId, data) => api.post(`/programs/${programId}/blocks`, data),
  update: (programId, blockId, data) => api.patch(`/programs/${programId}/blocks/${blockId}`, data),
  delete: (programId, blockId) => api.delete(`/programs/${programId}/blocks/${blockId}`),
};

export const blockExercisesAPI = {
  add: (blockId, data) => api.post(`/blocks/${blockId}/exercises`, data),
  update: (blockId, id, data) => api.patch(`/blocks/${blockId}/exercises/${id}`, data),
  remove: (blockId, id) => api.delete(`/blocks/${blockId}/exercises/${id}`),
};

export default api;