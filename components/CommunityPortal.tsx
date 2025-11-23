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
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-slate-50 rounded-2xl overflow-hidden animate-fade-in relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Responsive) */}
      <div className={`
          absolute inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="font-bold text-lg text-emerald-900 font-heading flex items-center gap-2">
                <GlobeAltIcon /> Community
             </h2>
             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                <XMarkIcon />
             </button>
        </div>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <button 
                onClick={() => { setActiveTab('GLOBAL'); setIsSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    activeTab === 'GLOBAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><HashtagIcon /></div>
                Global Hub
            </button>

            {/* My Cohort Section */}
            <div className="pt-4 pb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">My Learning Group</div>
            {myCohort ? (
                <button 
                    onClick={() => { setActiveTab(myCohort.id); setIsSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                        activeTab === myCohort.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><UserGroupIcon /></div>
                    <div>
                        <div className="truncate w-32">{myCohort.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">Mentor: {myCohort.mentorHandle}</div>
                    </div>
                </button>
            ) : (
                 <div className="px-4 py-2 text-xs text-slate-400 italic">You are not assigned to a cohort yet.</div>
            )}

            {/* Admin/Sponsor View All Cohorts */}
            {isSponsorOrAdmin && (
                <>
                    <div className="pt-4 pb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Cohorts (Admin)</div>
                    {cohorts.filter(c => c.id !== currentUser.cohortId).map(c => (
                         <button 
                            key={c.id}
                            onClick={() => { setActiveTab(c.id); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                                activeTab === c.id ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                             <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center"><UserGroupIcon /></div>
                             <div className="truncate w-32">{c.name}</div>
                        </button>
                    ))}
                </>
            )}
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
          
          {/* Feed */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
              {/* Header */}
              <div className="bg-white p-4 border-b border-slate-200 shadow-sm z-10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 p-1 hover:bg-slate-100 rounded-lg">
                        <Bars3Icon />
                    </button>
                    <div>
                        <h3 className="font-bold text-base md:text-lg text-slate-800 font-heading line-clamp-1">
                            {activeTab === 'GLOBAL' ? 'Global Community Hub' : cohorts.find(c => c.id === activeTab)?.name}
                        </h3>
                        <p className="text-xs text-slate-500 hidden md:block">
                            {activeTab === 'GLOBAL' ? 'Updates for everyone' : `Mentored by ${cohorts.find(c => c.id === activeTab)?.mentorHandle}`}
                        </p>
                    </div>
                  </div>
                  {activeTab === 'GLOBAL' && !isSuperAdmin && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Read Only</span>
                  )}
              </div>

              {/* Scrollable Feed */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                  
                  {/* Create Post Box */}
                  {(activeTab !== 'GLOBAL' || isSuperAdmin) && (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                          <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
                                  {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                  <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder={activeTab === 'GLOBAL' ? "Post an announcement..." : "Ask a question, share a win, or start a discussion..."}
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 min-h-[80px] resize-none"
                                  />
                                  <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                                      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                          {/* Post Type Selectors */}
                                          {activeTab !== 'GLOBAL' && (
                                              <>
                                                <button onClick={() => setNewPostType('QUESTION')} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${newPostType === 'QUESTION' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'border-slate-200 text-slate-500'}`}>Question</button>
                                                <button onClick={() => setNewPostType('WIN')} className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${newPostType === 'WIN' ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-500'}`}>Win</button>
                                              </>
                                          )}
                                          {isSuperAdmin && activeTab === 'GLOBAL' && (
                                              <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">Announcement</span>
                                          )}
                                      </div>
                                      <button 
                                        onClick={handleCreatePost}
                                        disabled={!newPostContent.trim()}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors ml-auto"
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
                      <div className="text-center py-10 text-slate-400">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <ChatBubbleBottomCenterTextIcon />
                          </div>
                          <p>No posts yet in this channel.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Right Sidebar: Info & Guidelines (Hidden on mobile for space) */}
          <div className="hidden xl:block w-72 bg-white border-l border-slate-200 p-6 overflow-y-auto">
              <h4 className="font-bold text-slate-800 mb-4 font-heading">Community Guidelines</h4>
              <ul className="text-sm text-slate-500 space-y-3 list-disc pl-4">
                  <li>Be respectful and supportive to all FBOs.</li>
                  <li>No cross-recruiting or selling products here.</li>
                  <li>Use the <strong>Question</strong> tag for business help.</li>
                  <li>Celebrate every <strong>Win</strong>, big or small!</li>
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h5 className="text-blue-800 font-bold text-sm mb-1">Next Cohort Call</h5>
                  <p className="text-blue-600 text-xs">Friday, 5:00 PM EST</p>
                  <button className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700">Add to Calendar</button>
              </div>
          </div>
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: CommunityPost; currentUser: Student; onAddComment: (id: string, c: CommunityComment) => void; onLikePost: (id: string) => void }> = ({ post, currentUser, onAddComment, onLikePost }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

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
            case 'ANNOUNCEMENT': return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full border border-red-200">ANNOUNCEMENT</span>;
            case 'WIN': return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200">WIN 🏆</span>;
            case 'QUESTION': return <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-200">QUESTION ❓</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {post.authorAvatar ? <img src={post.authorAvatar} className="w-full h-full object-cover"/> : <span className="font-bold text-slate-500">{post.authorName.charAt(0)}</span>}
                     </div>
                     <div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-800 text-sm">{post.authorName}</h4>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${post.authorRole === 'STUDENT' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{post.authorRole}</span>
                         </div>
                         <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                     </div>
                </div>
                {getTypeBadge()}
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
            
            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                 <button 
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors text-xs font-medium"
                 >
                    <HeartIcon /> {post.likes} Likes
                 </button>
                 <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors text-xs font-medium">
                    <ChatBubbleLeftIcon /> {post.comments.length} Comments
                 </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 space-y-4 bg-slate-50 p-3 rounded-lg">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 items-start">
                             <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                {comment.authorAvatar ? <img src={comment.authorAvatar} className="w-full h-full object-cover"/> : comment.authorName.charAt(0)}
                             </div>
                             <div>
                                 <div className="flex items-baseline gap-2 flex-wrap">
                                     <span className="text-xs font-bold text-slate-700">{comment.authorName}</span>
                                     <span className="text-[10px] text-slate-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                 </div>
                                 <p className="text-xs text-slate-600">{comment.content}</p>
                             </div>
                        </div>
                    ))}
                    <form onSubmit={handleSubmitComment} className="flex gap-2 mt-2">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 text-xs border border-slate-200 rounded-full px-3 py-2 focus:outline-none focus:border-emerald-500"
                            placeholder="Write a comment..."
                        />
                        <button type="submit" disabled={!commentText.trim()} className="text-emerald-600 font-bold text-xs disabled:opacity-50">Post</button>
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

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const ChatBubbleLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
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

export default CommunityPortal;