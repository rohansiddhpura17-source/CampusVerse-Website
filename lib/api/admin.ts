import { apiClient } from './client';
import {
  DashboardMetrics,
  AuditLog,
  AdminUser,
  VerificationItem,
  SafetyReport,
  MarketplaceListing,
  AdminEvent,
  AdminJob,
  MentorOverview,
  Announcement,
  PlatformSettings,
} from '@/types/admin';

export const adminApi = {
  async getDashboard(): Promise<{ metrics: DashboardMetrics; recentAuditLogs: AuditLog[] }> {
    return apiClient.get('/admin/dashboard');
  },

  async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AdminUser[]> {
    return apiClient.get('/admin/users', { params });
  },

  async getUserDetails(userId: string): Promise<AdminUser> {
    return apiClient.get(`/admin/users/${userId}`);
  },

  async updateUserStatus(
    userId: string,
    data: {
      isActive?: boolean;
      role?: 'STUDENT' | 'ALUMNI' | 'ASPIRANT' | 'ADMIN';
      isEmailVerified?: boolean;
      suspensionReason?: string;
      reason?: string;
    }
  ): Promise<AdminUser> {
    const payload = {
      ...data,
      suspensionReason: data.suspensionReason || data.reason,
    };
    return apiClient.patch(`/admin/users/${userId}/status`, payload);
  },

  async resetUserPassword(userId: string): Promise<{ tempPassword: string; message: string }> {
    return apiClient.post(`/admin/users/${userId}/reset-password`, {});
  },

  async getVerifications(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<VerificationItem[]> {
    return apiClient.get('/admin/verifications', { params });
  },

  async reviewVerification(
    id: string,
    data: { status: 'APPROVED' | 'REJECTED' | 'REQUEST_INFO'; rejectionReason?: string }
  ): Promise<VerificationItem> {
    return apiClient.post(`/admin/verifications/${id}/review`, data);
  },

  async getReports(params?: {
    status?: string;
    targetType?: string;
    page?: number;
    limit?: number;
  }): Promise<SafetyReport[]> {
    return apiClient.get('/admin/reports', { params });
  },

  async resolveReport(
    id: string,
    data: {
      status: 'RESOLVED' | 'DISMISSED' | 'INVESTIGATING';
      actionTaken?: 'WARN' | 'REMOVE' | 'SUSPEND' | 'DISMISS' | 'RESOLVE' | 'NONE';
      resolutionNotes?: string;
      notes?: string;
    }
  ): Promise<SafetyReport> {
    const payload = {
      status: data.status,
      actionTaken: data.actionTaken || 'NONE',
      resolutionNotes: data.resolutionNotes || data.notes,
    };
    return apiClient.post(`/admin/reports/${id}/resolve`, payload);
  },

  async getMarketplaceListings(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<MarketplaceListing[]> {
    return apiClient.get('/admin/marketplace', { params });
  },

  async moderateMarketplace(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'REMOVE' | 'FLAG' | 'SUSPEND',
    reason?: string
  ): Promise<any> {
    return apiClient.patch(`/admin/marketplace/${id}/moderate`, { action, reason });
  },

  async getEvents(params?: { page?: number; limit?: number }): Promise<AdminEvent[]> {
    return apiClient.get('/admin/events', { params });
  },

  async moderateEvent(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'REMOVE' | 'FLAG' | 'SUSPEND',
    reason?: string
  ): Promise<any> {
    return apiClient.patch(`/admin/events/${id}/moderate`, { action, reason });
  },

  async getJobs(params?: { page?: number; limit?: number }): Promise<AdminJob[]> {
    return apiClient.get('/admin/jobs', { params });
  },

  async moderateJob(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'REMOVE' | 'FLAG' | 'SUSPEND',
    reason?: string
  ): Promise<any> {
    return apiClient.patch(`/admin/jobs/${id}/moderate`, { action, reason });
  },

  async getMentorship(): Promise<MentorOverview[]> {
    return apiClient.get('/admin/mentorship');
  },

  async moderateMentor(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'REMOVE' | 'FLAG' | 'SUSPEND',
    reason?: string
  ): Promise<any> {
    return apiClient.patch(`/admin/mentorship/${id}/moderate`, { action, reason });
  },

  async getAnnouncements(): Promise<Announcement[]> {
    return apiClient.get('/admin/announcements');
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    targetRole?: 'ALL' | 'ASPIRANT' | 'STUDENT' | 'ALUMNI' | 'MENTOR' | null;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  }): Promise<Announcement> {
    const payload = {
      title: data.title,
      content: data.content,
      targetRole: data.targetRole === 'ALL' ? undefined : data.targetRole,
      priority: data.priority || 'NORMAL',
    };
    return apiClient.post('/admin/announcements', payload);
  },

  async getSettings(): Promise<PlatformSettings> {
    return apiClient.get('/admin/settings');
  },

  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    return apiClient.patch('/admin/settings', settings);
  },
};
