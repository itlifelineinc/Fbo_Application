
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';
import { COURSES } from '../data';
import Navbar from '../components/Navbar';
import { CourseTrack } from '../types';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...Object.values(CourseTrack)];
  const navigate = useNavigate();

  const filteredCourses = activeCategory === 'All' 
    ? COURSES 
    : COURSES.filter(c => c.track === activeCategory);

  const calculateDuration = (course: typeof COURSES[0]) => {
     const mins = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
     const hours = Math.floor(mins / 60);
     return hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-display">Welcome back, Student</h1>
          <p className="text-slate-500 mt-1">Pick up where you left off or explore new skills.</p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto space-x-2 pb-6 mb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700">
                  {course.track}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1 font-display">{course.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.subtitle}</p>
                
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{calculateDuration(course)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{course.modules.length} Modules</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-700' : 
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.level}
                  </div>
                </div>

                <div className="mt-auto pt-6">
                   <button className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-100 text-sm">
                      <PlayCircle size={18} />
                      Start Course
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
