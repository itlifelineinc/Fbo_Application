
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Course, Module, Chapter, CourseTrack, CourseLevel, CourseStatus, ContentBlock, BlockType, CourseTestimonial, Student } from '../types';
import { Eye, X, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronRight, CheckCircle, Menu, BookOpen, Clock, Plus, Trash2, ArrowUp, ArrowDown, LayoutTemplate, Type, Image as ImageIcon, List, Quote, AlertCircle, ArrowLeft, ShoppingBag, Users, Sparkles, Save, Search, Check, Wand2, Loader2, MessageSquare, Settings, Rocket, BarChart } from 'lucide-react';
import { generateModuleContent } from '../services/geminiService';

interface CourseBuilderProps {
  currentUserHandle: string;
  courses: Course[];
  onSubmitCourse: (course: Course) => void;
  students: Student[];
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
  testimonials: [],
  status: CourseStatus.DRAFT,
  authorHandle: authorHandle,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  settings: {
    gamificationEnabled: true,
    pointsReward: 100,
    certificateEnabled: true,
    requiresAssessment: false,
    teamOnly: false,
    price: 0 // Default free
  }
});

// --- TEMPLATES DEFINITION ---
const TEMPLATES: {id: string, name: string, description: string, icon: any, blocks: ContentBlock[]}[] = [
    {
        id: 'blank',
        name: 'Start from Scratch',
        description: 'Start fresh with an empty canvas.',
        icon: FileText,
        blocks: []
    },
    {
        id: 'hook-story',
        name: 'The "Hook & Story"',
        description: 'Engage emotionally. Best for introductions and vision sharing.',
        icon: Sparkles,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'The Turning Point' },
            { id: '2', type: 'paragraph', content: 'Start with a relatable struggle or a "what if" question to hook the learner immediately.' },
            { id: '3', type: 'quote', content: '"People don\'t buy what you do; they buy why you do it."' },
            { id: '4', type: 'image', content: '' },
            { id: '5', type: 'heading', style: 'h3', content: 'The Solution' },
            { id: '6', type: 'paragraph', content: 'Explain how the Forever opportunity or product resolved the struggle.' },
            { id: '7', type: 'callout', style: 'tip', content: 'Key Lesson: Vulnerability builds trust.' }
        ]
    },
    {
        id: 'how-to',
        name: 'The "How-To" Guide',
        description: 'Step-by-step instruction. Best for technical skills or processes.',
        icon: List,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Step-by-Step Walkthrough' },
            { id: '2', type: 'paragraph', content: 'Briefly explain what the user will achieve by the end of this lesson.' },
            { id: '3', type: 'heading', style: 'h3', content: 'Step 1: Preparation' },
            { id: '4', type: 'list', style: 'bullet', content: 'Gather materials\nCheck requirements\nSet aside time' },
            { id: '5', type: 'heading', style: 'h3', content: 'Step 2: Execution' },
            { id: '6', type: 'paragraph', content: 'Describe the core action in detail.' },
            { id: '7', type: 'callout', style: 'warning', content: 'Common Pitfall: Don\'t skip the preparation phase.' }
        ]
    },
    {
        id: 'product-deep-dive',
        name: 'Product Deep Dive',
        description: 'Comprehensive product training. Best for sales enablement.',
        icon: ShoppingBag,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Product Overview' },
            { id: '2', type: 'image', content: '' },
            { id: '3', type: 'paragraph', content: 'What is it? Who is it for? Why is it unique?' },
            { id: '4', type: 'heading', style: 'h3', content: 'Key Ingredients & Benefits' },
            { id: '5', type: 'list', style: 'bullet', content: 'Benefit 1: ...\nBenefit 2: ...\nBenefit 3: ...' },
            { id: '6', type: 'heading', style: 'h3', content: 'Compliance & Safety' },
            { id: '7', type: 'callout', style: 'info', content: 'Note: Not intended to diagnose, treat, cure, or prevent any disease.' }
        ]
    },
    {
        id: 'case-study',
        name: 'Case Study Analysis',
        description: 'Real-world proof. Best for business building training.',
        icon: Users,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'The Scenario' },
            { id: '2', type: 'paragraph', content: 'Describe a specific situation an FBO faced in the field (e.g., a skeptical prospect).' },
            { id: '3', type: 'heading', style: 'h3', content: 'The Approach' },
            { id: '4', type: 'list', style: 'number', content: 'Listened actively\nAcknowledged concerns\nProvided third-party validation' },
            { id: '5', type: 'heading', style: 'h3', content: 'The Outcome' },
            { id: '6', type: 'callout', style: 'tip', content: 'Result: A new customer and a referral.' }
        ]
    },
    {
        id: 'faq-buster',
        name: 'FAQ Buster',
        description: 'Overcoming objections. Best for closing skills.',
        icon: HelpCircle,
        blocks: [
            { id: '1', type: 'heading', style: 'h2', content: 'Common Objections' },
            { id: '2', type: 'paragraph', content: 'Introduction to the mindset of handling objections.' },
            { id: '3', type: 'heading', style: 'h3', content: '"It\'s too expensive"' },
            { id: '4', type: 'paragraph', content: 'Script: "Compared to what? Let\'s break down the daily cost vs. value..."' },
            { id: '5', type: 'heading', style: 'h3', content: '"I don\'t have time"' },
            { id: '6', type: 'paragraph', content: 'Script: "That\'s exactly why you need this business. To buy back your time."' },
            { id: '7', type: 'callout', style: 'warning', content: 'Remember: Never argue. Always validate first.' }
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
                <span className="text-sm font-bold">{compact ? 'Select Image' : 'Click to Upload'}</span>
             </div>
           )}
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
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

    const activeModule = course.modules.find(m => m.chapters.some(c => c.id === activeChapter?.id));
    const totalDuration = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
    const durationStr = totalDuration > 60 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${totalDuration}m`;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col dark:bg-slate-950 animate-fade-in">
             <div className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shrink-0 shadow-md z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Preview Mode</div>
                </div>
                <button onClick={onClose} className="text-white hover:text-emerald-400 font-bold">Close Preview</button>
             </div>
             {/* Content */}
             <div className="flex-1 flex items-center justify-center">
                 <p className="text-slate-500">Preview content here...</p>
             </div>
        </div>
    );
};


const CourseBuilder: React.FC<CourseBuilderProps> = ({ currentUserHandle, courses, onSubmitCourse, students }) => {
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get ID from URL for editing
  
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); 
  const [course, setCourse] = useState<Course>(getEmptyCourse(currentUserHandle));
  const [editingChapter, setEditingChapter] = useState<{moduleId: string, chapterId: string} | null>(null);
  const [currentBlocks, setCurrentBlocks] = useState<ContentBlock[]>([]);
  const [publishTarget, setPublishTarget] = useState<'GLOBAL' | 'TEAM'>('TEAM');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // New Testimonial State
  const [newTestimonial, setNewTestimonial] = useState<CourseTestimonial>({ id: '', name: '', role: '', quote: '' });
  
  // Temporary State for Adding Items
  const [tempOutcome, setTempOutcome] = useState('');
  const [tempAudience, setTempAudience] = useState('');

  const BUILDER_STEPS = [
    { id: 1, label: 'Info', fullLabel: 'Basic Info', icon: FileText },
    { id: 2, label: 'Curriculum', fullLabel: 'Curriculum', icon: BookOpen },
    { id: 3, label: 'Settings', fullLabel: 'Settings', icon: Settings },
    { id: 4, label: 'Launch', fullLabel: 'Review & Launch', icon: Rocket },
    { id: 5, label: 'Analytics', fullLabel: 'Course Analytics', icon: BarChart }
  ];

  // --- LOAD EXISTING COURSE LOGIC ---
  useEffect(() => {
      if (courseId && courseId !== 'new') {
          const existingCourse = courses.find(c => c.id === courseId);
          if (existingCourse) {
              setCourse(existingCourse);
              // Set initial publish target state based on settings
              setPublishTarget(existingCourse.settings.teamOnly ? 'TEAM' : 'GLOBAL');
          }
      }
  }, [courseId, courses]);

  // Sync Blocks when opening editor
  useEffect(() => {
      if (editingChapter) {
          const mod = course.modules.find(m => m.id === editingChapter.moduleId);
          const chap = mod?.chapters.find(c => c.id === editingChapter.chapterId);
          if (chap) {
              if (chap.blocks && chap.blocks.length > 0) {
                  setCurrentBlocks(chap.blocks);
              } else if (chap.content) {
                  setCurrentBlocks([{ id: 'init', type: 'paragraph', content: chap.content }]);
              } else {
                  setCurrentBlocks([]);
                  setIsTemplateMode(true); 
              }
          }
      }
  }, [editingChapter]);

  // --- HANDLERS ---
  const updateCourseInfo = (field: keyof Course, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (field: keyof Course['settings'], value: any) => {
    setCourse(prev => ({ ...prev, settings: { ...prev.settings, [field]: value } }));
  };

  // List Management Handlers
  const addListString = (field: 'targetAudience' | 'learningOutcomes', value: string) => {
      if (!value.trim()) return;
      setCourse(prev => ({ ...prev, [field]: [...prev[field], value] }));
  };

  const removeListString = (field: 'targetAudience' | 'learningOutcomes', index: number) => {
      setCourse(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleAddOutcome = () => {
      if (!tempOutcome.trim()) return;
      addListString('learningOutcomes', tempOutcome);
      setTempOutcome('');
  };

  const handleAddAudience = () => {
      if (!tempAudience.trim()) return;
      addListString('targetAudience', tempAudience);
      setTempAudience('');
  };

  // Testimonial Handlers
  const addTestimonial = () => {
      if (!newTestimonial.name || !newTestimonial.quote) return;
      const t = { ...newTestimonial, id: Date.now().toString() };
      setCourse(prev => ({ ...prev, testimonials: [...(prev.testimonials || []), t] }));
      setNewTestimonial({ id: '', name: '', role: '', quote: '' });
  };

  const removeTestimonial = (id: string) => {
      setCourse(prev => ({ ...prev, testimonials: (prev.testimonials || []).filter(t => t.id !== id) }));
  };

  // ... (Module/Chapter/Block handlers remain same as previous version)
  const addModule = () => {
    const newModule: Module = { id: `mod_${Date.now()}`, title: 'New Module', order: course.modules.length + 1, chapters: [] };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };
  const updateModule = (id: string, field: keyof Module, value: any) => {
    setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === id ? { ...m, [field]: value } : m) }));
  };
  const deleteModule = (moduleId: string) => { if(window.confirm('Delete module?')) setCourse(p => ({ ...p, modules: p.modules.filter(m => m.id !== moduleId) })); };
  const addChapter = (moduleId: string) => {
    const newChapter: Chapter = { id: `chap_${Date.now()}`, title: 'New Lesson', content: '', blocks: [], durationMinutes: 10, actionSteps: [], isPublished: true, allowComments: true };
    setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, chapters: [...m.chapters, newChapter] } : m) }));
  };
  const deleteChapter = (e: React.MouseEvent, moduleId: string, chapterId: string) => {
    e.stopPropagation(); if (!window.confirm("Delete chapter?")) return;
    setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, chapters: m.chapters.filter(c => c.id !== chapterId) } : m) }));
  };
  const updateActiveChapter = (field: keyof Chapter, value: any) => {
    if (!editingChapter) return;
    setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === editingChapter.moduleId ? { ...m, chapters: m.chapters.map(c => c.id === editingChapter.chapterId ? { ...c, [field]: value } : c) } : m) }));
  };
  const handleAIGenerate = async () => {
      const topic = prompt("What should this module be about?"); if (!topic) return;
      setIsGeneratingAI(true);
      const generatedModule = await generateModuleContent(topic);
      setIsGeneratingAI(false);
      if (generatedModule) { generatedModule.order = course.modules.length + 1; setCourse(prev => ({ ...prev, modules: [...prev.modules, generatedModule] })); alert("Module Generated!"); }
  };
  
  // Block Handlers
  const addBlock = (type: BlockType, style?: any) => { setCurrentBlocks(prev => [...prev, { id: `blk_${Date.now()}_${Math.random()}`, type, content: '', style }]); };
  const updateBlock = (id: string, content: string) => { setCurrentBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b)); };
  const deleteBlock = (id: string) => { setCurrentBlocks(prev => prev.filter(b => b.id !== id)); };
  const moveBlock = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return; if (direction === 'down' && index === currentBlocks.length - 1) return;
      const newBlocks = [...currentBlocks]; const temp = newBlocks[index]; const targetIndex = direction === 'up' ? index - 1 : index + 1;
      newBlocks[index] = newBlocks[targetIndex]; newBlocks[targetIndex] = temp; setCurrentBlocks(newBlocks);
  };
  const applyTemplate = (templateId: string) => {
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) { if (currentBlocks.length > 0 && !window.confirm('Replace content?')) return;
          setCurrentBlocks(template.blocks.map(b => ({ ...b, id: `blk_${Date.now()}_${Math.random()}` }))); setIsTemplateMode(false);
      }
  };
  const saveBlocksToChapter = () => {
      if (!editingChapter) return;
      let htmlContent = ''; currentBlocks.forEach(b => { if (b.type === 'heading') htmlContent += `<h3>${b.content}</h3>\n`; if (b.type === 'paragraph') htmlContent += `<p>${b.content}</p>\n`; });
      setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === editingChapter.moduleId ? { ...m, chapters: m.chapters.map(c => c.id === editingChapter.chapterId ? { ...c, blocks: currentBlocks, content: htmlContent } : c) } : m) }));
      setEditingChapter(null); setIsTemplateMode(false);
  };

  const handleSubmit = () => {
    const isGlobal = publishTarget === 'GLOBAL';
    let finalId = course.id;
    // Only generate new ID if it's a fresh draft
    if (finalId.startsWith('draft_')) {
        const safeTitle = course.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 30);
        const random = Math.floor(1000 + Math.random() * 9000); finalId = safeTitle ? `${safeTitle}-${random}` : `course-${Date.now()}`;
    }
    const finalCourse = { ...course, id: finalId, status: isGlobal ? CourseStatus.UNDER_REVIEW : CourseStatus.PUBLISHED, settings: { ...course.settings, teamOnly: !isGlobal }, updatedAt: Date.now() };
    onSubmitCourse(finalCourse);
    
    const action = course.id.startsWith('draft_') ? "Created" : "Updated";
    if (isGlobal) { alert(`Course ${action} & Submitted for Global Review!`); } else { alert(`Course ${action} & Published to Team Training!`); }
    
    // Only reset if creating new, else go back to dashboard
    if(courseId === 'new') {
        setCourse(getEmptyCourse(currentUserHandle)); 
        setStep(1); 
    }
    navigate('/dashboard');
  };

  // --- INTERNAL BACK NAVIGATION ---
  const handleBack = () => {
    if (step > 1) {
        setStep(prev => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    } else {
        navigate(-1);
    }
  };

  // --- RENDERERS ---

  const renderStep1_Info = () => (
    <div className="space-y-8">
      <div className={CARD_CLASS}>
        <h2 className="text-lg md:text-xl font-bold text-slate-900 border-b border-slate-100 pb-6 mb-6 font-heading dark:text-slate-100 dark:border-slate-700">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <label className={LABEL_CLASS}>Course Title</label>
                    <input type="text" value={course.title} onChange={e => updateCourseInfo('title', e.target.value)} className={INPUT_CLASS} placeholder="e.g. Product Mastery" />
                </div>
                <div>
                    <label className={LABEL_CLASS}>Subtitle</label>
                    <input type="text" value={course.subtitle} onChange={e => updateCourseInfo('subtitle', e.target.value)} className={INPUT_CLASS} placeholder="Short summary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>Course Track</label>
                        <select value={course.track} onChange={e => updateCourseInfo('track', e.target.value)} className={`${INPUT_CLASS} appearance-none`}>
                            {Object.values(CourseTrack).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Difficulty</label>
                        <select value={course.level} onChange={e => updateCourseInfo('level', e.target.value)} className={`${INPUT_CLASS} appearance-none`}>
                            {Object.values(CourseLevel).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <MediaInput label="Course Thumbnail" value={course.thumbnailUrl} onChange={(val) => updateCourseInfo('thumbnailUrl', val)} accept="image/*" />
            </div>
        </div>
      </div>
    </div>
  );

  const renderStep2_Curriculum = () => (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        <div><h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">Curriculum</h2><p className="text-sm text-slate-500 dark:text-slate-400">Structure your course.</p></div>
        <div className="flex gap-2">
            <button 
                onClick={handleAIGenerate} 
                disabled={isGeneratingAI} 
                className="bg-indigo-600 text-white p-3 sm:px-4 sm:py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 disabled:opacity-70"
                title="AI Generate"
            >
                {isGeneratingAI ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />} 
                <span className="hidden sm:inline">AI Generate</span>
            </button>
            <button 
                onClick={addModule} 
                className="bg-slate-900 text-white p-3 sm:px-5 sm:py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:shadow-none flex items-center gap-2"
                title="New Module"
            >
                <Plus size={18} /> 
                <span className="hidden sm:inline">New Module</span>
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar pb-32">
        {course.modules.length === 0 && <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50"><p className="text-slate-500 font-bold dark:text-slate-400">Add your first module.</p></div>}
        {course.modules.map((module, mIdx) => (
          <div key={module.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700 group transition-all hover:shadow-md">
             <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0 dark:bg-slate-700 dark:text-slate-400">{mIdx + 1}</div>
                <div className="flex-1"><input type="text" value={module.title} onChange={(e) => updateModule(module.id, 'title', e.target.value)} className="w-full bg-transparent border-none p-0 text-lg font-bold text-slate-900 placeholder-slate-400 focus:ring-0 dark:text-white" placeholder="Module Title" /></div>
                <div className="flex items-center gap-2"><button onClick={() => addChapter(module.id)} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-bold hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">+ Lesson</button><button onClick={() => deleteModule(module.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18} /></button></div>
             </div>
             <div className="p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
                {module.chapters.map((chapter, cIdx) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group/chapter shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-500/30">
                     <div className="flex items-center gap-4"><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{cIdx + 1}</div><span className="text-sm font-bold text-slate-700 dark:text-slate-200">{chapter.title}</span><span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded dark:bg-slate-700 dark:text-slate-500">{chapter.durationMinutes}m</span></div>
                     <div className="flex items-center gap-2 opacity-0 group-hover/chapter:opacity-100 transition-opacity"><button onClick={() => setEditingChapter({ moduleId: module.id, chapterId: chapter.id })} className="text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-lg dark:bg-slate-700 dark:text-slate-300">Edit Content</button><button onClick={(e) => deleteChapter(e, module.id, chapter.id)} className="text-slate-300 hover:text-red-500 p-1.5"><X size={16} /></button></div>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3_Settings = () => (
    <div className="space-y-8">
      {/* General Settings */}
      <div className={CARD_CLASS}>
        <h2 className="text-lg md:text-xl font-bold text-slate-900 border-b border-slate-100 pb-6 mb-6 font-heading dark:text-slate-100 dark:border-slate-700">Course Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gamification</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Enable Certificates</span>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={course.settings.certificateEnabled} onChange={e => updateSettings('certificateEnabled', e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div></label>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">XP Points Reward</span>
                    <input type="number" value={course.settings.pointsReward} onChange={e => updateSettings('pointsReward', parseInt(e.target.value))} className="w-20 p-2 text-center text-sm font-bold bg-white rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white" />
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Access & Pricing</h3>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-900">
                    <div className="flex flex-col"><span className="text-sm font-bold text-slate-700 dark:text-slate-300">Assessment Required</span><span className="text-xs text-slate-400">Users must pass quiz</span></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={course.settings.requiresAssessment} onChange={e => updateSettings('requiresAssessment', e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div></label>
                </div>
                
                {/* Price Input */}
                <div>
                    <label className={LABEL_CLASS}>Price (USD)</label>
                    <input 
                        type="number" 
                        value={course.settings.price || 0} 
                        onChange={e => updateSettings('price', parseFloat(e.target.value))} 
                        className={INPUT_CLASS} 
                        placeholder="0.00"
                        min="0"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 ml-1">
                        Set to 0 for free access. Team members (downline) always get free access regardless of this price.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Landing Page Content - New Section */}
      <div className={CARD_CLASS}>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 border-b border-slate-100 pb-6 mb-6 font-heading dark:text-slate-100 dark:border-slate-700">Landing Page Content</h2>
          
          <div className="space-y-8">
              {/* About the Course (Moved from Step 1) */}
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className={LABEL_CLASS}>About this Course</label>
                      <span className={`text-xs font-bold ${course.description.length > 700 ? 'text-red-500' : 'text-slate-400'}`}>{course.description.length}/700</span>
                  </div>
                  <textarea
                      value={course.description}
                      onChange={e => updateCourseInfo('description', e.target.value.slice(0, 700))}
                      className={`${INPUT_CLASS} h-32 resize-none`}
                      placeholder="Detailed overview for the landing page..."
                  />
              </div>

              {/* Learning Outcomes */}
              <div>
                  <label className={LABEL_CLASS}>What students will learn</label>
                  <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={tempOutcome}
                        onChange={(e) => setTempOutcome(e.target.value)}
                        placeholder="e.g. Master the 4CC active habit" 
                        className={INPUT_CLASS} 
                        onKeyDown={(e) => { if(e.key === 'Enter') handleAddOutcome(); }}
                      />
                      <button onClick={handleAddOutcome} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Plus size={24} />
                      </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {course.learningOutcomes.map((item, idx) => (
                          <div key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                              {item} <button onClick={() => removeListString('learningOutcomes', idx)}><X size={12}/></button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Target Audience */}
              <div>
                  <label className={LABEL_CLASS}>Who is this course for?</label>
                  <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={tempAudience}
                        onChange={(e) => setTempAudience(e.target.value)}
                        placeholder="e.g. New Supervisors" 
                        className={INPUT_CLASS} 
                        onKeyDown={(e) => { if(e.key === 'Enter') handleAddAudience(); }}
                      />
                      <button onClick={handleAddAudience} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Plus size={24} />
                      </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {course.targetAudience.map((item, idx) => (
                          <div key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                              {item} <button onClick={() => removeListString('targetAudience', idx)}><X size={12}/></button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Testimonials Editor */}
              <div className="border-t border-slate-100 pt-6 dark:border-slate-700">
                  <label className={LABEL_CLASS}>Student Testimonials</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end bg-slate-50 p-4 rounded-2xl dark:bg-slate-900">
                      <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Name</label>
                          <input 
                            type="text" 
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-emerald-500 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                            value={newTestimonial.name}
                            onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Role/Title</label>
                          <input 
                            type="text" 
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-emerald-500 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                            value={newTestimonial.role}
                            onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Quote</label>
                          <input 
                            type="text" 
                            className="w-full text-sm p-2 rounded border border-slate-200 outline-none focus:border-emerald-500 bg-white dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                            value={newTestimonial.quote}
                            onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                          />
                      </div>
                      <button onClick={addTestimonial} className="bg-slate-800 text-white p-2 rounded-lg text-xs font-bold md:col-span-3 hover:bg-slate-700 transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700">Add Testimonial</button>
                  </div>

                  <div className="space-y-2">
                      {course.testimonials?.map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
                              <div>
                                  <p className="font-bold text-sm text-slate-800 dark:text-white">{t.name} <span className="text-slate-400 font-normal text-xs">| {t.role}</span></p>
                                  <p className="text-xs text-slate-500 italic dark:text-slate-400">"{t.quote}"</p>
                              </div>
                              <button onClick={() => removeTestimonial(t.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );

  const renderStep4_Analytics = () => {
    // Analytics Logic
    const enrolledStudents = students.filter(s => s.enrolledCourses?.includes(course.id));
    const totalStudents = enrolledStudents.length;

    // Completion Calculation
    const totalChapters = course.modules.reduce((acc, m) => acc + m.chapters.length, 0);
    const courseChapterIds = course.modules.flatMap(m => m.chapters.map(c => c.id));
    
    const completions = enrolledStudents.filter(s => {
        // Count how many chapters of THIS course they finished
        const studentCompletedCount = s.completedChapters.filter(id => courseChapterIds.includes(id)).length;
        // Simple Logic: If they finished all chapters available in the course
        return totalChapters > 0 && studentCompletedCount >= totalChapters;
    }).length;

    const completionRate = totalStudents > 0 ? Math.round((completions / totalStudents) * 100) : 0;
    
    let completionLabel = "Low";
    let completionColor = "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30";
    if (completionRate > 70) {
        completionLabel = "High";
        completionColor = "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30";
    } else if (completionRate > 30) {
        completionLabel = "Medium";
        completionColor = "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30";
    }

    // Earnings
    const earnings = totalStudents * (course.settings.price || 0);

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 font-heading dark:text-slate-100">Course Performance</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={CARD_CLASS.replace('p-8', 'p-6 flex flex-col items-center text-center')}>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 dark:bg-blue-900/30 dark:text-blue-400">
                        <Users size={24} />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalStudents}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Students</span>
                </div>

                <div className={CARD_CLASS.replace('p-8', 'p-6 flex flex-col items-center text-center')}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${completionColor.replace('text-', 'bg-').replace('bg-', 'text-')}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-slate-800 dark:text-white">{completionRate}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${completionColor}`}>{completionLabel}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Completion Rate</span>
                </div>

                <div className={CARD_CLASS.replace('p-8', 'p-6 flex flex-col items-center text-center')}>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <ShoppingBag size={24} />
                    </div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">${earnings.toLocaleString()}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Earnings</span>
                </div>
            </div>

            {/* Feedback / Testimonials */}
            <div className={CARD_CLASS}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Student Feedback</h3>
                    <span className="text-xs text-slate-400">Collected from course reviews</span>
                </div>
                
                <div className="space-y-4">
                    {course.testimonials && course.testimonials.length > 0 ? (
                        course.testimonials.map((t) => (
                            <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{t.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs gap-0.5">
                                        {[1,2,3,4,5].map(i => <Save key={i} size={12} fill="currentColor" className="text-yellow-400"/>)}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 italic dark:text-slate-300">"{t.quote}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No feedback received yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderChapterEditor = () => {
    if (!editingChapter) return null;
    const activeModule = course.modules.find(m => m.id === editingChapter.moduleId);
    const activeChapter = activeModule?.chapters.find(c => c.id === editingChapter.chapterId);
    if (!activeChapter) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
         <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={saveBlocksToChapter} />
         <div className="relative w-full max-w-5xl bg-white h-[90vh] shadow-2xl flex flex-col rounded-3xl overflow-hidden ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 dark:bg-slate-900 dark:border-slate-800 shrink-0">
               <div className="flex items-center gap-6"><button onClick={saveBlocksToChapter} className="text-slate-400 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"><ArrowLeft size={24} /></button><div><h3 className="font-bold text-xl text-slate-900 font-heading dark:text-white">Edit Lesson</h3><p className="text-xs text-slate-500 font-medium dark:text-slate-400">{activeModule?.title} / <span className="text-emerald-600 dark:text-emerald-400">{activeChapter.title}</span></p></div></div>
               <div className="flex gap-4 items-center"><button onClick={() => setIsTemplateMode(!isTemplateMode)} className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${isTemplateMode ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}><LayoutTemplate size={16} /> {isTemplateMode ? 'Cancel Templates' : 'Templates'}</button><button onClick={saveBlocksToChapter} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm shadow-lg shadow-slate-200 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:shadow-none flex items-center gap-2"><Save size={16} /> Save Changes</button></div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950">
                    {isTemplateMode ? (
                        <div className="max-w-5xl mx-auto py-12 px-8 animate-fade-in"><div className="text-center mb-10"><h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose a Structure</h2><p className="text-slate-500 dark:text-slate-400">Jumpstart your lesson with a proven layout. Select one to apply.</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{TEMPLATES.map(t => (<button key={t.id} onClick={() => applyTemplate(t.id)} className="text-left bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all group dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-500"><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform dark:bg-emerald-900/30 dark:text-emerald-400"><t.icon size={24} /></div><h3 className="font-bold text-lg text-slate-800 mb-2 dark:text-white">{t.name}</h3><p className="text-sm text-slate-500 leading-relaxed mb-4 dark:text-slate-400">{t.description}</p><div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">Use Template <ArrowLeft size={12} className="rotate-180" /></div></button>))}</div></div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-12 px-8 pb-32 space-y-10">
                            <div className={CARD_CLASS}><div className="flex justify-between items-center mb-6"><h4 className={LABEL_CLASS}>Lesson Metadata</h4><span className="text-xs font-mono text-slate-300 dark:text-slate-600">ID: {activeChapter.id}</span></div><div className="space-y-6"><div><label className={LABEL_CLASS}>Title</label><input type="text" value={activeChapter.title} onChange={e => updateActiveChapter('title', e.target.value)} className="w-full p-0 border-b border-slate-200 text-2xl font-bold font-heading focus:border-emerald-500 focus:ring-0 outline-none bg-transparent text-slate-900 py-2 dark:border-slate-700 dark:text-white" placeholder="Enter lesson title..." /></div><div className="grid grid-cols-2 gap-8"><MediaInput label="Header Image (Optional)" value={activeChapter.headerImageUrl || ''} onChange={val => updateActiveChapter('headerImageUrl', val)} compact /><div><label className={LABEL_CLASS}>Duration (Minutes)</label><input type="number" value={activeChapter.durationMinutes} onChange={e => updateActiveChapter('durationMinutes', parseInt(e.target.value))} className={INPUT_CLASS} /></div></div></div></div>
                            <div className="flex items-center gap-4 py-2"><div className="h-px bg-slate-200 flex-1 dark:bg-slate-800"></div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-500">Content</span><div className="h-px bg-slate-200 flex-1 dark:bg-slate-800"></div></div>
                            <div className="space-y-4 min-h-[300px]">
                                {currentBlocks.map((block, idx) => (
                                    <div key={block.id} className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:border-emerald-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none">
                                        <div className="absolute -right-3 top-6 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white p-1 rounded-xl border border-slate-100 shadow-lg dark:bg-slate-800 dark:border-slate-700"><button onClick={() => moveBlock(idx, 'up')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:bg-slate-700 dark:text-slate-500"><ArrowUp size={14} /></button><button onClick={() => moveBlock(idx, 'down')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 dark:hover:bg-slate-700 dark:text-slate-500"><ArrowDown size={14} /></button><div className="w-4 h-px bg-slate-100 mx-auto my-1 dark:bg-slate-700"></div><button onClick={() => deleteBlock(block.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 dark:hover:bg-red-900/30"><Trash2 size={14} /></button></div>
                                        {block.type === 'heading' && (<div className="flex gap-4 items-center"><div className="text-xs font-bold text-slate-300 w-8 text-right font-mono">H{block.style === 'h1' ? '1' : block.style === 'h3' ? '3' : '2'}</div><select value={block.style || 'h2'} onChange={e => { const newBlocks = [...currentBlocks]; newBlocks[idx].style = e.target.value as any; setCurrentBlocks(newBlocks); }} className="opacity-0 w-0 h-0 absolute" /><input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)} className={`w-full outline-none font-bold placeholder-slate-200 bg-transparent font-heading dark:text-white dark:placeholder-slate-700 ${block.style === 'h1' ? 'text-4xl' : block.style === 'h3' ? 'text-xl' : 'text-2xl'}`} placeholder="Heading Text" /></div>)}
                                        {block.type === 'paragraph' && (<textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} className="w-full outline-none text-slate-600 resize-none h-auto min-h-[5rem] bg-transparent text-lg leading-relaxed dark:text-slate-300 dark:placeholder-slate-700" placeholder="Type your paragraph here..." />)}
                                        {block.type === 'quote' && (<div className="flex gap-6"><div className="w-1 bg-emerald-400 rounded-full shrink-0"></div><textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} className="w-full outline-none text-slate-500 italic resize-none h-auto min-h-[4rem] text-xl font-serif bg-transparent dark:text-slate-400" placeholder="Enter quote..." /></div>)}
                                        {block.type === 'image' && (<div className="space-y-3"><label className={LABEL_CLASS}>Image Block</label><MediaInput value={block.content} onChange={val => updateBlock(block.id, val)} compact /></div>)}
                                        {block.type === 'list' && (<div className="flex gap-4"><div className="mt-1.5 p-1.5 bg-slate-100 rounded-lg text-slate-400 dark:bg-slate-800"><List size={16} /></div><textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} className="w-full outline-none text-slate-700 resize-none h-auto min-h-[6rem] bg-transparent text-lg dark:text-slate-300" placeholder="List items (one per line)..." /></div>)}
                                        {block.type === 'callout' && (<div className={`p-6 rounded-2xl border flex gap-4 ${block.style === 'warning' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'}`}><div className="mt-1">{block.style === 'warning' ? <AlertCircle className="text-red-500" size={20} /> : <HelpCircle className="text-blue-500" size={20} />}</div><div className="flex-1"><select value={block.style || 'info'} onChange={e => { const newBlocks = [...currentBlocks]; newBlocks[idx].style = e.target.value as any; setCurrentBlocks(newBlocks); }} className="bg-transparent text-[10px] font-bold opacity-50 outline-none mb-1 block uppercase tracking-wide dark:text-slate-300"><option value="info">Info Box</option><option value="warning">Warning Box</option><option value="tip">Pro Tip</option></select><input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)} className="w-full bg-transparent outline-none font-bold text-slate-800 text-lg dark:text-slate-200" placeholder="Callout text..." /></div></div>)}
                                    </div>
                                ))}
                                {currentBlocks.length === 0 && (<div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500"><div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm dark:bg-slate-800"><Sparkles size={24} className="text-emerald-400" /></div><p className="font-bold text-lg text-slate-600 dark:text-slate-400">Your Lesson Canvas</p><p className="text-sm mt-2 opacity-70">Add blocks from the toolbar below or pick a template.</p></div>)}
                            </div>
                        </div>
                    )}
                </div>
                {!isTemplateMode && (<div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 p-2 rounded-2xl shadow-2xl flex gap-1 z-30 dark:bg-slate-800/90 dark:border-slate-700"><ToolbarBtn icon={Type} label="Text" onClick={() => addBlock('paragraph')} /><ToolbarBtn icon={LayoutTemplate} label="Header" onClick={() => addBlock('heading', 'h2')} /><div className="w-px bg-slate-200 mx-1 dark:bg-slate-700"></div><ToolbarBtn icon={ImageIcon} label="Img" onClick={() => addBlock('image')} /><ToolbarBtn icon={List} label="List" onClick={() => addBlock('list')} /><ToolbarBtn icon={Quote} label="Quote" onClick={() => addBlock('quote')} /><ToolbarBtn icon={AlertCircle} label="Note" onClick={() => addBlock('callout', 'info')} /></div>)}
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
    <div className="max-w-7xl mx-auto h-full flex flex-col p-4 md:p-8 pb-32 animate-fade-in relative">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <style>{`
        @keyframes dock-open {
          0% { opacity: 0; transform: translateY(40px) scale(0.92); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-dock-open {
          animation: dock-open 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
      
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6 md:mb-10 shrink-0">
         <div className="flex items-center gap-3 md:gap-6">
            <button onClick={handleBack} className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600">
                <ArrowLeftIcon />
            </button>
            <div>
                {/* Conditional Title: Analytics on Step 5, Course Builder otherwise */}
                <h1 className="text-lg md:text-3xl font-bold text-slate-900 font-heading tracking-tight dark:text-white">
                    {step === 5 ? 'Analytics' : 'Course Builder'}
                </h1>
                {/* Hide editing subtext on Analytics page to keep it clean */}
                {step !== 5 && (
                    <p className="text-sm text-slate-500 font-medium mt-1 dark:text-slate-400 hidden sm:block">{courseId !== 'new' ? 'Editing' : 'Crafting'}: <span className="text-emerald-600 dark:text-emerald-400">{course.title || 'Untitled Course'}</span></p>
                )}
            </div>
         </div>
         <div className="flex gap-3">
            {/* Hide Preview on Analytics step */}
            {step !== 5 && (
                <button onClick={() => setIsPreviewMode(true)} className="flex items-center gap-2 bg-white text-slate-700 px-3 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700">
                    <Eye size={18} /> <span className="hidden sm:inline">Preview</span>
                </button>
            )}
            {/* Show Publish/Update on Step 4 (Launch) instead of 5 */}
            {step === 4 && (
                <button onClick={handleSubmit} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 md:px-8 md:py-3 rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none">
                    <Sparkles size={18} /> {courseId === 'new' ? 'Publish' : 'Update'}
                </button>
            )}
         </div>
      </div>

      {renderChapterEditor()}

      {/* Main Container */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Content Area */}
        <div key={step} className="h-full overflow-y-auto no-scrollbar pb-32 animate-dock-open origin-bottom">
            {step === 1 && renderStep1_Info()}
            {step === 2 && renderStep2_Curriculum()}
            {step === 3 && renderStep3_Settings()}
            {/* Step 4 is now Launch */}
            {step === 4 && (
              <div className="space-y-8 text-center py-12"><div className={CARD_CLASS}><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-heading">Ready to Launch?</h2><p className="text-slate-500 dark:text-slate-400 text-lg mb-10">Choose visibility for your course.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"><button onClick={() => setPublishTarget('TEAM')} className={`p-4 md:p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 ${publishTarget === 'TEAM' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 hover:border-emerald-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}`}><div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${publishTarget === 'TEAM' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>👥</div><div><h3 className="font-bold text-lg text-slate-800 dark:text-white">Team Training</h3><p className="text-sm text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">Visible only to your downline.</p></div></button><button onClick={() => setPublishTarget('GLOBAL')} className={`p-4 md:p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 ${publishTarget === 'GLOBAL' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 hover:border-blue-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}`}><div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${publishTarget === 'GLOBAL' ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>🌍</div><div><h3 className="font-bold text-lg text-slate-800 dark:text-white">Global Library</h3><p className="text-sm text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">Public to all FBOs (Review required).</p></div></button></div><div className="flex flex-col items-center gap-4"><div className="flex gap-8 text-sm text-slate-500 font-medium dark:text-slate-400"><span>{course.modules.length} Modules</span><span className="w-px h-4 bg-slate-300 dark:bg-slate-700"></span><span>{course.track}</span></div><button onClick={handleSubmit} className={`w-full max-w-sm py-3 md:py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all text-white ${publishTarget === 'GLOBAL' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}>{publishTarget === 'GLOBAL' ? (courseId === 'new' ? 'Submit for Review' : 'Update & Submit') : (courseId === 'new' ? 'Publish Now' : 'Update Course')}</button></div></div></div></div>
            )}
            {/* Step 5 is now Analytics */}
            {step === 5 && renderStep4_Analytics()}
        </div>

        {/* Floating Bottom Navigation (Replaces Sidebar & Mobile Nav) */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-auto max-w-[90vw]">
            <div className="flex items-center bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 gap-1 dark:bg-slate-900/80 dark:border-slate-700 ring-1 ring-black/5 transition-all duration-300 hover:scale-105">
                {BUILDER_STEPS.map(s => (
                    <button 
                        key={s.id} 
                        onClick={() => setStep(s.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 group relative ease-out ${
                            step === s.id 
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 scale-110 -translate-y-2' 
                            : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white hover:scale-105 active:scale-95'
                        }`}
                    >
                        <s.icon size={20} strokeWidth={2.5} className={step === s.id ? 'animate-pulse' : ''} />
                        <span className={`text-sm font-bold ${step === s.id ? 'inline-block' : 'hidden md:inline-block'}`}>{s.label}</span>
                        {step === s.id && <span className="absolute inset-0 rounded-full ring-2 ring-white/20 dark:ring-black/10 pointer-events-none"></span>}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

const ToolbarBtn: React.FC<{ icon: any, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors group dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-emerald-400"><Icon size={20} className="group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold">{label}</span></button>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
);

export default CourseBuilder;
