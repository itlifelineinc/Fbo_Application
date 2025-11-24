
import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Forever Opportunity Basics',
    subtitle: 'The foundation course every new recruit must take.',
    category: 'Opportunity',
    description: 'This comprehensive course introduces you to the core values, history, and potential of the Forever Living opportunity. You will learn about the Case Credit system, how to achieve your first milestones, and the basics of building a sustainable business.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: 'Beginner',
    totalDuration: '2h 30m',
    progress: 35,
    isStarted: true,
    learningOutcomes: [
      'Understand the Forever Living history and mission',
      'Master the Case Credit (CC) system',
      'Create a plan for your first 2CC',
      'Learn ethical prospecting techniques'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Welcome to Forever',
        summary: 'Introduction to the company culture and mission.',
        chapters: [
          { 
            id: 'c1', 
            title: 'The Forever Story', 
            duration: '10 min', 
            type: 'text', 
            content: '<p>Forever Living Products was founded in 1978 on a little more than dreams and hard work. It was designed to help anyone who wanted a better future to attain it on their own.</p>',
            objectives: ['Learn the founding story', 'Understand vertical integration']
          },
          { 
            id: 'c2', 
            title: 'Mission & Culture', 
            duration: '15 min', 
            type: 'video', 
            content: 'Video placeholder',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
          }
        ]
      },
      {
        id: 'm2',
        title: 'Understanding Case Credits',
        summary: 'Deep dive into the internal currency of FLP.',
        chapters: [
          { 
            id: 'c3', 
            title: 'What is a CC?', 
            duration: '20 min', 
            type: 'text',
            content: '<p>Case Credits (CC) are the global currency of Forever. They allow you to build a business across 160+ countries.</p>',
            objectives: ['Define Case Credit', 'Calculate product values']
          },
          {
            id: 'c4', 
            title: 'CC Knowledge Check',
            duration: '10 min',
            type: 'quiz',
            content: 'Quiz Time',
            quiz: [
              {
                id: 'q1',
                text: 'What does CC stand for?',
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
    category: 'Product',
    description: 'Learn everything about the stabilization process, benefits, and sales techniques for Aloe Vera Gel.',
    thumbnail: 'https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1570194065650-d995e1775f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: 'Intermediate',
    totalDuration: '1h 45m',
    progress: 0,
    isStarted: false,
    learningOutcomes: ['Explain the benefits of Aloe', 'Handle common objections', 'Recommend dosage'],
    modules: []
  },
  {
    id: '3',
    title: 'Social Media Recruitment',
    subtitle: 'How to find prospects on Instagram and LinkedIn.',
    category: 'Recruiting',
    description: 'Modern strategies for building a personal brand and attracting leads online.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1611926653458-09294b3019dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    level: 'Advanced',
    totalDuration: '3h 00m',
    progress: 0,
    isStarted: false,
    learningOutcomes: [],
    modules: []
  }
];
