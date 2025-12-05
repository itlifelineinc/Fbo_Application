
import React, { useState } from 'react';
import { Student, CommunityPost, Cohort, UserRole, CommunityComment } from '../types';
import { 
    Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, Send, 
    Globe, Users, Hash, TrendingUp, Shield, Info, Filter, X
} from 'lucide-react';

interface CommunityPortalProps {
  currentUser: Student;
  posts: CommunityPost[];
  cohorts: Cohort[];
  onAddPost: (post: CommunityPost) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
  onLikePost: (postId: string) => void;
}

const CommunityPortal: React.FC<CommunityPortalProps> = ({ currentUser, posts, cohorts, onAddPost, onAddComment, onLikePost }) => {
  const [activeTab, setActiveTab] = useState<string>('GLOBAL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'QUESTION' | 'WIN'>('ALL');
  
  // Post Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'QUESTION' | 'WIN' | 'DISCUSSION' | 'ANNOUNCEMENT'>('DISCUSSION');
  
  // Filter logic
  const visiblePosts = posts.filter(post => {
    const matchesTab = activeTab === 'GLOBAL' ? !post.cohortId : post.cohortId === activeTab;
    const matchesFilter = activeFilter === 'ALL' || post.type === activeFilter;
    return matchesTab && matchesFilter;
  }).sort((a,b) => b.timestamp - a.timestamp);

  const myCohort = cohorts.find(c => c.id === currentUser.cohortId);
  const activeCohortData = cohorts.find(c => c.id === activeTab);
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
        tags: [], // Could add tag input later
        likes: 0,
        likedBy: [],
        comments: [],
        cohortId: activeTab === 'GLOBAL' ? undefined : activeTab,
        timestamp: Date.now()
    };

    onAddPost(newPost);
    setNewPostContent('');
    setNewPostType('DISCUSSION');
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto animate-fade-in relative items-start">
      
      {/* LEFT COLUMN: Navigation & Filters */}
      <div className="lg:w-64 flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-4">
          
          {/* Community Selector Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
                  <h3 className="font-bold text-slate-700 font-heading text-sm dark:text-slate-200">Communities</h3>
              </div>
              <div className="p-2 space-y-1">
                  <NavButton 
                      active={activeTab === 'GLOBAL'} 
                      onClick={() => setActiveTab('GLOBAL')}
                      icon={<Globe size={18} />}
                      label="Global Hub"
                      count={posts.filter(p => !p.cohortId).length}
                  />
                  {myCohort && (
                      <NavButton 
                          active={activeTab === myCohort.id} 
                          onClick={() => setActiveTab(myCohort.id)}
                          icon={<Users size={18} />}
                          label={myCohort.name}
                          subLabel="My Cohort"
                          count={posts.filter(p => p.cohortId === myCohort.id).length}
                      />
                  )}
                  {/* Admin View All */}
                  {(currentUser.role === UserRole.ADMIN || isSuperAdmin) && (
                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700">
                          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admin Access</p>
                          {cohorts.filter(c => c.id !== currentUser.cohortId).map(c => (
                              <NavButton 
                                  key={c.id}
                                  active={activeTab === c.id} 
                                  onClick={() => setActiveTab(c.id)}
                                  icon={<Users size={18} />}
                                  label={c.name}
                              />
                          ))}
                      </div>
                  )}
              </div>
          </div>

          {/* Feed Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700 hidden lg:block">
              <h3 className="font-bold text-slate-700 font-heading text-sm mb-3 dark:text-slate-200 flex items-center gap-2">
                  <Filter size={14} /> Feed Filters
              </h3>
              <div className="space-y-1">
                  <FilterButton active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} label="All Posts" icon={<Hash size={16} />} />
                  <FilterButton active={activeFilter === 'QUESTION'} onClick={() => setActiveFilter('QUESTION')} label="Questions" icon={<span className="text-lg leading-none">?</span>} />
                  <FilterButton active={activeFilter === 'WIN'} onClick={() => setActiveFilter('WIN')} label="Wins & Success" icon={<span className="text-lg leading-none">🏆</span>} />
              </div>
          </div>
      </div>

      {/* CENTER COLUMN: Feed */}
      <div className="flex-1 min-w-0 space-y-6">
          
          {/* Header (Mobile Only) */}
          <div className="lg:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                  {activeTab === 'GLOBAL' ? 'Global Community' : activeCohortData?.name || 'Cohort Feed'}
              </h1>
          </div>

          {/* Create Post Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700 transition-all">
              <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100 dark:bg-slate-700 dark:border-slate-600">
                      {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">{currentUser.name[0]}</div>}
                  </div>
                  <div className="flex-1">
                      {!isCreating ? (
                          <button 
                              onClick={() => setIsCreating(true)}
                              className="w-full text-left bg-slate-100 text-slate-500 rounded-full px-5 py-2.5 text-sm hover:bg-slate-200 transition-colors dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"
                          >
                              What's on your mind, {currentUser.name.split(' ')[0]}?
                          </button>
                      ) : (
                          <div className="animate-fade-in">
                              <textarea 
                                  value={newPostContent}
                                  onChange={(e) => setNewPostContent(e.target.value)}
                                  placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none min-h-[100px] dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                  autoFocus
                              />
                              <div className="flex items-center justify-between mt-3">
                                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                      <TypePill type="DISCUSSION" selected={newPostType} onClick={setNewPostType} />
                                      <TypePill type="QUESTION" selected={newPostType} onClick={setNewPostType} />
                                      <TypePill type="WIN" selected={newPostType} onClick={setNewPostType} />
                                      {isSuperAdmin && activeTab === 'GLOBAL' && <TypePill type="ANNOUNCEMENT" selected={newPostType} onClick={setNewPostType} />}
                                  </div>
                                  <div className="flex gap-2">
                                      <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-700">Cancel</button>
                                      <button 
                                          onClick={handleCreatePost}
                                          disabled={!newPostContent.trim()}
                                          className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                                      >
                                          <Send size={16} /> Post
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              {!isCreating && (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 px-2 dark:border-slate-700">
                      <QuickAction icon={<ImageIcon size={18} className="text-green-500" />} label="Photo" onClick={() => setIsCreating(true)} />
                      <QuickAction icon={<span className="text-lg">🏆</span>} label="Share Win" onClick={() => { setIsCreating(true); setNewPostType('WIN'); }} />
                      <QuickAction icon={<span className="text-lg">❓</span>} label="Ask Question" onClick={() => { setIsCreating(true); setNewPostType('QUESTION'); }} />
                  </div>
              )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
              {visiblePosts.length > 0 ? (
                  visiblePosts.map(post => (
                      <PostCard 
                          key={post.id} 
                          post={post} 
                          currentUser={currentUser} 
                          onLike={() => onLikePost(post.id)}
                          onComment={(txt) => onAddComment(post.id, {
                              id: `c_${Date.now()}`,
                              authorHandle: currentUser.handle,
                              authorName: currentUser.name,
                              authorAvatar: currentUser.avatarUrl,
                              content: txt,
                              timestamp: Date.now()
                          })}
                      />
                  ))
              ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl dark:bg-slate-700">
                          📭
                      </div>
                      <h3 className="text-slate-900 font-bold dark:text-white">No posts found</h3>
                      <p className="text-slate-500 text-sm dark:text-slate-400">Be the first to share something!</p>
                  </div>
              )}
          </div>
      </div>

      {/* RIGHT COLUMN: Widgets */}
      <div className="hidden xl:flex w-80 flex-col gap-6 sticky top-4">
          
          {/* Info Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-xl p-1 shadow-md dark:bg-slate-800">
                      <div className="w-full h-full bg-emerald-100 rounded-lg flex items-center justify-center text-2xl dark:bg-emerald-900">
                          {activeTab === 'GLOBAL' ? '🌍' : '🎓'}
                      </div>
                  </div>
              </div>
              <div className="pt-8 px-6 pb-6">
                  <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                      {activeTab === 'GLOBAL' ? 'Global Hub' : activeCohortData?.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 mb-4 dark:text-slate-400">
                      {activeTab === 'GLOBAL' 
                          ? 'Connect with FBOs worldwide. Share your journey and learn from others.' 
                          : activeCohortData?.description}
                  </p>
                  
                  <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <Info size={16} className="text-slate-400" />
                          <span>Public Group • {posts.length} Posts</span>
                      </div>
                      {activeCohortData && (
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                              <Shield size={16} className="text-slate-400" />
                              <span>Mentor: <span className="text-emerald-600 font-medium dark:text-emerald-400">{activeCohortData.mentorHandle}</span></span>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Trending Tags (Static Mockup) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
              <h3 className="font-bold text-slate-700 font-heading text-sm mb-4 flex items-center gap-2 dark:text-slate-200">
                  <TrendingUp size={16} className="text-emerald-500" /> Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                  {['#AloeVera', '#First2CC', '#SuccessStory', '#MarketingTips', '#EagleManager'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                          {tag}
                      </span>
                  ))}
              </div>
          </div>

          {/* Guidelines */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
              <h4 className="font-bold text-slate-700 mb-2 dark:text-slate-300">Community Rules</h4>
              <ul className="list-disc pl-4 space-y-1">
                  <li>Be respectful and supportive.</li>
                  <li>No spam or unauthorized selling.</li>
                  <li>Protect customer privacy.</li>
              </ul>
          </div>

      </div>
    </div>
  );
};

