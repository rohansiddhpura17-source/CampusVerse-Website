export interface CollegeProgram {
  id: string;
  name: string;
  degree: string;
  major: string;
  durationYears: number;
  tuitionFee: string;
  minGpa?: number | null;
  entranceExams?: string[];
  deadline?: string;
  overview?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  city?: string | null;
  state?: string | null;
  country: string;
  ranking: number;
  acceptanceRate: number;
  averageFees: string;
  overview?: string | null;
  campusSize?: string | null;
  websiteUrl?: string | null;
  programsCount?: number;
  programs?: CollegeProgram[];
  isSaved?: boolean;
}

export interface CollegeComparison {
  id: string;
  name: string;
  country: string;
  city?: string | null;
  state?: string | null;
  ranking: number;
  acceptanceRate: number;
  averageFees: string;
  campusSize?: string | null;
  websiteUrl?: string | null;
  programs: CollegeProgram[];
}

export interface PredictionRequest {
  institutionId?: string;
  institutionName?: string;
  programName: string;
  degree: string;
  gpa: number;
  testType: 'JEE_MAIN' | 'JEE_ADVANCED' | 'SAT' | 'ACT' | 'GRE' | 'NEET' | 'BITSAT' | 'IELTS' | 'TOEFL';
  testScore: number;
}

export interface AdmissionPrediction {
  id: string;
  institutionName: string;
  programName: string;
  degree: string;
  gpa: number;
  testType: string;
  testScore: number;
  predictionPercentage: number;
  qualificationStatus: 'STRONG_CANDIDATE' | 'COMPETITIVE' | 'REACH' | 'UNLIKELY';
  feedback: string;
  recommendations: string[];
  createdAt?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  description: string;
  requirements: string[];
  applicationUrl: string;
  category: string;
  country: string;
  isSaved?: boolean;
}

export interface AspirantProfile {
  userId: string;
  email: string;
  fullName: string;
  bio?: string;
  targetDegree?: string;
  targetMajor?: string;
  targetUniversities?: string;
  highSchool?: string;
  expectedGradYear?: number;
  entranceExamScores?: Record<string, number>;
}
