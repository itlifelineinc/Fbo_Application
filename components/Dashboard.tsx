
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus, MentorshipTemplate, Broadcast } from '../types';
import { Edit, ExternalLink, Plus, Minus, ChevronLeft, ChevronRight, User, Users, TrendingUp, Calendar, MessageCircle, ShoppingBag, Globe, Bell, ArrowUpRight, CheckCircle, Lightbulb, Inbox, ClipboardCheck, Megaphone, LayoutGrid } from 'lucide-react';
import { RANKS, RANK_ORDER } from '../constants';

// --- Icons (Defined Before Usage) ---

const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.961 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.962 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.564 1.509 1.192.613 1.753.613 3.655 0 5.408-.22.727-1.033 1.109-1.724 1.109H8.438c-.69 0-1.504-.382-1.724-1.109-.613-1.753-.613-3.655 0-5.408.22-.628.863-1.143 1.509-1.192M6.75 21a2.25 2.25 0 01-2.25-2.25V6.75c0-1.012.668-1.875 1.586-2.155.127.427.34.821.619 1.165A3.725 3.725 0 006.75 9.75h10.5a3.725 3.725 0 002.795-4.24.75.75 0 011.5 0 5.25 5.25 0 01-3.545 4.99H6.75A.75.75 0 006 11.25v7.5a.75.75 0 00.75.75h9.75a.75.75 0 00.75-.75v-2.25m0 0h2.25m-2.25 0H18" />
  </svg>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string; color?: string }> = ({ title, value, icon, trend, color = "emerald" }) => {
  const colorClasses: Record<string, string> = {
      emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700 h-full relative min-w-[260px]">
        <div className={`p-4 rounded-2xl shrink-0 ${colorClasses[color] || colorClasses.emerald}`}>
        {icon}
        </div>
        <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 font-heading mt-1 dark:text-slate-100">{value}</h3>
        <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1 dark:text-slate-400">
            {trend}
        </p>
        </div>
    </div>
  );
};

interface DashboardProps {
  students: Student[];
  currentUser: Student;
  courses: Course[];
  templates?: MentorshipTemplate[];
  broadcasts?: Broadcast[]; // Added
  onReviewCourse?: (courseId: string, status: CourseStatus) => void;
}

// Helper to check if rank A is higher or equal to rank B
const isRankOrHigher = (currentId: string, targetId: string): boolean => {
    const currentIndex = RANK_ORDER.indexOf(currentId);
    const targetIndex = RANK_ORDER.indexOf(targetId);
    return currentIndex >= targetIndex && currentIndex !== -1 && targetIndex !== -1;
};

// --- Main Component ---

