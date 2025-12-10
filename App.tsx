
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import OnboardingWizard from './components/OnboardingWizard';
import StudentsList from './components/StudentsList';
import StudentProfile from './components/StudentProfile';
import CourseBuilder from './components/CourseBuilder';
import ChatPortal from './components/ChatPortal';
import SalesPortal from './components/SalesPortal';
import CourseReview from './components/CourseReview';
import TrainingPortal from './components/TrainingPortal';
import CourseLandingPage from './components/CourseLandingPage';
import ClassroomPortal from './components/ClassroomPortal';
import CourseModulesPage from './components/CourseModulesPage';
import Classroom from './components/Classroom';
import MentorshipTools from './components/MentorshipTools';
import MentorshipInbox from './components/MentorshipInbox';
import AssignmentsList from './components/AssignmentsList';
import AssignmentPlayer from './components/AssignmentPlayer';
import CommunityPortal from './components/CommunityPortal';
import SalesPageBuilder from './pages/SalesPageBuilder';
import BroadcastInbox from './components/BroadcastInbox';

import { Student, Course, Message, AppNotification, CommunityPost, Cohort, SaleRecord, MentorshipTemplate, Assignment, AssignmentSubmission, CourseStatus, Broadcast } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_MESSAGES, INITIAL_POSTS, INITIAL_COHORTS, INITIAL_TEMPLATES, INITIAL_ASSIGNMENTS, INITIAL_BROADCASTS } from './constants';

const ProtectedRoute = ({ children, currentUser, ...props }: any) => {
  if (!currentUser) return <Navigate to="/" replace />;
  return <Layout currentUser={currentUser} {...props}>{children}</Layout>;
};

