
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus, MentorshipTemplate, Broadcast, AppNotification, Assignment, CourseLevel } from '../types';
import { 
    Users, TrendingUp, Calendar, ArrowUpRight, Award, 
    BookOpen, DollarSign, CircleDollarSign, Target, MessageSquare, PlusCircle, 
    BarChart2, Zap, ArrowRight, Layout, ArrowLeft, Clock, Globe, UserPlus, Shield,
    ShoppingCart, GraduationCap, Bell, Flag, Store, Lock, CheckCircle, X, PieChart as PieChartIcon, Activity, Lightbulb, ChevronLeft, HelpCircle, Hand, Medal, Gift, Hourglass, Megaphone, MessageCircle, Sparkles, Rocket, UserCheck, LayoutTemplate, CreditCard, Phone, MousePointerClick, Smartphone, Eye, Filter, ArrowDown, ExternalLink, Share2, Trash2, MoreHorizontal, Wallet, Check, Edit3, Trophy, Network, Book, Video, ClipboardCheck, PlayCircle, Search, Star, Layers, Briefcase, HeartPulse, Projector, AlertCircle, ChevronRight, VideoIcon, MonitorPlay, CalendarPlus, History, Info, Play, BellRing, CalendarDays, Bookmark, Quote, Volume2, Flame
} from 'lucide-react';
import { RANKS, RANK_ORDER } from '../constants';

// --- MOCK DATA ---
const MOCK_LIVE_SESSIONS = [
    {
        id: 'ls1',
        title: 'New Product Deep Dive: Aloe Body Care',
        instructor: 'Alice Freeman',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        duration: 45,
        audience: 'TEAM',
        type: 'LIVE',
        platform: 'Zoom',
        link: 'https://zoom.us/j/mock1',
        thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'ls2',
        title: 'Global Marketing Plan Mastery',
        instructor: 'Senior Manager Sarah',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        duration: 60,
        audience: 'GLOBAL',
        type: 'LIVE',
        platform: 'Google Meet',
        link: 'https://meet.google.com/mock2',
        thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop'
    }
];

const MOCK_REPLAYS = [
    {
        id: 'r1',
        title: 'How to Close 5 Retail Sales Weekly',
        instructor: 'Alice Freeman',
        duration: 32,
        audience: 'TEAM',
        type: 'REPLAY',
        link: 'https://youtube.com/watch?mock_r1',
        thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=800&auto=format&fit=crop',
        notes: 'Focus on the "Acidity Test" demo. Use the script from Template #4. Ensure you follow up within 48 hours of the first contact.',
        timestamps: [
            { time: '02:15', label: 'Opening Hook & Mindset' },
            { time: '12:40', label: 'The Acidity Demo Step-by-Step' },
            { time: '25:10', label: 'Handling Price Objections' }
        ]
    },
    {
        id: 'r2',
        title: 'Recruiting for 2025: Social Strategy',
        instructor: 'Elite Global Leaders',
        duration: 55,
        audience: 'GLOBAL',
        type: 'REPLAY',
        link: 'https://youtube.com/watch?mock_r2',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
        notes: 'Global update on social algorithm changes and prospecting rules. Key takeaway: Short-form video is the primary funnel.',
        timestamps: [
            { time: '05:00', label: 'Instagram Algorithm Update' },
            { time: '20:00', label: 'TikTok Funnels for FBOs' },
            { time: '45:00', label: 'Global Closing Masterclass' }
        ]
    }
];

const MOCK_KNOWLEDGE_FEED = [
    {
        id: 'k1',
        category: 'LEADER_TIPS',
        author: 'Senior Manager Alice',
        type: 'TEXT',
        title: 'The 24-Hour Rule',
        content: 'Always follow up with a lead within 24 hours of their first inquiry. The psychological desire for a solution drops by 60% after day one.',
        timestamp: '1h ago',
        isNew: true
    },
    {
        id: 'k2',
        category: 'PRODUCT_NEWS',
        author: 'Forever Global HQ',
        type: 'IMAGE',
        title: 'Aloe Liquid Soap Update',
        content: 'Our Aloe Liquid Soap has been restocked in the main warehouse. Ready for shipping in 48 hours.',
        mediaUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop',
        timestamp: '3h ago',
        isNew: true
    },
    {
        id: 'k3',
        category: 'BIZ_HACKS',
        author: 'Elite Mentor John',
        type: 'VOICE',
        title: 'Handling Price Objections',
        content: 'Listen to this 45-second drill on how to pivot a "it is too expensive" comment into a "value over time" conversation.',
        duration: '0:45',
        timestamp: '5h ago',
        isNew: false
    },
    {
        id: 'k4',
        category: 'MICRO_LEARNING',
        author: 'Training Team',
        type: 'VIDEO',
        title: '1-Minute Reels Drill',
        content: 'Watch how to set up the perfect lighting for your product demo reels using just a window and a white sheet.',
        mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
        duration: '1:12',
        timestamp: '1d ago',
        isNew: false
    }
];

// --- REUSABLE CUSTOM MODAL ---
const CustomModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    icon: Icon 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children?: React.ReactNode;
    icon?: any;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex justify-end md:items-center md:justify-center p-0 md:p-6">
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .drawer-enter {
                    animation: slideInRight 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
                }
                .modal-enter {
                    animation: zoomIn 0.2s ease-out forwards;
                }
            `}</style>

            {/* Blur Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
                onClick={onClose}
            />
            
            {/* Modal Content - Drawer on Mobile, Large Modal on Desktop */}
            <div className={`
                relative flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-hidden
                w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-6xl md:rounded-[2.5rem]
                drawer-enter md:modal-enter
            `}>
                {/* Header */}
                <div className="px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-800 pb-4 mb-0 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose} 
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        {Icon && <div className="hidden md:flex w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-emerald-600 dark:text-emerald-400"><Icon size={20} /></div>}
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white font-heading">{title}</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hidden md:block p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-black/20">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

// A. Left Column Card (Compact & Responsive) - Enhanced with Ghost Icon
const InfoCard = ({ 
    title, 
    children, 
    icon: Icon, 
    colorClass, 
    className = "", 
    iconStyle = 'FILLED',
    bgIcon: BgIcon
}: { 
    title: string, 
    children?: React.ReactNode, 
    icon: any, 
    colorClass: string, 
    className?: string,
    iconStyle?: 'FILLED' | 'OUTLINE',
    bgIcon?: any
}) => (
    <div className={`bg-white dark:bg-slate-800 rounded-[1.25rem] p-4 lg:p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-2 relative overflow-hidden ${className}`}>
        
        {/* Ghost Background Icon */}
        {BgIcon && (
            <div className="absolute -right-4 -bottom-4 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none">
                <BgIcon size={112} strokeWidth={1} className="text-slate-900 dark:text-white" />
            </div>
        )}

        <div className="flex items-center gap-3 mb-0 shrink-0 relative z-10">
            <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                {iconStyle === 'FILLED' ? (
                    <Icon size={16} strokeWidth={3} fill="currentColor" className="opacity-90 lg:w-[18px] lg:h-[18px]" />
                ) : (
                    <Icon size={18} strokeWidth={3} className="opacity-90 lg:w-[20px] lg:h-[20px]" />
                )}
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-[10px] lg:text-xs uppercase tracking-wide truncate">{title}</h3>
        </div>
        <div className="pl-1 w-full flex-1 flex flex-col justify-center relative z-10">
            {children}
        </div>
    </div>
);

// B. Section Title with Custom Underline
const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-4">
        <h3 className="text-base lg:text-lg font-bold text-slate-800 dark:text-white inline-block">{title}</h3>
        <div className="h-1 w-8 bg-slate-800 dark:bg-slate-200 mt-1 rounded-full"></div>
    </div>
);

// C. Shortcut Item (Responsive)
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
            flex flex-col items-center justify-center gap-2 lg:gap-3 p-4 lg:p-6 rounded-3xl transition-all duration-300 h-full border border-transparent
            ${disabled 
                ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50 dark:bg-slate-800/50' 
                : 'bg-white hover:bg-white hover:shadow-xl hover:border-slate-100 cursor-pointer group dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-700'}
        `}>
            <div className={`
                p-3 lg:p-5 rounded-2xl transition-all duration-300 relative
                ${disabled ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-800 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white'}
            `}>
                <Icon 
                    strokeWidth={3}
                    className="w-8 h-8 lg:w-12 lg:h-12 fill-slate-50 dark:fill-slate-700/50"
                />
                {disabled && <div className="absolute -top-1 -right-1 bg-slate-200 rounded-full p-1"><Lock size={12} className="text-slate-500" /></div>}
            </div>
            <div className="text-center space-y-0.5 lg:space-y-1 w-full">
                <h4 className="font-extrabold text-sm lg:text-base text-slate-700 dark:text-slate-200 leading-tight truncate px-1">
                    {title}
                </h4>
                <p className="text-[10px] lg:text-xs text-slate-400 font-medium leading-tight px-1 truncate">
                    {desc}
                </p>
            </div>
        </div>
    );

    if (disabled) return <div className="h-full">{content}</div>;
    if (to) return <Link to={to} className="block h-full">{content}</Link>;
    return <div onClick={onClick} className="h-full">{content}</div>;
};

// Fix: Redefine LibraryCourseCard with React.FC to properly handle 'key' and React component types
interface LibraryCourseCardProps {
    course: Course;
    onClick: () => void;
}

