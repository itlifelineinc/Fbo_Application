
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, Module, Chapter, CourseTrack, CourseLevel, CourseStatus, ContentBlock, BlockType } from '../types';
import { Eye, X, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronRight, CheckCircle, Menu, BookOpen, Clock, Plus, Trash2, ArrowUp, ArrowDown, LayoutTemplate, Type, Image as ImageIcon, List, Quote, AlertCircle, ArrowLeft, ShoppingBag, Users, Sparkles, Save } from 'lucide-react';

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
const TEMPLATES: {id: string, name: string, description: string, icon: any, blocks: ContentBlock[]}[] = [
    {
        id: 'blank',
        name: 'Blank Slate',
        description: 'Start fresh with an empty canvas.',
        icon: FileText,
        blocks: []
    },
    {
        id: 'standard',
        name: 'Standard Lesson',
        description: 'Classic lecture format with intro & summary.',
        icon: BookOpen,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Introduction' },
            { id: '2', type: 'paragraph', content: 'Start with a hook to grab the students attention and explain what they will learn.' },
            { id: '3', type: 'image', content: '' },
            { id: '4', type: 'heading', style: 'h2', content: 'Core Concepts' },
            { id: '5', type: 'paragraph', content: 'Explain the main topic in detail here. Break it down into digestible parts.' },
            { id: '6', type: 'callout', style: 'tip', content: 'Pro Tip: Remember to emphasize this key takeaway.' }
        ]
    },
    {
        id: 'case-study',
        name: 'Case Study',
        description: 'Real-world scenario analysis.',
        icon: Users,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'The Scenario' },
            { id: '2', type: 'paragraph', content: 'Describe a specific situation or problem an FBO faced in the field.' },
            { id: '3', type: 'quote', content: 'Include a direct quote from the person involved to add authenticity.' },
            { id: '4', type: 'heading', style: 'h3', content: 'The Approach' },
            { id: '5', type: 'list', style: 'bullet', content: 'Step 1: Identified the customer need\nStep 2: Recommended the C9 Pack\nStep 3: Followed up after 3 days' },
            { id: '6', type: 'callout', style: 'info', content: 'Result: 2CC achieved in one week and a loyal customer gained.' }
        ]
    },
    {
        id: 'product-spotlight',
        name: 'Product Spotlight',
        description: 'Deep dive into a specific product.',
        icon: ShoppingBag,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Product Overview' },
            { id: '2', type: 'image', content: '' },
            { id: '3', type: 'paragraph', content: 'Briefly describe what the product is and who it is for.' },
            { id: '4', type: 'heading', style: 'h3', content: 'Key Benefits' },
            { id: '5', type: 'list', style: 'bullet', content: 'Benefit 1: Supports immune health\nBenefit 2: High in vitamins\nBenefit 3: Great taste' },
            { id: '6', type: 'callout', style: 'warning', content: 'Compliance Note: Do not make medical claims.' }
        ]
    }
];