const Dashboard: React.FC<DashboardProps> = ({ students, currentUser, courses, onReviewCourse, templates = [], broadcasts = [] }) => {
  if (!currentUser) return null;

  const navigate = useNavigate();
  // State for graph filtering
  const [graphRange, setGraphRange] = useState<'6M' | 'YEAR' | '30D'>('6M');
  // State for Zoom Indices (Controlled Brush)
  const [zoomIndices, setZoomIndices] = useState<{start: number, end: number} | null>(null);

  const isStudent = currentUser.role === UserRole.STUDENT;
  const isSponsor = currentUser.role === UserRole.SPONSOR;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const isAdmin = currentUser.role === UserRole.ADMIN || isSuperAdmin;

  // Determine if user has a sponsor (everyone except root admin usually)
  const hasSponsor = !!currentUser.sponsorId;

  // Calculate unread templates count
  const unreadTemplatesCount = templates.filter(t => 
    (t.authorHandle === currentUser.sponsorId || t.authorHandle === '@forever_system') &&
    !(currentUser.viewedTemplates || []).includes(t.id)
  ).length;

  // Count pending assignments
  const pendingAssignments = (currentUser.assignmentSubmissions || [])
    .filter(sub => sub.status !== 'SUBMITTED' && sub.status !== 'APPROVED').length; 

  // Count unread broadcasts (My broadcasts = in recipients OR ALL)
  const myBroadcasts = broadcasts.filter(b => b.recipients.includes(currentUser.handle) || b.audienceType === 'ALL');
  const unreadBroadcastsCount = myBroadcasts.filter(b => !(currentUser.readBroadcasts || []).includes(b.id)).length;

  let visibleStudents = students || []; 
  if (isStudent) {
    visibleStudents = [currentUser];
  } else if (isSponsor) {
    visibleStudents = students.filter(s => s.sponsorId === currentUser.handle);
  }

  // --- Calculations for Widgets ---

  // Rank Info
  const rankProgress = currentUser.rankProgress || {
      currentRankId: 'NOVUS',
      currentCycleCC: 0,
      targetCC: 2,
      cycleStartDate: new Date().toISOString(),
      history: []
  };
  const currentRankDef = RANKS[rankProgress.currentRankId];
  const currentRankName = currentRankDef?.name || 'Distributor';
  const nextRankDef = currentRankDef?.nextRankId ? RANKS[currentRankDef.nextRankId] : null;
  
  // Logic to switch between Log Sale and Mentorship Tools
  const isDistributor = rankProgress.currentRankId === 'NOVUS';

  // Calculate "Needed"
  let progressText = '0';
  let progressTrend = 'You made it!';
  let progressPercent = 100;

  if (nextRankDef) {
      if (currentRankDef.targetCC > 0) {
          // CC Based Progression
          progressText = Math.max(0, rankProgress.targetCC - rankProgress.currentCycleCC).toFixed(2);
          progressTrend = `Target: ${rankProgress.targetCC}`;
          progressPercent = Math.min(100, Math.max(0, (rankProgress.currentCycleCC / rankProgress.targetCC) * 100));
      } else if (currentRankDef.requiredManagersInDownline && currentRankDef.requiredManagersInDownline > 0) {
          // Structure Based Progression (Managers)
          const myManagers = students.filter(s => s.sponsorId === currentUser.handle && s.rankProgress && isRankOrHigher(s.rankProgress.currentRankId, 'MGR')).length;
          const needed = Math.max(0, currentRankDef.requiredManagersInDownline - myManagers);
          progressText = `${needed}`;
          progressTrend = `Target: ${currentRankDef.requiredManagersInDownline} Mgrs`;
          progressPercent = Math.min(100, Math.max(0, (myManagers / currentRankDef.requiredManagersInDownline) * 100));
      }
  }

  // Team Activity
  const activeDownlines = visibleStudents.filter(s => (s.caseCredits > 0 || s.progress > 0) && s.id !== currentUser.id).length;
  // Calculate Team Volume (CC produced by downline in current cycle)
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const teamVolume = myDownline.reduce((acc, s) => acc + (s.rankProgress?.currentCycleCC || 0), 0);

  // Courses Data
  const safeCourses = courses || [];
  const newCourses = safeCourses.filter(c => c.status === CourseStatus.PUBLISHED && !currentUser.enrolledCourses.includes(c.id)).slice(0, 2);
  const authoredCourses = safeCourses.filter(c => c.authorHandle === currentUser.handle);

  const inviteLink = `${window.location.origin}${window.location.pathname}#/join?sponsor=${currentUser.handle.replace('@','')}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  // --- Dynamic Graph Data Logic ---
  const getPerformanceData = () => {
    const data = [];
    const history = currentUser.salesHistory || [];
    const today = new Date();

    if (graphRange === '30D') {
        // Mode 1: Daily View (Last 30 Days)
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayLabel = d.getDate().toString();
            const dateKey = d.toISOString().slice(0, 10); // "YYYY-MM-DD"

            let ccValue = 0;
            if (history.length > 0) {
                ccValue = history
                    .filter((sale: any) => sale.date === dateKey)
                    .reduce((acc: number, sale: any) => acc + (sale.ccEarned || 0), 0);
            } else {
                const base = (currentUser.caseCredits / 180);
                ccValue = Math.max(0, base * (0.5 + Math.random()));
            }
            data.push({ name: dayLabel, cc: parseFloat(ccValue.toFixed(2)) });
        }
    } else if (graphRange === 'YEAR') {
        // Mode 2: This Year
        const currentYear = today.getFullYear();
        for (let i = 0; i <= today.getMonth(); i++) {
             const d = new Date(currentYear, i, 1);
             const monthName = d.toLocaleString('default', { month: 'short' });
             const monthKey = `${currentYear}-${String(i+1).padStart(2, '0')}`;

             let ccValue = 0;
             if (history.length > 0) {
                 ccValue = history
                    .filter((sale: any) => sale.date.startsWith(monthKey))
                    .reduce((acc: number, sale: any) => acc + (sale.ccEarned || 0), 0);
             } else {
                 const factor = (i + 1) / (today.getMonth() + 1);
                 ccValue = currentUser.caseCredits * factor * (0.8 + Math.random() * 0.4);
             }
             data.push({ name: monthName, cc: parseFloat(ccValue.toFixed(2)) });
        }
    } else {
        // Mode 3: Last 6 Months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const monthKey = d.toISOString().slice(0, 7);
            
            let ccValue = 0;
            if (history.length > 0) {
                ccValue = history
                    .filter((sale: any) => sale.date.startsWith(monthKey))
                    .reduce((acc: number, sale: any) => acc + (sale.ccEarned || 0), 0);
            } else {
                const factors = [0.1, 0.25, 0.4, 0.6, 0.8, 1.0];
                ccValue = currentUser.caseCredits * factors[5 - i];
            }
            data.push({ name: monthName, cc: parseFloat(ccValue.toFixed(2)) });
        }
    }
    return data;
  };

  const performanceData = getPerformanceData();

  // --- Zoom Handlers ---
  // Reset zoom when data range changes
  useEffect(() => {
      setZoomIndices({ start: 0, end: performanceData.length - 1 });
  }, [graphRange, performanceData.length]);

  const handleZoom = (direction: 'in' | 'out') => {
      if (!zoomIndices) return;
      const total = performanceData.length;
      const currentStart = zoomIndices.start;
      const currentEnd = zoomIndices.end;
      const currentSpan = currentEnd - currentStart;

      let newStart = currentStart;
      
      if (direction === 'in') {
          // Zoom in: Cut range by 25% from the left (anchor right)
          const reduction = Math.ceil(currentSpan * 0.25);
          // Don't zoom in closer than 3 items
          if (currentSpan - reduction > 2) {
              newStart = currentStart + reduction;
          }
      } else {
          // Zoom out: Expand range to left
          const expansion = Math.ceil(currentSpan * 0.25);
          newStart = Math.max(0, currentStart - expansion);
      }
      
      setZoomIndices({ start: newStart, end: currentEnd });
  };

  // Stats for the Carousel
  const stats = [
    {
        id: 'team_cc',
        title: "Team CC Summary",
        value: `${teamVolume.toFixed(2)} CC`,
        icon: <Globe size={24} />,
        trend: "Total Group Volume",
        color: 'purple'
    },
    {
        id: 'monthly_cc',
        title: "CC This Month",
        value: `${rankProgress.currentCycleCC.toFixed(2)}`,
        icon: <TrendingUp size={24} />,
        trend: "+0.5 this week",
        color: 'emerald'
    },
    {
        id: 'cc_needed',
        title: currentRankDef.requiredManagersInDownline ? "Managers Needed" : "CC To Rank Up",
        value: nextRankDef ? progressText : "Max Rank",
        icon: <ArrowUpRight size={24} />,
        trend: nextRankDef ? progressTrend : "You made it!",
        color: 'orange'
    },
    (!isStudent) && {
        id: 'team_active',
        title: "Active Team",
        value: activeDownlines.toString(),
        icon: <Users size={24} />,
        trend: "Active this month",
        color: 'blue'
    }
  ].filter(Boolean) as { id: string, title: string, value: string, icon: React.ReactNode, trend: string, color?: string }[];

  // Carousel State
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Manual Navigation for Slider
  const nextStat = () => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
  };
  const prevStat = () => {
      setCurrentStatIndex((prev) => (prev - 1 + stats.length) % stats.length);
  };

  // Date Logic for Timeline display
  const currentDate = new Date();
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // --- AI Suggestions Logic ---
  const getAISuggestions = () => {
    const suggestions: { type: 'goal' | 'team' | 'win' | 'learning', text: string }[] = [];
    
    // 1. Goal Suggestion
    if (nextRankDef) {
        if (currentRankDef.targetCC > 0) {
            suggestions.push({
                type: 'goal',
                text: `You need ${progressText} more CC to stay on track for ${nextRankDef.name}.`
            });
        } else {
            suggestions.push({
                type: 'goal',
                text: `Mentor ${progressText} more downline(s) to Manager to reach ${nextRankDef.name}.`
            });
        }
    }

    // 2. Team Suggestion
    if (!isStudent && visibleStudents.length > 1) {
        // Find a recent recruit or someone with low progress
        const memberToContact = visibleStudents.find(s => s.id !== currentUser.id && s.progress < 20) || visibleStudents[visibleStudents.length - 1];
        if (memberToContact) {
            suggestions.push({
                type: 'team',
                text: `Call your new team member ${memberToContact.name.split(' ')[0]} today to check their progress.`
            });
        }
    } else if (isStudent) {
        suggestions.push({
            type: 'team',
            text: `Connect with your sponsor @${currentUser.sponsorId?.replace('@','')} for a strategy session.`
        });
    }

    // 3. Learning/Generic
    if (suggestions.length < 2) {
        suggestions.push({
            type: 'learning',
            text: "Complete 1 training module today to build your daily habit."
        });
    }

    return suggestions;
  };

  const aiSuggestions = getAISuggestions();

  // --- Customized Greeting & Subtitle Logic ---
  const firstName = currentUser.name.split(' ')[0];
  
  const getWelcomeSubtitle = () => {
      if (isAdmin) return "System overview and management dashboard active.";
      if (isSponsor) return "Your team is growing. Let's keep the momentum going.";
      if (rankProgress.currentRankId === 'NOVUS') return "Ready to start your journey to financial freedom today?";
      if (rankProgress.currentRankId === 'AS_SUP' || rankProgress.currentRankId === 'SUP') return "Great progress! Keep pushing towards your next rank goal.";
      return "Here is your daily business snapshot and progress.";
  };

  const welcomeSubtitle = getWelcomeSubtitle();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <style>{`
        @keyframes wave {
            0% { transform: rotate(0.0deg) }
            10% { transform: rotate(14.0deg) }
            20% { transform: rotate(-8.0deg) }
            30% { transform: rotate(14.0deg) }
            40% { transform: rotate(-4.0deg) }
            50% { transform: rotate(10.0deg) }
            60% { transform: rotate(0.0deg) }
            100% { transform: rotate(0.0deg) }
        }
        .animate-wave {
            animation-name: wave;
            animation-duration: 2.5s;
            animation-iteration-count: infinite;
            transform-origin: 70% 70%;
            display: inline-block;
        }
      `}</style>
      <header className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading dark:text-emerald-400 flex items-center gap-2">
                Hi {firstName} <span className="animate-wave text-2xl md:text-3xl">👋</span>
            </h1>
            <p className="text-emerald-700 mt-2 text-sm md:text-base dark:text-emerald-300 max-w-md">
                {welcomeSubtitle}
            </p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Cycle</p>
            <p className="text-slate-700 font-bold dark:text-slate-300">{monthNames[prevMonth.getMonth()]]} - {monthNames[currentDate.getMonth()]}</p>
        </div>
      </header>

      {/* Stats Slider / Grid */}
      <div className="mb-4">
        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
            {stats.map((stat) => (
                <StatCard 
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    color={stat.color}
                />
            ))}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden relative group">
            <div className="overflow-hidden rounded-2xl">
                <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
                >
                    {stats.map((stat) => (
                        <div key={stat.id} className="min-w-full px-1">
                            <StatCard 
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                trend={stat.trend}
                                color={stat.color}
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Arrows */}
            <button 
                onClick={prevStat}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-black/60 transition-all z-10"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={nextStat}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-black/60 transition-all z-10"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {stats.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentStatIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStatIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            
            {/* AI Suggestions Widget */}
            <div className="bg-gradient-to-r from-violet-100 to-fuchsia-50 p-6 rounded-2xl border border-violet-100 dark:bg-slate-800 dark:from-slate-800 dark:to-slate-800 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <SparklesIcon />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-violet-600 dark:bg-slate-700 dark:text-violet-400">
                        <Lightbulb size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg dark:text-white font-heading">AI Coach Insights</h3>
                </div>
                
                <div className="space-y-3 relative z-10">
                    {aiSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-white/60 p-3 rounded-xl border border-white/50 dark:bg-slate-700/50 dark:border-slate-600">
                            <div className="mt-0.5 text-violet-600 dark:text-violet-400">
                                {suggestion.type === 'goal' ? <ArrowUpRight size={16} /> : suggestion.type === 'team' ? <Users size={16} /> : <CheckCircle size={16} />}
                            </div>
                            <p className="text-sm text-slate-700 font-medium dark:text-slate-200">{suggestion.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3-Month Timeline Tracker */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <Calendar size={20} />
                    </div>
                    <div>
                        {/* Mobile View: Concise */}
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base md:hidden">
                            Activity Cycle
                        </h3>
                        {/* Desktop View: Full Detail */}
                        <h3 className="hidden md:block font-bold text-slate-800 dark:text-slate-100 text-base">
                            3-Month Activity Tracker
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {currentRankDef.targetCC > 0 
                                ? `Rank Accumulation (${rankProgress.currentCycleCC.toFixed(2)} / ${rankProgress.targetCC} CC)`
                                : `Leadership Progress (${progressText} Managers Needed)`
                            }
                        </p>
                    </div>
                </div>
                
                <div className="relative pt-4 pb-2">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full dark:bg-slate-700"></div>
                    {/* Active Progress - Dynamic Width */}
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-700" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>

                    <div className="relative flex justify-between">
                        {/* Month 1 (Past) */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 font-bold text-xs z-10 dark:bg-emerald-900 dark:text-emerald-300">
                                ✓
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{monthNames[prevMonth.getMonth()]}</p>
                                <p className="text-[10px] text-slate-400">Closed</p>
                            </div>
                        </div>

                        {/* Month 2 (Current) */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm z-10 dark:border-slate-800 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                                {rankProgress.currentCycleCC.toFixed(1)}
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{monthNames[currentDate.getMonth()]}</p>
                                <p className="text-[10px] text-emerald-600 font-medium dark:text-emerald-500">Active Cycle</p>
                            </div>
                        </div>

                        {/* Month 3 (Future) */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs z-10 dark:bg-slate-800 dark:border-slate-600">
                                {nextRankDef ? nextRankDef.targetCC > 0 ? nextRankDef.targetCC : 'Next' : 'Max'}
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{monthNames[nextMonth.getMonth()]}</p>
                                <p className="text-xs text-slate-400">Projected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Performance Graph */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {graphRange === '30D' ? 'Daily Activity' : 'Growth Trends'}
                    </h2>
                    <select 
                        value={graphRange}
                        onChange={(e) => setGraphRange(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                    >
                        <option value="6M">Last 6 Months</option>
                        <option value="YEAR">This Year</option>
                        <option value="30D">Last 30 Days</option>
                    </select>
                </div>
                
                <div className="h-64 w-full min-w-0 relative group">
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
                      <Brush 
                        dataKey="name" 
                        height={30} 
                        stroke="#10b981"
                        startIndex={zoomIndices?.start}
                        endIndex={zoomIndices?.end}
                        onChange={(e: any) => setZoomIndices({ start: e.startIndex, end: e.endIndex })}
                        tickFormatter={(value) => value}
                        alwaysShowText={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Google Maps style Zoom Controls */}
                  <div className="absolute right-4 bottom-12 flex flex-col bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button 
                        onClick={() => handleZoom('in')}
                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-600 transition-colors"
                        title="Zoom In"
                      >
                          <Plus size={16} />
                      </button>
                      <button 
                        onClick={() => handleZoom('out')}
                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Zoom Out"
                      >
                          <Minus size={16} />
                      </button>
                  </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 dark:text-slate-100">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hasSponsor ? (
                        <>
                            <Link to="/mentorship/inbox" className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center dark:bg-indigo-900/30 dark:text-indigo-400 relative">
                                    <Inbox size={20} />
                                    {unreadTemplatesCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800 animate-pulse">
                                            {unreadTemplatesCount > 9 ? '9+' : unreadTemplatesCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mentorship Inbox</span>
                            </Link>
                            <Link to="/assignments" className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center dark:bg-orange-900/30 dark:text-orange-400 relative">
                                    <ClipboardCheck size={20} />
                                    {pendingAssignments > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800">
                                            {pendingAssignments > 9 ? '9+' : pendingAssignments}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">My Assignments</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/chat" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400"><MessageCircle size={20} /></div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Team Chat</span>
                            </Link>
                            <Link to="/sales-builder" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400"><ShoppingBag size={20} /></div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sales Page</span>
                            </Link>
                        </>
                    )}
                    
                    <Link to="/broadcasts" className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center dark:bg-orange-900/30 dark:text-orange-400 relative">
                            <Megaphone size={20} />
                            {unreadBroadcastsCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800 animate-pulse">
                                    {unreadBroadcastsCount > 9 ? '9+' : unreadBroadcastsCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Broadcast Inbox</span>
                    </Link>
                    
                    {!isDistributor ? (
                        <Link to="/mentorship-tools" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                            <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center dark:bg-violet-900/30 dark:text-violet-400">
                                <LayoutGrid size={20} />
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mentorship Tools</span>
                        </Link>
                    ) : (
                        <Link to="/sales" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-3 text-center dark:bg-slate-800 dark:border-slate-700">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400"><Plus size={20} /></div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Log Sale</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Course Recommendations */}
            {newCourses.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10 flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Bell size={18} className="text-yellow-400" /> New Courses Available</h3>
                        <Link to="/training/global" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">View All</Link>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {newCourses.map(c => (
                            <Link key={c.id} to={`/training/preview/${c.id}`} className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors border border-white/5">
                                <div className="flex items-center gap-3">
                                    <img src={c.thumbnailUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                    <div>
                                        <p className="font-bold text-sm">{c.title}</p>
                                        <p className="text-xs text-indigo-200">{c.modules.length} Modules • {c.level}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* Background decoration */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* Creator Studio (Admin Only) - Preserved */}
            {!isStudent && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Creator Studio</h2>
                      <Link to="/builder/new" className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1">
                          <Plus size={14} /> Course
                      </Link>
                  </div>
                  <div className="space-y-3">
                      {authoredCourses.slice(0, 3).map(course => (
                          <div key={course.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-200 overflow-hidden shrink-0 dark:bg-slate-700">
                                      <img src={course.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-800 text-xs dark:text-slate-200">{course.title}</p>
                                      <p className="text-[10px] text-slate-500">{course.status}</p>
                                  </div>
                              </div>
                              <Link to={`/builder/${course.id}`} className="text-slate-400 hover:text-emerald-600"><Edit size={14} /></Link>
                          </div>
                      ))}
                      {authoredCourses.length === 0 && <p className="text-xs text-slate-400 italic">No courses created yet.</p>}
                  </div>
              </div>
            )}
          </div>

          {/* Right Column (1/3 width) - Widgets */}
          <div className="space-y-6 min-w-0">
            
            {/* Enrollment Widget */}
            {!isStudent && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg shadow-emerald-600/20 p-6 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Grow Team</h2>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><ShareIcon /></div>
                        </div>
                        <p className="text-emerald-50 text-xs mb-4 opacity-90">Share your invite link to build your downline.</p>
                        
                        <div className="bg-black/20 rounded-xl p-1 text-xs font-mono text-white w-full border border-white/10 pl-3 flex items-center justify-between">
                            <span className="truncate mr-2">{inviteLink}</span>
                            <button onClick={copyToClipboard} className="bg-white text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50"><ClipboardIcon /></button>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
                        <Users size={120} />
                    </div>
                </div>
            )}

            {/* Top Performing Team (For Sponsors) */}
            {!isStudent && visibleStudents.length > 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Top Performers</h3>
                        <Link to="/students" className="text-xs text-emerald-600 font-bold hover:underline dark:text-emerald-400">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {visibleStudents
                            .filter(s => s.id !== currentUser.id)
                            .sort((a,b) => b.caseCredits - a.caseCredits)
                            .slice(0, 5)
                            .map((s, i) => (
                                <div key={s.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.name.split(' ')[0]}</p>
                                            <p className="text-[10px] text-slate-400">{s.role}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.caseCredits.toFixed(1)} CC</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* AI Tutor Stats */}
            <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                       <div>
                            <h3 className="font-bold text-lg font-heading">AI Tutor Stats</h3>
                            <p className="text-slate-400 text-xs mt-1">Weekly Activity</p>
                       </div>
                       <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                           <SparklesIcon />
                       </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                        <span className="text-slate-300 font-medium">Questions Asked</span>
                        <span className="font-bold text-xl">{currentUser.learningStats?.questionsAsked || 0}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm pt-1">
                        <span className="text-slate-300 font-medium">Learning Streak</span>
                        <span className="font-bold text-yellow-400 flex items-center gap-1">{currentUser.learningStats?.learningStreak || 0} Days <span className="text-lg">🔥</span></span>
                     </div>
                   </div>
                 </div>
            </div>

            {/* Mentor Access Card (Student View) */}
            {isStudent && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 dark:bg-slate-800 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your Team Leader</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold dark:bg-emerald-900 dark:text-emerald-200">
                            <User />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">My Sponsor</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.sponsorId}</p>
                        </div>
                    </div>
                    <Link 
                        to="/chat" 
                        className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                        Message Sponsor
                    </Link>
                </div>
            )}

          </div>
      </div>
    </div>
  );
};

export default Dashboard;
