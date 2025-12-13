
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus, MentorshipTemplate, Broadcast, AppNotification, Assignment } from '../types';
import { 
    Users, TrendingUp, Calendar, ArrowUpRight, Award, 
    BookOpen, DollarSign, CircleDollarSign, Target, MessageSquare, PlusCircle, 
    BarChart2, Zap, ArrowRight, Layout, ArrowLeft, Clock, Globe, UserPlus, Shield,
    ShoppingCart, GraduationCap, Bell, Flag, Store, Lock, CheckCircle
} from 'lucide-react';
import { RANKS } from '../constants';

// --- ICONS ---
const TrophyIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.563A2 2 0 00.75 5.905l.274 2.769a6 6 0 006.276 5.636h.25a6.001 6.001 0 006.276-5.636l.274-2.769a2 2 0 00-1.345-1.863c-1.012-.232-2.036-.415-3.071-.563v-.858c0-.817-.631-1.48-1.432-1.524A43.87 43.87 0 0012 1.5c-2.483 0-4.965.23-7.411.693-.8.043-1.431.707-1.431 1.524zm9.358 13.917a8.97 8.97 0 01-2.524.462h-1.954c-.958 0-1.87-.167-2.524-.462q-.503.327-.928.71a2.25 2.25 0 00-.73 1.93l.342 3.096A2.25 2.25 0 008.303 24h5.443a2.25 2.25 0 002.134-1.66l.342-3.096a2.25 2.25 0 00-.73-1.93q-.425-.382-.928.71z" clipRule="evenodd" />
    </svg>
);

// Custom Outline Icons (Thick Border)
const MoneyBagIcon = ({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9a6 6 0 0 1 12 0v2.3c0 2.6-1.5 4.9-3.9 6-1 .5-2.2.7-3.4.5a7.5 7.5 0 0 1-4.7-2.8c-1.1-1.5-1.7-3.4-1.7-5.3V9Z" />
        <path d="M6 9h12" />
        <path d="M10 14h4" />
        <path d="M12 12v4" />
        <path d="M10 5a2 2 0 1 1 4 0" />
    </svg>
);

const AutoStoriesIcon = ({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        <path d="M6 8h2" />
        <path d="M6 12h2" />
        <path d="M16 8h2" />
        <path d="M16 12h2" />
    </svg>
);

// --- SUB-COMPONENTS ---

// A. Left Column Card (Compact)
const InfoCard = ({ 
    title, 
    children, 
    icon: Icon, 
    colorClass, 
    className = "", 
    iconStyle = 'FILLED' 
}: { 
    title: string, 
    children?: React.ReactNode, 
    icon: any, 
    colorClass: string, 
    className?: string,
    iconStyle?: 'FILLED' | 'OUTLINE' 
}) => (
    <div className={`bg-white dark:bg-slate-800 rounded-[1.25rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 ${className}`}>
        <div className="flex items-center gap-3 mb-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                {iconStyle === 'FILLED' ? (
                    <Icon size={18} strokeWidth={2.5} fill="currentColor" className="opacity-90" />
                ) : (
                    <Icon size={20} strokeWidth={2.5} className="opacity-90" />
                )}
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
        <div className="h-1 w-8 bg-slate-800 dark:bg-slate-200 mt-1 rounded-full"></div>
    </div>
);

