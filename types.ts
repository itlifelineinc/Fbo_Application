
export enum UserRole {
  STUDENT = 'STUDENT',
  SPONSOR = 'SPONSOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum CourseTrack {
  BASICS = 'Forever Opportunity Basics',
  PRODUCT = 'Product Mastery',
  BUSINESS = 'Business Building & Recruiting',
  SALES = 'Sales Techniques & Social Media',
  RANK = 'Rank Advancement Strategies',
  LEADERSHIP = 'Leadership & Team Building'
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum CourseStatus {
  DRAFT = 'Draft',
  PENDING_REVIEW = 'Pending Review',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  PUBLISHED = 'Published',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived'
}

export interface RankDefinition {
  id: string;
  name: string;
  targetCC: number; 
  monthsAllowed: number;
  nextRankId: string | null;
  requiredManagersInDownline?: number;
}

export interface RankProgress {
  currentRankId: string;
  currentCycleCC: number; // Resets to 0 on promotion
  targetCC: number;       // CC required for NEXT rank
  cycleStartDate: string; 
  history: { rankId: string; dateAchieved: string; totalCCAtTime: number }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export type BlockType = 'paragraph' | 'heading' | 'image' | 'list' | 'quote' | 'callout';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content or Image URL
  style?: 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'info' | 'warning' | 'tip'; // Sub-styles
}

export interface Chapter {
  id: string;
  title: string;
  type?: 'VIDEO' | 'TEXT';
  headerImageUrl?: string;
  summary?: string;
  content: string; // Fallback HTML/Markdown string
  blocks?: ContentBlock[]; // Structured content
  videoUrl?: string; // Link or Upload
  pdfUrl?: string;
  durationMinutes: number;
  actionSteps: string[];
  objectives?: string[];
  quizQuestions?: QuizQuestion[];
  isPublished: boolean;
  allowComments?: boolean;
}

export interface Module {
  id: string;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  order: number;
  chapters: Chapter[];
}

export interface CourseTestimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
    avatarUrl?: string;
}

export interface CourseSettings {
  gamificationEnabled: boolean; 
  pointsReward: number; 
  certificateEnabled: boolean; 
  requiresAssessment: boolean; 
  teamOnly: boolean; 
  price?: number; 
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  track: CourseTrack;
  level: CourseLevel;
  targetAudience: string[];
  learningOutcomes: string[];
  thumbnailUrl: string;
  bannerImageUrl?: string;
  trailerVideoUrl?: string;
  testimonials?: CourseTestimonial[]; // New field
  
  modules: Module[];
  settings: CourseSettings;
  status: CourseStatus;
  authorHandle: string;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface QuizResult {
    question: string;
    answer: string;
}

export interface Student {
  id: string;
  handle: string;
  password?: string;
  role: UserRole;
  name: string;
  email: string;
  
  // Extended Profile
  phoneNumber?: string;
  country?: string;
  foreverId?: string; // FLP ID
  whatsappNumber?: string;
  bio?: string;

  enrolledDate: string;
  progress: number; 
  completedModules: string[]; // IDs of completed modules
  completedChapters: string[]; // IDs of completed chapters
  enrolledCourses: string[]; // IDs of courses the student has started/chosen
  savedCourses: string[]; // IDs of bookmarked courses
  
  // Track where the student left off
  lastAccessed?: {
    courseId: string;
    moduleId: string;
    chapterId: string;
  };

  sponsorId?: string;
  caseCredits: number; // Lifetime Total (History)
  rankProgress?: RankProgress; // New: Cycle Tracking
  
  avatarUrl?: string;
  cohortId?: string;
  quizResults?: QuizResult[];
  learningStats: {
      totalTimeSpent: number;
      questionsAsked: number;
      learningStreak: number;
      lastLoginDate: string;
  };
  salesHistory?: any[]; 
}

export interface ChatMessage {
  role: 'model' | 'user';
  text: string;
  timestamp: number;
}

export interface CommunityComment {
    id: string;
    authorHandle: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    timestamp: number;
}

// App Notification Type
export interface AppNotification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: number;
  isRead: boolean;
  type: 'MESSAGE' | 'ALERT' | 'SYSTEM';
  link: string;
  avatarUrl?: string;
}

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

// Chat & Community types kept for compatibility
export interface Message { 
  id: string; 
  text: string; 
  senderHandle: string; 
  recipientHandle: string; 
  timestamp: number; 
  isRead: boolean; 
  status?: MessageStatus; // Added status
  isSystem?: boolean; 
}

export interface CommunityPost { id: string; authorHandle: string; authorName: string; authorRole: UserRole; authorAvatar?: string; content: string; type: string; tags: string[]; likes: number; likedBy: string[]; comments: CommunityComment[]; cohortId?: string; timestamp: number; }
export interface Cohort { id: string; name: string; description: string; mentorHandle: string; }
export interface SaleRecord { id: string; date: string; amount: number; type: 'RETAIL' | 'WHOLESALE'; ccEarned: number; transactionId: string; status: string; receiptUrl?: string; }
