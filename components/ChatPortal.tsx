
import React, { useState, useEffect, useRef } from 'react';
import { Student, Message, UserRole, MessageStatus } from '../types';
import { MoreVertical, Trash2, ChevronDown, Reply, Copy, ArrowRight, X, Search, MessageSquarePlus, Hash, Plus, Paperclip, LayoutTemplate, ClipboardCheck, Megaphone, Image as ImageIcon, FileText, Mic, Link as LinkIcon } from 'lucide-react';

interface ChatPortalProps {
  currentUser: Student;
  students: Student[];
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onMarkAsRead?: (senderHandle: string) => void;
  onClearChat?: (handle: string) => void;
  onDeleteMessage?: (messageId: string, type: 'me' | 'everyone') => void;
}

// --- WhatsApp Style Icons ---

const TickIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 16 15" width="11" height="11" className={className}>
        <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 14.302l-2.592-2.716a.366.366 0 0 0-.51-.028l-.494.44a.365.365 0 0 0-.024.53l3.352 3.512c.137.143.37.146.51.008L15.074 3.826a.365.365 0 0 0-.063-.51z"/>
    </svg>
);

// Helper Component for Checkmarks
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

const ChatPortal: React.FC<ChatPortalProps> = ({ currentUser, students, messages, onSendMessage, onMarkAsRead, onClearChat, onDeleteMessage }) => {
  // State
  const [activeChatHandle, setActiveChatHandle] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [selectedBroadcastUsers, setSelectedBroadcastUsers] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  // Search & Topics State
  const [searchQuery, setSearchQuery] = useState('');
  const [extraChannels, setExtraChannels] = useState<{handle: string, name: string, avatar: string, type: 'TOPIC' | 'USER'}[]>([]);

  // Message Menu State
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<'up' | 'down'>('down');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  // Refs
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Helper: Get Group ID
  const myGroupId = `GROUP_${currentUser.role === UserRole.SPONSOR ? currentUser.handle : currentUser.sponsorId}`;
  
  // Helper: Identify Downline & Sponsor
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const mySponsor = students.find(s => s.handle === currentUser.sponsorId);

  // 1. Construct Base Chat List (Regular Contacts)
  const baseChatList = [
    {
        handle: myGroupId,
        name: "My Team Channel",
        avatar: "👥",
        lastMsg: messages.filter(m => m.recipientHandle === myGroupId).pop()?.text || "No messages yet"
    },
    ...(mySponsor ? [{
        handle: mySponsor.handle,
        name: `${mySponsor.name} (Sponsor)`,
        avatar: mySponsor.avatarUrl || mySponsor.name.charAt(0),
        lastMsg: messages.filter(m => (m.senderHandle === mySponsor.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === mySponsor.handle)).pop()?.text || "Start conversation"
    }] : []),
    ...myDownline.map(student => ({
        handle: student.handle,
        name: student.name,
        avatar: student.avatarUrl || student.name.charAt(0),
        lastMsg: messages.filter(m => (m.senderHandle === student.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === student.handle)).pop()?.text || "Start conversation"
    })),
    ...extraChannels.map(ch => ({
        handle: ch.handle,
        name: ch.name,
        avatar: ch.avatar,
        lastMsg: messages.filter(m => (m.senderHandle === ch.handle && m.recipientHandle === currentUser.handle) || (m.senderHandle === currentUser.handle && m.recipientHandle === ch.handle) || (m.recipientHandle === ch.handle)).pop()?.text || "New topic started"
    }))
  ];

  // 2. Filter Chat List based on Search
  const filteredChatList = baseChatList.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Find Global Users (Directory Search) - Users NOT in the current chat list
  const existingHandles = new Set(baseChatList.map(c => c.handle));
  const globalSearchResults = searchQuery.trim() ? students.filter(s => 
      s.id !== currentUser.id && 
      !existingHandles.has(s.handle) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  // Filter Messages for Active Chat
  const activeMessages = messages.filter(m => {
    if (!activeChatHandle) return false;
    if (activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_')) {
        return m.recipientHandle === activeChatHandle;
    }
    return (
        (m.senderHandle === currentUser.handle && m.recipientHandle === activeChatHandle) ||
        (m.senderHandle === activeChatHandle && m.recipientHandle === currentUser.handle)
    );
  }).sort((a,b) => a.timestamp - b.timestamp);

  // Current Active Chat Info (Lookup from all sources)
  const activeChatInfo = baseChatList.find(c => c.handle === activeChatHandle) || {
      name: students.find(s => s.handle === activeChatHandle)?.name || activeChatHandle || 'Chat',
      avatar: students.find(s => s.handle === activeChatHandle)?.avatarUrl || activeChatHandle?.charAt(0) || '?',
      handle: activeChatHandle
  };

  // Auto-scroll logic
  useEffect(() => {
    if (messageContainerRef.current) {
        setTimeout(() => {
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
        }, 50);
    }
  }, [activeMessages, activeChatHandle]);

  // Mark as Read
  useEffect(() => {
      if (activeChatHandle && onMarkAsRead) {
          const hasUnread = activeMessages.some(m => m.senderHandle === activeChatHandle && !m.isRead);
          if (hasUnread) {
              onMarkAsRead(activeChatHandle);
          }
      }
  }, [activeChatHandle, activeMessages, onMarkAsRead]);

  // Click Outside to close Attach Menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
              setShowAttachMenu(false);
          }
      };
      if (showAttachMenu) {
          document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  // Textarea Auto-Resize
  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'; // Reset
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; // Grow up to 120px
      }
  }, [newMessage]);

  // Handlers
  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (isBroadcastMode) {
        selectedBroadcastUsers.forEach(handle => {
            onSendMessage({
                id: `msg_${Date.now()}_${Math.random()}`,
                senderHandle: currentUser.handle,
                recipientHandle: handle,
                text: `[BROADCAST] ${newMessage}`,
                timestamp: Date.now(),
                isRead: false,
                status: 'SENT',
                isSystem: true
            });
        });
        setIsBroadcastMode(false);
        setSelectedBroadcastUsers([]);
        alert("Broadcast sent successfully!");
    } else if (activeChatHandle) {
        onSendMessage({
            id: `msg_${Date.now()}`,
            senderHandle: currentUser.handle,
            recipientHandle: activeChatHandle,
            text: newMessage,
            timestamp: Date.now(),
            isRead: false,
            status: 'SENT'
        });
    }
    setNewMessage('');
    setReplyToMessage(null);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  const toggleBroadcastUser = (handle: string) => {
    if (selectedBroadcastUsers.includes(handle)) {
        setSelectedBroadcastUsers(prev => prev.filter(h => h !== handle));
    } else {
        setSelectedBroadcastUsers(prev => [...prev, handle]);
    }
  };

  const selectAllBroadcast = () => {
      if (selectedBroadcastUsers.length === myDownline.length) {
          setSelectedBroadcastUsers([]);
      } else {
          setSelectedBroadcastUsers(myDownline.map(s => s.handle));
      }
  };

  const toggleMessageMenu = (e: React.MouseEvent, msgId: string) => {
      e.stopPropagation();
      const trigger = e.currentTarget as HTMLElement;
      const rect = trigger.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      setMenuPosition(rect.top > screenHeight / 2 ? 'up' : 'down');
      setMessageMenuId(prev => prev === msgId ? null : msgId);
  };

  const handleReply = (msg: Message) => {
      setReplyToMessage(msg);
      setMessageMenuId(null);
      if (textareaRef.current) textareaRef.current.focus();
  };

  const handleCreateTopic = () => {
      const name = prompt("Enter a name for this Topic Channel:");
      if (name) {
          const handle = `TOPIC_${name.replace(/\s+/g, '_').toUpperCase()}`;
          setExtraChannels(prev => [...prev, { handle, name, avatar: '#', type: 'TOPIC' }]);
          setActiveChatHandle(handle);
          setSearchQuery('');
      }
  };

  const handleStartGlobalChat = (student: Student) => {
      // Add to adhoc channels so it stays in list
      if (!extraChannels.some(c => c.handle === student.handle) && !baseChatList.some(c => c.handle === student.handle)) {
          setExtraChannels(prev => [...prev, { 
              handle: student.handle, 
              name: student.name, 
              avatar: student.avatarUrl || student.name.charAt(0), 
              type: 'USER' 
          }]);
      }
      setActiveChatHandle(student.handle);
      setSearchQuery('');
  };

  // Attachment Option Renderer
  const AttachmentOption = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
      <button 
        onClick={() => { onClick(); setShowAttachMenu(false); }}
        className="flex flex-col items-center gap-2 group p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
      >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110 ${color}`}>
              <Icon size={24} />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
      </button>
  );

  return (
    <div 
        className="h-full flex flex-col md:flex-row bg-white md:rounded-2xl md:shadow-sm md:border border-slate-100 overflow-hidden animate-fade-in dark:bg-[#111b21] dark:border-slate-800"
        style={{ fontFamily: 'Segoe UI, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Sidebar List */}
      <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col ${activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'} dark:bg-[#111b21] dark:border-slate-800`}>
        
        {/* Modern Sidebar Header with Search */}
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] dark:border-[#202c33] border-b border-slate-200 flex flex-col shrink-0">
            {/* Top Row: Title & Actions */}
            <div className="px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold text-xl text-slate-800 dark:text-[#e9edef]">Chats</h2>
                <div className="flex gap-1">
                    <button 
                        onClick={handleCreateTopic}
                        className="text-slate-500 hover:bg-slate-200 p-2 rounded-full transition-colors dark:text-[#aebac1] dark:hover:bg-[#374045]"
                        title="Create Topic Channel"
                    >
                        <MessageSquarePlus size={22} />
                    </button>
                    {currentUser.role === UserRole.SPONSOR && (
                        <button 
                            onClick={() => { setIsBroadcastMode(true); setActiveChatHandle(null); }}
                            className="text-slate-500 hover:bg-slate-200 p-2 rounded-full transition-colors dark:text-[#aebac1] dark:hover:bg-[#374045]"
                            title="New Broadcast"
                        >
                            <SpeakerWaveIcon />
                        </button>
                    )}
                </div>
            </div>

            {/* Search Row */}
            <div className="px-3 pb-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-500 dark:text-[#aebac1]" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search or start new chat" 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#202c33] rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a884] dark:text-[#e9edef] placeholder-slate-500 dark:placeholder-slate-500"
                    />
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {/* Current Chats List */}
            {filteredChatList.map(chat => {
                const hasUnread = messages.some(m => m.recipientHandle === currentUser.handle && m.senderHandle === chat.handle && !m.isRead);

                return (
                    <div 
                        key={chat.handle}
                        onClick={() => { setActiveChatHandle(chat.handle); setIsBroadcastMode(false); setIsMenuOpen(false); }}
                        className={`px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 dark:hover:bg-[#202c33] ${activeChatHandle === chat.handle ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 dark:bg-[#374045] dark:text-[#e9edef]">
                            {chat.avatar === '#' ? <Hash size={20}/> : (chat.avatar.length > 2 ? <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name}/> : chat.avatar)}
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

            {/* Global Search Results (Directory) */}
            {searchQuery && globalSearchResults.length > 0 && (
                <div className="mt-2">
                    <div className="px-4 py-2 text-xs font-bold text-[#00a884] uppercase tracking-wider">Directory Results</div>
                    {globalSearchResults.map(student => (
                        <div 
                            key={student.id}
                            onClick={() => handleStartGlobalChat(student)}
                            className="px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 dark:hover:bg-[#202c33]"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900">
                                {student.avatarUrl ? <img src={student.avatarUrl} className="w-full h-full object-cover" /> : student.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-slate-800 dark:text-[#e9edef] truncate">{student.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-[#8696a0] truncate">{student.handle} • {student.role}</p>
                            </div>
                            <div className="p-2 bg-slate-100 rounded-full dark:bg-slate-700">
                                <Plus size={16} className="text-slate-500 dark:text-slate-300" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredChatList.length === 0 && globalSearchResults.length === 0 && searchQuery && (
                <div className="p-8 text-center text-slate-500 dark:text-[#8696a0]">
                    No chats or contacts found.
                </div>
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col relative min-h-0 ${!activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Chat Background Layer */}
        <div className="absolute inset-0 z-0 bg-[#efeae2] dark:bg-[#0b141a]">
            <div 
                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none" 
                style={{ 
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
                    backgroundSize: '412px' 
                }}
            ></div>
        </div>

        <div className="relative z-10 flex flex-col h-full max-h-full overflow-hidden">
            
            {/* Broadcast Mode UI */}
            {isBroadcastMode ? (
                <div className="flex-1 flex flex-col p-4 bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 shrink-0">
                        <button onClick={() => setIsBroadcastMode(false)} className="md:hidden text-slate-500 dark:text-[#aebac1]"><ChevronLeftIcon /></button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e9edef]">New Broadcast</h2>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-1 overflow-y-auto min-h-0 dark:bg-[#202c33] dark:shadow-none">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-e9edef">Recipients ({selectedBroadcastUsers.length})</h3>
                            <button onClick={selectAllBroadcast} className="text-xs text-[#00a884] font-bold hover:underline">
                                {selectedBroadcastUsers.length === myDownline.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="space-y-2">
                            {myDownline.map(student => (
                                <label key={student.handle} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:bg-[#111b21] dark:hover:border-[#202c33]">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBroadcastUsers.includes(student.handle)}
                                        onChange={() => toggleBroadcastUser(student.handle)}
                                        className="w-5 h-5 text-[#00a884] rounded focus:ring-[#00a884] border-gray-300" 
                                    />
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold dark:bg-[#374045] dark:text-[#e9edef]">
                                        {student.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-[#e9edef]">{student.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm shrink-0 dark:bg-[#202c33]">
                        <textarea 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a broadcast message..."
                            className="w-full p-3 border-none focus:ring-0 resize-none h-24 text-slate-800 dark:bg-[#202c33] dark:text-[#e9edef] dark:placeholder-[#8696a0]"
                        />
                        <div className="flex justify-end mt-2">
                            <button 
                                onClick={handleSend}
                                disabled={selectedBroadcastUsers.length === 0 || !newMessage.trim()}
                                className="bg-[#00a884] text-white px-6 py-2 rounded-full font-bold hover:bg-[#008f6f] disabled:opacity-60 transition-all flex items-center gap-2 shadow-sm"
                            >
                                Send Broadcast <PaperAirplaneIcon />
                            </button>
                        </div>
                    </div>
                </div>
            ) : activeChatHandle ? (
                <>
                    {/* Active Chat Header */}
                    <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-4 border-b border-slate-200 shadow-sm shrink-0 z-20 dark:bg-[#202c33] dark:border-[#202c33]">
                        <button onClick={() => setActiveChatHandle(null)} className="md:hidden text-slate-500 hover:text-[#00a884] dark:text-[#aebac1]">
                            <ChevronLeftIcon />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold overflow-hidden dark:bg-[#6a7175] dark:text-[#cfd7da]">
                            {activeChatInfo.avatar.toString().charAt(0) === '#' ? <Hash size={20}/> : (activeChatInfo.avatar.length > 2 ? <img src={activeChatInfo.avatar} className="w-full h-full object-cover"/> : activeChatInfo.avatar)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-base dark:text-[#e9edef] truncate">
                                {activeChatInfo.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate">
                                {activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_') ? 'Group Channel' : 'Online'}
                            </p>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors dark:text-[#aebac1] dark:hover:bg-[#374045]">
                                <MoreVertical size={20} />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 top-10 bg-white shadow-xl rounded-lg py-2 w-40 z-30 border border-slate-100 dark:bg-[#233138] dark:border-[#202c33]">
                                    <button 
                                        onClick={() => { if(onClearChat) onClearChat(activeChatHandle); setIsMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2 dark:hover:bg-[#111b21] dark:text-red-400"
                                    >
                                        <Trash2 size={16} /> Clear Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages List */}
                    <div 
                        ref={messageContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth min-h-0"
                    >
                        {activeMessages.map((msg) => {
                            const isMe = msg.senderHandle === currentUser.handle;
                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1 group relative`}
                                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                                    onMouseLeave={() => setHoveredMessageId(null)}
                                >
                                    <div 
                                        className={`
                                            relative rounded-lg shadow-sm max-w-[85%] md:max-w-[65%] text-sm leading-relaxed
                                            ${isMe 
                                                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none dark:bg-[#005c4b] dark:text-[#e9edef]' 
                                                : 'bg-white text-[#111b21] rounded-tl-none dark:bg-[#202c33] dark:text-[#e9edef]'
                                            }
                                        `}
                                    >
                                        {/* Dropdown Chevron */}
                                        {(hoveredMessageId === msg.id || messageMenuId === msg.id) && !msg.isSystem && (
                                            <div className="absolute top-0 right-0 z-20">
                                                <button 
                                                    onClick={(e) => toggleMessageMenu(e, msg.id)}
                                                    className="message-menu-trigger p-1 bg-gradient-to-l from-black/20 to-transparent rounded-bl-lg hover:bg-black/10 transition-colors text-slate-600 dark:text-slate-300"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                                
                                                {/* Actual Menu */}
                                                {messageMenuId === msg.id && (
                                                    <div className={`absolute right-0 ${menuPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white dark:bg-[#233138] shadow-xl rounded-lg py-2 w-40 z-50 border border-slate-100 dark:border-[#202c33]`}>
                                                        <button onClick={() => handleReply(msg)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3">
                                                            <Reply size={16} /> Reply
                                                        </button>
                                                        <button onClick={() => { navigator.clipboard.writeText(msg.text); setMessageMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3">
                                                            <Copy size={16} /> Copy
                                                        </button>
                                                        <button onClick={() => { setNewMessage(msg.text); setMessageMenuId(null); textareaRef.current?.focus(); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3">
                                                            <ArrowRight size={16} /> Forward
                                                        </button>
                                                        <button onClick={() => { setDeleteTarget(msg); setMessageMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#111b21] flex items-center gap-3 text-red-600 dark:text-red-400">
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="px-2 pt-1.5 pb-1 pr-7">
                                            {/* Group Sender Name */}
                                            {(activeChatHandle.startsWith('GROUP_') || activeChatHandle.startsWith('TOPIC_')) && !isMe && (
                                                <p className={`text-xs font-bold mb-1 ${['text-orange-500', 'text-pink-500', 'text-purple-500', 'text-blue-500'][msg.senderHandle.length % 4]}`}>
                                                    {msg.senderHandle}
                                                </p>
                                            )}
                                            
                                            <div className="relative">
                                                <span className={`break-words whitespace-pre-wrap ${msg.isSystem ? 'italic text-slate-500 text-xs flex items-center gap-1' : ''}`}>
                                                    {msg.text}
                                                    <span className="inline-block w-[76px] h-[15px] align-bottom select-none opacity-0"></span>
                                                </span>

                                                {/* Absolute Positioned Timestamp & Status */}
                                                <span className={`absolute bottom-[-1px] right-[-20px] flex items-center gap-1 text-[11px] leading-none whitespace-nowrap ${isMe ? 'text-[#54656f] dark:text-[#aebac1]' : 'text-[#54656f] dark:text-[#aebac1]'}`}>
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

                    {/* Input Bar with Attachment Features */}
                    <div className="bg-[#f0f2f5] px-2 py-2 flex flex-col border-t border-slate-200 shrink-0 z-20 dark:bg-[#202c33] dark:border-[#202c33] relative">
                        {/* Reply Banner */}
                        {replyToMessage && (
                            <div className="bg-white dark:bg-[#1f2c33] border-l-4 border-emerald-500 rounded-t-lg p-2 mb-1 flex justify-between items-center shadow-sm mx-1">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Replying to {replyToMessage.senderHandle === currentUser.handle ? 'You' : replyToMessage.senderHandle}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{replyToMessage.text}</p>
                                </div>
                                <button onClick={() => setReplyToMessage(null)} className="p-1 text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Attachment Menu Popup */}
                        {showAttachMenu && (
                            <div 
                                ref={attachMenuRef}
                                className="absolute bottom-16 left-2 md:left-4 z-50 animate-fade-in origin-bottom-left"
                            >
                                <div className="bg-white dark:bg-[#233138] rounded-2xl shadow-2xl p-4 flex flex-col gap-4 border border-slate-100 dark:border-slate-700 min-w-[280px]">
                                    
                                    {/* Mentorship Section - Sponsor Only */}
                                    {currentUser.role === UserRole.SPONSOR && (
                                        <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Mentorship Tools</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <AttachmentOption 
                                                    icon={LayoutTemplate} label="Templates" color="bg-indigo-500" 
                                                    onClick={() => alert("Template feature coming soon!")} 
                                                />
                                                <AttachmentOption 
                                                    icon={ClipboardCheck} label="Assignment" color="bg-orange-500" 
                                                    onClick={() => alert("Assignment feature coming soon!")} 
                                                />
                                                <AttachmentOption 
                                                    icon={Megaphone} label="Announcement" color="bg-red-500" 
                                                    onClick={() => alert("Broadcast feature coming soon!")} 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Media Attachments */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Attachments</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            <AttachmentOption 
                                                icon={ImageIcon} label="Images" color="bg-pink-500" 
                                                onClick={() => alert("Image upload coming soon!")} 
                                            />
                                            <AttachmentOption 
                                                icon={FileText} label="Document" color="bg-purple-600" 
                                                onClick={() => alert("Document upload coming soon!")} 
                                            />
                                            <AttachmentOption 
                                                icon={Mic} label="Voice" color="bg-blue-500" 
                                                onClick={() => alert("Voice note feature coming soon!")} 
                                            />
                                            <AttachmentOption 
                                                icon={LinkIcon} label="Links" color="bg-teal-500" 
                                                onClick={() => alert("Link insertion coming soon!")} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-end gap-2">
                            {/* Input Container - Wrapping Buttons and Textarea */}
                            <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-2xl border border-white dark:border-[#2a3942] flex items-end relative z-20">
                                
                                {/* Desktop Attachment Trigger (Inside Left) */}
                                <div className="hidden md:flex pb-2 pl-2">
                                    <button 
                                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                                        className={`p-2 rounded-full transition-transform duration-300 ${showAttachMenu ? 'rotate-45 text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-[#aebac1] dark:hover:text-white'}`}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <textarea 
                                    ref={textareaRef}
                                    rows={1}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message"
                                    className="w-full py-3 px-4 md:pl-2 md:pr-4 border-none focus:ring-0 text-slate-800 bg-transparent resize-none overflow-hidden max-h-[120px] dark:text-[#e9edef] dark:placeholder-[#8696a0] leading-relaxed text-[15px]"
                                    style={{ minHeight: '24px' }}
                                />

                                {/* Mobile Attachment Trigger (Inside Right) */}
                                <div className="md:hidden absolute right-2 bottom-2">
                                    <button 
                                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                                        className={`p-2 text-slate-400 transition-colors ${showAttachMenu ? 'text-emerald-500' : ''}`}
                                    >
                                        <Paperclip size={20} className={showAttachMenu ? '' : 'transform -rotate-45'} />
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSend}
                                disabled={!newMessage.trim()}
                                className="p-3 mb-1 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center"
                            >
                                <PaperAirplaneIcon />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-[#f0f2f5] border-b-[6px] border-[#25d366] dark:bg-[#222e35] dark:border-[#00a884] dark:text-[#8696a0]">
                    <div className="w-64 h-64 opacity-60 mb-8 dark:opacity-40">
                         <ChatBubbleLeftRightIcon /> 
                    </div>
                    <h3 className="text-3xl font-light text-[#41525d] mb-4 dark:text-[#e9edef]">WhatsApp Web Clone</h3>
                    <p className="max-w-md text-sm leading-6">Send and receive messages without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone.</p>
                    <div className="mt-8 flex items-center gap-2 text-xs text-[#8696a0]">
                        <LockIcon /> End-to-end encrypted
                    </div>
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

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const SpeakerWaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

const ChatBubbleLeftRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
);

export default ChatPortal;
