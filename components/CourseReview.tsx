
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, CourseStatus, Chapter, Module } from '../types';

interface CourseReviewProps {
  courses: Course[];
  onReviewCourse: (courseId: string, status: CourseStatus) => void;
}

const CourseReview: React.FC<CourseReviewProps> = ({ courses, onReviewCourse }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // --- FIX: Safety check if courses is undefined ---
  if (!courses) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Loading course data...</div>;
  }

  const course = courses.find(c => c.id === courseId);
  
  // 'OVERVIEW' means we are looking at Level 1 & 4 info. Otherwise, we are looking at a specific Chapter.
  const [activeView, setActiveView] = useState<Chapter | 'OVERVIEW'>('OVERVIEW');

  if (!course) {
    return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Course not found.</div>;
  }

  const handleApprove = () => {
      onReviewCourse(course.id, CourseStatus.PUBLISHED);
      alert(`Course "${course.title}" has been published!`);
      navigate('/dashboard');
  };

  const handleReject = () => {
      onReviewCourse(course.id, CourseStatus.REJECTED);
      alert(`Course "${course.title}" has been rejected.`);
      navigate('/dashboard');
  };

  // --- RENDERERS ---

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in pb-10">
        {/* Identity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            <div className="h-32 bg-slate-100 relative dark:bg-slate-700">
                {course.bannerImageUrl && <img src={course.bannerImageUrl} className="w-full h-full object-cover" alt="Banner" />}
                <div className="absolute -bottom-10 left-8 w-24 h-24 bg-white rounded-xl p-1 shadow-md border border-slate-200 dark:bg-slate-800 dark:border-slate-600">
                    <img src={course.thumbnailUrl} className="w-full h-full object-cover rounded-lg bg-slate-100 dark:bg-slate-700" alt="Thumbnail" />
                </div>
            </div>
            <div className="pt-12 px-8 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-heading dark:text-slate-100">{course.title}</h1>
                        <p className="text-slate-500 text-lg mt-1 dark:text-slate-400">{course.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider dark:bg-emerald-900/30 dark:text-emerald-300">{course.status}</span>
                        <p className="text-xs text-slate-400 mt-2 dark:text-slate-500">Author: <span className="font-mono text-slate-600 dark:text-slate-300">{course.authorHandle}</span></p>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Badge label="Track" value={course.track} color="blue" />
                    <Badge label="Level" value={course.level} color="purple" />
                    <Badge label="Modules" value={course.modules.length} color="slate" />
                </div>
            </div>
        </div>

        {/* Description & Outcomes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Section title="Course Description">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap dark:text-slate-300">{course.description}</p>
                </Section>

                <Section title="Learning Outcomes">
                    {course.learningOutcomes.length > 0 ? (
                        <ul className="space-y-2">
                            {course.learningOutcomes.map((outcome, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckIcon />
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-400 italic dark:text-slate-500">No outcomes specified.</p>}
                </Section>
            </div>

            <div className="space-y-8">
                 <Section title="Target Audience">
                    <div className="flex flex-wrap gap-2">
                        {course.targetAudience.length > 0 ? course.targetAudience.map((aud, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium dark:bg-slate-700 dark:text-slate-300">{aud}</span>
                        )) : <span className="text-slate-400 italic dark:text-slate-500">Not specified</span>}
                    </div>
                 </Section>

                 <Section title="Configuration">
                    <div className="space-y-3">
                        <ConfigRow label="Gamification" value={course.settings.gamificationEnabled} />
                        <ConfigRow label="Certificates" value={course.settings.certificateEnabled} />
                        <ConfigRow label="Assessment Required" value={course.settings.requiresAssessment} />
                        <ConfigRow label="Team Only" value={course.settings.teamOnly} />
                        <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Points Reward</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{course.settings.pointsReward} XP</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Price</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{course.settings.price ? `$${course.settings.price}` : 'Free'}</span>
                        </div>
                    </div>
                 </Section>
                 
                 {course.trailerVideoUrl && (
                     <Section title="Trailer Video">
                        <a href={course.trailerVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm dark:text-blue-400">
                            <VideoIcon /> Watch Trailer
                        </a>
                     </Section>
                 )}
            </div>
        </div>
    </div>
  );

  const renderChapterDetail = (chapter: Chapter) => (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in dark:bg-slate-800 dark:border-slate-700">
            {/* Chapter Header Image */}
            <div className="h-48 bg-slate-100 relative dark:bg-slate-700">
                    {chapter.headerImageUrl ? (
                        <img src={chapter.headerImageUrl} className="w-full h-full object-cover" alt="Chapter Header" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">No Header Image</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div className="flex items-center gap-2 mb-1">
                             <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded">{chapter.type}</span>
                             <span className="text-slate-200 text-xs font-medium">{chapter.durationMinutes} Mins</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white font-heading">{chapter.title}</h2>
                    </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Summary */}
                {chapter.summary && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-blue-900 italic text-sm dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-400">
                        "{chapter.summary}"
                    </div>
                )}

                {/* Action Steps */}
                {chapter.actionSteps && chapter.actionSteps.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 dark:bg-slate-700/50 dark:border-slate-600">
                            <h3 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wide flex items-center gap-2 dark:text-slate-200">
                                <BoltIcon /> Action Steps
                            </h3>
                            <ul className="space-y-2">
                                {chapter.actionSteps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="text-emerald-500 font-bold">✓</span> {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                )}

                {/* Main Content */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 dark:text-slate-100 dark:border-slate-700">Lesson Content</h3>
                    {chapter.type === 'VIDEO' && chapter.content ? (
                            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                <iframe src={chapter.content} className="w-full h-full" title="Video Preview"></iframe>
                            </div>
                    ) : (
                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 dark:text-slate-300">
                            <p className="whitespace-pre-wrap">{chapter.content}</p>
                        </div>
                    )}
                </div>

                {/* Quiz Preview */}
                {chapter.quizQuestions && chapter.quizQuestions.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 mb-4 dark:text-slate-100">Quiz Questions ({chapter.quizQuestions.length})</h3>
                        <div className="space-y-4">
                            {chapter.quizQuestions.map((q, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-700/50 dark:border-slate-600">
                                    <p className="font-medium text-sm text-slate-800 mb-2 dark:text-slate-200"><span className="text-slate-400 mr-2">Q{i+1}.</span> {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className={`text-xs px-3 py-2 rounded border ${optIdx === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-bold dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400'}`}>
                                                {opt} {optIdx === q.correctAnswer && '(Correct)'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Resources */}
                <div className="pt-6 border-t border-slate-100 flex gap-4 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                     {chapter.videoUrl && <span className="flex items-center gap-1"><VideoIcon /> Video Resource Available</span>}
                     {chapter.pdfUrl && <span className="flex items-center gap-1"><DocumentTextIcon /> PDF Resource Available</span>}
                </div>
            </div>
      </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Sticky Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm shrink-0 z-20 dark:bg-slate-800 dark:border-slate-700">
         <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                <ArrowLeftIcon />
             </button>
             <div>
                 <h1 className="font-bold text-lg text-slate-800 font-heading dark:text-slate-100">Course Review Portal</h1>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Submited by {course.authorHandle}</p>
             </div>
         </div>
         <div className="flex gap-3">
             <button 
                onClick={handleReject}
                className="px-4 py-2 rounded-lg text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50"
             >
                Reject Course
             </button>
             <button 
                onClick={handleApprove}
                className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:shadow-lg"
             >
                Approve & Publish
             </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar: Curriculum Navigation */}
         <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 dark:bg-slate-800 dark:border-slate-700">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <button
                    onClick={() => setActiveView('OVERVIEW')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeView === 'OVERVIEW' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                >
                    <span className="text-lg">📋</span> Course Overview
                </button>
            </div>
            
            <div className="p-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2 dark:text-slate-500">Curriculum Content</h4>
                <div className="space-y-6">
                    {course.modules.map((module, idx) => (
                        <div key={module.id}>
                            <div className="flex items-center gap-2 mb-2 px-2 text-slate-800 font-bold text-xs uppercase tracking-wide dark:text-slate-300">
                                <span className="bg-slate-100 text-slate-500 w-5 h-5 flex items-center justify-center rounded-full dark:bg-slate-700 dark:text-slate-400">{idx + 1}</span>
                                {module.title}
                            </div>
                            <div className="space-y-1 pl-2 border-l-2 border-slate-100 ml-2.5 dark:border-slate-700">
                                {module.chapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => setActiveView(chapter)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                                            (activeView !== 'OVERVIEW' && activeView.id === chapter.id) 
                                            ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400' 
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {chapter.type === 'VIDEO' ? <VideoIcon size={4} /> : <DocumentTextIcon size={4} />}
                                        <span className="truncate">{chapter.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50 p-8 dark:bg-slate-950">
            {activeView === 'OVERVIEW' ? renderOverview() : renderChapterDetail(activeView)}
         </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 dark:text-slate-100 dark:border-slate-700">{title}</h3>
        {children}
    </div>
);

const Badge: React.FC<{label: string, value: string | number, color: 'blue' | 'purple' | 'slate'}> = ({ label, value, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        purple: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
        slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
    };
    return (
        <div className={`flex flex-col px-4 py-2 rounded-lg border ${colors[color]}`}>
            <span className="text-[10px] font-bold uppercase opacity-70">{label}</span>
            <span className="font-bold text-sm">{value}</span>
        </div>
    );
};

const ConfigRow: React.FC<{label: string, value: boolean}> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${value ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
            {value ? 'On' : 'Off'}
        </span>
    </div>
);

// --- Icons ---

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-emerald-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const VideoIcon = ({ size = 5 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-${size} h-${size}`}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const DocumentTextIcon = ({ size = 5 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-${size} h-${size}`}>
    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
  </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

export default CourseReview;
