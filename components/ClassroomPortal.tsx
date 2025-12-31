
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Course, CourseStatus, Student, UserRole } from '../types';
import CourseCard from './CourseCard';
import { Search, Lock, Filter, ArrowLeft, X } from 'lucide-react';

interface ClassroomPortalProps {
  courses: Course[];
  currentUser: Student;
  onEnrollCourse: (courseId: string) => void;
  onToggleSave: (courseId: string) => void;
}

type TabType = 'ALL' | 'GLOBAL' | 'TEAM' | 'STARTED' | 'COMPLETED' | 'SAVED';

const ClassroomPortal: React.FC<ClassroomPortalProps> = ({ courses, currentUser, onEnrollCourse, onToggleSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Handle deep link from state
  useEffect(() => {
      if (location.state && (location.state as any).initialTab) {
          setActiveTab((location.state as any).initialTab as TabType);
          // Clear state to prevent tab reset on reload
          window.history.replaceState({}, document.title);
      }
  }, [location.state]);

  // --- Utility: Check Completion ---
  const getProgress = (course: Course) => {
      const totalModules = course.modules.length;
      if (totalModules === 0) return 0;
      const completedCount = course.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
      return Math.round((completedCount / totalModules) * 100);
  };

  // --- Filtering Logic ---
  const filteredCourses = courses.filter(course => {
      if (course.status !== CourseStatus.PUBLISHED) return false;

      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.track.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      const isEnrolled = currentUser.enrolledCourses.includes(course.id);
      const isSaved = currentUser.savedCourses?.includes(course.id);
      const progress = getProgress(course);
      const isTeam = course.settings.teamOnly;
      
      const hasTeamAccess = currentUser.role === UserRole.ADMIN || 
                            currentUser.role === UserRole.SUPER_ADMIN ||
                            course.authorHandle === currentUser.handle ||
                            course.authorHandle === currentUser.sponsorId;

      switch (activeTab) {
          case 'ALL':
              if (isTeam && !hasTeamAccess) return false;
              return true;
          case 'GLOBAL':
              return !isTeam;
          case 'TEAM':
              return isTeam && hasTeamAccess;
          case 'STARTED':
              return isEnrolled && progress < 100;
          case 'COMPLETED':
              return isEnrolled && progress >= 100;
          case 'SAVED':
              return isSaved;
          default:
              return true;
      }
  });

  const handleCourseClick = (course: Course) => {
      const isEnrolled = currentUser.enrolledCourses.includes(course.id);
      
      if (activeTab === 'STARTED' || activeTab === 'COMPLETED') {
          navigate(`/training/course/${course.id}`);
      } else {
          if (isEnrolled) {
             navigate(`/training/course/${course.id}`);
          } else {
             navigate(`/training/preview/${course.id}`); 
          }
      }
  };

  const tabs: { id: TabType, label: string }[] = [
      { id: 'ALL', label: 'All Courses' },
      { id: 'GLOBAL', label: 'Global' },
      { id: 'TEAM', label: 'My Team' },
      { id: 'STARTED', label: 'InProgress' },
      { id: 'COMPLETED', label: 'Done' },
      { id: 'SAVED', label: 'Saved' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="md:hidden shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center z-50 shadow-sm transition-all duration-300">
         {!isMobileSearchOpen ? (
           <>
             <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
               Classroom
             </h1>
             <button 
                onClick={() => setIsMobileSearchOpen(true)} 
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95 hover:bg-slate-200 dark:hover:bg-slate-700"
             >
               <Search size={20} />
             </button>
           </>
         ) : (
           <div className="flex items-center gap-3 w-full animate-fade-in">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                 <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search classroom..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-slate-900 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-base"
                 />
              </div>
              <button 
                onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }}
                className="text-slate-600 dark:text-slate-300 font-bold text-sm px-2"
              >
                Cancel
              </button>
           </div>
         )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 md:pb-12 pt-4 md:pt-8">
              <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-heading dark:text-white">Classroom</h1>
                    <p className="text-slate-500 mt-1 text-lg dark:text-slate-400">
                        Your centralized learning hub.
                    </p>
                  </div>
                  <div className="relative w-full md:w-72 lg:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search courses, tracks..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm"
                      />
                  </div>
              </div>

              <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-slate-200/50 dark:bg-slate-950/95 dark:border-slate-800 transition-all duration-300 mb-6">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {tabs.map(tab => (
                          <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`
                                  px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border shadow-sm
                                  ${activeTab === tab.id 
                                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}
                              `}
                          >
                              {tab.label}
                          </button>
                      ))}
                  </div>
              </div>

              <div>
                {filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 dark:bg-slate-700">
                              <Filter className="text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium text-lg dark:text-slate-400">No courses found.</p>
                          {activeTab === 'SAVED' && <p className="text-sm text-slate-400 mt-2">Bookmark courses to see them here.</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredCourses.map(course => {
                            const isEnrolled = currentUser.enrolledCourses.includes(course.id);
                            const progress = isEnrolled ? getProgress(course) : undefined;
                            const isSaved = currentUser.savedCourses?.includes(course.id);

                            let actionLabel = "View Details";
                            if (activeTab === 'COMPLETED') actionLabel = "Review";
                            else if (activeTab === 'STARTED' || (isEnrolled && progress! > 0)) actionLabel = "Continue";
                            else if (isEnrolled) actionLabel = "Start Learning";

                            return (
                                <CourseCard 
                                    key={course.id}
                                    course={course}
                                    onClick={() => handleCourseClick(course)}
                                    progress={progress}
                                    actionLabel={actionLabel}
                                    isSaved={isSaved}
                                    onToggleSave={onToggleSave}
                                    showTrackBadge={activeTab === 'ALL' || activeTab === 'GLOBAL'}
                                />
                            );
                        })}
                    </div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ClassroomPortal;
