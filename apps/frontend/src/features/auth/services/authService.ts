
import api from '@/services/api';
import { LoginCredentials, LoginResponse, RegisterCredentials, ForgotPasswordCredentials, ResetPasswordCredentials } from './types';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await api.post('/auth/register', credentials);
};

export const forgotPassword = async (credentials: ForgotPasswordCredentials): Promise<void> => {
  await api.post('/auth/forgot-password', credentials);
};

export const resetPassword = async (credentials: ResetPasswordCredentials): Promise<void> => {
  await api.post('/auth/reset-password', credentials);
};
