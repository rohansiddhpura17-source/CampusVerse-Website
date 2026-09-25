import { apiClient } from './client';

export interface UserProfileResponse {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  profile: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    headline?: string | null;
    bio?: string | null;
    phone?: string | null;
    location?: string | null;
    website?: string | null;
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    studentProfile?: any;
    alumniProfile?: any;
    aspirantProfile?: any;
    mentorProfile?: any;
  } | null;
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  } | null;
}

export const profileApi = {
  async getMyProfile(): Promise<UserProfileResponse> {
    return apiClient.get('/profile/me');
  },

  async updateMyProfile(data: {
    fullName?: string;
    avatarUrl?: string;
    headline?: string;
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    studentProfile?: any;
    alumniProfile?: any;
    aspirantProfile?: any;
  }): Promise<UserProfileResponse> {
    return apiClient.put('/profile/me', data);
  },

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    return apiClient.get(`/profile/users/${userId}`);
  },

  async getNotificationPreferences(): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
  }> {
    return apiClient.get('/profile/preferences');
  },

  async updateNotificationPreferences(data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
  }): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
  }> {
    return apiClient.put('/profile/preferences', data);
  },
};
