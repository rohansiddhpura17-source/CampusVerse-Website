import { apiClient } from './client';
import { User, UserRole } from '@/types/auth';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post('/auth/register', payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post('/auth/login', payload);
  },

  async getMe(): Promise<User> {
    return apiClient.get('/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('campusverse_token');
      }
    }
  },

  async sendOtp(email: string, purpose = 'EMAIL_VERIFICATION'): Promise<{ message: string }> {
    return apiClient.post('/auth/send-otp', { email, purpose });
  },

  async verifyOtp(email: string, otp: string, purpose = 'EMAIL_VERIFICATION'): Promise<boolean> {
    return apiClient.post('/auth/verify-otp', { email, otp, purpose });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
    return apiClient.post('/auth/reset-password', { email, otp, newPassword });
  },
};
