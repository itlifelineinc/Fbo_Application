
import React, { useState, useRef } from 'react';
import { Student, CommunityPost, Cohort, UserRole, CommunityComment, Poll, PostMedia } from '../types';
import { 
  Globe, Users, Hash, Search, Image as ImageIcon, Video, BarChart2, 
  Send, MoreHorizontal, Heart, MessageCircle, Share2, Pin, Trash2, 
  Slash, Flag, X, Plus, CheckCircle, Smile 
} from 'lucide-react';

interface CommunityPortalProps {
  currentUser: Student;
  posts: CommunityPost[];
  cohorts: Cohort[];
  onAddPost: (post: CommunityPost) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
  onLikePost: (postId: string) => void;
  // In a real app, these would be separate props or a context method
  onUpdatePost?: (post: CommunityPost) => void; 
  onDeletePost?: (postId: string) => void;
}

const CommunityPortal: React.FC<CommunityPortalProps> = ({ 
  currentUser, 
  posts, 
  cohorts, 
  onAddPost, 
  onAddComment, 
  onLikePost,
  onUpdatePost,
  onDeletePost
}) => {
  // 'GLOBAL' or cohortId
  const [activeTab, setActiveTab] = useState<string>('GLOBAL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sorting: Pinned first, then Newest
  const visiblePosts = posts.filter(post => {
    if (activeTab === 'GLOBAL') return !post.cohortId; // Show global posts
    return post.cohortId === activeTab; // Show specific cohort posts
  }).sort((a,b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });

  const myCohort = cohorts.find(c => c.id === currentUser.cohortId);
  const isModerator = currentUser.role === UserRole.SPONSOR || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in relative min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-0 md:shadow-none md:border-0 md:bg-transparent md:w-64 md:h-[calc(100vh-6rem)] md:sticky md:top-4 dark:bg-slate-900 dark:border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 md:hidden flex justify-between items-center dark:border-slate-800">
             <h2 className="font-bold text-lg text-emerald-900 font-heading flex items-center gap-2 dark:text-emerald-400">
                Community
             </h2>
             <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <X />
             </button>
        </div>

        {/* Sidebar Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col dark:bg-slate-800 dark:border-slate-700">
            <div className="p-4 border-b border-slate-100 hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                <Globe size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-700 font-heading dark:text-slate-200">Feeds</span>
            </div>
            
            <div className="p-2 space-y-1 flex-1 overflow-y-auto">
                <button 
                    onClick={() => { setActiveTab('GLOBAL'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        activeTab === 'GLOBAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                    }`}
                >
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 dark:bg-blue-900/30 dark:text-blue-400"><Hash size={16} /></div>
                    <span className="truncate font-bold">Global Hub</span>
                </button>

                <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500 flex items-center gap-2">
                    <Users size={12} /> Your Teams
                </div>
                
                {myCohort ? (
                    <button 
                        onClick={() => { setActiveTab(myCohort.id); setIsSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                            activeTab === myCohort.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 dark:bg-emerald-900/30 dark:text-emerald-400"><Users size={16} /></div>
                        <div className="min-w-0">
                            <div className="truncate font-bold">{myCohort.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate dark:text-slate-500">Mentor: {myCohort.mentorHandle}</div>
                        </div>
                    </button>
                ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic dark:text-slate-500">No active cohort.</div>
                )}

                {/* Admin View All Cohorts */}
                {isModerator && (
                    <>
                        <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">All Cohorts (Admin)</div>
                        {cohorts.filter(c => c.id !== currentUser.cohortId).map(c => (
                            <button 
                                key={c.id}
                                onClick={() => { setActiveTab(c.id); setIsSidebarOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                                    activeTab === c.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className="w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0 dark:bg-slate-700 dark:text-slate-400"><Users size={12} /></div>
                                <div className="truncate text-xs">{c.name}</div>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 min-w-0 max-w-3xl">
          {/* Mobile Header */}
          <div className="md:hidden mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
             <div>
                <h2 className="font-bold text-slate-800 font-heading dark:text-slate-100">
                    {activeTab === 'GLOBAL' ? 'Global Hub' : 'My Team'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tap to switch</p>
             </div>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                 <Users size={20} />
             </button>
          </div>

          <div className="space-y-6">
              
              {/* Create Post Widget */}
              <CreatePostWidget 
                currentUser={currentUser} 
                onPost={(post) => onAddPost({ ...post, cohortId: activeTab === 'GLOBAL' ? undefined : activeTab })}
                activeFeedName={activeTab === 'GLOBAL' ? 'Global Hub' : 'Team Feed'}
              />

              {/* Feed */}
              <div className="space-y-6">
                {visiblePosts.length > 0 ? visiblePosts.map(post => (
                    <PostItem 
                        key={post.id} 
                        post={post} 
                        currentUser={currentUser} 
                        onAddComment={onAddComment} 
                        onLikePost={onLikePost}
                        isModerator={isModerator}
                        onUpdatePost={onUpdatePost}
                        onDeletePost={onDeletePost}
                    />
                )) : (
                    <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-700">
                            <MessageCircle size={32} />
                        </div>
                        <p className="font-medium">No posts yet in this channel.</p>
                        <p className="text-sm mt-1">Share a win or ask a question to start!</p>
                    </div>
                )}
              </div>
              
              <div className="h-20"></div>
          </div>
      </div>

      {/* Right Column (Desktop Only) - Trending / Tips */}
      <div className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-6 space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 mb-4 dark:text-white flex items-center gap-2">
                      <BarChart2 size={18} className="text-emerald-500" /> Community Stats
                  </h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Active Members</span>
                          <span className="font-bold text-slate-900 dark:text-white">128</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Total Posts</span>
                          <span className="font-bold text-slate-900 dark:text-white">{posts.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Wins Celebrated</span>
                          <span className="font-bold text-slate-900 dark:text-white">{posts.filter(p => p.type === 'WIN').length}</span>
                      </div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl shadow-lg text-white">
                  <h3 className="font-bold mb-2">💡 Tip of the Day</h3>
                  <p className="text-sm text-indigo-200 leading-relaxed">
                      "Consistency beats intensity. Post one update or comment every day to build momentum."
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CreatePostWidget: React.FC<{ 
    currentUser: Student; 
    onPost: (post: Omit<CommunityPost, 'cohortId'>) => void;
    activeFeedName: string;
}> = ({ currentUser, onPost, activeFeedName }) => {
    const [content, setContent] = useState('');
    const [activeMode, setActiveMode] = useState<'STATUS' | 'MEDIA' | 'POLL'>('STATUS');
    const [postType, setPostType] = useState<CommunityPost['type']>('DISCUSSION');
    const [mediaFiles, setMediaFiles] = useState<PostMedia[]>([]);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if(ev.target?.result) {
                    setMediaFiles(prev => [...prev, {
                        type: file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
                        url: ev.target!.result as string
                    }]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!content.trim() && mediaFiles.length === 0 && activeMode !== 'POLL') return;
        if (activeMode === 'POLL' && (!content.trim() || pollOptions.some(o => !o.trim()))) return;

        const newPost: any = { // Using any to bypass partial type creation complexity
            id: `post_${Date.now()}`,
            authorHandle: currentUser.handle,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            authorAvatar: currentUser.avatarUrl,
            content,
            type: postType,
            tags: [],
            likes: 0,
            likedBy: [],
            comments: [],
            timestamp: Date.now(),
            media: mediaFiles,
        };

        if (activeMode === 'POLL') {
            newPost.poll = {
                question: content, // Content acts as question
                options: pollOptions.map((text, i) => ({ id: `opt_${i}`, text, votes: [] })),
                isOpen: true
            };
            newPost.type = 'QUESTION'; // Force type
        }

        onPost(newPost);
        
        // Reset
        setContent('');
        setMediaFiles([]);
        setPollOptions(['', '']);
        setActiveMode('STATUS');
        setPostType('DISCUSSION');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
            {/* Header Tabs */}
            <div className="flex gap-4 mb-4 border-b border-slate-100 pb-2 dark:border-slate-700">
                <button 
                    onClick={() => setActiveMode('STATUS')}
                    className={`pb-2 text-sm font-bold transition-colors ${activeMode === 'STATUS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
                >
                    Write Post
                </button>
                <button 
                    onClick={() => setActiveMode('MEDIA')}
                    className={`pb-2 text-sm font-bold transition-colors ${activeMode === 'MEDIA' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
                >
                    Photo/Video
                </button>
                <button 
                    onClick={() => setActiveMode('POLL')}
                    className={`pb-2 text-sm font-bold transition-colors ${activeMode === 'POLL' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
                >
                    Poll
                </button>
            </div>

            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 border-white shadow-sm dark:bg-emerald-900 dark:text-emerald-300 dark:border-slate-600 overflow-hidden">
                    {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover"/> : currentUser.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={activeMode === 'POLL' ? "Ask a question..." : `Share something with ${activeFeedName}...`}
                        className="w-full bg-transparent border-none p-0 text-base focus:ring-0 resize-none h-20 placeholder-slate-400 text-slate-800 dark:text-white dark:placeholder-slate-600"
                    />

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {mediaFiles.map((media, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                    {media.type === 'VIDEO' ? <div className="bg-black w-full h-full flex items-center justify-center"><Video className="text-white" size={20}/></div> : <img src={media.url} className="w-full h-full object-cover"/>}
                                    <button onClick={() => setMediaFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl"><X size={12}/></button>
                                </div>
                            ))}
                            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"><Plus size={20}/></button>
                        </div>
                    )}

                    {/* Poll Options */}
                    {activeMode === 'POLL' && (
                        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl dark:bg-slate-900/50">
                            {pollOptions.map((opt, i) => (
                                <input 
                                    key={i}
                                    value={opt}
                                    onChange={(e) => {
                                        const newOpts = [...pollOptions];
                                        newOpts[i] = e.target.value;
                                        setPollOptions(newOpts);
                                    }}
                                    placeholder={`Option ${i + 1}`}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            ))}
                            <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-xs font-bold text-emerald-600 hover:underline">+ Add Option</button>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
                            {activeMode === 'MEDIA' && (
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors dark:bg-emerald-900/20 dark:text-emerald-400"><ImageIcon size={20} /></button>
                            )}
                            {activeMode !== 'POLL' && ['DISCUSSION', 'WIN', 'CHALLENGE', 'QUESTION', 'MOTIVATION'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setPostType(type as any)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                                        postType === type 
                                        ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
                                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={!content && mediaFiles.length === 0 && activeMode !== 'POLL'}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Post <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
        </div>
    );
};

const PostItem: React.FC<{ 
    post: CommunityPost; 
    currentUser: Student; 
    onAddComment: (id: string, c: CommunityComment) => void; 
    onLikePost: (id: string) => void;
    isModerator: boolean;
    onUpdatePost?: (post: CommunityPost) => void;
    onDeletePost?: (id: string) => void;
}> = ({ post, currentUser, onAddComment, onLikePost, isModerator, onUpdatePost, onDeletePost }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    const hasLiked = post.likedBy.includes(currentUser.handle);

    const handleVote = (optionId: string) => {
        if (!post.poll || !onUpdatePost) return;
        // Logic to toggle vote
        const newOptions = post.poll.options.map(opt => {
            const hasVoted = opt.votes.includes(currentUser.handle);
            if (opt.id === optionId) {
                return { ...opt, votes: hasVoted ? opt.votes : [...opt.votes, currentUser.handle] };
            } else {
                // Single choice poll: Remove vote from other options
                return { ...opt, votes: opt.votes.filter(h => h !== currentUser.handle) };
            }
        });
        onUpdatePost({ ...post, poll: { ...post.poll, options: newOptions } });
    };

    const handlePin = () => {
        if (onUpdatePost) onUpdatePost({ ...post, isPinned: !post.isPinned });
        setShowMenu(false);
    };

    const handleDelete = () => {
        if (onDeletePost && window.confirm("Are you sure?")) onDeletePost(post.id);
    };

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'WIN': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
            case 'CHALLENGE': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'QUESTION': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
            case 'MOTIVATION': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
            default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
        }
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 dark:bg-slate-800 dark:border-slate-700 transition-all hover:shadow-md ${post.isPinned ? 'ring-2 ring-emerald-500/20 bg-emerald-50/10' : ''}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                        {post.authorAvatar ? <img src={post.authorAvatar} className="w-full h-full object-cover"/> : <span className="font-bold text-slate-500 dark:text-slate-300">{post.authorName.charAt(0)}</span>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm dark:text-white">{post.authorName}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase ${getTypeColor(post.type)}`}>
                                {post.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                            {post.isPinned && <span className="flex items-center gap-1 text-emerald-600 font-bold"><Pin size={10} fill="currentColor"/> Pinned</span>}
                        </div>
                    </div>
                </div>
                
                <div className="relative">
                    {(isModerator || post.authorHandle === currentUser.handle) && (
                        <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700">
                            <MoreHorizontal size={20} />
                        </button>
                    )}
                    {showMenu && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                            {isModerator && (
                                <button onClick={handlePin} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 dark:hover:bg-slate-700 dark:text-slate-300">
                                    <Pin size={14} /> {post.isPinned ? 'Unpin' : 'Pin Post'}
                                </button>
                            )}
                            <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 dark:hover:bg-red-900/20">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap dark:text-slate-200">{post.content}</p>
                
                {/* Media Grid */}
                {post.media && post.media.length > 0 && (
                    <div className={`grid gap-2 mt-3 rounded-xl overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.media.map((m, i) => (
                            <div key={i} className="aspect-video bg-black relative">
                                {m.type === 'VIDEO' ? (
                                    <video src={m.url} controls className="w-full h-full object-contain" />
                                ) : (
                                    <img src={m.url} className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Poll */}
                {post.poll && (
                    <div className="mt-3 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-700/30 dark:border-slate-700">
                        {post.poll.options.map(opt => {
                            const totalVotes = post.poll!.options.reduce((acc, o) => acc + o.votes.length, 0);
                            const percent = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
                            const hasVoted = opt.votes.includes(currentUser.handle);

                            return (
                                <button 
                                    key={opt.id}
                                    onClick={() => handleVote(opt.id)}
                                    className={`relative w-full text-left p-3 rounded-lg border transition-all overflow-hidden ${hasVoted ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600'}`}
                                >
                                    <div className="absolute top-0 left-0 bottom-0 bg-emerald-100 dark:bg-emerald-900/40 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                    <div className="relative flex justify-between items-center z-10">
                                        <span className="font-medium text-sm text-slate-800 dark:text-white">{opt.text}</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{percent}%</span>
                                    </div>
                                </button>
                            );
                        })}
                        <p className="text-xs text-slate-400 text-right mt-1">{post.poll.options.reduce((acc, o) => acc + o.votes.length, 0)} votes</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${hasLiked ? 'text-pink-500' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
                >
                    <Heart size={18} fill={hasLiked ? "currentColor" : "none"} /> {post.likes}
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors dark:text-slate-400"
                >
                    <MessageCircle size={18} /> {post.comments.length}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors ml-auto dark:text-slate-400">
                    <Share2 size={18} /> <span className="hidden sm:inline">Share</span>
                </button>
            </div>

            {/* Comments */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
                    <div className="space-y-4 mb-4">
                        {post.comments.map(c => (
                            <div key={c.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-xs font-bold dark:bg-slate-700 dark:text-slate-300">
                                    {c.authorAvatar ? <img src={c.authorAvatar} className="w-full h-full object-cover"/> : c.authorName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none dark:bg-slate-700/50">
                                        <p className="text-xs font-bold text-slate-800 mb-0.5 dark:text-white">{c.authorName}</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{c.content}</p>
                                    </div>
                                    <div className="flex gap-3 mt-1 ml-1">
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Like</button>
                                        <span className="text-[10px] text-slate-300">•</span>
                                        <span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {!post.commentsDisabled ? (
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if(!commentText.trim()) return;
                                onAddComment(post.id, {
                                    id: `c_${Date.now()}`,
                                    authorHandle: currentUser.handle,
                                    authorName: currentUser.name,
                                    authorAvatar: currentUser.avatarUrl,
                                    content: commentText,
                                    timestamp: Date.now()
                                });
                                setCommentText('');
                            }}
                            className="flex gap-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 dark:bg-emerald-900 dark:text-emerald-300">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..." 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-emerald-500 pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                                <button type="submit" disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 disabled:opacity-50 hover:scale-110 transition-transform">
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-center text-xs text-slate-400 italic">Comments are disabled for this post.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommunityPortal;
