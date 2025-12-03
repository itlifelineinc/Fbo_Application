
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import SalesPageBuilder from './pages/SalesPageBuilder'; // Import the new page
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_MESSAGES, INITIAL_POSTS, INITIAL_COHORTS } from './constants';
import { Course, Module, Student, SaleRecord, UserRole, Message, CourseTrack, CommunityPost, CommunityComment, Cohort, CourseStatus } from './types';

// --- Protected Route ---

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: Student | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, currentUser, onLogout, theme, onToggleTheme }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout currentUser={currentUser} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme}>
      {children}
    </Layout>
  );
};

const CourseList: React.FC<{ courses: Course[], currentUser: Student }> = ({ courses, currentUser }) => {
  // Check if currentUser exists before rendering to avoid crash
  if (!currentUser) return null;

  const publishedCourses = courses.filter(c => c.status === CourseStatus.PUBLISHED);

  const coursesByTrack = publishedCourses.reduce((acc, course) => {
    if (!acc[course.track]) {
      acc[course.track] = [];
    }
    acc[course.track].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Helper to generate the correct link
  const getResumeLink = (course: Course) => {
      // 1. If user has a tracked last accessed point for this course, go there
      if (currentUser?.lastAccessed && currentUser.lastAccessed.courseId === course.id) {
          return `/classroom/${course.id}/${currentUser.lastAccessed.moduleId}/${currentUser.lastAccessed.chapterId}`;
      }
      
      // 2. Default to first chapter of first module
      if (course.modules.length > 0 && course.modules[0].chapters.length > 0) {
          return `/classroom/${course.id}/${course.modules[0].id}/${course.modules[0].chapters[0].id}`;
      }

      return '#'; // Fallback
  };

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-950 font-heading dark:text-emerald-400">Training Portal</h1>
          <p className="text-emerald-700 mt-2 dark:text-emerald-300">Master the skills you need to grow your Forever business.</p>
       </div>

       {Object.keys(coursesByTrack).length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
               <p className="text-slate-500 text-lg dark:text-slate-400">No courses available yet.</p>
               <p className="text-slate-400 text-sm mt-2 dark:text-slate-500">Check back later for updates.</p>
           </div>
       ) : (
           Object.keys(coursesByTrack).map((track) => (
             <div key={track} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 font-heading dark:text-slate-200">{track}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByTrack[track].map(course => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
                      <div className="h-40 overflow-hidden relative">
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-3 left-4 text-white font-bold font-heading text-lg shadow-black/50 drop-shadow-md">{course.title}</div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                          <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2 dark:text-slate-400">{course.description}</p>
                          
                          <div className="space-y-4 mt-auto">
                            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                                <span>{course.modules?.length || 0} Modules</span>
                                <span>By {course.authorHandle}</span>
                            </div>
                            
                            <Link 
                                to={getResumeLink(course)}
                                className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                            >
                                {currentUser.lastAccessed?.courseId === course.id ? 'Continue Learning' : 'Start Course'}
                            </Link>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           ))
       )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = async (handle: string, pass: string): Promise<boolean> => {
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
            }
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

  const handleSubmitCourse = (newCourse: Course) => {
      setCourses(prev => [...prev, newCourse]);
  };

  const handleReviewCourse = (courseId: string, status: CourseStatus) => {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status } : c));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
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

  const handleSubmitSale = (sale: SaleRecord) => {
    if (!currentUser) return;
    const updatedStudent = {
        ...currentUser,
        caseCredits: (currentUser.caseCredits || 0) + sale.ccEarned,
        salesHistory: [sale, ...(currentUser.salesHistory || [])]
    };
    if (updatedStudent.role === UserRole.STUDENT && updatedStudent.caseCredits >= 2) {
        updatedStudent.role = UserRole.SPONSOR;
    }
    handleUpdateStudent(updatedStudent);
  };

  const handleSendMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
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
            return { ...p, likedBy: newLikedBy, likes: newLikedBy.length };
        }
        return p;
    }));
  };

  const handleAddComment = (postId: string, comment: CommunityComment) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
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

     // 4. Update "Last Accessed" to this chapter (so they return here or next)
     updatedStudent.lastAccessed = {
         courseId: course.id,
         moduleId: moduleId,
         chapterId: chapterId
     };

     handleUpdateStudent(updatedStudent);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/join" element={<OnboardingWizard onEnroll={handleAddStudent} existingStudents={students} />} />
        <Route path="/" element={
           currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />

        <Route path="/dashboard" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <Dashboard 
                    currentUser={currentUser!} 
                    students={students} 
                    courses={courses} 
                    onReviewCourse={handleReviewCourse}
                />
            </ProtectedRoute>
        } />
        
        <Route path="/sales" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <SalesPortal currentUser={currentUser!} onSubmitSale={handleSubmitSale} />
            </ProtectedRoute>
        } />
        
        <Route path="/chat" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <ChatPortal 
                    currentUser={currentUser!} 
                    students={students} 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                />
            </ProtectedRoute>
        } />

        <Route path="/community" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
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
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
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
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
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
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                 {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) ? (
                    <CourseReview courses={courses} onReviewCourse={handleReviewCourse} />
                 ) : <Navigate to="/dashboard" />}
            </ProtectedRoute>
        } />
        
        <Route path="/builder" element={
             <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.SPONSOR) ? (
                    <CourseBuilder 
                        currentUserHandle={currentUser?.handle || ''} 
                        onSubmitCourse={handleSubmitCourse} 
                    />
                ) : <Navigate to="/dashboard" />}
             </ProtectedRoute>
        } />

        <Route path="/sales-builder" element={
             <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <SalesPageBuilder />
             </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <CourseList courses={courses} currentUser={currentUser!} />
            </ProtectedRoute>
        } />
        
        <Route path="/classroom/:courseId/:moduleId/:lessonId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme}>
                <Classroom 
                    courses={courses} 
                    onCompleteLesson={handleCompleteLesson} 
                    onUpdateStats={handleUpdateStats}
                    completedChapters={currentUser?.completedChapters || []}
                />
            </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;