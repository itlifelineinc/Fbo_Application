import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, Message, UserRole, MessageStatus, Attachment, MentorshipTemplate, Assignment, Broadcast } from '../types';
import { MoreVertical, Trash2, ChevronDown, Reply, Copy, ArrowRight, X, Search, MessageSquarePlus, Hash, Plus, Paperclip, LayoutTemplate, ClipboardCheck, Megaphone, Image as ImageIcon, FileText, Mic, Link as LinkIcon, Download, Play, Pause, ExternalLink, LayoutGrid, StopCircle, ArrowLeft, ChevronLeft } from 'lucide-react';

interface ChatPortalProps {
  currentUser: Student;
  students: Student[];
  messages: Message[];
  templates?: MentorshipTemplate[];
  assignments?: Assignment[];
  broadcasts?: Broadcast[];
  onSendMessage: (message: Message) => void;
  onMarkAsRead?: (senderHandle: string) => void;
  onClearChat?: (handle: string) => void;
  onDeleteMessage?: (messageId: string, type: 'me' | 'everyone') => void;
}

const TickIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 16 15" width="11" height="11" className={className}>
        <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 14.302l-2.592-2.716a.366.366 0 0 0-.51-.028l-.494.44a.365.365 0 0 0-.024.53l3.352 3.512c.137.143.37.146.51.008L15.074 3.826a.365.365 0 0 0-.063-.51z"/>
    </svg>
);

const MessageStatusIcon: React.FC<{ status: MessageStatus, isRead: boolean }> = ({ status, isRead }) => {
    const colorClass = (isRead || status === 'READ') ? "text-[#53bdeb]" : "text-[#8696a0] dark:text-[#8696a0]";
    return (
        <div className="flex items-center justify-end w-[22px]">
            {(isRead || status === 'READ' || status === 'DELIVERED') ? (
                <div className="flex items-center">
                    <TickIcon className={colorClass} />
                    <TickIcon className={`${colorClass} -ml-[1.5px]`} />
                </div>
            ) : (
                <TickIcon className={colorClass} />
            )}
        </div>
    );
};

