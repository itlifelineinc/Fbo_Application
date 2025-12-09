
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CourseBuilder from './components/CourseBuilder';
import Classroom from './components/Classroom';
import StudentsList from './components/StudentsList';
import StudentProfile from './components/StudentProfile';
import OnboardingWizard from './components/OnboardingWizard';
import SalesPortal from './components/SalesPortal';
import ChatPortal from './components/ChatPortal';
import CommunityPortal from './components/CommunityPortal';
import Login from './components/Login';
import CourseReview from './components/CourseReview';
import SalesPageBuilder from './pages/SalesPageBuilder'; 
import ClassroomPortal from './components/ClassroomPortal';
import CourseModulesPage from './components/CourseModulesPage';
import CourseLandingPage from './components/CourseLandingPage';
import MentorshipTools from './components/MentorshipTools';
import MentorshipInbox from './components/MentorshipInbox';
import AssignmentsList from './components/AssignmentsList'; // New
import AssignmentPlayer from './components/AssignmentPlayer'; // New
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_MESSAGES, INITIAL_POSTS, INITIAL_COHORTS, INITIAL_TEMPLATES, INITIAL_ASSIGNMENTS } from './constants';
import { Course, Module, Student, SaleRecord, UserRole, Message, CourseTrack, CommunityPost, CommunityComment, Cohort, CourseStatus, AppNotification, MentorshipTemplate, Assignment, AssignmentSubmission } from './types';
import { updateStudentRank } from './services/rankEngine';

