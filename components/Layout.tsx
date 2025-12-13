
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole, Course, AppNotification } from '../types';
import { LogOut, Settings, Moon, Sun, ChevronDown, Award, Bell, LayoutTemplate, Minimize2, X, GripHorizontal, Menu, Home, BookOpen, Globe, Users, MessageCircle, DollarSign, Rocket, Layers, MoreHorizontal, User } from 'lucide-react';
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

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, theme, onToggleTheme, courses, notifications }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isSalesMenuOpen, setIsSalesMenuOpen] = useState(false);
  
  // Mobile Dock State
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const dockTimeoutRef = useRef<any>(null);

  // Refs for Click Outside Logic
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isStudent = currentUser.role === UserRole.STUDENT;
  const isAdminOrSuper = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const canBuildCourses = isAdminOrSuper || currentUser.role === UserRole.SPONSOR;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // determine current Rank Name
  const currentRankName = currentUser.rankProgress ? RANKS[currentUser.rankProgress.currentRankId]?.name : 'FBO';

  // Click outside handler for Profile Menu & Sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Profile Menu
      if (
        isProfileMenuOpen && 
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node) &&
        profileBtnRef.current && 
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      
      // Sidebar (Drawer)
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

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Dock Auto-Minimize Logic
  const resetDockTimer = () => {
    if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    dockTimeoutRef.current = setTimeout(() => {
      setIsDockExpanded(false);
    }, 4000); // Minimize after 4 seconds of no interaction
  };

  const handleDockInteraction = () => {
    setIsDockExpanded(true);
    resetDockTimer();
  };

  // Initialize dock timer on mount
  useEffect(() => {
    resetDockTimer();
    return () => { if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current); };
  }, []);

  const toggleSidebar = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSidebarOpen(!isSidebarOpen);
  }

  // Nav Items Configuration
  const renderNavLinks = () => (
    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <NavItem to="/dashboard" icon={<Home size={20}/>} label="Dashboard" active={isActive('/dashboard')} />
        <NavItem to="/chat" icon={<MessageCircle size={20}/>} label="Team Chat" active={isActive('/chat')} />
        
        <div className="my-2 border-t border-slate-200 dark:border-slate-800 mx-4 opacity-50"></div>
        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Training</div>
        
        <NavItem to="/classroom" icon={<BookOpen size={20}/>} label="Classroom" active={isActive('/classroom') || location.pathname.startsWith('/training')} />
        
        <div className="my-2 border-t border-slate-200 dark:border-slate-800 mx-4 opacity-50"></div>

        {/* Sales & CC Dropdown */}
        <div className="space-y-1">
        <button
            onClick={() => setIsSalesMenuOpen(!isSalesMenuOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
            location.pathname.startsWith('/sales') 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
        >
            <div className="flex items-center gap-3">
            <span className={`${location.pathname.startsWith('/sales') ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`}>
                <DollarSign size={20}/>
            </span>
            <span className="font-medium">Sales & CC</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSalesMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isSalesMenuOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="ml-4 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
            <NavItem to="/sales" icon={<LayoutTemplate size={18}/>} label="Sales Log" active={isActive('/sales')} className="py-2 text-sm" />
            <NavItem to="/sales-builder" icon={<Rocket size={18}/>} label="Sales Pages" active={isActive('/sales-builder')} className="py-2 text-sm" />
            </div>
        </div>
        </div>

        <NavItem to="/community" icon={<Globe size={20}/>} label="Community" active={isActive('/community')} />
        
        {!isStudent && (
            <NavItem to="/students" icon={<Users size={20}/>} label={isAdminOrSuper ? "All Students" : "My Team"} active={isActive('/students')} />
        )}
        
        {canBuildCourses && (
            <NavItem to="/builder" icon={<Layers size={20}/>} label="Course Builder" active={isActive('/builder')} />
        )}
    </nav>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] dark:bg-[#0f172a] overflow-hidden transition-colors duration-300 font-sans">
      
      {/* 
          1. UNIFIED SIDEBAR DRAWER (Desktop & Mobile)
          Triggered by Hamburger menu on desktop, or "More" on mobile dock.
          Slide in from left with blur.
      */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
         {/* Blur Backdrop */}
         <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
         
         {/* Drawer Content */}
         <div 
            ref={sidebarRef}
            className={`absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
         >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <Logo className="w-8 h-8" textClassName="text-xl font-bold" />
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors">
                    <X size={20} className="text-slate-500" />
                </button>
            </div>
            {renderNavLinks()}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium dark:hover:bg-red-900/10">
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
         </div>
      </div>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* 
            2. UNIVERSAL TOP NAVBAR (Raised with Shadow)
        */}
        <header className="h-16 md:h-20 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 relative shadow-md">
            <div className="flex items-center gap-4">
                {/* Desktop Hamburger Only */}
                <button 
                    onClick={toggleSidebar}
                    className="hidden md:block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                >
                    <Menu size={24} />
                </button>
                
                {/* Mobile Logo */}
                <div className="md:hidden">
                    <Logo className="w-8 h-8" showText={false} />
                </div>

                {/* Breadcrumbs / Page Title */}
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Nexu Academy</span>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize leading-tight">
                        {location.pathname.split('/')[1] || 'Dashboard'}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                
                {/* Notifications */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {isNotificationMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsNotificationMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-40 animate-fade-in overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                    {unreadCount > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <Link key={n.id} to={n.link} className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800/50 transition-colors" onClick={() => setIsNotificationMenuOpen(false)}>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                                            <p className="text-xs text-slate-500 truncate">{n.subtitle}</p>
                                        </Link>
                                    )) : <div className="p-6 text-center text-slate-400 text-sm">No notifications</div>}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile Dropdown (Only Image) */}
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

                    {isProfileMenuOpen && (
                        <div ref={profileMenuRef} className="absolute right-0 top-14 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-40 animate-fade-in p-2">
                            
                            {/* Appearance Toggle */}
                            <div 
                                onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
                                className="w-full text-left px-3 py-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                        {theme === 'light' ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Appearance</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {/* Settings */}
                            <Link 
                                to={`/students/${currentUser.id}`}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                    <Settings size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Settings</span>
                            </Link>

                            {/* Profile */}
                            <Link 
                                to={`/students/${currentUser.id}`}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                    <User size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Profile</span>
                            </Link>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-3"></div>

                            {/* Logout */}
                            <button 
                                onClick={onLogout} 
                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors">
                                    <LogOut size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative pb-24 md:pb-0">
            {children}
        </main>

        {/* 
            3. MOBILE FLOATING DOCK (Animated Interaction)
            Visible only on mobile. 
            Behavior:
            - Idle: Small dots/pill (IOS style)
            - Active/Click: Expands to show icons and labels
        */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div 
                onClick={handleDockInteraction}
                onTouchStart={handleDockInteraction}
                className={`
                    pointer-events-auto transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-2xl backdrop-blur-2xl
                    ${isDockExpanded 
                        ? 'w-[90%] max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-3 translate-y-0 opacity-100' 
                        : 'w-14 h-3 bg-slate-400/30 dark:bg-slate-500/30 rounded-full cursor-pointer hover:bg-slate-400/50 active:scale-95 opacity-60 hover:opacity-100 translate-y-4 mb-2'
                    }
                `}
            >
                {isDockExpanded ? (
                    <div className="flex justify-between items-center w-full px-2">
                        <DockItem to="/dashboard" icon={<Home size={22} />} label="Home" active={isActive('/dashboard')} onClick={resetDockTimer} />
                        <DockItem to="/classroom" icon={<BookOpen size={22} />} label="Learn" active={isActive('/classroom') || location.pathname.startsWith('/training')} onClick={resetDockTimer} />
                        <DockItem to="/chat" icon={<MessageCircle size={22} />} label="Chat" active={isActive('/chat')} onClick={resetDockTimer} />
                        <DockItem to="/community" icon={<Globe size={22} />} label="Social" active={isActive('/community')} onClick={resetDockTimer} />
                        <button 
                            onClick={(e) => { setIsSidebarOpen(true); resetDockTimer(); }}
                            className="flex flex-col items-center gap-1 min-w-[56px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <div className="p-2 rounded-2xl transition-all active:scale-95 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Menu size={22} />
                            </div>
                            <span className="text-[9px] font-bold tracking-tight">Menu</span>
                        </button>
                    </div>
                ) : (
                    // Minimized State: iOS Page Indicator Dots look
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

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; className?: string }> = ({ to, icon, label, active, className }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-900/20 dark:text-emerald-400' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    } ${className || ''}`}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-emerald-500 rounded-r-full"></div>}
    <span className={`${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`}>
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

const DockItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
    <Link 
        to={to}
        onClick={onClick}
        className={`flex flex-col items-center gap-1 min-w-[56px] transition-all group`}
    >
        <div className={`p-2 rounded-2xl transition-all duration-300 active:scale-95 ${
            active 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
        }`}>
            {icon}
        </div>
        <span className={`text-[9px] font-bold tracking-tight transition-colors ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {label}
        </span>
    </Link>
);

export default Layout;
