
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus, MentorshipTemplate, Broadcast, AppNotification } from '../types';
import { 
    Users, TrendingUp, Calendar, ArrowUpRight, Award, 
    BookOpen, DollarSign, Target, MessageSquare, PlusCircle, 
    BarChart2, Zap, ArrowRight, Layout, ArrowLeft, Clock, Globe, UserPlus, Shield
} from 'lucide-react';
import { RANKS } from '../constants';

// --- ICONS ---
const TrophyIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.563A2 2 0 00.75 5.905l.274 2.769a6 6 0 006.276 5.636h.25a6.001 6.001 0 006.276-5.636l.274-2.769a2 2 0 00-1.345-1.863c-1.012-.232-2.036-.415-3.071-.563v-.858c0-.817-.631-1.48-1.432-1.524A43.87 43.87 0 0012 1.5c-2.483 0-4.965.23-7.411.693-.8.043-1.431.707-1.431 1.524zm9.358 13.917a8.97 8.97 0 01-2.524.462h-1.954c-.958 0-1.87-.167-2.524-.462q-.503.327-.928.71a2.25 2.25 0 00-.73 1.93l.342 3.096A2.25 2.25 0 008.303 24h5.443a2.25 2.25 0 002.134-1.66l.342-3.096a2.25 2.25 0 00-.73-1.93q-.425-.382-.928.71z" clipRule="evenodd" />
    </svg>
);

// --- SUB-COMPONENTS ---

// A. Left Column Card (Compact)
const InfoCard = ({ title, children, icon: Icon, colorClass }: { title: string, children?: React.ReactNode, icon: any, colorClass: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={16} />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide">{title}</h3>
        </div>
        <div className="pl-1">
            {children}
        </div>
    </div>
);

// B. Section Title with Custom Underline
const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white inline-block">{title}</h3>
        <div className="h-1 w-12 bg-slate-800 dark:bg-slate-200 mt-1 rounded-full"></div>
    </div>
);

// C. Shortcut Item (Inside Large Card)
const ShortcutItem = ({ title, desc, icon: Icon, color, onClick, to }: { title: string, desc: string, icon: any, color: string, onClick?: () => void, to?: string }) => {
    const content = (
        <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group dark:hover:bg-slate-700/50">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-1">{desc}</p>
            </div>
        </div>
    );

    if (to) return <Link to={to} className="block">{content}</Link>;
    return <div onClick={onClick}>{content}</div>;
};

// D. Mobile Action Button (Classic)
const MobileActionBtn = ({ icon: Icon, label, colorClass, to, onClick }: { icon: any, label: string, colorClass: string, to?: string, onClick?: () => void }) => {
    const content = (
        <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{label}</span>
        </div>
    );
    if (to) return <Link to={to} className="block">{content}</Link>;
    return <button onClick={onClick} className="block w-full">{content}</button>;
};

// E. Mobile Stat Card
const MobileStatCard = ({ label, value, subtext, icon: Icon, color }: { label: string, value: string, subtext: string, icon: any, color: string }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-heading">{value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{subtext}</p>
        </div>
    </div>
);

interface DashboardProps {
  students: Student[];
  currentUser: Student;
  courses: Course[];
  templates?: MentorshipTemplate[];
  broadcasts?: Broadcast[];
  notifications?: AppNotification[];
  onReviewCourse?: (courseId: string, status: CourseStatus) => void;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    students, 
    currentUser, 
    courses
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'GOALS'>('DASHBOARD');

  // --- DERIVED DATA ---
  
  // 1. Rank & Progress
  const rankProgress = currentUser.rankProgress || {
      currentRankId: 'NOVUS',
      currentCycleCC: 0,
      targetCC: 2,
      cycleStartDate: new Date().toISOString(),
      history: []
  };
  const currentRankDef = RANKS[rankProgress.currentRankId];
  const nextRankDef = currentRankDef?.nextRankId ? RANKS[currentRankDef.nextRankId] : null;
  
  // Progress Percent
  let progressPercent = 0;
  let remainingCC = 0;
  if (nextRankDef) {
      if (currentRankDef.targetCC > 0) {
          progressPercent = Math.min(100, (rankProgress.currentCycleCC / rankProgress.targetCC) * 100);
          remainingCC = Math.max(0, rankProgress.targetCC - rankProgress.currentCycleCC);
      } else if (currentRankDef.requiredManagersInDownline) {
          progressPercent = 50; 
      }
  } else {
      progressPercent = 100;
  }

  // 2. Team Stats
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const activeMembers = myDownline.filter(s => s.caseCredits > 0).length;

  // 3. Sales Stats
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyCC = (currentUser.salesHistory || [])
    .filter(s => s.date.startsWith(currentMonth))
    .reduce((acc, s) => acc + s.ccEarned, 0);

