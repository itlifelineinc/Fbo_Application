
export enum UserRole {
  STUDENT = 'STUDENT',
  SPONSOR = 'SPONSOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum CourseTrack {
  BASICS = 'Basics',
  PRODUCT = 'Product',
  BUSINESS = 'Business',
  SALES = 'Sales',
  LEADERSHIP = 'Leadership'
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED'
}

export interface Attachment {
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LINK' | 'TEMPLATE' | 'ASSIGNMENT' | 'BROADCAST';
  url: string;
  name?: string;
  size?: string;
  mimeType?: string;
}

export type BlockType = 'heading' | 'paragraph' | 'image' | 'video' | 'list' | 'quote' | 'callout';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  style?: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Chapter {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'TEXT' | 'VIDEO' | 'QUIZ';
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  actionSteps: string[];
  isPublished: boolean;
  objectives?: string[];
  quizQuestions?: QuizQuestion[];
  allowComments?: boolean;
  blocks?: ContentBlock[];
  headerImageUrl?: string;
  summary?: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  chapters: Chapter[];
  summary?: string;
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
  price: number;
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
  status: CourseStatus;
  authorHandle: string;
  createdAt: number;
  updatedAt: number;
  settings: CourseSettings;
  modules: Module[];
  testimonials: CourseTestimonial[];
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
  currentCycleCC: number;
  targetCC: number;
  cycleStartDate: string;
  history: { rankId: string, dateAchieved: string, totalCCAtTime: number }[];
}

export interface LearningStats {
  totalTimeSpent: number;
  questionsAsked: number;
  learningStreak: number;
  lastLoginDate: string;
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
  transactionId: string;
  receiptUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AssignmentAnswer {
  questionId: string;
  textAnswer?: string;
  selectedOption?: number;
  attachment?: Attachment;
}

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REVISION_NEEDED';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentHandle: string;
  answers: AssignmentAnswer[];
  submittedAt: number;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
}

export interface Student {
  id: string;
  handle: string;
  password?: string;
  role: UserRole;
  name: string;
  email: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  country?: string;
  foreverId?: string;
  bio?: string;
  avatarUrl?: string;
  enrolledDate: string;
  progress: number;
  completedModules: string[];
  completedChapters: string[];
  enrolledCourses: string[];
  savedCourses: string[];
  viewedTemplates?: string[];
  readBroadcasts?: string[];
  bookmarkedBroadcasts?: string[];
  caseCredits: number;
  rankProgress?: RankProgress;
  sponsorId: string;
  learningStats: LearningStats;
  quizResults?: QuizResult[];
  salesHistory?: SaleRecord[];
  assignmentSubmissions?: AssignmentSubmission[];
  cohortId?: string;
}

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Message {
  id: string;
  senderHandle: string;
  recipientHandle: string;
  text: string;
  timestamp: number;
  isRead: boolean;
  status?: MessageStatus;
  isSystem?: boolean;
  attachment?: Attachment;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: number;
  isRead: boolean;
  link: string;
  avatarUrl?: string;
}

export interface CommunityComment {
  id: string;
  authorHandle: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number;
  likes?: number; // Added likes to comments
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // Array of user handles who voted
}

export interface Poll {
  question: string;
  options: PollOption[];
  isOpen: boolean;
}

export interface PostMedia {
  type: 'IMAGE' | 'VIDEO';
  url: string;
}

export interface CommunityPost {
  id: string;
  authorHandle: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  // Expanded types
  type: 'QUESTION' | 'WIN' | 'CHALLENGE' | 'DISCUSSION' | 'ANNOUNCEMENT' | 'PRODUCT_TIPP' | 'MOTIVATION';
  tags: string[];
  likedBy: string[];
  likes: number;
  comments: CommunityComment[];
  cohortId?: string; // If undefined, it's global
  timestamp: number;
  
  // New Features
  media?: PostMedia[];
  poll?: Poll;
  isPinned?: boolean;
  commentsDisabled?: boolean;
  shares?: number;
  mentions?: string[]; // Array of handles mentioned
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  mentorHandle: string;
}

export interface MentorshipTemplate {
  id: string;
  title: string;
  category: 'PROSPECTING' | 'PRODUCT' | 'ONBOARDING' | 'MOTIVATION' | 'SALES' | 'FOLLOWUP';
  blocks: ContentBlock[];
  authorHandle: string;
  createdAt: number;
}

export type AssignmentType = 'TEXT' | 'UPLOAD_IMAGE' | 'UPLOAD_DOC' | 'VIDEO_UPLOAD' | 'MULTIPLE_CHOICE' | 'LINK' | 'MIXED';

export interface AssignmentQuestion {
  id: string;
  text: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'FILE_UPLOAD' | 'VOICE';
  options?: string[];
  correctAnswer?: number;
  audioUrl?: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: AssignmentType;
  description: string;
  instructionAudioUrl?: string;
  materials?: Attachment[];
  questions: AssignmentQuestion[];
  deadline?: string;
  assignedTo: string[];
  authorHandle: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  isTemplate?: boolean;
  createdAt: number;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  authorHandle: string;
  recipients: string[];
  audienceType: 'ALL' | 'DIRECT' | 'SELECTED';
  attachments: Attachment[];
  isImportant: boolean;
  scheduledFor?: string;
  status: 'DRAFT' | 'SENT' | 'SCHEDULED';
  createdAt: number;
}
