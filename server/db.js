// Mock Data Store (In-Memory Database)
// In production, replace this with a connection to MongoDB, PostgreSQL, or Firebase.

const db = {
  students: [
    {
      id: '0',
      handle: '@forever_system',
      password: 'password123',
      role: 'SUPER_ADMIN',
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
      role: 'SPONSOR',
      name: 'Alice Freeman',
      email: 'alice@example.com',
      enrolledDate: '2023-10-15',
      progress: 65,
      completedModules: ['m1'],
      sponsorId: '@forever_system',
      caseCredits: 4.5,
      quizResults: [],
      cohortId: 'cohort_jan_25',
      learningStats: { totalTimeSpent: 12000, questionsAsked: 45, learningStreak: 12, lastLoginDate: '2023-10-25' }
    },
    {
      id: '2',
      handle: '@bob_builder',
      password: 'password123',
      role: 'STUDENT',
      name: 'Bob Smith',
      email: 'bob@example.com',
      enrolledDate: '2023-10-20',
      progress: 15,
      completedModules: [],
      sponsorId: '@alice_success',
      caseCredits: 0.5,
      quizResults: [],
      cohortId: 'cohort_jan_25',
      learningStats: { totalTimeSpent: 3600, questionsAsked: 12, learningStreak: 3, lastLoginDate: '2023-10-27' }
    }
  ],
  courses: [
    // We can copy the initial courses from constants.ts here if we want them editable
    // For now, we'll serve them as static data or let the frontend handle static courses
  ],
  messages: [
    {
        id: 'msg_1',
        senderHandle: '@alice_success',
        recipientHandle: '@bob_builder',
        text: 'Welcome to the team Bob! Let me know if you need help with your first 2CC.',
        timestamp: Date.now() - 10000000,
        isRead: false
    }
  ],
  posts: [
    {
        id: 'post_1',
        authorHandle: '@forever_system',
        authorName: 'FBO Academy',
        authorRole: 'SUPER_ADMIN',
        content: '🎉 Welcome to the new Global Community Hub!',
        type: 'ANNOUNCEMENT',
        tags: ['Update', 'Official'],
        likedBy: ['@alice_success'],
        likes: 1,
        comments: [],
        timestamp: Date.now() - 86400000
    }
  ],
  cohorts: [
    { id: 'cohort_jan_25', name: 'Cohort Jan 2025 - Detox', description: 'Focus group for C9', mentorHandle: '@alice_success' }
  ]
};

module.exports = db;