const App: React.FC = () => {
  // State initialization
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [templates, setTemplates] = useState<MentorshipTemplate[]>(INITIAL_TEMPLATES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Handlers
  const handleLogin = async (handle: string, pass: string): Promise<boolean> => {
    const user = students.find(s => s.handle === handle && s.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => setCurrentUser(null);

  const handleEnroll = (newStudent: Student) => {
    setStudents([...students, newStudent]);
    setCurrentUser(newStudent);
  };

  const handleAddStudent = (student: Student) => setStudents([...students, student]);
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (currentUser?.id === updatedStudent.id) setCurrentUser(updatedStudent);
  };
  const handleDeleteStudent = (id: string) => setStudents(students.filter(s => s.id !== id));

  const handleSubmitCourse = (course: Course) => {
    const exists = courses.find(c => c.id === course.id);
    if (exists) {
        setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
        setCourses([...courses, course]);
    }
  };

  const handleReviewCourse = (courseId: string, status: CourseStatus) => {
      setCourses(courses.map(c => c.id === courseId ? { ...c, status } : c));
  };

  const handleEnrollCourse = (courseId: string) => {
      if (!currentUser) return;
      if (!currentUser.enrolledCourses.includes(courseId)) {
          const updatedUser = { ...currentUser, enrolledCourses: [...currentUser.enrolledCourses, courseId] };
          handleUpdateStudent(updatedUser);
      }
  };

  const handleToggleSave = (courseId: string) => {
      if (!currentUser) return;
      const saved = currentUser.savedCourses || [];
      const newSaved = saved.includes(courseId) ? saved.filter(id => id !== courseId) : [...saved, courseId];
      handleUpdateStudent({ ...currentUser, savedCourses: newSaved });
  };

  const handleSendMessage = (message: Message) => setMessages([...messages, message]);
  const handleMarkAsRead = (senderHandle: string) => {
      setMessages(messages.map(m => m.senderHandle === senderHandle && !m.isRead ? { ...m, isRead: true } : m));
  };
  const handleClearChat = (handle: string) => {
      setMessages(messages.filter(m => m.senderHandle !== handle && m.recipientHandle !== handle));
  };
  const handleDeleteMessage = (msgId: string) => setMessages(messages.filter(m => m.id !== msgId));

  const handleAddPost = (post: CommunityPost) => setPosts([post, ...posts]);
  const handleAddComment = (postId: string, comment: any) => {
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };
  const handleLikePost = (postId: string) => {
      if (!currentUser) return;
      setPosts(posts.map(p => {
          if (p.id !== postId) return p;
          const liked = p.likedBy.includes(currentUser.handle);
          return {
              ...p,
              likes: liked ? p.likes - 1 : p.likes + 1,
              likedBy: liked ? p.likedBy.filter(h => h !== currentUser.handle) : [...p.likedBy, currentUser.handle]
          };
      }));
  };

  const handleSubmitSale = (sale: SaleRecord) => {
      if (!currentUser) return;
      const history = [...(currentUser.salesHistory || []), sale];
      const newCC = currentUser.caseCredits + sale.ccEarned;
      handleUpdateStudent({ ...currentUser, salesHistory: history, caseCredits: newCC });
  };

  const handleCompleteLesson = (moduleId: string, chapterId: string) => {
      if (!currentUser) return;
      if (!currentUser.completedChapters.includes(chapterId)) {
          handleUpdateStudent({ 
              ...currentUser, 
              completedChapters: [...currentUser.completedChapters, chapterId] 
          });
      }
  };

  const handleUpdateStats = (seconds: number, questions: number) => {
      // Placeholder for stats update logic
  };

  const handleAddTemplate = (t: MentorshipTemplate) => setTemplates([...templates, t]);
  const handleUpdateTemplate = (t: MentorshipTemplate) => setTemplates(templates.map(tmp => tmp.id === t.id ? t : tmp));
  const handleDeleteTemplate = (id: string) => setTemplates(templates.filter(t => t.id !== id));

  const handleAddAssignment = (a: Assignment) => setAssignments([...assignments, a]);
  const handleUpdateAssignment = (a: Assignment) => setAssignments(assignments.map(asg => asg.id === a.id ? a : asg));
  const handleDeleteAssignment = (id: string) => setAssignments(assignments.filter(a => a.id !== id));

  const handleAssignmentSubmit = (sub: AssignmentSubmission) => {
      if (!currentUser) return;
      const subs = [...(currentUser.assignmentSubmissions || [])];
      const existingIdx = subs.findIndex(s => s.assignmentId === sub.assignmentId);
      if (existingIdx >= 0) subs[existingIdx] = sub;
      else subs.push(sub);
      
      handleUpdateStudent({ ...currentUser, assignmentSubmissions: subs });
  };

  // --- Broadcast Handlers ---
  const handleSendBroadcast = (broadcast: Broadcast) => {
      // For now, updating local state is enough since we lift state here
      setBroadcasts(prev => {
          const exists = prev.find(b => b.id === broadcast.id);
          if (exists) return prev.map(b => b.id === broadcast.id ? broadcast : b);
          return [broadcast, ...prev];
      });
  };

  const handleDeleteBroadcast = (id: string) => {
      setBroadcasts(prev => prev.filter(b => b.id !== id));
  };

  const handleReadBroadcast = (id: string) => {
      if (!currentUser) return;
      const read = currentUser.readBroadcasts || [];
      if (!read.includes(id)) {
          handleUpdateStudent({ ...currentUser, readBroadcasts: [...read, id] });
      }
  };

  const handleToggleBroadcastBookmark = (id: string) => {
      if (!currentUser) return;
      const bookmarked = currentUser.bookmarkedBroadcasts || [];
      const newBookmarked = bookmarked.includes(id) 
          ? bookmarked.filter(bid => bid !== id) 
          : [...bookmarked, id];
      handleUpdateStudent({ ...currentUser, bookmarkedBroadcasts: newBookmarked });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/join" element={<OnboardingWizard onEnroll={handleEnroll} existingStudents={students} />} />
        
        <Route path="/dashboard" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications} templates={templates} broadcasts={broadcasts}>
                <Dashboard students={students} currentUser={currentUser!} courses={courses} templates={templates} broadcasts={broadcasts} />
            </ProtectedRoute>
        } />

        <Route path="/chat" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications} templates={templates} assignments={assignments}>
                <ChatPortal 
                    currentUser={currentUser!} 
                    students={students} 
                    messages={messages} 
                    templates={templates}
                    assignments={assignments}
                    onSendMessage={handleSendMessage} 
                    onMarkAsRead={handleMarkAsRead} 
                    onClearChat={handleClearChat}
                    onDeleteMessage={handleDeleteMessage}
                />
            </ProtectedRoute>
        } />

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

        <Route path="/training/course/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseModulesPage courses={courses} completedModules={currentUser?.completedModules || []} />
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

        <Route path="/training/preview/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseLandingPage 
                    courses={courses} 
                    currentUser={currentUser!} 
                    students={students}
                    onEnrollCourse={handleEnrollCourse} 
                />
            </ProtectedRoute>
        } />

        <Route path="/training/global" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <TrainingPortal courses={courses} mode="GLOBAL" currentUser={currentUser!} onEnrollCourse={handleEnrollCourse} />
            </ProtectedRoute>
        } />

        <Route path="/training/team" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <TrainingPortal courses={courses} mode="TEAM" currentUser={currentUser!} onEnrollCourse={handleEnrollCourse} />
            </ProtectedRoute>
        } />

        <Route path="/students" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <StudentsList 
                    students={students} 
                    currentUser={currentUser!} 
                    onAddStudent={handleAddStudent} 
                    onUpdateStudent={handleUpdateStudent}
                    onDeleteStudent={handleDeleteStudent}
                />
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

        <Route path="/sales" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <SalesPortal currentUser={currentUser!} onSubmitSale={handleSubmitSale} />
            </ProtectedRoute>
        } />

        <Route path="/sales-builder" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <SalesPageBuilder />
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

        <Route path="/broadcasts" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <BroadcastInbox 
                    currentUser={currentUser!} 
                    broadcasts={broadcasts}
                    onMarkRead={handleReadBroadcast}
                    onToggleBookmark={handleToggleBroadcastBookmark}
                />
            </ProtectedRoute>
        } />

        <Route path="/builder" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseBuilder currentUserHandle={currentUser?.handle || ''} courses={courses} onSubmitCourse={handleSubmitCourse} students={students} />
            </ProtectedRoute>
        } />

        <Route path="/builder/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseBuilder currentUserHandle={currentUser?.handle || ''} courses={courses} onSubmitCourse={handleSubmitCourse} students={students} />
            </ProtectedRoute>
        } />

        <Route path="/mentorship/inbox" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <MentorshipInbox 
                    currentUser={currentUser!} 
                    templates={templates} 
                    onMarkAsViewed={(id) => {
                        if(currentUser) {
                            const viewed = currentUser.viewedTemplates || [];
                            if(!viewed.includes(id)) handleUpdateStudent({...currentUser, viewedTemplates: [...viewed, id]});
                        }
                    }}
                />
            </ProtectedRoute>
        } />

        <Route path="/assignments" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <AssignmentsList currentUser={currentUser!} assignments={assignments} />
            </ProtectedRoute>
        } />

        <Route path="/assignments/:assignmentId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <AssignmentPlayer currentUser={currentUser!} assignments={assignments} onSubmit={handleAssignmentSubmit} />
            </ProtectedRoute>
        } />

        <Route path="/mentorship-tools" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <MentorshipTools 
                    currentUser={currentUser!} 
                    templates={templates} 
                    assignments={assignments}
                    students={students}
                    broadcasts={broadcasts}
                    onAddTemplate={handleAddTemplate} 
                    onDeleteTemplate={handleDeleteTemplate}
                    onUpdateTemplate={handleUpdateTemplate}
                    onAddAssignment={handleAddAssignment}
                    onDeleteAssignment={handleDeleteAssignment}
                    onUpdateAssignment={handleUpdateAssignment}
                    onSendBroadcast={handleSendBroadcast}
                    onDeleteBroadcast={handleDeleteBroadcast}
                />
            </ProtectedRoute>
        } />

        <Route path="/review/:courseId" element={
            <ProtectedRoute currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} courses={courses} notifications={notifications}>
                <CourseReview courses={courses} onReviewCourse={handleReviewCourse} />
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
