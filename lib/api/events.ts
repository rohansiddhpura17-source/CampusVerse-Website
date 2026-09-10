import { apiClient } from './client';
import { CampusEvent } from '@/types/student';

export const eventsApi = {
  async getEvents(params?: { search?: string; category?: string }): Promise<CampusEvent[]> {
    return apiClient.get('/events', { params });
  },

  async getEventById(id: string): Promise<CampusEvent> {
    return apiClient.get(`/events/${id}`);
  },

  async registerEvent(id: string): Promise<boolean> {
    return apiClient.post(`/events/${id}/register`, {});
  },

  async unregisterEvent(id: string): Promise<boolean> {
    return apiClient.delete(`/events/${id}/register`);
  },
};
