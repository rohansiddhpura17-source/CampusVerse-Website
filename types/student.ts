export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  semester?: number;
  description?: string;
}

export interface AcademicSummary {
  institution: {
    name: string;
    code?: string;
    city?: string;
  } | null;
  degree: string;
  major: string;
  semester: number;
  cgpa: number;
  studentIdNumber: string;
  courses: Course[];
  recentNotes?: any[];
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  tags: string[];
  downloadsCount: number;
  createdAt?: string;
  courseCode?: string;
  courseName?: string;
  authorName?: string;
  isOwnedByCurrentUser?: boolean;
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  category: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  isOnline: boolean;
  meetingUrl?: string | null;
  startTime: string;
  endTime?: string | null;
  capacity: number;
  registeredCount: number;
  isRegistered?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug?: string;
  description: string;
  coverImage?: string | null;
  memberCount: number;
  postsCount?: number;
  isMember?: boolean;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt?: string;
  isLiked?: boolean;
  isOwnedByCurrentUser?: boolean;
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt?: string;
}

export interface MarketplaceProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRole: string;
  sellerPhone?: string | null;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  createdAt?: string;
  isOwnedByCurrentUser?: boolean;
}
