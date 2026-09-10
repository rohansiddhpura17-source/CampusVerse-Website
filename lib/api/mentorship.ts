import { apiClient } from './client';
import { Mentor, MentorshipSession } from '@/types/alumni';

export const mentorshipApi = {
  async getMentors(params?: { search?: string; expertise?: string; page?: number; limit?: number }): Promise<Mentor[]> {
    return apiClient.get('/mentors', { params });
  },

  async getMentorById(id: string): Promise<Mentor> {
    return apiClient.get(`/mentors/${id}`);
  },

  async requestMentorship(data: { mentorId: string; goal: string; message: string }): Promise<any> {
    return apiClient.post('/mentorship/requests', data);
  },

  async respondToMentorshipRequest(id: string, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED'): Promise<any> {
    return apiClient.patch(`/mentorship/requests/${id}`, { status });
  },

  async getMentorshipSessions(): Promise<MentorshipSession[]> {
    return apiClient.get('/mentorship/sessions');
  },

  async updateSession(id: string, data: {
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
    meetingUrl?: string;
  }): Promise<MentorshipSession> {
    return apiClient.patch(`/mentorship/sessions/${id}`, data);
  },
};
