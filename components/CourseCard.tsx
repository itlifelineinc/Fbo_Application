
import React from 'react';
import { Course } from '../types';
import { PlayCircle, BookOpen, Clock, Info, Bookmark } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  progress?: number; // Optional progress percentage (0-100)
  showTrackBadge?: boolean;
  actionLabel?: string; // "Start Learning" vs "View Details"
  isSaved?: boolean;
  onToggleSave?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
    course, 
    onClick, 
    progress, 
    showTrackBadge = true, 
    actionLabel,
    isSaved,
    onToggleSave 
}) => {
  // Calculate duration string
  const totalDuration = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
  const durationStr = totalDuration > 60 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${totalDuration}m`;

  const isEnrolled = progress !== undefined;
  const label = actionLabel || (isEnrolled ? (progress > 0 ? 'Continue' : 'Start Learning') : 'View Details');

  return (
    <div 
        onClick={onClick}
        className="group relative h-[360px] md:h-[420px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 dark:shadow-none dark:border dark:border-slate-700"
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

        {/* Progress Bar (Netflix Style) - Only if enrolled */}
        {isEnrolled && progress! > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-700/50 z-20">
                <div 
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        )}

        {/* Bookmark Button */}
        {onToggleSave && (
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(course.id); }}
                className={`absolute top-6 right-6 p-2 rounded-full backdrop-blur-md transition-all z-30 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            
            {/* Top Badges */}
            {showTrackBadge && (
                <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                        {course.track}
                    </span>
                </div>
            )}

            {/* Main Info */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-heading leading-tight mb-2 md:mb-3 drop-shadow-md line-clamp-2">
                    {course.title}
                </h2>
                
                <div className="flex items-center gap-4 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-emerald-400"/> MODULES ({course.modules.length})
                    </span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-emerald-400"/> {durationStr}
                    </span>
                </div>

                <p className="text-slate-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {course.subtitle}
                </p>

                <button className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                    isEnrolled 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 group-hover:bg-emerald-500' 
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}>
                    {isEnrolled ? <PlayCircle size={20} fill="currentColor" className="text-emerald-900" /> : <Info size={20} />}
                    {label}
                </button>
            </div>
        </div>
    </div>
  );
};

export default CourseCard;