// --- Sub-Components ---

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; subLabel?: string; count?: number }> = ({ active, onClick, icon, label, subLabel, count }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${
            active 
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium' 
            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
        }`}
    >
        <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-800' : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-400'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <div className="truncate text-sm">{label}</div>
            {subLabel && <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{subLabel}</div>}
        </div>
        {count !== undefined && <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-400 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">{count}</span>}
    </button>
);

const FilterButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${
            active ? 'bg-slate-100 text-slate-900 font-bold dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
        }`}
    >
        <div className="w-5 text-center">{icon}</div>
        {label}
    </button>
);

const TypePill: React.FC<{ type: string; selected: string; onClick: (t: any) => void }> = ({ type, selected, onClick }) => {
    const isSelected = type === selected;
    let colorClass = "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
    
    if (isSelected) {
        if (type === 'WIN') colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800";
        else if (type === 'QUESTION') colorClass = "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800";
        else if (type === 'ANNOUNCEMENT') colorClass = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800";
        else colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800";
    }

    return (
        <button 
            onClick={() => onClick(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${colorClass}`}
        >
            {type === 'WIN' ? '🏆 Win' : type === 'QUESTION' ? '❓ Question' : type === 'ANNOUNCEMENT' ? '📢 Announcement' : '💬 Discussion'}
        </button>
    );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 dark:hover:bg-slate-700">
        {icon} <span>{label}</span>
    </button>
);

const PostCard: React.FC<{ post: CommunityPost; currentUser: Student; onLike: () => void; onComment: (t: string) => void }> = ({ post, currentUser, onLike, onComment }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const hasLiked = post.likedBy.includes(currentUser.handle);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(commentText);
            setCommentText('');
            setShowComments(true);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            {/* Header */}
            <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center dark:bg-slate-700 dark:border-slate-600">
                        {post.authorAvatar ? <img src={post.authorAvatar} className="w-full h-full object-cover" /> : <span className="font-bold text-slate-500">{post.authorName[0]}</span>}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight dark:text-white hover:underline cursor-pointer">{post.authorName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 dark:text-slate-400">
                            {post.authorRole !== 'STUDENT' && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold dark:bg-slate-700">{post.authorRole}</span>}
                            <span>• {new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                {/* Type Badge */}
                {post.type !== 'DISCUSSION' && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        post.type === 'WIN' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800' :
                        post.type === 'QUESTION' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800'
                    }`}>
                        {post.type === 'WIN' ? 'WIN 🏆' : post.type === 'QUESTION' ? 'QUESTION ❓' : 'ANNOUNCEMENT 📢'}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap dark:text-slate-200">
                    {post.content}
                </p>
            </div>

            {/* Stats */}
            <div className="px-4 py-2 flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 mx-4 mt-2 dark:border-slate-700 dark:text-slate-400">
                <div className="flex items-center gap-1">
                    {post.likes > 0 && (
                        <>
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Heart size={8} fill="white" /></div>
                            <span>{post.likes}</span>
                        </>
                    )}
                </div>
                <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                    {post.comments.length} Comments
                </button>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex">
                <ActionButton 
                    active={hasLiked} 
                    onClick={onLike} 
                    icon={<Heart size={18} fill={hasLiked ? "currentColor" : "none"} />} 
                    label="Like" 
                    color="text-red-500" 
                />
                <ActionButton 
                    active={false} 
                    onClick={() => setShowComments(true)} 
                    icon={<MessageSquare size={18} />} 
                    label="Comment" 
                />
                <ActionButton 
                    active={false} 
                    onClick={() => {}} 
                    icon={<Share2 size={18} />} 
                    label="Share" 
                />
            </div>

            {/* Comments Area */}
            {showComments && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-fade-in dark:bg-slate-900 dark:border-slate-800">
                    {post.comments.length > 0 && (
                        <div className="space-y-4 mb-4">
                            {post.comments.map(c => (
                                <div key={c.id} className="flex gap-2 items-start">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden dark:bg-slate-700 dark:border-slate-600">
                                        {c.authorAvatar ? <img src={c.authorAvatar} className="w-full h-full object-cover" /> : c.authorName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-900 block mb-0.5 dark:text-white">{c.authorName}</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{c.content}</p>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 ml-2">
                                            {new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 dark:bg-emerald-900 dark:text-emerald-300">
                            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover rounded-full" /> : currentUser.name[0]}
                        </div>
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-white border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            />
                            <button 
                                type="submit"
                                disabled={!commentText.trim()}
                                className="absolute right-1 top-1 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50 dark:hover:bg-slate-700 dark:text-emerald-400"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const ActionButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color?: string }> = ({ active, onClick, icon, label, color = "text-emerald-600" }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            active 
            ? `${color} bg-slate-50 dark:bg-slate-700` 
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
    >
        {icon} <span>{label}</span>
    </button>
);

export default CommunityPortal;
