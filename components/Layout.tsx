import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Student, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: Student;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Role Checks
  const isStudent = currentUser.role === UserRole.STUDENT;
  const isAdminOrSuper = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-emerald-900 text-white flex flex-col shadow-xl 
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-emerald-800 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight font-heading">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-emerald-900 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span>FBO Academy</span>
          </div>
          {/* Mobile Close Button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-emerald-300 hover:text-white">
            <XMarkIcon />
          </button>
        </div>

        {/* Clickable User Profile Section */}
        <div className="px-6 py-4 bg-emerald-800/30">
           <Link 
             to={`/students/${currentUser.id}`}
             onClick={() => setIsMobileMenuOpen(false)}
             className="flex items-center gap-3 bg-emerald-800/50 p-3 rounded-lg border border-emerald-800 hover:bg-emerald-700/50 hover:border-emerald-600 transition-all cursor-pointer group"
           >
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 font-heading overflow-hidden group-hover:scale-105 transition-transform">
                {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                    currentUser.name.charAt(0)
                )}
             </div>
             <div className="overflow-hidden">
                <p className="text-xs font-medium truncate text-emerald-100 group-hover:text-white transition-colors">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-300 font-mono truncate group-hover:text-emerald-200 transition-colors">{currentUser.handle}</p>
             </div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <NavItem 
            to="/dashboard" 
            icon={<HomeIcon />} 
            label="Dashboard" 
            active={isActive('/dashboard')} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/community" 
            icon={<GlobeAltIcon />} 
            label="Community" 
            active={isActive('/community')} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/chat" 
            icon={<ChatBubbleOvalLeftIcon />} 
            label="Team Chat" 
            active={isActive('/chat')} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/courses" 
            icon={<BookOpenIcon />} 
            label="My Training" 
            active={isActive('/courses') || location.pathname.startsWith('/classroom')} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/sales" 
            icon={<CurrencyDollarIcon />} 
            label="Sales & CC" 
            active={isActive('/sales')} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Hide Students List from Students */}
          {!isStudent && (
             <NavItem 
               to="/students" 
               icon={<UsersIcon />} 
               label={isAdminOrSuper ? "All Students" : "My Team"} 
               active={isActive('/students')} 
               onClick={() => setIsMobileMenuOpen(false)}
             />
          )}
          
          {/* Admin Only */}
          {isAdminOrSuper && (
             <NavItem 
               to="/builder" 
               icon={<SparklesIcon />} 
               label="Course Builder" 
               active={isActive('/builder')} 
               onClick={() => setIsMobileMenuOpen(false)}
             />
          )}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-emerald-300 hover:bg-emerald-800/50 hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10 shadow-sm">
           <div className="flex items-center gap-2 font-bold text-lg text-emerald-900 font-heading">
             <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-emerald-900 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
             </div>
             <span>FBO Academy</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100">
             <Bars3Icon />
           </button>
        </header>

        <main className="flex-1 overflow-auto scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20' 
        : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-yellow-400' : 'text-emerald-400 group-hover:text-yellow-300'}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </Link>
);

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ChatBubbleOvalLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);

const CurrencyDollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const ArrowRightOnRectangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const Bars3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GlobeAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

export default Layout;