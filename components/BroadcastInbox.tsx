
import React, { useState } from 'react';
import { Broadcast, Student } from '../types';
import { Megaphone, AlertTriangle, User, Calendar, FileText, Video, Image as ImageIcon, CheckCircle, Bookmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BroadcastInboxProps {
  currentUser: Student;
  broadcasts: Broadcast[];
  onMarkRead: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

const BroadcastInbox: React.FC<BroadcastInboxProps> = ({ currentUser, broadcasts, onMarkRead, onToggleBookmark }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'IMPORTANT' | 'BOOKMARKED'>('ALL');
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);

  // Filter Logic:
  // 1. Must be sent to me (in recipients list) OR be 'ALL' audience type (if I am in downline? Assume recipients array is source of truth for now)
  // For simplicity based on Builder logic: recipients array contains handles.
  const myBroadcasts = broadcasts.filter(b => b.recipients.includes(currentUser.handle) || b.audienceType === 'ALL');

  const filteredBroadcasts = myBroadcasts.filter(b => {
      if (activeTab === 'IMPORTANT') return b.isImportant;
      if (activeTab === 'BOOKMARKED') return (currentUser.bookmarkedBroadcasts || []).includes(b.id);
      return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const handleSelect = (broadcast: Broadcast) => {
      setSelectedBroadcast(broadcast);
      if (!(currentUser.readBroadcasts || []).includes(broadcast.id)) {
          onMarkRead(broadcast.id);
      }
  };

  const isRead = (id: string) => (currentUser.readBroadcasts || []).includes(id);
  const isBookmarked = (id: string) => (currentUser.bookmarkedBroadcasts || []).includes(id);

  // --- Detail View Component ---
  if (selectedBroadcast) {
      return (
          <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
              {/* Detail Header */}
              <div className="mb-6 flex flex-col gap-4">
                  <button onClick={() => setSelectedBroadcast(null)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors self-start font-medium text-sm">
                      <ArrowLeft size={18} /> Back to Inbox
                  </button>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                              {selectedBroadcast.isImportant && (
                                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-200 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
                                      <AlertTriangle size={12} /> Important
                                  </span>
                              )}
                              <span className="text-xs text-slate-400 font-mono">{new Date(selectedBroadcast.createdAt).toLocaleString()}</span>
                          </div>
                          <button 
                              onClick={() => onToggleBookmark(selectedBroadcast.id)}
                              className={`p-2 rounded-full transition-colors ${isBookmarked(selectedBroadcast.id) ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500'}`}
                              title="Bookmark"
                          >
                              <Bookmark size={18} fill={isBookmarked(selectedBroadcast.id) ? "currentColor" : "none"} />
                          </button>
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 dark:text-white">{selectedBroadcast.title}</h1>
                      
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-sm dark:bg-emerald-900 dark:text-emerald-300">
                              {selectedBroadcast.authorHandle.charAt(1).toUpperCase()}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">From: {selectedBroadcast.authorHandle}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Team Leader</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Content Body */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 dark:bg-slate-800 dark:border-slate-700">
                  <div 
                      className="prose prose-slate max-w-none dark:prose-invert [&_h1]:text-2xl [&_h2]:text-xl [&_p]:text-slate-600 dark:[&_p]:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: selectedBroadcast.content }}
                  />
              </div>

              {/* Attachments */}
              {selectedBroadcast.attachments.length > 0 && (
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 dark:text-white ml-2">Attachments</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedBroadcast.attachments.map((att, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 dark:bg-slate-800 dark:border-slate-700">
                                  <div className="p-3 bg-slate-100 rounded-lg text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                      {att.type === 'VIDEO' ? <Video size={24}/> : att.type === 'IMAGE' ? <ImageIcon size={24}/> : <FileText size={24}/>}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm truncate text-slate-800 dark:text-white">{att.name || 'Attachment'}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{att.size || 'File'}</p>
                                  </div>
                                  {att.type === 'VIDEO' && att.url.startsWith('http') ? (
                                       <a href={att.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">Watch</a>
                                  ) : (
                                       <a href={att.url} download={att.name} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Download</a>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
              
              <div className="mt-8 text-center">
                  <p className="text-xs text-slate-400 italic">This is a broadcast message. Replies are disabled.</p>
              </div>
          </div>
      );
  }

  // --- Inbox List View ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 font-heading dark:text-white flex items-center gap-3">
                    Broadcast Inbox 
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-sans align-middle">{myBroadcasts.filter(b => !isRead(b.id)).length} New</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Official announcements and updates from your team.</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
                {(['ALL', 'IMPORTANT', 'BOOKMARKED'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="space-y-4">
            {filteredBroadcasts.length > 0 ? filteredBroadcasts.map(broadcast => {
                const read = isRead(broadcast.id);
                return (
                    <div 
                        key={broadcast.id}
                        onClick={() => handleSelect(broadcast)}
                        className={`group cursor-pointer relative bg-white border rounded-2xl p-5 transition-all hover:shadow-md dark:bg-slate-800 ${read ? 'border-slate-200 dark:border-slate-700' : 'border-emerald-200 bg-emerald-50/10 dark:border-emerald-900/50'}`}
                    >
                        {!read && <div className="absolute top-5 right-5 w-3 h-3 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>}
                        
                        <div className="flex items-start gap-4 pr-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${broadcast.isImportant ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                {broadcast.isImportant ? <AlertTriangle size={24} /> : <Megaphone size={24} />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`text-lg font-bold truncate ${read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                                        {broadcast.title}
                                    </h3>
                                    {broadcast.isImportant && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">IMPORTANT</span>}
                                    {isBookmarked(broadcast.id) && <Bookmark size={14} className="text-yellow-500 fill-current" />}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 dark:text-slate-400">
                                    <span className="flex items-center gap-1 font-medium"><User size={12}/> {broadcast.authorHandle}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(broadcast.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div 
                                    className="text-sm text-slate-600 line-clamp-2 dark:text-slate-400"
                                    dangerouslySetInnerHTML={{ __html: broadcast.content.replace(/<[^>]+>/g, '') }} // Strip HTML for preview
                                />
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                    <Megaphone size={40} className="mx-auto text-slate-300 mb-4 dark:text-slate-600" />
                    <p className="font-medium text-slate-500">No broadcasts found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default BroadcastInbox;
