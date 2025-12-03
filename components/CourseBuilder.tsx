
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, Module, Chapter, CourseTrack, CourseLevel, CourseStatus, ContentBlock, BlockType } from '../types';
import { Eye, X, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronRight, CheckCircle, Menu, BookOpen, Clock, Plus, Trash2, ArrowUp, ArrowDown, LayoutTemplate, Type, Image as ImageIcon, List, Quote, AlertCircle, ArrowLeft } from 'lucide-react';

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

// --- TEMPLATES DEFINITION ---
const TEMPLATES: {id: string, name: string, icon: any, blocks: ContentBlock[]}[] = [
    {
        id: 'blank',
        name: 'Blank Slate',
        icon: FileText,
        blocks: []
    },
    {
        id: 'standard',
        name: 'Standard Lesson',
        icon: BookOpen,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Introduction' },
            { id: '2', type: 'paragraph', content: 'Start with a hook to grab the students attention.' },
            { id: '3', type: 'image', content: '' },
            { id: '4', type: 'heading', style: 'h2', content: 'Key Concepts' },
            { id: '5', type: 'paragraph', content: 'Explain the core material here.' },
            { id: '6', type: 'callout', style: 'tip', content: 'Pro Tip: Remember to emphasize this point.' }
        ]
    },
    {
        id: 'case-study',
        name: 'Case Study',
        icon: CheckCircle,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'The Scenario' },
            { id: '2', type: 'paragraph', content: 'Describe the situation or problem the FBO faced.' },
            { id: '3', type: 'quote', content: 'Include a direct quote from the person involved.' },
            { id: '4', type: 'heading', style: 'h3', content: 'The Solution' },
            { id: '5', type: 'list', style: 'bullet', content: 'Step 1: Identified the need\nStep 2: Recommended product\nStep 3: Followed up' },
            { id: '6', type: 'callout', style: 'info', content: 'Result: 2CC achieved in one week.' }
        ]
    }
];

