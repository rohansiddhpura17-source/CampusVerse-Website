import { apiClient } from './client';
import { AcademicSummary, Course, Note, LibraryResource, Community, CommunityPost, CommunityComment } from '@/types/student';

export const studentApi = {
  async getAcademicSummary(): Promise<AcademicSummary> {
    return apiClient.get('/academics/me');
  },

  async getCourses(params?: { semester?: number; search?: string }): Promise<Course[]> {
    return apiClient.get('/courses', { params });
  },

  async getCourseById(id: string): Promise<Course> {
    return apiClient.get(`/courses/${id}`);
  },

  async getNotes(params?: { search?: string; courseId?: string; tag?: string }): Promise<Note[]> {
    return apiClient.get('/notes', { params });
  },

  async getNoteById(id: string): Promise<Note> {
    return apiClient.get(`/notes/${id}`);
  },

  async createNote(data: {
    title: string;
    description?: string;
    fileUrl: string;
    courseId?: string;
    tags?: string;
  }): Promise<Note> {
    return apiClient.post('/notes', { ...data, isPublic: true });
  },

  async updateNote(id: string, data: Partial<Note>): Promise<Note> {
    return apiClient.patch(`/notes/${id}`, data);
  },

  async deleteNote(id: string): Promise<boolean> {
    return apiClient.delete(`/notes/${id}`);
  },

  async incrementNoteDownload(id: string): Promise<void> {
    return apiClient.post(`/notes/${id}/download`, {});
  },

  async getLibraryResources(params?: { search?: string; category?: string }): Promise<LibraryResource[]> {
    return apiClient.get('/library', { params });
  },

  async getLibraryResourceById(id: string): Promise<LibraryResource> {
    return apiClient.get(`/library/${id}`);
  },

  async getCommunities(search?: string): Promise<Community[]> {
    return apiClient.get('/communities', { params: { search } });
  },

  async getCommunityById(id: string): Promise<{ community: Community; posts: CommunityPost[] }> {
    return apiClient.get(`/communities/${id}`);
  },

  async joinCommunity(id: string): Promise<boolean> {
    return apiClient.post(`/communities/${id}/join`, {});
  },

  async leaveCommunity(id: string): Promise<boolean> {
    return apiClient.post(`/communities/${id}/leave`, {});
  },

  async createPost(communityId: string, data: { title: string; content: string }): Promise<CommunityPost> {
    return apiClient.post(`/communities/${communityId}/posts`, data);
  },

  async likePost(postId: string): Promise<{ likesCount: number }> {
    return apiClient.post(`/posts/${postId}/like`, {});
  },

  async commentPost(postId: string, content: string): Promise<CommunityComment> {
    return apiClient.post(`/posts/${postId}/comments`, { content });
  },
};
