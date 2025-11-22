export enum UserRole {
  STUDENT = 'STUDENT', // < 2CC
  SPONSOR = 'SPONSOR', // >= 2CC
  ADMIN = 'ADMIN',     // System Manager
  SUPER_ADMIN = 'SUPER_ADMIN' // Platform Owner
}

export enum CourseTrack {
  BASICS = 'Forever Opportunity Basics',
  PRODUCT = 'Product Mastery',
  BUSINESS = 'Business Building & Recruiting',
  SALES = 'Sales Techniques & Social Media',
  RANK = 'Rank Advancement Strategies',
  LEADERSHIP = 'Leadership & Team Building'
}

export interface QuizResult {
  question: string;
  answer: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  amount: number;
  type: 'RETAIL' | 'WHOLESALE';
  ccEarned: number;
  receiptUrl?: string;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Message {
  id: string;
  senderHandle: string;
  recipientHandle: string; // Can be a user handle OR a Group ID (e.g., 'GROUP_@sponsor')
  text: string;
  timestamp: number;
  isRead: boolean;
  isSystem?: boolean; // For broadcast notifications
}

export interface Student {
  id: string;
  handle: string; // Unique identifier starting with @
  password?: string; // For auth
  role: UserRole;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number; // 0-100
  completedModules: string[];
  sponsorId?: string; // The handle of their sponsor
  quizResults?: QuizResult[];
  caseCredits: number; // Threshold for becoming a Sponsor (>= 2)
  avatarUrl?: string; // Profile picture data URL
  salesHistory?: SaleRecord[]; // Record of submitted sales
}

export interface Lesson {
  id: string;
  title: string;
  type: 'TEXT' | 'VIDEO' | 'QUIZ';
  content: string; // Markdown content or Video URL
  durationMinutes: number;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  track: CourseTrack;
  modules: Module[];
  thumbnailUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}