// C. Shortcut Item (Bold, Filled, Modern Gray)
const ShortcutItem = ({ 
    title, 
    desc,
    icon: Icon, 
    onClick, 
    to, 
    disabled = false 
}: { 
    title: string, 
    desc: string,
    icon: any, 
    onClick?: () => void, 
    to?: string,
    disabled?: boolean
}) => {
    const content = (
        <div className={`
            flex flex-col items-center justify-center gap-3 p-6 rounded-3xl transition-all duration-300 h-full border border-transparent
            ${disabled 
                ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50 dark:bg-slate-800/50' 
                : 'bg-slate-50 hover:bg-white hover:shadow-2xl hover:border-slate-100 cursor-pointer group dark:bg-slate-800 dark:hover:bg-slate-700'}
        `}>
            <div className={`
                p-5 rounded-2xl transition-all duration-300 relative
                ${disabled ? 'text-slate-300' : 'text-slate-600 group-hover:text-slate-800 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white'}
            `}>
                <Icon 
                    size={56} 
                    strokeWidth={2}
                    className={disabled ? '' : 'fill-slate-200 dark:fill-slate-700'}
                />
                {disabled && <div className="absolute -top-1 -right-1 bg-slate-200 rounded-full p-1"><Lock size={12} className="text-slate-500" /></div>}
            </div>
            <div className="text-center space-y-1">
                <h4 className="font-extrabold text-base text-slate-700 dark:text-slate-200 leading-tight">
                    {title}
                </h4>
                <p className="text-xs text-slate-400 font-medium leading-tight px-2">
                    {desc}
                </p>
            </div>
        </div>
    );

    if (disabled) return <div className="h-full">{content}</div>;
    if (to) return <Link to={to} className="block h-full">{content}</Link>;
    return <div onClick={onClick} className="h-full">{content}</div>;
};