// --- REUSABLE MEDIA INPUT COMPONENT (Link vs Upload) ---
const MediaInput: React.FC<{ 
  label?: string; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  accept?: string; 
  compact?: boolean;
}> = ({ label, value, onChange, placeholder = "https://...", accept = "image/*", compact = false }) => {
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
    <div className="space-y-2 w-full">
      {label && (
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
            <div className="flex bg-slate-100 rounded-lg p-0.5 dark:bg-slate-700">
            <button onClick={() => setMode('LINK')} className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${mode === 'LINK' ? 'bg-white shadow-sm dark:bg-slate-600' : 'text-slate-500'}`}>Link</button>
            <button onClick={() => setMode('UPLOAD')} className={`px-2 py-0.5 text-xs font-bold rounded-md transition-all ${mode === 'UPLOAD' ? 'bg-white shadow-sm dark:bg-slate-600' : 'text-slate-500'}`}>Upload</button>
            </div>
          </div>
      )}

      {mode === 'LINK' ? (
        <input 
          type="text" 
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${compact ? 'p-2 text-xs' : 'p-3'}`}
          placeholder={placeholder}
        />
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-emerald-50 cursor-pointer flex items-center justify-center text-slate-400 dark:bg-slate-700/50 dark:border-slate-600 ${compact ? 'py-2' : 'aspect-video'}`}
        >
           {value ? (
             <div className="relative w-full h-full p-2">
                <img src={value} alt="Preview" className="w-full h-full object-contain rounded" />
             </div>
           ) : (
             <div className="flex items-center gap-2">
                <ImageIcon size={compact ? 14 : 24} />
                <span className={compact ? 'text-xs' : 'text-sm'}>{compact ? 'Select Image' : 'Click to Upload'}</span>
             </div>
           )}
           <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleFileChange} />
        </div>
      )}
    </div>
  );
};

// --- PREVIEW COMPONENT ---
const CoursePreview: React.FC<{ course: Course; onClose: () => void }> = ({ course, onClose }) => {
    // Mode state: 'LANDING' -> 'MODULES' -> 'PLAYER'
    const [viewMode, setViewMode] = useState<'LANDING' | 'MODULES' | 'PLAYER'>('LANDING');
    
    // Default to first chapter if available
    const [activeChapter, setActiveChapter] = useState<Chapter | null>(() => {
        if (course.modules.length > 0 && course.modules[0].chapters.length > 0) {
            return course.modules[0].chapters[0];
        }
        return null;
    });

    // Mobile sidebar toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeModule = course.modules.find(m => m.chapters.some(c => c.id === activeChapter?.id));

    // Calculate duration
    const totalDuration = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
    const durationStr = totalDuration > 60 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${totalDuration}m`;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col dark:bg-slate-950">
            {/* Preview Toolbar */}
            <div className="bg-slate-900 text-white h-14 flex items-center justify-between px-4 shrink-0 shadow-md z-50">
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Preview Mode</span>
                    <span className="text-sm text-slate-300 hidden sm:inline">Experience your course as a student</span>
                </div>
                <div className="flex items-center gap-3">
                    {viewMode === 'PLAYER' && (
                        <button 
                            onClick={() => setViewMode('MODULES')}
                            className="text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <ArrowLeft size={12} /> Back to Curriculum
                        </button>
                    )}
                    {viewMode === 'MODULES' && (
                        <button 
                            onClick={() => setViewMode('LANDING')}
                            className="text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <ArrowLeft size={12} /> Back to Overview
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                    >
                        <X size={16} /> Exit Preview
                    </button>
                </div>
            </div>

            {viewMode === 'LANDING' ? (
                // --- LANDING PAGE VIEW ---
                <div className="flex-1 overflow-y-auto bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-950">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
                        {/* Thumbnail & Overlay Title */}
                        <div className="h-48 overflow-hidden relative bg-slate-200 dark:bg-slate-700">
                            {course.thumbnailUrl ? (
                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Thumbnail</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="inline-block px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded mb-2 backdrop-blur-sm uppercase tracking-wide">
                                    {course.track}
                                </span>
                                <h1 className="text-xl font-bold text-white font-heading leading-tight shadow-black/50 drop-shadow-md">
                                    {course.title || "Untitled Course"}
                                </h1>
                            </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed dark:text-slate-300">
                                {course.subtitle || course.description || "No description provided."}
                            </p>
                            
                            <div className="space-y-4 mt-auto">
                                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={14} />
                                        <span>{course.modules.length} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>{durationStr}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setViewMode('MODULES')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <PlayCircle size={18} /> Start Learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : viewMode === 'MODULES' ? (
                // --- MODULES LIST VIEW ---
                <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto space-y-8 animate-slide-in-right">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 font-heading dark:text-white">Course Curriculum</h2>
                            <p className="text-slate-500 mt-2 dark:text-slate-400">Select a module to begin your journey.</p>
                        </div>

                        {course.modules.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                <p className="text-slate-400 font-medium">No modules added yet.</p>
                            </div>
                        )}

                        {course.modules.map((mod, idx) => (
                            <div key={mod.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                                <div className="p-6 border-b border-slate-50 flex justify-between items-start dark:border-slate-700">
                                    <div>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 block dark:text-emerald-400">Module {idx + 1}</span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                                        {mod.summary && <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">{mod.summary}</p>}
                                    </div>
                                    <div className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300">
                                        {mod.chapters.length} Lessons
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                    {mod.chapters.map((chap, cIdx) => (
                                        <button 
                                            key={chap.id}
                                            onClick={() => { setActiveChapter(chap); setViewMode('PLAYER'); }}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group dark:hover:bg-slate-700/30"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors dark:border-slate-600 dark:text-slate-500">
                                                    {cIdx + 1}
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors dark:text-slate-200 dark:group-hover:text-emerald-400">{chap.title}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 dark:text-slate-500">
                                                        <Clock size={10} /> {chap.durationMinutes} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                <PlayCircle size={20} />
                                            </div>
                                        </button>
                                    ))}
                                    {mod.chapters.length === 0 && (
                                        <div className="p-4 text-xs text-slate-400 italic text-center">No lessons in this module.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // --- PLAYER VIEW ---
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className={`
                        w-80 bg-slate-50 border-r border-slate-200 flex flex-col absolute inset-y-0 left-0 z-20 transform transition-transform duration-300 lg:static lg:translate-x-0 dark:bg-slate-900 dark:border-slate-800
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 truncate dark:text-slate-100">{course.title || 'Untitled Course'}</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {course.modules.length === 0 && <p className="text-sm text-slate-400 text-center italic">No modules added yet.</p>}
                            {course.modules.map((mod, idx) => (
                                <div key={mod.id}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-2 dark:text-slate-500">Module {idx + 1}: {mod.title}</h3>
                                    <div className="space-y-1">
                                        {mod.chapters.map((chap) => (
                                            <button
                                                key={chap.id}
                                                onClick={() => { setActiveChapter(chap); setIsSidebarOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                                                    activeChapter?.id === chap.id 
                                                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200 font-medium dark:bg-slate-800 dark:text-emerald-400 dark:ring-slate-700' 
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${activeChapter?.id === chap.id ? 'border-emerald-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                                    {activeChapter?.id === chap.id && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                                                </div>
                                                <span className="truncate">{chap.title}</span>
                                            </button>
                                        ))}
                                        {mod.chapters.length === 0 && <p className="text-xs text-slate-400 pl-3 italic">No lessons</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative dark:bg-slate-950">
                        {/* Mobile Header Trigger */}
                        <div className="lg:hidden p-4 border-b border-slate-100 flex items-center gap-3 bg-white dark:bg-slate-900 dark:border-slate-800">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-lg text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <Menu size={20} />
                            </button>
                            <span className="font-bold text-slate-800 truncate dark:text-slate-200">{activeChapter?.title || 'Course Preview'}</span>
                        </div>

                        {activeChapter ? (
                            <div className="flex-1 overflow-y-auto">
                                <div className="max-w-3xl mx-auto px-6 py-10">
                                    {/* Header */}
                                    <div className="mb-8 border-b border-slate-100 pb-6 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-600 mb-2 dark:text-emerald-400">
                                            <span>{activeModule?.title}</span>
                                            <ChevronRight size={12} />
                                            <span>{activeChapter.type}</span>
                                        </div>
                                        <h1 className="text-3xl font-bold text-slate-900 font-heading dark:text-white">{activeChapter.title}</h1>
                                    </div>

                                    {/* Content Render (Blocks or Legacy) */}
                                    {activeChapter.blocks && activeChapter.blocks.length > 0 ? (
                                        <div className="space-y-8">
                                            {activeChapter.blocks.map(block => {
                                                switch(block.type) {
                                                    case 'heading':
                                                        if (block.style === 'h2') return <h2 key={block.id} className="text-2xl font-bold text-slate-800 dark:text-white mt-8 mb-4">{block.content}</h2>;
                                                        if (block.style === 'h3') return <h3 key={block.id} className="text-xl font-bold text-slate-800 dark:text-white mt-6 mb-3">{block.content}</h3>;
                                                        return <h2 key={block.id} className="text-2xl font-bold">{block.content}</h2>;
                                                    case 'paragraph':
                                                        return <p key={block.id} className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{block.content}</p>;
                                                    case 'image':
                                                        return block.content ? <img key={block.id} src={block.content} alt="Lesson Media" className="w-full rounded-xl my-6 shadow-sm" /> : null;
                                                    case 'callout':
                                                        return (
                                                            <div key={block.id} className={`p-6 rounded-xl border-l-4 my-6 ${block.style === 'warning' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'} dark:bg-slate-800`}>
                                                                <p className="font-medium">{block.content}</p>
                                                            </div>
                                                        );
                                                    case 'quote':
                                                        return (
                                                            <blockquote key={block.id} className="border-l-4 border-emerald-500 pl-6 my-8 italic text-xl text-slate-600 dark:text-slate-400">
                                                                "{block.content}"
                                                            </blockquote>
                                                        );
                                                    case 'list':
                                                        return (
                                                            <ul key={block.id} className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                                                                {block.content.split('\n').map((line, i) => <li key={i}>{line}</li>)}
                                                            </ul>
                                                        );
                                                    default: return null;
                                                }
                                            })}
                                        </div>
                                    ) : (
                                        <div className="prose prose-slate prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
                                            <p className="whitespace-pre-wrap">{activeChapter.content || <em className="text-slate-400">No content added yet.</em>}</p>
                                        </div>
                                    )}

                                    {/* Action Steps */}
                                    {activeChapter.actionSteps && activeChapter.actionSteps.length > 0 && (
                                        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6 dark:bg-blue-900/20 dark:border-blue-800">
                                            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 dark:text-blue-300">
                                                <CheckCircle size={18} /> Action Plan
                                            </h3>
                                            <div className="space-y-3">
                                                {activeChapter.actionSteps.map((step, idx) => (
                                                    <label key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                                        <div className="w-5 h-5 rounded border border-blue-300 flex items-center justify-center shrink-0 mt-0.5"></div>
                                                        <span className="text-sm font-medium">{step}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                <PlayCircle size={48} className="mb-4 opacity-50" />
                                <p>Select a chapter from the sidebar to preview content.</p>
                            </div>
                        )}
                    </main>
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
  
  // State for Blocks in the current editor
  const [currentBlocks, setCurrentBlocks] = useState<ContentBlock[]>([]);

  // Publishing Target State
  const [publishTarget, setPublishTarget] = useState<'GLOBAL' | 'TEAM'>('TEAM');
  
  // Preview Mode State
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Ref for the step navigation container to handle scrolling
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // Sync Blocks when opening editor
  useEffect(() => {
      if (editingChapter) {
          const mod = course.modules.find(m => m.id === editingChapter.moduleId);
          const chap = mod?.chapters.find(c => c.id === editingChapter.chapterId);
          // Load existing blocks, or if none, try to make a paragraph block from content string, or empty
          if (chap) {
              if (chap.blocks && chap.blocks.length > 0) {
                  setCurrentBlocks(chap.blocks);
              } else if (chap.content) {
                  setCurrentBlocks([{ id: 'init', type: 'paragraph', content: chap.content }]);
              } else {
                  setCurrentBlocks([]);
              }
          }
      }
  }, [editingChapter]);

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
      blocks: [],
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

  // --- BLOCK EDITOR HANDLERS ---

  const addBlock = (type: BlockType, style?: any) => {
      const newBlock: ContentBlock = {
          id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          content: '',
          style
      };
      setCurrentBlocks(prev => [...prev, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
      setCurrentBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const deleteBlock = (id: string) => {
      setCurrentBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === currentBlocks.length - 1) return;
      
      const newBlocks = [...currentBlocks];
      const temp = newBlocks[index];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      newBlocks[index] = newBlocks[targetIndex];
      newBlocks[targetIndex] = temp;
      
      setCurrentBlocks(newBlocks);
  };

  const applyTemplate = (templateId: string) => {
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) {
          if (currentBlocks.length > 0 && !window.confirm('This will replace your current content. Continue?')) return;
          // Deep copy to give unique IDs
          const newBlocks = template.blocks.map(b => ({ ...b, id: `blk_${Date.now()}_${Math.random()}` }));
          setCurrentBlocks(newBlocks);
      }
  };

  // Save the blocks back to the course state
  const saveBlocksToChapter = () => {
      if (!editingChapter) return;
      
      // Compile blocks to simple HTML string for backward compatibility
      let htmlContent = '';
      currentBlocks.forEach(b => {
          if (b.type === 'heading') htmlContent += `<h3>${b.content}</h3>\n`;
          if (b.type === 'paragraph') htmlContent += `<p>${b.content}</p>\n`;
          if (b.type === 'image') htmlContent += `<img src="${b.content}" class="w-full rounded-lg" />\n`;
          if (b.type === 'list') htmlContent += `<ul>${b.content.split('\n').map(l => `<li>${l}</li>`).join('')}</ul>\n`;
          if (b.type === 'quote') htmlContent += `<blockquote>${b.content}</blockquote>\n`;
          if (b.type === 'callout') htmlContent += `<div class="callout">${b.content}</div>\n`;
      });

      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => {
          if (m.id === editingChapter.moduleId) {
            return {
              ...m,
              chapters: m.chapters.map(c => c.id === editingChapter.chapterId ? { 
                  ...c, 
                  blocks: currentBlocks,
                  content: htmlContent // Save fallback string
              } : c)
            };
          }
          return m;
        })
      }));
      setEditingChapter(null);
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
            label="Course Thumbnail (16:9 Aspect Ratio)" 
            value={course.thumbnailUrl} 
            onChange={(val) => updateCourseInfo('thumbnailUrl', val)}
            accept="image/png, image/jpeg, image/jpg, image/webp"
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
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={saveBlocksToChapter} />
         <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white z-10 dark:bg-slate-900 dark:border-slate-700">
               <div className="flex items-center gap-4">
                   <button onClick={saveBlocksToChapter} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
                        <X size={20} />
                   </button>
                   <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Edit Chapter Content</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activeModule?.title} &gt; {activeChapter.title}</p>
                   </div>
               </div>
               <div className="flex gap-2">
                   {/* Template Selector */}
                   <div className="relative group">
                       <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50">
                           <LayoutTemplate size={14} /> Templates
                       </button>
                       <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50 dark:bg-slate-800 dark:border-slate-700">
                           {TEMPLATES.map(t => (
                               <button 
                                key={t.id} 
                                onClick={() => applyTemplate(t.id)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 dark:text-slate-300 dark:hover:bg-slate-700"
                               >
                                   <t.icon size={14} /> {t.name}
                               </button>
                           ))}
                       </div>
                   </div>
                   <button onClick={saveBlocksToChapter} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-sm">Save & Close</button>
               </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-2xl mx-auto space-y-6 pb-20">
                        
                        {/* Meta Fields */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Chapter Details</label>
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    value={activeChapter.title} 
                                    onChange={e => updateActiveChapter('title', e.target.value)}
                                    className="w-full p-2 border-b border-slate-200 text-xl font-bold focus:border-emerald-500 outline-none bg-transparent dark:border-slate-700 dark:text-white"
                                    placeholder="Chapter Title"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <MediaInput 
                                        label="Header Image" 
                                        value={activeChapter.headerImageUrl || ''} 
                                        onChange={val => updateActiveChapter('headerImageUrl', val)}
                                        compact
                                    />
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Duration (Min)</label>
                                        <input 
                                            type="number" 
                                            value={activeChapter.durationMinutes} 
                                            onChange={e => updateActiveChapter('durationMinutes', parseInt(e.target.value))}
                                            className="w-full p-2 border border-slate-200 rounded bg-white text-sm outline-none focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blocks Editor */}
                        <div className="space-y-4">
                            {currentBlocks.map((block, idx) => (
                                <div key={block.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700">
                                    {/* Block Controls */}
                                    <div className="absolute -right-3 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => moveBlock(idx, 'up')} className="bg-white border border-slate-200 p-1 rounded hover:bg-slate-50 text-slate-500 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"><ArrowUp size={12} /></button>
                                        <button onClick={() => moveBlock(idx, 'down')} className="bg-white border border-slate-200 p-1 rounded hover:bg-slate-50 text-slate-500 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"><ArrowDown size={12} /></button>
                                        <button onClick={() => deleteBlock(block.id)} className="bg-white border border-slate-200 p-1 rounded hover:bg-red-50 text-red-500 shadow-sm dark:bg-slate-700 dark:border-slate-600"><Trash2 size={12} /></button>
                                    </div>

                                    {/* Block Content */}
                                    {block.type === 'heading' && (
                                        <div className="flex gap-2">
                                            <select 
                                                value={block.style || 'h2'} 
                                                onChange={e => {
                                                    const newBlocks = [...currentBlocks];
                                                    newBlocks[idx].style = e.target.value as any;
                                                    setCurrentBlocks(newBlocks);
                                                }}
                                                className="bg-slate-100 border-none rounded text-xs font-bold text-slate-500 outline-none w-16 dark:bg-slate-700 dark:text-slate-300"
                                            >
                                                <option value="h1">H1</option>
                                                <option value="h2">H2</option>
                                                <option value="h3">H3</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className={`w-full outline-none font-bold placeholder-slate-300 dark:bg-transparent dark:text-white ${block.style === 'h1' ? 'text-2xl' : block.style === 'h3' ? 'text-lg' : 'text-xl'}`}
                                                placeholder="Heading Text"
                                            />
                                        </div>
                                    )}

                                    {block.type === 'paragraph' && (
                                        <textarea 
                                            value={block.content} 
                                            onChange={e => updateBlock(block.id, e.target.value)}
                                            className="w-full outline-none text-slate-700 resize-none h-24 bg-transparent dark:text-slate-300"
                                            placeholder="Type your paragraph here..."
                                        />
                                    )}

                                    {block.type === 'quote' && (
                                        <div className="flex gap-3">
                                            <div className="w-1 bg-emerald-500 rounded-full"></div>
                                            <textarea 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className="w-full outline-none text-slate-600 italic resize-none h-20 bg-transparent dark:text-slate-400"
                                                placeholder="Enter quote..."
                                            />
                                        </div>
                                    )}

                                    {block.type === 'image' && (
                                        <MediaInput 
                                            value={block.content} 
                                            onChange={val => updateBlock(block.id, val)}
                                            compact
                                        />
                                    )}

                                    {block.type === 'list' && (
                                        <div className="flex gap-2">
                                            <div className="mt-2"><List size={16} className="text-slate-400" /></div>
                                            <textarea 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className="w-full outline-none text-slate-700 resize-none h-32 bg-transparent dark:text-slate-300"
                                                placeholder="List items (one per line)..."
                                            />
                                        </div>
                                    )}

                                    {block.type === 'callout' && (
                                        <div className={`p-3 rounded-lg border-l-4 flex gap-3 ${block.style === 'warning' ? 'bg-red-50 border-red-400 dark:bg-red-900/20' : 'bg-blue-50 border-blue-400 dark:bg-blue-900/20'}`}>
                                            <select 
                                                value={block.style || 'info'} 
                                                onChange={e => {
                                                    const newBlocks = [...currentBlocks];
                                                    newBlocks[idx].style = e.target.value as any;
                                                    setCurrentBlocks(newBlocks);
                                                }}
                                                className="bg-transparent text-xs font-bold opacity-50 outline-none w-16 dark:text-white"
                                            >
                                                <option value="info">Info</option>
                                                <option value="warning">Warn</option>
                                                <option value="tip">Tip</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-800 dark:text-slate-200"
                                                placeholder="Callout text..."
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Empty State */}
                            {currentBlocks.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 dark:border-slate-700 dark:text-slate-500">
                                    <p>No content blocks yet.</p>
                                    <p className="text-xs mt-1">Use the toolbar below to add content.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Toolbar (Sticky) */}
                <div className="bg-white border-t border-slate-200 p-4 shrink-0 z-20 dark:bg-slate-900 dark:border-slate-700">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <div className="text-xs font-bold text-slate-400 uppercase mr-2 dark:text-slate-500">Add:</div>
                        <ToolbarBtn icon={Type} label="Text" onClick={() => addBlock('paragraph')} />
                        <ToolbarBtn icon={LayoutTemplate} label="Header" onClick={() => addBlock('heading', 'h2')} />
                        <ToolbarBtn icon={ImageIcon} label="Image" onClick={() => addBlock('image')} />
                        <ToolbarBtn icon={List} label="List" onClick={() => addBlock('list')} />
                        <ToolbarBtn icon={Quote} label="Quote" onClick={() => addBlock('quote')} />
                        <ToolbarBtn icon={AlertCircle} label="Callout" onClick={() => addBlock('callout', 'info')} />
                    </div>
                </div>
            </div>
         </div>
      </div>
    );
  }

  // --- PREVIEW MODE HANDLER ---
  if (isPreviewMode) {
      return <CoursePreview course={course} onClose={() => setIsPreviewMode(false)} />;
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
         
         {/* Toggle Preview Button */}
         <button 
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-all dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
         >
            <Eye size={16} /> Preview Course
         </button>
      </div>

      {renderChapterEditor()}

      {/* Main Container - Changed h-full to flex-1 min-h-0 to fix overflow issues */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-6 overflow-hidden">
        
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
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 overflow-y-auto relative h-full dark:bg-slate-800 dark:border-slate-700 no-scrollbar">
            
            {step === 1 && renderStep1_Info()}
            {step === 2 && renderStep2_Curriculum()}
            {step === 3 && renderStep3_Settings()}
            
            {step === 4 && (
              <div className="space-y-8 animate-fade-in text-center py-6 pb-20">
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

const ToolbarBtn: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors font-medium text-xs whitespace-nowrap dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
    >
        <Icon size={14} /> {label}
    </button>
);

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
