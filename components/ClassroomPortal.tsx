
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseStatus, Student, UserRole } from '../types';
import CourseCard from './CourseCard';
import { Search, Lock, Filter } from 'lucide-react';

interface ClassroomPortalProps {
  courses: Course[];
  currentUser: Student;
  onEnrollCourse: (courseId: string) => void;
  onToggleSave: (courseId: string) => void;
}

type TabType = 'ALL' | 'GLOBAL' | 'TEAM' | 'STARTED' | 'COMPLETED' | 'SAVED';

const ClassroomPortal: React.FC<ClassroomPortalProps> = ({ courses, currentUser, onEnrollCourse, onToggleSave }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Utility: Check Completion ---
  const getProgress = (course: Course) => {
      const totalModules = course.modules.length;
      if (totalModules === 0) return 0;
      // Count modules where the user has completed at least one chapter (simplified) or explicit module completion
      // Using existing Student logic: check if all modules in course are in `completedModules`
      const completedCount = course.modules.filter(m => currentUser.completedModules.includes(m.id)).length;
      return Math.round((completedCount / totalModules) * 100);
  };

  // --- Filtering Logic ---
  const filteredCourses = courses.filter(course => {
      // 1. Basic Status Check (Only Published)
      if (course.status !== CourseStatus.PUBLISHED) return false;

      // 2. Search Filter
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.track.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 3. Tab Logic
      const isEnrolled = currentUser.enrolledCourses.includes(course.id);
      const isSaved = currentUser.savedCourses?.includes(course.id);
      const progress = getProgress(course);
      const isTeam = course.settings.teamOnly;
      
      // Determine if user has access to team content (is Author, Sponsor is Author, or Admin)
      const hasTeamAccess = currentUser.role === UserRole.ADMIN || 
                            currentUser.role === UserRole.SUPER_ADMIN ||
                            course.authorHandle === currentUser.handle ||
                            course.authorHandle === currentUser.sponsorId;

      switch (activeTab) {
          case 'ALL':
              // Show everything they have access to
              if (isTeam && !hasTeamAccess) return false;
              return true;
          
          case 'GLOBAL':
              return !isTeam; // Only public/global courses
          
          case 'TEAM':
              return isTeam && hasTeamAccess; // Only team courses they can see
          
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

  // --- Navigation Handler ---
  const handleCourseClick = (course: Course) => {
      const isEnrolled = currentUser.enrolledCourses.includes(course.id);
      const progress = getProgress(course);

      // Logic:
      // If going via "Started" or "Completed" tabs -> Go to Player
      // If going via "All", "Global", "Team", "Saved":
      //    - If enrolled & progress > 0 -> Player (Convenience)
      //    - If not enrolled -> Landing Page (to enroll)
      
      if (activeTab === 'STARTED' || activeTab === 'COMPLETED') {
          navigate(`/training/course/${course.id}`);
      } else {
          // Default behavior for discovery tabs
          if (isEnrolled) {
             navigate(`/training/course/${course.id}`);
          } else {
             navigate(`/training/preview/${course.id}`); 
          }
      }
  };

  const tabs: { id: TabType, label: string }[] = [
      { id: 'ALL', label: 'All Courses' },
      { id: 'GLOBAL', label: 'Global Courses' },
      { id: 'TEAM', label: 'Team Courses' },
      { id: 'STARTED', label: 'Started' },
      { id: 'COMPLETED', label: 'Completed' },
      { id: 'SAVED', label: 'Saved' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading dark:text-white">Classroom</h1>
            <p className="text-slate-500 mt-1 text-lg dark:text-slate-400">
                Your centralized learning hub.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, tracks, or topics..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
          </div>
      </div>

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-slate-200/50 dark:bg-slate-950/95 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {tabs.map(tab => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                          px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                          ${activeTab === tab.id 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md dark:bg-white dark:text-slate-900' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}
                      `}
                  >
                      {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 dark:bg-slate-700">
                    <Filter className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-lg dark:text-slate-400">No courses found in this view.</p>
                {activeTab === 'SAVED' && <p className="text-sm text-slate-400 mt-2">Bookmark courses to see them here.</p>}
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => {
                  const isEnrolled = currentUser.enrolledCourses.includes(course.id);
                  const progress = isEnrolled ? getProgress(course) : undefined;
                  const isSaved = currentUser.savedCourses?.includes(course.id);

                  // Determine label based on tab context or enrollment
                  let actionLabel = "View Details";
                  if (activeTab === 'COMPLETED') actionLabel = "Review Course";
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
                          showTrackBadge={activeTab === 'ALL' || activeTab === 'GLOBAL'} // Hide badge if context implies it
                      />
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default ClassroomPortal;
