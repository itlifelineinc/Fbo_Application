import { Course, Student, UserRole, Message } from './types';

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
    caseCredits: 100, // System is a Super Sponsor
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
    caseCredits: 4.5, // Qualified Sponsor (>2CC)
    quizResults: [
      { question: 'Primary Goal', answer: 'Financial Freedom' },
      { question: 'Availability', answer: '10+ Hours/Week' }
    ]
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
    caseCredits: 0.5, // Student (<2CC)
    quizResults: [
      { question: 'Primary Goal', answer: 'Extra Income' },
      { question: 'Availability', answer: '5-10 Hours/Week' }
    ]
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
    caseCredits: 12.0, // Qualified Sponsor (>2CC)
    quizResults: [
      { question: 'Primary Goal', answer: 'Product Discounts' },
      { question: 'Availability', answer: '0-5 Hours/Week' }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'FBO Orientation: The Basics',
    description: 'Everything you need to know to start your journey as a Forever Business Owner.',
    thumbnailUrl: 'https://picsum.photos/400/225',
    modules: [
      {
        id: 'm1',
        title: 'Understanding the Products',
        description: 'Deep dive into Aloe Vera and Bee products.',
        lessons: [
          {
            id: 'l1',
            title: 'History of Aloe',
            content: 'Aloe Vera has been used for centuries... (Content placeholder)',
            durationMinutes: 5
          },
          {
            id: 'l2',
            title: 'Key Benefits',
            content: 'The key benefits include digestive health and skin care...',
            durationMinutes: 10
          }
        ]
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