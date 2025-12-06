
import { Course, Student, UserRole, Message, CourseTrack, CommunityPost, Cohort, CourseLevel, CourseStatus, RankDefinition } from './types';

export const RANK_ORDER = [
    'NOVUS',
    'AS_SUP',
    'SUP',
    'AS_MGR',
    'MGR',
    'SOARING',
    'SAPPHIRE',
    'DIAMOND_SAPPHIRE',
    'DIAMOND'
];

// --- RANK RULES (FLP) ---
export const RANKS: Record<string, RankDefinition> = {
  'NOVUS': {
    id: 'NOVUS',
    name: 'Distributor',
    targetCC: 2,
    monthsAllowed: 2,
    nextRankId: 'AS_SUP'
  },
  'AS_SUP': {
    id: 'AS_SUP',
    name: 'Asst. Supervisor',
    targetCC: 25,
    monthsAllowed: 2,
    nextRankId: 'SUP'
  },
  'SUP': {
    id: 'SUP',
    name: 'Supervisor',
    targetCC: 75,
    monthsAllowed: 2,
    nextRankId: 'AS_MGR'
  },
  'AS_MGR': {
    id: 'AS_MGR',
    name: 'Asst. Manager',
    targetCC: 120,
    monthsAllowed: 2,
    nextRankId: 'MGR'
  },
  'MGR': {
    id: 'MGR',
    name: 'Manager',
    targetCC: 0, // Requirement to leave is structure based
    monthsAllowed: 0,
    nextRankId: 'SOARING',
    requiredManagersInDownline: 5
  },
  'SOARING': {
    id: 'SOARING',
    name: 'Soaring Manager',
    targetCC: 0,
    monthsAllowed: 0,
    nextRankId: 'SAPPHIRE',
    requiredManagersInDownline: 9
  },
  'SAPPHIRE': {
    id: 'SAPPHIRE',
    name: 'Sapphire Manager',
    targetCC: 0,
    monthsAllowed: 0,
    nextRankId: 'DIAMOND_SAPPHIRE',
    requiredManagersInDownline: 17
  },
  'DIAMOND_SAPPHIRE': {
    id: 'DIAMOND_SAPPHIRE',
    name: 'Diamond Sapphire Manager',
    targetCC: 0,
    monthsAllowed: 0,
    nextRankId: 'DIAMOND',
    requiredManagersInDownline: 25
  },
  'DIAMOND': {
    id: 'DIAMOND',
    name: 'Diamond Manager',
    targetCC: 0,
    monthsAllowed: 0,
    nextRankId: null
  }
};

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
    completedChapters: [],
    enrolledCourses: ['c1'],
    caseCredits: 100, 
    rankProgress: {
        currentRankId: 'MGR',
        currentCycleCC: 0,
        targetCC: 0,
        cycleStartDate: '2023-01-01',
        history: []
    },
    sponsorId: '',
    learningStats: { totalTimeSpent: 0, questionsAsked: 0, learningStreak: 0, lastLoginDate: '' }
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
    completedChapters: [],
    enrolledCourses: ['c1'],
    caseCredits: 10,
    sponsorId: '@forever_system',
    learningStats: { totalTimeSpent: 0, questionsAsked: 0, learningStreak: 0, lastLoginDate: '' }
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
    completedChapters: ['c1-m1-1'],
    enrolledCourses: ['c1'],
    sponsorId: '@forever_system',
    caseCredits: 4.5, 
    rankProgress: {
        currentRankId: 'AS_SUP', // Has passed 2CC
        currentCycleCC: 2.5, // Working towards Supervisor (25CC)
        targetCC: 25,
        cycleStartDate: '2023-10-15',
        history: [{ rankId: 'NOVUS', dateAchieved: '2023-10-15', totalCCAtTime: 2 }]
    },
    quizResults: [
      { question: 'Primary Goal', answer: 'Financial Freedom' },
      { question: 'Availability', answer: '10+ Hours/Week' }
    ],
    cohortId: 'cohort_jan_25',
    learningStats: { totalTimeSpent: 12000, questionsAsked: 45, learningStreak: 12, lastLoginDate: '2023-10-25' }
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
    completedChapters: [],
    enrolledCourses: ['c1'],
    sponsorId: '@alice_success',
    caseCredits: 0.5, 
    rankProgress: {
        currentRankId: 'NOVUS', // Working on 2CC
        currentCycleCC: 0.5, 
        targetCC: 2,
        cycleStartDate: '2023-10-20',
        history: []
    },
    quizResults: [
      { question: 'Primary Goal', answer: 'Extra Income' },
      { question: 'Availability', answer: '5-10 Hours/Week' }
    ],
    cohortId: 'cohort_jan_25',
    learningStats: { totalTimeSpent: 3600, questionsAsked: 12, learningStreak: 3, lastLoginDate: '2023-10-27' }
  }
];

// --- FULL COURSE CONTENT ---

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Forever Opportunity Basics',
    subtitle: 'A beginner-friendly guide to understanding the Forever business, CC, retailing, and how to build your team.',
    description: 'This is the foundation course new recruits should take first. It covers everything from the company history to the compensation plan.',
    track: CourseTrack.BASICS,
    level: CourseLevel.BEGINNER,
    targetAudience: ['New Recruits', 'Assistant Supervisors'],
    learningOutcomes: ['Understand Case Credits', 'Learn the Marketing Plan', 'Start Retailing'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: CourseStatus.PUBLISHED,
    authorHandle: '@forever_system',
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
        order: 1,
        chapters: [
          { 
            id: 'c1-m1-1', 
            title: 'The Forever Story', 
            durationMinutes: 10,
            content: 'Forever Living Products was founded in 1978...',
            actionSteps: ['Watch the welcome video', 'Download the company policy'],
            isPublished: true,
            type: 'TEXT'
          },
          { 
            id: 'c1-m1-2', 
            title: 'What Makes Forever Unique', 
            durationMinutes: 15,
            content: 'Vertical integration means we own the aloe fields, the manufacturing, and the distribution...',
            actionSteps: [],
            isPublished: true,
            type: 'TEXT'
          }
        ]
      },
      {
        id: 'm2',
        title: 'Understanding Case Credits (CC)',
        order: 2,
        chapters: [
            {
                id: 'c1-m2-1',
                title: 'What is a CC?',
                durationMinutes: 20,
                content: 'A Case Credit is a global currency used to measure sales...',
                actionSteps: ['Calculate the CC of your first order'],
                isPublished: true,
                type: 'TEXT',
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
        likedBy: ['@alice_success', '@bob_builder'],
        likes: 2,
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
        likedBy: ['@alice_success'],
        likes: 1,
        comments: [
            {
                id: 'c_1',
                authorHandle: '@alice_success',
                authorName: 'Alice Freeman',
                authorAvatar: '',
                content: 'Amazing work Bob! Keep that momentum going!',
                timestamp: Date.now() - 3600000
            }
        ],
        cohortId: 'cohort_jan_25', 
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
        likedBy: [],
        likes: 0,
        comments: [],
        cohortId: 'cohort_jan_25',
        timestamp: Date.now() - 100000
    }
];
