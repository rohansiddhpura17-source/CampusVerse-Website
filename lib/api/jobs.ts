import { apiClient } from './client';
import { JobOpportunity, JobApplication, Company, Referral } from '@/types/alumni';

export const jobsApi = {
  async getJobs(params?: {
    search?: string;
    roleType?: string;
    isRemote?: boolean;
    companyId?: string;
    page?: number;
    limit?: number;
  }): Promise<JobOpportunity[]> {
    return apiClient.get('/jobs', { params });
  },

  async getRecommendedJobs(): Promise<JobOpportunity[]> {
    return apiClient.get('/jobs/recommended');
  },

  async getJobById(id: string): Promise<JobOpportunity> {
    return apiClient.get(`/jobs/${id}`);
  },

  async createJob(data: {
    title: string;
    description: string;
    roleType: string;
    location: string;
    isRemote: boolean;
    salaryRange?: string;
    requirements?: string;
    companyId: string;
  }): Promise<JobOpportunity> {
    return apiClient.post('/jobs', data);
  },

  async saveJob(id: string): Promise<any> {
    return apiClient.post(`/jobs/${id}/save`, {});
  },

  async unsaveJob(id: string): Promise<any> {
    return apiClient.delete(`/jobs/${id}/save`);
  },

  async getSavedJobs(): Promise<JobOpportunity[]> {
    return apiClient.get('/jobs/saved');
  },

  async applyJob(id: string, data: { resumeUrl: string; coverLetter?: string }): Promise<JobApplication> {
    return apiClient.post(`/jobs/${id}/apply`, data);
  },

  async getApplications(): Promise<JobApplication[]> {
    return apiClient.get('/applications');
  },

  async getApplicationById(id: string): Promise<JobApplication> {
    return apiClient.get(`/applications/${id}`);
  },

  async withdrawApplication(id: string): Promise<any> {
    return apiClient.patch(`/applications/${id}/withdraw`, {});
  },

  async getCompanies(search?: string): Promise<Company[]> {
    return apiClient.get('/companies', { params: { search } });
  },

  async getCompanyById(id: string): Promise<Company> {
    return apiClient.get(`/companies/${id}`);
  },

  async getCompanyJobs(companyId: string): Promise<JobOpportunity[]> {
    return apiClient.get(`/companies/${companyId}/jobs`);
  },

  async getReferrals(): Promise<Referral[]> {
    return apiClient.get('/referrals');
  },

  async requestReferral(data: {
    alumniId: string;
    jobId?: string;
    companyName: string;
    notes?: string;
  }): Promise<Referral> {
    return apiClient.post('/referrals', data);
  },

  async respondToReferral(id: string, status: string, notes?: string): Promise<Referral> {
    return apiClient.patch(`/referrals/${id}/status`, { status, notes });
  },
};
