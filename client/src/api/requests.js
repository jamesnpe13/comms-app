import { authApi, api } from './axiosInstance';

// Auth API functions
export const logout = async () => {
  const res = await authApi.post('/auth/logout');
  return res;
};

export const refreshToken = async () => {
  const res = await authApi.post('/auth/refresh');
  return res;
};

// Pubic API functions
export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res;
};

// namespaced
export const ApiFunctions = {
  login,
  logout,
  refreshToken,
};
