import axios from 'axios';
import { useAuthStore } from '@store/authStore';

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://dash.omnicomm24.ru/api'
).replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
