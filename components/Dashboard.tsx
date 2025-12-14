
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Student, UserRole, Course, CourseTrack, CourseStatus, MentorshipTemplate, Broadcast, AppNotification, Assignment } from '../types';
import { 
    Users, TrendingUp, Calendar, ArrowUpRight, Award, 
    BookOpen, DollarSign, CircleDollarSign, Target, MessageSquare, PlusCircle, 
    BarChart2, Zap, ArrowRight, Layout, ArrowLeft, Clock, Globe, UserPlus, Shield,
    ShoppingCart, GraduationCap, Bell, Flag, Store, Lock, CheckCircle, X, PieChart as PieChartIcon, Activity, Lightbulb, ChevronLeft, HelpCircle, Hand, Medal, Gift, Hourglass, Megaphone, MessageCircle, Sparkles, Rocket, UserCheck, LayoutTemplate, CreditCard, Phone, MousePointerClick, Smartphone, Eye
} from 'lucide-react';
import { RANKS, RANK_ORDER } from '../constants';

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
                <div className="px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 z-10">
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

// A. Left Column Card (Compact & Responsive)
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
    <div className={`bg-white dark:bg-slate-800 rounded-[1.25rem] p-4 lg:p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-3 mb-0 shrink-0">
            <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                {iconStyle === 'FILLED' ? (
                    <Icon size={16} strokeWidth={3} fill="currentColor" className="opacity-90 lg:w-[18px] lg:h-[18px]" />
                ) : (
                    <Icon size={18} strokeWidth={3} className="opacity-90 lg:w-[20px] lg:h-[20px]" />
                )}
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-[10px] lg:text-xs uppercase tracking-wide truncate">{title}</h3>
        </div>
        <div className="pl-1 w-full flex-1 flex flex-col justify-center">
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
                ${disabled ? 'text-slate-300' : 'text-slate-600 group-hover:text-slate-800 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white'}
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
  const [isSalesDrawerOpen, setIsSalesDrawerOpen] = useState(false); // NEW: Sales Drawer

  // Combined Modal States
  const [activeModal, setActiveModal] = useState<
    'NONE' | 
    // Business Section
    'OVERVIEW' | 'BREAKDOWN' | 'RANK_JOURNEY' | 'MOMENTUM' | 'DOWNLINE' | 'SUGGESTIONS' |
    // Sales Section
    'MY_PAGES' | 'CREATE_PAGE' | 'LEADS' | 'ORDERS' | 'PAYMENTS' | 'SALES_ANALYTICS'
  >('NONE');
  
  const [supportMenuOpen, setSupportMenuOpen] = useState<string | null>(null); // Stores ID of user whose menu is open
  
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

  // --- RENDER MODALS ---
  const renderModals = () => {
      // ----------------------------
      // SALES MODALS
      // ----------------------------
      
      if (activeModal === 'MY_PAGES') {
          return (
              <CustomModal
                  isOpen={true}
                  onClose={() => setActiveModal('NONE')}
                  title="My Sales Pages"
                  icon={LayoutTemplate}
              >
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-500">Manage your active landing pages.</p>
                          <button onClick={() => navigate('/sales-builder')} className="text-xs bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold">Create New</button>
                      </div>
                      
                      <div className="grid gap-4">
                          {[1, 2].map(i => (
                              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center dark:bg-slate-800 dark:border-slate-700">
                                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 dark:bg-slate-700">
                                      <Rocket size={24} className="text-slate-400" />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                          <h4 className="font-bold text-slate-800 dark:text-white">Clean 9 Detox Offer</h4>
                                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Published</span>
                                      </div>
                                      <p className="text-xs text-slate-500 mt-1">fbo.com/p/c9-detox-{currentUser.handle.replace('@','')}</p>
                                      <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400">
                                          <span className="flex items-center gap-1"><Eye size={12}/> 124 Views</span>
                                          <span className="flex items-center gap-1"><MousePointerClick size={12}/> 18 Clicks</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-2 w-full md:w-auto">
                                      <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Edit</button>
                                      <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Share</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
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
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                              <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center font-bold text-xs">MTN</div>
                              <div className="flex-1">
                                  <p className="font-bold text-sm text-slate-800 dark:text-white">Mobile Money</p>
                                  <p className="text-xs text-slate-500">Ending in **89</p>
                              </div>
                              <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Active</span>
                          </div>
                      </div>

                      <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 dark:border-slate-600 dark:hover:border-emerald-400">
                          <PlusCircle size={16} /> Add Bank Account
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
                                        <TrophyIcon className="w-5 h-5"/>
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
                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col gap-4 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <TrendingUp size={20}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Increase Your CC Faster</h3>
                                    <p className="text-sm opacity-90 leading-relaxed">
                                        Create a sales page to attract more customers automatically.
                                    </p>
                                    <p className="text-xs text-emerald-700/80 mt-2 font-medium dark:text-emerald-300/80">FBOs with sales pages grow 2x faster.</p>
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
        // 1. Calculate Personal CC based on Cycle Start Date
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

                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col justify-between dark:bg-amber-900/10 dark:border-amber-800">
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
                                            {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover"/> : user.name.charAt(0)}
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

                        {/* 5: Micro Message */}
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
          <div className={`fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isSalesDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              
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
                            onClick={() => setIsBusinessDrawerOpen(true)}
                        />
                        <ShortcutItem 
                            title="Sales Pages" 
                            desc="Get Leads"
                            icon={ShoppingCart} 
                            onClick={() => setIsSalesDrawerOpen(true)}
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
        <div className="hidden md:block max-w-[1600px] mx-auto p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
                
                {/* LEFT COLUMN: Summary Stack */}
                <div className="lg:col-span-1 space-y-4">
                    
                    {/* 1. Rank Card (Height approx 200px) */}
                    <InfoCard title="Rank Progress" icon={Award} colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" className="h-44 lg:h-48 justify-between">
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
                    <InfoCard title="Team Snapshot" icon={Users} colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" className="h-40 lg:h-44 justify-between">
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
                    <InfoCard title="Earnings & Rewards" icon={MoneyBagIcon} iconStyle="OUTLINE" colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" className="h-40 lg:h-44 justify-between">
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
                    <InfoCard title="Learning Status" icon={AutoStoriesIcon} iconStyle="OUTLINE" colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" className="h-40 lg:h-44 justify-between">
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
                    <div>
                        <SectionHeader title="Shortcuts" />
                        
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700 h-[30rem] lg:h-[35rem] flex flex-col justify-center">
                            <div className="grid grid-cols-3 grid-rows-2 gap-4 lg:gap-6 h-full">
                                
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
