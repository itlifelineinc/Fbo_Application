import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, Module, Chapter, CourseTrack, CourseLevel, CourseStatus } from '../types';

interface CourseBuilderProps {
  currentUserHandle: string;
  onSubmitCourse: (course: Course) => void;
}

// Initial State Helper
const getEmptyCourse = (authorHandle: string): Course => ({
  id: `draft_${Date.now()}`,
  title: '',
  subtitle: '',
  description: '',
  track: CourseTrack.BASICS,
  level: CourseLevel.BEGINNER,
  targetAudience: [],
  learningOutcomes: [],
  thumbnailUrl: '',
  modules: [],
  status: CourseStatus.DRAFT,
  authorHandle: authorHandle,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  settings: {
    gamificationEnabled: true,
    pointsReward: 100,
    certificateEnabled: true,
    requiresAssessment: false,
    teamOnly: false
  }
});

// --- REUSABLE MEDIA INPUT COMPONENT (Link vs Upload) ---
const MediaInput: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  accept?: string; // e.g. "image/*" or "video/*"
}> = ({ label, value, onChange, placeholder = "https://...", accept = "image/*" }) => {
  const [mode, setMode] = useState<'LINK' | 'UPLOAD'>('LINK');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex bg-slate-100 rounded-lg p-0.5 dark:bg-slate-700">
           <button 
             onClick={() => setMode('LINK')}
             className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'LINK' ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-600 dark:text-emerald-400' : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'}`}
           >
             Link
           </button>
           <button 
             onClick={() => setMode('UPLOAD')}
             className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'UPLOAD' ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-600 dark:text-emerald-400' : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'}`}
           >
             Upload
           </button>
        </div>
      </div>

      {mode === 'LINK' ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
          placeholder={placeholder}
        />
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-emerald-500"
        >
           {value && value.startsWith('data:') ? (
             <div className="relative w-full h-32">
                {accept.includes('video') ? (
                    <div className="flex items-center justify-center h-full bg-black rounded-lg text-white">Video Selected</div>
                ) : (
                    <img src={value} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg transition-opacity">
                    <span className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Click to change</span>
                </div>
             </div>
           ) : (
             <div className="space-y-1 text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm font-medium">Click to upload file</p>
                <p className="text-xs">Supports: JPG, PNG, MP4</p>
             </div>
           )}
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept={accept}
             onChange={handleFileChange}
           />
        </div>
      )}
    </div>
  );
};


