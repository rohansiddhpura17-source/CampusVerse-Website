import { apiClient } from './client';
import {
  AlumniProfile,
  AlumniConnection,
  ConnectionRequest,
  CareerRoadmap,
  SkillProgress,
  InterviewSession,
  CareerPreference,
} from '@/types/alumni';

export const alumniApi = {
  async getAlumni(params?: {
    search?: string;
    company?: string;
    industry?: string;
    graduationYear?: number;
    willingToMentor?: boolean;
    willingToRefer?: boolean;
    page?: number;
    limit?: number;
  }): Promise<AlumniProfile[]> {
    return apiClient.get('/alumni', { params });
  },

  async getAlumniById(id: string): Promise<AlumniProfile> {
    return apiClient.get(`/alumni/${id}`);
  },

  async getConnections(): Promise<{ connections: AlumniConnection[]; pendingRequests: ConnectionRequest[] }> {
    return apiClient.get('/alumni/network/connections');
  },

  async sendConnectionRequest(alumniId: string): Promise<any> {
    return apiClient.post(`/alumni/${alumniId}/connect`, {});
  },

  async respondToConnection(connectionId: string, status: 'ACCEPTED' | 'DECLINED'): Promise<any> {
    return apiClient.patch(`/alumni/connections/${connectionId}`, { status });
  },

  async deleteConnection(connectionId: string): Promise<any> {
    return apiClient.delete(`/alumni/connections/${connectionId}`);
  },

  async saveAlumni(alumniId: string): Promise<any> {
    return apiClient.post(`/alumni/${alumniId}/save`, {});
  },

  async unsaveAlumni(alumniId: string): Promise<any> {
    return apiClient.delete(`/alumni/${alumniId}/save`);
  },

  async getSavedAlumni(): Promise<AlumniProfile[]> {
    return apiClient.get('/alumni/saved');
  },

  async getNetworkActivity(): Promise<any[]> {
    return apiClient.get('/alumni/network/activity');
  },

  // Career Roadmaps
  async getCareerRoadmaps(): Promise<CareerRoadmap[]> {
    return apiClient.get('/career/roadmaps');
  },

  async createRoadmap(data: {
    title: string;
    targetRole: string;
    milestones?: any[];
  }): Promise<CareerRoadmap> {
    return apiClient.post('/career/roadmaps', data);
  },

  async updateRoadmap(id: string, data: Partial<CareerRoadmap>): Promise<CareerRoadmap> {
    return apiClient.patch(`/career/roadmaps/${id}`, data);
  },

  async deleteRoadmap(id: string): Promise<any> {
    return apiClient.delete(`/career/roadmaps/${id}`);
  },

  // Skills
  async getSkills(): Promise<SkillProgress[]> {
    return apiClient.get('/career/skills');
  },

  async upsertSkill(skill: Partial<SkillProgress>): Promise<SkillProgress> {
    return apiClient.post('/career/skills', skill);
  },

  async deleteSkill(id: string): Promise<any> {
    return apiClient.delete(`/career/skills/${id}`);
  },

  // Mock Interviews
  async getMockInterviews(): Promise<InterviewSession[]> {
    return apiClient.get('/career/interviews');
  },

  async getMockInterviewById(id: string): Promise<InterviewSession> {
    return apiClient.get(`/career/interviews/${id}`);
  },

  async createMockInterview(data: Partial<InterviewSession>): Promise<InterviewSession> {
    return apiClient.post('/career/interviews', data);
  },

  // Career Preferences
  async getCareerPreferences(): Promise<CareerPreference> {
    return apiClient.get('/career/preferences');
  },

  async updateCareerPreferences(data: Partial<CareerPreference>): Promise<CareerPreference> {
    return apiClient.patch('/career/preferences', data);
  },
};
