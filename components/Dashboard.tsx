import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course } from '../types';

interface DashboardProps {
  students: Student[];
  currentUser: Student;
  courses: Course[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, currentUser, courses }) => {
  const navigate = useNavigate();
  const isStudent = currentUser.role === UserRole.STUDENT;
  const isSponsor = currentUser.role === UserRole.SPONSOR;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const isAdmin = currentUser.role === UserRole.ADMIN || isSuperAdmin;

  // Filter Logic based on Role
  let visibleStudents = students;
  if (isStudent) {
    visibleStudents = [currentUser]; // Can only see self
  } else if (isSponsor) {
    visibleStudents = students.filter(s => s.sponsorId === currentUser.handle); // Downline
  }
  // Admin sees all (default)

  const averageProgress = visibleStudents.length > 0 
    ? Math.round(visibleStudents.reduce((acc, s) => acc + s.progress, 0) / visibleStudents.length) 
    : 0;

  // Chart Data
  const chartData = visibleStudents.map(s => ({
    name: s.name.split(' ')[0], 
    progress: s.progress,
    cc: s.caseCredits
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading">
            {isAdmin ? 'System Dashboard' : isSponsor ? 'Team Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-emerald-700 mt-2 text-sm md:text-base">
            {isAdmin 
                ? "Platform-wide analytics and control center." 
                : isSponsor 
                ? `Tracking ${visibleStudents.length} members in your downline.` 
                : "Your personal growth and learning tracker."
            }
        </p>
      </header>

      {/* Stats Cards - Dynamic based on Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {!isStudent && (
            <StatCard 
            title={isAdmin ? "Total Users" : "Team Members"} 
            value={visibleStudents.length.toString()} 
            icon={<UserGroupIcon />} 
            trend={isAdmin ? "+12% growth" : "Active & Growing"}
            />
        )}
        <StatCard 
          title={isStudent ? "My Completion" : "Avg. Team Completion"} 
          value={isStudent ? `${currentUser.progress}%` : `${averageProgress}%`} 
          icon={<ChartBarIcon />}
          trend="Based on assigned courses" 
        />
        <StatCard 
          title={isStudent ? "My CC" : "Total Team CC"} 
          value={isStudent ? currentUser.caseCredits.toString() : visibleStudents.reduce((acc,s) => acc + s.caseCredits, 0).toFixed(1)} 
          icon={<CurrencyDollarIcon />} 
          trend="Case Credits"
        />
      </div>

      {/* Main Grid Layout - Swapped columns for better spacing: Chart (Left 2/3), Widgets (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Charts & Course List (Takes 2 columns on desktop, 1 on mobile) */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            
            {/* Progress Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 font-heading">
                        {isStudent ? 'Your Progress vs Goals' : 'Team Leaderboard'}
                    </h2>
                </div>
                <div className="h-64 md:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="progress" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.progress > 80 ? '#059669' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>

            {/* Enrolled Courses List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg md:text-xl font-bold text-emerald-950 mb-4 font-heading">Enrolled Courses</h2>
                <div className="space-y-4">
                  {courses.map(course => {
                    // Calculate progress logic
                    const totalCourseModules = course.modules.length;
                    const completedInCourse = course.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
                    const courseProgress = totalCourseModules > 0 ? Math.round((completedInCourse / totalCourseModules) * 100) : 0;

                    return (
                      <div key={course.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-full sm:w-24 h-32 sm:h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                           <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-800 truncate text-sm md:text-base">{course.title}</h3>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">{course.track}</span>
                           </div>
                           
                           {/* Progress Bar */}
                           <div className="flex items-center gap-3">
                             <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${courseProgress}%` }}></div>
                             </div>
                             <span className="text-xs font-bold text-emerald-700 w-10 text-right">{courseProgress}%</span>
                           </div>
                           <p className="text-xs text-slate-400 mt-1">{completedInCourse} of {totalCourseModules} modules completed</p>
                        </div>

                        {/* Action */}
                        <Link 
                            to={`/classroom/${course.id}/${course.modules[0]?.id}/${course.modules[0]?.lessons[0]?.id}`}
                            className="w-full sm:w-auto bg-emerald-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-center whitespace-nowrap"
                        >
                            {courseProgress === 0 ? 'Start' : 'Continue'}
                        </Link>
                      </div>
                    );
                  })}
                </div>
            </div>

          </div>

          {/* Right Column: Widgets (Takes 1 column on desktop, stacks on mobile) */}
          <div className="space-y-6 min-w-0">
            
            {/* Quick User Search Widget (Super Admin Only) */}
            {isSuperAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-4 text-emerald-800">
                        <div className="bg-emerald-100 p-2 rounded-lg"><MagnifyingGlassIcon /></div>
                        <h3 className="font-bold text-lg">Quick User Lookup</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Find users instantly to manage passwords or roles.</p>
                    <div className="flex gap-2">
                        <Link 
                            to="/students" 
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-center text-sm flex items-center justify-center gap-2"
                        >
                            <MagnifyingGlassIcon />
                            Search Users
                        </Link>
                    </div>
                </div>
            )}

            {/* Recruitment Widget - Visible to Sponsor & Admin */}
            {!isStudent && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-2 font-heading">Enroll New FBO</h2>
                            <p className="text-emerald-100 text-sm">Grow your business by inviting new members.</p>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <div className="text-xs text-emerald-200 uppercase font-semibold tracking-wider mb-2">Your Sponsor Handle</div>
                            <div className="flex gap-2 items-center bg-black/20 rounded-lg p-2 text-sm font-mono text-emerald-100 truncate w-full">
                                <span className="truncate">{currentUser.handle}</span>
                            </div>
                            <Link to="/join" className="block w-full mt-3 bg-white text-emerald-700 text-center py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm">
                                Open Enrollment Form
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Icon */}
                    <div className="absolute -right-6 -bottom-6 text-emerald-500/20 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48">
                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                            <path d="M10.933 19.231l-7.668-4.13-1.37.738a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134 0z" />
                        </svg>
                    </div>
                </div>
            )}
            
             {/* If Student, show personal Next Steps */}
            {isStudent && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                        <AcademicCapIcon />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 font-heading">Your Next Goal: 2CC</h3>
                    <p className="text-slate-500 mt-2 mb-6 text-sm">
                        Complete your training and accumulate 2 Case Credits to become a Sponsor and build your own team.
                    </p>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${(currentUser.caseCredits / 2) * 100}%`}}></div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-emerald-600">{currentUser.caseCredits} / 2.0 CC</div>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 font-heading">{value}</h3>
      <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>
    </div>
  </div>
);

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.221 69.17 69.17 0 00-2.66.812M12 14.952V16.95M7 10.05h.008v.008H7v-.008zm5.374 9.332l-.223.55a.51.51 0 01-.902 0l-.223-.55a.51.51 0 01.948 0z" />
  </svg>
);

const CurrencyDollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MagnifyingGlassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export default Dashboard;