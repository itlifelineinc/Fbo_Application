
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole, Course, AppNotification } from '../types';
import { 
  LogOut, Settings, Moon, Sun, ChevronDown, Award, Bell, 
  LayoutTemplate, X, Menu, Home, BookOpen, Globe, Users, 
  MessageCircle, DollarSign, Rocket, Layers, User,
  Facebook, Instagram, Linkedin, Github, Slack, ShoppingCart, 
  ChevronRight, LayoutGrid
} from 'lucide-react';
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

const BoldXIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, theme, onToggleTheme, courses, notifications }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isSalesMenuOpen, setIsSalesMenuOpen] = useState(false);
  
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const dockTimeoutRef = useRef<any>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isAdminOrSuper = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN;
  const canBuildCourses = isAdminOrSuper || currentUser.role === UserRole.SPONSOR;
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      
      if (
        isSidebarOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const resetDockTimer = () => {
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    dockTimeoutRef.current = setTimeout(() => {
      setIsDockExpanded(false);
    }, 4000);
  };

  const handleDockInteraction = () => {
    setIsDockExpanded(true);
    resetDockTimer();
  };

  useEffect(() => {
    resetDockTimer();
    return () => { if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current); };
  }, []);

  const toggleSidebar = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSidebarOpen(!isSidebarOpen);
  }

  // --- UI RULE: Hide default header on builder pages which have custom toolbars ---
  const hideDefaultHeader = location.pathname.startsWith('/sales-builder') || location.pathname.startsWith('/builder');

  const NavItem = ({ to, label, icon: Icon, active, onClick }: { to: string, label: string, icon: any, active: boolean, onClick?: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-4 py-3 text-xl font-bold transition-all duration-300 hover:translate-x-1 ${
        active 
          ? 'text-emerald-600 dark:text-emerald-400' 
          : 'text-slate-700 dark:text-slate-300 hover:text-emerald-500'
      }`}
    >
      <Icon size={24} strokeWidth={3} className={active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
      {label}
    </Link>
  );

  const SupportCard = () => (
    <div className="mt-8 p-8 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-white flex flex-col gap-6 shadow-xl relative overflow-hidden">
      <div className="flex -space-x-3">
        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" alt="Supporter 1" />
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" alt="Supporter 2" />
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" alt="Supporter 3" />
      </div>

      <h3 className="text-xl font-bold leading-tight font-heading">
        Supportive, Professional, Client-Focused Service
      </h3>

      <div className="flex items-center gap-5 text-slate-400">
        <Facebook size={18} className="hover:text-white cursor-pointer transition-colors" />
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="hover:text-white cursor-pointer transition-colors">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
        <Instagram size={18} className="hover:text-white cursor-pointer transition-colors" />
        <Linkedin size={18} className="hover:text-white cursor-pointer transition-colors" />
        <Github size={18} className="hover:text-white cursor-pointer transition-colors" />
        <Slack size={18} className="hover:text-white cursor-pointer transition-colors" />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] dark:bg-[#0f172a] overflow-hidden transition-colors duration-300 font-sans">
      
      {/* 
          MODERN FLOATING SIDEBAR
      */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
         <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
         
         <div 
            ref={sidebarRef}
            className={`
                absolute top-4 left-4 bottom-4 w-full max-w-[340px] md:max-w-md bg-white/95 dark:bg-slate-900/95 shadow-2xl 
                transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col rounded-[2.5rem]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}
            `}
         >
            {/* Sidebar Header */}
            <div className="px-8 py-8 flex justify-between items-center shrink-0">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">Nexu</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <BoldXIcon />
                </button>
            </div>

            {/* Sidebar Nav Links */}
            <div className="flex-1 overflow-y-auto px-8 py-2 no-scrollbar">
                <nav className="flex flex-col gap-2">
                    <NavItem to="/dashboard" label="Home" icon={Home} active={isActive('/dashboard')} />
                    <NavItem to="/chat" label="Team Chat" icon={MessageCircle} active={isActive('/chat')} />
                    <NavItem to="/classroom" label="Classroom" icon={BookOpen} active={isActive('/classroom') || location.pathname.startsWith('/training')} />
                    
                    {/* Collapsible Sales Section */}
                    <div className="py-1">
                      <button 
                        onClick={() => setIsSalesMenuOpen(!isSalesMenuOpen)}
                        className={`flex items-center justify-between w-full py-3 text-xl font-bold transition-all ${
                          location.pathname.startsWith('/sales') ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                            <ShoppingCart size={24} strokeWidth={3} className={location.pathname.startsWith('/sales') ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>Sales & CC</span>
                        </div>
                        <ChevronDown className={`transition-transform duration-300 ${isSalesMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isSalesMenuOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-12 flex flex-col gap-3">
                          <Link to="/sales" className="text-lg font-bold text-slate-500 hover:text-emerald-500 transition-colors">Sales Log</Link>
                          <Link to="/sales-builder" className="text-lg font-bold text-slate-500 hover:text-emerald-500 transition-colors">Sales Pages</Link>
                        </div>
                      </div>
                    </div>

                    <NavItem to="/community" label="Community" icon={Globe} active={isActive('/community')} />
                    
                    {!currentUser.role.includes('STUDENT') && (
                        <NavItem to="/students" label={isAdminOrSuper ? "Students" : "My Team"} icon={Users} active={isActive('/students')} />
                    )}
                    
                    {canBuildCourses && (
                        <NavItem to="/builder" label="Builder" icon={Layers} active={isActive('/builder')} />
                    )}
                    
                    <button onClick={onLogout} className="flex items-center gap-4 text-left py-3 text-xl font-bold text-red-500 hover:text-red-600 transition-colors">
                      <LogOut size={24} strokeWidth={3} />
                      Sign Out
                    </button>
                </nav>

                <SupportCard />
                <div className="h-8 shrink-0"></div>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className={`${hideDefaultHeader ? 'hidden' : 'flex'} h-16 md:h-20 bg-white dark:bg-slate-900 items-center justify-between px-4 md:px-8 shrink-0 z-40 relative shadow-md transition-all duration-300`}>
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-95"
                >
                    <Menu size={28} strokeWidth={3} />
                </button>
                
                <div className="md:hidden">
                    <Logo className="w-8 h-8" showText={false} />
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Nexu Academy</span>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize leading-tight">
                        {location.pathname.split('/')[1] || 'Dashboard'}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
                    >
                        <Bell size={22} strokeWidth={2.5} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <button 
                        ref={profileBtnRef}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center justify-center rounded-full hover:ring-4 ring-slate-100 dark:ring-slate-800 transition-all focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900 overflow-hidden">
                            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                        </div>
                    </button>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative pb-8 md:pb-0">
            {children}
        </main>

        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div 
                onClick={handleDockInteraction}
                className={`
                    pointer-events-auto transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-2xl backdrop-blur-2xl
                    ${isDockExpanded 
                        ? 'w-[90%] max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-3 translate-y-0 opacity-100' 
                        : 'w-14 h-3 bg-slate-400/30 dark:bg-slate-500/30 rounded-full cursor-pointer opacity-60 hover:opacity-100 translate-y-4 mb-2'
                    }
                `}
            >
                {isDockExpanded ? (
                    <div className="flex justify-between items-center w-full px-2">
                        <DockItem to="/dashboard" icon={<Home size={22} strokeWidth={3} />} label="Home" active={isActive('/dashboard')} onClick={resetDockTimer} />
                        <DockItem to="/classroom" icon={<BookOpen size={22} strokeWidth={3} />} label="Learn" active={isActive('/classroom') || location.pathname.startsWith('/training')} onClick={resetDockTimer} />
                        <DockItem to="/chat" icon={<MessageCircle size={22} strokeWidth={3} />} label="Chat" active={isActive('/chat')} onClick={resetDockTimer} />
                        <button 
                            onClick={(e) => { setIsSidebarOpen(true); resetDockTimer(); }}
                            className="flex flex-col items-center gap-1 min-w-[56px] text-slate-400"
                        >
                            <div className="p-2 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Menu size={22} strokeWidth={3} />
                            </div>
                            <span className="text-[9px] font-bold">Menu</span>
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center gap-1">
                        <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const DockItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
    <Link 
        to={to}
        onClick={onClick}
        className={`flex flex-col items-center gap-1 min-w-[56px] transition-all`}
    >
        <div className={`p-2 rounded-2xl transition-all duration-300 ${
            active 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
        }`}>
            {icon}
        </div>
        <span className={`text-[9px] font-bold transition-colors ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {label}
        </span>
    </Link>
);

export default Layout;