// --- STYLES ---
const INPUT_CLASS = "w-full bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl px-4 py-3 outline-none transition-all duration-200 font-medium text-slate-700 placeholder-slate-400 dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:focus:border-emerald-500";
const LABEL_CLASS = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 dark:text-slate-500";
const CARD_CLASS = "bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:shadow-none";

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Extract YouTube Thumbnail
      const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = val.match(ytRegex);
      
      if (match && match[2].length === 11) {
          onChange(`https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`);
      } else {
          onChange(val);
      }
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
          <div className="flex justify-between items-center mb-1">
            <label className={LABEL_CLASS}>{label}</label>
            <div className="flex bg-slate-100 rounded-lg p-0.5 dark:bg-slate-700">
            <button onClick={() => setMode('LINK')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${mode === 'LINK' ? 'bg-white shadow-sm text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Link</button>
            <button onClick={() => setMode('UPLOAD')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${mode === 'UPLOAD' ? 'bg-white shadow-sm text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Upload</button>
            </div>
          </div>
      )}

      {mode === 'LINK' ? (
        <div className="space-y-3">
            <input 
                type="text" 
                value={value}
                onChange={handleTextChange}
                className={compact ? INPUT_CLASS.replace('px-4 py-3', 'px-3 py-2 text-sm') : INPUT_CLASS}
                placeholder={placeholder}
            />
            {value && !compact && (
                <div className="relative h-48 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
            )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-center text-slate-400 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:border-emerald-500 ${compact ? 'py-3' : 'aspect-video'}`}
        >
           {value ? (
             <div className="relative w-full h-full p-2">
                <img src={value} alt="Preview" className="w-full h-full object-contain rounded-xl" />
             </div>
           ) : (
             <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white rounded-full shadow-sm dark:bg-slate-800"><ImageIcon size={compact ? 16 : 24} /></div>
                <span className={compact ? 'text-xs font-bold' : 'text-sm font-bold'}>{compact ? 'Select Image' : 'Click to Upload'}</span>
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
        <div className="fixed inset-0 z-50 bg-white flex flex-col dark:bg-slate-950 animate-fade-in">
            {/* Preview Toolbar */}
            <div className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shrink-0 shadow-md z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Preview Mode</div>
                    <span className="text-sm text-slate-300 hidden sm:inline border-l border-slate-700 pl-4">Experience your course as a student</span>
                </div>
                <div className="flex items-center gap-3">
                    {viewMode === 'PLAYER' && (
                        <button 
                            onClick={() => setViewMode('MODULES')}
                            className="text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft size={14} /> Back to Curriculum
                        </button>
                    )}
                    {viewMode === 'MODULES' && (
                        <button 
                            onClick={() => setViewMode('LANDING')}
                            className="text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft size={14} /> Back to Overview
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 px-5 py-2 rounded-full transition-colors shadow-sm"
                    >
                        <X size={16} /> Exit Preview
                    </button>
                </div>
            </div>

            {viewMode === 'LANDING' ? (
                // --- LANDING PAGE VIEW ---
                <div className="flex-1 overflow-y-auto bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-950">
                    <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
                        {/* Thumbnail & Overlay Title */}
                        <div className="h-56 overflow-hidden relative bg-slate-200 dark:bg-slate-700">
                            {course.thumbnailUrl ? (
                                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Thumbnail</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded mb-2 backdrop-blur-sm uppercase tracking-wide">
                                    {course.track}
                                </span>
                                <h1 className="text-2xl font-bold text-white font-heading leading-tight shadow-black/50 drop-shadow-md">
                                    {course.title || "Untitled Course"}
                                </h1>
                            </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-8 flex-1 flex flex-col">
                            <p className="text-sm text-slate-600 mb-8 flex-1 line-clamp-4 leading-relaxed dark:text-slate-300">
                                {course.subtitle || course.description || "No description provided."}
                            </p>
                            
                            <div className="space-y-6 mt-auto">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={14} />
                                        <span>{course.modules.length} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>{durationStr}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setViewMode('MODULES')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <PlayCircle size={20} /> Start Learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : viewMode === 'MODULES' ? (
                // --- MODULES LIST VIEW ---
                <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto space-y-10 animate-slide-in-right">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-slate-900 font-heading dark:text-white">Course Curriculum</h2>
                            <p className="text-slate-500 mt-3 dark:text-slate-400 text-lg">Select a module to begin your journey.</p>
                        </div>

                        {course.modules.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                <p className="text-slate-400 font-medium text-lg">No modules added yet.</p>
                            </div>
                        )}

                        {course.modules.map((mod, idx) => (
                            <div key={mod.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition-shadow">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-start dark:border-slate-700">
                                    <div>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block dark:text-emerald-400">Module {idx + 1}</span>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                                        {mod.summary && <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">{mod.summary}</p>}
                                    </div>
                                    <div className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-full dark:bg-slate-700 dark:text-slate-300">
                                        {mod.chapters.length} Lessons
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                    {mod.chapters.map((chap, cIdx) => (
                                        <button 
                                            key={chap.id}
                                            onClick={() => { setActiveChapter(chap); setViewMode('PLAYER'); }}
                                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left group dark:hover:bg-slate-700/30"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors dark:border-slate-600 dark:text-slate-500">
                                                    {cIdx + 1}
                                                </div>
                                                <div>
                                                    <span className="block text-base font-bold text-slate-700 group-hover:text-emerald-700 transition-colors dark:text-slate-200 dark:group-hover:text-emerald-400">{chap.title}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1 dark:text-slate-500">
                                                        <Clock size={12} /> {chap.durationMinutes} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                <PlayCircle size={24} />
                                            </div>
                                        </button>
                                    ))}
                                    {mod.chapters.length === 0 && (
                                        <div className="p-6 text-sm text-slate-400 italic text-center">No lessons in this module.</div>
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
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 truncate dark:text-slate-100">{course.title || 'Untitled Course'}</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-8">
                            {course.modules.length === 0 && <p className="text-sm text-slate-400 text-center italic mt-10">No modules added yet.</p>}
                            {course.modules.map((mod, idx) => (
                                <div key={mod.id}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3 dark:text-slate-500">Module {idx + 1}: {mod.title}</h3>
                                    <div className="space-y-1">
                                        {mod.chapters.map((chap) => (
                                            <button
                                                key={chap.id}
                                                onClick={() => { setActiveChapter(chap); setIsSidebarOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left transition-all ${
                                                    activeChapter?.id === chap.id 
                                                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200 font-medium dark:bg-slate-800 dark:text-emerald-400 dark:ring-slate-700' 
                                                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${activeChapter?.id === chap.id ? 'border-emerald-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                                    {activeChapter?.id === chap.id && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                                                </div>
                                                <span className="truncate">{chap.title}</span>
                                            </button>
                                        ))}
                                        {mod.chapters.length === 0 && <p className="text-xs text-slate-400 pl-4 italic">No lessons</p>}
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
                                <div className="max-w-3xl mx-auto px-8 py-16">
                                    {/* Header */}
                                    <div className="mb-12 border-b border-slate-100 pb-8 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-600 mb-3 dark:text-emerald-400">
                                            <span>{activeModule?.title}</span>
                                            <ChevronRight size={12} />
                                            <span>{activeChapter.type}</span>
                                        </div>
                                        <h1 className="text-4xl font-bold text-slate-900 font-heading dark:text-white leading-tight">{activeChapter.title}</h1>
                                    </div>

                                    {/* Content Render (Blocks or Legacy) */}
                                    {activeChapter.blocks && activeChapter.blocks.length > 0 ? (
                                        <div className="space-y-10">
                                            {activeChapter.blocks.map(block => {
                                                switch(block.type) {
                                                    case 'heading':
                                                        if (block.style === 'h2') return <h2 key={block.id} className="text-3xl font-bold text-slate-800 dark:text-white mt-10 mb-5">{block.content}</h2>;
                                                        if (block.style === 'h3') return <h3 key={block.id} className="text-2xl font-bold text-slate-800 dark:text-white mt-8 mb-4">{block.content}</h3>;
                                                        return <h2 key={block.id} className="text-3xl font-bold">{block.content}</h2>;
                                                    case 'paragraph':
                                                        return <p key={block.id} className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{block.content}</p>;
                                                    case 'image':
                                                        return block.content ? <img key={block.id} src={block.content} alt="Lesson Media" className="w-full rounded-2xl my-8 shadow-md" /> : null;
                                                    case 'callout':
                                                        return (
                                                            <div key={block.id} className={`p-8 rounded-2xl border-l-4 my-8 ${block.style === 'warning' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'} dark:bg-slate-800`}>
                                                                <p className="font-medium text-lg">{block.content}</p>
                                                            </div>
                                                        );
                                                    case 'quote':
                                                        return (
                                                            <blockquote key={block.id} className="border-l-4 border-emerald-500 pl-8 my-10 italic text-2xl text-slate-500 dark:text-slate-400 font-heading">
                                                                "{block.content}"
                                                            </blockquote>
                                                        );
                                                    case 'list':
                                                        return (
                                                            <ul key={block.id} className="list-disc pl-6 space-y-3 text-lg text-slate-700 dark:text-slate-300 my-6">
                                                                {block.content.split('\n').map((line, i) => <li key={i}>{line}</li>)}
                                                            </ul>
                                                        );
                                                    default: return null;
                                                }
                                            })}
                                        </div>
                                    ) : (
                                        <div className="prose prose-slate prose-lg max-w-none text-slate-600 dark:prose-invert dark:text-slate-300">
                                            <p className="whitespace-pre-wrap">{activeChapter.content || <em className="text-slate-400">No content added yet.</em>}</p>
                                        </div>
                                    )}

                                    {/* Action Steps */}
                                    {activeChapter.actionSteps && activeChapter.actionSteps.length > 0 && (
                                        <div className="mt-16 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 dark:bg-emerald-900/20 dark:border-emerald-800">
                                            <h3 className="font-bold text-emerald-900 mb-6 flex items-center gap-3 text-lg dark:text-emerald-300">
                                                <CheckCircle size={24} /> Action Plan
                                            </h3>
                                            <div className="space-y-4">
                                                {activeChapter.actionSteps.map((step, idx) => (
                                                    <label key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-emerald-100 cursor-pointer hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-all">
                                                        <div className="w-6 h-6 rounded-full border-2 border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-400">{idx+1}</div>
                                                        <span className="text-base font-medium">{step}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                <PlayCircle size={64} className="mb-6 opacity-20" />
                                <p className="text-lg font-medium">Select a chapter to preview content.</p>
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
    <div className="space-y-8 animate-fade-in">
      <div className={CARD_CLASS}>
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-6 mb-6 font-heading dark:text-slate-100 dark:border-slate-700">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <label className={LABEL_CLASS}>Course Title</label>
                    <input 
                        type="text" 
                        value={course.title} 
                        onChange={e => updateCourseInfo('title', e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="e.g. Product Mastery"
                    />
                </div>
                <div>
                    <label className={LABEL_CLASS}>Subtitle</label>
                    <input 
                        type="text" 
                        value={course.subtitle} 
                        onChange={e => updateCourseInfo('subtitle', e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Short summary of what the course teaches"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>Course Track</label>
                        <select 
                            value={course.track} 
                            onChange={e => updateCourseInfo('track', e.target.value)}
                            className={`${INPUT_CLASS} appearance-none`}
                        >
                            {Object.values(CourseTrack).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Difficulty</label>
                        <select 
                            value={course.level} 
                            onChange={e => updateCourseInfo('level', e.target.value)}
                            className={`${INPUT_CLASS} appearance-none`}
                        >
                            {Object.values(CourseLevel).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={LABEL_CLASS}>Description</label>
                    <textarea 
                        value={course.description} 
                        onChange={e => updateCourseInfo('description', e.target.value)}
                        className={`${INPUT_CLASS} h-40 resize-none`}
                        placeholder="Detailed overview..."
                    />
                </div>
                <MediaInput 
                    label="Course Thumbnail" 
                    value={course.thumbnailUrl} 
                    onChange={(val) => updateCourseInfo('thumbnailUrl', val)}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                />
            </div>
        </div>
      </div>
    </div>
  );

  const renderStep2_Curriculum = () => (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">Curriculum</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Structure your course with modules and lessons.</p>
        </div>
        <button onClick={addModule} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:shadow-none flex items-center gap-2">
          <Plus size={18} /> New Module
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar pb-20">
        {course.modules.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm dark:bg-slate-800">
                <BookOpen className="text-slate-300" size={24} />
            </div>
            <p className="text-slate-500 font-bold dark:text-slate-400">Start by adding your first module.</p>
          </div>
        )}
        
        {course.modules.map((module, mIdx) => (
          <div key={module.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 group transition-all hover:shadow-md">
             {/* Module Header */}
             <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0 dark:bg-slate-700 dark:text-slate-400">
                    {mIdx + 1}
                </div>
                <input 
                  type="text" 
                  value={module.title}
                  onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                  className="flex-1 bg-transparent border-none p-0 text-lg font-bold text-slate-900 placeholder-slate-400 focus:ring-0 dark:text-white"
                  placeholder="Module Title (e.g. Introduction)"
                />
                <div className="flex items-center gap-2">
                    <button onClick={() => addChapter(module.id)} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-bold hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400">
                    + Lesson
                    </button>
                    <button onClick={() => deleteModule(module.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
                </div>
             </div>

             {/* Chapter List */}
             <div className="p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
                {module.chapters.length === 0 && <p className="text-xs text-slate-400 text-center py-4 italic">No lessons yet.</p>}
                {module.chapters.map((chapter, cIdx) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group/chapter shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-500/30">
                     <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{cIdx + 1}</div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{chapter.title}</span>
                        {chapter.durationMinutes > 0 && (
                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded dark:bg-slate-700 dark:text-slate-500">{chapter.durationMinutes}m</span>
                        )}
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setEditingChapter({ moduleId: module.id, chapterId: chapter.id })}
                            className="text-xs text-slate-600 font-bold hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                        >
                            Edit Content
                        </button>
                        <button 
                            onClick={(e) => deleteChapter(e, module.id, chapter.id)}
                            className="text-slate-300 hover:text-red-500 p-1.5 transition-colors"
                        >
                            <X size={16} />
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
    <div className="space-y-8 animate-fade-in">
      <div className={CARD_CLASS}>
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-6 mb-6 font-heading dark:text-slate-100 dark:border-slate-700">Course Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gamification</h3>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Enable Certificates</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={course.settings.certificateEnabled} onChange={e => updateSettings('certificateEnabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">XP Points Reward</span>
                    <input 
                        type="number" 
                        value={course.settings.pointsReward} 
                        onChange={e => updateSettings('pointsReward', parseInt(e.target.value))} 
                        className="w-20 p-2 text-center text-sm font-bold bg-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                    />
                </div>
            </div>
            
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Access Control</h3>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Assessment Required</span>
                        <span className="text-xs text-slate-400">Users must pass quiz to complete</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={course.settings.requiresAssessment} onChange={e => updateSettings('requiresAssessment', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div>
                    </label>
                </div>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={saveBlocksToChapter} />
         <div className="relative w-full max-w-5xl bg-white h-[90vh] shadow-2xl flex flex-col rounded-3xl overflow-hidden ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center gap-6">
                   <button onClick={saveBlocksToChapter} className="text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white">
                        <ArrowLeft size={24} />
                   </button>
                   <div>
                        <h3 className="font-bold text-xl text-slate-900 font-heading dark:text-white">Edit Lesson</h3>
                        <p className="text-xs text-slate-500 font-medium dark:text-slate-400">{activeModule?.title} / <span className="text-emerald-600 dark:text-emerald-400">{activeChapter.title}</span></p>
                   </div>
               </div>
               <div className="flex gap-4 items-center">
                   {/* Template Selector */}
                   <div className="relative group">
                       <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                           <LayoutTemplate size={16} /> Templates
                       </button>
                       <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 dark:bg-slate-800 dark:border-slate-700 animate-fade-in">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">Quick Start</div>
                           {TEMPLATES.map(t => (
                               <button 
                                key={t.id} 
                                onClick={() => applyTemplate(t.id)}
                                className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-xl flex items-start gap-3 transition-colors dark:hover:bg-slate-700/50"
                               >
                                   <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                                      <t.icon size={16} />
                                   </div>
                                   <div>
                                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.name}</div>
                                      <div className="text-xs text-slate-500 mt-0.5 leading-tight dark:text-slate-400">{t.description}</div>
                                   </div>
                               </button>
                           ))}
                       </div>
                   </div>
                   <button onClick={saveBlocksToChapter} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm shadow-lg shadow-slate-200 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:shadow-none flex items-center gap-2">
                       <Save size={16} /> Save Changes
                   </button>
               </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-3xl mx-auto py-12 px-8 pb-32 space-y-10">
                        
                        {/* Meta Fields Card */}
                        <div className={CARD_CLASS}>
                            <div className="flex justify-between items-center mb-6">
                                <h4 className={LABEL_CLASS}>Lesson Metadata</h4>
                                <span className="text-xs font-mono text-slate-300 dark:text-slate-600">ID: {activeChapter.id}</span>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className={LABEL_CLASS}>Title</label>
                                    <input 
                                        type="text" 
                                        value={activeChapter.title} 
                                        onChange={e => updateActiveChapter('title', e.target.value)}
                                        className="w-full p-0 border-b border-slate-200 text-2xl font-bold font-heading focus:border-emerald-500 focus:ring-0 outline-none bg-transparent text-slate-900 py-2 dark:border-slate-700 dark:text-white"
                                        placeholder="Enter lesson title..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <MediaInput 
                                        label="Header Image (Optional)" 
                                        value={activeChapter.headerImageUrl || ''} 
                                        onChange={val => updateActiveChapter('headerImageUrl', val)}
                                        compact
                                    />
                                    <div>
                                        <label className={LABEL_CLASS}>Duration (Minutes)</label>
                                        <input 
                                            type="number" 
                                            value={activeChapter.durationMinutes} 
                                            onChange={e => updateActiveChapter('durationMinutes', parseInt(e.target.value))}
                                            className={INPUT_CLASS}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px bg-slate-200 flex-1 dark:bg-slate-800"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-500">Content</span>
                            <div className="h-px bg-slate-200 flex-1 dark:bg-slate-800"></div>
                        </div>

                        {/* Blocks Editor */}
                        <div className="space-y-4 min-h-[300px]">
                            {currentBlocks.map((block, idx) => (
                                <div key={block.id} className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:border-emerald-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none">
                                    {/* Block Controls */}
                                    <div className="absolute -right-3 top-6 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white p-1 rounded-xl border border-slate-100 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                        <button onClick={() => moveBlock(idx, 'up')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:bg-slate-700 dark:text-slate-500"><ArrowUp size={14} /></button>
                                        <button onClick={() => moveBlock(idx, 'down')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:bg-slate-700 dark:text-slate-500"><ArrowDown size={14} /></button>
                                        <div className="w-4 h-px bg-slate-100 mx-auto my-1 dark:bg-slate-700"></div>
                                        <button onClick={() => deleteBlock(block.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 dark:hover:bg-red-900/30"><Trash2 size={14} /></button>
                                    </div>

                                    {/* Block Content */}
                                    {block.type === 'heading' && (
                                        <div className="flex gap-4 items-center">
                                            <div className="text-xs font-bold text-slate-300 w-8 text-right font-mono">H{block.style === 'h1' ? '1' : block.style === 'h3' ? '3' : '2'}</div>
                                            <select 
                                                value={block.style || 'h2'} 
                                                onChange={e => {
                                                    const newBlocks = [...currentBlocks];
                                                    newBlocks[idx].style = e.target.value as any;
                                                    setCurrentBlocks(newBlocks);
                                                }}
                                                className="opacity-0 w-0 h-0 absolute" 
                                            />
                                            <input 
                                                type="text" 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className={`w-full outline-none font-bold placeholder-slate-200 bg-transparent font-heading dark:text-white dark:placeholder-slate-700 ${block.style === 'h1' ? 'text-4xl' : block.style === 'h3' ? 'text-xl' : 'text-2xl'}`}
                                                placeholder="Heading Text"
                                            />
                                        </div>
                                    )}

                                    {block.type === 'paragraph' && (
                                        <textarea 
                                            value={block.content} 
                                            onChange={e => updateBlock(block.id, e.target.value)}
                                            className="w-full outline-none text-slate-600 resize-none h-auto min-h-[5rem] bg-transparent text-lg leading-relaxed dark:text-slate-300 dark:placeholder-slate-700"
                                            placeholder="Type your paragraph here..."
                                        />
                                    )}

                                    {block.type === 'quote' && (
                                        <div className="flex gap-6">
                                            <div className="w-1 bg-emerald-400 rounded-full shrink-0"></div>
                                            <textarea 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className="w-full outline-none text-slate-500 italic resize-none h-auto min-h-[4rem] text-xl font-serif bg-transparent dark:text-slate-400"
                                                placeholder="Enter quote..."
                                            />
                                        </div>
                                    )}

                                    {block.type === 'image' && (
                                        <div className="space-y-3">
                                            <label className={LABEL_CLASS}>Image Block</label>
                                            <MediaInput 
                                                value={block.content} 
                                                onChange={val => updateBlock(block.id, val)}
                                                compact
                                            />
                                        </div>
                                    )}

                                    {block.type === 'list' && (
                                        <div className="flex gap-4">
                                            <div className="mt-1.5 p-1.5 bg-slate-100 rounded-lg text-slate-400 dark:bg-slate-800"><List size={16} /></div>
                                            <textarea 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, e.target.value)}
                                                className="w-full outline-none text-slate-700 resize-none h-auto min-h-[6rem] bg-transparent text-lg dark:text-slate-300"
                                                placeholder="List items (one per line)..."
                                            />
                                        </div>
                                    )}

                                    {block.type === 'callout' && (
                                        <div className={`p-6 rounded-2xl border flex gap-4 ${block.style === 'warning' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'}`}>
                                            <div className="mt-1">
                                                {block.style === 'warning' ? <AlertCircle className="text-red-500" size={20} /> : <HelpCircle className="text-blue-500" size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <select 
                                                    value={block.style || 'info'} 
                                                    onChange={e => {
                                                        const newBlocks = [...currentBlocks];
                                                        newBlocks[idx].style = e.target.value as any;
                                                        setCurrentBlocks(newBlocks);
                                                    }}
                                                    className="bg-transparent text-[10px] font-bold opacity-50 outline-none mb-1 block uppercase tracking-wide dark:text-slate-300"
                                                >
                                                    <option value="info">Info Box</option>
                                                    <option value="warning">Warning Box</option>
                                                    <option value="tip">Pro Tip</option>
                                                </select>
                                                <input 
                                                    type="text" 
                                                    value={block.content} 
                                                    onChange={e => updateBlock(block.id, e.target.value)}
                                                    className="w-full bg-transparent outline-none font-bold text-slate-800 text-lg dark:text-slate-200"
                                                    placeholder="Callout text..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Empty State */}
                            {currentBlocks.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm dark:bg-slate-800">
                                        <Sparkles size={24} className="text-emerald-400" />
                                    </div>
                                    <p className="font-bold text-lg text-slate-600 dark:text-slate-400">Your Lesson Canvas</p>
                                    <p className="text-sm mt-2 opacity-70">Add blocks from the toolbar below or pick a template.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Toolbar (Floating) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 p-2 rounded-2xl shadow-2xl flex gap-1 z-30 dark:bg-slate-800/90 dark:border-slate-700">
                    <ToolbarBtn icon={Type} label="Text" onClick={() => addBlock('paragraph')} />
                    <ToolbarBtn icon={LayoutTemplate} label="Header" onClick={() => addBlock('heading', 'h2')} />
                    <div className="w-px bg-slate-200 mx-1 dark:bg-slate-700"></div>
                    <ToolbarBtn icon={ImageIcon} label="Img" onClick={() => addBlock('image')} />
                    <ToolbarBtn icon={List} label="List" onClick={() => addBlock('list')} />
                    <ToolbarBtn icon={Quote} label="Quote" onClick={() => addBlock('quote')} />
                    <ToolbarBtn icon={AlertCircle} label="Note" onClick={() => addBlock('callout', 'info')} />
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
    <div className="max-w-7xl mx-auto h-full flex flex-col p-4 md:p-8 animate-fade-in">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-10 shrink-0">
         <div className="flex items-center gap-6">
             <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600">
                 <ArrowLeftIcon />
             </button>
             <div>
                 <h1 className="text-3xl font-bold text-slate-900 font-heading tracking-tight dark:text-white">Course Builder</h1>
                 <p className="text-sm text-slate-500 font-medium mt-1 dark:text-slate-400">Crafting: <span className="text-emerald-600 dark:text-emerald-400">{course.title || 'Untitled Course'}</span></p>
             </div>
         </div>
         
         <div className="flex gap-3">
            <button 
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
            >
                <Eye size={18} /> <span className="hidden sm:inline">Preview</span>
            </button>
            {step === 4 && (
                <button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                >
                    <Sparkles size={18} /> Publish
                </button>
            )}
         </div>
      </div>

      {renderChapterEditor()}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-8 overflow-hidden">
        
        {/* Navigation Sidebar (Vertical Pills) */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
           {[
             { id: 1, label: 'Basic Info', icon: '📝' },
             { id: 2, label: 'Curriculum', icon: '📚' },
             { id: 3, label: 'Settings', icon: '⚙️' },
             { id: 4, label: 'Review', icon: '🚀' },
           ].map(s => (
             <button 
               key={s.id}
               data-step-id={s.id}
               onClick={() => setStep(s.id as any)}
               className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                 step === s.id 
                 ? 'bg-white text-emerald-600 shadow-lg shadow-slate-200/50 border border-emerald-100 ring-1 ring-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:shadow-none dark:ring-0' 
                 : 'text-slate-500 hover:bg-white/50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300'
               }`}
             >
               <span className="text-lg opacity-80">{s.icon}</span>
               <span>{s.label}</span>
               {step === s.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
             </button>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {step === 1 && renderStep1_Info()}
            {step === 2 && renderStep2_Curriculum()}
            {step === 3 && renderStep3_Settings()}
            
            {step === 4 && (
              <div className="space-y-8 animate-fade-in text-center py-12">
                  <div className={CARD_CLASS}>
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Ready to Launch?</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10">Choose visibility for your course.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* Team Only Option */}
                            <button 
                                onClick={() => setPublishTarget('TEAM')}
                                className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                                    publishTarget === 'TEAM' 
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                    : 'border-slate-100 hover:border-emerald-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${
                                    publishTarget === 'TEAM' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                                }`}>
                                    👥
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Team Training</h3>
                                    <p className="text-sm text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">Visible only to your downline.</p>
                                </div>
                            </button>

                            {/* Global Option */}
                            <button 
                                onClick={() => setPublishTarget('GLOBAL')}
                                className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                                    publishTarget === 'GLOBAL' 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'border-slate-100 hover:border-blue-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${
                                    publishTarget === 'GLOBAL' ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                                }`}>
                                    🌍
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Global Library</h3>
                                    <p className="text-sm text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">Public to all FBOs (Review required).</p>
                                </div>
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-8 text-sm text-slate-500 font-medium dark:text-slate-400">
                                <span>{course.modules.length} Modules</span>
                                <span className="w-px h-4 bg-slate-300 dark:bg-slate-700"></span>
                                <span>{course.track}</span>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                className={`w-full max-w-sm py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all text-white ${
                                    publishTarget === 'GLOBAL' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                }`}
                            >
                                {publishTarget === 'GLOBAL' ? 'Submit for Review' : 'Publish Now'}
                            </button>
                        </div>
                    </div>
                  </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const ToolbarBtn: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors group dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
    >
        <Icon size={20} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

export default CourseBuilder;
