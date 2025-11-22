import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Student, Course, UserRole } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StudentProfileProps {
  students: Student[];
  courses: Course[];
  currentUser: Student;
  onUpdateStudent: (student: Student) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ students, courses, currentUser, onUpdateStudent }) => {
  const { studentId } = useParams();
  const student = students.find(s => s.id === studentId);
  
  const [showPassword, setShowPassword] = useState(false);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="text-lg mb-4">Student not found.</p>
        <Link to="/students" className="text-emerald-600 hover:underline">Back to Students List</Link>
      </div>
    );
  }

  // Demo function to simulate buying products (increasing CC)
  const handleAddCC = () => {
    const updated = {...student, caseCredits: student.caseCredits + 0.5};
    onUpdateStudent(updated);
  };

  const isSponsor = student.caseCredits >= 2;
  const canViewCredentials = currentUser.id === student.id || currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN;

  // Calculate derived stats
  const allModules = courses.flatMap(c => c.modules);
  const totalModulesCount = allModules.length;
  const completedCount = student.completedModules.length;
  const remainingCount = Math.max(0, totalModulesCount - completedCount);
  const calculatedProgress = totalModulesCount > 0 ? Math.round((completedCount / totalModulesCount) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: remainingCount },
  ];
  
  const COLORS = ['#059669', '#cbd5e1'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/students" className="hover:text-emerald-600 transition-colors">Students</Link>
        <span>/</span>
        <span className="text-emerald-900 font-medium">{student.name}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center text-3xl font-bold shadow-inner border-4 border-white">
            {student.name.charAt(0)}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-emerald-950">{student.name}</h1>
              {isSponsor ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 uppercase tracking-wider flex items-center gap-1">
                   <span className="text-lg">⭐</span> Sponsor (2CC+)
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wider">
                  Student
                </span>
              )}
            </div>
            <p className="font-mono text-emerald-600 font-medium text-lg">{student.handle}</p>
            
            <div className="flex items-center gap-6 text-slate-500 text-sm mt-4">
              <div className="flex items-center gap-1.5">
                <EnvelopeIcon />
                {student.email}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Invited by:</span>
                <span className="font-mono text-emerald-600">{student.sponsorId || 'N/A'}</span>
              </div>
            </div>

            {/* CC Progress for Students */}
            <div className="mt-4 max-w-md">
                <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Case Credits (CC)</span>
                    <span className={student.caseCredits >= 2 ? 'text-green-600' : 'text-slate-500'}>{student.caseCredits.toFixed(1)} / 2.0 CC</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${isSponsor ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (student.caseCredits / 2) * 100)}%` }}></div>
                </div>
                {!isSponsor && currentUser.id === student.id && (
                    <button onClick={handleAddCC} className="mt-2 text-xs text-emerald-600 hover:underline">
                        + Simulate 0.5CC Order
                    </button>
                )}
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center gap-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{calculatedProgress}%</div>
                <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Progress</div>
             </div>
             <div className="w-px h-10 bg-slate-200"></div>
             <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{completedCount} <span className="text-slate-400 text-lg font-normal">/ {totalModulesCount}</span></div>
                <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Modules Done</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Progress & Credentials */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Credentials Card */}
          {canViewCredentials && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 mb-1">Security Credentials</h3>
                    <p className="text-xs text-slate-500">Access information for this account.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Password</p>
                        <p className="font-mono text-slate-800 font-medium min-w-[100px] text-right">
                            {showPassword ? student.password : '••••••••'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-full transition-colors"
                    >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-emerald-950">Enrolled Courses</h2>
          {courses.map(course => {
            const totalCourseModules = course.modules.length;
            const completedInCourse = course.modules.filter(m => student.completedModules.includes(m.id)).length;
            const courseProgress = totalCourseModules > 0 ? Math.round((completedInCourse / totalCourseModules) * 100) : 0;

            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{course.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1 mt-1">{course.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                            courseProgress === 100 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}>
                            {courseProgress}% Complete
                        </span>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
                        <div 
                            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${courseProgress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>{completedInCourse} of {totalCourseModules} modules completed</span>
                        {courseProgress === 100 && <span className="text-emerald-600">Course Completed! 🏆</span>}
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {course.modules.map(module => {
                    const isCompleted = student.completedModules.includes(module.id);
                    return (
                      <div key={module.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-white border-slate-300 text-transparent'
                            }`}>
                               <CheckIcon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                               <p className={`text-sm font-medium ${isCompleted ? 'text-emerald-900' : 'text-slate-600'}`}>
                                 {module.title}
                               </p>
                               <p className="text-xs text-slate-400">{module.lessons.length} lessons</p>
                            </div>
                         </div>
                         {isCompleted ? (
                           <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span>
                         ) : (
                           <span className="text-xs font-medium text-slate-400">Pending</span>
                         )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-emerald-950 mb-4">Engagement Overview</h2>
            <div className="h-64 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                 <div className="text-center">
                    <span className="block text-3xl font-bold text-emerald-800">{calculatedProgress}%</span>
                    <span className="text-xs text-slate-400">Total</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-lg mb-2">AI Tutor Stats</h3>
               <p className="text-emerald-100 text-sm mb-4">Based on recent interactions</p>
               
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-emerald-200">Questions Asked</span>
                    <span className="font-semibold">12</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-emerald-200">Avg. Lesson Time</span>
                    <span className="font-semibold">8m 45s</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-200">Learning Streak</span>
                    <span className="font-semibold text-yellow-400">3 Days 🔥</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export default StudentProfile;