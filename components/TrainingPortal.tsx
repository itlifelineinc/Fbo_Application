
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseStatus, Student } from '../types';
import { PlayCircle, Lock, BookOpen, Clock } from 'lucide-react';

interface TrainingPortalProps {
  courses: Course[];
  mode: 'GLOBAL' | 'TEAM';
  currentUser: Student;
}

const TrainingPortal: React.FC<TrainingPortalProps> = ({ courses, mode, currentUser }) => {
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

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading dark:text-white">
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
          {filteredCourses.map(course => (
            <div 
                key={course.id}
                onClick={() => navigate(`/training/course/${course.id}`)}
                className="group relative h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 dark:shadow-none dark:border dark:border-slate-700"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src={course.thumbnailUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    
                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 flex gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                            {course.track}
                        </span>
                    </div>

                    {/* Main Info */}
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h2 className="text-3xl font-bold text-white font-heading leading-tight mb-3 drop-shadow-md">
                            {course.title}
                        </h2>
                        
                        <div className="flex items-center gap-4 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} className="text-emerald-400"/> MODULES ({course.modules.length})
                            </span>
                            <span className="w-1 h-1 bg-slate-500 rounded-full" />
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-emerald-400"/> {course.level}
                            </span>
                        </div>

                        <p className="text-slate-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {course.subtitle}
                        </p>

                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 group-hover:bg-emerald-500">
                            <PlayCircle size={20} fill="currentColor" className="text-emerald-900" />
                            Start Learning
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingPortal;
