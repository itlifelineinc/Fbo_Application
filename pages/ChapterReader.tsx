
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle, BookOpen, Menu } from 'lucide-react';
import { COURSES } from '../data';

const ChapterReader: React.FC = () => {
  const { courseId, moduleId, chapterId } = useParams();
  const navigate = useNavigate();

  const course = COURSES.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const chapter = module?.chapters.find(c => c.id === chapterId);

  // Logic to find next chapter
  // Simple implementation for demo
  const handleNext = () => {
      // Return to course overview for demo purposes
      navigate(`/course/${courseId}`); 
  };

  if (!course || !module || !chapter) return <div>Not Found</div>;

  const isQuiz = chapter.quizQuestions && chapter.quizQuestions.length > 0;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-80 border-r border-slate-200 bg-slate-50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200">
           <button onClick={() => navigate(`/course/${courseId}`)} className="flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-wide mb-3 transition-colors">
             <ArrowLeft size={14} className="mr-1" /> Back to Course
           </button>
           <h2 className="font-bold text-slate-900 leading-snug">{course.title}</h2>
           
           <div className="mt-4 w-full bg-slate-200 rounded-full h-1.5">
               {/* Mock progress bar as 0 since student state is not available here */}
              <div className="bg-blue-600 h-1.5 rounded-full" style={{width: `0%`}}></div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {course.modules.map((mod) => (
             <div key={mod.id}>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2">{mod.title}</h3>
               <div className="space-y-1">
                 {mod.chapters.map((chap) => (
                   <button
                     key={chap.id}
                     onClick={() => navigate(`/course/${course.id}/module/${mod.id}/chapter/${chap.id}`)}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                       chap.id === chapterId 
                         ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200 font-medium' 
                         : 'text-slate-600 hover:bg-slate-100'
                     }`}
                   >
                     {chap.id === chapterId ? (
                       <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                         <div className="w-2 h-2 bg-blue-600 rounded-full" />
                       </div>
                     ) : (
                       <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                     )}
                     <span className="line-clamp-2">{chap.title}</span>
                   </button>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
           <button onClick={() => navigate(`/course/${courseId}`)} className="p-2 -ml-2 text-slate-500">
             <ArrowLeft size={20} />
           </button>
           <span className="font-bold text-slate-800 truncate w-48 text-center">{module.title}</span>
           <div className="w-10"></div> {/* Placeholder to keep title centered since Menu is removed */}
        </header>

        <div className="flex-1 overflow-y-auto">
           <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
              
              <div className="mb-8 border-b border-slate-100 pb-8">
                 <span className="text-blue-600 font-bold text-sm mb-2 block uppercase tracking-wide">{module.title}</span>
                 <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">{chapter.title}</h1>
              </div>

              {chapter.type === 'VIDEO' && chapter.videoUrl && (
                <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg mb-10">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={chapter.videoUrl} 
                    title="Chapter Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
              )}

              {isQuiz && chapter.quizQuestions ? (
                 <div className="space-y-8">
                    {chapter.quizQuestions.map((q, idx) => (
                        <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                           <h3 className="text-lg font-bold text-slate-900 mb-4"><span className="text-slate-400 mr-2">{idx + 1}.</span> {q.question}</h3>
                           <div className="space-y-3">
                              {q.options.map((opt, i) => (
                                 <label key={i} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all group">
                                    <input type="radio" name={`q-${q.id}`} className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-700 group-hover:text-blue-800">{opt}</span>
                                 </label>
                              ))}
                           </div>
                        </div>
                    ))}
                    <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                       Submit Answers
                    </button>
                 </div>
              ) : (
                 <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: chapter.content }}></div>
              )}

              {chapter.objectives && (
                <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-500" /> Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {chapter.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

           </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-slate-200 p-4 md:px-8 flex justify-between items-center sticky bottom-0 z-10">
            <button className="text-slate-500 font-medium hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all flex items-center gap-2 text-sm"
            >
              {isQuiz ? 'Finish Module' : 'Next Lesson'} <ChevronRight size={16} />
            </button>
        </div>

      </main>
    </div>
  );
};

export default ChapterReader;
