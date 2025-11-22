export enum UserRole {
  STUDENT = 'STUDENT', // < 2CC
  SPONSOR = 'SPONSOR', // >= 2CC
  ADMIN = 'ADMIN',     // System Manager
  SUPER_ADMIN = 'SUPER_ADMIN' // Platform Owner
}

export interface QuizResult {
  question: string;
  answer: string;
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
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content
  durationMinutes: number;
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
  modules: Module[];
  thumbnailUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}