// --- Protected Route ---

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: Student | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  courses: Course[];
  notifications: AppNotification[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, currentUser, onLogout, theme, onToggleTheme, courses, notifications }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout currentUser={currentUser} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} courses={courses} notifications={notifications}>
      {children}
    </Layout>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES.map(m => ({...m, status: m.isRead ? 'READ' : 'DELIVERED'}))); // Initialize with status
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [templates, setTemplates] = useState<MentorshipTemplate[]>(INITIAL_TEMPLATES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Simulation: Auto-Deliver "Sent" messages after delay
  useEffect(() => {
    const timer = setInterval(() => {
        setMessages(prevMsgs => prevMsgs.map(m => {
            if (m.status === 'SENT' && (Date.now() - m.timestamp > 1500)) {
                return { ...m, status: 'DELIVERED' };
            }
            return m;
        }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 1. Authentication
  const handleLogin = async (handle: string, pass: string): Promise<boolean> => {
    // Instant check against local state (Fallback Logic)
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const user = students.find(s => 
      s.handle.toLowerCase() === formattedHandle.toLowerCase() && 
      s.password === pass
    );

    if (user) {
        const today = new Date().toISOString().split('T')[0];
        let newStreak = user.learningStats?.learningStreak || 0;
        const lastLogin = user.learningStats?.lastLoginDate || '';

        if (lastLogin !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastLogin === yesterday) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        }
        
        const updatedUser = {
            ...user,
            learningStats: {
                ...(user.learningStats || { totalTimeSpent: 0, questionsAsked: 0 }),
                learningStreak: newStreak,
                lastLoginDate: today
            },
            // Ensure savedCourses is initialized
            savedCourses: user.savedCourses || [],
            viewedTemplates: user.viewedTemplates || [],
            assignmentSubmissions: user.assignmentSubmissions || []
        };

        setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
        setCurrentUser(updatedUser);
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 2. Data Management
  const handleSubmitCourse = (newCourse: Course) => {
      // Check if course exists to update, else add
      setCourses(prev => {
          const exists = prev.find(c => c.id === newCourse.id);
          if (exists) {
              return prev.map(c => c.id === newCourse.id ? newCourse : c);
          }
          return [...prev, newCourse];
      });
  };

  const handleReviewCourse = (courseId: string, status: CourseStatus) => {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status } : c));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  // New handler for Self Enrollment (Auto-Login)
  const handleSelfEnrollment = (newStudent: Student) => {
    // 1. Add to DB (State)
    setStudents(prev => [...prev, newStudent]);
    
    // 2. Auto-login immediately
    // The wizard creates the student with initialized stats, but we ensure login date is today.
    const loggedInUser = {
        ...newStudent,
        learningStats: {
            ...newStudent.learningStats,
            lastLoginDate: new Date().toISOString().split('T')[0],
            learningStreak: 1
        },
        savedCourses: [],
        viewedTemplates: [],
        assignmentSubmissions: []
    };
    
    setCurrentUser(loggedInUser);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (currentUser && currentUser.id === updatedStudent.id) {
        setCurrentUser(updatedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // --- REVISED: Sales Logic with Upline Propagation ---
  const handleSubmitSale = (sale: SaleRecord) => {
    if (!currentUser) return;

    const ccAmount = sale.ccEarned;
    
    // We will build a new list of students with all updates applied
    let updatedStudentsList = [...students];

    // Recursive function to update user and propagate CC to sponsor
    const propagateCC = (studentHandle: string, amount: number) => {
        const studentIndex = updatedStudentsList.findIndex(s => s.handle === studentHandle);
        if (studentIndex === -1) return; // Stop if not found

        const currentStudent = updatedStudentsList[studentIndex];
        
        // 1. Update this student's Rank & CC
        // CRITICAL: We pass updatedStudentsList so rankEngine sees updates from downlines (e.g. if downline became Manager)
        let updatedStudent = updateStudentRank(currentStudent, amount, updatedStudentsList);

        // 2. If this is the originator (the one logging the sale), add the sales record history
        if (studentHandle === currentUser.handle) {
            updatedStudent = {
                ...updatedStudent,
                salesHistory: [sale, ...(updatedStudent.salesHistory || [])]
            };
        }

        // 3. Commit update to our local list
        updatedStudentsList[studentIndex] = updatedStudent;

        // 4. Propagate to Sponsor (if exists)
        if (updatedStudent.sponsorId) {
            propagateCC(updatedStudent.sponsorId, amount);
        }
    };

    // Start propagation
    propagateCC(currentUser.handle, ccAmount);

    // Final Commit to State
    setStudents(updatedStudentsList);

    // Update Current User if their data changed
    const freshCurrentUser = updatedStudentsList.find(s => s.id === currentUser.id);
    if (freshCurrentUser) {
        setCurrentUser(freshCurrentUser);
    }
  };

  const handleSendMessage = (newMessage: Message) => {
    // New messages start as SENT
    setMessages(prev => [...prev, { ...newMessage, status: 'SENT' }]);
  };

  // --- New Clear Chat Handler ---
  const handleClearChat = (contactHandle: string) => {
      if (!currentUser) return;
      if (window.confirm("Clear this chat? Messages will be removed for you.")) {
          setMessages(prev => prev.filter(m => 
              !((m.senderHandle === currentUser.handle && m.recipientHandle === contactHandle) || 
                (m.senderHandle === contactHandle && m.recipientHandle === currentUser.handle) ||
                (contactHandle.startsWith('GROUP_') && m.recipientHandle === contactHandle))
          ));
      }
  };

  // --- Single Message Delete Handler ---
  const handleDeleteMessage = (messageId: string, type: 'me' | 'everyone') => {
      setMessages(prev => {
          if (type === 'me') {
              // Remove locally
              return prev.filter(m => m.id !== messageId);
          } else {
              // Tombstone for everyone
              return prev.map(m => 
                  m.id === messageId 
                  ? { ...m, text: '🚫 This message was deleted', isSystem: true } 
                  : m
              );
          }
      });
  };

  const handleMarkAsRead = (senderHandle: string) => {
      if (!currentUser) return;
      setMessages(prev => prev.map(m => {
          // If message is FOR me, and FROM the active chat, mark as read
          if (m.recipientHandle === currentUser.handle && m.senderHandle === senderHandle && !m.isRead) {
              return { ...m, isRead: true, status: 'READ' };
          }
          return m;
      }));
  };

  const handleAddPost = (post: CommunityPost) => {
      setPosts(prev => [post, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            const hasLiked = p.likedBy.includes(currentUser.handle);
            const newLikedBy = hasLiked 
                ? p.likedBy.filter(h => h !== currentUser.handle) 
                : [...p.likedBy, currentUser.handle]; 
            
            return { 
                ...p, 
                likedBy: newLikedBy, 
                likes: newLikedBy.length 
            };
        }
        return p;
    }));
  };

  const handleAddComment = (postId: string, comment: CommunityComment) => {
      setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      ));
  };

  const handleUpdateStats = (seconds: number, questions: number) => {
    if (!currentUser) return;
    const updatedStudent = {
        ...currentUser,
        learningStats: {
            ...currentUser.learningStats,
            totalTimeSpent: (currentUser.learningStats?.totalTimeSpent || 0) + seconds,
            questionsAsked: (currentUser.learningStats?.questionsAsked || 0) + questions,
            learningStreak: currentUser.learningStats?.learningStreak || 0,
            lastLoginDate: currentUser.learningStats?.lastLoginDate || ''
        }
    };
    handleUpdateStudent(updatedStudent);
  };

  const handleCompleteLesson = (moduleId: string, chapterId: string) => {
     if(!currentUser) return;
     
     // 1. Calculate course ID based on where this module lives
     const course = courses.find(c => c.modules.some(m => m.id === moduleId));
     if (!course) return;

     // 2. Prepare update object
     let updatedStudent = { ...currentUser };

     // 3. Mark Chapter as Completed if not already
     if(!updatedStudent.completedChapters.includes(chapterId)) {
         updatedStudent.completedChapters = [...updatedStudent.completedChapters, chapterId];
         // Simple progress calc: just +1% for demo, or real math
         updatedStudent.progress = Math.min(100, (updatedStudent.progress || 0) + 1); 
     }
     
     // Also mark module as complete if all chapters are done (simplified check)
     if (!updatedStudent.completedModules.includes(moduleId)) {
         updatedStudent.completedModules = [...updatedStudent.completedModules, moduleId];
     }

     // 4. Update "Last Accessed" to this chapter (so they return here or next)
     updatedStudent.lastAccessed = {
         courseId: course.id,
         moduleId: moduleId,
         chapterId: chapterId
     };

     handleUpdateStudent(updatedStudent);
  };

  // --- Enrollment Handler ---
  const handleEnrollCourse = (courseId: string) => {
      if (!currentUser) return;
      if (currentUser.enrolledCourses?.includes(courseId)) return; // Already enrolled

      const updatedStudent = {
          ...currentUser,
          enrolledCourses: [...(currentUser.enrolledCourses || []), courseId]
      };
      handleUpdateStudent(updatedStudent);
  };

  // --- Bookmark/Save Handler ---
  const handleToggleSave = (courseId: string) => {
      if (!currentUser) return;
      const saved = currentUser.savedCourses || [];
      const newSaved = saved.includes(courseId)
          ? saved.filter(id => id !== courseId)
          : [...saved, courseId];
      
      const updatedStudent = {
          ...currentUser,
          savedCourses: newSaved
      };
      handleUpdateStudent(updatedStudent);
  };

  // --- Template Handlers ---
  const handleAddTemplate = (template: MentorshipTemplate) => {
      setTemplates(prev => [template, ...prev]);
  };

  const handleUpdateTemplate = (template: MentorshipTemplate) => {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
  };

  const handleDeleteTemplate = (id: string) => {
      setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleMarkTemplateAsViewed = (templateId: string) => {
      if (!currentUser) return;
      if (currentUser.viewedTemplates?.includes(templateId)) return;

      const updatedStudent = {
          ...currentUser,
          viewedTemplates: [...(currentUser.viewedTemplates || []), templateId]
      };
      handleUpdateStudent(updatedStudent);
  };

  // --- Assignment Handlers ---
  const handleAddAssignment = (assignment: Assignment) => {
      setAssignments(prev => [assignment, ...prev]);
  };

  const handleUpdateAssignment = (assignment: Assignment) => {
      setAssignments(prev => prev.map(a => a.id === assignment.id ? assignment : a));
  };

  const handleDeleteAssignment = (id: string) => {
      setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // --- NEW: Assignment Submission Handler ---
  const handleSubmitAssignment = (submission: AssignmentSubmission) => {
      if (!currentUser) return;
      
      // Update the user's submissions list
      const updatedSubmissions = [
          ...(currentUser.assignmentSubmissions || []).filter(s => s.assignmentId !== submission.assignmentId), // Replace existing if retry
          submission
      ];

      const updatedStudent = {
          ...currentUser,
          assignmentSubmissions: updatedSubmissions
      };

      handleUpdateStudent(updatedStudent);
      
      // Optional: Notify sponsor (Simulated by adding a system message or notification logic here if we had a backend)
      console.log(`Notification: ${currentUser.name} submitted assignment ${submission.assignmentId}`);
  };

  // --- Notification Logic ---
  // Create notifications from unread messages for the current user
  const notifications: AppNotification[] = currentUser ? messages
    .filter(m => m.recipientHandle === currentUser.handle && !m.isRead)
    .map(m => {
        const sender = students.find(s => s.handle === m.senderHandle);
        return {
            id: m.id,
            title: sender?.name || m.senderHandle,
            subtitle: m.text,
            timestamp: m.timestamp,
            isRead: m.isRead,
            type: 'MESSAGE' as const,
            link: '/chat',
            avatarUrl: sender?.avatarUrl
        };
    })
    .sort((a,b) => b.timestamp - a.timestamp) : [];

  return (
    <HashRouter>
      <Routes>
        <Route path="/join" element={<OnboardingWizard onEnroll={handleSelfEnrollment} existingStudents={students} />} />
        <Route path="/" element={
           currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />

        <Route path="/dashboard" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <Dashboard 
                    currentUser={currentUser!} 
                    students={students} 
                    courses={courses} 
                    onReviewCourse={handleReviewCourse}
                    templates={templates}
                />
            </ProtectedRoute>
        } />
        
        <Route path="/sales" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <SalesPortal currentUser={currentUser!} onSubmitSale={handleSubmitSale} />
            </ProtectedRoute>
        } />
        
        <Route path="/chat" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <ChatPortal 
                    currentUser={currentUser!} 
                    students={students} 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                    onMarkAsRead={handleMarkAsRead} 
                    onClearChat={handleClearChat}
                    onDeleteMessage={handleDeleteMessage}
                />
            </ProtectedRoute>
        } />

        <Route path="/community" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CommunityPortal 
                    currentUser={currentUser!}
                    posts={posts}
                    cohorts={cohorts}
                    onAddPost={handleAddPost}
                    onAddComment={handleAddComment}
                    onLikePost={handleLikePost}
                />
            </ProtectedRoute>
        } />
        
        <Route path="/students" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                {currentUser?.role !== UserRole.STUDENT ? (
                    <StudentsList 
                        currentUser={currentUser!} 
                        students={students} 
                        onAddStudent={handleAddStudent} 
                        onUpdateStudent={handleUpdateStudent} 
                        onDeleteStudent={handleDeleteStudent}
                    />
                ) : <Navigate to="/dashboard" />}
            </ProtectedRoute>
        } />
        
        <Route path="/students/:studentId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <StudentProfile 
                    students={students} 
                    courses={courses} 
                    currentUser={currentUser!}
                    onUpdateStudent={handleUpdateStudent}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />
            </ProtectedRoute>
        } />
        
        <Route path="/course-review/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                 {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) ? (
                    <CourseReview courses={courses} onReviewCourse={handleReviewCourse} />
                 ) : <Navigate to="/dashboard" />}
            </ProtectedRoute>
        } />
        
        {/* Course Builder Route - Handles New and Edit */}
        <Route path="/builder" element={<Navigate to="/builder/new" replace />} />
        <Route path="/builder/:courseId" element={
             <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.SPONSOR) ? (
                    <CourseBuilder 
                        currentUserHandle={currentUser!.handle} 
                        courses={courses}
                        onSubmitCourse={handleSubmitCourse}
                        students={students} 
                    />
                ) : <Navigate to="/dashboard" />}
             </ProtectedRoute>
        } />

        <Route path="/sales-builder" element={
             <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <SalesPageBuilder />
             </ProtectedRoute>
        } />
        
        {/* Redirect Legacy Routes */}
        <Route path="/courses" element={<Navigate to="/classroom" replace />} />
        <Route path="/training/global" element={<Navigate to="/classroom" replace />} />
        <Route path="/training/team" element={<Navigate to="/classroom" replace />} />
        
        {/* Main Classroom Portal */}
        <Route path="/classroom" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <ClassroomPortal 
                    courses={courses} 
                    currentUser={currentUser!} 
                    onEnrollCourse={handleEnrollCourse}
                    onToggleSave={handleToggleSave}
                />
            </ProtectedRoute>
        } />

        {/* --- NEW ROUTE: Landing Page for Enrollment --- */}
        <Route path="/training/preview/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseLandingPage 
                    courses={courses} 
                    currentUser={currentUser!} 
                    onEnrollCourse={handleEnrollCourse}
                />
            </ProtectedRoute>
        } />

        <Route path="/training/course/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseModulesPage 
                    courses={courses} 
                    completedModules={currentUser?.completedModules || []} 
                />
            </ProtectedRoute>
        } />

        <Route path="/classroom/:courseId/:moduleId/:lessonId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <Classroom 
                    courses={courses} 
                    onCompleteLesson={handleCompleteLesson} 
                    onUpdateStats={handleUpdateStats}
                    completedChapters={currentUser?.completedChapters || []}
                />
            </ProtectedRoute>
        } />

        {/* Mentorship Tools Route */}
        <Route path="/mentorship-tools" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <MentorshipTools 
                    currentUser={currentUser!} 
                    templates={templates} 
                    assignments={assignments}
                    students={students}
                    onAddTemplate={handleAddTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    onAddAssignment={handleAddAssignment}
                    onDeleteAssignment={handleDeleteAssignment}
                    onUpdateAssignment={handleUpdateAssignment}
                    onUpdateTemplate={handleUpdateTemplate}
                />
            </ProtectedRoute>
        } />

        {/* Mentorship Inbox Route */}
        <Route path="/mentorship/inbox" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <MentorshipInbox 
                    currentUser={currentUser!} 
                    templates={templates}
                    onMarkAsViewed={handleMarkTemplateAsViewed}
                />
            </ProtectedRoute>
        } />

        {/* Assignment List for Downline */}
        <Route path="/assignments" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <AssignmentsList 
                    currentUser={currentUser!} 
                    assignments={assignments} 
                />
            </ProtectedRoute>
        } />

        {/* Assignment Player for Downline */}
        <Route path="/assignments/:assignmentId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <AssignmentPlayer 
                    currentUser={currentUser!} 
                    assignments={assignments}
                    onSubmit={handleSubmitAssignment}
                />
            </ProtectedRoute>
        } />

      </Routes>
    </HashRouter>
  );
};

export default App;
