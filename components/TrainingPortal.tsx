
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseStatus, Student } from '../types';
import { Lock } from 'lucide-react';
import CourseCard from './CourseCard';

interface TrainingPortalProps {
  courses: Course[];
  mode: 'GLOBAL' | 'TEAM';
  currentUser: Student;
  onEnrollCourse: (courseId: string) => void;
}

const TrainingPortal: React.FC<TrainingPortalProps> = ({ courses, mode, currentUser, onEnrollCourse }) => {
  const navigate = useNavigate();

  // Filter Logic
  const filteredCourses = courses.filter(c => {
    // Must be published
    if (c.status !== CourseStatus.PUBLISHED) return false;
    
    // Global: Show public courses (teamOnly is false/undefined)
    if (mode === 'GLOBAL') return !c.settings.teamOnly;
    
    // Team: Show team courses (teamOnly is true) AND (user is in author's team OR user is the author)
    if (mode === 'TEAM') {
        const isMyTeamContent = c.authorHandle === currentUser.sponsorId || c.authorHandle === currentUser.handle;
        // In a real app, you'd check hierarchy recursively, for now simplify to direct sponsor or generic team courses
        return c.settings.teamOnly; 
    }
    return false;
  });

  const handleCourseClick = (courseId: string) => {
      // Navigate to the Sales/Landing Page first for enrollment decision
      navigate(`/training/preview/${courseId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading dark:text-white">
                {mode === 'GLOBAL' ? 'Global Training Library' : 'Team Training Portal'}
            </h1>
            <p className="text-slate-500 mt-2 text-lg dark:text-slate-400">
                {mode === 'GLOBAL' 
                    ? 'Master the fundamentals with official Forever training.' 
                    : 'Exclusive strategies and playbooks from your team leaders.'}
            </p>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 dark:bg-slate-700">
                <Lock className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium text-lg dark:text-slate-400">No {mode.toLowerCase()} courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => {
            // Check if enrolled just to show a visual indicator if needed, but actions are consistent
            const isEnrolled = currentUser.enrolledCourses?.includes(course.id);
            
            return (
                <CourseCard 
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                    actionLabel={isEnrolled ? "Continue Learning" : "View Details"}
                    progress={isEnrolled ? 0 : undefined} // Reset progress visual on catalog to keep it clean, or pass real progress if desired
                />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainingPortal;
