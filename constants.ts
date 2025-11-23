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
    sponsorId: '',
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
    sponsorId: '@forever_system',
    caseCredits: 4.5, 
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
    sponsorId: '@alice_success',
    caseCredits: 0.5, 
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
    title: 'Forever Opportunity Basics (Starter Pack)',
    description: 'The foundation course every new recruit must master to start their journey.',
    track: CourseTrack.BASICS,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Welcome to Forever',
        description: 'Understanding the mission, culture, and unique value of Forever Living.',
        lessons: [
          { 
            id: 'l1-1', 
            title: 'The Forever Story', 
            type: 'TEXT', 
            headerImageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            summary: 'Learn about the origins of Forever Living, Rex Maughan’s vision, and the global impact of the Aloe company.',
            objectives: ['Understand the history of FLP', 'Recognize the core values', 'Identify the global scale of the business'],
            content: 'Forever Living Products was founded in 1978 with a little more than dreams and hard work. It was designed to help anyone who wanted a better future to attain it on their own...',
            actionSteps: ['Watch the "Story of Forever" video', 'Write down 3 values that resonate with you'],
            durationMinutes: 10 
          },
          { 
             id: 'l1-2',
             title: 'What Makes Forever Unique?',
             type: 'VIDEO',
             headerImageUrl: 'https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
             summary: 'Discover the vertical integration, the Aloe Science Council seal, and our commitment to quality.',
             objectives: ['Explain vertical integration', 'List 3 quality certifications'],
             content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
             actionSteps: ['Check the seal on your Aloe bottle'],
             durationMinutes: 15,
             quizQuestions: [
                 { question: "What does Vertical Integration mean for Forever?", options: ["We own everything from plant to product", "We outsource everything", "We only sell online"], correctAnswer: 0 }
             ]
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Understanding Case Credits (CC)',
        description: 'Mastering the internal currency of the business to drive growth.',
        lessons: [
            {
                id: 'l2-1',
                title: 'What is a CC & Why it Matters',
                type: 'TEXT',
                summary: 'CC is the global currency that equalizes product value across 160+ countries.',
                objectives: ['Define Case Credit', 'Calculate CC for common products', 'Understand the 4CC active goal'],
                content: 'A Case Credit (CC) is a value assigned to each product to calculate sales activity. 1CC is approximately $214 USD (Wholesale) or $307 USD (Retail). Achieving 4CC monthly is the key to unlocking all bonuses.',
                actionSteps: ['Calculate the CC value of your first order'],
                durationMinutes: 20
            }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Your First 2CC Plan',
        description: 'The roadmap to becoming an Assistant Supervisor.',
        lessons: [
            {
                id: 'l3-1',
                title: 'The Fast Start Strategy',
                type: 'TEXT',
                summary: 'How to achieve 2CC in your first week using the "Start Your Journey" pack.',
                content: 'The fastest way to qualify as an Assistant Supervisor (30% discount) is by purchasing the Start Your Journey pack (2CC). Alternatively, you can retail products to reach 2CC over 2 consecutive months.',
                objectives: ['Understand the 2CC requirement', 'Learn the benefits of Assistant Supervisor'],
                actionSteps: ['Review the contents of the Start Your Journey Pack', 'Set a date for your Business Launch'],
                durationMinutes: 25
            }
        ]
      },
      {
          id: 'm4',
          title: 'Module 4: The Compensation Plan',
          description: 'How you get paid: Discounts, Bonuses, and Incentives.',
          lessons: [
              {
                  id: 'l4-1',
                  title: 'Levels & Discounts Explained',
                  type: 'TEXT',
                  summary: 'From Novus Customer (5%) to Manager (48%).',
                  content: 'As you climb the marketing plan, your personal discount increases. Assistant Supervisor: 30%, Supervisor: 38%, Assistant Manager: 43%, Manager: 48%. This discount is also your profit margin on retail sales.',
                  durationMinutes: 30
              }
          ]
      },
      {
          id: 'm5',
          title: 'Module 5: Team Building Fundamentals',
          description: 'Building a stable business on a foundation of 5 key people.',
          lessons: [
              {
                  id: 'l5-1',
                  title: 'Identifying Your First 5 Key People',
                  type: 'TEXT',
                  summary: 'Who do you know? Using the memory jogger to find your partners.',
                  content: 'Success in Forever comes from duplication. You are looking for 5 people who want what you want. They are teachable, hungry for success, and willing to work.',
                  actionSteps: ['Create your "First 100" list', 'Identify your top 5 prospects'],
                  durationMinutes: 20
              }
          ]
      },
      {
          id: 'm6',
          title: 'Module 6: Sharing the Opportunity',
          description: 'Scripts, approaches, and follow-up strategies.',
          lessons: [
              {
                  id: 'l6-1',
                  title: 'The Right Words to Say',
                  type: 'TEXT',
                  summary: 'Proven scripts for inviting prospects to look at the business.',
                  content: 'Do not try to explain the whole business in one call. The goal of the invitation is to get them to watch a video or attend a presentation. "I found something exciting and I thought of you..."',
                  actionSteps: ['Practice the invitation script with your sponsor'],
                  durationMinutes: 15
              }
          ]
      },
      {
          id: 'm7',
          title: 'Module 7: First 7-Day Action Plan',
          description: 'Daily activities to launch your business with momentum.',
          lessons: [
              {
                  id: 'l7-1',
                  title: 'Your Daily Method of Operation (DMO)',
                  type: 'TEXT',
                  summary: 'What to do every single day to guarantee growth.',
                  content: '1. Use the products. 2. Share the products. 3. Share the opportunity. 4. Attend training. Consistency is the secret.',
                  actionSteps: ['Fill out your 7-Day Activity Tracker'],
                  durationMinutes: 10,
                  pdfUrl: '/assets/7-day-plan.pdf'
              }
          ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Product Mastery',
    description: 'Deep dive into Kidney Health, Detox, Weight Loss, Skin, and Immunity.',
    track: CourseTrack.PRODUCT,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
        { id: 'm_pm_1', title: 'Core Aloe Products', description: 'The benefits of Aloe Gel.', lessons: [] }
    ]
  },
  {
    id: 'c3',
    title: 'Business Building & Recruiting',
    description: 'Advanced strategies for prospecting, presenting, and closing.',
    track: CourseTrack.BUSINESS,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
        { id: 'm_bb_1', title: 'Prospecting Mastery', description: 'Finding leads online and offline.', lessons: [] }
    ]
  },
  {
    id: 'c4',
    title: 'Sales Techniques & Social Media',
    description: 'Using Instagram, TikTok, and WhatsApp to retail products.',
    track: CourseTrack.SALES,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
        { id: 'm_st_1', title: 'Social Selling 101', description: 'Optimizing your profile for sales.', lessons: [] }
    ]
  },
  {
    id: 'c5',
    title: 'Rank Advancement Strategies',
    description: 'The roadmap from Supervisor to Eagle Manager.',
    track: CourseTrack.RANK,
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
        { id: 'm_ra_1', title: 'Road to Manager', description: 'Mapping out your 120CC.', lessons: [] }
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