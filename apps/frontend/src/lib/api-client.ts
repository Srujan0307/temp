import axios from 'axios';

import { authTokenStorage } from '@/lib/auth-token';

type ApiClientConfig = {
  baseURL?: string;
};

const resolveBaseUrl = (): string => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  return envBaseUrl ?? 'http://localhost:3000/api';
};

const createClient = ({ baseURL = resolveBaseUrl() }: ApiClientConfig = {}) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = authTokenStorage.get();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        authTokenStorage.clearAndNotify();
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const apiClient = createClient();
export type ApiClient = typeof apiClient;
