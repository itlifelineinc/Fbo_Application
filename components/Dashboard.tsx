import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus } from '../types';

// --- Child Components & Icons (Defined First) ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800 font-heading mt-1">{value}</h3>
      <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
        <span className="text-lg">↗</span> {trend}
      </p>
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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
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

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

interface DashboardProps {
  students: Student[];
  currentUser: Student;
  courses: Course[];
  onReviewCourse?: (courseId: string, status: CourseStatus) => void;
}

// --- Main Component ---

const Dashboard: React.FC<DashboardProps> = ({ students, currentUser, courses, onReviewCourse }) => {
  const navigate = useNavigate();
  const isStudent = currentUser.role === UserRole.STUDENT;
  const isSponsor = currentUser.role === UserRole.SPONSOR;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const isAdmin = currentUser.role === UserRole.ADMIN || isSuperAdmin;

  // Filter Logic based on Role
  let visibleStudents = students || []; 
  if (isStudent) {
    visibleStudents = [currentUser]; // Can only see self
  } else if (isSponsor) {
    visibleStudents = students.filter(s => s.sponsorId === currentUser.handle); // Downline
  }
  // Admin sees all (default)

  const averageProgress = visibleStudents.length > 0 
    ? Math.round(visibleStudents.reduce((acc, s) => acc + (s.progress || 0), 0) / visibleStudents.length) 
    : 0;

  // Chart Data for Team Leaderboard
  const chartData = visibleStudents.map(s => ({
    name: s.name ? s.name.split(' ')[0] : 'Unknown', 
    progress: s.progress || 0,
    cc: s.caseCredits || 0
  }));

  // Personal Progress Data (Pie Chart)
  const allModules = courses.flatMap(c => c.modules || []);
  const totalModulesCount = allModules.length;
  const completedCount = currentUser.completedModules ? currentUser.completedModules.length : 0;
  const remainingCount = Math.max(0, totalModulesCount - completedCount);
  const calculatedProgress = totalModulesCount > 0 ? Math.round((completedCount / totalModulesCount) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: remainingCount },
  ];
  const PIE_COLORS = ['#059669', '#f1f5f9'];

  // Format Stats
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if(hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Recommended Courses Logic
  const recommendedCourses = courses.filter(course => {
      if (!course.modules) return false;
      
      // Only show Published or Under Review (for admins)
      if (course.status !== CourseStatus.PUBLISHED && !isAdmin) return false;
      
      // Safely check completion using optional chaining
      const isCompleted = course.modules.every(m => currentUser.completedModules?.includes(m.id));
      if (isCompleted) return false;
      
      if (isStudent) return [CourseTrack.BASICS, CourseTrack.PRODUCT, CourseTrack.RANK].includes(course.track);
      return [CourseTrack.BUSINESS, CourseTrack.SALES, CourseTrack.LEADERSHIP].includes(course.track);
  }).slice(0, 2);

  // Pending Courses Logic (For Admins)
  const pendingCourses = courses.filter(c => c.status === CourseStatus.UNDER_REVIEW);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading">
            Welcome, {currentUser.name?.split(' ')[0]}!
        </h1>
        <p className="text-emerald-700 mt-2 text-sm md:text-base">
            {isAdmin 
                ? "Platform-wide analytics and control center." 
                : isSponsor 
                ? `Tracking ${visibleStudents.length} members in your downline.` 
                : "Here is your progress overview for today."
            }
        </p>
      </header>

      {/* Stats Cards */}
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
          value={isStudent ? `${calculatedProgress}%` : `${averageProgress}%`} 
          icon={<ChartBarIcon />}
          trend="Based on assigned courses" 
        />
        <StatCard 
          title={isStudent ? "My CC" : "Total Team CC"} 
          value={isStudent ? currentUser.caseCredits?.toString() : visibleStudents.reduce((acc,s) => acc + (s.caseCredits || 0), 0).toFixed(1)} 
          icon={<CurrencyDollarIcon />} 
          trend="Case Credits"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Charts & Course List */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            
            {/* Progress Chart (Team or Personal) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 font-heading">
                        {isStudent ? 'Your Progress' : 'Team Leaderboard'}
                    </h2>
                </div>
                {/* Added min-w-0 to container to fix Recharts responsive issues */}
                <div className="h-64 md:h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
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

            {/* Pending Reviews (Admin Only) */}
            {isAdmin && pendingCourses.length > 0 && (
                <div className="bg-orange-50 p-6 md:p-8 rounded-2xl border border-orange-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-orange-900 font-heading">Pending Course Reviews</h2>
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">{pendingCourses.length}</span>
                    </div>
                    <div className="space-y-3">
                        {pendingCourses.map(course => (
                            <div key={course.id} className="bg-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-orange-100">
                                <div>
                                    <h3 className="font-bold text-slate-800">{course.title}</h3>
                                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                        <span>By: {course.authorHandle}</span>
                                        <span>•</span>
                                        <span>{course.modules.length} Modules</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Link 
                                        to={`/course-review/${course.id}`}
                                        className="flex-1 sm:flex-none text-center text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                                    >
                                        Review Content
                                    </Link>
                                    <button 
                                        onClick={() => onReviewCourse?.(course.id, CourseStatus.PUBLISHED)}
                                        className="text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700"
                                    >
                                        Quick Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Courses List */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg md:text-xl font-bold text-emerald-950 mb-6 font-heading">Recommended for You</h2>
                {recommendedCourses.length > 0 ? (
                    <div className="space-y-4">
                    {recommendedCourses.map(course => {
                        const totalCourseModules = course.modules?.length || 0;
                        const completedInCourse = course.modules?.filter(m => currentUser.completedModules?.includes(m.id)).length || 0;
                        const courseProgress = totalCourseModules > 0 ? Math.round((completedInCourse / totalCourseModules) * 100) : 0;

                        return (
                        <div key={course.id} className="border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center gap-5">
                            <div className="w-full sm:w-24 h-32 sm:h-20 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-bold tracking-wide uppercase">{course.track}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 truncate text-base md:text-lg mb-2">{course.title}</h3>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${courseProgress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700 w-8 text-right">{courseProgress}%</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{completedInCourse} of {totalCourseModules} modules completed</p>
                            </div>

                            <Link 
                                to={`/classroom/${course.id}/${course.modules?.[0]?.id}/${course.modules?.[0]?.chapters?.[0]?.id}`}
                                className="w-full sm:w-auto bg-slate-900 text-white text-sm font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors text-center whitespace-nowrap shadow-md shadow-slate-200"
                            >
                                {courseProgress === 0 ? 'Start Learning' : 'Continue'}
                            </Link>
                        </div>
                        );
                    })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">You're all caught up!</p>
                        <p className="text-sm text-slate-400 mt-1">Check back later for new content.</p>
                    </div>
                )}
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6 min-w-0">
            
            {/* Quick User Search Widget (Super Admin Only) */}
            {isSuperAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4 text-emerald-800">
                        <div className="bg-emerald-100 p-2 rounded-lg"><MagnifyingGlassIcon /></div>
                        <h3 className="font-bold text-lg font-heading">Quick User Lookup</h3>
                    </div>
                    <div className="flex gap-2">
                        <Link 
                            to="/students" 
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-xl transition-colors text-center text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-200"
                        >
                            <MagnifyingGlassIcon />
                            Search Database
                        </Link>
                    </div>
                </div>
            )}

            {/* Engagement Overview (Pie Chart) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-lg font-bold text-emerald-950 font-heading">Engagement</h2>
                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded-md border border-slate-100 uppercase tracking-wide">Overview</span>
                </div>
                
                {/* Fixed: Added min-w-0 to parent to prevent Recharts sizing issue */}
                <div className="h-64 w-full relative z-10 min-w-0">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconSize={8} 
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontFamily: 'Jost, sans-serif' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-10">
                     <div className="text-center">
                        <span className="block text-4xl font-bold text-emerald-800 font-heading tracking-tight">{calculatedProgress}%</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Done</span>
                     </div>
                  </div>
                </div>
                
                <div className="mt-2 pt-4 border-t border-slate-50 text-center relative z-10">
                    <p className="text-sm text-slate-500">
                        You've completed <span className="font-bold text-emerald-700">{completedCount}</span> out of <span className="font-bold text-slate-700">{totalModulesCount}</span> modules.
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 z-0"></div>
            </div>

            {/* AI Tutor Stats */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl shadow-lg shadow-emerald-900/20 p-8 text-white relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                       <div>
                            <h3 className="font-bold text-lg font-heading">AI Tutor Stats</h3>
                            <p className="text-emerald-200 text-xs mt-1 font-medium">Weekly Activity</p>
                       </div>
                       <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                           <SparklesIcon />
                       </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                        <span className="text-emerald-100 font-medium">Questions Asked</span>
                        <span className="font-bold text-xl">{currentUser.learningStats?.questionsAsked || 0}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                        <span className="text-emerald-100 font-medium">Total Time</span>
                        <span className="font-bold text-xl">{formatTime(currentUser.learningStats?.totalTimeSpent || 0)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm pt-1">
                        <span className="text-emerald-100 font-medium">Learning Streak</span>
                        <span className="font-bold text-yellow-400 flex items-center gap-1">{currentUser.learningStats?.learningStreak || 0} Days <span className="text-lg">🔥</span></span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Enrollment Widget */}
            {!isStudent && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg shadow-emerald-600/20 p-8 text-white relative overflow-hidden group h-auto">
                    <div className="relative z-10 flex flex-col justify-between gap-8">
                        <div>
                            <h2 className="text-xl font-bold mb-2 font-heading">Enroll New FBO</h2>
                            <p className="text-emerald-50 text-sm leading-relaxed opacity-90">Grow your business by inviting new members to the academy.</p>
                        </div>
                        
                        <div className="bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 p-5">
                            <div className="text-[10px] text-emerald-100 uppercase font-bold tracking-widest mb-2">Your Sponsor Handle</div>
                            <div className="flex gap-2 items-center bg-black/20 rounded-xl p-3 text-sm font-mono text-white truncate w-full mb-4 border border-white/10">
                                <span className="truncate w-full text-center tracking-wide">{currentUser.handle}</span>
                            </div>
                            <Link to="/join" className="block w-full bg-white text-emerald-700 text-center py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg transform hover:-translate-y-0.5 text-sm">
                                Open Enrollment Form
                            </Link>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-700 pointer-events-none rotate-12">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-56 h-56">
                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                            <path d="M10.933 19.231l-7.668-4.13-1.37.738a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134 0z" />
                        </svg>
                    </div>
                </div>
            )}
            
             {/* Student Next Steps */}
            {isStudent && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col justify-center items-center text-center h-auto relative overflow-hidden">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-5 relative z-10">
                        <AcademicCapIcon />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 font-heading relative z-10">Your Next Goal: 2CC</h3>
                    <p className="text-slate-500 mt-3 mb-6 text-sm leading-relaxed relative z-10">
                        Complete your training and accumulate 2 Case Credits to become a Sponsor and build your own team.
                    </p>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden relative z-10">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-1000" style={{width: `${(currentUser.caseCredits / 2) * 100}%`}}></div>
                    </div>
                    <div className="mt-3 text-sm font-bold text-emerald-700 relative z-10">{currentUser.caseCredits} / 2.0 CC</div>
                    
                    {/* Bg Decor */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;