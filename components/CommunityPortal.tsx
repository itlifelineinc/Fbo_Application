import React, { useState } from 'react';
import { Student, CommunityPost, Cohort, UserRole, CommunityComment } from '../types';

interface CommunityPortalProps {
  currentUser: Student;
  posts: CommunityPost[];
  cohorts: Cohort[];
  onAddPost: (post: CommunityPost) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
  onLikePost: (postId: string) => void;
}

const CommunityPortal: React.FC<CommunityPortalProps> = ({ currentUser, posts, cohorts, onAddPost, onAddComment, onLikePost }) => {
  // 'GLOBAL' or cohortId
  const [activeTab, setActiveTab] = useState<string>('GLOBAL');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'QUESTION' | 'WIN' | 'DISCUSSION' | 'ANNOUNCEMENT'>('DISCUSSION');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter logic
  const visiblePosts = posts.filter(post => {
    if (activeTab === 'GLOBAL') return !post.cohortId; // Show global posts
    return post.cohortId === activeTab; // Show specific cohort posts
  }).sort((a,b) => b.timestamp - a.timestamp);

  const myCohort = cohorts.find(c => c.id === currentUser.cohortId);
  const isSponsorOrAdmin = currentUser.role === UserRole.SPONSOR || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        authorHandle: currentUser.handle,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        authorAvatar: currentUser.avatarUrl,
        content: newPostContent,
        type: newPostType,
        tags: newPostTags,
        likes: 0,
        likedBy: [],
        comments: [],
        cohortId: activeTab === 'GLOBAL' ? undefined : activeTab,
        timestamp: Date.now()
    };

    onAddPost(newPost);
    setNewPostContent('');
    setNewPostTags([]);
    setNewPostType('DISCUSSION');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      {/* Mobile: Fixed Drawer. Desktop: Sticky Sidebar */}
      <div className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-0 md:shadow-none md:border-0 md:bg-transparent md:w-64 md:h-[calc(100vh-6rem)] md:sticky md:top-4 dark:bg-slate-900 dark:border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 md:hidden flex justify-between items-center dark:border-slate-800">
             <h2 className="font-bold text-lg text-emerald-900 font-heading flex items-center gap-2 dark:text-emerald-400">
                <GlobeAltIcon /> Community
             </h2>
             <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <XMarkIcon />
             </button>
        </div>

        {/* Desktop Sidebar Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col dark:bg-slate-800 dark:border-slate-700">
            <div className="p-4 border-b border-slate-100 hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                <GlobeAltIcon />
                <span className="font-bold text-slate-700 font-heading dark:text-slate-200">Groups & Hubs</span>
            </div>
            
            <div className="p-2 space-y-1 flex-1 overflow-y-auto">
                <button 
                    onClick={() => { setActiveTab('GLOBAL'); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        activeTab === 'GLOBAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                    }`}
                >
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 dark:bg-blue-900/30 dark:text-blue-400"><HashtagIcon /></div>
                    <span className="truncate">Global Hub</span>
                </button>

                {/* My Cohort Section */}
                <div className="mt-4 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">My Cohort</div>
                {myCohort ? (
                    <button 
                        onClick={() => { setActiveTab(myCohort.id); setIsSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                            activeTab === myCohort.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 dark:bg-emerald-900/30 dark:text-emerald-400"><UserGroupIcon /></div>
                        <div className="min-w-0">
                            <div className="truncate font-semibold">{myCohort.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate dark:text-slate-500">Mentor: {myCohort.mentorHandle}</div>
                        </div>
                    </button>
                ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic dark:text-slate-500">No active cohort.</div>
                )}

                {/* Admin/Sponsor View All Cohorts */}
                {isSponsorOrAdmin && (
                    <>
                        <div className="mt-4 mb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">All Cohorts (Admin)</div>
                        {cohorts.filter(c => c.id !== currentUser.cohortId).map(c => (
                            <button 
                                key={c.id}
                                onClick={() => { setActiveTab(c.id); setIsSidebarOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                                    activeTab === c.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0 dark:bg-slate-700 dark:text-slate-400"><UserGroupIcon /></div>
                                <div className="truncate">{c.name}</div>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 min-w-0">
          {/* Mobile Header Trigger */}
          <div className="md:hidden mb-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
             <div>
                <h2 className="font-bold text-slate-800 font-heading dark:text-slate-100">
                    {activeTab === 'GLOBAL' ? 'Global Hub' : 'My Cohort'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tap menu to switch groups</p>
             </div>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                 <Bars3Icon />
             </button>
          </div>

          {/* Header Card (Desktop mainly, but adaptable) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 relative overflow-hidden dark:bg-slate-800 dark:border-slate-700">
               <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-emerald-900 font-heading mb-1 dark:text-emerald-400">
                        {activeTab === 'GLOBAL' ? 'Global Community Hub' : cohorts.find(c => c.id === activeTab)?.name}
                    </h1>
                    <p className="text-slate-500 text-sm dark:text-slate-400">
                        {activeTab === 'GLOBAL' 
                            ? 'Connect with FBOs worldwide. Share wins, ask questions, and grow.' 
                            : `Private cohort mentored by ${cohorts.find(c => c.id === activeTab)?.mentorHandle}`
                        }
                    </p>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 z-0 dark:bg-emerald-900/20"></div>
          </div>

          <div className="space-y-6">
              
              {/* Create Post Box */}
              {(activeTab !== 'GLOBAL' || isSuperAdmin) && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden border-2 border-white shadow-sm dark:bg-emerald-900 dark:text-emerald-300 dark:border-slate-600">
                              {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                              <textarea 
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder={activeTab === 'GLOBAL' ? "Post an announcement..." : "What's on your mind? Ask a question or share a win..."}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 min-h-[80px] resize-none text-slate-900 placeholder-slate-400 transition-all dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500"
                              />
                              <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                      {/* Post Type Selectors */}
                                      {activeTab !== 'GLOBAL' && (
                                          <>
                                            <button onClick={() => setNewPostType('QUESTION')} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${newPostType === 'QUESTION' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'}`}>❓ Question</button>
                                            <button onClick={() => setNewPostType('WIN')} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${newPostType === 'WIN' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'}`}>🏆 Win</button>
                                            <button onClick={() => setNewPostType('DISCUSSION')} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${newPostType === 'DISCUSSION' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'}`}>💬 Discussion</button>
                                          </>
                                      )}
                                      {isSuperAdmin && activeTab === 'GLOBAL' && (
                                          <span className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-100 font-bold dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">Announcement</span>
                                      )}
                                  </div>
                                  <button 
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg transform active:scale-95 ml-auto"
                                  >
                                      Post
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Posts List */}
              {visiblePosts.length > 0 ? visiblePosts.map(post => (
                  <PostItem key={post.id} post={post} currentUser={currentUser} onAddComment={onAddComment} onLikePost={onLikePost} />
              )) : (
                  <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-700">
                          <ChatBubbleBottomCenterTextIcon />
                      </div>
                      <p className="font-medium">No posts yet in this channel.</p>
                      <p className="text-sm mt-1">Be the first to start the conversation!</p>
                  </div>
              )}
              
              {/* Spacer for mobile bottom nav area if needed */}
              <div className="h-10 md:hidden"></div>
          </div>
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: CommunityPost; currentUser: Student; onAddComment: (id: string, c: CommunityComment) => void; onLikePost: (id: string) => void }> = ({ post, currentUser, onAddComment, onLikePost }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const hasLiked = post.likedBy.includes(currentUser.handle);

    const handleSubmitComment = (e: React.FormEvent) => {
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
        setShowComments(true);
    };

    // Render badges
    const getTypeBadge = () => {
        switch(post.type) {
            case 'ANNOUNCEMENT': return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">ANNOUNCEMENT</span>;
            case 'WIN': return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">WIN 🏆</span>;
            case 'QUESTION': return <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">QUESTION ❓</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-shadow hover:shadow-md dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm dark:bg-slate-700 dark:border-slate-600">
                        {post.authorAvatar ? <img src={post.authorAvatar} className="w-full h-full object-cover"/> : <span className="font-bold text-slate-500 dark:text-slate-300">{post.authorName.charAt(0)}</span>}
                     </div>
                     <div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-800 text-sm dark:text-slate-100">{post.authorName}</h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${post.authorRole === 'STUDENT' ? 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'}`}>{post.authorRole}</span>
                         </div>
                         <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                     </div>
                </div>
                {getTypeBadge()}
            </div>
            
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mb-4 dark:text-slate-200">{post.content}</p>
            
            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-700">
                 <button 
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 transition-all text-sm font-medium ${hasLiked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'}`}
                 >
                    <HeartIcon filled={hasLiked} /> 
                    <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                 </button>
                 <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium dark:text-slate-400 dark:hover:text-blue-400">
                    <ChatBubbleLeftIcon /> 
                    <span>{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                 </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in dark:border-slate-700">
                    <div className="space-y-4 mb-4">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                                    {comment.authorAvatar ? <img src={comment.authorAvatar} className="w-full h-full object-cover"/> : comment.authorName.charAt(0)}
                                </div>
                                <div className="bg-slate-50 rounded-2xl rounded-tl-none p-3 border border-slate-100 flex-1 dark:bg-slate-700/50 dark:border-slate-600">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.authorName}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(comment.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-snug dark:text-slate-300">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <form onSubmit={handleSubmitComment} className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800">
                            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover rounded-full" /> : currentUser.name.charAt(0)}
                         </div>
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-slate-900 placeholder-slate-400 transition-all dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500"
                                placeholder="Write a comment..."
                            />
                            <button 
                                type="submit" 
                                disabled={!commentText.trim()} 
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 p-1.5 hover:bg-emerald-50 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            >
                                <PaperAirplaneIcon />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// Icons
const GlobeAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
);

const HashtagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg>
);

const ChatBubbleBottomCenterTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const ChatBubbleLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);

const Bars3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PaperAirplaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

export default CommunityPortal;