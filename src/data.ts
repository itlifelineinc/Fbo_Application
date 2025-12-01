
import { Course, CourseLevel, CourseTrack, CourseStatus } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Forever Opportunity Basics',
    subtitle: 'The foundation course every new recruit must take.',
    track: CourseTrack.BASICS,
    description: 'This comprehensive course introduces you to the core values, history, and potential of the Forever Living opportunity. You will learn about the Case Credit system, how to achieve your first milestones, and the basics of building a sustainable business.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: CourseLevel.BEGINNER,
    targetAudience: ['New Recruits'],
    learningOutcomes: [
      'Understand the Forever Living history and mission',
      'Master the Case Credit (CC) system',
      'Create a plan for your first 2CC',
      'Learn ethical prospecting techniques'
    ],
    status: CourseStatus.PUBLISHED,
    authorHandle: '@system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
        gamificationEnabled: true,
        pointsReward: 500,
        certificateEnabled: true,
        requiresAssessment: true,
        teamOnly: false
    },
    modules: [
      {
        id: 'm1',
        title: 'Welcome to Forever',
        summary: 'Introduction to the company culture and mission.',
        order: 1,
        chapters: [
          { 
            id: 'c1', 
            title: 'The Forever Story', 
            durationMinutes: 10, 
            type: 'TEXT', 
            content: '<p>Forever Living Products was founded in 1978 on a little more than dreams and hard work. It was designed to help anyone who wanted a better future to attain it on their own.</p>',
            actionSteps: [],
            isPublished: true,
            objectives: ['Learn the founding story', 'Understand vertical integration']
          },
          { 
            id: 'c2', 
            title: 'Mission & Culture', 
            durationMinutes: 15, 
            type: 'VIDEO', 
            content: 'Video placeholder',
            actionSteps: [],
            isPublished: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
          }
        ]
      },
      {
        id: 'm2',
        title: 'Understanding Case Credits',
        summary: 'Deep dive into the internal currency of FLP.',
        order: 2,
        chapters: [
          { 
            id: 'c3', 
            title: 'What is a CC?', 
            durationMinutes: 20, 
            type: 'TEXT',
            content: '<p>Case Credits (CC) are the global currency of Forever. They allow you to build a business across 160+ countries.</p>',
            actionSteps: [],
            isPublished: true,
            objectives: ['Define Case Credit', 'Calculate product values']
          },
          {
            id: 'c4', 
            title: 'CC Knowledge Check',
            durationMinutes: 10,
            type: 'TEXT',
            content: 'Quiz Time',
            actionSteps: [],
            isPublished: true,
            quizQuestions: [
              {
                id: 'q1',
                question: 'What does CC stand for?',
                options: ['Cash Credit', 'Case Credit', 'Company Coin'],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Product Mastery: Aloe',
    subtitle: 'Become an expert on our flagship Aloe Vera Gel.',
    track: CourseTrack.PRODUCT,
    description: 'Learn everything about the stabilization process, benefits, and sales techniques for Aloe Vera Gel.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bannerImageUrl: 'https://images.unsplash.com/photo-1570194065650-d995e1775f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: CourseLevel.INTERMEDIATE,
    targetAudience: ['All FBOs'],
    learningOutcomes: ['Explain the benefits of Aloe', 'Handle common objections', 'Recommend dosage'],
    status: CourseStatus.PUBLISHED,
    authorHandle: '@system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
        gamificationEnabled: true,
        pointsReward: 500,
        certificateEnabled: true,
        requiresAssessment: true,
        teamOnly: false
    },
    modules: []
  },
  {
    id: '3',
    title: 'Social Media Recruitment',
    subtitle: 'How to find prospects on Instagram and LinkedIn.',
    track: CourseTrack.BUSINESS,
    description: 'Modern strategies for building a personal brand and attracting leads online.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bannerImageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3019dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: CourseLevel.ADVANCED,
    targetAudience: ['Leaders'],
    learningOutcomes: [],
    status: CourseStatus.PUBLISHED,
    authorHandle: '@system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
        gamificationEnabled: true,
        pointsReward: 500,
        certificateEnabled: true,
        requiresAssessment: true,
        teamOnly: false
    },
    modules: []
  }
];
