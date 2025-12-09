
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutTemplate, ClipboardCheck, Megaphone, Plus, Save, Trash2, X, ChevronDown, List, Type, AlertCircle, FileText, Upload, Video, Mic, Calendar, Users, CheckCircle, Clock, Link as LinkIcon, Paperclip, Play, Pause, Image as ImageIcon, StopCircle } from 'lucide-react';
import { Student, MentorshipTemplate, ContentBlock, BlockType, Assignment, AssignmentQuestion, AssignmentType, Attachment } from '../types';

interface MentorshipToolsProps {
  currentUser: Student;
  templates: MentorshipTemplate[];
  assignments?: Assignment[]; // New
  students?: Student[]; // New - needed for assigning
  onAddTemplate: (template: MentorshipTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onAddAssignment?: (assignment: Assignment) => void; // New
  onDeleteAssignment?: (id: string) => void; // New
}

const MentorshipTools: React.FC<MentorshipToolsProps> = ({ 
    currentUser, 
    templates, 
    assignments = [], 
    students = [],
    onAddTemplate, 
    onDeleteTemplate,
    onAddAssignment,
    onDeleteAssignment
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'MENU' | 'TEMPLATES_LIST' | 'TEMPLATE_EDITOR' | 'ASSIGNMENTS_LIST' | 'ASSIGNMENT_EDITOR'>('MENU');
  
  // --- Template State ---
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateCategory, setTemplateCategory] = useState<'PROSPECTING' | 'PRODUCT' | 'ONBOARDING' | 'MOTIVATION' | 'SALES' | 'FOLLOWUP'>('PROSPECTING');
  const [currentBlocks, setCurrentBlocks] = useState<ContentBlock[]>([]);

  // --- Assignment State ---
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('TEXT');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');
  const [assignmentRecipients, setAssignmentRecipients] = useState<string[]>([]);
  const [assignmentQuestions, setAssignmentQuestions] = useState<AssignmentQuestion[]>([]);
  const [assignmentMaterials, setAssignmentMaterials] = useState<Attachment[]>([]); // New: Training Materials

  // --- Refs for Uploads ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // --- Voice Recording State ---
  const [recordingQuestionId, setRecordingQuestionId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Filter Data
  const myTemplates = templates.filter(t => t.authorHandle === currentUser.handle).sort((a,b) => b.createdAt - a.createdAt);
  const myAssignments = assignments.filter(a => a.authorHandle === currentUser.handle).sort((a,b) => b.createdAt - a.createdAt);
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);

  const resetEditor = () => {
      setTemplateTitle('');
      setTemplateCategory('PROSPECTING');
      setCurrentBlocks([]);
  };

  const resetAssignmentEditor = () => {
      setAssignmentTitle('');
      setAssignmentType('TEXT');
      setAssignmentDescription('');
      setAssignmentDeadline('');
      setAssignmentRecipients([]);
      setAssignmentQuestions([]);
      setAssignmentMaterials([]);
  };

  // --- Template Handlers ---
  const handleSaveTemplate = () => {
      if (!templateTitle.trim() || currentBlocks.length === 0) {
          alert("Please add a title and at least one content block.");
          return;
      }

      const newTemplate: MentorshipTemplate = {
          id: `temp_${Date.now()}`,
          title: templateTitle,
          category: templateCategory,
          blocks: currentBlocks,
          authorHandle: currentUser.handle,
          createdAt: Date.now()
      };

      onAddTemplate(newTemplate);
      resetEditor();
      setActiveView('TEMPLATES_LIST');
  };

  const addBlock = (type: BlockType) => {
      setCurrentBlocks([...currentBlocks, { id: `blk_${Date.now()}`, type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
      setCurrentBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
      setCurrentBlocks(prev => prev.filter(b => b.id !== id));
  };

  // --- Assignment Handlers ---
  const handleSaveAssignment = (status: 'DRAFT' | 'ACTIVE') => {
      if (!assignmentTitle.trim()) {
          alert("Title is required.");
          return;
      }
      
      // If active, validate recipients
      if (status === 'ACTIVE' && assignmentRecipients.length === 0) {
          alert("Please select at least one student to assign this task to.");
          return;
      }

      if (onAddAssignment) {
          const newAssignment: Assignment = {
              id: `assign_${Date.now()}`,
              title: assignmentTitle,
              type: assignmentType,
              description: assignmentDescription,
              deadline: assignmentDeadline,
              assignedTo: assignmentRecipients,
              questions: assignmentQuestions,
              materials: assignmentMaterials,
              authorHandle: currentUser.handle,
              status: status,
              createdAt: Date.now()
          };
          onAddAssignment(newAssignment);
          resetAssignmentEditor();
          setActiveView('ASSIGNMENTS_LIST');
      }
  };

  // --- Question Logic ---
  const addQuestion = () => {
      setAssignmentQuestions([...assignmentQuestions, { 
          id: `q_${Date.now()}`, 
          text: '', 
          type: 'TEXT',
          options: [], 
          correctAnswer: undefined
      }]);
  };

  const updateQuestion = (id: string, field: keyof AssignmentQuestion, value: any) => {
      setAssignmentQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
      setAssignmentQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Multiple Choice Specific
  const addOptionToQuestion = (qId: string) => {
      setAssignmentQuestions(prev => prev.map(q => {
          if (q.id !== qId) return q;
          const newOptions = [...(q.options || [])];
          newOptions.push(`Option ${newOptions.length + 1}`);
          return { ...q, options: newOptions };
      }));
  };

  const updateOptionText = (qId: string, optIdx: number, text: string) => {
      setAssignmentQuestions(prev => prev.map(q => {
          if (q.id !== qId) return q;
          const newOptions = [...(q.options || [])];
          newOptions[optIdx] = text;
          return { ...q, options: newOptions };
      }));
  };

  const removeOption = (qId: string, optIdx: number) => {
      setAssignmentQuestions(prev => prev.map(q => {
          if (q.id !== qId) return q;
          const newOptions = [...(q.options || [])];
          newOptions.splice(optIdx, 1);
          // Adjust correct answer if needed
          let newCorrect = q.correctAnswer;
          if (newCorrect === optIdx) newCorrect = undefined;
          else if (newCorrect !== undefined && newCorrect > optIdx) newCorrect--;
          
          return { ...q, options: newOptions, correctAnswer: newCorrect };
      }));
  };

  // Voice Recorder Logic
  const startRecording = async (qId: string) => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
              updateQuestion(qId, 'audioUrl', audioUrl);
              stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setRecordingQuestionId(qId);
      } catch (e) {
          console.error("Mic error", e);
          alert("Could not access microphone.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && recordingQuestionId) {
          mediaRecorderRef.current.stop();
          setRecordingQuestionId(null);
      }
  };

  // --- Material Upload Logic ---
  const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'DOC' | 'VIDEO') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const newAtt: Attachment = {
              type: type === 'VIDEO' ? 'VIDEO' : (file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT'),
              url: reader.result as string,
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              mimeType: file.type
          };
          setAssignmentMaterials(prev => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset
  };

  const addVideoLink = () => {
      const url = prompt("Enter video URL (YouTube, Vimeo, etc):");
      if (url) {
          const newAtt: Attachment = {
              type: 'VIDEO',
              url: url,
              name: 'External Video Link',
              mimeType: 'video/external'
          };
          setAssignmentMaterials(prev => [...prev, newAtt]);
      }
  };

  const removeMaterial = (index: number) => {
      setAssignmentMaterials(prev => prev.filter((_, i) => i !== index));
  };

  // --- Recipient Logic ---
  const toggleRecipient = (handle: string) => {
      if (assignmentRecipients.includes(handle)) {
          setAssignmentRecipients(prev => prev.filter(h => h !== handle));
      } else {
          setAssignmentRecipients(prev => [...prev, handle]);
      }
  };

  const selectAllRecipients = () => {
      if (assignmentRecipients.length === myDownline.length) {
          setAssignmentRecipients([]);
      } else {
          setAssignmentRecipients(myDownline.map(s => s.handle));
      }
  };

  // --- SUB-VIEWS ---

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setActiveView('TEMPLATES_LIST')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-indigo-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <LayoutTemplate size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Templates</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Create and manage reusable message strategies for your team.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
        </button>

        <button 
          onClick={() => setActiveView('ASSIGNMENTS_LIST')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-orange-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <ClipboardCheck size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Assignments</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Assign tasks, track progress, and grade submissions.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
        </button>

        <button 
          onClick={() => alert('Broadcast feature coming soon!')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden opacity-70"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-red-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <Megaphone size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Announcements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Send broadcast messages to multiple team members (Coming Soon).</p>
          </div>
        </button>
    </div>
  );

  const renderTemplatesList = () => (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Templates</h2>
              <button 
                  onClick={() => { resetEditor(); setActiveView('TEMPLATE_EDITOR'); }}
                  className="bg-emerald-600 text-white p-2 md:px-4 md:py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-md transition-all"
                  title="New Template"
              >
                  <Plus size={18} /> <span className="hidden md:inline">New Template</span>
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTemplates.map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400">{t.category}</span>
                              <h3 className="font-bold text-lg text-slate-900 mt-1 dark:text-white">{t.title}</h3>
                          </div>
                          <button onClick={() => onDeleteTemplate(t.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                              <Trash2 size={18} />
                          </button>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-3 dark:text-slate-400">
                          {t.blocks.map(b => b.content).join(' ')}
                      </p>
                  </div>
              ))}
              {myTemplates.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-700 dark:text-slate-500">
                      <p>You haven't created any templates yet.</p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderTemplateEditor = () => (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 flex flex-col h-[70vh]">
          {/* Editor Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-800 dark:text-white">New Template</h2>
              <div className="flex gap-2">
                  <button onClick={() => setActiveView('TEMPLATES_LIST')} className="text-slate-500 hover:text-slate-800 px-3 py-1.5 text-sm font-bold dark:text-slate-400 dark:hover:text-white">Cancel</button>
                  <button onClick={handleSaveTemplate} className="bg-emerald-600 text-white p-2 md:px-4 md:py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2">
                      <Save size={16} /> <span className="hidden md:inline">Save</span>
                  </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Title</label>
                      <input 
                          type="text" 
                          value={templateTitle}
                          onChange={(e) => setTemplateTitle(e.target.value)}
                          placeholder="e.g. Cold Outreach Script #1"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Category</label>
                      <div className="relative">
                          <select 
                              value={templateCategory}
                              onChange={(e) => setTemplateCategory(e.target.value as any)}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 appearance-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          >
                              <option value="PROSPECTING">Prospecting</option>
                              <option value="PRODUCT">Product Pitch</option>
                              <option value="ONBOARDING">Onboarding</option>
                              <option value="MOTIVATION">Motivation</option>
                              <option value="SALES">Sales Closing</option>
                              <option value="FOLLOWUP">Follow Up</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                      </div>
                  </div>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Content Blocks</label>
                      <div className="flex gap-2">
                          <button onClick={() => addBlock('heading')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Heading"><LayoutTemplate size={16}/></button>
                          <button onClick={() => addBlock('paragraph')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Text"><Type size={16}/></button>
                          <button onClick={() => addBlock('list')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add List"><List size={16}/></button>
                          <button onClick={() => addBlock('callout')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Tip"><AlertCircle size={16}/></button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {currentBlocks.map((block, idx) => (
                          <div key={block.id} className="relative group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all dark:bg-slate-700/30 dark:border-slate-600">
                              <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><X size={14}/></button>
                              
                              {block.type === 'heading' && (
                                  <input 
                                      type="text" 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(block.id, e.target.value)}
                                      placeholder="Header Text"
                                      className="w-full bg-transparent font-bold text-lg outline-none placeholder-slate-300 text-slate-800 dark:text-white dark:placeholder-slate-600"
                                  />
                              )}
                              {block.type === 'paragraph' && (
                                  <textarea 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(block.id, e.target.value)}
                                      placeholder="Message text..."
                                      className="w-full bg-transparent text-sm outline-none placeholder-slate-300 text-slate-600 resize-none h-20 dark:text-slate-300 dark:placeholder-slate-600"
                                  />
                              )}
                              {block.type === 'list' && (
                                  <div className="flex gap-2">
                                      <span className="text-slate-400 mt-1">•</span>
                                      <textarea 
                                          value={block.content} 
                                          onChange={(e) => updateBlock(block.id, e.target.value)}
                                          placeholder="List items (one per line)..."
                                          className="w-full bg-transparent text-sm outline-none placeholder-slate-300 text-slate-600 resize-none h-20 dark:text-slate-300 dark:placeholder-slate-600"
                                      />
                                  </div>
                              )}
                              {block.type === 'callout' && (
                                  <div className="flex gap-2 items-start">
                                      <span className="text-blue-500 mt-1">💡</span>
                                      <input 
                                          type="text" 
                                          value={block.content} 
                                          onChange={(e) => updateBlock(block.id, e.target.value)}
                                          placeholder="Pro tip or note..."
                                          className="w-full bg-transparent text-sm font-medium outline-none placeholder-slate-300 text-blue-800 dark:text-blue-300 dark:placeholder-slate-600"
                                      />
                                  </div>
                              )}
                          </div>
                      ))}
                      {currentBlocks.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-sm italic dark:text-slate-500">
                              Click buttons above to add content blocks.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAssignmentsList = () => (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assignments</h2>
              <button 
                  onClick={() => { resetAssignmentEditor(); setActiveView('ASSIGNMENT_EDITOR'); }}
                  className="bg-emerald-600 text-white p-2 md:px-4 md:py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-md transition-all"
                  title="Create Task"
              >
                  <Plus size={18} /> <span className="hidden md:inline">Create Task</span>
              </button>
          </div>

          <div className="space-y-3">
              {myAssignments.map(assignment => (
                  <div key={assignment.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group dark:bg-slate-800 dark:border-slate-700">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${assignment.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                                  {assignment.status}
                              </span>
                              <span className="text-xs text-slate-400">{new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{assignment.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1"><Users size={12} /> {assignment.assignedTo.length} Assigned</span>
                              {assignment.deadline && <span className="flex items-center gap-1 text-orange-500"><Clock size={12} /> Due {new Date(assignment.deadline).toLocaleDateString()}</span>}
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <button onClick={() => onDeleteAssignment && onDeleteAssignment(assignment.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30">
                              <Trash2 size={18} />
                          </button>
                          <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                              View Submissions
                          </button>
                      </div>
                  </div>
              ))}
              {myAssignments.length === 0 && (
                  <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-700 dark:text-slate-500">
                      <ClipboardCheck size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No assignments created yet.</p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderAssignmentEditor = () => (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 flex flex-col h-[85vh]">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 flex justify-between items-center shrink-0">
              <div>
                  <h2 className="font-bold text-lg text-slate-800 dark:text-white">Create Assignment</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Give your downline a task to help them grow</p>
              </div>
              <button onClick={() => setActiveView('ASSIGNMENTS_LIST')} className="text-slate-500 hover:text-slate-800 px-3 py-1.5 text-sm font-bold dark:text-slate-400 dark:hover:text-white">
                  Cancel
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* 1. Title */}
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Assignment Title</label>
                  <input 
                      type="text" 
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      placeholder="e.g. Prospecting Challenge – Day 1"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
              </div>

              {/* 2. Type (Simplified) */}
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Assignment Type</label>
                  <div className="relative">
                      <select 
                          value={assignmentType}
                          onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 appearance-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      >
                          <option value="TEXT">Text Answer (Standard)</option>
                          <option value="UPLOAD_IMAGE">Image Upload</option>
                          <option value="UPLOAD_DOC">Document Upload</option>
                          <option value="VIDEO_UPLOAD">Video Upload</option>
                          <option value="MULTIPLE_CHOICE">Multiple Choice Quiz</option>
                          <option value="LINK">External Link</option>
                          <option value="MIXED">Mixed / Custom Questions</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                  </div>
              </div>

              {/* 3. Instructions */}
              <div>
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Instructions</label>
                      <span className={`text-[10px] font-bold ${assignmentDescription.length > 2000 ? 'text-red-500' : 'text-slate-400'}`}>{assignmentDescription.length}/2000</span>
                  </div>
                  <textarea 
                      value={assignmentDescription}
                      onChange={(e) => setAssignmentDescription(e.target.value.slice(0, 2000))}
                      placeholder="Explain what needs to be done..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 min-h-[120px] resize-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
                  />
              </div>

              {/* 4. Training Material */}
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Attach Training Material</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                      {/* Hidden Inputs */}
                      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => handleMaterialUpload(e, 'DOC')} />
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                          <Upload size={16} /> Upload PDF/Img
                      </button>
                      <button 
                        onClick={addVideoLink}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                          <Video size={16} /> Add Video Link
                      </button>
                  </div>

                  {/* List of attachments */}
                  {assignmentMaterials.length > 0 && (
                      <div className="space-y-2">
                          {assignmentMaterials.map((att, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 dark:bg-slate-700/50 dark:border-slate-600">
                                  <div className="flex items-center gap-3">
                                      {att.type === 'VIDEO' ? <Video size={18} className="text-blue-500" /> : att.type === 'IMAGE' ? <ImageIcon size={18} className="text-purple-500" /> : <FileText size={18} className="text-orange-500" />}
                                      <div>
                                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{att.name}</p>
                                          {att.url.startsWith('http') && !att.url.startsWith('data:') && <p className="text-[10px] text-blue-500 underline truncate max-w-[200px]">{att.url}</p>}
                                      </div>
                                  </div>
                                  <button onClick={() => removeMaterial(idx)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* 5. Add Questions (Dynamic) */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 dark:bg-slate-700/30 dark:border-slate-600">
                  <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Questions ({assignmentQuestions.length})</label>
                      <button onClick={addQuestion} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 dark:text-emerald-400">
                          <Plus size={14} /> Add Question
                      </button>
                  </div>
                  
                  <div className="space-y-6">
                      {assignmentQuestions.map((q, idx) => (
                          <div key={q.id} className="relative flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-600">
                              <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{idx + 1}</span>
                                      <select 
                                          value={q.type} 
                                          onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                          className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 outline-none focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-500 dark:text-white"
                                      >
                                          <option value="TEXT">Short Answer</option>
                                          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                          <option value="FILE_UPLOAD">File Upload</option>
                                          <option value="VOICE">Voice Prompt</option>
                                      </select>
                                  </div>
                                  <button onClick={() => removeQuestion(q.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                              </div>

                              {/* Question Input / Voice Recorder */}
                              <div className="space-y-3">
                                  {q.type === 'VOICE' ? (
                                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                                          {recordingQuestionId === q.id ? (
                                              <button onClick={stopRecording} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse text-white hover:bg-red-600"><StopCircle size={20} /></button>
                                          ) : (
                                              <button onClick={() => startRecording(q.id)} className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400"><Mic size={20} /></button>
                                          )}
                                          
                                          <div className="flex-1">
                                              {q.audioUrl ? (
                                                  <audio src={q.audioUrl} controls className="h-8 w-full max-w-[200px]" />
                                              ) : (
                                                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">{recordingQuestionId === q.id ? "Recording..." : "Record audio question"}</span>
                                              )}
                                          </div>
                                      </div>
                                  ) : null}

                                  {/* Always allow text prompt even for voice/file */}
                                  <input 
                                      type="text" 
                                      value={q.text}
                                      onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                      placeholder={q.type === 'VOICE' ? "Optional text caption..." : q.type === 'FILE_UPLOAD' ? "Describe what file they should upload..." : "Enter your question..."}
                                      className="w-full p-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-transparent text-slate-900 dark:text-white dark:border-slate-600"
                                  />

                                  {/* Multiple Choice Options */}
                                  {q.type === 'MULTIPLE_CHOICE' && (
                                      <div className="pl-4 border-l-2 border-slate-100 space-y-2 dark:border-slate-700">
                                          <label className="text-[10px] font-bold text-slate-400 uppercase">Answer Options</label>
                                          {(q.options || []).map((opt, optIdx) => (
                                              <div key={optIdx} className="flex items-center gap-2">
                                                  <input 
                                                      type="radio" 
                                                      name={`correct-${q.id}`} 
                                                      checked={q.correctAnswer === optIdx}
                                                      onChange={() => updateQuestion(q.id, 'correctAnswer', optIdx)}
                                                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                  />
                                                  <span className="text-xs font-bold text-slate-400 w-4">{String.fromCharCode(65 + optIdx)}.</span>
                                                  <input 
                                                      type="text" 
                                                      value={opt}
                                                      onChange={(e) => updateOptionText(q.id, optIdx, e.target.value)}
                                                      className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                  />
                                                  <button onClick={() => removeOption(q.id, optIdx)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>
                                              </div>
                                          ))}
                                          <button onClick={() => addOptionToQuestion(q.id)} className="text-xs text-blue-500 font-bold hover:underline mt-1">+ Add Option</button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                      {assignmentQuestions.length === 0 && <p className="text-sm text-slate-400 italic text-center">No questions added yet.</p>}
                  </div>
              </div>

              {/* 6. Deadline */}
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Deadline</label>
                  <input 
                      type="datetime-local" 
                      value={assignmentDeadline}
                      onChange={(e) => setAssignmentDeadline(e.target.value)}
                      className="w-full md:w-auto p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 text-sm bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
              </div>

              {/* 7. Assign To */}
              <div>
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Assign To</label>
                      <button onClick={selectAllRecipients} className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400">
                          {assignmentRecipients.length === myDownline.length ? 'Deselect All' : 'Select All Team'}
                      </button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl max-h-60 overflow-y-auto bg-slate-50 p-2 space-y-1 dark:bg-slate-800 dark:border-slate-700">
                      {myDownline.length > 0 ? myDownline.map(student => (
                          <label key={student.handle} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 hover:border-emerald-200 cursor-pointer transition-colors dark:bg-slate-700 dark:border-slate-600">
                              <input 
                                  type="checkbox" 
                                  checked={assignmentRecipients.includes(student.handle)}
                                  onChange={() => toggleRecipient(student.handle)}
                                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                              />
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{student.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{student.handle}</p>
                              </div>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded dark:bg-slate-600 dark:text-slate-300">{student.rankProgress?.currentRankId || 'NOVUS'}</span>
                          </label>
                      )) : <p className="text-center text-sm text-slate-400 py-4">No downline members found.</p>}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">{assignmentRecipients.length} selected</p>
              </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-700 flex justify-between items-center shrink-0">
              <button 
                  onClick={() => handleSaveAssignment('DRAFT')}
                  className="text-slate-600 font-bold text-sm p-3 md:px-6 md:py-3 rounded-xl hover:bg-slate-50 border border-slate-200 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800 flex items-center gap-2"
                  title="Save Draft"
              >
                  <Save size={18} className="md:hidden" />
                  <span className="hidden md:inline">Save Draft</span>
              </button>
              <button 
                  onClick={() => handleSaveAssignment('ACTIVE')}
                  className="bg-emerald-600 text-white font-bold text-sm p-3 md:px-8 md:py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2"
                  title="Send Assignment"
              >
                  <Megaphone size={18} /> 
                  <span className="hidden md:inline">Send Assignment</span>
              </button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button 
          onClick={() => {
              if (activeView === 'TEMPLATE_EDITOR') setActiveView('TEMPLATES_LIST');
              else if (activeView === 'TEMPLATES_LIST') setActiveView('MENU');
              else if (activeView === 'ASSIGNMENT_EDITOR') setActiveView('ASSIGNMENTS_LIST');
              else if (activeView === 'ASSIGNMENTS_LIST') setActiveView('MENU');
              else navigate('/dashboard'); // Go back to dashboard from main menu
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors font-medium text-sm dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={16} /> {activeView === 'MENU' ? 'Dashboard' : 'Back'}
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Mentorship Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Empower your team with advanced management features.</p>
      </div>

      {/* View Switcher */}
      <div className="max-w-4xl mx-auto">
          {activeView === 'MENU' && renderMenu()}
          {activeView === 'TEMPLATES_LIST' && renderTemplatesList()}
          {activeView === 'TEMPLATE_EDITOR' && renderTemplateEditor()}
          {activeView === 'ASSIGNMENTS_LIST' && renderAssignmentsList()}
          {activeView === 'ASSIGNMENT_EDITOR' && renderAssignmentEditor()}
      </div>
    </div>
  );
};

export default MentorshipTools;
