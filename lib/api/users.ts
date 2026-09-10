import { apiClient } from './client';
import { UserProfile, PrivacySettings, SecuritySettings } from '@/types/auth';

export const usersApi = {
  async getUserById(id: string): Promise<any> {
    return apiClient.get(`/users/${id}`);
  },

  async updateUser(id: string, data: Partial<UserProfile>): Promise<any> {
    return apiClient.patch(`/users/${id}`, data);
  },

  async updateStudentProfile(data: {
    institutionId?: string;
    studentIdNumber?: string;
    degree?: string;
    major?: string;
    semester?: number;
    cgpa?: number;
    graduationYear?: number;
  }): Promise<any> {
    return apiClient.patch('/users/profile/student', data);
  },

  async updateAlumniProfile(data: Record<string, any>): Promise<any> {
    return apiClient.patch('/users/profile/alumni', data);
  },

  async getPrivacySettings(): Promise<PrivacySettings> {
    return apiClient.get('/users/settings/privacy');
  },

  async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    return apiClient.patch('/users/settings/privacy', settings);
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    return apiClient.get('/users/settings/security');
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return apiClient.patch('/users/settings/security', settings);
  },

  async submitAccountRecovery(data: { recoveryEmail: string; reason: string }): Promise<any> {
    return apiClient.post('/users/settings/account-recovery', data);
  },
};
