
import React, { useState, useRef, useEffect } from 'react';
import { Student, Attachment, Broadcast } from '../types';
import RichTextEditor from './SalesEditor/RichTextEditor';
import { Users, User, CheckCircle, Bell, AlertTriangle, Calendar, Eye, Send, Save, X, Search, Image as ImageIcon, FileText, Video, Mic, ChevronDown, Trash2, StopCircle, Play, Pause } from 'lucide-react';

interface BroadcastBuilderProps {
  currentUser: Student;
  students: Student[]; // All potential recipients
  onSave: (broadcast: Broadcast) => void;
  onCancel: () => void;
  initialData?: Broadcast;
}

const BroadcastBuilder: React.FC<BroadcastBuilderProps> = ({ currentUser, students, onSave, onCancel, initialData }) => {
  // --- Form State ---
  const [title, setTitle] = useState(initialData?.title || '');
  const [contentType, setContentType] = useState<'TEXT' | 'VOICE'>('TEXT'); // New Toggle
  const [content, setContent] = useState(initialData?.content || '');
  const [audienceType, setAudienceType] = useState<'ALL' | 'DIRECT' | 'SELECTED'>(initialData?.audienceType || 'ALL');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(initialData?.recipients || []);
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);
  
  // Options
  const [sendNotification, setSendNotification] = useState(true);
  const [isImportant, setIsImportant] = useState(initialData?.isImportant || false);
  const [scheduledFor, setScheduledFor] = useState(initialData?.scheduledFor || '');
  
  // UI State
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter Logic
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const directDownline = myDownline; 

  const handleAudienceChange = (type: 'ALL' | 'DIRECT' | 'SELECTED') => {
      setAudienceType(type);
      if (type === 'ALL') {
          setSelectedRecipients(myDownline.map(s => s.handle));
      } else if (type === 'DIRECT') {
          setSelectedRecipients(directDownline.map(s => s.handle));
      } else {
          if (selectedRecipients.length === myDownline.length) setSelectedRecipients([]);
          setShowRecipientModal(true);
      }
  };

  const toggleRecipient = (handle: string) => {
      setSelectedRecipients(prev => 
          prev.includes(handle) ? prev.filter(h => h !== handle) : [...prev, handle]
      );
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newAtt: Attachment = {
                  type: file.type.startsWith('image/') ? 'IMAGE' : file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT',
                  url: reader.result as string,
                  name: file.name,
                  size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                  mimeType: file.type
              };
              setAttachments(prev => [...prev, newAtt]);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- Voice Logic ---
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
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
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = () => {
                  const base64data = reader.result as string;
                  setAudioUrl(base64data);
                  // Auto add as attachment
                  const audioAtt: Attachment = {
                      type: 'AUDIO',
                      url: base64data,
                      name: `Voice Message - ${new Date().toLocaleTimeString()}`,
                      size: `${(audioBlob.size / 1024).toFixed(1)} KB`,
                      mimeType: 'audio/webm'
                  };
                  // Remove previous voice notes if any to avoid duplicates in voice mode
                  setAttachments(prev => [...prev.filter(a => a.type !== 'AUDIO'), audioAtt]);
              };
              stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingDuration(0);
          timerRef.current = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
      } catch (e) {
          alert("Could not access microphone.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
      }
  };

  const deleteRecording = () => {
      setAudioUrl(null);
      setAttachments(prev => prev.filter(a => a.type !== 'AUDIO'));
  };

  const handleSubmit = (status: 'DRAFT' | 'SENT' | 'SCHEDULED') => {
      if (!title.trim()) return alert("Title is required");
      if (status !== 'DRAFT' && selectedRecipients.length === 0) return alert("Select at least one recipient");

      const finalStatus = scheduledFor ? 'SCHEDULED' : status;
      
      // If voice mode, content is optional or auto-filled
      let finalContent = content;
      if (contentType === 'VOICE' && !content.trim()) {
          finalContent = '<p><em>Voice Message Attached</em></p>';
      }

      const broadcast: Broadcast = {
          id: initialData?.id || `broadcast_${Date.now()}`,
          title,
          content: finalContent,
          authorHandle: currentUser.handle,
          recipients: selectedRecipients,
          audienceType,
          attachments,
          isImportant,
          scheduledFor: scheduledFor || undefined,
          status: finalStatus,
          createdAt: Date.now()
      };

      onSave(broadcast);
  };

  // --- PREVIEW MODAL ---
  const renderPreview = () => (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-800 dark:text-white">Recipient View</h3>
                  <button onClick={() => setShowPreview(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-0 bg-slate-100 dark:bg-black">
                  {/* Phone Screen Simulation */}
                  <div className="bg-white dark:bg-slate-900 m-4 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                      {/* Notification Banner Simulation */}
                      {sendNotification && (
                          <div className="bg-slate-800 text-white p-3 rounded-xl mb-4 flex items-center gap-3 text-xs shadow-lg">
                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">N</div>
                              <div>
                                  <p className="font-bold">Nexu App</p>
                                  <p className="opacity-80 truncate w-48">{title}</p>
                              </div>
                              <span className="ml-auto text-[10px] opacity-60">Now</span>
                          </div>
                      )}

                      {/* Message Bubble */}
                      <div className="space-y-3">
                          {isImportant && (
                              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 border border-red-100 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400">
                                  <AlertTriangle size={12} /> IMPORTANT ANNOUNCEMENT
                              </div>
                          )}
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{title}</h2>
                          
                          {/* Audio Player if Voice Mode */}
                          {attachments.find(a => a.type === 'AUDIO') && (
                              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 flex items-center gap-3">
                                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                                      <Play size={20} fill="currentColor" />
                                  </div>
                                  <div className="flex-1">
                                      <div className="h-1 bg-emerald-200 rounded-full w-full dark:bg-emerald-800 mb-1"></div>
                                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">Voice Message</p>
                                  </div>
                              </div>
                          )}

                          <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: content || (contentType === 'VOICE' ? '' : '<p class="text-slate-400 italic">No content...</p>') }} />
                          
                          {/* Attachments Preview (Non-Audio) */}
                          {attachments.filter(a => a.type !== 'AUDIO').length > 0 && (
                              <div className="space-y-2 pt-2">
                                  {attachments.filter(a => a.type !== 'AUDIO').map((att, i) => (
                                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                          <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-emerald-600">
                                              {att.type === 'IMAGE' ? <ImageIcon size={16} /> : att.type === 'VIDEO' ? <Video size={16} /> : <FileText size={16} />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-xs font-bold truncate text-slate-700 dark:text-slate-200">{att.name}</p>
                                              <p className="text-[10px] text-slate-400">{att.size}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}

                          <p className="text-[10px] text-slate-400 text-right mt-2">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • From {currentUser.name}</p>
                      </div>
                  </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => setShowPreview(false)} className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold">Close Preview</button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      
      {/* 1. HEADER */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Broadcast</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Send announcements to your team.</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
          </button>
      </div>

      {/* 2. SCROLLABLE FORM */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          
          {/* (A) Title */}
          <div>
              <div className="flex justify-between mb-2 ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Broadcast Title <span className="text-red-500">*</span></label>
                  <span className={`text-xs font-bold ${title.length === 50 ? 'text-red-500' : 'text-slate-400'}`}>{title.length}/50</span>
              </div>
              <input 
                  type="text" 
                  value={title}
                  maxLength={50}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Month Target & Updates"
                  className="w-full p-4 text-lg font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
          </div>

          {/* (B) Audience */}
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 dark:text-slate-400">Select Audience</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                      { id: 'ALL', label: 'Entire Team', icon: Users, desc: `${myDownline.length} Members` },
                      { id: 'DIRECT', label: 'Downlines Only', icon: User, desc: '1st Generation' },
                      { id: 'SELECTED', label: 'Select Specific', icon: CheckCircle, desc: 'Choose manually' }
                  ].map((opt) => (
                      <button
                          key={opt.id}
                          onClick={() => handleAudienceChange(opt.id as any)}
                          className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                              audienceType === opt.id 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : 'border-slate-100 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                      >
                          <opt.icon size={20} className={`mb-2 ${audienceType === opt.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <p className={`font-bold text-sm ${audienceType === opt.id ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>{opt.label}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                          {audienceType === opt.id && <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 rounded-full"></div>}
                      </button>
                  ))}
              </div>
              
              {/* Audience Summary */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                  <span>Targeting: <strong className="text-slate-800 dark:text-slate-200">{selectedRecipients.length} recipients</strong></span>
                  {audienceType === 'SELECTED' && (
                      <button onClick={() => setShowRecipientModal(true)} className="text-emerald-600 font-bold hover:underline">Edit Selection</button>
                  )}
              </div>
          </div>

          {/* (C) Message Content (Text vs Voice) */}
          <div>
              <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase ml-1 dark:text-slate-400">Message Content</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
                      <button 
                        onClick={() => setContentType('TEXT')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${contentType === 'TEXT' ? 'bg-white shadow-sm text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                          Text
                      </button>
                      <button 
                        onClick={() => setContentType('VOICE')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${contentType === 'VOICE' ? 'bg-white shadow-sm text-slate-800 dark:bg-slate-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                          Voice
                      </button>
                  </div>
              </div>

              {contentType === 'TEXT' ? (
                  <RichTextEditor value={content} onChange={setContent} />
              ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 dark:bg-slate-800/50 dark:border-slate-700">
                      {audioUrl ? (
                          <div className="w-full max-w-sm bg-white p-4 rounded-xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                              <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                                      <Mic size={20} />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm font-bold text-slate-800 dark:text-white">Voice Note Recorded</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">Ready to send</p>
                                  </div>
                                  <button onClick={deleteRecording} className="text-red-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                              </div>
                              <audio src={audioUrl} controls className="w-full h-8" />
                          </div>
                      ) : (
                          <>
                              <div 
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg ${isRecording ? 'bg-red-500 animate-pulse text-white scale-110' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'}`}
                              >
                                  {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
                              </div>
                              <div className="text-center">
                                  <p className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                                      {isRecording ? formatTime(recordingDuration) : 'Tap to Record'}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">{isRecording ? 'Recording in progress...' : 'Send a personal voice message'}</p>
                              </div>
                          </>
                      )}
                  </div>
              )}
          </div>

          {/* (D) Media Attachments (Hidden if Voice mode to avoid clutter, or kept optional) */}
          {contentType === 'TEXT' && (
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 dark:text-slate-400">Add Media</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleAttachment} />
                    
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 hover:border-emerald-400 transition-all dark:border-slate-600 dark:hover:bg-slate-800">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 dark:bg-slate-700"><ImageIcon size={16}/></div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Upload File</span>
                    </button>
                    
                    {attachments.map((att, i) => (
                        <div key={i} className="relative p-3 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 dark:border-slate-700">
                            <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 text-slate-400 hover:text-red-500"><X size={12}/></button>
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {att.type === 'IMAGE' ? <ImageIcon size={14}/> : <FileText size={14}/>}
                            </div>
                            <p className="text-[10px] font-bold truncate w-full px-1 dark:text-slate-300">{att.name}</p>
                            <p className="text-[9px] text-slate-400">{att.size}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* (E) Settings */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 dark:text-slate-400">Notification Settings</label>
              
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${sendNotification ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'} transition-colors`}>
                              <Bell size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Push Notification</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Notify recipients on their device</p>
                          </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={sendNotification} onChange={e => setSendNotification(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700 dark:peer-checked:bg-emerald-600"></div>
                      </label>
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isImportant ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'} transition-colors`}>
                              <AlertTriangle size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Mark as Important</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Pin to top of their inbox</p>
                          </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:bg-slate-700"></div>
                      </label>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${scheduledFor ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'} transition-colors`}>
                              <Calendar size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Schedule Delivery</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{scheduledFor ? 'Will send later' : 'Send immediately'}</p>
                          </div>
                      </div>
                      <div className="w-full md:w-auto">
                          <input 
                              type="datetime-local" 
                              value={scheduledFor}
                              onChange={(e) => setScheduledFor(e.target.value)}
                              className="w-full md:w-auto text-sm p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                          />
                      </div>
                  </div>
              </div>
          </div>

      </div>

      {/* 3. FOOTER ACTIONS */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center gap-3">
          <button 
              onClick={() => setShowPreview(true)}
              className="flex-1 md:flex-none md:w-auto text-slate-600 hover:bg-slate-50 font-bold text-sm px-4 md:px-6 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
              title="Preview"
          >
              <Eye size={18} /> <span className="hidden md:inline">Preview</span>
          </button>
          
          <div className="flex flex-1 md:flex-none w-full md:w-auto gap-3">
              <button 
                  onClick={() => handleSubmit('DRAFT')}
                  className="flex-1 md:flex-none text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold text-sm px-4 md:px-6 py-3 rounded-xl transition-colors dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30 flex items-center justify-center gap-2"
                  title="Save Draft"
              >
                  <Save size={18} /> <span className="hidden md:inline">Save Draft</span>
              </button>
              <button 
                  onClick={() => handleSubmit('SENT')}
                  className="flex-1 md:flex-none bg-emerald-600 text-white font-bold text-sm px-6 md:px-8 py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2 transition-transform active:scale-95"
                  title={scheduledFor ? 'Schedule' : 'Send Broadcast'}
              >
                  {scheduledFor ? <Calendar size={18} /> : <Send size={18} />} 
                  <span className="hidden md:inline">{scheduledFor ? 'Schedule' : 'Send Broadcast'}</span>
              </button>
          </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Audience Selection Modal */}
      {showRecipientModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg dark:text-white">Select Recipients</h3>
                      <button onClick={() => setShowRecipientModal(false)}><X size={20} className="text-slate-400" /></button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                      <div className="relative">
                          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                          <input 
                              type="text" 
                              value={recipientSearch}
                              onChange={(e) => setRecipientSearch(e.target.value)}
                              placeholder="Search by name..." 
                              className="w-full pl-9 p-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                          />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedRecipients.length} Selected</span>
                          <button 
                              onClick={() => setSelectedRecipients(selectedRecipients.length === myDownline.length ? [] : myDownline.map(s => s.handle))}
                              className="text-xs text-emerald-600 font-bold hover:underline dark:text-emerald-400"
                          >
                              {selectedRecipients.length === myDownline.length ? 'Deselect All' : 'Select All'}
                          </button>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                      {myDownline
                          .filter(s => s.name.toLowerCase().includes(recipientSearch.toLowerCase()))
                          .map(student => (
                              <label key={student.handle} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedRecipients.includes(student.handle)}
                                      onChange={() => toggleRecipient(student.handle)}
                                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:checked:bg-emerald-600 accent-emerald-600"
                                  />
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                      {student.name.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{student.name}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.role} • {student.handle}</p>
                                  </div>
                              </label>
                          ))
                      }
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => setShowRecipientModal(false)} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700">
                          Done
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Preview Modal */}
      {showPreview && renderPreview()}

    </div>
  );
};

export default BroadcastBuilder;
