
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { ArrowLeft, PlayCircle, Layers, CheckCircle } from 'lucide-react';

interface CourseModulesPageProps {
  courses: Course[];
  completedModules: string[];
}

const CourseModulesPage: React.FC<CourseModulesPageProps> = ({ courses, completedModules }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === courseId);

  if (!course) return <div className="p-10 text-center dark:text-white">Course not found</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
        >
            <ArrowLeft size={20} />
        </button>
        <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 dark:text-emerald-400">Course Curriculum</div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading dark:text-white">{course.title}</h1>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.modules.map((module, idx) => {
            const isCompleted = completedModules.includes(module.id);
            const firstChapterId = module.chapters[0]?.id;

            return (
                <div 
                    key={module.id}
                    onClick={() => firstChapterId && navigate(`/classroom/${course.id}/${module.id}/${firstChapterId}`)}
                    className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-slate-900/5 dark:ring-white/10"
                >
                    {/* Background Image (Using Course Thumbnail for Consistency) */}
                    <div className="absolute inset-0">
                        <img 
                            src={course.thumbnailUrl} 
                            alt={module.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.4]"
                        />
                        {/* Completion Overlay */}
                        {isCompleted && (
                            <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                                    <CheckCircle size={18} /> Completed
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                        <div className="flex justify-between items-start">
                            <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold font-heading text-lg">
                                {idx + 1}
                            </span>
                            {isCompleted && <CheckCircle className="text-emerald-400 drop-shadow-md" size={24} />}
                        </div>

                        <div>
                            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Layers size={12} /> CHAPTERS ({module.chapters.length})
                            </div>
                            <h3 className="text-2xl font-bold text-white font-heading leading-tight group-hover:text-emerald-200 transition-colors">
                                {module.title}
                            </h3>
                            <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4 group-hover:w-full transition-all duration-500" />
                        </div>
                    </div>

                    {/* Hover Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <PlayCircle size={64} className="text-white/80 drop-shadow-2xl" />
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default CourseModulesPage;
