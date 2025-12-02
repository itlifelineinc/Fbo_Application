import React, { useState, useEffect, useRef } from 'react';
import { Student, Message, UserRole } from '../types';

interface ChatPortalProps {
  currentUser: Student;
  students: Student[];
  messages: Message[];
  onSendMessage: (message: Message) => void;
}

const ChatPortal: React.FC<ChatPortalProps> = ({ currentUser, students, messages, onSendMessage }) => {
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
            isRead: false
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
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in dark:bg-slate-800 dark:border-slate-700">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 bg-slate-50 border-r border-slate-100 flex flex-col ${activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'} dark:bg-slate-900 dark:border-slate-700`}>
        <div className="p-4 border-b border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
            <h2 className="font-bold text-lg text-emerald-900 font-heading dark:text-emerald-400">Messages</h2>
            {currentUser.role === UserRole.SPONSOR && (
                <button 
                    onClick={() => { setIsBroadcastMode(true); setActiveChatHandle(null); }}
                    className="mt-3 w-full bg-emerald-100 text-emerald-700 text-sm font-bold py-2 rounded-lg hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
                >
                    <SpeakerWaveIcon />
                    New Broadcast
                </button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {chatListItems.map(chat => (
                <div 
                    key={chat.handle}
                    onClick={() => { setActiveChatHandle(chat.handle); setIsBroadcastMode(false); }}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors flex items-center gap-3 dark:border-slate-800 dark:hover:bg-slate-800 ${activeChatHandle === chat.handle ? 'bg-white border-l-4 border-l-emerald-500 dark:bg-slate-800' : ''}`}
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm overflow-hidden dark:bg-emerald-900 dark:text-emerald-300">
                        {chat.avatar.length > 2 ? <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name}/> : chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-slate-800 truncate text-sm dark:text-slate-200">{chat.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 truncate dark:text-slate-400">{chat.lastMsg}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activeChatHandle && !isBroadcastMode ? 'hidden md:flex' : 'flex'} dark:bg-slate-800/50`}>
        
        {/* Broadcast Header/Mode */}
        {isBroadcastMode ? (
            <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setIsBroadcastMode(false)} className="md:hidden text-slate-500 dark:text-slate-400"><ChevronLeftIcon /></button>
                    <h2 className="text-xl font-bold text-emerald-900 font-heading dark:text-emerald-400">Send Broadcast Message</h2>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex-1 overflow-y-auto mb-4 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Select Recipients ({selectedBroadcastUsers.length})</h3>
                        <button onClick={selectAllBroadcast} className="text-xs text-emerald-600 font-bold hover:underline dark:text-emerald-400">
                            {selectedBroadcastUsers.length === myDownline.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {myDownline.map(student => (
                            <label key={student.handle} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:bg-slate-700/50 dark:hover:border-slate-700">
                                <input 
                                    type="checkbox" 
                                    checked={selectedBroadcastUsers.includes(student.handle)}
                                    onChange={() => toggleBroadcastUser(student.handle)}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" 
                                />
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold dark:bg-emerald-900 dark:text-emerald-300">
                                    {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{student.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <textarea 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your broadcast message here..."
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 h-24 resize-none bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-600"
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={handleSend}
                            disabled={selectedBroadcastUsers.length === 0 || !newMessage.trim()}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <PaperAirplaneIcon />
                            Send Broadcast
                        </button>
                    </div>
                </div>
            </div>
        ) : activeChatHandle ? (
            <>
                {/* Active Chat Header */}
                <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <button onClick={() => setActiveChatHandle(null)} className="md:hidden text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">
                        <ChevronLeftIcon />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        {chatListItems.find(c => c.handle === activeChatHandle)?.avatar.toString().charAt(0) === 'h' ? 'img' : chatListItems.find(c => c.handle === activeChatHandle)?.avatar}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base dark:text-slate-100">
                            {chatListItems.find(c => c.handle === activeChatHandle)?.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activeChatHandle.startsWith('GROUP_') ? `${myDownline.length + 1} members` : activeChatHandle}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeMessages.map((msg) => {
                        const isMe = msg.senderHandle === currentUser.handle;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] md:max-w-[60%] ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'} p-3 rounded-2xl shadow-sm`}>
                                    {activeChatHandle.startsWith('GROUP_') && !isMe && (
                                        <p className="text-[10px] font-bold mb-1 opacity-70">{msg.senderHandle}</p>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-600"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md"
                        >
                            <PaperAirplaneIcon />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center dark:text-slate-500">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-700">
                    <ChatBubbleLeftRightIcon />
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2 dark:text-slate-300">Team Communication</h3>
                <p className="max-w-xs">Select a conversation from the left or start a broadcast to message your team.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform -rotate-45 translate-x-0.5 -translate-y-0.5">
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

const ChatBubbleLeftRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
);

export default ChatPortal;