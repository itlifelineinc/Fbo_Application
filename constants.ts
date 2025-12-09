
import { Course, Student, UserRole, Message, CourseTrack, CommunityPost, Cohort, CourseLevel, CourseStatus, RankDefinition, MentorshipTemplate, Assignment } from './types';

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
    enrolledCourses: ['c1', 'c_demo_social'], // Enrolled for testing analytics
    savedCourses: [],
    viewedTemplates: [],
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
    savedCourses: [],
    viewedTemplates: [],
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
    progress: 95,
    // Alice has completed the Demo Course
    completedModules: ['m1', 'mod_social_1', 'mod_social_2'],
    completedChapters: ['c1-m1-1', 'chap_s1_1', 'chap_s1_2', 'chap_s1_3', 'chap_s2_1', 'chap_s2_2', 'chap_s2_3'],
    enrolledCourses: ['c1', 'c_demo_social'],
    savedCourses: [],
    viewedTemplates: [],
    sponsorId: '@forever_system',
    caseCredits: 4.5, 
    rankProgress: {
        currentRankId: 'AS_SUP', 
        currentCycleCC: 2.5, 
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
    // Bob started the Demo Course but only finished 1 chapter
    completedModules: [],
    completedChapters: ['chap_s1_1'],
    enrolledCourses: ['c1', 'c_demo_social'],
    savedCourses: [],
    viewedTemplates: [],
    sponsorId: '@alice_success',
    caseCredits: 0.5, 
    rankProgress: {
        currentRankId: 'NOVUS',
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
        teamOnly: false,
        price: 0
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
  },
  // --- NEW DEMO COURSE FOR ANALYTICS TESTING ---
  {
    id: 'c_demo_social',
    title: 'Mastering Social Selling',
    subtitle: 'Learn how to turn your social media profile into a 24/7 recruiting machine.',
    description: 'A comprehensive guide designed for FBOs who want to leverage Instagram, TikTok, and Facebook. We cover content strategy, engagement, and direct messaging scripts that convert.',
    track: CourseTrack.SALES,
    level: CourseLevel.INTERMEDIATE,
    targetAudience: ['Supervisors', 'Assistant Managers', 'Active Retailers'],
    learningOutcomes: ['Create viral content', 'Optimize bio for sales', 'DM Scripts that work'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bannerImageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3019dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: CourseStatus.PUBLISHED,
    authorHandle: '@forever_system',
    createdAt: Date.now() - 100000000,
    updatedAt: Date.now(),
    testimonials: [
        { id: 't1', name: 'Alice Freeman', role: 'Manager', quote: 'This course completely changed how I approach Instagram. I got 5 leads in my first week!' },
        { id: 't2', name: 'John Doe', role: 'Supervisor', quote: 'Simple, practical, and effective. The scripts are gold.' }
    ],
    settings: {
        gamificationEnabled: true,
        pointsReward: 1000,
        certificateEnabled: true,
        requiresAssessment: true,
        teamOnly: false,
        price: 99.00 // Price added to test Earnings analytics
    },
    modules: [
      {
        id: 'mod_social_1',
        title: 'Module 1: Optimizing Your Profile',
        summary: 'Your profile is your landing page. Learn how to set it up for success.',
        order: 1,
        chapters: [
          { 
            id: 'chap_s1_1', 
            title: 'Lesson 1: The Perfect Bio', 
            durationMinutes: 15,
            type: 'TEXT',
            content: 'Your bio needs to answer three questions: Who are you? What do you do? How can you help me? In this lesson we break down the formula...',
            blocks: [
                { id: 'b1', type: 'heading', style: 'h2', content: 'The Bio Formula' },
                { id: 'b2', type: 'paragraph', content: 'Use this structure: [I help X] + [Achieve Y] + [Without Z]. For example: I help moms earn extra income without sacrificing family time.' },
                { id: 'b3', type: 'callout', style: 'tip', content: 'Pro Tip: Include a Linktree in your bio.' }
            ],
            actionSteps: ['Rewrite your Instagram Bio', 'Add a clear call to action'],
            isPublished: true
          },
          { 
            id: 'chap_s1_2', 
            title: 'Lesson 2: Content Pillars', 
            durationMinutes: 20,
            type: 'TEXT',
            content: 'Stop guessing what to post. Define your 3-5 core topics (pillars) and rotate through them.',
            actionSteps: ['Define your 3 pillars'],
            isPublished: true
          },
          { 
            id: 'chap_s1_3', 
            title: 'Lesson 3: Highlights & Stories', 
            durationMinutes: 10,
            type: 'TEXT',
            content: 'Stories are where you sell. Highlights are where you keep the proof. Learn to organize them.',
            actionSteps: ['Create a "Results" highlight'],
            isPublished: true
          }
        ]
      },
      {
        id: 'mod_social_2',
        title: 'Module 2: Engagement & Conversion',
        summary: 'How to turn likes into leads and leads into FBOs.',
        order: 2,
        chapters: [
            {
                id: 'chap_s2_1',
                title: 'Lesson 1: The 15-Minute Engagement Routine',
                durationMinutes: 15,
                content: 'You do not need to be on your phone all day. Use this 15-minute block strategy.',
                actionSteps: ['Comment on 5 leader accounts', 'Reply to all stories'],
                isPublished: true,
                type: 'TEXT'
            },
            {
                id: 'chap_s2_2',
                title: 'Lesson 2: Sliding into DMs (Ethically)',
                durationMinutes: 25,
                content: 'Cold messaging is dead. Learn "Warm Messaging" instead.',
                actionSteps: [],
                isPublished: true,
                type: 'TEXT'
            },
            {
                id: 'chap_s2_3',
                title: 'Lesson 3: Closing the Sale',
                durationMinutes: 30,
                content: 'Moving the conversation to a call or a checkout link.',
                actionSteps: [],
                isPublished: true,
                type: 'TEXT',
                quizQuestions: [
                    {
                        id: 'q_social_1',
                        question: 'What is the goal of the first DM?',
                        options: ['Sell a product', 'Start a conversation', 'Send a link'],
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

export const INITIAL_TEMPLATES: MentorshipTemplate[] = [
    {
        id: 'temp_1',
        title: 'New Recruit Welcome',
        category: 'ONBOARDING',
        authorHandle: '@alice_success',
        createdAt: Date.now(),
        blocks: [
            { id: 'b1', type: 'paragraph', content: 'Hi [Name], welcome to the team! I\'m so excited to help you start your journey with Forever.' },
            { id: 'b2', type: 'heading', style: 'h3', content: 'First Steps' },
            { id: 'b3', type: 'list', content: '1. Log in to the FBO Academy app\n2. Complete the "Forever Opportunity Basics" course\n3. Schedule your strategy call with me' },
            { id: 'b4', type: 'paragraph', content: 'Let me know once you\'re in!' }
        ]
    },
    {
        id: 'temp_2',
        title: 'C9 Product Pitch',
        category: 'SALES',
        authorHandle: '@alice_success',
        createdAt: Date.now() - 86400000,
        blocks: [
            { id: 'b1', type: 'paragraph', content: 'Hey! I saw you were looking to reset your health habits. Have you heard of the C9 program?' },
            { id: 'b2', type: 'paragraph', content: 'It\'s a 9-day cleansing plan that helps you look better and feel better. It focuses on nutrition and building healthy habits, not just weight loss.' },
            { id: 'b3', type: 'callout', style: 'tip', content: 'Tip: Send before/after photos if available (ask for permission first!)' }
        ]
    },
    {
        id: 'temp_3',
        title: 'Follow-Up (3 Days)',
        category: 'FOLLOWUP',
        authorHandle: '@forever_system',
        createdAt: Date.now() - 100000000,
        blocks: [
            { id: 'b1', type: 'paragraph', content: 'Hi [Name], just checking in! How are you finding the products so far?' },
            { id: 'b2', type: 'paragraph', content: 'Let me know if you have any questions about usage or dosage.' }
        ]
    }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
    {
        id: 'assign_1',
        title: 'Prospecting Challenge - Day 1',
        type: 'TEXT',
        description: 'Connect with 5 new people today. Write down their names and what you discussed. Focus on building rapport, not selling.',
        questions: [
            { id: 'q1', text: 'Who did you contact?', type: 'TEXT' },
            { id: 'q2', text: 'What was the most positive response?', type: 'TEXT' }
        ],
        assignedTo: ['@bob_builder'],
        authorHandle: '@alice_success',
        status: 'ACTIVE',
        createdAt: Date.now()
    },
    {
        id: 'assign_2',
        title: 'Product Launch: Aloe Vera Gel Mastery',
        type: 'MIXED',
        description: 'This is a critical training task for all new FBOs. You need to master the pitch for our flagship product. \n\n1. Watch the attached training video.\n2. Read the compliance PDF.\n3. Record your pitch.\n4. Pass the knowledge check.\n\nGood luck!',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        materials: [
            {
                type: 'VIDEO',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                name: 'Aloe Gel Training Video',
                mimeType: 'video/external'
            },
            {
                type: 'DOCUMENT',
                url: '#', // Mock
                name: 'Compliance_Guidelines_2024.pdf',
                size: '2.4 MB',
                mimeType: 'application/pdf'
            }
        ],
        questions: [
            { 
                id: 'q_1', 
                text: 'Record a 30-second elevator pitch for the Aloe Gel as if I am a new prospect.', 
                type: 'VOICE' 
            },
            { 
                id: 'q_2', 
                text: 'What is the purity percentage of our stabilized Aloe Vera Gel?', 
                type: 'MULTIPLE_CHOICE',
                options: ['85%', '90%', '99.7%', '100%'],
                correctAnswer: 2
            },
            {
                id: 'q_3',
                text: 'Upload a photo of your personal product display or demo setup.',
                type: 'FILE_UPLOAD'
            },
            {
                id: 'q_4',
                text: 'List 3 common objections you might face when selling this product and how you would handle them.',
                type: 'TEXT'
            }
        ],
        assignedTo: ['@bob_builder'],
        authorHandle: '@alice_success',
        status: 'ACTIVE',
        createdAt: Date.now()
    }
];
