
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole, Course, AppNotification } from '../types';
import { LogOut, Settings, Moon, Sun, ChevronDown, Award, Bell, LayoutTemplate, Minimize2, X, GripHorizontal, Menu, Home, BookOpen, Globe, Users, MessageCircle, DollarSign, Rocket, Layers } from 'lucide-react';
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
          Triggered by Hamburger menu. Slide in from left with blur.
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
            2. UNIVERSAL TOP NAVBAR (Desktop & Mobile) 
            Replaces the old specific headers.
        */}
        <header className="h-16 md:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 relative">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                >
                    <Menu size={24} />
                </button>
                
                {/* Breadcrumbs / Page Title */}
                <div className="hidden md:flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nexu Academy</span>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize leading-tight">
                        {location.pathname.split('/')[1] || 'Dashboard'}
                    </h1>
                </div>
                <div className="md:hidden">
                    <Logo className="w-8 h-8" showText={false} />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                
                {/* Rank Badge (Desktop) */}
                <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900/50">
                        <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{currentRankName}</span>
                </div>

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

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        ref={profileBtnRef}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900 overflow-hidden">
                            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">{currentUser.name.split(' ')[0]}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{currentUser.role}</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                    </button>

                    {isProfileMenuOpen && (
                        <div ref={profileMenuRef} className="absolute right-0 top-14 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-40 animate-fade-in p-1">
                            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-1">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">Signed in as</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            </div>
                            <button 
                                onClick={onToggleTheme}
                                className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <div className="flex items-center gap-3">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} <span>Appearance</span></div>
                            </button>
                            <Link 
                                to={`/students/${currentUser.id}`}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Settings size={16} /> <span>Settings</span>
                            </Link>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors dark:hover:bg-red-900/10">
                                <LogOut size={16} /> <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative">
            {children}
        </main>

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

export default Layout;