// D. Mobile Stat Card
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
  assignments?: Assignment[];
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
    courses,
    assignments = []
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'GOALS'>('DASHBOARD');
  
  // Auto-scroll ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- AUTO SCROLL EFFECT ---
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval: any;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!scrollContainer) return;
        
        // Use first child to determine card width + gap (approx)
        const firstCard = scrollContainer.firstElementChild as HTMLElement;
        if (!firstCard) return;
        
        const itemWidth = firstCard.offsetWidth;
        const gap = 16; // 1rem = 16px (gap-4)
        const scrollStep = itemWidth + gap;
        
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Loop back to start if at end
        if (scrollContainer.scrollLeft >= maxScroll - 10) {
           scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scrollContainer.scrollTo({ left: scrollContainer.scrollLeft + scrollStep, behavior: 'smooth' });
        }
      }, 5000); // Scroll every 5 seconds
    };

    startAutoScroll();

    // Pause functionality on interaction
    const stopAutoScroll = () => clearInterval(scrollInterval);
    
    // Resume functionality
    const resumeAutoScroll = () => {
        stopAutoScroll(); // Clear existing to prevent double timers
        startAutoScroll();
    };

    // Attach listeners
    scrollContainer.addEventListener('touchstart', stopAutoScroll);
    scrollContainer.addEventListener('touchend', resumeAutoScroll);
    scrollContainer.addEventListener('mouseenter', stopAutoScroll); // Desktop mouse
    scrollContainer.addEventListener('mouseleave', resumeAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      scrollContainer.removeEventListener('touchstart', stopAutoScroll);
      scrollContainer.removeEventListener('touchend', resumeAutoScroll);
      scrollContainer.removeEventListener('mouseenter', stopAutoScroll);
      scrollContainer.removeEventListener('mouseleave', resumeAutoScroll);
    };
  }, []);

  // --- DERIVED DATA ---
  
  // 1. Rank & Progress (Updated for Time Left)
  const rankProgress = currentUser.rankProgress || {
      currentRankId: 'NOVUS',
      currentCycleCC: 0,
      targetCC: 2,
      cycleStartDate: new Date().toISOString(),
      history: []
  };
  const currentRankDef = RANKS[rankProgress.currentRankId];
  const nextRankDef = currentRankDef?.nextRankId ? RANKS[currentRankDef.nextRankId] : null;
  
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

  // Calculate Days Left in Month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = Math.ceil((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 2. Team Stats (Updated for Team CC & Top Performer)
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const activeDownlines = myDownline.filter(s => s.caseCredits > 0);
  const teamCC = myDownline.reduce((acc, s) => acc + s.caseCredits, 0);
  const topPerformer = myDownline.sort((a, b) => b.caseCredits - a.caseCredits)[0];

  // 3. Earnings & Rewards (Updated for Est Earnings)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyCC = (currentUser.salesHistory || [])
    .filter(s => s.date.startsWith(currentMonth))
    .reduce((acc, s) => acc + s.ccEarned, 0);
  
  // Mock earnings calculation: Sum of sales amounts this month, or estimation based on CC
  const monthlyEarnings = (currentUser.salesHistory || [])
    .filter(s => s.date.startsWith(currentMonth))
    .reduce((acc, s) => acc + s.amount * 0.30, 0); // Assuming ~30% profit margin on sales amount

  // 4. Learning Stats (Updated for Breakdown)
  const startedCourses = currentUser.enrolledCourses.length;
  const completedCoursesCount = courses.filter(c => {
      const totalModules = c.modules.length;
      if (totalModules === 0) return false;
      const completedMods = c.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
      return completedMods === totalModules;
  }).length;
  const inProgressCourses = startedCourses - completedCoursesCount;
  
  // Calculate Pending Assignments
  const myPendingAssignments = assignments.filter(a => {
      const isAssigned = a.assignedTo.includes(currentUser.handle);
      const isSubmitted = currentUser.assignmentSubmissions?.some(s => s.assignmentId === a.id);
      return isAssigned && !isSubmitted;
  }).length;

  // --- VIEW: GOAL MONITORING (Desktop Sub-page) ---
  if (viewMode === 'GOALS') {
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

            {/* 2. Stats Carousel (Horizontal Slider of Desktop Cards) */}
            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                
                {/* Card 1: Rank Progress */}
                <div className="min-w-[85vw] snap-center">
                    <InfoCard title="Rank Progress" icon={Award} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" className="h-48 justify-between">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">{currentRankDef.name}</span>
                                <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded dark:bg-yellow-900/50 dark:text-yellow-200">{rankProgress.currentRankId}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden dark:bg-slate-700 mb-3">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-700 mt-auto">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{remainingCC.toFixed(2)} CC</span>
                                <span>Remaining</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{daysLeft} Days</span>
                                <span>Time Left</span>
                            </div>
                        </div>
                    </InfoCard>
                </div>

                {/* Card 2: Team Snapshot */}
                <div className="min-w-[85vw] snap-center">
                    <InfoCard title="Team Snapshot" icon={Users} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" className="h-48 justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{activeDownlines.length}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Downlines</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{teamCC.toFixed(1)}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Team CC</span>
                            </div>
                        </div>
                        {topPerformer ? (
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-3 border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold dark:bg-blue-900/50 dark:text-blue-200">
                                    {topPerformer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate dark:text-white">{topPerformer.name}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold dark:text-emerald-400">Top Performer ({topPerformer.caseCredits.toFixed(1)} CC)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-slate-400 italic text-center py-1">No activity yet</div>
                        )}
                    </InfoCard>
                </div>

                {/* Card 3: Earnings & Rewards */}
                <div className="min-w-[85vw] snap-center">
                    <InfoCard title="Earnings & Rewards" icon={MoneyBagIcon} iconStyle="OUTLINE" colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" className="h-48 justify-between">
                        <div className="mb-3">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">${monthlyEarnings.toLocaleString()}</span>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Est. Earnings</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Active Bonus</span>
                                <span className={`font-bold ${monthlyCC >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {monthlyCC >= 4 ? 'Achieved' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Global Rally</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-200 h-1.5 rounded-full dark:bg-slate-700">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">15%</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>

                {/* Card 4: Learning Status */}
                <div className="min-w-[85vw] snap-center">
                    <InfoCard title="Learning Status" icon={AutoStoriesIcon} iconStyle="OUTLINE" colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" className="h-48 justify-between">
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-purple-50 rounded-lg p-2 dark:bg-purple-900/10">
                                <span className="block text-lg font-bold text-purple-700 dark:text-purple-300">{inProgressCourses}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Active</span>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2 dark:bg-green-900/10">
                                <span className="block text-lg font-bold text-green-700 dark:text-green-300">{completedCoursesCount}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Done</span>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-2 dark:bg-orange-900/10">
                                <span className="block text-lg font-bold text-orange-700 dark:text-orange-300">{myPendingAssignments}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Tasks</span>
                            </div>
                        </div>
                        <Link to="/classroom" className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1 dark:text-purple-400 bg-purple-50 py-1.5 rounded-lg dark:bg-purple-900/20 transition-colors">
                            Go to Classroom <ArrowRight size={10} />
                        </Link>
                    </InfoCard>
                </div>

            </div>

            {/* 3. Shortcuts (Updated for Mobile) */}
            <div>
                <SectionHeader title="Shortcuts" />
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                        <ShortcutItem 
                            title="My Business" 
                            desc="Track CC"
                            icon={TrendingUp} 
                            to="/sales" 
                        />
                        <ShortcutItem 
                            title="Sales Pages" 
                            desc="Get Leads"
                            icon={ShoppingCart} 
                            to="/sales-builder" 
                        />
                        <ShortcutItem 
                            title="Training" 
                            desc="Learn Skills"
                            icon={GraduationCap} 
                            to="/classroom" 
                        />
                        <ShortcutItem 
                            title="My Team" 
                            desc="Manage"
                            icon={Users} 
                            to="/students"
                            disabled={!myDownline.length && currentUser.role === UserRole.STUDENT} // Visual disable example
                        />
                        <ShortcutItem 
                            title="Goals" 
                            desc="Targets"
                            icon={Target} 
                            onClick={() => setViewMode('GOALS')} 
                        />
                        <ShortcutItem 
                            title="Inbox" 
                            desc="Alerts"
                            icon={Bell} 
                            to="/broadcasts" 
                        />
                    </div>
                </div>
            </div>

        </div>

        {/* ======================= */}
        {/*    DESKTOP VIEW (New)    */}
        {/* ======================= */}
        <div className="hidden md:block max-w-[1600px] mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* LEFT COLUMN: Summary Stack */}
                <div className="lg:col-span-1 space-y-4">
                    
                    {/* 1. Rank Card (Height approx 200px) */}
                    <InfoCard title="Rank Progress" icon={Award} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" className="h-48 justify-between">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">{currentRankDef.name}</span>
                                <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded dark:bg-yellow-900/50 dark:text-yellow-200">{rankProgress.currentRankId}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden dark:bg-slate-700 mb-3">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-700 mt-auto">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{remainingCC.toFixed(2)} CC</span>
                                <span>Remaining</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{daysLeft} Days</span>
                                <span>Time Left</span>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 2. Team Performance Snapshot */}
                    <InfoCard title="Team Snapshot" icon={Users} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">{activeDownlines.length}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Downlines</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{teamCC.toFixed(1)}</span>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Team CC</span>
                            </div>
                        </div>
                        {topPerformer ? (
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-3 border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold dark:bg-blue-900/50 dark:text-blue-200">
                                    {topPerformer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate dark:text-white">{topPerformer.name}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold dark:text-emerald-400">Top Performer ({topPerformer.caseCredits.toFixed(1)} CC)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-slate-400 italic text-center py-1">No activity yet</div>
                        )}
                    </InfoCard>

                    {/* 3. Earnings & Rewards (Updated Icon Style) */}
                    <InfoCard title="Earnings & Rewards" icon={MoneyBagIcon} iconStyle="OUTLINE" colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <div className="mb-3">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white font-heading">${monthlyEarnings.toLocaleString()}</span>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Est. Earnings</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Active Bonus</span>
                                <span className={`font-bold ${monthlyCC >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {monthlyCC >= 4 ? 'Achieved' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Global Rally</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-200 h-1.5 rounded-full dark:bg-slate-700">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">15%</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 4. Learning & Activity (Updated Icon Style) */}
                    <InfoCard title="Learning Status" icon={AutoStoriesIcon} iconStyle="OUTLINE" colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                            <div className="bg-purple-50 rounded-lg p-2 dark:bg-purple-900/10">
                                <span className="block text-lg font-bold text-purple-700 dark:text-purple-300">{inProgressCourses}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Active</span>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2 dark:bg-green-900/10">
                                <span className="block text-lg font-bold text-green-700 dark:text-green-300">{completedCoursesCount}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Done</span>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-2 dark:bg-orange-900/10">
                                <span className="block text-lg font-bold text-orange-700 dark:text-orange-300">{myPendingAssignments}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Tasks</span>
                            </div>
                        </div>
                        <Link to="/classroom" className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1 dark:text-purple-400 bg-purple-50 py-1.5 rounded-lg dark:bg-purple-900/20 transition-colors">
                            Go to Classroom <ArrowRight size={10} />
                        </Link>
                    </InfoCard>

                </div>

                {/* RIGHT COLUMN: Main Area */}
                <div className="lg:col-span-3 space-y-4">
                    
                    {/* A. Welcome Banner (Redesigned) */}
                    <div className="h-48 relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[1.25rem] px-8 flex items-center justify-between overflow-hidden shadow-sm">
                        <style>{`
                            @keyframes wave {
                                0% { transform: rotate(0deg); }
                                10% { transform: rotate(14deg); }
                                20% { transform: rotate(-8deg); }
                                30% { transform: rotate(14deg); }
                                40% { transform: rotate(-4deg); }
                                50% { transform: rotate(10deg); }
                                60% { transform: rotate(0deg); }
                                100% { transform: rotate(0deg); }
                            }
                            .animate-wave {
                                animation: wave 2.5s infinite;
                                transform-origin: 70% 70%;
                                display: inline-block;
                            }
                        `}</style>
                        
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Date Top Right */}
                        <div className="absolute top-6 right-6 text-slate-400 text-sm font-medium tracking-wide">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>

                        {/* Left Group */}
                        <div className="flex items-center gap-6 z-10">
                            
                            {/* Glass Container with Waving Hand */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                                {/* Using the Waving Hand Icon - Google Font */}
                                <span className="material-symbols-outlined text-white select-none animate-wave" style={{ fontSize: '40px', fontWeight: 'bold' }}>
                                    hand_gesture
                                </span>
                            </div>

                            {/* Welcome Text */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white font-heading tracking-tight drop-shadow-md">
                                    Welcome, {currentUser.name.split(' ')[0]}
                                </h1>
                            </div>
                        </div>

                        {/* Right Green Icon (Trophy) - Kept on far right as requested */}
                        <div className="relative z-10 hidden md:flex items-center justify-center mr-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl rotate-3 flex items-center justify-center shadow-2xl shadow-emerald-900/50 border-4 border-white/10">
                                <TrophyIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* B. Shortcuts Grid (Increased Height - approx 2.5x side cards) */}
                    <div>
                        <SectionHeader title="Shortcuts" />
                        
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[500px] flex flex-col justify-center">
                            <div className="grid grid-cols-3 gap-6 h-full">
                                
                                <ShortcutItem 
                                    title="My Business" 
                                    desc="Track volume & growth"
                                    icon={TrendingUp}
                                    to="/sales"
                                />

                                <ShortcutItem 
                                    title="Sales Pages" 
                                    desc="Create funnels & leads"
                                    icon={ShoppingCart}
                                    to="/sales-builder"
                                />

                                <ShortcutItem 
                                    title="Training Hub" 
                                    desc="Learn skills & products"
                                    icon={GraduationCap}
                                    to="/classroom"
                                />

                                <ShortcutItem 
                                    title="My Team" 
                                    desc="Monitor downline progress"
                                    icon={Users}
                                    to="/students"
                                    disabled={!myDownline.length && currentUser.role === UserRole.STUDENT} 
                                />

                                <ShortcutItem 
                                    title="Goals & Incentives" 
                                    desc="Hit next rank target"
                                    icon={Target}
                                    onClick={() => setViewMode('GOALS')}
                                />

                                <ShortcutItem 
                                    title="Inbox" 
                                    desc="Alerts & announcements"
                                    icon={Bell}
                                    to="/broadcasts"
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
