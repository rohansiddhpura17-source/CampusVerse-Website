export type UserRole = 'STUDENT' | 'ASPIRANT' | 'ALUMNI' | 'ADMIN';

export interface User {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isAdminAuthorized: boolean;
  profile?: UserProfile;
  createdAt?: string;
}

export interface UserProfile {
  id?: string;
  fullName: string;
  avatarUrl?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  website?: string | null;
  github?: string | null;
  studentProfile?: any;
  alumniProfile?: any;
  aspirantProfile?: any;
  adminProfile?: any;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface PrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showGpa: boolean;
  allowMessagesFrom?: 'ALL' | 'CONNECTIONS_ONLY' | 'NONE';
  allowMentorshipRequests?: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
}
