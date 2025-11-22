import React, { useState } from 'react';
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
import Login from './components/Login';
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_MESSAGES } from './constants';
import { Course, Module, Student, SaleRecord, UserRole, Message, CourseTrack } from './types';

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
  // Group courses by track
  const coursesByTrack = courses.reduce((acc, course) => {
    if (!acc[course.track]) {
      acc[course.track] = [];
    }
    acc[course.track].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="space-y-10">
       <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-950 font-heading">Training Portal</h1>
          <p className="text-emerald-700 mt-2">Master the skills you need to grow your Forever business.</p>
       </div>

       {Object.keys(coursesByTrack).map((track) => (
         <div key={track} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 font-heading">{track}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByTrack[track].map(course => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden relative">
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white font-bold font-heading text-lg shadow-black/50 drop-shadow-md">{course.title}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                      <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{course.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules ({course.modules.length})</div>
                        {course.modules.map(m => (
                            <Link 
                              key={m.id} 
                              to={`/classroom/${course.id}/${m.id}/${m.lessons[0].id}`}
                              className="block p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm font-medium text-slate-700 flex justify-between items-center"
                            >
                              <span className="truncate flex-1 mr-2">{m.title}</span>
                              <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-400 whitespace-nowrap">{m.lessons.length} lessons</span>
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
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  const handleLogin = (handle: string, pass: string): boolean => {
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const user = students.find(s => 
      s.handle.toLowerCase() === formattedHandle.toLowerCase() && 
      s.password === pass
    );

    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddModule = (newModule: Module, track?: CourseTrack) => {
    const updatedCourses = [...courses];
    
    // If admin provided a track, try to find a course in that track or create one
    // For simplicity in this demo, we just add it to the first course that matches the track,
    // or default to 'Welcome to Forever' if no track specified (or create new logic as needed)
    // A robust system would let admins create COURSES, not just modules. 
    // Here we assume modules are added to existing courses for simplicity.
    
    const targetCourseIndex = updatedCourses.findIndex(c => c.track === track);
    if (targetCourseIndex !== -1) {
        updatedCourses[targetCourseIndex].modules.push(newModule);
    } else {
        updatedCourses[0].modules.push(newModule); // Fallback
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
        caseCredits: currentUser.caseCredits + sale.ccEarned,
        salesHistory: [sale, ...(currentUser.salesHistory || [])]
    };
    handleUpdateStudent(updatedStudent);
  };

  const handleSendMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCompleteLesson = (moduleId: string) => {
     // In a real app, this would update the specific user's progress.
     // For this demo, we'll just update the currentUser state in memory if needed
     // or trigger a notification.
     console.log("Lesson in module completed:", moduleId);
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
                <Dashboard currentUser={currentUser!} students={students} />
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
                <Classroom courses={courses} onCompleteLesson={handleCompleteLesson} />
            </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;