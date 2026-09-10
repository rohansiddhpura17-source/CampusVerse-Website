export interface AlumniProfile {
  userId: string;
  fullName: string;
  email: string;
  role?: string;
  headline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  website?: string | null;
  github?: string | null;
  company: string;
  designation: string;
  industry: string;
  yearsOfExperience: number;
  degree: string;
  graduationYear: number;
  institution?: string;
  willingToMentor: boolean;
  willingToRefer: boolean;
  skills: string[];
  connectionStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RECEIVED';
  connectionId?: string | null;
  mutualConnectionsCount?: number;
  isSaved?: boolean;
  isSelf?: boolean;
}

export interface AlumniConnection {
  connectionId: string;
  userId: string;
  email: string;
  fullName: string;
  headline?: string | null;
  avatarUrl?: string | null;
  company?: string | null;
  designation?: string | null;
  connectedAt?: string | null;
}

export interface ConnectionRequest {
  connectionId: string;
  userId: string;
  email: string;
  fullName: string;
  headline?: string | null;
  avatarUrl?: string | null;
  company?: string | null;
  designation?: string | null;
  requestedAt?: string | null;
}

export interface JobOpportunity {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogoUrl?: string | null;
  company?: {
    id: string;
    name: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    overview?: string | null;
  };
  title: string;
  description: string;
  roleType: string;
  location: string;
  isRemote: boolean;
  salaryRange?: string | null;
  requirements?: string | null;
  posterName?: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  applicationStatus?: string | null;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  roleType?: string;
  status: string;
  resumeUrl: string;
  coverLetter?: string | null;
  appliedAt?: string | null;
  createdAt?: string;
  job?: JobOpportunity;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  overview?: string | null;
  industry?: string | null;
  location?: string | null;
  jobs?: JobOpportunity[];
  _count?: { jobs?: number };
}

export interface Referral {
  id: string;
  alumniId: string;
  studentId: string;
  jobId?: string | null;
  companyName: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  alumni?: any;
  student?: any;
  job?: any;
}

export interface Mentor {
  id: string;
  userId: string;
  fullName?: string;
  title: string;
  company: string;
  expertise: string | string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  isAcceptingMentees: boolean;
  bio?: string;
  avatarUrl?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
      headline?: string;
      location?: string;
      linkedin?: string;
    };
  };
}

export interface MentorshipSession {
  id: string;
  requestId?: string;
  mentorName?: string;
  menteeName?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  request?: {
    id: string;
    goal: string;
    message: string;
    status: string;
    mentee?: {
      id: string;
      email: string;
      profile?: { fullName: string };
    };
    mentor?: {
      id: string;
      title: string;
      company: string;
      user?: {
        id: string;
        email: string;
        profile?: { fullName: string };
      };
    };
  };
}

export interface CareerRoadmap {
  id: string;
  userId?: string;
  title: string;
  targetRole: string;
  progressPercentage: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    targetQuarter?: string;
    description?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillProgress {
  id?: string;
  skillName: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  verified: boolean;
  assessmentScore?: number;
  updatedAt?: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  roleTarget: string;
  topic: string;
  durationMinutes: number;
  feedbackScore: number;
  transcript: string;
  strengths: string[];
  improvements: string[];
  completedAt: string;
  technicalScore?: number;
  behavioralScore?: number;
  systemDesignScore?: number;
  communicationScore?: number;
}

export interface CareerPreference {
  id?: string;
  userId?: string;
  preferredRoles: string[];
  preferredLocations: string[];
  remotePreference: string;
  targetSalary?: string | null;
  industries: string[];
  openToOpportunities: boolean;
}
