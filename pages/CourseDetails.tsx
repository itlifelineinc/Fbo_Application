
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { COURSES } from '../data';
import Navbar from '../components/Navbar';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = COURSES.find(c => c.id === id);
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']);

  if (!course) return <div className="p-10">Course not found</div>;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const calculateDuration = () => {
     const mins = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
     const hours = Math.floor(mins / 60);
     return hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Back to Courses
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Info */}
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {course.track}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-display mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {course.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-8">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  <span>{calculateDuration()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-blue-500" />
                  <span>Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{course.level}</span> Level
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (course.modules.length > 0 && course.modules[0].chapters.length > 0) {
                      navigate(`/course/${course.id}/module/${course.modules[0].id}/chapter/${course.modules[0].chapters[0].id}`);
                    }
                  }}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Start Course
                </button>
              </div>
            </div>

            {/* Right: Progress Card (Desktop) - Mocked for view */}
            <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg hidden md:block">
                <h3 className="font-bold text-slate-900 mb-4">What you'll learn</h3>
                <div className="space-y-3">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Curriculum */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Curriculum</h2>
              <p className="text-slate-500 mb-6">
                {course.modules.length} Modules • {course.modules.reduce((acc, m) => acc + m.chapters.length, 0)} Chapters
              </p>
              
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <button 
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-800">{module.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{module.chapters.length} lessons</p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>

                    {expandedModules.includes(module.id) && (
                      <div className="border-t border-slate-100">
                        {module.chapters.map((chapter) => (
                          <div 
                            key={chapter.id} 
                            className="flex items-center justify-between p-4 pl-16 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                            onClick={() => navigate(`/course/${course.id}/module/${module.id}/chapter/${chapter.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              {chapter.type === 'VIDEO' ? <PlayCircle size={16} className="text-slate-400" /> : <CheckCircle size={16} className="text-slate-400" />}
                              <span className="text-sm font-medium text-slate-700">{chapter.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-slate-400">{chapter.durationMinutes} min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About this Course</h2>
              <p className="text-slate-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>
          
          {/* Sidebar Mobile (Learning Outcomes moved down on mobile) */}
          <div className="lg:col-span-1 md:hidden">
             {/* Duplicate of desktop sidebar for mobile view */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">What you'll learn</h3>
                <div className="space-y-3">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
