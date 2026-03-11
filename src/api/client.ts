import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://example.com/api', // TODO: заменить на реальный backend URL
  timeout: 15000,
});
