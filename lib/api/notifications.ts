import { apiClient } from './client';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    return apiClient.get('/notifications');
  },

  async markAsRead(id: string): Promise<boolean> {
    return apiClient.patch(`/notifications/${id}/read`, {});
  },
};
