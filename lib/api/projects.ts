import { apiClient } from './client';

export interface ProjectTechnology {
  id: string;
  name: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    email: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
}

export interface ProjectItem {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  technologies: ProjectTechnology[];
  members: ProjectMember[];
  owner?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
}

export interface ProjectQueryParams {
  search?: string;
  technology?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}

export const projectApi = {
  async getProjects(params?: ProjectQueryParams): Promise<{
    projects: ProjectItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return apiClient.get('/projects', { params });
  },

  async getProjectById(id: string): Promise<ProjectItem> {
    return apiClient.get(`/projects/${id}`);
  },

  async createProject(data: {
    title: string;
    description?: string;
    demoUrl?: string;
    githubUrl?: string;
    isPublic?: boolean;
    technologies?: string[];
  }): Promise<ProjectItem> {
    return apiClient.post('/projects', data);
  },

  async updateProject(
    id: string,
    data: Partial<{
      title: string;
      description?: string;
      demoUrl?: string;
      githubUrl?: string;
      isPublic?: boolean;
      technologies?: string[];
    }>
  ): Promise<ProjectItem> {
    return apiClient.patch(`/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/projects/${id}`);
  },

  async addProjectMember(
    id: string,
    data: {
      userId: string;
      role?: string;
    }
  ): Promise<ProjectMember> {
    return apiClient.post(`/projects/${id}/members`, data);
  },

  async removeProjectMember(id: string, memberId: string): Promise<{ message: string }> {
    return apiClient.delete(`/projects/${id}/members/${memberId}`);
  },
};
