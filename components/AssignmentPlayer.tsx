
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Assignment, AssignmentSubmission, AssignmentAnswer, Student, Attachment } from '../types';
import { ArrowLeft, Clock, User, CheckCircle, FileText, Video, Mic, Image as ImageIcon, Link as LinkIcon, Upload, X, Save, Send } from 'lucide-react';

interface AssignmentPlayerProps {
  currentUser: Student;
  assignments: Assignment[];
  onSubmit: (submission: AssignmentSubmission) => void;
}

const AssignmentPlayer: React.FC<AssignmentPlayerProps> = ({ currentUser, assignments, onSubmit }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const assignment = assignments.find(a => a.id === assignmentId);

  // States for answers
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [fileAttachments, setFileAttachments] = useState<Record<string, Attachment>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for file inputs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!assignment) return <div className="p-8 text-center dark:text-white">Assignment not found</div>;

  const existingSubmission = currentUser.assignmentSubmissions?.find(s => s.assignmentId === assignment.id);
  const isCompleted = !!existingSubmission;

  // --- Handlers ---

  const handleTextChange = (qId: string, val: string) => {
      setTextAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
      setSelectedOptions(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleFileUpload = (qId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const att: Attachment = {
                  type: file.type.startsWith('image/') ? 'IMAGE' : file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT',
                  url: reader.result as string,
                  name: file.name,
                  size: `${(file.size / 1024).toFixed(1)} KB`,
                  mimeType: file.type
              };
              setFileAttachments(prev => ({ ...prev, [qId]: att }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleRemoveAttachment = (qId: string) => {
      const newAtts = { ...fileAttachments };
      delete newAtts[qId];
      setFileAttachments(newAtts);
  };

  const handleSubmit = () => {
      // Validate required fields (simplified: check if text questions have answers)
      // In a real app, robust validation needed.
      if (Object.keys(textAnswers).length < assignment.questions.filter(q => q.type === 'TEXT').length) {
          if (!window.confirm("Some text questions are empty. Submit anyway?")) return;
      }

      setIsSubmitting(true);

      // Construct Answers Array
      const answers: AssignmentAnswer[] = assignment.questions.map(q => ({
          questionId: q.id,
          textAnswer: textAnswers[q.id],
          selectedOption: selectedOptions[q.id],
          attachment: fileAttachments[q.id]
      }));

      const submission: AssignmentSubmission = {
          id: `sub_${Date.now()}`,
          assignmentId: assignment.id,
          studentHandle: currentUser.handle,
          answers,
          submittedAt: Date.now(),
          status: 'SUBMITTED'
      };

      setTimeout(() => {
          onSubmit(submission);
          setIsSubmitting(false);
          alert("Assignment Submitted Successfully!");
          navigate('/assignments');
      }, 1000); // Simulate network
  };

  // --- Render Helpers ---

  const renderMaterialIcon = (type: string) => {
      switch(type) {
          case 'VIDEO': return <Video size={20} className="text-blue-500"/>;
          case 'IMAGE': return <ImageIcon size={20} className="text-purple-500"/>;
          case 'DOCUMENT': return <FileText size={20} className="text-red-500"/>;
          default: return <LinkIcon size={20} className="text-slate-500"/>;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 dark:bg-slate-900 dark:border-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-800">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="font-bold text-slate-900 text-sm md:text-base dark:text-white truncate max-w-[200px]">{assignment.title}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">By {assignment.authorHandle}</p>
                </div>
                <div>
                    {isCompleted ? (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">Completed</span>
                    ) : (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Pending</span>
                    )}
                </div>
            </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                {assignment.deadline && (
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded dark:bg-slate-800">
                        <Clock size={14} /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                )}
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded dark:bg-slate-800">
                    <User size={14} /> Sponsor: {assignment.authorHandle}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 mb-4 dark:text-white">Instructions</h2>
                
                {/* Voice Instruction Player */}
                {assignment.instructionAudioUrl && (
                    <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3 dark:bg-slate-700/50 dark:border-slate-600">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
                            <Mic size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Audio Instructions</p>
                            <audio controls src={assignment.instructionAudioUrl} className="w-full h-8" />
                        </div>
                    </div>
                )}

                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed dark:text-slate-300">{assignment.description}</p>
            </div>

            {/* Training Materials */}
            {assignment.materials && assignment.materials.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Training Materials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignment.materials.map((mat, idx) => (
                            <a 
                                key={idx} 
                                href={mat.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-500"
                            >
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors dark:bg-slate-700 dark:group-hover:bg-emerald-900/30">
                                    {renderMaterialIcon(mat.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate dark:text-white">{mat.name || 'Resource'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{mat.type} {mat.size ? `• ${mat.size}` : ''}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Questions Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Your Response</h3>
                
                {assignment.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex gap-3 mb-4">
                            <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 dark:bg-slate-700 dark:text-slate-300">{idx + 1}</span>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 dark:text-white">{q.text}</p>
                                {q.audioUrl && (
                                    <div className="mt-2">
                                        <audio controls src={q.audioUrl} className="h-8" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Area based on Type */}
                        <div className="pl-9">
                            {q.type === 'TEXT' && (
                                <textarea 
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                    rows={3}
                                    placeholder="Type your answer here..."
                                    value={textAnswers[q.id] || ''}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    disabled={isCompleted}
                                />
                            )}

                            {q.type === 'MULTIPLE_CHOICE' && q.options && (
                                <div className="space-y-2">
                                    {q.options.map((opt, i) => (
                                        <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedOptions[q.id] === i ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 dark:bg-emerald-900/20 dark:border-emerald-500' : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'}`}>
                                            <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                checked={selectedOptions[q.id] === i}
                                                onChange={() => handleOptionSelect(q.id, i)}
                                                disabled={isCompleted}
                                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {(q.type === 'FILE_UPLOAD' || q.type === 'VOICE') && (
                                <div>
                                    {fileAttachments[q.id] ? (
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl dark:bg-emerald-900/20 dark:border-emerald-800">
                                            <div className="p-2 bg-white rounded-lg text-emerald-600 dark:bg-slate-800"><CheckCircle size={20}/></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-emerald-900 truncate dark:text-emerald-300">{fileAttachments[q.id].name}</p>
                                                <p className="text-xs text-emerald-700 dark:text-emerald-500">{fileAttachments[q.id].size}</p>
                                            </div>
                                            {!isCompleted && (
                                                <button onClick={() => handleRemoveAttachment(q.id)} className="text-slate-400 hover:text-red-500 p-2">
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div 
                                            onClick={() => !isCompleted && fileInputRefs.current[q.id]?.click()}
                                            className={`border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-400 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800'}`}
                                        >
                                            {q.type === 'VOICE' ? <Mic size={24} className="mb-2"/> : <Upload size={24} className="mb-2"/>}
                                            <span className="text-sm font-bold">{q.type === 'VOICE' ? 'Upload Audio Recording' : 'Upload File'}</span>
                                            <input 
                                                type="file" 
                                                ref={(el) => { fileInputRefs.current[q.id] = el; }}
                                                className="hidden" 
                                                accept={q.type === 'VOICE' ? 'audio/*' : '*/*'}
                                                onChange={(e) => handleFileUpload(q.id, e)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submission Footer */}
            <div className="flex justify-end pt-8 pb-8">
                {isCompleted ? (
                    <div className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                        <CheckCircle size={20} /> Assignment Completed
                    </div>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Assignment'} <Send size={18} />
                    </button>
                )}
            </div>

        </div>
    </div>
  );
};

export default AssignmentPlayer;
