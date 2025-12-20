
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole, Course, AppNotification } from '../types';
import { 
  LogOut, Settings, Moon, Sun, ChevronDown, Award, Bell, 
  LayoutTemplate, X, Menu, Home, BookOpen, Globe, Users, 
  MessageCircle, DollarSign, Rocket, Layers, User,
  ShoppingCart, ChevronRight, LayoutGrid, CheckCircle
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
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isAdminOrSuper = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN;
  const canBuildCourses = isAdminOrSuper || currentUser.role === UserRole.SPONSOR;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Global Outside Click Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isDockExpanded && dockRef.current && !dockRef.current.contains(target)) {
        setIsDockExpanded(false);
      }

      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(target) && profileBtnRef.current && !profileBtnRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }

      if (isNotificationMenuOpen && notificationMenuRef.current && !notificationMenuRef.current.contains(target)) {
          setIsNotificationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isNotificationMenuOpen, isSidebarOpen, isDockExpanded]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const resetDockTimer = () => {
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    dockTimeoutRef.current = setTimeout(() => {
      setIsDockExpanded(false);
    }, 5000);
  };

  const handleDockInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDockExpanded) {
        setIsDockExpanded(true);
    }
    resetDockTimer();
  };

  useEffect(() => {
    return () => { if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current); };
  }, []);

  const toggleSidebar = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSidebarOpen(!isSidebarOpen);
  }

  /**
   * NO-NAVBAR ROUTE LISTING ("Labeling")
   * Any path starting with these prefixes will NOT render the global header.
   * This allows the page itself to provide a custom header/toolbar.
   */
  const customHeaderPages = [
    '/sales-builder', 
    '/builder',
    '/classroom/', // Individual lesson pages have their own header
  ];
  
  const hasCustomHeader = customHeaderPages.some(path => location.pathname.startsWith(path));

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

  return (
    <div className="flex h-screen bg-[#f3f4f6] dark:bg-[#0f172a] overflow-hidden transition-colors duration-300 font-sans">
      
      {/* MODERN FLOATING SIDEBAR */}
      <div 
        className={`fixed inset-0 z-[200] transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
         <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
         
         <div 
            ref={sidebarRef}
            className={`
                absolute top-4 left-4 bottom-4 w-full max-w-[340px] md:max-w-md bg-white/95 dark:bg-slate-900/95 shadow-2xl 
                transform transition-transform duration-500 flex flex-col rounded-[2.5rem] overflow-hidden
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}
            `}
         >
            <div className="px-8 py-8 flex justify-between items-center shrink-0">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">Nexu</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <BoldXIcon />
                </button>
            </div>

            <div className="flex-1 flex flex-col px-8 overflow-hidden">
                <nav className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 py-2">
                    <NavItem to="/dashboard" label="Home" icon={Home} active={isActive('/dashboard')} />
                    <NavItem to="/chat" label="Team Chat" icon={MessageCircle} active={isActive('/chat')} />
                    <NavItem to="/classroom" label="Classroom" icon={BookOpen} active={isActive('/classroom') || location.pathname.startsWith('/training')} />
                    
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
                </nav>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 pb-10 shrink-0">
                  <button onClick={onLogout} className="flex items-center gap-4 text-left py-3 text-xl font-bold text-red-500 hover:text-red-600 transition-colors w-full">
                    <LogOut size={24} strokeWidth={3} />
                    Sign Out
                  </button>
                </div>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* CONDITIONAL HEADER: Completely hidden for "labeled" routes */}
        {!hasCustomHeader && (
            <header className="flex h-16 md:h-20 bg-white dark:bg-slate-900 items-center justify-between px-4 md:px-8 shrink-0 z-40 relative shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all active:scale-95"
                    >
                        <Menu size={28} strokeWidth={3} />
                    </button>
                    <div className="md:hidden">
                        <Logo className="w-10 h-10" showText={false} />
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
                            className={`p-2.5 rounded-full transition-colors relative ${isNotificationMenuOpen ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                        >
                            <Bell size={22} strokeWidth={2.5} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* NOTIFICATION DROPDOWN */}
                        {isNotificationMenuOpen && (
                            <div ref={notificationMenuRef} className="absolute right-0 mt-3 w-[320px] md:w-[380px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[150] overflow-hidden animate-fade-in">
                                <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                    <h3 className="font-bold text-slate-900 dark:text-white font-heading">Notifications</h3>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-900 dark:text-emerald-300">{unreadCount} New</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <Link key={n.id} to={n.link} className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0" onClick={() => setIsNotificationMenuOpen(false)}>
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                                                        {n.avatarUrl ? <img src={n.avatarUrl} className="w-full h-full rounded-full object-cover" /> : <Bell size={18} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'font-bold text-slate-900 dark:text-white'}`}>{n.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{n.subtitle}</p>
                                                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                                    </div>
                                                    {!n.isRead && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>}
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-slate-400">
                                            <Bell size={48} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50/50 dark:bg-slate-800/50">Mark all as read</button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button 
                            ref={profileBtnRef}
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className={`flex items-center justify-center rounded-full transition-all focus:outline-none ${isProfileMenuOpen ? 'ring-4 ring-emerald-500/20' : 'hover:ring-4 ring-slate-100 dark:ring-slate-800'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900 overflow-hidden transition-transform active:scale-95">
                                {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                            </div>
                        </button>

                        {/* PROFILE DROPDOWN */}
                        {isProfileMenuOpen && (
                            <div ref={profileMenuRef} className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-[150] overflow-hidden animate-fade-in">
                                <div className="p-2 pt-4">
                                    <Link to={`/students/${currentUser.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                                        <User size={18} className="text-slate-400" /> View Profile
                                    </Link>
                                    
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {theme === 'light' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-400" />}
                                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4.5' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
                                        <Settings size={18} className="text-slate-400" /> Settings
                                    </button>
                                    <div className="h-px bg-slate-50 dark:bg-slate-800 my-2 mx-2"></div>
                                    <button onClick={() => { onLogout(); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 transition-colors">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        )}

        <main className="flex-1 overflow-hidden relative pb-8 md:pb-0">
            {children}
        </main>

        {/* FLOATING DOCK */}
        {!hasCustomHeader && (
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-[160] flex justify-center pointer-events-none">
                <div 
                    ref={dockRef}
                    onClick={handleDockInteraction}
                    className={`
                        pointer-events-auto transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-2xl backdrop-blur-2xl
                        ${isDockExpanded 
                            ? 'w-[85%] max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-3 translate-y-0 opacity-100' 
                            : 'w-14 h-3 bg-slate-400/30 dark:bg-slate-500/30 rounded-full cursor-pointer opacity-60 hover:opacity-100 translate-y-4 mb-2'
                        }
                    `}
                >
                    {isDockExpanded ? (
                        <div className="flex justify-around items-center w-full px-2 animate-fade-in">
                            <DockItem to="/dashboard" icon={<Home size={22} strokeWidth={3} />} label="Home" active={isActive('/dashboard')} />
                            <DockItem to="/classroom" icon={<BookOpen size={22} strokeWidth={3} />} label="Learn" active={isActive('/classroom') || location.pathname.startsWith('/training')} />
                            <DockItem to="/chat" icon={<MessageCircle size={22} strokeWidth={3} />} label="Chat" active={isActive('/chat')} />
                            <DockItem to="#" icon={<Menu size={22} strokeWidth={3} />} label="Menu" active={isSidebarOpen} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSidebarOpen(true); setIsDockExpanded(false); }} />
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
        )}
      </div>
    </div>
  );
};

const DockItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: (e: React.MouseEvent) => void }> = ({ to, icon, label, active, onClick }) => (
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