const CourseBuilder: React.FC<CourseBuilderProps> = ({ currentUserHandle, onSubmitCourse }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Curriculum, 3: Settings, 4: Review
  const [course, setCourse] = useState<Course>(getEmptyCourse(currentUserHandle));
  
  // State for managing the active chapter being edited
  const [editingChapter, setEditingChapter] = useState<{moduleId: string, chapterId: string} | null>(null);
  
  // Publishing Target State
  const [publishTarget, setPublishTarget] = useState<'GLOBAL' | 'TEAM'>('TEAM');

  // Ref for the step navigation container to handle scrolling
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active step into view on mobile
  useEffect(() => {
    if (stepsContainerRef.current) {
        const activeTab = stepsContainerRef.current.querySelector(`[data-step-id="${step}"]`) as HTMLElement;
        if (activeTab) {
            // Scroll to center the active tab
            const container = stepsContainerRef.current;
            const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
            
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
  }, [step]);

  // --- HANDLERS ---

  const updateCourseInfo = (field: keyof Course, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (field: keyof Course['settings'], value: any) => {
    setCourse(prev => ({ ...prev, settings: { ...prev.settings, [field]: value } }));
  };

  // Module Handlers
  const addModule = () => {
    const newModule: Module = {
      id: `mod_${Date.now()}`,
      title: 'New Module',
      order: course.modules.length + 1,
      chapters: []
    };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const updateModule = (id: string, field: keyof Module, value: any) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  // Chapter Handlers
  const addChapter = (moduleId: string) => {
    const newChapter: Chapter = {
      id: `chap_${Date.now()}`,
      title: 'New Lesson',
      content: '',
      durationMinutes: 10,
      actionSteps: [],
      isPublished: true,
      allowComments: true
    };
    
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, chapters: [...m.chapters, newChapter] };
        }
        return m;
      })
    }));
  };

  const deleteChapter = (e: React.MouseEvent, moduleId: string, chapterId: string) => {
    e.stopPropagation(); // Stop bubbling to parent (which might trigger edit)
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    
    setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    chapters: m.chapters.filter(c => c.id !== chapterId)
                };
            }
            return m;
        })
    }));
  };

  const deleteModule = (moduleId: string) => {
      if(window.confirm('Delete this module?')) {
          setCourse(p => ({ ...p, modules: p.modules.filter(m => m.id !== moduleId) }));
      }
  };

  const updateActiveChapter = (field: keyof Chapter, value: any) => {
    if (!editingChapter) return;
    
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === editingChapter.moduleId) {
          return {
            ...m,
            chapters: m.chapters.map(c => c.id === editingChapter.chapterId ? { ...c, [field]: value } : c)
          };
        }
        return m;
      })
    }));
  };

  const handleSubmit = () => {
    const isGlobal = publishTarget === 'GLOBAL';
    const finalCourse = { 
        ...course, 
        status: isGlobal ? CourseStatus.UNDER_REVIEW : CourseStatus.PUBLISHED,
        settings: {
            ...course.settings,
            teamOnly: !isGlobal
        }
    };
    
    onSubmitCourse(finalCourse);
    
    if (isGlobal) {
        alert("Course submitted for Global Review! An admin will check it shortly.");
    } else {
        alert("Course published to your Team Training portal successfully!");
    }
    
    setCourse(getEmptyCourse(currentUserHandle)); // Reset
    setStep(1);
    navigate('/dashboard');
  };

  // --- RENDERERS ---

  const renderStep1_Info = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 dark:text-slate-100 dark:border-slate-700">Step 1: Course Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Course Title</label>
            <input 
              type="text" 
              value={course.title} 
              onChange={e => updateCourseInfo('title', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
              placeholder="e.g. Product Mastery"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Subtitle</label>
            <input 
              type="text" 
              value={course.subtitle} 
              onChange={e => updateCourseInfo('subtitle', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
              placeholder="Short summary of what the course teaches"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Course Track (Category)</label>
            <select 
              value={course.track} 
              onChange={e => updateCourseInfo('track', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {Object.values(CourseTrack).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Difficulty Level</label>
            <select 
              value={course.level} 
              onChange={e => updateCourseInfo('level', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {Object.values(CourseLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Description</label>
            <textarea 
              value={course.description} 
              onChange={e => updateCourseInfo('description', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none h-32 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
              placeholder="Detailed overview..."
            />
          </div>
          
          <MediaInput 
            label="Course Thumbnail" 
            value={course.thumbnailUrl} 
            onChange={(val) => updateCourseInfo('thumbnailUrl', val)}
          />
          
          <MediaInput 
            label="Promotional Video (Optional)" 
            value={course.trailerVideoUrl || ''} 
            onChange={(val) => updateCourseInfo('trailerVideoUrl', val)}
            accept="video/*"
            placeholder="Youtube/Vimeo Link"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2_Curriculum = () => (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Step 2: Curriculum Builder</h2>
        <button onClick={addModule} className="text-sm bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50">
          + Add Module
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
        {course.modules.length === 0 && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl dark:border-slate-700 dark:text-slate-500">
            Start by adding your first module.
          </div>
        )}
        
        {course.modules.map((module, mIdx) => (
          <div key={module.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
             {/* Module Header */}
             <div className="bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <span className="font-bold text-slate-500 whitespace-nowrap dark:text-slate-400">Module {mIdx + 1}:</span>
                <input 
                  type="text" 
                  value={module.title}
                  onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-emerald-500 outline-none text-slate-900 font-medium placeholder-slate-400 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
                  placeholder="Enter Module Title"
                />
                <button onClick={() => deleteModule(module.id)} className="text-slate-400 hover:text-red-500"><TrashIcon /></button>
                <button onClick={() => addChapter(module.id)} className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:border-emerald-200 font-bold shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:text-emerald-400">
                  + Add Chapter
                </button>
             </div>

             {/* Chapter List */}
             <div className="p-2 space-y-2">
                {module.chapters.length === 0 && <p className="text-xs text-slate-400 text-center py-2 dark:text-slate-500">No chapters yet.</p>}
                {module.chapters.map((chapter, cIdx) => (
                  <div key={chapter.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group border border-transparent hover:border-slate-100 transition-all dark:hover:bg-slate-700/50 dark:hover:border-slate-700">
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{cIdx + 1}</div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{chapter.title}</span>
                     </div>
                     <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setEditingChapter({ moduleId: module.id, chapterId: chapter.id })}
                            className="text-xs text-emerald-600 font-bold hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50"
                        >
                            Edit Content
                        </button>
                        <button 
                            onClick={(e) => deleteChapter(e, module.id, chapter.id)}
                            className="text-xs text-red-500 font-bold hover:text-red-700 bg-red-50 px-2 py-1.5 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
                            title="Delete Chapter"
                        >
                            <TrashIcon />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3_Settings = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 dark:text-slate-100 dark:border-slate-700">Step 3: Enhancements & Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
             <h3 className="font-bold text-emerald-900 dark:text-emerald-400">Gamification</h3>
             <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Certificates</span>
                <input 
                  type="checkbox" 
                  checked={course.settings.certificateEnabled} 
                  onChange={e => updateSettings('certificateEnabled', e.target.checked)} 
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 bg-white accent-emerald-600 dark:bg-slate-700 dark:border-slate-600" 
                />
             </label>
             <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Points Reward</span>
                <input 
                  type="number" 
                  value={course.settings.pointsReward} 
                  onChange={e => updateSettings('pointsReward', parseInt(e.target.value))} 
                  className="w-20 p-2 text-center border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
             </div>
         </div>
      </div>
    </div>
  );

  const renderChapterEditor = () => {
    if (!editingChapter) return null;
    
    const activeModule = course.modules.find(m => m.id === editingChapter.moduleId);
    const activeChapter = activeModule?.chapters.find(c => c.id === editingChapter.chapterId);

    if (!activeChapter) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingChapter(null)} />
         <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right dark:bg-slate-900">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-emerald-900 text-white dark:border-slate-700">
               <div>
                 <h3 className="font-bold text-lg">Edit Chapter Content</h3>
                 <p className="text-xs text-emerald-200">{activeModule?.title} &gt; {activeChapter.title}</p>
               </div>
               <button onClick={() => setEditingChapter(null)} className="text-white hover:bg-white/20 p-2 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950 no-scrollbar">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Chapter Title</label>
                    <input 
                        type="text" 
                        value={activeChapter.title} 
                        onChange={e => updateActiveChapter('title', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:border-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>
                
                <MediaInput 
                    label="Header Image URL" 
                    value={activeChapter.headerImageUrl || ''} 
                    onChange={val => updateActiveChapter('headerImageUrl', val)}
                />

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Chapter Summary (Preview)</label>
                    <textarea 
                        value={activeChapter.summary || ''} 
                        onChange={e => updateActiveChapter('summary', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 h-20 resize-none focus:border-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Main Content (Markdown)</label>
                    <textarea 
                        value={activeChapter.content} 
                        onChange={e => updateActiveChapter('content', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 h-64 font-mono text-sm focus:border-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="# Introduction..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MediaInput 
                        label="Video Material (Optional)" 
                        value={activeChapter.videoUrl || ''} 
                        onChange={val => updateActiveChapter('videoUrl', val)}
                        accept="video/*"
                    />
                    <MediaInput 
                        label="PDF Resource (Optional)" 
                        value={activeChapter.pdfUrl || ''} 
                        onChange={val => updateActiveChapter('pdfUrl', val)}
                        accept=".pdf"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Duration (Minutes)</label>
                    <input 
                        type="number" 
                        value={activeChapter.durationMinutes} 
                        onChange={e => updateActiveChapter('durationMinutes', parseInt(e.target.value))}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:border-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end dark:bg-slate-900 dark:border-slate-700">
                <button onClick={() => setEditingChapter(null)} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors">Done</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col p-4 md:p-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 shrink-0">
         <div className="flex items-center gap-3">
             <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-emerald-700 transition-colors p-1 rounded-lg hover:bg-emerald-50 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400">
                 <ArrowLeftIcon />
             </button>
             <div>
                 <h1 className="font-bold text-xl text-emerald-950 font-heading dark:text-emerald-400">Course Builder</h1>
                 <p className="text-xs text-slate-500 dark:text-slate-400">Create and manage training content</p>
             </div>
         </div>
      </div>

      {renderChapterEditor()}

      <div className="flex flex-col md:flex-row h-full gap-6 overflow-hidden">
        
        {/* Sidebar Steps */}
        <div ref={stepsContainerRef} className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0 h-fit md:h-full dark:bg-slate-800 dark:border-slate-700 no-scrollbar">
           {[
             { id: 1, label: 'Basic Info', icon: '📝' },
             { id: 2, label: 'Curriculum', icon: '📚' },
             { id: 3, label: 'Settings', icon: '⚙️' },
             { id: 4, label: 'Review & Publish', icon: '🚀' },
           ].map(s => (
             <button 
               key={s.id}
               data-step-id={s.id}
               onClick={() => setStep(s.id as any)}
               className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                 step === s.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
               }`}
             >
               <span>{s.icon}</span>
               <span>{s.label}</span>
             </button>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 overflow-y-auto relative min-h-[500px] dark:bg-slate-800 dark:border-slate-700 no-scrollbar">
            
            {step === 1 && renderStep1_Info()}
            {step === 2 && renderStep2_Curriculum()}
            {step === 3 && renderStep3_Settings()}
            
            {step === 4 && (
              <div className="space-y-8 animate-fade-in text-center py-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Publishing Options</h2>
                    <p className="text-slate-500 dark:text-slate-400">Choose where this course will be visible.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {/* Team Only Option */}
                      <button 
                        onClick={() => setPublishTarget('TEAM')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                            publishTarget === 'TEAM' 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
                            : 'border-slate-200 hover:border-emerald-300 dark:border-slate-600 dark:hover:border-slate-500'
                        }`}
                      >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              publishTarget === 'TEAM' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                          }`}>
                              👥
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Team Training (Private)</h3>
                              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Visible only to your downline or people with the link.</p>
                              <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full dark:bg-green-900/30 dark:text-green-300">
                                  Instantly Published
                              </span>
                          </div>
                      </button>

                      {/* Global Option */}
                      <button 
                        onClick={() => setPublishTarget('GLOBAL')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                            publishTarget === 'GLOBAL' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                            : 'border-slate-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-slate-500'
                        }`}
                      >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              publishTarget === 'GLOBAL' ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                          }`}>
                              🌍
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Global Library (Public)</h3>
                              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Visible to ALL FBOs on the platform. Build your reputation.</p>
                              <span className="inline-block mt-3 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full dark:bg-orange-900/30 dark:text-orange-300">
                                  Requires Admin Review
                              </span>
                          </div>
                      </button>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-700 max-w-md mx-auto">
                      <div className="flex justify-between text-sm text-slate-500 mb-6 dark:text-slate-400">
                          <span>Modules: {course.modules.length}</span>
                          <span>Track: {course.track}</span>
                      </div>

                      <button 
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all text-white ${
                            publishTarget === 'GLOBAL' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {publishTarget === 'GLOBAL' ? 'Submit for Global Review' : 'Publish to Team Portal'}
                      </button>
                  </div>
              </div>
            )}
        </div>
      </div>
      
      {/* Navigation Footer (Mobile mainly) */}
      <div className="flex justify-between mt-6 md:hidden pb-6 shrink-0">
          <button 
            disabled={step === 1} 
            onClick={() => setStep(prev => Math.max(1, prev - 1) as any)}
            className="text-slate-500 font-bold disabled:opacity-30 dark:text-slate-400"
          >
            &larr; Back
          </button>
          <button 
            disabled={step === 4} 
            onClick={() => setStep(prev => Math.min(4, prev + 1) as any)}
            className="text-emerald-600 font-bold disabled:opacity-30 dark:text-emerald-400"
          >
            Next &rarr;
          </button>
      </div>
    </div>
  );
};

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export default CourseBuilder;