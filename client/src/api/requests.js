import axios from 'axios';
import { getLocalStorage } from '../utils/browserStorage';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// axios instance with api base url and withCredentials
const authApi = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// axios instance for public access - no auth
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// request interceptor with attached token
authApi.interceptors.request.use(
  (config) => {
    const accessToken = getLocalStorage('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
