import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CourseBuilder from './components/CourseBuilder';
import Classroom from './components/Classroom';
import StudentsList from './components/StudentsList';
import StudentProfile from './components/StudentProfile';
import OnboardingWizard from './components/OnboardingWizard';
import Login from './components/Login';
import { INITIAL_COURSES, INITIAL_STUDENTS } from './constants';
import { Course, Module, Student, UserRole } from './types';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  const handleLogin = (handle: string, pass: string): boolean => {
    // Add '@' if missing
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

  const handleAddModule = (newModule: Module) => {
    const updatedCourses = [...courses];
    updatedCourses[0].modules.push(newModule);
    setCourses(updatedCourses);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  // Function to update existing student data (e.g. Password Reset, CC update, Avatar)
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    
    // If the updated user is the current user, update session state too
    if (currentUser && currentUser.id === updatedStudent.id) {
        setCurrentUser(updatedStudent);
    }
  };

  // Function to delete a student (Super Admin only)
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleCompleteLesson = (moduleId: string) => {
     // For demo, just log it. In real app, update currentUser + students list
     console.log("Lesson in module completed:", moduleId);
  };

  // Protected Route Wrapper
  const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    return (
      <Layout currentUser={currentUser} onLogout={handleLogout}>
        {children}
      </Layout>
    );
  };

  // Simple Course List Component (Visible to all logged in)
  const CourseList: React.FC<{ courses: Course[] }> = ({ courses }) => (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-emerald-950 font-heading">Training Courses</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
               <div className="h-40 overflow-hidden relative">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2">
                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules</div>
                     {course.modules.map(m => (
                        <Link 
                          key={m.id} 
                          to={`/classroom/${course.id}/${m.id}/${m.lessons[0].id}`}
                          className="block p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm font-medium text-slate-700 flex justify-between items-center"
                        >
                          <span>{m.title}</span>
                          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-400">{m.lessons.length} lessons</span>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/join" element={<OnboardingWizard onEnroll={handleAddStudent} existingStudents={students} />} />
        
        {/* Root is Login if not authenticated, else redirect to dashboard */}
        <Route path="/" element={
           currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard currentUser={currentUser!} students={students} /></ProtectedRoute>} />
        
        {/* Only Admins & Sponsors can see list of students */}
        <Route path="/students" element={
            <ProtectedRoute>
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
            <ProtectedRoute>
                <StudentProfile 
                    students={students} 
                    courses={courses} 
                    currentUser={currentUser!}
                    onUpdateStudent={handleUpdateStudent}
                />
            </ProtectedRoute>
        } />
        
        {/* Only Admins can use builder */}
        <Route path="/builder" element={
             <ProtectedRoute>
                {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) ? (
                    <CourseBuilder onAddModule={handleAddModule} />
                ) : <Navigate to="/dashboard" />}
             </ProtectedRoute>
        } />
        
        <Route path="/courses" element={<ProtectedRoute><CourseList courses={courses} /></ProtectedRoute>} />
        <Route path="/classroom/:courseId/:moduleId/:lessonId" element={
            <ProtectedRoute><Classroom courses={courses} onCompleteLesson={handleCompleteLesson} /></ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;