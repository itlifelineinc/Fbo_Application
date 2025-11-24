
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface Chapter {
  id: string;
  title: string;
  duration: string; // e.g., "10 min"
  content: string; // HTML or Markdown string
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  objectives?: string[];
  quiz?: Question[];
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: 'Opportunity' | 'Product' | 'Sales' | 'Leadership';
  description: string;
  thumbnail: string;
  banner: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: string;
  learningOutcomes: string[];
  modules: Module[];
  progress: number; // 0 to 100
  isStarted: boolean;
}
