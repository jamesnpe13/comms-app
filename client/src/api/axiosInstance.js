import axios from 'axios';
import { getLocalStorage } from '../utils/browserStorage';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// axios instance with api base url and withCredentials
export const authApi = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// axios instance for public access - no auth
export const api = axios.create({
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