const LibraryCourseCard: React.FC<LibraryCourseCardProps> = ({ course, onClick }) => {
    const totalMins = course.modules.reduce((acc, m) => acc + m.chapters.reduce((ca, ch) => ca + ch.durationMinutes, 0), 0);
    const durationStr = totalMins > 60 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` : `${totalMins}m`;

    return (
        <div 
            onClick={onClick}
            className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col h-full"
        >
            <div className="relative h-40 shrink-0">
                <img src={course.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={course.title} />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-slate-800 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {course.level}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                    {durationStr}
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{course.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{course.subtitle}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.track}</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    );
};

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
  
  // Drawer States
  const [isBusinessDrawerOpen, setIsBusinessDrawerOpen] = useState(false);
  const [isSalesDrawerOpen, setIsSalesDrawerOpen] = useState(false);
  const [isTrainingDrawerOpen, setIsTrainingDrawerOpen] = useState(false); // NEW: Training Hub Drawer

  // Combined Modal States
  const [activeModal, setActiveModal] = useState<
    'NONE' | 
    // Business Section
    'OVERVIEW' | 'BREAKDOWN' | 'RANK_JOURNEY' | 'MOMENT_UM' | 'DOWNLINE' | 'SUGGESTIONS' |
    // Sales Section
    'MY_PAGES' | 'CREATE_PAGE' | 'LEADS' | 'ORDERS' | 'PAYMENTS' | 'SALES_ANALYTICS' |
    // Training Section
    'MY_CLASSROOM' | 'GLOBAL_LIBRARY' | 'TEAM_TRAINING' | 'ASSIGNMENTS' | 'LIVE_SESSIONS' | 'KNOWLEDGE_FEED' | 'MOMENTUM' 
  >('NONE');
  
  const [supportMenuOpen, setSupportMenuOpen] = useState<string | null>(null); // Stores ID of user whose menu is open
  
  // NEW: Sales Page Management States
  const [selectedSalesPageId, setSelectedSalesPageId] = useState<string | null>(null);
  const [salesFilter, setSalesFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // NEW: Library Filter States
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryLevel, setLibraryLevel] = useState<string>('ALL');
  const [libraryTrack, setLibraryTrack] = useState<string>('ALL');
  const [libraryFormat, setLibraryFormat] = useState<'ALL' | 'SHORT' | 'COURSE'>('ALL');

  // NEW: Assignment Modal States
  const [assignmentTab, setAssignmentTab] = useState<'ACTIVE' | 'COMPLETED' | 'UPCOMING'>('ACTIVE');

  // NEW: Live Sessions States
  const [liveSessionTab, setLiveSessionTab] = useState<'UPCOMING' | 'REPLAYS'>('UPCOMING');
  const [liveAudienceFilter, setLiveAudienceFilter] = useState<'TEAM' | 'GLOBAL'>('TEAM');
  const [selectedReplay, setSelectedReplay] = useState<any | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);

  // NEW: Knowledge Feed States
  const [knowledgeFilter, setKnowledgeFilter] = useState<'ALL' | 'LEADER_TIPS' | 'PRODUCT_NEWS' | 'BIZ_HACKS'>('ALL');
  
  // Mock Payment Status
  const [isPaymentSetup, setIsPaymentSetup] = useState(false);

  // MOCK DATA for Sales Pages
  const MOCK_SALES_PAGES = [
      { id: 'sp1', title: 'Clean 9 Detox Challenge', package: 'C9 Pack', status: 'PUBLISHED', views: 1240, leads: 85, sales: 12, conversion: 14.1, lastUpdated: '2h ago' },
      { id: 'sp2', title: 'Vital5 Heart Health', package: 'Vital5', status: 'DRAFT', views: 45, leads: 2, sales: 0, conversion: 0, lastUpdated: '1d ago' },
      { id: 'sp3', title: 'Glow Up Skincare Routine', package: 'Infinite Kit', status: 'PUBLISHED', views: 890, leads: 42, sales: 5, conversion: 11.9, lastUpdated: '3d ago' },
  ];

  // Calculated Metrics
  const totalViews = MOCK_SALES_PAGES.reduce((acc, p) => acc + p.views, 0);
  const totalLeads = MOCK_SALES_PAGES.reduce((acc, p) => acc + p.leads, 0);
  const totalSales = MOCK_SALES_PAGES.reduce((acc, p) => acc + p.sales, 0);
  const avgConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0.0';

  // Filtered List
  const filteredSalesPages = MOCK_SALES_PAGES.filter(page => {
      if (salesFilter === 'ALL') return true;
      return page.status === salesFilter;
  });

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

  // --- HANDLERS ---
  const handleAddToCalendar = (session: any) => {
    const start = new Date(session.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(session.startTime).getTime() + session.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.title)}&dates=${start}/${end}&details=${encodeURIComponent('Join training at: ' + session.link)}&location=${encodeURIComponent(session.platform)}&sf=true&output=xml`;
    window.open(url, '_blank');
  };

  const toggleReminder = (sessionId: string) => {
    setReminders(prev => prev.includes(sessionId) ? prev.filter(id => id !== sessionId) : [...prev, sessionId]);
  };

  // --- RENDER MODALS ---
  const renderModals = () => {
      // ----------------------------
      // TRAINING HUB MODALS
      // ----------------------------
      
      if (activeModal === 'KNOWLEDGE_FEED') {
          const feedItems = knowledgeFilter === 'ALL' 
            ? MOCK_KNOWLEDGE_FEED 
            : MOCK_KNOWLEDGE_FEED.filter(item => item.category === knowledgeFilter);

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Knowledge Feed"
                  icon={Zap}
              >
                  <div className="space-y-8 animate-fade-in pb-10">
                      
                      {/* Daily Momentum / Pulse Ring */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between overflow-hidden relative group">
                          <div className="relative z-10">
                              <div className="flex items-center gap-2 mb-1">
                                  <Flame className="text-orange-500 fill-current" size={16} />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily Knowledge Streak</span>
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">12 Days Active</h3>
                              <p className="text-xs text-slate-500 mt-1">Visit daily for high-impact 1-min lessons.</p>
                          </div>
                          
                          <div className="relative w-20 h-20 group-hover:scale-110 transition-transform">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[{v:80}, {v:20}]}
                                            innerRadius={30}
                                            outerRadius={38}
                                            startAngle={90}
                                            endAngle={-270}
                                            paddingAngle={0}
                                            dataKey="v"
                                            stroke="none"
                                        >
                                            <Cell fill="#10b981" />
                                            <Cell fill="#f1f5f9" className="dark:fill-slate-700" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-sm font-black text-emerald-600">80%</span>
                                </div>
                          </div>
                          <Sparkles className="absolute -right-2 -top-2 text-emerald-100 opacity-20 rotate-12" size={80} />
                      </div>

                      {/* Filters */}
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800">
                          {['ALL', 'LEADER_TIPS', 'PRODUCT_NEWS', 'BIZ_HACKS'].map(cat => (
                              <button 
                                key={cat}
                                onClick={() => setKnowledgeFilter(cat as any)}
                                className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${knowledgeFilter === cat ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                  {cat.replace('_', ' ')}
                                  {knowledgeFilter === cat && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"></div>}
                              </button>
                          ))}
                      </div>

                      {/* Feed Stack */}
                      <div className="space-y-6">
                          {feedItems.map((item) => (
                              <div 
                                key={item.id} 
                                className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                              >
                                  {/* Media Section */}
                                  {item.type === 'IMAGE' && item.mediaUrl && (
                                      <div className="aspect-[16/9] overflow-hidden">
                                          <img src={item.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                      </div>
                                  )}
                                  {item.type === 'VIDEO' && item.mediaUrl && (
                                      <div className="aspect-square md:aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                                          <img src={item.mediaUrl} className="w-full h-full object-cover opacity-60" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                          <PlayCircle size={48} className="text-white drop-shadow-2xl z-10" />
                                          <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase">{item.duration} MIN DRILL</div>
                                      </div>
                                  )}
                                  
                                  <div className="p-6 space-y-4">
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <div className="flex items-center gap-2 mb-1.5">
                                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{item.category.replace('_', ' ')}</span>
                                                  {item.isNew && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                                              </div>
                                              <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-300 uppercase">{item.timestamp}</span>
                                      </div>

                                      {/* Voice Specific Rendering */}
                                      {item.type === 'VOICE' && (
                                          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                                              <button className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                                  <Play size={18} fill="currentColor" />
                                              </button>
                                              <div className="flex-1">
                                                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full w-full relative">
                                                      <div className="absolute inset-0 h-full w-1/3 bg-emerald-500 rounded-full"></div>
                                                  </div>
                                                  <div className="flex justify-between mt-1.5">
                                                      <span className="text-bottom-4 pl-1 text-[10px] font-black text-slate-400">0:15 / {item.duration}</span>
                                                      <Volume2 size={12} className="text-slate-300" />
                                                  </div>
                                              </div>
                                          </div>
                                      )}

                                      {/* Text Content */}
                                      <div className="relative">
                                          {item.type === 'TEXT' && <Quote size={24} className="text-slate-100 dark:text-slate-700 absolute -top-2 -left-2 -z-0" fill="currentColor" />}
                                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
                                              {item.content}
                                          </p>
                                      </div>

                                      {/* Footer */}
                                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                          <div className="flex items-center gap-2">
                                              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-[9px] text-slate-500 uppercase">{item.author.charAt(0)}</div>
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.author}</span>
                                          </div>
                                          <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                                              <Bookmark size={18} />
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'LIVE_SESSIONS') {
          const sessionsToShow = liveSessionTab === 'UPCOMING' 
              ? MOCK_LIVE_SESSIONS.filter(s => s.audience === liveAudienceFilter)
              : MOCK_REPLAYS.filter(r => r.audience === liveAudienceFilter);

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => { setActiveModal('NONE'); setSelectedReplay(null); }}
                  title="Live Trainings & Replays"
                  icon={VideoIcon}
              >
                  <div className="space-y-8 animate-fade-in pb-10">
                      
                      {/* 1. Global/Team Status Board */}
                      <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group">
                           <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Happening This Week</span>
                                </div>
                                <h3 className="text-2xl font-bold font-heading">Coaching Momentum</h3>
                                <p className="text-sm text-white/70 mt-1">Direct access to leaders and strategy updates.</p>
                           </div>
                           <VideoIcon size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12 transition-transform duration-500 group-hover:scale-110" strokeWidth={1} />
                      </div>

                      {/* 2. Primary Tabs (Upcoming vs Replays) */}
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                          <button 
                            onClick={() => setLiveSessionTab('UPCOMING')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${liveSessionTab === 'UPCOMING' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                          >
                              <CalendarPlus size={18} /> Upcoming
                          </button>
                          <button 
                            onClick={() => setLiveSessionTab('REPLAYS')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${liveSessionTab === 'REPLAYS' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                          >
                              <History size={18} /> Past Replays
                          </button>
                      </div>

                      {/* 3. Audience Filters (Team vs Global) */}
                      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <button 
                            onClick={() => setLiveAudienceFilter('TEAM')}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${liveAudienceFilter === 'TEAM' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                              Team Only
                          </button>
                          <button 
                            onClick={() => setLiveAudienceFilter('GLOBAL')}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${liveAudienceFilter === 'GLOBAL' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                              Global Hub
                          </button>
                      </div>

                      {/* 4. Dynamic Content List */}
                      <div className="space-y-6">
                          {selectedReplay ? (
                              <div className="animate-fade-in space-y-6">
                                  <button 
                                    onClick={() => setSelectedReplay(null)}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                  >
                                      <ArrowLeft size={16} /> Back to Session List
                                  </button>
                                  
                                  <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                                      <div className="aspect-video bg-black relative flex items-center justify-center group cursor-pointer">
                                          <img src={selectedReplay.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                          <PlayCircle size={64} className="text-white absolute z-10 drop-shadow-2xl" />
                                      </div>
                                      <div className="p-8 space-y-6">
                                          <div>
                                              <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-heading leading-tight">{selectedReplay.title}</h4>
                                              <p className="text-sm text-slate-500 mt-2 uppercase font-black tracking-widest text-[10px]">Coached by {selectedReplay.instructor}</p>
                                          </div>
                                          
                                          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl space-y-4">
                                              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                                                  <Info size={16} /> Key Training Notes
                                              </div>
                                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{selectedReplay.notes}</p>
                                          </div>

                                          <div className="space-y-4">
                                              <div className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest">
                                                  <Clock size={16} /> Content Timestamps
                                              </div>
                                              <div className="grid grid-cols-1 gap-2">
                                                  {selectedReplay.timestamps.map((ts: any, i: number) => (
                                                      <button key={i} className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all flex items-center justify-between group">
                                                          <div className="flex items-center gap-3">
                                                              <Play size={12} className="group-hover:fill-current" />
                                                              <span className="font-mono text-emerald-600 dark:text-emerald-400">{ts.time}</span>
                                                              <span className="opacity-40">|</span>
                                                              <span>{ts.label}</span>
                                                          </div>
                                                          <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ) : sessionsToShow.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {sessionsToShow.map((session) => (
                                      <div 
                                        key={session.id} 
                                        className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col"
                                      >
                                          <div className="relative h-44 overflow-hidden">
                                              <img src={session.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                              <div className="absolute top-4 right-4 flex gap-2">
                                                  {session.type === 'LIVE' ? (
                                                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> LIVE NOW
                                                      </span>
                                                  ) : (
                                                      <span className="bg-slate-900/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                                                          PAST REPLAY
                                                      </span>
                                                  )}
                                              </div>
                                              <div className="absolute bottom-4 left-4">
                                                  <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-900 uppercase tracking-tight">
                                                      {session.platform || `${session.duration} MINS`}
                                                  </span>
                                              </div>
                                          </div>
                                          <div className="p-6 flex flex-col flex-1">
                                              <div className="mb-4">
                                                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">{session.title}</h4>
                                                  <div className="flex items-center gap-2 mt-3">
                                                      <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-[10px] text-slate-400">
                                                          {session.instructor.charAt(0)}
                                                      </div>
                                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{session.instructor}</span>
                                                  </div>
                                              </div>
                                              
                                              {session.type === 'LIVE' ? (
                                                  <div className="mt-auto space-y-4">
                                                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 border-t border-slate-50 dark:border-slate-700 pt-4">
                                                          <div className="flex items-center gap-1"><CalendarDays size={12} /> {new Date(session.startTime).toLocaleDateString()}</div>
                                                          <div className="flex items-center gap-1"><Clock size={12} /> {new Date(session.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                                      </div>
                                                      <div className="flex gap-2">
                                                          <a 
                                                            href={session.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex-1 bg-emerald-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-center"
                                                          >
                                                              Join Meeting
                                                          </a>
                                                          <button 
                                                            onClick={() => handleAddToCalendar(session)}
                                                            className="p-3.5 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-600 dark:text-white hover:bg-emerald-50 transition-colors group/cal"
                                                            title="Add to Google Calendar"
                                                          >
                                                              <CalendarPlus size={20} className="group-hover/cal:scale-110 transition-transform" />
                                                          </button>
                                                          <button 
                                                            onClick={() => toggleReminder(session.id)}
                                                            className={`p-3.5 rounded-2xl transition-all ${reminders.includes(session.id) ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white'}`}
                                                            title="Set Reminder"
                                                          >
                                                              <BellRing size={20} />
                                                          </button>
                                                      </div>
                                                  </div>
                                              ) : (
                                                  <button 
                                                    onClick={() => setSelectedReplay(session)}
                                                    className="mt-auto w-full py-4 bg-slate-900 text-white dark:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group/play"
                                                  >
                                                      <MonitorPlay size={18} className="group-hover/play:scale-110 transition-transform" /> Access Replay Content
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:bg-slate-900/30 dark:border-slate-800 animate-fade-in">
                                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm dark:bg-slate-800">
                                      <VideoIcon size={48} className="text-slate-200" />
                                  </div>
                                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">No Sessions Available</h4>
                                  <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Try switching between Team and Global Hub filters to find more content.</p>
                              </div>
                          )}
                      </div>

                      {/* Footer Tip */}
                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex items-start gap-4 dark:bg-blue-900/20 dark:border-blue-800">
                           <Lightbulb className="text-blue-600 shrink-0 mt-0.5" size={20} />
                           <div>
                               <h5 className="font-bold text-sm text-blue-900 dark:text-blue-300">Why Attend Live?</h5>
                               <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                                   Live sessions allow for real-time Q&A, energy sharing, and immediate mentorship from top performing leaders.
                               </p>
                           </div>
                      </div>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'ASSIGNMENTS') {
          // Logic to determine status for current user
          const getStatus = (a: Assignment) => {
              const sub = currentUser.assignmentSubmissions?.find(s => s.assignmentId === a.id);
              if (sub) return 'COMPLETED';
              if (a.deadline && new Date(a.deadline).getTime() < Date.now()) return 'OVERDUE';
              return 'ACTIVE';
          };

          const userAssignments = assignments.filter(a => a.assignedTo.includes(currentUser.handle));
          
          const activeList = userAssignments.filter(a => getStatus(a) === 'ACTIVE' || getStatus(a) === 'OVERDUE');
          const completedList = userAssignments.filter(a => getStatus(a) === 'COMPLETED');
          const upcomingList = assignments.filter(a => 
            !a.assignedTo.includes(currentUser.handle) && 
            a.status === 'ACTIVE' && 
            a.authorHandle === currentUser.sponsorId
          );

          const listToShow = assignmentTab === 'ACTIVE' ? activeList : assignmentTab === 'COMPLETED' ? completedList : upcomingList;

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Assignments & Challenges"
                  icon={ClipboardCheck}
              >
                  <div className="space-y-8 animate-fade-in pb-10">
                      
                      {/* Summary Header */}
                      <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center dark:bg-slate-800 dark:border-slate-700">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</p>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeList.length}</p>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center dark:bg-slate-800 dark:border-slate-700">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Done</p>
                              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedList.length}</p>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center dark:bg-slate-800 dark:border-slate-700">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next</p>
                              <p className="text-2xl font-black text-orange-500 dark:text-orange-400">{upcomingList.length}</p>
                          </div>
                      </div>

                      {/* Tab Navigation */}
                      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800">
                          {['ACTIVE', 'COMPLETED', 'UPCOMING'].map((tab) => (
                              <button 
                                key={tab}
                                onClick={() => setAssignmentTab(tab as any)}
                                className={`px-4 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${assignmentTab === tab ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                              >
                                  {tab}
                                  {assignmentTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"></div>}
                              </button>
                          ))}
                      </div>

                      {/* List View */}
                      <div className="space-y-3">
                          {listToShow.length > 0 ? listToShow.map(a => {
                              const status = getStatus(a);
                              return (
                                  <div 
                                    key={a.id} 
                                    onClick={() => navigate(`/assignments/${a.id}`)}
                                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-300 transition-all dark:bg-slate-800 dark:border-slate-700"
                                  >
                                      <div className="flex-1 min-w-0 pr-4">
                                          <div className="flex items-center gap-2 mb-1.5">
                                              {status === 'OVERDUE' && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[9px] font-black uppercase dark:bg-red-900/30 dark:text-red-400">Overdue</span>}
                                              {status === 'COMPLETED' && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase dark:bg-emerald-900/30 dark:text-emerald-400">Success</span>}
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{a.authorHandle}</span>
                                          </div>
                                          <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{a.title}</h4>
                                          <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                              <span className="flex items-center gap-1"><Clock size={12} className="text-emerald-500" /> Due: {a.deadline ? new Date(a.deadline).toLocaleDateString() : 'ASAP'}</span>
                                              <span>•</span>
                                              <span>{a.questions.length} Steps</span>
                                          </div>
                                      </div>
                                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors dark:bg-slate-900/50">
                                          <ChevronRight size={20} />
                                      </div>
                                  </div>
                              );
                          }) : (
                              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
                                  <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
                                  <p className="text-slate-400 font-bold">No tasks found in this category.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'TEAM_TRAINING') {
          const sponsor = students.find(s => s.handle === currentUser.sponsorId);
          const teamCourses = courses.filter(c => 
              c.status === CourseStatus.PUBLISHED && 
              c.settings.teamOnly && 
              (c.authorHandle === currentUser.sponsorId || c.authorHandle === currentUser.handle)
          );
          
          const teamAssignments = assignments.filter(a => 
              a.authorHandle === currentUser.sponsorId && 
              a.assignedTo.includes(currentUser.handle) &&
              !currentUser.assignmentSubmissions?.some(s => s.assignmentId === a.id)
          );

          const teamLeaderboard = students
            .filter(s => s.sponsorId === currentUser.sponsorId || s.handle === currentUser.sponsorId)
            .sort((a, b) => b.caseCredits - a.caseCredits)
            .slice(0, 5);

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Team Training"
                  icon={Users}
              >
                  <div className="space-y-10 animate-fade-in pb-10">
                      
                      {/* 1. Sponsor Welcome Card */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                          <div className="relative z-10 flex items-center gap-6">
                              <div className="w-20 h-20 rounded-3xl bg-emerald-500 border-4 border-white/10 flex items-center justify-center text-3xl font-black shadow-2xl shrink-0 overflow-hidden">
                                  {sponsor?.avatarUrl ? <img src={sponsor.avatarUrl} className="w-full h-full object-cover"/> : sponsor?.name.charAt(0)}
                              </div>
                              <div>
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Sponsor-Led Learning</span>
                                  <h2 className="text-2xl font-bold mt-1 font-heading">{sponsor?.name || 'Your Team Leader'}</h2>
                                  <p className="text-sm text-slate-400 mt-1">Directly guiding your success path.</p>
                              </div>
                          </div>
                          <Sparkles size={140} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" />
                      </div>

                      {/* 2. Team Assignments (Todo) */}
                      <section>
                          <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/30 dark:text-orange-400">
                                      <ClipboardCheck size={18} />
                                  </div>
                                  <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-sm">Team Tasks</h3>
                              </div>
                              <Link to="/assignments" className="text-xs font-bold text-orange-600 hover:underline">View All</Link>
                          </div>

                          <div className="space-y-3">
                              {teamAssignments.length > 0 ? teamAssignments.map(a => (
                                  <div 
                                    key={a.id} 
                                    onClick={() => navigate(`/assignments/${a.id}`)}
                                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-orange-300 transition-all dark:bg-slate-800 dark:border-slate-700"
                                  >
                                      <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{a.title}</h4>
                                          <p className="text-[10px] text-orange-500 font-bold uppercase mt-1">Due: {a.deadline ? new Date(a.deadline).toLocaleDateString() : 'No Deadline'}</p>
                                      </div>
                                      <ArrowRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                                  </div>
                              )) : (
                                  <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-900/30 dark:border-slate-700">
                                      <p className="text-sm text-slate-400">No pending team tasks.</p>
                                  </div>
                              )}
                          </div>
                      </section>

                      {/* 3. Team-Only Courses */}
                      <section>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                                  <Lock size={18} />
                              </div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-sm">Private Strategies</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {teamCourses.length > 0 ? teamCourses.map(c => (
                                  <LibraryCourseCard 
                                    key={c.id} 
                                    course={c} 
                                    onClick={() => navigate(`/training/preview/${c.id}`)} 
                                  />
                              )) : (
                                  <p className="text-sm text-slate-400 italic col-span-full py-4 px-2">No private team courses available yet.</p>
                              )}
                          </div>
                      </section>

                      {/* 4. Team Leaderboard */}
                      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-3 mb-8">
                              {/* Fix: TrophyIcon to Trophy */}
                              <Trophy className="w-6 h-6 text-yellow-500" />
                              <h3 className="font-bold text-xl text-slate-900 dark:text-white uppercase tracking-widest font-heading">Team Superstars</h3>
                          </div>
                          
                          <div className="space-y-4">
                              {teamLeaderboard.map((student, idx) => (
                                  <div key={student.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                                              {idx + 1}
                                          </div>
                                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                              {student.avatarUrl ? <img src={student.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{student.name.charAt(0)}</div>}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-800 dark:text-white text-sm">{student.name}</p>
                                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{RANKS[student.rankProgress?.currentRankId || 'NOVUS'].name}</p>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{student.caseCredits.toFixed(2)} CC</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </section>

                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'GLOBAL_LIBRARY') {
          const filteredCourses = courses.filter(c => {
              if (c.status !== CourseStatus.PUBLISHED) return false;
              if (c.settings.teamOnly) return false;

              const matchesSearch = c.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
                                    c.subtitle.toLowerCase().includes(librarySearch.toLowerCase());
              if (!matchesSearch) return false;

              if (libraryLevel !== 'ALL' && c.level !== libraryLevel) return false;
              if (libraryTrack !== 'ALL' && c.track !== libraryTrack) return false;
              
              if (libraryFormat === 'SHORT') {
                  const totalMins = c.modules.reduce((acc, m) => acc + m.chapters.reduce((ca, ch) => ca + ch.durationMinutes, 0), 0);
                  return totalMins <= 30;
              }
              if (libraryFormat === 'COURSE') {
                  const totalMins = c.modules.reduce((acc, m) => acc + m.chapters.reduce((ca, ch) => ca + ch.durationMinutes, 0), 0);
                  return totalMins > 30;
              }

              return true;
          });

          const basics = filteredCourses.filter(c => c.track === CourseTrack.BASICS);
          const business = filteredCourses.filter(c => c.track === CourseTrack.BUSINESS || c.track === CourseTrack.SALES);
          const health = filteredCourses.filter(c => c.track === CourseTrack.PRODUCT);
          const recommended = filteredCourses.slice(0, 3); // Simple mock for system-wide recommendations

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Global Training Library"
                  icon={Globe}
              >
                  <div className="space-y-10 animate-fade-in pb-10">
                      
                      {/* Search & Intro */}
                      <div className="space-y-4">
                          <div className="relative">
                              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                              <input 
                                  type="text" 
                                  value={librarySearch}
                                  onChange={(e) => setLibrarySearch(e.target.value)}
                                  placeholder="Search products, skills, or topics..."
                                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                              />
                          </div>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                              <select 
                                  value={libraryLevel} 
                                  onChange={e => setLibraryLevel(e.target.value)}
                                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none outline-none text-slate-600 dark:text-slate-300"
                              >
                                  <option value="ALL">Difficulty: All</option>
                                  <option value={CourseLevel.BEGINNER}>Beginner</option>
                                  <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                                  <option value={CourseLevel.ADVANCED}>Advanced</option>
                              </select>
                              <select 
                                  value={libraryTrack} 
                                  onChange={e => setLibraryTrack(e.target.value)}
                                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none outline-none text-slate-600 dark:text-slate-300"
                              >
                                  <option value="ALL">Focus: All</option>
                                  <option value={CourseTrack.PRODUCT}>Product-based</option>
                                  <option value={CourseTrack.BUSINESS}>Business-based</option>
                                  <option value={CourseTrack.LEADERSHIP}>Leadership</option>
                              </select>
                              <select 
                                  value={libraryFormat} 
                                  onChange={e => setLibraryFormat(e.target.value as any)}
                                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none outline-none text-slate-600 dark:text-slate-300"
                              >
                                  <option value="ALL">Format: All</option>
                                  <option value="SHORT">Short Lessons (≤30m)</option>
                                  <option value="COURSE">Full Courses (>30m)</option>
                              </select>
                          </div>
                      </div>

                      {/* 1. Forever Basics */}
                      <section>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                  <Layers size={18} />
                              </div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-sm">Forever Basics</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {basics.map(c => <LibraryCourseCard key={c.id} course={c} onClick={() => navigate(`/training/preview/${c.id}`)} />)}
                              {basics.length === 0 && <p className="text-sm text-slate-400 italic col-span-full py-4 px-2">No basic training found for these filters.</p>}
                          </div>
                      </section>

                      {/* 2. Business Skills */}
                      <section>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                                  <Briefcase size={18} />
                              </div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-sm">Business Skills</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {business.map(c => <LibraryCourseCard key={c.id} course={c} onClick={() => navigate(`/training/preview/${c.id}`)} />)}
                              {business.length === 0 && <p className="text-sm text-slate-400 italic col-span-full py-4 px-2">No skill courses found for these filters.</p>}
                          </div>
                      </section>

                      {/* 3. Health Education */}
                      <section>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-pink-100 text-pink-600 rounded-lg dark:bg-pink-900/30 dark:text-pink-400">
                                  <HeartPulse size={18} />
                              </div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-sm">Health Education</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {health.map(c => <LibraryCourseCard key={c.id} course={c} onClick={() => navigate(`/training/preview/${c.id}`)} />)}
                              {health.length === 0 && <p className="text-sm text-slate-400 italic col-span-full py-4 px-2">No health courses found for these filters.</p>}
                          </div>
                      </section>

                      {/* 4. Recommendations */}
                      <section className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                          <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-8">
                                  <Star className="text-yellow-400 fill-current" size={24} />
                                  <h3 className="font-bold text-xl uppercase tracking-widest font-heading">Recommended for You</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {recommended.map(c => (
                                      <button 
                                        key={c.id}
                                        onClick={() => navigate(`/training/preview/${c.id}`)}
                                        className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-left hover:bg-white/20 transition-all group"
                                      >
                                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 block">Best for {c.level}s</span>
                                          <h4 className="font-bold text-base leading-tight group-hover:text-emerald-400 transition-colors mb-2">{c.title}</h4>
                                          <div className="flex items-center gap-3 text-[10px] text-white/60 font-bold uppercase tracking-tighter">
                                              <span>{c.modules.length} Modules</span>
                                              <span>•</span>
                                              <span>{c.track}</span>
                                          </div>
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                      </section>

                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'MY_CLASSROOM') {
          // Calculate individual course progress for progress bars
          const enrolledCoursesData = courses.filter(c => currentUser.enrolledCourses.includes(c.id)).map(course => {
              const totalModules = course.modules.length;
              if (totalModules === 0) return { ...course, progress: 0 };
              const completedCount = course.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
              const progress = Math.round((completedCount / totalModules) * 100);
              return { ...course, progress };
          });

          const inProgress = enrolledCoursesData.filter(c => c.progress < 100);
          const completed = enrolledCoursesData.filter(c => c.progress === 100);
          
          // Resume Logic: Find the first in-progress course
          const resumeCourse = inProgress[0];

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="My Classroom"
                  icon={BookOpen}
              >
                  <div className="space-y-8 animate-fade-in">
                      {/* Resume Learning Section */}
                      {resumeCourse ? (
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div>
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Pick up where you left off</span>
                                      <h3 className="text-xl md:text-2xl font-bold mt-1 mb-2 font-heading">{resumeCourse.title}</h3>
                                      <div className="flex items-center gap-4 text-xs font-bold text-white/80 uppercase">
                                          <span>{resumeCourse.progress}% Completed</span>
                                          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                              <div className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ width: `${resumeCourse.progress}%` }}></div>
                                          </div>
                                      </div>
                                  </div>
                                  <button 
                                      onClick={() => navigate(`/training/course/${resumeCourse.id}`)}
                                      className="bg-white text-emerald-700 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                  >
                                      <PlayCircle size={18} fill="currentColor" /> Resume Learning
                                  </button>
                              </div>
                              <Sparkles size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                          </div>
                      ) : (
                          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-center">
                              <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't started any courses yet.</p>
                              <Link to="/classroom" className="mt-4 inline-block bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md">Explore Global Library</Link>
                          </div>
                      )}

                      {/* Navigation Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button 
                            onClick={() => navigate('/classroom', { state: { initialTab: 'STARTED' } })}
                            className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                          >
                              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                              <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white">In Progress</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{inProgress.length} courses active</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => navigate('/classroom', { state: { initialTab: 'COMPLETED' } })}
                            className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                          >
                              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform"><CheckCircle size={24} /></div>
                              <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white">Done</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{completed.length} courses completed</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => navigate('/classroom', { state: { initialTab: 'TEAM' } })}
                            className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 group"
                          >
                              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                              <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white">My Team</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Shared by sponsor</p>
                              </div>
                          </button>
                      </div>

                      {/* Course Progress Breakdown */}
                      {inProgress.length > 0 && (
                          <div className="space-y-4">
                              <SectionHeader title="Live Progress" />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {inProgress.slice(0, 4).map(course => (
                                      <div key={course.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                                          <div className="flex justify-between items-start mb-4">
                                              <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1 flex-1 pr-4">{course.title}</h4>
                                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0">{course.progress}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </CustomModal>
          );
      }

      // ----------------------------
      // SALES MODALS
      // ----------------------------
      
      if (activeModal === 'MY_PAGES') {
          // Determine Content based on selection
          const selectedPage = selectedSalesPageId ? MOCK_SALES_PAGES.find(p => p.id === selectedSalesPageId) : null;

          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => { setActiveModal('NONE'); setSelectedSalesPageId(null); }}
                  title={selectedPage ? selectedPage.title : "My Sales Pages"}
                  icon={LayoutTemplate}
              >
                  {selectedPage ? (
                      // === DEEP PAGE DETAILS VIEW ===
                      <div className="space-y-8 animate-fade-in">
                          <button 
                            onClick={() => setSelectedSalesPageId(null)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:text-white"
                          >
                              <ArrowLeft size={16} /> Back to All Pages
                          </button>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Left: Performance */}
                              <div className="lg:col-span-2 space-y-6">
                                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                      <h3 className="font-bold text-slate-800 mb-4 dark:text-white">Performance Timeline</h3>
                                      <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 dark:bg-slate-900/50">
                                          <p className="text-xs">Graph Placeholder: Views vs Leads over 30 days</p>
                                      </div>
                                  </div>

                                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                      <h3 className="font-bold text-slate-800 mb-4 dark:text-white">Customer Actions Funnel</h3>
                                      <div className="space-y-4">
                                          <div className="flex items-center gap-4">
                                              <div className="w-24 text-xs font-bold text-slate-500 dark:text-slate-400">Page Views</div>
                                              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                                                  <div className="h-full bg-blue-500 w-full"></div>
                                              </div>
                                              <div className="w-12 text-right text-xs font-bold">{selectedPage.views}</div>
                                          </div>
                                          <div className="flex items-center gap-4">
                                              <div className="w-24 text-xs font-bold text-slate-500 dark:text-slate-400">Leads</div>
                                              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                                                  <div className="h-full bg-indigo-500" style={{width: '40%'}}></div>
                                              </div>
                                              <div className="w-12 text-right text-xs font-bold">{selectedPage.leads}</div>
                                          </div>
                                          <div className="flex items-center gap-4">
                                              <div className="w-24 text-xs font-bold text-slate-500 dark:text-slate-400">Sales</div>
                                              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                                                  <div className="h-full bg-emerald-500" style={{width: '15%'}}></div>
                                              </div>
                                              <div className="w-12 text-right text-xs font-bold">{selectedPage.sales}</div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Right: Sources & Earnings */}
                              <div className="space-y-6">
                                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800">
                                      <h3 className="font-bold text-emerald-900 mb-2 dark:text-emerald-400">Earnings Breakdown</h3>
                                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">$450.00</p>
                                      <p className="text-xs text-emerald-600 mt-1 dark:text-emerald-500">From {selectedPage.sales} confirmed sales</p>
                                      <div className="mt-4 pt-4 border-t border-emerald-200/50 space-y-2">
                                          <div className="flex justify-between text-xs text-emerald-800 dark:text-emerald-400">
                                              <span>Product Cost</span>
                                              <span>$300.00</span>
                                          </div>
                                          <div className="flex justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                                              <span>Net Profit</span>
                                              <span>$150.00</span>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                      <h3 className="font-bold text-slate-800 mb-4 dark:text-white">Top Sources</h3>
                                      <ul className="space-y-3">
                                          <li className="flex justify-between text-sm">
                                              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><MessageCircle size={14} className="text-green-500"/> WhatsApp</span>
                                              <span className="font-bold text-slate-800 dark:text-white">65%</span>
                                          </li>
                                          <li className="flex justify-between text-sm">
                                              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Share2 size={14} className="text-blue-500"/> Direct Link</span>
                                              <span className="font-bold text-slate-800 dark:text-white">20%</span>
                                          </li>
                                          <li className="flex justify-between text-sm">
                                              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Globe size={14} className="text-purple-500"/> Instagram</span>
                                              <span className="font-bold text-slate-800 dark:text-white">15%</span>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      // === LIST VIEW (DASHBOARD) ===
                      <div className="space-y-8 animate-fade-in">
                          
                          {/* 1. Summary Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pages</p>
                                  <p className="text-xl font-bold text-slate-800 dark:text-white">{MOCK_SALES_PAGES.length}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Views</p>
                                  <p className="text-xl font-bold text-slate-800 dark:text-white">{totalViews.toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Leads</p>
                                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalLeads}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="text-xs font-bold text-slate-400 uppercase">Sales</p>
                                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalSales}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 md:col-span-1 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion</p>
                                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{avgConversion}%</p>
                              </div>
                          </div>

                          {/* 2. Action Zone */}
                          <div className="flex flex-col md:flex-row gap-4 items-stretch">
                              <button 
                                  onClick={() => navigate('/sales-builder')} 
                                  className="flex-1 bg-emerald-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
                              >
                                  <PlusCircle size={20} /> Create New Sales Page
                              </button>
                              <button 
                                  onClick={() => setActiveModal('PAYMENTS')}
                                  className={`flex-1 p-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-3 ${isPaymentSetup ? 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800' : 'border-yellow-400 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-600'}`}
                              >
                                  <Wallet size={20} /> 
                                  {isPaymentSetup ? 'Manage Payments' : 'Finish Payment Setup'}
                                  {!isPaymentSetup && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                              </button>
                          </div>

                          {/* 3. Filters */}
                          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                              {['ALL', 'PUBLISHED', 'DRAFT'].map(filter => (
                                  <button
                                      key={filter}
                                      onClick={() => setSalesFilter(filter as any)}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${salesFilter === filter ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                                  >
                                      {filter.charAt(0) + filter.slice(1).toLowerCase()}
                                  </button>
                              ))}
                          </div>

                          {/* 4. Page Cards List */}
                          <div className="space-y-4">
                              {filteredSalesPages.length > 0 ? filteredSalesPages.map(page => (
                                  <div key={page.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden dark:bg-slate-800 dark:border-slate-700 group">
                                      <div className="p-5">
                                          <div className="flex justify-between items-start mb-4">
                                              <div>
                                                  <div className="flex items-center gap-2 mb-1">
                                                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{page.title}</h3>
                                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                          {page.status}
                                                      </span>
                                                  </div>
                                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{page.package}</p>
                                              </div>
                                              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                  <MoreHorizontal size={20} />
                                              </button>
                                          </div>

                                          <div className="grid grid-cols-4 gap-2 mb-6">
                                              <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                                  <Eye size={14} className="mx-auto mb-1 text-slate-400" />
                                                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{page.views}</span>
                                              </div>
                                              <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                                  <MessageSquare size={14} className="mx-auto mb-1 text-blue-400" />
                                                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{page.leads}</span>
                                              </div>
                                              <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                                  <ShoppingCart size={14} className="mx-auto mb-1 text-emerald-500" />
                                                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{page.sales}</span>
                                              </div>
                                              <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                                  <Activity size={14} className="mx-auto mb-1 text-purple-400" />
                                                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{page.conversion}%</span>
                                              </div>
                                          </div>

                                          <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                                              <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                                                  <Edit3 size={14} /> Edit
                                              </button>
                                              <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                                                  <Eye size={14} /> Preview
                                              </button>
                                              <button className="flex-1 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-emerald-900/20 dark:text-emerald-400">
                                                  <Share2 size={14} /> Share
                                              </button>
                                              <button 
                                                  onClick={() => setSelectedSalesPageId(page.id)}
                                                  className="flex-1 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-blue-900/20 dark:text-blue-400"
                                              >
                                                  <BarChart2 size={14} /> Analytics
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )) : (
                                  <div className="text-center py-16 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700">
                                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm dark:bg-slate-800">
                                          <LayoutTemplate size={32} className="text-slate-400" />
                                      </div>
                                      <h3 className="font-bold text-slate-800 text-lg dark:text-white">No pages found</h3>
                                      <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 dark:text-slate-400">
                                          {salesFilter !== 'ALL' ? `You don't have any ${salesFilter.toLowerCase()} pages.` : "Start by creating one page to sell a product package and generate leads automatically."}
                                      </p>
                                      {salesFilter === 'ALL' && (
                                          <button 
                                              onClick={() => navigate('/sales-builder')}
                                              className="mt-6 text-emerald-600 font-bold text-sm hover:underline dark:text-emerald-400"
                                          >
                                              + Create First Page
                                          </button>
                                      )}
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
              </CustomModal>
          );
      }

      if (activeModal === 'CREATE_PAGE') {
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Create Sales Page"
                  icon={PlusCircle}
              >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button onClick={() => navigate('/sales-builder')} className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-center dark:border-slate-700 dark:hover:bg-emerald-900/10">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <PlusCircle size={32} />
                          </div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Start from Scratch</h3>
                          <p className="text-sm text-slate-500 mt-2">Build a custom page with our easy editor.</p>
                      </button>

                      <button onClick={() => navigate('/sales-builder')} className="p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center dark:border-slate-700 dark:hover:bg-blue-900/10">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <LayoutTemplate size={32} />
                          </div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Use a Template</h3>
                          <p className="text-sm text-slate-500 mt-2">Choose from high-converting pre-built layouts.</p>
                      </button>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'LEADS') {
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Leads & Conversations"
                  icon={MessageCircle}
              >
                  <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                          <Smartphone size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">WhatsApp Integration</h4>
                              <p className="text-xs text-blue-700 mt-1 dark:text-blue-400">These leads clicked "Chat on WhatsApp" from your sales pages.</p>
                          </div>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {[1, 2, 3].map((i) => (
                              <div key={i} className="py-4 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                          <MessageCircle size={20} />
                                      </div>
                                      <div>
                                          <p className="font-bold text-slate-800 text-sm dark:text-white">+233 54 123 4567</p>
                                          <p className="text-xs text-slate-500">Interested in Clean 9 • 2h ago</p>
                                      </div>
                                  </div>
                                  <button className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/30">
                                      Chat
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'ORDERS') {
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Orders & Checkout"
                  icon={ShoppingCart}
              >
                  <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
                          <ShoppingCart size={32} className="text-slate-400" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">No Orders Yet</h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Share your sales pages to start generating orders. They will appear here.</p>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'PAYMENTS') {
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Payment Setup"
                  icon={CreditCard}
              >
                  <div className="space-y-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                          <h4 className="font-bold text-sm text-slate-700 mb-4 dark:text-white">Active Methods</h4>
                          {isPaymentSetup ? (
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                                  <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center font-bold text-xs">MTN</div>
                                  <div className="flex-1">
                                      <p className="font-bold text-sm text-slate-800 dark:text-white">Mobile Money</p>
                                      <p className="text-xs text-slate-500">Ending in **89</p>
                                  </div>
                                  <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Active</span>
                              </div>
                          ) : (
                              <div className="text-center py-4 text-slate-400 text-xs">No payment methods configured.</div>
                          )}
                      </div>

                      <button 
                        onClick={() => { setIsPaymentSetup(true); alert("Payment method added (Mock)!"); }}
                        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 dark:border-slate-600 dark:hover:border-emerald-400"
                      >
                          <PlusCircle size={16} /> Add Payment Method
                      </button>
                  </div>
              </CustomModal>
          );
      }

      if (activeModal === 'SALES_ANALYTICS') {
          const data = [
              { name: 'Mon', value: 12 }, { name: 'Tue', value: 19 }, { name: 'Wed', value: 3 },
              { name: 'Thu', value: 5 }, { name: 'Fri', value: 2 }, { name: 'Sat', value: 30 }, { name: 'Sun', value: 45 }
          ];
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="Sales Performance"
                  icon={BarChart2}
              >
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl dark:bg-slate-800">
                              <p className="text-xs text-slate-500 font-bold uppercase">Total Views</p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">1,240</p>
                          </div>
                          <div className="bg-emerald-50 p-4 rounded-xl dark:bg-emerald-900/20">
                              <p className="text-xs text-emerald-600 font-bold uppercase">Conversions</p>
                              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">4.2%</p>
                          </div>
                      </div>

                      <div className="h-64 w-full bg-white p-4 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Traffic (Last 7 Days)</h4>
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={data}>
                                  <defs>
                                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorTraffic)" strokeWidth={3} />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </CustomModal>
          );
      }

      // ----------------------------
      // EXISTING BUSINESS MODALS
      // ----------------------------
      if (activeModal === 'SUGGESTIONS') {
        const nextRankTarget = rankProgress.targetCC > 0 ? rankProgress.targetCC : null;
        const closeToRankTeam = myDownline.filter(s => {
            const target = s.rankProgress?.targetCC || 0;
            const current = s.rankProgress?.currentCycleCC || 0;
            return target > 0 && (target - current <= 0.5) && (target - current > 0);
        });
        const isSponsor = currentUser.role === UserRole.SPONSOR || currentUser.role === UserRole.ADMIN;

        return (
            <CustomModal
                isOpen={true}
                onClose={() => setActiveModal('NONE')}
                title="Smart Coaching"
                icon={Sparkles}
            >
                <div className="space-y-6 pb-8">
                    <p className="text-slate-500 dark:text-slate-400">Small actions that move you forward today.</p>
                    
                    <div className="grid grid-cols-1 gap-4">
                        
                        {/* 1. Rank Progress Card */}
                        {nextRankTarget && remainingCC > 0 && (
                            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex flex-col gap-4 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0 dark:bg-blue-900/50 dark:text-blue-300">
                                        {/* Fix: TrophyIcon to Trophy */}
                                        <Trophy className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Almost There</h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            You need <strong>{remainingCC.toFixed(2)} CC</strong> to reach <span className="font-bold">{nextRankDef?.name}</span>.
                                        </p>
                                        <p className="text-xs text-blue-600/80 mt-2 font-medium dark:text-blue-300/80">Completing this rank unlocks new bonuses.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveModal('RANK_JOURNEY')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm dark:bg-blue-50 dark:hover:bg-blue-600"
                                >
                                    View CC Breakdown
                                </button>
                            </div>
                        )}

                        {/* 2. Team Growth Card */}
                        {closeToRankTeam.length > 0 && (
                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col gap-4 shadow-sm dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0 dark:bg-amber-900/50 dark:text-amber-300">
                                        <Users size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Support Your Team</h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            <span className="font-bold">{closeToRankTeam[0].name}</span> is close to leveling up.
                                        </p>
                                        <p className="text-xs text-amber-700/80 mt-2 font-medium dark:text-amber-300/80">Helping them succeed boosts your team volume.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveModal('DOWNLINE')}
                                    className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
                                >
                                    Send Encouragement
                                </button>
                            </div>
                        )}

                        {/* 3. Sales Optimization Card (Generic suggestion) */}
                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col gap-4 shadow-sm dark:bg-emerald-900/20 dark:border-blue-800 dark:text-emerald-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <TrendingUp size={20}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Increase Your CC Faster</h3>
                                    <p className="text-sm opacity-90 leading-relaxed">
                                        Create a sales page to attract more customers automatically.
                                    </p>
                                    <p className="text-xs text-emerald-700/80 mt-2 font-medium dark:text-blue-300/80">FBOs with sales pages grow 2x faster.</p>
                                </div>
                            </div>
                            <Link 
                                to="/sales-builder"
                                className="block w-full text-center bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                Create Sales Page
                            </Link>
                        </div>

                        {/* 4. Leadership Action Card */}
                        {isSponsor && (
                            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex flex-col gap-4 shadow-sm dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0 dark:bg-purple-900/50 dark:text-purple-300">
                                        <GraduationCap size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Build Your Team’s Skills</h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            Assign a specific training course to your downline.
                                        </p>
                                        <p className="text-xs text-purple-700/80 mt-2 font-medium dark:text-purple-300/80">Trained teams perform better and rank up faster.</p>
                                    </div>
                                </div>
                                <Link 
                                    to="/assignments"
                                    className="block w-full text-center bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm"
                                >
                                    Assign Course
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </CustomModal>
        );
      }

      if (activeModal === 'BREAKDOWN') {
        const cycleStart = new Date(rankProgress.cycleStartDate);
        const personalCC = (currentUser.salesHistory || [])
            .filter(s => new Date(s.date) >= cycleStart)
            .reduce((sum, s) => sum + s.ccEarned, 0);

        // 2. Calculate Team CC (Total - Personal)
        const totalCC = rankProgress.currentCycleCC;
        const teamCC = Math.max(0, totalCC - personalCC);

        // 3. Top Contributors (From Downline)
        const contributors = [...myDownline]
            .sort((a, b) => b.caseCredits - a.caseCredits)
            .slice(0, 3);

        const chartData = [
            { name: 'Personal', value: personalCC, color: '#3b82f6' }, // Blue-500
            { name: 'Team', value: teamCC, color: '#10b981' }, // Emerald-500
        ];

        return (
            <CustomModal
                isOpen={true}
                onClose={() => setActiveModal('NONE')}
                title="Current CC Breakdown"
                icon={PieChartIcon}
            >
                <div className="space-y-8">
                    
                    {/* Clarity Badge */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 dark:bg-blue-900/20 dark:border-blue-800/50">
                        <Lock size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Strictly Current Cycle</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
                                Only CC contributing to your current rank journey is shown here. Past CC is safely stored in your history.
                            </p>
                        </div>
                    </div>

                    {/* Row 1: Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col justify-between dark:bg-blue-900/10 dark:border-blue-800">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/40 dark:text-blue-300">
                                    <UserCheck size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-blue-400">Direct</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{personalCC.toFixed(2)} CC</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Personal Sales</p>
                                <p className="text-[10px] text-slate-400 mt-1">Your direct effort</p>
                            </div>
                        </div>

                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-between dark:bg-emerald-900/10 dark:border-emerald-800">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/40 dark:text-emerald-300">
                                    <Users size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-emerald-400">Downline</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{teamCC.toFixed(2)} CC</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Team Contribution</p>
                                <p className="text-[10px] text-slate-400 mt-1">From your team</p>
                            </div>
                        </div>

                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col justify-between dark:bg-emerald-900/10 dark:border-emerald-800">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg dark:bg-amber-900/40 dark:text-amber-300">
                                    <Target size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-amber-400">Goal</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalCC.toFixed(2)} CC</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Active CC</p>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden dark:bg-slate-700">
                                    <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (totalCC / (rankProgress.targetCC || 1)) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Visual Breakdown (Donut) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center dark:bg-slate-800 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 w-full text-left">CC Distribution</h4>
                        <div className="relative w-48 h-48">
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
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                        formatter={(value: number) => value.toFixed(2) + ' CC'}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalCC.toFixed(1)}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                            </div>
                        </div>
                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Personal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Team</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Top Contributors */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Medal size={16} className="text-yellow-500"/> Top Contributors (This Journey)
                            </h4>
                            <button onClick={() => navigate('/students')} className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">View Team</button>
                        </div>
                        
                        <div className="space-y-3">
                            {contributors.length > 0 ? contributors.map((student, idx) => (
                                <div key={student.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg ${
                                            idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                            idx === 1 ? 'bg-slate-200 text-slate-600' : 
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-white text-sm">{student.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{student.handle}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{student.caseCredits.toFixed(2)} CC</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/30">
                                    <p className="text-slate-400 text-sm">No significant team activity yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </CustomModal>
        );
      }

      if (activeModal === 'RANK_JOURNEY') {
        const currentRankIndex = RANK_ORDER.indexOf(rankProgress.currentRankId);
        
        return (
            <CustomModal
                isOpen={true}
                onClose={() => setActiveModal('NONE')}
                title="Rank Journey"
                icon={TrendingUp}
            >
                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 py-4">
                    {RANK_ORDER.map((rankId, index) => {
                        const rankDef = RANKS[rankId];
                        if (!rankDef) return null;
                        
                        let status: 'COMPLETED' | 'CURRENT' | 'NEXT' | 'LOCKED' = 'LOCKED';
                        if (index < currentRankIndex) status = 'COMPLETED';
                        else if (index === currentRankIndex) status = 'CURRENT';
                        else if (index === currentRankIndex + 1) status = 'NEXT';
                        
                        return (
                            <div key={rankId} className="relative pl-8">
                                {/* Icon / Bullet */}
                                <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 ${
                                    status === 'COMPLETED' ? 'border-emerald-500 text-emerald-500' :
                                    status === 'CURRENT' ? 'border-blue-500 text-blue-500' :
                                    status === 'NEXT' ? 'border-amber-500 text-amber-500' :
                                    'border-slate-300 text-slate-300 dark:border-slate-600 dark:text-slate-600'
                                }`}>
                                    {status === 'COMPLETED' && <CheckCircle size={12} strokeWidth={4} />}
                                    {status === 'CURRENT' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                                    {status === 'NEXT' && <Target size={12} strokeWidth={3} />}
                                    {status === 'LOCKED' && <Lock size={10} />}
                                </div>
                                
                                {/* Content */}
                                <div>
                                    <h4 className={`text-sm font-bold ${
                                        status === 'CURRENT' ? 'text-slate-900 dark:text-white text-lg' : 
                                        status === 'COMPLETED' ? 'text-slate-500 dark:text-slate-400' : 
                                        'text-slate-400 dark:text-slate-600'
                                    }`}>
                                        {rankDef.name}
                                    </h4>
                                    
                                    {/* Current Rank Details */}
                                    {status === 'CURRENT' && (
                                        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                                                Current Status
                                            </p>
                                            <div className="flex justify-between items-end text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                <span>{rankProgress.currentCycleCC.toFixed(2)} CC</span>
                                                {rankDef.nextRankId && (
                                                    <span className="text-slate-400">/ {RANKS[rankDef.nextRankId]?.targetCC || '?'} CC</span>
                                                )}
                                            </div>
                                            {/* Progress Bar if next rank exists and has CC target */}
                                            {nextRankDef && nextRankDef.targetCC > 0 && (
                                                <div className="w-full bg-blue-200 dark:bg-blue-800 h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                                                        style={{ width: `${Math.min(100, (rankProgress.currentCycleCC / nextRankDef.targetCC) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Next Rank Requirements Hint */}
                                    {status === 'NEXT' && (
                                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 font-medium">
                                            Target: {rankDef.targetCC > 0 ? `${rankDef.targetCC} CC` : 'Leadership Requirements'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CustomModal>
        );
      }

      if (activeModal === 'MOMENTUM') {
        const momentumData = [
            { name: 'Month 1', value: 2.0 },
            { name: 'Month 2', value: 2.5 },
            { name: 'Month 3', value: 3.8 },
            { name: 'Month 4', value: 3.2 },
            { name: 'Month 5', value: 4.5 },
            { name: 'Current', value: monthlyCC },
        ];

        // Bonus Logic
        let unlockedBonus = 'None';
        if (currentRankDef.id !== 'NOVUS') unlockedBonus = 'Volume Bonus & Discount';
        
        let pendingBonus = 'None';
        if (nextRankDef) {
            if (nextRankDef.id === 'AS_SUP') pendingBonus = '30% Discount';
            else if (nextRankDef.id === 'SUP') pendingBonus = 'Volume Bonus (3%)';
            else if (nextRankDef.id === 'AS_MGR') pendingBonus = 'Volume Bonus (5%)';
            else if (nextRankDef.id === 'MGR') pendingBonus = 'Leadership Bonus';
        }

        const ringData = [
            { name: 'Completed', value: progressPercent, color: '#10b981' },
            { name: 'Remaining', value: 100 - progressPercent, color: '#e2e8f0' },
        ];

        return (
            <CustomModal
                isOpen={true}
                onClose={() => setActiveModal('NONE')}
                title="Business Momentum"
                icon={Zap}
            >
                <div className="space-y-6">
                    {/* Main Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-blue-100 font-bold text-xs uppercase tracking-wider mb-1">Estimated Earnings (This Month)</p>
                                    <h3 className="text-3xl md:text-4xl font-bold font-heading">GHS {monthlyEarnings.toLocaleString()}</h3>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                                    <TrendingUp size={14} /> +18%
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-blue-100">
                                    <span>Rank Progress (Effort)</span>
                                    <span>{progressPercent.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        {/* Decor */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    {/* Mini Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Gift size={40} className="text-emerald-500" /></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Bonus Unlocked</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm leading-tight">{unlockedBonus}</p>
                            {unlockedBonus !== 'None' && <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-2xl pointer-events-none animate-pulse"></div>}
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Hourglass size={40} className="text-slate-500" /></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pending Bonus</p>
                            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm leading-tight">{pendingBonus}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Unlocks at {nextRankDef?.name || 'Top Rank'}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Next Goal</p>
                                <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg leading-tight">{nextRankDef?.name || 'Diamond'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{remainingCC.toFixed(2)} CC Left</p>
                            </div>
                            <div className="w-12 h-12 relative">
                                {/* Progress Ring using PieChart */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ringData}
                                            innerRadius={16}
                                            outerRadius={22}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {ringData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {progressPercent}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graph Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500"/> Monthly Growth Trend (Activity)
                        </h4>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={momentumData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMomentum" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMomentum)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CustomModal>
        );
      }

      // DOWNLINE PERFORMANCE OVERVIEW
      if (activeModal === 'DOWNLINE') {
        const newRecruits = myDownline.filter(s => {
            const joinedDate = new Date(s.enrolledDate);
            const now = new Date();
            return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
        });

        // Filter users close to rank (e.g., needing <= 0.5 CC OR having >= 80% progress)
        const closeToRankUsers = myDownline.filter(s => {
            if (!s.rankProgress) return false;
            const target = s.rankProgress.targetCC;
            const current = s.rankProgress.currentCycleCC;
            if (target <= 0) return false; // No target (e.g., Manager structure req)
            
            const remaining = target - current;
            return remaining <= 0.5 && remaining > 0;
        }).map(s => {
            const target = s.rankProgress!.targetCC;
            const current = s.rankProgress!.currentCycleCC;
            const progress = (current / target) * 100;
            return { ...s, progress, remaining: target - current };
        }).sort((a, b) => b.progress - a.progress);

        return (
            <CustomModal
                isOpen={true}
                onClose={() => setActiveModal('NONE')}
                title="Downline Performance Overview"
                icon={Users}
            >
                <div className="space-y-8">
                    
                    {/* Smart Hint Banner */}
                    {closeToRankUsers.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-4 dark:bg-yellow-900/20 dark:border-yellow-900/50">
                            <div className="p-2 bg-yellow-100 rounded-full text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 shrink-0">
                                <Lightbulb size={20} fill="currentColor" className="opacity-80"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm dark:text-slate-200">Opportunity Alert</h4>
                                <p className="text-xs text-slate-600 mt-1 dark:text-slate-400 leading-relaxed">
                                    {closeToRankUsers.length} of your downlines are close to their next rank. A small push could promote them this week.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Downlines</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeDownlines.length}</h3>
                                <p className="text-[10px] text-slate-400 mt-1">With CC activity this month</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/20 dark:text-blue-400">
                                <Users size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Recruits</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{newRecruits.length}</h3>
                                <p className="text-[10px] text-slate-400 mt-1">Joined this month</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-900/20 dark:text-emerald-400">
                                <UserPlus size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Close to Rank</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{closeToRankUsers.length}</h3>
                                <p className="text-[10px] text-slate-400 mt-1">Need ≤ 0.5 CC</p>
                            </div>
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl dark:bg-orange-900/20 dark:text-orange-400">
                                <Target size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Who to Support Next */}
                    <div>
                        <SectionHeader title="Who to Support Next" />
                        <div className="space-y-3">
                            {closeToRankUsers.length > 0 ? closeToRankUsers.map(user => (
                                <div key={user.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 dark:bg-slate-800 dark:border-slate-700 relative">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300 shrink-0">
                                            {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover"/> : user.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</h4>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-slate-500 dark:text-slate-400">{user.caseCredits.toFixed(2)} CC</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-orange-500 font-medium">Needs {user.remaining.toFixed(2)} CC</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Visual) */}
                                    <div className="flex-1 md:max-w-[200px]">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                            <span>Progress</span>
                                            <span>{user.progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${user.progress}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setSupportMenuOpen(supportMenuOpen === user.id ? null : user.id)}
                                            className="w-full md:w-auto px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm"
                                        >
                                            Send Support <ChevronLeft className={`rotate-[-90deg] transition-transform ${supportMenuOpen === user.id ? 'rotate-[90deg]' : ''}`} size={12} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {supportMenuOpen === user.id && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden dark:bg-slate-800 dark:border-slate-700 animate-fade-in">
                                                <button onClick={() => navigate('/broadcasts')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-2 dark:text-slate-300 dark:hover:bg-slate-700">
                                                    <Megaphone size={14} /> Send Broadcast
                                                </button>
                                                <button onClick={() => navigate('/chat')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-2 dark:text-slate-300 dark:hover:bg-slate-700">
                                                    <MessageCircle size={14} /> Send Message
                                                </button>
                                                <button onClick={() => navigate('/assignments')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-2 dark:text-slate-300 dark:hover:bg-slate-700">
                                                    <BookOpen size={14} /> Assign Course
                                                </button>
                                                <button onClick={() => navigate('/chat')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-2 dark:text-slate-300 dark:hover:bg-slate-700">
                                                    <Flag size={14} /> Suggest Goal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/30">
                                    <p className="text-slate-400 text-sm">Everyone is currently far from their next rank.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </CustomModal>
        );
      }

      // Logic for Overview Data (Updated for Enhanced UI)
      const qualificationMonths = currentRankDef.monthsAllowed || 2;
      const start = new Date(rankProgress.cycleStartDate);
      const now = new Date();
      // Calculate month difference (1-based index)
      const monthsPassed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
      const currentMonthIndex = Math.min(monthsPassed, qualificationMonths);
      
      const currentCC = rankProgress.currentCycleCC;
      const target = rankProgress.targetCC;
      const pct = target > 0 ? Math.min(100, (currentCC / target) * 100) : 0;

      // New: Logic for Colors, Message, and Graph
      const progressColor = pct < 30 ? 'bg-red-500' : pct < 70 ? 'bg-orange-500' : 'bg-emerald-500';
      const progressBg = pct < 30 ? 'bg-red-100' : pct < 70 ? 'bg-orange-100' : 'bg-emerald-100';
      
      let microMessage = '';
      if (pct >= 100) microMessage = "🎉 You've hit the target! Maintenance phase.";
      else if (target > 0) microMessage = `🔥 Just ${(target - currentCC).toFixed(2)} CC to reach ${nextRankDef?.name || 'Next Rank'}!`;
      else microMessage = "Keep building your team structure!";

      // Mock Weekly Trend Data (Last 4 Weeks)
      const weeklyTrend = [
          { name: 'Week 1', cc: Math.max(0, currentCC * 0.1) },
          { name: 'Week 2', cc: Math.max(0, currentCC * 0.2) },
          { name: 'Week 3', cc: Math.max(0, currentCC * 0.3) },
          { name: 'Week 4', cc: Math.max(0, currentCC * 0.4) }, // Current
      ];

      return (
          <CustomModal 
            isOpen={activeModal === 'OVERVIEW'} 
            onClose={() => setActiveModal('NONE')} 
            title="Business Overview"
            icon={Activity}
          >
              <div className="space-y-8">
                  {/* 1 & 2: Rank Badge & Time */}
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Current Rank</p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 shadow-sm">
                              <Award size={18} className="text-amber-500" />
                              <span className="font-bold text-slate-800 dark:text-white">{currentRankDef.name}</span>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Qualification Period</p>
                          <div className="flex items-center justify-end gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                              <Clock size={16} className="text-blue-500"/>
                              <span className="font-bold text-sm">Month {currentMonthIndex} of {qualificationMonths}</span>
                          </div>
                      </div>
                  </div>

                  {/* 3 & 4: CC Progress & Bar */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Cycle Progress</p>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                                    {currentCC.toFixed(2)} <span className="text-lg text-slate-400 font-medium ml-1">/ {target} CC</span>
                                </h2>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-bold ${pct > 70 ? 'text-emerald-500' : pct > 30 ? 'text-orange-500' : 'text-red-500'}`}>{pct.toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className={`w-full h-4 rounded-full overflow-hidden ${pct > 70 ? 'bg-emerald-100 dark:bg-emerald-900/30' : pct > 30 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-red-100 dark:bg-red-900/30'} mb-5`}>
                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor} shadow-lg`} style={{width: `${pct}%`}}></div>
                        </div>

                        {/* 5: microMessage */}
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <span className="text-xl">🚀</span>
                            <span>{microMessage}</span>
                        </div>
                      </div>
                      
                      {/* Decorative Background Blob */}
                      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${pct > 70 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                  </div>

                  {/* 6: Trend Graph */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                       <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                          <TrendingUp size={18} className="text-blue-500"/> Activity Trend (Last 4 Weeks)
                       </h3>
                       <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: '#fff' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="cc" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeekly)" />
                                </AreaChart>
                            </ResponsiveContainer>
                       </div>
                  </div>
              </div>
          </CustomModal>
      );
  };

  // --- DRAWER COMPONENT: BUSINESS OVERVIEW ---
  const renderBusinessDrawer = () => {
      return (
          <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isBusinessDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsBusinessDrawerOpen(false)} 
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                      >
                          <ChevronLeft size={28} className="text-slate-900 dark:text-white" strokeWidth={3} />
                      </button>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading">My Business</h1>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-20">
                  
                  <SectionHeader title="Sections" />

                  {/* Consolidated Card Wrapper */}
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          
                          <ShortcutItem 
                              title="Overview" 
                              desc="Business Summary" 
                              icon={Activity} 
                              onClick={() => setActiveModal('OVERVIEW')}
                          />
                          
                          <ShortcutItem 
                              title="CC Breakdown" 
                              desc="Personal vs Team" 
                              icon={PieChartIcon} 
                              onClick={() => setActiveModal('BREAKDOWN')}
                          />
                          
                          <ShortcutItem 
                              title="Rank Journey" 
                              desc="Path to Diamond" 
                              icon={TrendingUp} 
                              onClick={() => setActiveModal('RANK_JOURNEY')}
                          />
                          
                          <ShortcutItem 
                              title="Business Momentum" 
                              desc="Financial Snapshot" 
                              icon={Zap} 
                              onClick={() => setActiveModal('MOMENTUM')}
                          />
                          
                          <ShortcutItem 
                              title="Downline" 
                              desc="Team Performance" 
                              icon={Users} 
                              onClick={() => setActiveModal('DOWNLINE')}
                          />
                          
                          <ShortcutItem 
                              title="Smart Coaching" 
                              desc="Next Best Actions" 
                              icon={Sparkles} 
                              onClick={() => setActiveModal('SUGGESTIONS')}
                          />

                      </div>
                  </div>

              </div>
          </div>
      );
  };

  // --- DRAWER COMPONENT: SALES PAGES ---
  const renderSalesDrawer = () => {
      return (
          <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isSalesDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsSalesDrawerOpen(false)} 
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                      >
                          <ChevronLeft size={28} className="text-slate-900 dark:text-white" strokeWidth={3} />
                      </button>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Sales & Marketing</h1>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-20">
                  
                  <SectionHeader title="Tools" />

                  {/* Consolidated Card Wrapper */}
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          
                          <ShortcutItem 
                              title="My Sales Pages" 
                              desc="Manage Landing Pages" 
                              icon={LayoutTemplate} 
                              onClick={() => setActiveModal('MY_PAGES')}
                          />
                          
                          <ShortcutItem 
                              title="Create Page" 
                              desc="New Funnel" 
                              icon={PlusCircle} 
                              onClick={() => setActiveModal('CREATE_PAGE')}
                          />
                          
                          <ShortcutItem 
                              title="Leads" 
                              desc="WhatsApp Chats" 
                              icon={MessageCircle} 
                              onClick={() => setActiveModal('LEADS')}
                          />
                          
                          <ShortcutItem 
                              title="Orders" 
                              desc="Track Sales" 
                              icon={ShoppingCart} 
                              onClick={() => setActiveModal('ORDERS')}
                          />
                          
                          <ShortcutItem 
                              title="Payments" 
                              desc="Payout Setup" 
                              icon={CreditCard} 
                              onClick={() => setActiveModal('PAYMENTS')}
                          />
                          
                          <ShortcutItem 
                              title="Analytics" 
                              desc="Performance" 
                              icon={BarChart2} 
                              onClick={() => setActiveModal('SALES_ANALYTICS')}
                          />

                      </div>
                  </div>

              </div>
          </div>
      );
  };

  // --- DRAWER COMPONENT: TRAINING HUB ---
  const renderTrainingDrawer = () => {
    return (
        <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isTrainingDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsTrainingDrawerOpen(false)} 
                      className="p-2 -ml-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={28} className="text-slate-900 dark:text-white" strokeWidth={3} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Training Hub</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 pb-20">
                
                <SectionHeader title="Learning & Development" />

                {/* Consolidated Card Wrapper */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        
                        <ShortcutItem 
                            title="My Classroom" 
                            desc="Ongoing Courses" 
                            icon={BookOpen} 
                            onClick={() => setActiveModal('MY_CLASSROOM')}
                        />
                        
                        <ShortcutItem 
                            title="Global Library" 
                            desc="Fundamental Courses" 
                            icon={Globe} 
                            onClick={() => setActiveModal('GLOBAL_LIBRARY')}
                        />
                        
                        <ShortcutItem 
                            title="Team Training" 
                            desc="Leader Strategies" 
                            icon={Users} 
                            onClick={() => setActiveModal('TEAM_TRAINING')}
                        />
                        
                        <ShortcutItem 
                            title="Assignments" 
                            desc="Tasks & Challenges" 
                            icon={ClipboardCheck} 
                            onClick={() => setActiveModal('ASSIGNMENTS')}
                        />
                        
                        <ShortcutItem 
                            title="Live Sessions" 
                            desc="Replays & Upcoming" 
                            icon={Video} 
                            onClick={() => setActiveModal('LIVE_SESSIONS')}
                        />
                        
                        <ShortcutItem 
                            title="Knowledge Feed" 
                            desc="Quick Learning" 
                            icon={Zap} 
                            onClick={() => setActiveModal('KNOWLEDGE_FEED')}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
  };

  // --- VIEW: GOAL MONITORING (Desktop Sub-page) ---
  if (viewMode === 'GOALS') {
      const performanceData = [
        { name: 'Jan', cc: 2.4 }, { name: 'Feb', cc: 3.1 }, { name: 'Mar', cc: 4.5 },
        { name: 'Apr', cc: 3.8 }, { name: 'May', cc: 5.2 }, { name: 'Jun', cc: 6.0 },
      ];

      return (
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in space-y-6 md:space-y-8">
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
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
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
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
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
    <div className="h-full overflow-y-auto no-scrollbar animate-fade-in relative">
        
        {/* Full Screen Drawers */}
        {renderBusinessDrawer()}
        {renderSalesDrawer()}
        {renderTrainingDrawer()}

        {/* Custom Modal Layer */}
        {renderModals()}

        {/* ======================= */}
        {/*    MOBILE VIEW (Classic) */}
        {/* ======================= */}
        <div className="md:hidden p-4 space-y-6 pb-32">
            {/* 1. Welcome Section - Redesigned */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[1.5rem] p-6 flex items-center gap-5 shadow-sm relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Glass Container with Waving Hand */}
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl shadow-lg flex items-center justify-center shrink-0 z-10">
                    <Hand size={32} className="text-white animate-wave" strokeWidth={3} />
                </div>

                {/* Text & Underline */}
                <div className="z-10">
                    <h1 className="text-2xl font-bold text-white font-heading tracking-tight">
                        Hello, {currentUser.name.split(' ')[0]}
                    </h1>
                    {/* Custom Underline */}
                    <div className="h-1 w-8 bg-emerald-500 mt-2 rounded-full"></div>
                </div>
            </div>

            {/* 2. Stats Carousel (Horizontal Slider of Desktop Cards) */}
            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                
                {/* Card 1: Rank Progress */}
                <div className="min-w-[85vw] snap-center">
                    <InfoCard title="Rank Progress" icon={Award} bgIcon={Trophy} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" className="h-48 justify-between">
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
                    <InfoCard title="Team Snapshot" icon={Users} bgIcon={Network} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" className="h-48 justify-between">
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
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-3 border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700 w-full overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold dark:bg-blue-900/50 dark:text-blue-200 shrink-0">
                                    {topPerformer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate dark:text-white">{topPerformer.name}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold dark:text-emerald-400 truncate">Top Performer ({topPerformer.caseCredits.toFixed(1)} CC)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-slate-400 italic text-center py-1">No activity yet</div>
                        )}
                    </InfoCard>
                </div>

                {/* Card 3: Earnings & Rewards */}
                <div className="min-w-[85vw] snap-center">
                    {/* Fix: MoneyBagIcon to DollarSign */}
                    <InfoCard title="Earnings & Rewards" icon={DollarSign} bgIcon={Wallet} iconStyle="OUTLINE" colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" className="h-48 justify-between">
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
                    {/* Fix: AutoStoriesIcon to BookOpen */}
                    <InfoCard title="Learning Status" icon={BookOpen} bgIcon={Book} iconStyle="OUTLINE" colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" className="h-48 justify-between">
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
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    {/* Ghost Icon for Shortcuts Mobile */}
                    <div className="absolute -right-6 bottom-0 opacity-[0.03] pointer-events-none rotate-12">
                        <Rocket size={180} strokeWidth={1} className="text-slate-900 dark:text-white" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-6 relative z-10">
                        <ShortcutItem 
                            title="My Business" 
                            desc="Track CC"
                            icon={TrendingUp} 
                            onClick={() => setIsBusinessDrawerOpen(true)}
                        />
                        <ShortcutItem 
                            title="Sales Pages" 
                            desc="Get Leads"
                            icon={ShoppingCart} 
                            onClick={() => setIsSalesDrawerOpen(true)}
                        />
                        <ShortcutItem 
                            title="Training Hub" 
                            desc="Learn Skills"
                            icon={GraduationCap} 
                            onClick={() => setIsTrainingDrawerOpen(true)} 
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
        <div className="hidden md:block max-w-[1600px] mx-auto p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
                
                {/* LEFT COLUMN: Summary Stack */}
                <div className="lg:col-span-1 space-y-4">
                    
                    {/* 1. Rank Card (Height approx 200px) */}
                    <InfoCard title="Rank Progress" icon={Award} bgIcon={Trophy} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" className="h-44 lg:h-48 justify-between">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white font-heading">{currentRankDef.name}</span>
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
                    <InfoCard title="Team Snapshot" icon={Users} bgIcon={Network} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" className="h-40 lg:h-44 justify-between">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <span className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white font-heading">{activeDownlines.length}</span>
                                <span className="text-[9px] lg:text-[10px] text-slate-400 block uppercase font-bold">Active Downlines</span>
                            </div>
                            <div className="text-right">
                                <span className="text-base lg:text-lg font-bold text-blue-600 dark:text-blue-400">{teamCC.toFixed(1)}</span>
                                <span className="text-[9px] lg:text-[10px] text-slate-400 block uppercase font-bold">Team CC</span>
                            </div>
                        </div>
                        {topPerformer ? (
                            <div className="bg-slate-50 p-1.5 lg:p-2 rounded-lg flex items-center gap-2 lg:gap-3 border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700 w-full overflow-hidden min-w-0">
                                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold dark:bg-blue-900/50 dark:text-blue-200 shrink-0">
                                    {topPerformer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate dark:text-white">{topPerformer.name}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold dark:text-emerald-400 truncate">Top: {topPerformer.caseCredits.toFixed(1)} CC</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[10px] text-slate-400 italic text-center py-1">No activity yet</div>
                        )}
                    </InfoCard>

                    {/* 3. Earnings & Rewards (Updated Icon Style) */}
                    {/* Fix: MoneyBagIcon to DollarSign */}
                    <InfoCard title="Earnings & Rewards" icon={DollarSign} bgIcon={Wallet} iconStyle="OUTLINE" colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" className="h-40 lg:h-44 justify-between">
                        <div className="mb-2 lg:mb-3">
                            <span className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white font-heading">${monthlyEarnings.toLocaleString()}</span>
                            <p className="text-[9px] lg:text-[10px] text-slate-400 uppercase font-bold mt-0.5">Est. Earnings</p>
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Active Bonus</span>
                                <span className={`font-bold ${monthlyCC >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {monthlyCC >= 4 ? 'Achieved' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Global Rally</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 lg:w-16 bg-slate-200 h-1.5 rounded-full dark:bg-slate-700">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">15%</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>

                    {/* 4. Learning & Activity (Updated Icon Style) */}
                    {/* Fix: AutoStoriesIcon to BookOpen */}
                    <InfoCard title="Learning Status" icon={BookOpen} bgIcon={Book} iconStyle="OUTLINE" colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" className="h-40 lg:h-44 justify-between">
                        <div className="grid grid-cols-3 gap-2 mb-2 lg:mb-3 text-center">
                            <div className="bg-purple-50 rounded-lg p-1.5 lg:p-2 dark:bg-purple-900/10">
                                <span className="block text-base lg:text-lg font-bold text-purple-700 dark:text-purple-300">{inProgressCourses}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Active</span>
                            </div>
                            <div className="bg-green-50 rounded-lg p-1.5 lg:p-2 dark:bg-green-900/10">
                                <span className="block text-base lg:text-lg font-bold text-green-700 dark:text-green-300">{completedCoursesCount}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase dark:text-slate-400">Done</span>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-1.5 lg:p-2 dark:bg-orange-900/10">
                                <span className="block text-base lg:text-lg font-bold text-orange-700 dark:text-orange-300">{myPendingAssignments}</span>
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
                    <div className="h-28 lg:h-32 relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-[1.25rem] px-6 lg:px-8 flex items-center justify-between overflow-hidden shadow-sm">
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
                        <div className="absolute top-4 lg:top-6 right-6 text-slate-400 text-xs lg:text-sm font-medium tracking-wide">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>

                        {/* Left Group */}
                        <div className="flex items-center gap-4 lg:gap-6 z-10">
                            
                            {/* Glass Container with Waving Hand */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 lg:p-3 rounded-2xl shadow-lg flex items-center justify-center">
                                {/* Using Lucide Hand Icon instead of Font for consistency and reliability */}
                                <Hand size={28} className="text-white animate-wave" strokeWidth={3} />
                            </div>

                            {/* Welcome Text */}
                            <div>
                                <h1 className="text-xl lg:text-3xl font-bold text-white font-heading tracking-tight drop-shadow-md">
                                    Welcome, {currentUser.name.split(' ')[0]}
                                </h1>
                            </div>
                        </div>

                        {/* Right Green Icon (Trophy) - Updated to Medal (Lucide) */}
                        <div className="relative z-10 hidden md:flex items-center justify-center mr-4 lg:mr-8 self-end mb-3">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl rotate-3 flex items-center justify-center shadow-2xl shadow-emerald-900/50 border-4 border-white/10">
                                <Medal size={32} className="text-white" strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    {/* B. Shortcuts Grid (Increased Height - matches 3 side cards height) */}
                    <div className="relative">
                        <SectionHeader title="Shortcuts" />
                        
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700 h-[30rem] lg:h-[35rem] flex flex-col justify-center relative overflow-hidden">
                            
                            {/* Massive Ghost Rocket Icon for Shortcuts Container */}
                            <div className="absolute -right-20 -bottom-20 opacity-[0.02] dark:opacity-[0.03] pointer-events-none rotate-[45deg]">
                                <Rocket size={450} strokeWidth={1} className="text-slate-900 dark:text-white" />
                            </div>

                            <div className="grid grid-cols-3 grid-rows-2 gap-4 lg:gap-6 h-full relative z-10">
                                
                                <ShortcutItem 
                                    title="My Business" 
                                    desc="Track volume & growth"
                                    icon={TrendingUp}
                                    onClick={() => setIsBusinessDrawerOpen(true)}
                                />

                                <ShortcutItem 
                                    title="Sales Pages" 
                                    desc="Create funnels & leads"
                                    icon={ShoppingCart}
                                    onClick={() => setIsSalesDrawerOpen(true)}
                                />

                                <ShortcutItem 
                                    title="Training Hub" 
                                    desc="Learn skills & products"
                                    icon={GraduationCap}
                                    onClick={() => setIsTrainingDrawerOpen(true)}
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
