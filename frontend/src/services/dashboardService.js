import api from '../utils/axiosInstance';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }
};