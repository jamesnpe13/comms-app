import { handleError } from '../utils/errorhandler';
import { authApi, api } from './axiosInstance';

// Pubic API functions
export const login = async (data) => {
  try {
    const res = await api.post('/auth/login', data);
    return res;
  } catch (error) {
    throw new Error(handleError(error, 'User Login'));
  }
};

// Auth API functions
export const logout = async () => {
  try {
    const res = await authApi.post('/auth/logout');
    return res;
  } catch (error) {
    throw new Error(handleError(error, 'User Logout'));
  }
};

export const refreshToken = async () => {
  try {
    const res = await authApi.post('/auth/refresh');
    return res;
  } catch (error) {
    throw new Error(handleError(error, 'Refresh Token'));
  }
};

// namespaced
export const ApiFunctions = {
  login,
  logout,
  refreshToken,
};
