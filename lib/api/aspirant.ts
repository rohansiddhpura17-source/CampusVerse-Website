import { apiClient } from './client';
import { College, CollegeComparison, PredictionRequest, AdmissionPrediction, Scholarship, AspirantProfile } from '@/types/aspirant';

export const aspirantApi = {
  async getHomeSummary(): Promise<any> {
    return apiClient.get('/aspirant/home');
  },

  async getColleges(params?: { search?: string; country?: string; degree?: string; sortBy?: string }): Promise<College[]> {
    return apiClient.get('/colleges', { params });
  },

  async getCollegeById(id: string): Promise<College> {
    return apiClient.get(`/colleges/${id}`);
  },

  async saveCollege(collegeId: string): Promise<boolean> {
    return apiClient.post(`/colleges/${collegeId}/save`, {});
  },

  async unsaveCollege(collegeId: string): Promise<boolean> {
    return apiClient.delete(`/colleges/${collegeId}/save`);
  },

  async getSavedColleges(): Promise<College[]> {
    return apiClient.get('/colleges/saved');
  },

  async compareColleges(collegeIds: string[]): Promise<CollegeComparison[]> {
    const res: any = await apiClient.post('/colleges/compare', { collegeIds });
    return res.colleges || res;
  },

  async predictAdmission(request: PredictionRequest): Promise<AdmissionPrediction> {
    return apiClient.post('/predictions/predict', request);
  },

  async getPredictionHistory(): Promise<AdmissionPrediction[]> {
    return apiClient.get('/predictions/history');
  },

  async getScholarships(params?: { search?: string; category?: string; country?: string }): Promise<Scholarship[]> {
    return apiClient.get('/scholarships', { params });
  },

  async getScholarshipById(id: string): Promise<Scholarship> {
    return apiClient.get(`/scholarships/${id}`);
  },

  async saveScholarship(id: string): Promise<boolean> {
    return apiClient.post(`/scholarships/${id}/save`, {});
  },

  async unsaveScholarship(id: string): Promise<boolean> {
    return apiClient.delete(`/scholarships/${id}/save`);
  },

  async getSavedScholarships(): Promise<Scholarship[]> {
    return apiClient.get('/scholarships/saved');
  },

  async getAspirantProfile(): Promise<AspirantProfile> {
    return apiClient.get('/aspirant/profile');
  },

  async updateAspirantProfile(data: Partial<AspirantProfile>): Promise<AspirantProfile> {
    return apiClient.patch('/aspirant/profile', data);
  },
};
