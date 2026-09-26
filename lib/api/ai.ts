import { apiClient } from './client';

export interface AiResponse {
  available: boolean;
  query: string;
  mode?: string;
  message?: string;
  response?: string;
  suggestedTopics?: string[];
  recommendations?: any[];
  timestamp?: string;
}

export const aiApi = {
  async askStudyAssistant(
    query: string,
    mode: 'EXPLAIN' | 'SUMMARIZE' | 'CONCEPT_QA' | 'SOLVE_STEP_BY_STEP' = 'EXPLAIN',
    topic?: string
  ): Promise<AiResponse> {
    return apiClient.post('/ai/study-assistant', { query, mode, topic }, { timeout: 60000 });
  },

  async askCareerAssistant(
    query: string,
    mode: 'CAREER_GUIDANCE' | 'JOB_MATCHING' | 'SKILL_RECOMMENDATION' | 'INTERVIEW_PREP' | 'RESUME_REVIEW' | 'CAREER_ROADMAP' = 'CAREER_GUIDANCE',
    topic?: string
  ): Promise<AiResponse> {
    return apiClient.post('/ai/career-assistant', { query, mode, topic }, { timeout: 60000 });
  },

  async getAspirantRecommendations(
    query: string,
    mode: 'COLLEGE_RECOMMENDATION' | 'SCHOLARSHIP_ADVICE' | 'COURSE_SELECTION' | 'CAREER_DIRECTION' | 'EXAM_PREP' = 'COLLEGE_RECOMMENDATION',
    topic?: string
  ): Promise<AiResponse> {
    return apiClient.post('/ai/aspirant-recommendations', { query, mode, topic }, { timeout: 60000 });
  },
};