const ChatPortal: React.FC<ChatPortalProps> = ({ currentUser, students, messages, templates = [], assignments = [], broadcasts = [], onSendMessage, onMarkAsRead, onClearChat, onDeleteMessage }) => {
  const navigate = useNavigate();
  const [activeChatHandle, setActiveChatHandle] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [selectedBroadcastUsers, setSelectedBroadcastUsers] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachmentView, setAttachmentView] = useState<'MAIN' | 'TEMPLATES' | 'ASSIGNMENTS' | 'ANNOUNCEMENTS'>('MAIN');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [extraChannels, setExtraChannels] = useState<{handle: string, name: string, avatar: string, type: 'TOPIC' | 'USER'}[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<'up' | 'down'>('down');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const fileInputImageRef = useRef<HTMLInputElement>(null);
  const fileInputDocRef = useRef<HTMLInputElement>(null);
  const fileInputAudioRef = useRef<HTMLInputElement>(null);

  const hasMentorshipAccess = currentUser.role === UserRole.SPONSOR || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN || (currentUser.rankProgress?.currentRankId && currentUser.rankProgress.currentRankId !== 'NOVUS');
  const myTemplates = templates.filter(t => t.authorHandle === currentUser.handle || t.authorHandle === '@forever_system');
  const myAssignments = assignments.filter(a => a.authorHandle === currentUser.handle);
  const myBroadcasts = (broadcasts || []).filter(b => b.authorHandle === currentUser.handle).sort((a,b) => b.createdAt - a.createdAt);
  const myGroupId = `GROUP_${currentUser.role === UserRole.SPONSOR ? currentUser.handle : currentUser.sponsorId}`;
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const mySponsor = students.find(s => s.handle === currentUser.sponsorId);

  const baseChatList = [
    { handle: myGroupId, name: "My Team Channel", avatar: "👥", lastMsg: messages.filter(m => m.recipientHandle === myGroupId).pop()?.text || "No messages yet" },
    ...(mySponsor ? [{ handle: mySponsor.handle, name: `${mySponsor.name} (Sponsor)`, avatar: mySponsor.avatarUrl || mySponsor.name.charAt(0), lastMsg: messages.filter(m => (m.senderHandle === mySponsor.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === mySponsor.handle)).pop()?.text || "Start conversation" }] : []),
    ...myDownline.map(student => ({ handle: student.handle, name: student.name, avatar: student.avatarUrl || student.name.charAt(0), lastMsg: messages.filter(m => (m.senderHandle === student.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === student.handle)).pop()?.text || "Start conversation" })),
    ...extraChannels.map(ch => ({ handle: ch.handle, name: ch.name, avatar: ch.avatar, lastMsg: messages.filter(m => (m.senderHandle === ch.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === ch.handle) || (m.recipientHandle === ch.handle)).pop()?.text || "New topic started" }))
  ];

  const filteredChatList = baseChatList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.handle.toLowerCase().includes(searchQuery.toLowerCase()));
  const existingHandles = new Set(baseChatList.map(c => c.handle));
  const globalSearchResults = searchQuery.trim() ? students.filter(s => s.id !== currentUser.id && !existingHandles.has(s.handle) && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.handle.toLowerCase().includes(searchQuery.toLowerCase()))) : [];
  const activeMessages = messages.filter(m => {
    if (!activeChatHandle) return false;
    if (activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_')) return m.recipientHandle === activeChatHandle;
    return (m.senderHandle === currentUser.handle && m.recipientHandle === activeChatHandle) || (m.senderHandle === activeChatHandle && m.recipientHandle === currentUser.handle);
  }).sort((a,b) => a.timestamp - b.timestamp);

  const activeChatInfo = baseChatList.find(c => c.handle === activeChatHandle) || { name: students.find(s => s.handle === activeChatHandle)?.name || activeChatHandle || 'Chat', avatar: students.find(s => s.handle === activeChatHandle)?.avatarUrl || activeChatHandle?.charAt(0) || '?', handle: activeChatHandle };

  useEffect(() => {
    if (messageContainerRef.current) setTimeout(() => { if (messageContainerRef.current) messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight; }, 50);
  }, [activeMessages, activeChatHandle, pendingAttachment]);

  useEffect(() => {
    if (activeChatHandle && onMarkAsRead) {
      const hasUnread = activeMessages.some(m => m.senderHandle === activeChatHandle && !m.isRead);
      if (hasUnread) onMarkAsRead(activeChatHandle);
    }
  }, [activeChatHandle, activeMessages, onMarkAsRead]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) { setShowAttachMenu(false); setAttachmentView('MAIN'); } };
    if (showAttachMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; } }, [newMessage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'IMAGE' | 'DOCUMENT' | 'AUDIO') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("File is too large. Max 5MB allowed."); return; }
      const reader = new FileReader();
      reader.onload = () => { setPendingAttachment({ type, url: reader.result as string, name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, mimeType: file.type }); setShowAttachMenu(false); };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleLinkSubmit = () => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(linkInput)) { alert("Please enter a valid URL"); return; }
    let finalUrl = linkInput;
    if (!linkInput.startsWith('http')) finalUrl = `https://${linkInput}`;
    setPendingAttachment({ type: 'LINK', url: finalUrl, name: linkInput });
    setLinkInput(''); setIsLinkModalOpen(false); setShowAttachMenu(false);
  };

  const formatTime = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs < 10 ? '0' : ''}${secs}`; };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader(); reader.readAsDataURL(audioBlob);
        reader.onloadend = () => { const base64data = reader.result as string; setPendingAttachment({ type: 'AUDIO', url: base64data, name: `Voice_Note_${new Date().toLocaleTimeString()}.webm`, size: `${(audioBlob.size / 1024).toFixed(1)} KB`, mimeType: 'audio/webm' }); };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start(); setIsRecording(true); setRecordingDuration(0);
      timerRef.current = setInterval(() => { setRecordingDuration(prev => prev + 1); }, 1000);
    } catch (e) { alert("Could not access microphone."); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); if (timerRef.current) clearInterval(timerRef.current); } };
  const cancelRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.onstop = null; mediaRecorderRef.current.stop(); mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); setIsRecording(false); if (timerRef.current) clearInterval(timerRef.current); audioChunksRef.current = []; } };

  const handleSend = () => {
    if (isRecording) { stopRecording(); return; }
    if (!newMessage.trim() && !pendingAttachment) return;
    const baseMessage = { id: `msg_${Date.now()}`, senderHandle: currentUser.handle, text: newMessage, timestamp: Date.now(), isRead: false, status: 'SENT' as MessageStatus, attachment: pendingAttachment ? pendingAttachment : undefined };
    if (isBroadcastMode) { selectedBroadcastUsers.forEach(handle => { onSendMessage({ ...baseMessage, id: `msg_${Date.now()}_${Math.random()}`, recipientHandle: handle, text: `[BROADCAST] ${newMessage}`, isSystem: true }); }); setIsBroadcastMode(false); setSelectedBroadcastUsers([]); alert("Broadcast sent!"); }
    else if (activeChatHandle) { onSendMessage({ ...baseMessage, recipientHandle: activeChatHandle }); }
    setNewMessage(''); setReplyToMessage(null); setPendingAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const toggleBroadcastUser = (handle: string) => { if (selectedBroadcastUsers.includes(handle)) setSelectedBroadcastUsers(prev => prev.filter(h => h !== handle)); else setSelectedBroadcastUsers(prev => [...prev, handle]); };
  const selectAllBroadcast = () => { if (selectedBroadcastUsers.length === myDownline.length) setSelectedBroadcastUsers([]); else setSelectedBroadcastUsers(myDownline.map(s => s.handle)); };
  const toggleMessageMenu = (e: React.MouseEvent, msgId: string) => { e.stopPropagation(); const trigger = e.currentTarget as HTMLElement; const rect = trigger.getBoundingClientRect(); setMenuPosition(rect.top > window.innerHeight / 2 ? 'up' : 'down'); setMessageMenuId(prev => prev === msgId ? null : msgId); };
  const handleReply = (msg: Message) => { setReplyToMessage(msg); setMessageMenuId(null); if (textareaRef.current) textareaRef.current.focus(); };
  const handleCreateTopic = () => { const name = prompt("Enter a name for this Topic Channel:"); if (name) { const handle = `TOPIC_${name.replace(/\s+/g, '_').toUpperCase()}`; setExtraChannels(prev => [...prev, { handle, name, avatar: '#', type: 'TOPIC' }]); setActiveChatHandle(handle); setSearchQuery(''); } };
  const handleStartGlobalChat = (student: Student) => { if (!extraChannels.some(c => c.handle === student.handle) && !baseChatList.some(c => c.handle === student.handle)) setExtraChannels(prev => [...prev, { handle: student.handle, name: student.name, avatar: student.avatarUrl || student.name.charAt(0), type: 'USER' }]); setActiveChatHandle(student.handle); setSearchQuery(''); };
  const handleTemplateSelect = (t: MentorshipTemplate) => { setPendingAttachment({ type: 'TEMPLATE', url: t.id, name: t.title, size: t.category }); setAttachmentView('MAIN'); setShowAttachMenu(false); if(textareaRef.current) textareaRef.current.focus(); };
  const handleAssignmentSelect = (a: Assignment) => { setPendingAttachment({ type: 'ASSIGNMENT', url: a.id, name: a.title, size: a.deadline ? new Date(a.deadline).toLocaleDateString() : 'No Deadline' }); setAttachmentView('MAIN'); setShowAttachMenu(false); if(textareaRef.current) textareaRef.current.focus(); };
  const handleBroadcastSelect = (b: Broadcast) => { setPendingAttachment({ type: 'BROADCAST', url: b.id, name: b.title, size: 'Announcement' }); setAttachmentView('MAIN'); setShowAttachMenu(false); if(textareaRef.current) textareaRef.current.focus(); };

  const AttachmentOption = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
      <button onClick={() => { onClick(); }} className="flex flex-col items-center gap-2 group p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110 ${color}`}>
              <Icon size={24} />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
      </button>
  );

  return (
    <div className="h-full flex flex-col md:flex-row bg-white md:rounded-2xl md:shadow-sm md:border border-slate-100 overflow-hidden animate-fade-in dark:bg-[#111b21] dark:border-slate-800">
      <input type="file" ref={fileInputImageRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'IMAGE')} />
      <input type="file" ref={fileInputDocRef} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={(e) => handleFileSelect(e, 'DOCUMENT')} />
      <input type="file" ref={fileInputAudioRef} className="hidden" accept="audio/*" onChange={(e) => handleFileSelect(e, 'AUDIO')} />

      {isLinkModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Add Link</h3>
                  <input type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="https://..." className="w-full p-3 border border-slate-200 rounded-xl mb-4 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white" autoFocus />
                  <div className="flex gap-3 justify-end">
                      <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-500 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-700">Cancel</button>
                      <button onClick={handleLinkSubmit} className="bg-emerald-500 text-white font-bold text-sm px-6 py-2 rounded-lg hover:bg-emerald-600 shadow-md">Add Link</button>
                  </div>
              </div>
          </div>
      )}

      <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col ${activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'} dark:bg-[#111b21] dark:border-slate-800`}>
        <div className="md:hidden shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center z-50 shadow-sm">
            {!isMobileSearchOpen ? (
                <div className="flex items-center gap-3 w-full">
                    <button onClick={() => navigate('/dashboard')} className="p-1 -ml-1 text-slate-700 dark:text-slate-300 active:scale-95">
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">Chats</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={() => setIsMobileSearchOpen(true)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95 hover:bg-slate-200 dark:hover:bg-slate-700">
                            <Search size={20} />
                        </button>
                        <button onClick={handleCreateTopic} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95">
                            <MessageSquarePlus size={20} />
                        </button>
                        {hasMentorshipAccess && (
                            <button onClick={() => navigate('/mentorship-tools')} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95">
                                <LayoutGrid size={20} />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 w-full animate-fade-in">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search chats..." autoFocus className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-slate-900 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-base" />
                    </div>
                    <button onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(''); }} className="text-slate-600 dark:text-slate-300 font-bold text-sm px-2">Cancel</button>
                </div>
            )}
        </div>

        <div className="hidden md:flex bg-[#f0f2f5] dark:bg-[#202c33] dark:border-[#202c33] border-b border-slate-200 flex flex-col shrink-0">
            <div className="px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold text-xl text-slate-800 dark:text-[#e9edef]">Chats</h2>
                <div className="flex gap-1">
                    <button onClick={handleCreateTopic} className="text-slate-500 hover:bg-slate-200 p-2 rounded-full transition-colors dark:text-[#aebac1] dark:hover:bg-[#374045]" title="Create Topic">
                        <MessageSquarePlus size={22} />
                    </button>
                    {hasMentorshipAccess && (
                        <button onClick={() => navigate('/mentorship-tools')} className="text-slate-500 hover:bg-slate-200 p-2 rounded-full transition-colors dark:text-[#aebac1] dark:hover:bg-[#374045]" title="Mentorship Tools">
                            <LayoutGrid size={22} />
                        </button>
                    )}
                </div>
            </div>
            <div className="px-3 pb-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-500 dark:text-[#aebac1]" /></div>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search or start new chat" className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#202c33] rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] dark:text-[#e9edef]" />
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {filteredChatList.map(chat => {
                const hasUnread = messages.some(m => m.recipientHandle === currentUser.handle && m.senderHandle === chat.handle && !m.isRead);
                return (
                    <div key={chat.handle} onClick={() => { setActiveChatHandle(chat.handle); setIsBroadcastMode(false); setIsMenuOpen(false); }} className={`px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 dark:hover:bg-[#202c33] ${activeChatHandle === chat.handle ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}>
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 dark:bg-[#374045] dark:text-[#e9edef]">
                            {chat.avatar === '#' ? <Hash size={20}/> : (chat.avatar.length > 2 ? <img src={chat.avatar} className="w-full h-full object-cover" alt=""/> : chat.avatar)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h3 className={`truncate text-base dark:text-[#e9edef] ${hasUnread ? 'font-bold text-slate-900' : 'font-normal text-slate-800'}`}>{chat.name}</h3>
                                {hasUnread && <div className="w-2.5 h-2.5 bg-[#25d366] rounded-full"></div>}
                            </div>
                            <p className={`text-sm truncate dark:text-[#8696a0] ${hasUnread ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{chat.lastMsg}</p>
                        </div>
                    </div>
                );
            })}
            {searchQuery && globalSearchResults.length > 0 && (
                <div className="mt-2">
                    <div className="px-4 py-2 text-xs font-bold text-[#00a884] uppercase tracking-wider">Directory Results</div>
                    {globalSearchResults.map(student => (
                        <div key={student.id} onClick={() => handleStartGlobalChat(student)} className="px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 dark:hover:bg-[#202c33]">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 dark:bg-blue-900/20 dark:text-blue-300">
                                {student.avatarUrl ? <img src={student.avatarUrl} className="w-full h-full object-cover" alt="" /> : student.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-slate-800 dark:text-[#e9edef] truncate">{student.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-[#8696a0] truncate">{student.handle} • {student.role}</p>
                            </div>
                            <div className="p-2 bg-slate-100 rounded-full dark:bg-slate-700"><Plus size={16} className="text-slate-500" /></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col relative min-h-0 ${!activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute inset-0 z-0 bg-[#efeae2] dark:bg-[#0b141a]">
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '412px' }}></div>
        </div>

        <div className="relative z-10 flex flex-col h-full max-h-full overflow-hidden">
            {isBroadcastMode ? (
                <div className="flex-1 flex flex-col p-4 bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 shrink-0">
                        <button onClick={() => setIsBroadcastMode(false)} className="md:hidden text-slate-500"><ChevronLeft /></button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e9edef]">New Broadcast</h2>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-1 overflow-y-auto dark:bg-[#202c33]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-e9edef">Recipients ({selectedBroadcastUsers.length})</h3>
                            <button onClick={selectAllBroadcast} className="text-xs text-[#00a884] font-bold hover:underline">{selectedBroadcastUsers.length === myDownline.length ? 'Deselect All' : 'Select All'}</button>
                        </div>
                        <div className="space-y-2">
                            {myDownline.map(student => (
                                <label key={student.handle} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer dark:hover:bg-[#111b21]">
                                    <input type="checkbox" checked={selectedBroadcastUsers.includes(student.handle)} onChange={() => toggleBroadcastUser(student.handle)} className="w-5 h-5 text-[#00a884] rounded" />
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold dark:bg-[#374045]">{student.name.charAt(0)}</div>
                                    <span className="font-medium text-slate-700 dark:text-[#e9edef]">{student.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm shrink-0 dark:bg-[#202c33]">
                        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a broadcast message..." className="w-full p-3 border-none focus:ring-0 resize-none h-24 dark:bg-[#202c33] dark:text-[#e9edef]" />
                        <div className="flex justify-end mt-2"><button onClick={handleSend} disabled={selectedBroadcastUsers.length === 0 || !newMessage.trim()} className="bg-[#00a884] text-white px-6 py-2 rounded-full font-bold disabled:opacity-60 flex items-center gap-2">Send Broadcast <PaperAirplaneIcon /></button></div>
                    </div>
                </div>
            ) : activeChatHandle ? (
                <>
                    <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-4 border-b border-slate-200 shadow-sm shrink-0 z-20 dark:bg-[#202c33] dark:border-[#202c33]">
                        <button onClick={() => setActiveChatHandle(null)} className="p-2 -ml-2 text-slate-500 hover:text-[#00a884] transition-colors">
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold overflow-hidden dark:bg-[#6a7175]">
                            {activeChatInfo.avatar.toString().charAt(0) === '#' ? <Hash size={20}/> : (activeChatInfo.avatar.length > 2 ? <img src={activeChatInfo.avatar} className="w-full h-full object-cover" alt=""/> : activeChatInfo.avatar)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-base dark:text-[#e9edef] truncate">{activeChatInfo.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_') ? 'Group Channel' : 'Online'}</p>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full dark:text-[#aebac1] dark:hover:bg-[#374045]"><MoreVertical size={20} /></button>
                            {isMenuOpen && (
                                <div className="absolute right-0 top-10 bg-white shadow-xl rounded-lg py-2 w-40 z-30 border border-slate-100 dark:bg-[#233138] dark:border-[#202c33]">
                                    <button onClick={() => { if(onClearChat) onClearChat(activeChatHandle); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2 dark:hover:bg-[#111b21] dark:text-red-400"><Trash2 size={16} /> Clear Chat</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth min-h-0">
                        {activeMessages.map((msg) => {
                            const isMe = msg.senderHandle === currentUser.handle;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1 group relative`} onMouseEnter={() => setHoveredMessageId(msg.id)} onMouseLeave={() => setHoveredMessageId(null)}>
                                    <div className={`relative rounded-lg shadow-sm max-w-[85%] md:max-w-[65%] text-sm leading-relaxed flex flex-col ${isMe ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none dark:bg-[#005c4b] dark:text-[#e9edef]' : 'bg-white text-[#111b21] rounded-tl-none dark:bg-[#202c33] dark:text-[#e9edef]'}`}>
                                        {(hoveredMessageId === msg.id || messageMenuId === msg.id) && !msg.isSystem && (
                                            <div className="absolute top-0 right-0 z-20">
                                                <button onClick={(e) => toggleMessageMenu(e, msg.id)} className="p-1 bg-gradient-to-l from-black/10 to-transparent rounded-bl-lg text-slate-500"><ChevronDown size={16} /></button>
                                                {messageMenuId === msg.id && (
                                                    <div className={`absolute right-0 ${menuPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white dark:bg-[#233138] shadow-xl rounded-lg py-2 w-40 z-50 border border-slate-100 dark:border-[#202c33]`}>
                                                        <button onClick={() => handleReply(msg)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3"><Reply size={16} /> Reply</button>
                                                        <button onClick={() => { navigator.clipboard.writeText(msg.text); setMessageMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3"><Copy size={16} /> Copy</button>
                                                        <button onClick={() => { setDeleteTarget(msg); setMessageMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3 text-red-600 dark:text-red-400"><Trash2 size={16} /> Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="px-2 pt-1.5 pb-1 pr-2">
                                            {(activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_')) && !isMe && <p className={`text-xs font-bold mb-1 px-1 ${['text-orange-500', 'text-pink-500', 'text-purple-500', 'text-blue-500'][msg.senderHandle.length % 4]}`}>{msg.senderHandle}</p>}
                                            {msg.attachment && (
                                                <div className="mb-1 rounded-lg overflow-hidden">
                                                    {msg.attachment.type === 'IMAGE' && <img src={msg.attachment.url} alt="" className="max-w-full h-auto rounded-lg max-h-[300px] object-cover" />}
                                                    {msg.attachment.type === 'DOCUMENT' && <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600"><FileText size={24} className="text-red-500" /><div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{msg.attachment.name}</p></div><a href={msg.attachment.url} download={msg.attachment.name} className="p-2 text-slate-500 hover:text-emerald-600"><Download size={20} /></a></div>}
                                                    {msg.attachment.type === 'AUDIO' && <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg min-w-[200px]"><Mic size={20} className="text-blue-500" /><audio controls src={msg.attachment.url} className="h-8 w-full" /></div>}
                                                </div>
                                            )}
                                            <div className="relative pr-7 pl-1 pb-1">
                                                <span className={`break-words whitespace-pre-wrap ${msg.isSystem ? 'italic text-slate-500 text-xs' : ''}`}>{msg.text}<span className="inline-block w-[60px] h-[10px] align-bottom opacity-0"></span></span>
                                                <span className="absolute bottom-0 right-0 flex items-center gap-1 text-[11px] text-[#54656f] dark:text-[#aebac1]">
                                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toLowerCase()}</span>
                                                    {isMe && !msg.isSystem && <MessageStatusIcon status={msg.status || 'SENT'} isRead={msg.isRead} />}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-[#f0f2f5] px-2 py-2 flex flex-col border-t border-slate-200 dark:bg-[#202c33] dark:border-[#202c33] shrink-0 relative">
                        {replyToMessage && (
                            <div className="bg-white dark:bg-[#1f2c33] border-l-4 border-emerald-500 rounded-t-lg p-2 mb-1 flex justify-between items-center shadow-sm mx-1">
                                <div className="flex-1 min-w-0"><p className="text-xs font-bold text-emerald-600">Replying to {replyToMessage.senderHandle === currentUser.handle ? 'You' : replyToMessage.senderHandle}</p><p className="text-xs text-slate-500 truncate">{replyToMessage.text}</p></div>
                                <button onClick={() => setReplyToMessage(null)} className="p-1 text-slate-400"><X size={16} /></button>
                            </div>
                        )}
                        {pendingAttachment && (
                            <div className="bg-slate-100 dark:bg-[#1f2c33] border-l-4 border-blue-500 rounded-t-lg p-3 mb-1 flex justify-between items-center shadow-sm mx-1">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {pendingAttachment.type === 'IMAGE' && <img src={pendingAttachment.url} className="w-10 h-10 object-cover rounded" alt=""/>}
                                    <div className="flex-1 min-w-0"><p className="text-xs font-bold truncate text-slate-700 dark:text-white">{pendingAttachment.name || 'Attachment'}</p><p className="text-xs text-slate-500">{pendingAttachment.type}</p></div>
                                </div>
                                <button onClick={() => setPendingAttachment(null)} className="p-1 text-slate-400"><X size={20} /></button>
                            </div>
                        )}
                        {showAttachMenu && (
                            <div ref={attachMenuRef} className="absolute bottom-16 left-2 md:left-4 z-50 animate-fade-in origin-bottom-left">
                                <div className="bg-white dark:bg-[#233138] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 w-[280px] h-[320px] relative">
                                    <div className={`absolute inset-0 p-4 transition-transform duration-300 ${attachmentView === 'MAIN' ? 'translate-x-0' : '-translate-x-full'}`}>
                                        {hasMentorshipAccess && (
                                            <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Mentorship Tools</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <AttachmentOption icon={LayoutTemplate} label="Templates" color="bg-indigo-500" onClick={() => setAttachmentView('TEMPLATES')} />
                                                    <AttachmentOption icon={ClipboardCheck} label="Assignment" color="bg-orange-500" onClick={() => setAttachmentView('ASSIGNMENTS')} />
                                                    <AttachmentOption icon={Megaphone} label="Broadcast" color="bg-red-500" onClick={() => setAttachmentView('ANNOUNCEMENTS')} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-3 pt-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Attachments</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                <AttachmentOption icon={ImageIcon} label="Images" color="bg-pink-500" onClick={() => fileInputImageRef.current?.click()} />
                                                <AttachmentOption icon={FileText} label="Doc" color="bg-purple-600" onClick={() => fileInputDocRef.current?.click()} />
                                                <AttachmentOption icon={Mic} label="Voice" color="bg-blue-500" onClick={() => fileInputAudioRef.current?.click()} />
                                                <AttachmentOption icon={LinkIcon} label="Links" color="bg-teal-500" onClick={() => { setIsLinkModalOpen(true); setShowAttachMenu(false); }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`absolute inset-0 bg-white dark:bg-[#233138] transition-transform duration-300 flex flex-col ${attachmentView === 'TEMPLATES' ? 'translate-x-0' : 'translate-x-full'}`}>
                                        <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21]"><button onClick={() => setAttachmentView('MAIN')} className="p-1"><ArrowLeft size={18} /></button><h3 className="font-bold text-sm">Templates</h3></div>
                                        <div className="flex-1 overflow-y-auto p-2">{myTemplates.length > 0 ? myTemplates.map(t => (<button key={t.id} onClick={() => handleTemplateSelect(t)} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border-b border-slate-50 dark:border-slate-700 last:border-0"><p className="font-bold text-xs">{t.title}</p></button>)) : <div className="p-4 text-center text-slate-400 text-xs">No templates found.</div>}</div>
                                    </div>
                                    <div className={`absolute inset-0 bg-white dark:bg-[#233138] transition-transform duration-300 flex flex-col ${attachmentView === 'ASSIGNMENTS' ? 'translate-x-0' : 'translate-x-full'}`}>
                                        <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21]"><button onClick={() => setAttachmentView('MAIN')} className="p-1"><ArrowLeft size={18} /></button><h3 className="font-bold text-sm">Assignments</h3></div>
                                        <div className="flex-1 overflow-y-auto p-2">{myAssignments.length > 0 ? myAssignments.map(a => (<button key={a.id} onClick={() => handleAssignmentSelect(a)} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border-b border-slate-50 dark:border-slate-700 last:border-0"><p className="font-bold text-xs">{a.title}</p></button>)) : <div className="p-4 text-center text-slate-400 text-xs">No assignments found.</div>}</div>
                                    </div>
                                    <div className={`absolute inset-0 bg-white dark:bg-[#233138] transition-transform duration-300 flex flex-col ${attachmentView === 'ANNOUNCEMENTS' ? 'translate-x-0' : 'translate-x-full'}`}>
                                        <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21]"><button onClick={() => setAttachmentView('MAIN')} className="p-1"><ArrowLeft size={18} /></button><h3 className="font-bold text-sm">Broadcasts</h3></div>
                                        <div className="flex-1 overflow-y-auto p-2">{myBroadcasts.length > 0 ? myBroadcasts.map(b => (<button key={b.id} onClick={() => handleBroadcastSelect(b)} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border-b border-slate-50 dark:border-slate-700 last:border-0"><p className="font-bold text-xs">{b.title}</p></button>)) : <div className="p-4 text-center text-slate-400 text-xs">No broadcasts found.</div>}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-end gap-2">
                            {isRecording ? (
                                <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-2xl flex items-center p-3 animate-pulse relative z-30">
                                    <div className="flex items-center gap-2 text-red-500 font-bold"><div className="w-3 h-3 bg-red-500 rounded-full animate-ping" /><span>{formatTime(recordingDuration)}</span></div>
                                    <div className="flex-1 text-center text-xs text-slate-400">Recording...</div>
                                    <button onClick={cancelRecording} className="text-slate-400 p-2"><Trash2 size={20} /></button>
                                </div>
                            ) : (
                                <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-2xl flex items-end relative z-20">
                                    <div className="pb-2 pl-2">
                                        <button onClick={() => { setShowAttachMenu(!showAttachMenu); setAttachmentView('MAIN'); }} className={`p-2 rounded-full transition-transform ${showAttachMenu ? 'rotate-45 text-slate-700 bg-slate-100' : 'text-slate-500'}`}><Plus size={24} /></button>
                                    </div>
                                    <textarea ref={textareaRef} rows={1} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message" className="w-full py-3 px-4 md:pl-2 border-none focus:ring-0 outline-none bg-transparent resize-none overflow-hidden max-h-[120px] dark:text-[#e9edef] dark:placeholder-[#8696a0]" style={{ minHeight: '24px' }} />
                                    <div className="hidden md:flex absolute right-2 bottom-2"><button onClick={startRecording} className="p-2 text-slate-500"><Mic size={20} /></button></div>
                                </div>
                            )}
                            <button onClick={(!newMessage.trim() && !pendingAttachment) ? startRecording : handleSend} className="p-3 mb-1 bg-[#00a884] text-white rounded-full shadow-sm flex items-center justify-center">
                                {(!newMessage.trim() && !pendingAttachment) ? <Mic size={20} className="md:hidden" /> : <PaperAirplaneIcon />}
                                {(!newMessage.trim() && !pendingAttachment) && <PaperAirplaneIcon className="hidden md:block" />}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-[#f0f2f5] border-b-[6px] border-[#25d366] dark:bg-[#222e35] dark:border-[#00a884]">
                    <div className="w-64 h-64 opacity-60 mb-8 dark:opacity-40"><ChatBubbleLeftRightIcon /></div>
                    <h3 className="text-3xl font-light text-[#41525d] mb-4 dark:text-[#e9edef]">FBO Team Chat</h3>
                    <p className="max-w-md text-sm leading-6">Select a team member or a topic channel to start a conversation.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform translate-x-0.5 -translate-y-0.5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const ChatBubbleLeftRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
);

export default ChatPortal;
