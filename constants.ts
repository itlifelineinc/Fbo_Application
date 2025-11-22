import { Course, Student, UserRole, Message, CourseTrack, CommunityPost, Cohort } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '0',
    handle: '@forever_system',
    password: 'password123',
    role: UserRole.SUPER_ADMIN,
    name: 'System Super Admin',
    email: 'super@fbo.com',
    enrolledDate: '2020-01-01',
    progress: 100,
    completedModules: [],
    caseCredits: 100, 
    sponsorId: ''
  },
  {
    id: 'admin_1',
    handle: '@admin_support',
    password: 'password123',
    role: UserRole.ADMIN,
    name: 'Support Admin',
    email: 'support@fbo.com',
    enrolledDate: '2021-01-01',
    progress: 100,
    completedModules: [],
    caseCredits: 10,
    sponsorId: '@forever_system'
  },
  {
    id: '1',
    handle: '@alice_success',
    password: 'password123',
    role: UserRole.SPONSOR,
    name: 'Alice Freeman',
    email: 'alice@example.com',
    enrolledDate: '2023-10-15',
    progress: 65,
    completedModules: ['m1'],
    sponsorId: '@forever_system',
    caseCredits: 4.5, 
    quizResults: [
      { question: 'Primary Goal', answer: 'Financial Freedom' },
      { question: 'Availability', answer: '10+ Hours/Week' }
    ],
    cohortId: 'cohort_jan_25'
  },
  {
    id: '2',
    handle: '@bob_builder',
    password: 'password123',
    role: UserRole.STUDENT,
    name: 'Bob Smith',
    email: 'bob@example.com',
    enrolledDate: '2023-10-20',
    progress: 15,
    completedModules: [],
    sponsorId: '@alice_success',
    caseCredits: 0.5, 
    quizResults: [
      { question: 'Primary Goal', answer: 'Extra Income' },
      { question: 'Availability', answer: '5-10 Hours/Week' }
    ],
    cohortId: 'cohort_jan_25'
  },
  {
    id: '3',
    handle: '@charlie_diamond',
    password: 'password123',
    role: UserRole.SPONSOR,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    enrolledDate: '2023-10-22',
    progress: 88,
    completedModules: ['m1', 'm2'],
    sponsorId: '@forever_system',
    caseCredits: 12.0, 
    quizResults: [
      { question: 'Primary Goal', answer: 'Product Discounts' },
      { question: 'Availability', answer: '0-5 Hours/Week' }
    ],
    cohortId: 'cohort_feb_25'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Welcome to Forever',
    description: 'A short introduction to the Forever Living opportunity and culture.',
    track: CourseTrack.BASICS,
    thumbnailUrl: 'https://picsum.photos/id/1/400/225',
    modules: [
      {
        id: 'm1',
        title: 'The Forever Story',
        description: 'Learn about Rex Maughan and the history of Aloe.',
        lessons: [
          { id: 'l1-1', title: 'Our Origins', type: 'TEXT', content: 'Forever Living Products was founded in 1978...', durationMinutes: 5 },
          { id: 'l1-2', title: 'Vision & Values', type: 'VIDEO', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', durationMinutes: 10 } 
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Understanding CC (Case Credits)',
    description: 'Master the currency of Forever and how to calculate your growth.',
    track: CourseTrack.BASICS,
    thumbnailUrl: 'https://picsum.photos/id/20/400/225',
    modules: [
      {
        id: 'm2',
        title: 'What is a CC?',
        description: 'Deep dive into Case Credits.',
        lessons: [
          { id: 'l2-1', title: 'CC Fundamentals', type: 'TEXT', content: 'A Case Credit is a value assigned to each product...', durationMinutes: 15 }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Your First 2CC Plan',
    description: 'Step-by-step guide to becoming an Assistant Supervisor.',
    track: CourseTrack.BASICS,
    thumbnailUrl: 'https://picsum.photos/id/26/400/225',
    modules: [
      {
        id: 'm3',
        title: 'Strategy for 2CC',
        description: 'Actionable steps to reach 2CC in your first month.',
        lessons: [
          { id: 'l3-1', title: 'The Fast Start', type: 'TEXT', content: 'Focus on the Start Your Journey Pack...', durationMinutes: 20 }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'Product Knowledge Essentials',
    description: 'Key benefits of Aloe Vera, Bee products, and Nutrition.',
    track: CourseTrack.PRODUCT,
    thumbnailUrl: 'https://picsum.photos/id/30/400/225',
    modules: [
      {
        id: 'm4',
        title: 'Aloe Vera Gel',
        description: 'The flagship product explained.',
        lessons: [
          { id: 'l4-1', title: 'Benefits of Aloe', type: 'TEXT', content: 'Digestive health, immune support, and nutrient absorption...', durationMinutes: 10 }
        ]
      }
    ]
  },
  {
    id: 'c5',
    title: 'How To Prospect & Recruit',
    description: 'Building your contact list and inviting with confidence.',
    track: CourseTrack.BUSINESS,
    thumbnailUrl: 'https://picsum.photos/id/42/400/225',
    modules: [
        {
            id: 'm5',
            title: 'The Art of Invitation',
            description: 'Scripts and tips for approaching new prospects.',
            lessons: [{ id: 'l5-1', title: 'Warm Market vs Cold Market', type: 'TEXT', content: 'Start with who you know...', durationMinutes: 15 }]
        }
    ]
  },
  {
    id: 'c6',
    title: 'Sales Techniques & Social Media',
    description: 'Selling online and offline effectively.',
    track: CourseTrack.SALES,
    thumbnailUrl: 'https://picsum.photos/id/48/400/225',
    modules: [
        {
            id: 'm6',
            title: 'Social Selling',
            description: 'Using Instagram and Facebook to grow your business.',
            lessons: [{ id: 'l6-1', title: 'Posting Strategy', type: 'TEXT', content: 'Consistency is key. Use the 80/20 rule...', durationMinutes: 20 }]
        }
    ]
  },
  {
    id: 'c7',
    title: 'How Rankings Work',
    description: 'From Novus Customer to Eagle Manager.',
    track: CourseTrack.RANK,
    thumbnailUrl: 'https://picsum.photos/id/60/400/225',
    modules: [
        {
            id: 'm7',
            title: 'Climbing the Ladder',
            description: 'Requirements for each pin level.',
            lessons: [{ id: 'l7-1', title: 'Supervisor to Manager', type: 'TEXT', content: 'To become a Manager, you need 120CC in 2 months...', durationMinutes: 25 }]
        }
    ]
  }
];

export const INITIAL_MESSAGES: Message[] = [
    {
        id: 'msg_1',
        senderHandle: '@alice_success',
        recipientHandle: '@bob_builder',
        text: 'Welcome to the team Bob! Let me know if you need help with your first 2CC.',
        timestamp: Date.now() - 10000000,
        isRead: false
    },
    {
        id: 'msg_2',
        senderHandle: '@bob_builder',
        recipientHandle: '@alice_success',
        text: 'Thanks Alice! I am going through the product training now.',
        timestamp: Date.now() - 9000000,
        isRead: true
    },
    {
        id: 'msg_3',
        senderHandle: '@alice_success',
        recipientHandle: 'GROUP_@alice_success',
        text: 'Team meeting this Friday at 5 PM! We will discuss the new Aloe launch.',
        timestamp: Date.now() - 500000,
        isRead: false
    }
];

export const INITIAL_COHORTS: Cohort[] = [
    {
        id: 'cohort_jan_25',
        name: 'Cohort Jan 2025 - Detox',
        description: 'Focus group for the new C9 Detox launch.',
        mentorHandle: '@alice_success'
    },
    {
        id: 'cohort_feb_25',
        name: 'Cohort Feb 2025 - Skincare',
        description: 'Mastering the infinite skincare range.',
        mentorHandle: '@charlie_diamond'
    }
];

export const INITIAL_POSTS: CommunityPost[] = [
    {
        id: 'post_1',
        authorHandle: '@forever_system',
        authorName: 'FBO Academy',
        authorRole: UserRole.SUPER_ADMIN,
        content: '🎉 Welcome to the new Global Community Hub! This is your place to connect, learn, and grow together.',
        type: 'ANNOUNCEMENT',
        tags: ['Update', 'Official'],
        likes: 125,
        comments: [],
        timestamp: Date.now() - 86400000
    },
    {
        id: 'post_2',
        authorHandle: '@bob_builder',
        authorName: 'Bob Smith',
        authorRole: UserRole.STUDENT,
        content: 'I just sold my first C9 pack! The customer found me via Instagram reels. Consitency pays off! 🚀',
        type: 'WIN',
        tags: ['Sales', 'Social Media', 'Win'],
        likes: 14,
        comments: [
            {
                id: 'c_1',
                authorHandle: '@alice_success',
                authorName: 'Alice Freeman',
                content: 'Amazing work Bob! Keep that momentum going!',
                timestamp: Date.now() - 3600000
            }
        ],
        cohortId: 'cohort_jan_25', // Only visible in cohort
        timestamp: Date.now() - 7200000
    },
    {
        id: 'post_3',
        authorHandle: '@bob_builder',
        authorName: 'Bob Smith',
        authorRole: UserRole.STUDENT,
        content: 'Question about the Aloe Gel - A customer is asking if it is safe for kids. Can anyone clarify the dosage?',
        type: 'QUESTION',
        tags: ['Product Usage', 'Aloe Gel'],
        likes: 2,
        comments: [],
        cohortId: 'cohort_jan_25',
        timestamp: Date.now() - 100000
    }
];