import api from '@/utils/axiosInstance';

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get('/admin/jobs');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/admin/jobs/create', jobData);
    return response.data;
  },

  checkHealth: async () => {
    // Calls the health check endpoint directly (backend URL /health)
    const response = await api.get('/health', { baseURL: process.env.NEXT_PUBLIC_API_URL.replace('/api', '') });
    return response.data;
  }
};