  // 4. Learning Stats
  const startedCourses = currentUser.enrolledCourses.length;
  const completedCoursesCount = courses.filter(c => {
      const totalModules = c.modules.length;
      if (totalModules === 0) return false;
      const completedMods = c.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
      return completedMods === totalModules;
  }).length;
  const learningProgress = startedCourses > 0 ? Math.round((completedCoursesCount / startedCourses) * 100) : 0;

  // --- VIEW: GOAL MONITORING (Desktop Sub-page) ---
  if (viewMode === 'GOALS') {
      // ... (Goal Monitoring Code remains same, ensuring scroll wrapper)
      const performanceData = [
        { name: 'Jan', cc: 2.4 }, { name: 'Feb', cc: 3.1 }, { name: 'Mar', cc: 4.5 },
        { name: 'Apr', cc: 3.8 }, { name: 'May', cc: 5.2 }, { name: 'Jun', cc: 6.0 },
      ];

      return (
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto p-6 md:p-8 animate-fade-in space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setViewMode('DASHBOARD')} className="p-2 bg-white rounded-full hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Goal Monitoring</h1>
                        <p className="text-slate-500 dark:text-slate-400">Track your progress and activity trends.</p>
                    </div>
                </div>

                {/* 3-Month Activity Tracker */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="text-emerald-500" size={20}/> 3-Month Activity Cycle
                    </h3>
                    <div className="relative pt-8 pb-4 px-4">
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-100 dark:bg-slate-700 rounded-full -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 h-2 bg-emerald-500 rounded-full -translate-y-1/2 transition-all duration-1000" style={{ width: '60%' }}></div>
                        <div className="relative flex justify-between">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800 z-10">1</div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Month 1</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800 z-10 shadow-lg scale-110">2</div>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Current</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800 z-10 dark:bg-slate-700">3</div>
                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500">Next</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Trends Graph */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-blue-500" size={20}/> Growth Trends
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: '#fff' }}
                                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="cc" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCc)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </div>
      );
  }

  // --- RENDER ---
  return (
    <div className="h-full overflow-y-auto no-scrollbar animate-fade-in">
        
        {/* ======================= */}
        {/*    MOBILE VIEW (Classic) */}
        {/* ======================= */}
        <div className="md:hidden p-4 space-y-6 pb-32">
            
            {/* 1. Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    Hello, {currentUser.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Here's your business at a glance.</p>
            </div>

            {/* 2. Stats Grid (Original Style) */}
            <div className="space-y-4">
                <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Total Case Credits</p>
                        <h2 className="text-4xl font-bold font-heading mb-4">{monthlyCC.toFixed(3)} CC</h2>
                        
                        <div className="flex justify-between text-xs text-emerald-100 mb-1">
                            <span>4CC Active Goal</span>
                            <span>{Math.round((monthlyCC / 4) * 100)}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-1.5">
                            <div className="bg-white h-1.5 rounded-full" style={{ width: `${Math.min(100, (monthlyCC / 4) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MobileStatCard 
                        label="Current Rank" 
                        value={currentRankDef.name} 
                        subtext={nextRankDef ? `Next: ${nextRankDef.name}` : 'Max Rank'}
                        icon={Award}
                        color="bg-yellow-500"
                    />
                    <MobileStatCard 
                        label="Active Team" 
                        value={activeMembers.toString()} 
                        subtext={`${myDownline.length} Total Members`}
                        icon={Users}
                        color="bg-blue-500"
                    />
                </div>
            </div>

            {/* 3. Quick Actions (Restored "Admission" etc) */}
            <div>
                <SectionHeader title="Shortcuts" />
                <div className="grid grid-cols-3 gap-3">
                    <MobileActionBtn 
                        icon={UserPlus} 
                        label="Enroll Student" 
                        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        to="/students" 
                    />
                    <MobileActionBtn 
                        icon={TrendingUp} 
                        label="Log Sale" 
                        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                        to="/sales"
                    />
                    <MobileActionBtn 
                        icon={MessageSquare} 
                        label="Team Chat" 
                        colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                        to="/chat"
                    />
                    <MobileActionBtn 
                        icon={BookOpen} 
                        label="Classroom" 
                        colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
                        to="/classroom"
                    />
                    <MobileActionBtn 
                        icon={Globe} 
                        label="Community" 
                        colorClass="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" 
                        to="/community"
                    />
                    <MobileActionBtn 
                        icon={Zap} 
                        label="Sales Page" 
                        colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
                        to="/sales-builder"
                    />
                </div>
            </div>

        </div>

        {/* ======================= */}
        {/*    DESKTOP VIEW (New)    */}
        {/* ======================= */}
        <div className="hidden md:block max-w-[1600px] mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* LEFT COLUMN: Summary Stack (Reduced Height/Padding) */}
                <div className="lg:col-span-1 space-y-4">
                    
                    {/* 1. Rank Card */}
                    <InfoCard title="Current Rank" icon={Award} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">{currentRankDef.name}</span>
                            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded dark:bg-yellow-900/50 dark:text-yellow-200">{rankProgress.currentRankId}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden dark:bg-slate-700 mb-2">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {nextRankDef 
                                ? `${remainingCC.toFixed(2)} CC to ${nextRankDef.name}`
                                : 'Maximum Rank Achieved'}
                        </p>
                    </InfoCard>

                    {/* 2. Team Card */}
                    <InfoCard title="My Team" icon={Users} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{myDownline.length}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Members</span>
                            </div>
                            <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{activeMembers}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Active</span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, myDownline.length))].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border border-white dark:border-slate-800 dark:bg-slate-700" />
                            ))}
                            {myDownline.length > 5 && (
                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:border-slate-700">
                                    +{myDownline.length - 5}
                                </div>
                            )}
                        </div>
                    </InfoCard>

                    {/* 3. Sales Card */}
                    <InfoCard title="Sales Summary" icon={DollarSign} colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <div className="mb-3">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{monthlyCC.toFixed(2)}</span>
                            <span className="text-xs font-bold text-emerald-600 ml-1 dark:text-emerald-400">CC</span>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Earned This Month</p>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-lg dark:bg-emerald-900/20">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-emerald-800 dark:text-emerald-200 font-medium">Monthly Goal</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">4.0 CC</span>
                            </div>
                            <div className="w-full bg-emerald-200/50 h-1 rounded-full overflow-hidden dark:bg-emerald-900/50">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (monthlyCC / 4) * 100)}%` }}></div>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 4. Learning Card */}
                    <InfoCard title="Learning" icon={BookOpen} colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">{learningProgress}%</span>
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded dark:bg-purple-900/20 dark:text-purple-300">Progress</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-2 dark:text-slate-400">
                            {completedCoursesCount} of {startedCourses} courses completed
                        </p>
                        <Link to="/classroom" className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 dark:text-purple-400">
                            Continue <ArrowRight size={10} />
                        </Link>
                    </InfoCard>

                </div>

                {/* RIGHT COLUMN: Main Area */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* A. Welcome Banner */}
                    <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-sm text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">
                                    Welcome back, {currentUser.name.split(' ')[0]}!
                                </h1>
                                <p className="text-slate-300 max-w-lg text-sm font-light leading-relaxed">
                                    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful."
                                </p>
                            </div>
                            
                            <div className="hidden md:block">
                                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl rotate-3 flex items-center justify-center shadow-2xl shadow-emerald-900/50 border-4 border-white/10">
                                    <TrophyIcon className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. Shortcuts Grid (Single Card Container) */}
                    <div>
                        <SectionHeader title="Shortcuts" />
                        
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
                                
                                <ShortcutItem 
                                    title="Goal Monitoring" 
                                    desc="Track Progress"
                                    icon={Target}
                                    color="bg-red-500"
                                    onClick={() => setViewMode('GOALS')}
                                />

                                <ShortcutItem 
                                    title="Log Business" 
                                    desc="Sales & CC"
                                    icon={TrendingUp}
                                    color="bg-emerald-500"
                                    to="/sales"
                                />

                                <ShortcutItem 
                                    title="Community" 
                                    desc="Updates & Wins"
                                    icon={Globe}
                                    color="bg-blue-500"
                                    to="/community"
                                />

                                <ShortcutItem 
                                    title="Messages" 
                                    desc="Team Chat"
                                    icon={MessageSquare}
                                    color="bg-indigo-500"
                                    to="/chat"
                                />

                                <ShortcutItem 
                                    title="My Students" 
                                    desc="Manage Team"
                                    icon={Users}
                                    color="bg-teal-500"
                                    to="/students"
                                />

                                {currentUser.role !== UserRole.STUDENT && (
                                    <ShortcutItem 
                                        title="Create Course" 
                                        desc="Build Training"
                                        icon={PlusCircle}
                                        color="bg-purple-500"
                                        to="/builder"
                                    />
                                )}

                                <ShortcutItem 
                                    title="Analytics" 
                                    desc="Reports"
                                    icon={BarChart2}
                                    color="bg-orange-500"
                                    to="/dashboard"
                                />

                                <ShortcutItem 
                                    title="Sales Pages" 
                                    desc="Funnel Builder"
                                    icon={Zap}
                                    color="bg-pink-500"
                                    to="/sales-builder"
                                />

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
