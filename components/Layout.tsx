
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole, Course, AppNotification } from '../types';
import { LogOut, Settings, Moon, Sun, ChevronDown, Award, Bell } from 'lucide-react';
import { RANKS } from '../constants';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: Student;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  courses: Course[];
  notifications: AppNotification[];
}

// Icons
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function GlobeEducationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function UserGroupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function ChatBubbleOvalLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function CurrencyDollarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClipboardDocumentListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function RocketLaunchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function GlobeAltIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, theme, onToggleTheme, courses, notifications }) => {
  const location = useLocation();
  const [isSalesMenuOpen, setIsSalesMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  
  // Navbar Auto-hide State
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for Click Outside Logic
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // Mobile Dock State
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  // Mobile Header Visibility State (for Chat view double-tap)
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const lastTapRef = useRef(0);

  const isActive = (path: string) => location.pathname === path;
  const isDashboard = location.pathname === '/dashboard';
  const isChatPage = location.pathname === '/chat';

  // Determine current Rank Name for Display
  const currentRankName = currentUser.rankProgress ? RANKS[currentUser.rankProgress.currentRankId]?.name : 'FBO';

  // Check if we are in a builder mode (full screen tools)
  const isBuilder = location.pathname.startsWith('/sales-builder') || location.pathname.startsWith('/builder');

  // Auto-expand sales menu if a child is active
  useEffect(() => {
    if (location.pathname.startsWith('/sales')) {
      setIsSalesMenuOpen(true);
    }
  }, [location.pathname]);

  // Handle Double Tap on Mobile to toggle header
  useEffect(() => {
    const handleTouchEnd = (e: TouchEvent) => {
        // Only active on small screens
        if (window.innerWidth >= 1024) return;

        const now = Date.now();
        if (now - lastTapRef.current < 300) {
            // Double tap detected
            e.preventDefault();
            setShowMobileHeader(prev => !prev);
        }
        lastTapRef.current = now;
    };

    // Attach to document to catch double taps anywhere on mobile
    document.addEventListener('touchend', handleTouchEnd);
    return () => document.removeEventListener('touchend', handleTouchEnd);
  }, []);

  // Ensure header shows when leaving chat or resizing
  useEffect(() => {
      if (!isChatPage) {
          setShowMobileHeader(true);
      }
  }, [isChatPage]);

  // Click outside handler for Profile Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen && 
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  // Navbar auto-hide logic: Only apply for builder pages now. Standard pages get static header.
  const shouldHeaderBeStatic = isDashboard || !isBuilder;

  useEffect(() => {
    if (!shouldHeaderBeStatic && isNavbarOpen) {
      const hideNav = () => setIsNavbarOpen(false);
      const resetTimer = () => {
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        navTimerRef.current = setTimeout(hideNav, 3000); // 3 seconds inactivity
      };

      // Initial start
      resetTimer();

      const navEl = navbarRef.current;
      if (navEl) {
        navEl.addEventListener('mousemove', resetTimer);
        navEl.addEventListener('click', resetTimer);
        navEl.addEventListener('keydown', resetTimer);
        navEl.addEventListener('mouseenter', resetTimer);
      }

      return () => {
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        if (navEl) {
          navEl.removeEventListener('mousemove', resetTimer);
          navEl.removeEventListener('click', resetTimer);
          navEl.removeEventListener('keydown', resetTimer);
          navEl.removeEventListener('mouseenter', resetTimer);
        }
      };
    } else if (shouldHeaderBeStatic) {
        // Always open if static
        setIsNavbarOpen(true);
    } else {
        // Default close for builders
        setIsNavbarOpen(false);
    }
  }, [isNavbarOpen, shouldHeaderBeStatic]);

  // Click outside logic to close floating navbar immediately (overrides 3s timer)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only attach if in floating mode and navbar is currently open
      if (!shouldHeaderBeStatic && isNavbarOpen && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavbarOpen, shouldHeaderBeStatic]);

  // Click outside to collapse dock
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setIsDockExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role Checks
  const isStudent = currentUser.role === UserRole.STUDENT;
  const isAdminOrSuper = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  // Allow Sponsors to access builder too
  const canBuildCourses = isAdminOrSuper || currentUser.role === UserRole.SPONSOR;
  
  // Logic for showing Team Training: If user has a sponsor OR is a sponsor/admin themselves
  const hasTeamAccess = currentUser.sponsorId || currentUser.role !== UserRole.STUDENT;

  // Modernized Header Classes
  // "Floating Island" Style: dark transparent with rounded corners and margins.
  const headerClass = shouldHeaderBeStatic
    ? "hidden lg:flex h-16 items-center justify-between px-6 z-30 shrink-0 mx-6 mt-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg sticky top-4 transition-all duration-300"
    : `hidden lg:flex h-16 items-center justify-between px-6 z-40 mx-6 mt-4 rounded-2xl absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${isNavbarOpen ? 'translate-y-0' : '-translate-y-[200%]'}`;

  // Breadcrumb Generation
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    // 1. Classroom Route (Deepest Level)
    const classroomMatch = path.match(/^\/classroom\/([^/]+)\/([^/]+)\/([^/]+)/);
    if (classroomMatch) {
        const [_, cId, mId, lId] = classroomMatch;
        const course = courses.find(c => c.id === cId);
        const module = course?.modules.find(m => m.id === mId);
        const chapter = module?.chapters.find(c => c.id === lId);
        
        return (
            <div className="flex items-center gap-2 text-sm text-slate-300">
                <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
                <span className="text-slate-500">/</span>
                <Link to="/training/global" className="hover:text-white transition-colors">Training</Link>
                <span className="text-slate-500">/</span>
                <Link to={`/training/course/${cId}`} className="hover:text-white transition-colors truncate max-w-[150px]" title={course?.title}>{course?.title || 'Course'}</Link>
                <span className="text-slate-500">/</span>
                <span className="truncate max-w-[150px] hidden sm:inline text-slate-400" title={module?.title}>{module?.title}</span>
                <span className="text-slate-500 hidden sm:inline">/</span>
                <span className="font-semibold text-white truncate max-w-[200px]" title={chapter?.title}>{chapter?.title || 'Lesson'}</span>
            </div>
        );
    }

    // 2. Course Overview Route
    const courseMatch = path.match(/^\/training\/course\/([^/]+)/);
    if (courseMatch) {
        const [_, cId] = courseMatch;
        const course = courses.find(c => c.id === cId);
        return (
            <div className="flex items-center gap-2 text-sm text-slate-300">
                <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
                <span className="text-slate-500">/</span>
                <Link to="/training/global" className="hover:text-white transition-colors">Training</Link>
                <span className="text-slate-500">/</span>
                <span className="font-semibold text-white truncate max-w-[250px]">{course?.title || 'Course Overview'}</span>
            </div>
        );
    }

    // 3. Fallback Map
    const BREADCRUMB_MAP: Record<string, string[]> = {
      '/sales-builder': ['Sales', 'Sales Pages'],
      '/sales': ['Sales', 'Sales Log'],
      '/chat': ['Communication', 'Team Chat'],
      '/courses': ['Training', 'My Classroom'],
      '/training/global': ['Training', 'Global Library'],
      '/training/team': ['Training', 'Team Portal'],
      '/community': ['Community', 'Global Hub'],
      '/students': ['Team', 'Members'],
      '/builder': ['Admin', 'Course Builder'],
    };

    if (BREADCRUMB_MAP[location.pathname]) {
       return (
         <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
            {BREADCRUMB_MAP[location.pathname].map((item, idx) => (
                <React.Fragment key={idx}>
                    <span className="text-slate-500">/</span>
                    <span className={idx === BREADCRUMB_MAP[location.pathname].length - 1 ? "font-semibold text-white" : ""}>
                        {item}
                    </span>
                </React.Fragment>
            ))}
         </div>
       );
    }

    // Fallback to URL segments
    const pathSegments = location.pathname.split('/').filter(p => p);
    return (
        <div className="flex items-center gap-2 text-sm text-slate-300 capitalize">
            <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
            {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const displayName = (segment.length > 8 && /\d/.test(segment)) ? 'Details' : segment.replace(/-/g, ' ');
                const to = `/${pathSegments.slice(0, index + 1).join('/')}`;

                return (
                    <React.Fragment key={to}>
                        <span className="text-slate-500">/</span>
                        {isLast ? (
                            <span className="font-semibold text-white">{displayName}</span>
                        ) : (
                            <Link to={to} className="hover:text-white transition-colors">{displayName}</Link>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Build Mobile Nav Items
  interface NavItemConfig {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
  }

  const navItems: NavItemConfig[] = [
    { to: '/dashboard', icon: <HomeIcon />, label: 'Home', active: isActive('/dashboard') },
    { to: '/chat', icon: <ChatBubbleOvalLeftIcon />, label: 'Chat', active: isActive('/chat') },
    { to: '/courses', icon: <BookOpenIcon />, label: 'Classroom', active: isActive('/courses') },
    { to: '/training/global', icon: <GlobeEducationIcon />, label: 'Global', active: isActive('/training/global') },
  ];

  if (hasTeamAccess) {
    navItems.push({ to: '/training/team', icon: <UserGroupIcon />, label: 'Team', active: isActive('/training/team') });
  }

  // Flattened Sales Menu for Mobile Dock
  navItems.push({ to: '/sales', icon: <CurrencyDollarIcon />, label: 'Sales Log', active: isActive('/sales') });
  navItems.push({ to: '/sales-builder', icon: <RocketLaunchIcon />, label: 'Pages', active: isActive('/sales-builder') });

  navItems.push({ to: '/community', icon: <GlobeAltIcon />, label: 'Community', active: isActive('/community') });

  if (!isStudent) {
    navItems.push({ to: '/students', icon: <UsersIcon />, label: isAdminOrSuper ? 'Students' : 'My Team', active: isActive('/students') });
  }

  if (canBuildCourses) {
    navItems.push({ to: '/builder', icon: <SparklesIcon />, label: 'Builder', active: isActive('/builder') });
  }

  // Use dynamic viewport height for mobile
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 supports-[height:100dvh]:h-[100dvh]">
      <style>{`
        /* Global Scrollbar Hiding for Mobile-First Feel */
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Sidebar - Desktop Only */}
      <aside 
        className="hidden lg:flex w-64 bg-emerald-900 text-white flex-col shadow-xl dark:bg-emerald-950"
      >
        <div className="p-6 border-b border-emerald-800 flex justify-between items-center dark:border-emerald-900">
          <Logo className="w-8 h-8" textClassName="text-xl font-bold text-white" />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem 
            to="/dashboard" 
            icon={<HomeIcon />} 
            label="Dashboard" 
            active={isActive('/dashboard')} 
          />
          {/* ... (rest of sidebar items) ... */}
          <NavItem 
            to="/chat" 
            icon={<ChatBubbleOvalLeftIcon />} 
            label="Team Chat" 
            active={isActive('/chat')} 
          />
          
          <div className="my-2 border-t border-emerald-800 dark:border-emerald-900 mx-4 opacity-50"></div>
          
          <div className="px-4 py-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">Training</div>
          
          <NavItem 
            to="/courses" 
            icon={<BookOpenIcon />} 
            label="My Classroom" 
            active={isActive('/courses') || location.pathname.startsWith('/classroom')} 
          />
          
          <NavItem 
            to="/training/global" 
            icon={<GlobeEducationIcon />} 
            label="Global Training" 
            active={isActive('/training/global')} 
          />

          {hasTeamAccess && (
            <NavItem 
              to="/training/team" 
              icon={<UserGroupIcon />} 
              label="Team Training" 
              active={isActive('/training/team')} 
            />
          )}

          <div className="my-2 border-t border-emerald-800 dark:border-emerald-900 mx-4 opacity-50"></div>

          {/* Sales & CC Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsSalesMenuOpen(!isSalesMenuOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname.startsWith('/sales') 
                  ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 dark:bg-emerald-800' 
                  : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${location.pathname.startsWith('/sales') ? 'text-yellow-400' : 'text-emerald-400 group-hover:text-yellow-300'}`}>
                  <CurrencyDollarIcon />
                </span>
                <span className="font-medium">Sales & CC</span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isSalesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isSalesMenuOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-4 pl-3 border-l border-emerald-800/50 space-y-1">
                <NavItem 
                  to="/sales" 
                  icon={<ClipboardDocumentListIcon />} 
                  label="Sales Log" 
                  active={isActive('/sales')} 
                  className="py-2 text-sm"
                />
                <NavItem 
                  to="/sales-builder" 
                  icon={<RocketLaunchIcon />} 
                  label="Sales Pages" 
                  active={isActive('/sales-builder')} 
                  className="py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <NavItem 
            to="/community" 
            icon={<GlobeAltIcon />} 
            label="Community" 
            active={isActive('/community')} 
          />
          
          {/* Hide Students List from Students */}
          {!isStudent && (
             <NavItem 
               to="/students" 
               icon={<UsersIcon />} 
               label={isAdminOrSuper ? "All Students" : "My Team"} 
               active={isActive('/students')} 
             />
          )}
          
          {/* Admin & Sponsor Only */}
          {canBuildCourses && (
             <NavItem 
               to="/builder" 
               icon={<SparklesIcon />} 
               label="Course Builder" 
               active={isActive('/builder')} 
             />
          )}
        </nav>
      </aside>

      {/* Main Content - Adjusted for Builders */}
      <div className="flex-1 flex flex-col h-full overflow-hidden dark:bg-slate-950 relative">
        
        {/* Desktop Navbar */}
        <header ref={navbarRef} className={headerClass}>
            <div className="flex items-center gap-4 text-sm text-slate-300">
               {/* Show Breadcrumbs on non-dashboard pages, Rank on dashboard */}
               {isDashboard ? (
                   <div className="flex items-center gap-3 pl-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-900/10">
                            <Award size={20} className="text-yellow-400 drop-shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest leading-tight">Current Rank</span>
                            <span className="font-heading font-bold text-lg text-white leading-none tracking-wide text-shadow-sm">{currentRankName}</span>
                        </div>
                   </div>
               ) : (
                   getBreadcrumbs()
               )}
            </div>
            
            <div className="relative flex items-center gap-4">
               {/* Notification Bell */}
               <div className="relative">
                  <button 
                    onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white focus:outline-none"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNotificationMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20 animate-fade-in overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <Link 
                                key={notification.id}
                                to={notification.link}
                                onClick={() => setIsNotificationMenuOpen(false)}
                                className={`block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50 ${!notification.isRead ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                              >
                                <div className="flex gap-3 items-start">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {notification.avatarUrl ? (
                                      <img src={notification.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="font-bold text-slate-500 dark:text-slate-300 text-xs">
                                        {notification.title.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                      {notification.subtitle}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                      {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                                  )}
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">
                              No notifications
                            </div>
                          )}
                        </div>
                        <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                          <Link to="/chat" onClick={() => setIsNotificationMenuOpen(false)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                            View All Messages
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
               </div>

               {/* Updated Pill-Shaped Profile Button with Dark Styles */}
               <button 
                 ref={profileBtnRef}
                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                 className="group flex items-center gap-3 focus:outline-none pl-1 pr-4 py-1 rounded-full transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-sm"
               >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs overflow-hidden ring-2 ring-slate-800 shadow-sm">
                      {currentUser.avatarUrl ? (
                          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                          currentUser.name.charAt(0)
                      )}
                  </div>
                  
                  <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-slate-100 leading-tight">{currentUser.name}</p>
                      <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">{currentUser.role}</p>
                  </div>
                  
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''} group-hover:text-slate-200 ml-1`} />
               </button>

               {/* Profile Dropdown */}
               {isProfileMenuOpen && (
                  <div 
                    ref={profileMenuRef}
                    className="absolute right-0 top-12 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in dark:bg-slate-900/95 dark:border-slate-700"
                  >
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Signed in as</p>
                            <p className="text-xs text-slate-500 truncate dark:text-slate-400 mt-0.5">{currentUser.email}</p>
                        </div>
                        
                        <div className="py-2">
                            <div 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    onToggleTheme();
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors group dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <div className="flex items-center gap-3">
                                    {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                                    <span>Dark Mode</span>
                                </div>
                                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <Link 
                                to={`/students/${currentUser.id}`}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </Link>
                        </div>

                        <div className="border-t border-slate-100 pt-2 dark:border-slate-700">
                            <button 
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors dark:hover:bg-red-900/20"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
               )}
            </div>
        </header>

        {/* Trigger Button for Desktop Navbar (visible when hidden, mostly for builders) */}
        {!shouldHeaderBeStatic && !isNavbarOpen && (
             <button 
               onClick={() => setIsNavbarOpen(true)}
               className="hidden lg:flex absolute top-4 right-8 z-30 bg-slate-900/90 p-2.5 rounded-full shadow-lg border border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-110 backdrop-blur-sm"
               title="Show Menu"
             >
                <ChevronDownIcon />
             </button>
        )}

        {/* Mobile Header - With Auto-Hide Logic */}
        <header className={`lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10 shadow-sm dark:bg-slate-900 dark:border-slate-800 shrink-0 transition-transform duration-300 ease-in-out ${showMobileHeader ? 'translate-y-0' : '-translate-y-full absolute w-full'}`}>
           <Logo className="w-8 h-8" textClassName="text-xl font-bold text-emerald-900 dark:text-emerald-400" />
           <div className="flex items-center gap-4">
             {/* Mobile Bell */}
             <button 
                onClick={() => { setIsNotificationMenuOpen(!isNotificationMenuOpen); }}
                className="relative text-slate-600 dark:text-slate-300"
             >
               <Bell size={24} />
               {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-slate-900 shadow-sm">
                    {unreadCount}
                  </span>
               )}
             </button>
           </div>
        </header>
        
        {/* Mobile Notification Dropdown */}
        {isNotificationMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsNotificationMenuOpen(false)}>
                <div className="absolute top-16 right-4 left-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-[60vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                        <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                        <button onClick={() => setIsNotificationMenuOpen(false)}><XMarkIcon /></button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <Link 
                                key={notification.id}
                                to={notification.link}
                                onClick={() => setIsNotificationMenuOpen(false)}
                                className={`block px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 ${!notification.isRead ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                              >
                                <div className="flex gap-3 items-start">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {notification.avatarUrl ? (
                                      <img src={notification.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="font-bold text-slate-500 dark:text-slate-300 text-xs">
                                        {notification.title.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                      {notification.subtitle}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                      {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                                  )}
                                </div>
                              </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {isBuilder ? (
          // Full Screen Mode for Builders
          <main className="flex-1 overflow-hidden relative dark:bg-slate-950">
             {children}
          </main>
        ) : (
          // Standard Layout - Adjusted for Chat Portal specific requirement
          <main className={`flex-1 dark:bg-slate-950 transition-all ${isChatPage ? 'overflow-hidden p-0' : 'overflow-y-auto scroll-smooth pb-32 lg:pb-0'}`}>
            <div className={`${isChatPage ? 'h-full w-full' : 'max-w-7xl mx-auto p-4 md:p-8'}`}>
              {children}
            </div>
          </main>
        )}

        {/* --- MOBILE DOCK NAVIGATION --- */}
        {/* Only visible on small screens */}
        <div ref={dockRef} className={`lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${isDockExpanded ? 'bottom-6 w-[92%] max-w-md' : 'bottom-4 w-auto'}`}>
            <div 
                onClick={() => !isDockExpanded && setIsDockExpanded(true)}
                className={`
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl 
                    flex items-center transition-all duration-500 overflow-hidden ring-1 ring-black/5 dark:ring-white/10
                    ${isDockExpanded ? 'rounded-3xl px-4 py-4 h-auto gap-4 overflow-x-auto no-scrollbar justify-start' : 'rounded-full h-3 px-3 gap-2 cursor-pointer hover:scale-110 justify-center min-w-[100px]'}
                `}
            >
                {/* When Expanded: Show Full Icons */}
                {isDockExpanded ? (
                    navItems.map((item, idx) => (
                        <Link 
                            key={idx} 
                            to={item.to}
                            onClick={() => setIsDockExpanded(false)}
                            className="flex flex-col items-center gap-1.5 min-w-[4.5rem] group"
                        >
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95 shadow-sm border border-black/5 dark:border-white/5
                                ${item.active 
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                            `}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-bold truncate w-full text-center transition-colors ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>{item.label}</span>
                        </Link>
                    ))
                ) : (
                    /* When Collapsed: Show Dots */
                    navItems.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`rounded-full transition-all duration-300 shadow-sm ${item.active ? 'w-2 h-2 bg-emerald-500 shadow-emerald-500/50' : 'w-1.5 h-1.5 bg-slate-400/40 dark:bg-slate-600'}`} 
                        />
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void; className?: string }> = ({ to, icon, label, active, onClick, className }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 dark:bg-emerald-800' 
        : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white dark:text-emerald-300'
    } ${className || ''}`}
  >
    <span className={`${active ? 'text-yellow-400' : 'text-emerald-400 group-hover:text-yellow-300'}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default Layout;
