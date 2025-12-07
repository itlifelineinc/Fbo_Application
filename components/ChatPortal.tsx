
import React, { useState, useEffect, useRef } from 'react';
import { Student, Message, UserRole, MessageStatus } from '../types';

interface ChatPortalProps {
  currentUser: Student;
  students: Student[];
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onMarkAsRead?: (senderHandle: string) => void;
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

    // Double Tick (Read or Delivered) - Side by Side, No Overlap
    if (isRead || status === 'READ' || status === 'DELIVERED') {
        return (
            <div className="flex items-center">
                <TickIcon className={colorClass} />
                <TickIcon className={colorClass} />
            </div>
        );
    }

    // Single Tick (Sent)
    return <TickIcon className={colorClass} />;
};

const ChatPortal: React.FC<ChatPortalProps> = ({ currentUser, students, messages, onSendMessage, onMarkAsRead }) => {
  // State
  const [activeChatHandle, setActiveChatHandle] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [selectedBroadcastUsers, setSelectedBroadcastUsers] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper: Get Group ID
  const myGroupId = `GROUP_${currentUser.role === UserRole.SPONSOR ? currentUser.handle : currentUser.sponsorId}`;
  
  // Helper: Identify Downline & Sponsor
  const myDownline = students.filter(s => s.sponsorId === currentUser.handle);
  const mySponsor = students.find(s => s.handle === currentUser.sponsorId);

  // Construct Chat List
  const chatListItems = [
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
    }))
  ];

  // Filter Messages for Active Chat
  const activeMessages = messages.filter(m => {
    if (!activeChatHandle) return false;
    if (activeChatHandle.startsWith('GROUP_')) {
        return m.recipientHandle === activeChatHandle;
    }
    return (
        (m.senderHandle === currentUser.handle && m.recipientHandle === activeChatHandle) ||
        (m.senderHandle === activeChatHandle && m.recipientHandle === currentUser.handle)
    );
  }).sort((a,b) => a.timestamp - b.timestamp);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, activeChatHandle]);

  // Mark as Read when chat is open and messages change
  useEffect(() => {
      if (activeChatHandle && onMarkAsRead) {
          // If we are looking at a chat, mark incoming messages as read
          const hasUnread = activeMessages.some(m => m.senderHandle === activeChatHandle && !m.isRead);
          if (hasUnread) {
              onMarkAsRead(activeChatHandle);
          }
      }
  }, [activeChatHandle, activeMessages, onMarkAsRead]);

  // Handlers
  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (isBroadcastMode) {
        // Send to multiple recipients
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
        // Normal Send
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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in dark:bg-[#111b21] dark:border-slate-800">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col ${activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'} dark:bg-[#111b21] dark:border-slate-800`}>
        <div className="p-4 bg-[#f0f2f5] border-b border-slate-200 dark:bg-[#202c33] dark:border-[#202c33] flex justify-between items-center h-16">
            <h2 className="font-bold text-lg text-slate-700 font-heading dark:text-[#e9edef]">Chats</h2>
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
        
        <div className="flex-1 overflow-y-auto">
            {chatListItems.map(chat => {
                const hasUnread = messages.some(m => m.recipientHandle === currentUser.handle && m.senderHandle === chat.handle && !m.isRead);

                return (
                    <div 
                        key={chat.handle}
                        onClick={() => { setActiveChatHandle(chat.handle); setIsBroadcastMode(false); }}
                        className={`px-4 py-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 dark:hover:bg-[#202c33] ${activeChatHandle === chat.handle ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 dark:bg-[#374045] dark:text-[#e9edef]">
                            {chat.avatar.length > 2 ? <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name}/> : chat.avatar}
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
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col relative ${!activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Chat Background Layer - WhatsApp Beige with Doodle Pattern */}
        <div className="absolute inset-0 z-0 bg-[#efeae2] dark:bg-[#0b141a]">
            {/* Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none" 
                style={{ 
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
                    backgroundSize: '412px' 
                }}
            ></div>
        </div>

        {/* Content Container (Above Background) */}
        <div className="relative z-10 flex flex-col h-full">
            
            {/* Broadcast Mode UI */}
            {isBroadcastMode ? (
                <div className="flex-1 flex flex-col p-4 bg-[#f0f2f5] dark:bg-[#0b141a]">
                    <div className="flex items-center gap-2 mb-6">
                        <button onClick={() => setIsBroadcastMode(false)} className="md:hidden text-slate-500 dark:text-[#aebac1]"><ChevronLeftIcon /></button>
                        <h2 className="text-xl font-bold text-slate-800 font-heading dark:text-[#e9edef]">New Broadcast</h2>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex-1 overflow-y-auto dark:bg-[#202c33] dark:shadow-none">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-[#e9edef]">Recipients ({selectedBroadcastUsers.length})</h3>
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

                    <div className="bg-white p-4 rounded-xl shadow-sm dark:bg-[#202c33]">
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
                    <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-4 border-b border-slate-200 shadow-sm shrink-0 dark:bg-[#202c33] dark:border-[#202c33]">
                        <button onClick={() => setActiveChatHandle(null)} className="md:hidden text-slate-500 hover:text-[#00a884] dark:text-[#aebac1]">
                            <ChevronLeftIcon />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold overflow-hidden dark:bg-[#6a7175] dark:text-[#cfd7da]">
                            {chatListItems.find(c => c.handle === activeChatHandle)?.avatar.toString().charAt(0) === 'h' ? <img src={chatListItems.find(c => c.handle === activeChatHandle)?.avatar} className="w-full h-full object-cover"/> : chatListItems.find(c => c.handle === activeChatHandle)?.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-base dark:text-[#e9edef] truncate">
                                {chatListItems.find(c => c.handle === activeChatHandle)?.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate">{activeChatHandle.startsWith('GROUP_') ? `${myDownline.length + 1} members` : 'Online'}</p>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {activeMessages.map((msg) => {
                            const isMe = msg.senderHandle === currentUser.handle;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                                    <div 
                                        className={`
                                            relative rounded-lg shadow-sm max-w-[85%] md:max-w-[65%] text-sm leading-relaxed
                                            ${isMe 
                                                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none dark:bg-[#005c4b] dark:text-[#e9edef]' 
                                                : 'bg-white text-[#111b21] rounded-tl-none dark:bg-[#202c33] dark:text-[#e9edef]'
                                            }
                                        `}
                                    >
                                        <div className="px-2 pt-1.5 pb-1">
                                            {/* Group Sender Name */}
                                            {activeChatHandle.startsWith('GROUP_') && !isMe && (
                                                <p className={`text-xs font-bold mb-1 ${['text-orange-500', 'text-pink-500', 'text-purple-500', 'text-blue-500'][msg.senderHandle.length % 4]}`}>
                                                    {msg.senderHandle}
                                                </p>
                                            )}
                                            
                                            <div className="relative">
                                                <span className="break-words whitespace-pre-wrap">
                                                    {msg.text}
                                                    {/* Float Spacer: Reserves width at the end of the text line for timestamp. 
                                                        Width set to 74px to accommodate time + wider double tick area. 
                                                        If text ends near the right edge, this forces a wrap. */}
                                                    <span className="inline-block w-[74px] h-[15px] align-bottom select-none opacity-0"></span>
                                                </span>

                                                {/* Absolute Positioned Timestamp & Status */}
                                                <span className={`absolute bottom-[-3px] right-0 flex items-center gap-1 text-[11px] leading-none whitespace-nowrap ${isMe ? 'text-[#54656f] dark:text-[#aebac1]' : 'text-[#54656f] dark:text-[#aebac1]'}`}>
                                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toLowerCase()}</span>
                                                    {isMe && <MessageStatusIcon status={msg.status || 'SENT'} isRead={msg.isRead} />}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-2 dark:bg-[#202c33]">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message"
                            className="flex-1 py-3 px-4 rounded-lg border-none focus:ring-0 text-slate-800 bg-white dark:bg-[#2a3942] dark:text-[#e9edef] dark:placeholder-[#8696a0]"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] disabled:opacity-60 transition-colors shadow-sm"
                        >
                            <PaperAirplaneIcon />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-[#f0f2f5] border-b-[6px] border-[#25d366] dark:bg-[#222e35] dark:border-[#00a884] dark:text-[#8696a0]">
                    <div className="w-64 h-64 opacity-60 mb-8 dark:opacity-40">
                         {/* Abstract illustration placeholder or just icon */}
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