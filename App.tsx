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
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_MESSAGES, INITIAL_POSTS, INITIAL_COHORTS } from './constants';
import { Course, Module, Student, SaleRecord, UserRole, Message, CourseTrack, CommunityPost, CommunityComment, Cohort } from './types';

// --- Moved Components Outside App to prevent re-mounting on state changes ---

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: Student | null;
  onLogout: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, currentUser, onLogout }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout currentUser={currentUser} onLogout={onLogout}>
      {children}
    </Layout>
  );
};

const CourseList: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const coursesByTrack = courses.reduce((acc, course) => {
    if (!course) return acc; 
    if (!acc[course.track]) {
      acc[course.track] = [];
    }
    acc[course.track].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="space-y-10">
       <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-950 font-heading dark:text-emerald-400">Training Portal</h1>
          <p className="text-emerald-700 mt-2 dark:text-emerald-300">Master the skills you need to grow your Forever business.</p>
       </div>

       {Object.keys(coursesByTrack).map((track) => (
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
                      
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">Modules ({course.modules?.length || 0})</div>
                        {course.modules?.map(m => (
                            <Link 
                              key={m.id} 
                              to={`/classroom/${course.id}/${m.id}/${m.lessons?.[0]?.id}`}
                              className="block p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm font-medium text-slate-700 flex justify-between items-center dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                            >
                              <span className="truncate flex-1 mr-2">{m.title}</span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-400 whitespace-nowrap dark:bg-slate-600 dark:border-slate-500 dark:text-slate-300">{m.lessons?.length || 0} lessons</span>
                            </Link>
                        ))}
                      </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
       ))}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Initialize State DIRECTLY with Mock Data (No fetching)
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 1. Authentication (Purely Local)
  const handleLogin = async (handle: string, pass: string): Promise<boolean> => {
    // Instant check against local state
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    
    const user = students.find(s => 
      s.handle.toLowerCase() === formattedHandle.toLowerCase() && 
      s.password === pass
    );

    if (user) {
        // Local Streak Logic calculation
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

        // Update state
        setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
        setCurrentUser(updatedUser);
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 2. Data Management (Purely Local State Updates)

  const handleAddModule = (newModule: Module, track?: CourseTrack) => {
    const updatedCourses = [...courses];
    const targetCourseIndex = updatedCourses.findIndex(c => c.track === track);
    if (targetCourseIndex !== -1) {
        updatedCourses[targetCourseIndex].modules.push(newModule);
    } else {
        updatedCourses[0].modules.push(newModule);
    }
    setCourses(updatedCourses);
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

    // Auto-promote logic
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

  const handleCompleteLesson = (moduleId: string) => {
     if(!currentUser) return;
     if(!currentUser.completedModules?.includes(moduleId)) {
         const updatedStudent = {
             ...currentUser,
             completedModules: [...(currentUser.completedModules || []), moduleId],
             progress: Math.min(100, (currentUser.progress || 0) + 5)
         };
         handleUpdateStudent(updatedStudent);
     }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/join" element={<OnboardingWizard onEnroll={handleAddStudent} existingStudents={students} />} />
        <Route path="/" element={
           currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />

        <Route path="/dashboard" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                <Dashboard currentUser={currentUser!} students={students} courses={courses} />
            </ProtectedRoute>
        } />
        
        <Route path="/sales" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                <SalesPortal currentUser={currentUser!} onSubmitSale={handleSubmitSale} />
            </ProtectedRoute>
        } />
        
        <Route path="/chat" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                <ChatPortal 
                    currentUser={currentUser!} 
                    students={students} 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                />
            </ProtectedRoute>
        } />

        <Route path="/community" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
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
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
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
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
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
        
        <Route path="/builder" element={
             <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) ? (
                    <CourseBuilder onAddModule={handleAddModule} />
                ) : <Navigate to="/dashboard" />}
             </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                <CourseList courses={courses} />
            </ProtectedRoute>
        } />
        
        <Route path="/classroom/:courseId/:moduleId/:lessonId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout}>
                <Classroom 
                    courses={courses} 
                    onCompleteLesson={handleCompleteLesson} 
                    onUpdateStats={handleUpdateStats}
                />
            </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;