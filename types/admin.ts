export interface DashboardMetrics {
  users: {
    total: number;
    students: number;
    alumni: number;
    aspirants: number;
  };
  verifications: {
    pending: number;
  };
  jobs: {
    active: number;
    pending: number;
  };
  marketplace: {
    activeListings: number;
  };
  safety: {
    pendingReports: number;
  };
  events: {
    total: number;
  };
  system: {
    status: string;
    databaseUptime: string;
    activeSessions: number;
    securityAlerts: number;
  };
}

export interface AuditLog {
  id: string;
  actorId?: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details?: any;
  actor?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
  // Flat compatibility getters
  actorEmail?: string;
  actorName?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI' | 'ASPIRANT' | 'ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  isAdminAuthorized?: boolean;
  createdAt: string;
  profile?: {
    fullName?: string | null;
    avatarUrl?: string | null;
    headline?: string | null;
    location?: string | null;
    bio?: string | null;
    phone?: string | null;
    website?: string | null;
    github?: string | null;
    linkedin?: string | null;
  } | null;
  verifications?: Array<{
    id?: string;
    status: string;
    documentType: string;
    submittedAt?: string;
  }>;
  submittedReports?: any[];
  _count?: {
    submittedReports: number;
    reviewedReports: number;
  };
}

export interface VerificationItem {
  id: string;
  userId: string;
  documentType: string;
  documentUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_INFO';
  rejectionReason?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewerId?: string | null;
  user?: {
    id: string;
    email: string;
    role: string;
    profile?: {
      fullName?: string | null;
      avatarUrl?: string | null;
    } | null;
  } | null;
  reviewer?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  targetType: 'USER' | 'POST' | 'MARKETPLACE_ITEM' | 'MESSAGE' | string;
  targetId: string;
  reason: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes?: string | null;
  reviewerId?: string | null;
  createdAt: string;
  reporter?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
  reviewer?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | string;
  sellerId: string;
  createdAt: string;
  seller?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | string;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  isOnline: boolean;
  organizerId?: string;
  createdAt: string;
  organizer?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface AdminJob {
  id: string;
  title: string;
  description: string;
  roleType: string;
  location: string;
  isRemote: boolean;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED' | string;
  companyId?: string;
  posterId?: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    logoUrl?: string | null;
    website?: string | null;
  } | null;
  poster?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface MentorOverview {
  id: string;
  userId: string;
  isAcceptingMentees: boolean;
  expertise?: string | null;
  hourlyRate?: number | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
      avatarUrl?: string | null;
    } | null;
  } | null;
  _count?: {
    requests: number;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole?: string | null;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isPublished: boolean;
  deliveredCount?: number;
  createdAt: string;
  author?: {
    id: string;
    email: string;
    profile?: {
      fullName?: string | null;
    } | null;
  } | null;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  autoModeration: boolean;
  strictVerification: boolean;
  require2FAForAdmins: boolean;
  systemVersion: string;
  lastBackup: string;
}
