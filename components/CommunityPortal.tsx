
import React, { useState, useRef, useEffect } from 'react';
import { Student, CommunityPost, Cohort, UserRole, CommunityComment, Poll, PostMedia } from '../types';
import { 
  Globe, Users, Hash, Search, Image as ImageIcon, Video, BarChart2, 
  Send, MoreHorizontal, Heart, MessageCircle, Share2, Pin, Trash2, 
  Slash, Flag, X, Plus, CheckCircle, Smile, Tag, XCircle, Lock, Settings, 
  Shield, UserPlus, Clock, LayoutList, Info, Calendar, Eye, ArrowLeft, BookOpen, AlertCircle, MapPin, EyeOff, Search as SearchIcon, PlusSquare, Edit3, Menu
} from 'lucide-react';

interface CommunityPortalProps {
  currentUser: Student;
  posts: CommunityPost[];
  cohorts: Cohort[];
  students: Student[]; // Added students prop to count members
  onAddPost: (post: CommunityPost) => void;
  onAddComment: (postId: string, comment: CommunityComment) => void;
  onLikePost: (postId: string) => void;
  onUpdatePost?: (post: CommunityPost) => void; 
  onDeletePost?: (postId: string) => void;
  onCreateCohort: (cohort: Cohort) => void;
}

const CommunityPortal: React.FC<CommunityPortalProps> = ({ 
  currentUser, 
  posts, 
  cohorts, 
  students,
  onAddPost, 
  onAddComment, 
  onLikePost,
  onUpdatePost,
  onDeletePost,
  onCreateCohort
}) => {
  // 'GLOBAL' or cohortId
  const [activeTab, setActiveTab] = useState<string>('GLOBAL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateCohortModalOpen, setIsCreateCohortModalOpen] = useState(false);
  
  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Partial<Cohort>>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Mobile Admin Sheet State
  const [isMobileAdminSheetOpen, setIsMobileAdminSheetOpen] = useState(false);

  // Global Feed Mobile States
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isCohortSearchOpen, setIsCohortSearchOpen] = useState(false); // Added for Cohort Search
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const globalScrollRef = useRef<HTMLDivElement>(null);

  // Create Modal State
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortDesc, setNewCohortDesc] = useState('');
  const [newCohortCover, setNewCohortCover] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);

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
  const isGlobalAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const canCreateCohort = currentUser.role === UserRole.SPONSOR || isGlobalAdmin;

  // Active Cohort Details
  const activeCohortDetails = activeTab !== 'GLOBAL' ? cohorts.find(c => c.id === activeTab) : null;
  const activeCohortMembers = activeTab !== 'GLOBAL' ? students.filter(s => s.cohortId === activeTab).length : 0;

  // Check if current user is the "Admin" of the current view (Sponsor of the cohort)
  const isCohortAdmin = activeCohortDetails && (currentUser.handle === activeCohortDetails.mentorHandle || isGlobalAdmin);
  
  const isModerator = activeTab === 'GLOBAL' ? isGlobalAdmin : !!isCohortAdmin;

  // --- Handlers ---

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortName.trim()) return;
    
    const newCohort: Cohort = {
        id: `cohort_${Date.now()}`,
        name: newCohortName,
        description: newCohortDesc,
        mentorHandle: currentUser.handle,
        coverImage: newCohortCover,
        privacy: 'PRIVATE', // Default
        introEnabled: true,
        isHidden: false
    };
    
    onCreateCohort(newCohort);
    setIsCreateCohortModalOpen(false);
    
    // Reset
    setNewCohortName('');
    setNewCohortDesc('');
    setNewCohortCover('');
    
    setActiveTab(newCohort.id);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewCohortCover(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const openSettings = () => {
      if (activeCohortDetails) {
          setSettingsForm({ ...activeCohortDetails });
          setIsSettingsModalOpen(true);
          setIsMobileAdminSheetOpen(false);
      }
  };

  const handleSaveSettings = () => {
      const updatedCohort = { ...activeCohortDetails, ...settingsForm } as Cohort;
      const idx = cohorts.findIndex(c => c.id === updatedCohort.id);
      if (idx !== -1) {
          cohorts[idx] = updatedCohort; 
      }
      setIsSettingsModalOpen(false);
      alert("Group settings saved!");
  };

  const handleDeleteGroup = () => {
      alert("Group deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setIsSettingsModalOpen(false);
      setActiveTab('GLOBAL');
  };

  const scrollToTop = () => {
      if (globalScrollRef.current) {
          globalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  // --- Content Renderers ---

  const renderGlobalFeedContent = () => (
      <div className="space-y-6">
          <CreatePostWidget 
            currentUser={currentUser} 
            onPost={(post) => onAddPost({ ...post, cohortId: undefined })}
            activeFeedName="Global Hub"
          />
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
                    <p className="font-medium">No posts yet.</p>
                    <p className="text-sm mt-1">Share a win or ask a question to start!</p>
                </div>
            )}
          </div>
          <div className="h-20"></div>
      </div>
  );

  const renderCohortContent = () => (
      <div className="space-y-6">
          {activeCohortDetails && (
              <div className="bg-white rounded-b-2xl md:rounded-2xl shadow-sm border-b md:border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 group -mx-4 md:mx-0 -mt-4 md:mt-0">
                  <div className="h-40 md:h-56 bg-gradient-to-r from-emerald-600 to-teal-500 relative bg-cover bg-center" style={activeCohortDetails.coverImage ? { backgroundImage: `url(${activeCohortDetails.coverImage})` } : {}}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h1 className="text-2xl md:text-3xl font-bold text-white font-heading shadow-sm">{activeCohortDetails.name}</h1>
                      </div>
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full dark:bg-slate-700 dark:text-slate-300">
                              {activeCohortDetails.privacy === 'PUBLIC' ? <Globe size={12}/> : <Lock size={12} />} 
                              {activeCohortDetails.privacy === 'PUBLIC' ? 'Public Group' : 'Private Group'}
                          </div>
                          <div className="text-sm text-slate-500 font-medium dark:text-slate-400">
                              <span className="font-bold text-slate-900 dark:text-white">{activeCohortMembers}</span> Members
                          </div>
                          {activeCohortDetails.location && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                  <MapPin size={12} /> {activeCohortDetails.location}
                              </div>
                          )}
                      </div>
                      
                      <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 dark:bg-slate-700"></div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:border-slate-800 dark:bg-emerald-900 dark:text-emerald-300">
                              +{Math.max(0, activeCohortMembers - 3)}
                          </div>
                      </div>
                  </div>
                  
                  <div className="px-4 pb-2 flex gap-4 border-t border-slate-100 dark:border-slate-700 pt-3 overflow-x-auto no-scrollbar">
                      <button className="text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 pb-2 dark:text-emerald-400">Discussion</button>
                      <button className="text-sm font-medium text-slate-500 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors pb-2 dark:text-slate-400 dark:hover:bg-slate-700">Members</button>
                      <button className="text-sm font-medium text-slate-500 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors pb-2 dark:text-slate-400 dark:hover:bg-slate-700">Events</button>
                      <button className="text-sm font-medium text-slate-500 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors pb-2 dark:text-slate-400 dark:hover:bg-slate-700">Media</button>
                  </div>
              </div>
          )}

          <CreatePostWidget 
            currentUser={currentUser} 
            onPost={(post) => onAddPost({ ...post, cohortId: activeTab })}
            activeFeedName={activeCohortDetails?.name || 'Team Feed'}
          />

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
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in relative min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* 
          MOBILE COHORT OVERLAY 
      */}
      {activeCohortDetails && (
          <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 overflow-y-auto md:hidden flex flex-col">
              {/* Custom Mobile Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                  <button 
                      onClick={() => setActiveTab('GLOBAL')} 
                      className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full"
                  >
                      <ArrowLeft size={24} />
                  </button>
                  
                  <div className="flex items-center gap-3">
                      <button 
                          onClick={() => setIsCohortSearchOpen(true)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full"
                      >
                          <SearchIcon size={24} />
                      </button>
                      
                      {isCohortAdmin ? (
                          <button 
                              onClick={() => setIsMobileAdminSheetOpen(true)}
                              className="relative p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full"
                          >
                              <Shield size={24} fill="currentColor" className="opacity-20 absolute" />
                              <Shield size={24} />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-[10px] font-bold text-white mb-0.5">★</span>
                              </div>
                          </button>
                      ) : (
                          <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full">
                              <MoreHorizontal size={24} />
                          </button>
                      )}
                  </div>
              </div>

              <div className="p-4 flex-1">
                  {renderCohortContent()}
              </div>

              {/* Slide Left Drawer (Search) - Cohort Specific */}
              <div className={`fixed inset-0 z-[70] transition-transform duration-300 ${isCohortSearchOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                   <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col">
                       <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                           <button onClick={() => setIsCohortSearchOpen(false)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
                               <ArrowLeft size={24}/>
                           </button>
                           <input 
                              type="text" 
                              placeholder={`Search in ${activeCohortDetails.name}...`}
                              autoFocus 
                              className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400" 
                           />
                       </div>
                       <div className="flex-1 p-8 text-center text-slate-400 dark:text-slate-500">
                           <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
                           <p>Start typing to search this group...</p>
                       </div>
                   </div>
              </div>

              {isMobileAdminSheetOpen && (
                  <div className="fixed inset-0 z-[70]">
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileAdminSheetOpen(false)}></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 dark:bg-slate-700"></div>
                          <div className="flex items-center gap-2 mb-6">
                              <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Admin Tools</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                                <button className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <UserPlus size={20} className="text-slate-400"/> Member Requests
                                </button>
                                <button className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <Clock size={20} className="text-slate-400"/> Scheduled Posts
                                </button>
                                <button className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <Flag size={20} className="text-slate-400"/> Member Reported
                                </button>
                                <button className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <BookOpen size={20} className="text-slate-400"/> Cohort Rules
                                </button>
                                <button className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <BarChart2 size={20} className="text-slate-400"/> Analytics
                                </button>
                                <button onClick={openSettings} className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-4 font-medium dark:bg-slate-800 dark:text-slate-200">
                                    <Settings size={20} className="text-slate-400"/> Group Settings
                                </button>
                          </div>
                          
                          <button 
                              onClick={() => setIsMobileAdminSheetOpen(false)}
                              className="w-full mt-6 py-3 text-slate-500 font-bold hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                          >
                              Close Menu
                          </button>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* 
          MOBILE GLOBAL FEED OVERLAY 
          - Only visible on mobile when 'GLOBAL' is active.
          - Replaces standard header with custom "For You" Facebook-style header.
      */}
      {activeTab === 'GLOBAL' && (
          <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col md:hidden">
              {/* Custom Header */}
              <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                   <div className="flex items-center gap-3">
                       <button onClick={() => setIsSidebarOpen(true)} className="p-1">
                          <Menu size={24} className="text-slate-900 dark:text-white" />
                       </button>
                       <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">For You</h1>
                   </div>
                   <div className="flex items-center gap-4">
                       <button 
                          onClick={() => setIsGlobalSearchOpen(true)} 
                          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white"
                       >
                          <SearchIcon size={20} />
                       </button>
                       <div className="relative">
                          <button 
                              onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} 
                              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white transition-transform active:scale-95"
                          >
                              <PlusSquare size={20} />
                          </button>
                          {/* Plus Menu Popover */}
                          {isPlusMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPlusMenuOpen(false)}></div>
                                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in origin-top-right">
                                    <button 
                                        onClick={() => {scrollToTop(); setIsPlusMenuOpen(false);}} 
                                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200"
                                    >
                                        <Edit3 size={18} /> Post
                                    </button>
                                    <button 
                                        onClick={() => {scrollToTop(); setIsPlusMenuOpen(false);}} 
                                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200"
                                    >
                                        <BarChart2 size={18} /> Poll
                                    </button>
                                    <button 
                                        onClick={() => {scrollToTop(); setIsPlusMenuOpen(false);}} 
                                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200"
                                    >
                                        <ImageIcon size={18} /> Photo/Video
                                    </button>
                                </div>
                              </>
                          )}
                       </div>
                   </div>
              </div>

              {/* Feed Content */}
              <div ref={globalScrollRef} className="flex-1 overflow-y-auto p-4 scroll-smooth bg-slate-50 dark:bg-slate-950">
                   {renderGlobalFeedContent()}
              </div>

              {/* Slide Left Drawer (Search) */}
              <div className={`fixed inset-0 z-[70] transition-transform duration-300 ${isGlobalSearchOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                   <div className="absolute inset-0 bg-white dark:bg-slate-950 flex flex-col">
                       <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                           <button onClick={() => setIsGlobalSearchOpen(false)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
                               <ArrowLeft size={24}/>
                           </button>
                           <input 
                              type="text" 
                              placeholder="Search posts..." 
                              autoFocus 
                              className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400" 
                           />
                       </div>
                       <div className="flex-1 p-8 text-center text-slate-400 dark:text-slate-500">
                           <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
                           <p>Start typing to search...</p>
                       </div>
                   </div>
              </div>
          </div>
      )}

      {/* Mobile Sidebar Overlay (Standard) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[80] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
          fixed inset-y-0 left-0 z-[90] w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
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
            {/* Logic: If inside a Cohort (Desktop), show Back Button & Admin Tools. Else show Global Nav */}
            {activeTab !== 'GLOBAL' && activeCohortDetails ? (
                <>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700">
                        <button 
                            onClick={() => setActiveTab('GLOBAL')}
                            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors dark:text-slate-300 dark:hover:text-emerald-400"
                        >
                            <ArrowLeft size={16} /> Back to For You
                        </button>
                    </div>

                    {isCohortAdmin && (
                        <>
                            <div className="p-4 border-b border-slate-100 bg-emerald-50 dark:bg-emerald-900/10 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 mb-1">
                                    <Shield size={18} />
                                    <span className="font-bold font-heading">Manage Cohort</span>
                                </div>
                                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500">Admin Tools</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <UserPlus size={16} className="text-slate-400"/> Member Requests
                                </button>
                                <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <Clock size={16} className="text-slate-400"/> Scheduled Posts
                                </button>
                                <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <Flag size={16} className="text-slate-400"/> Member Reported
                                </button>
                                <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <BookOpen size={16} className="text-slate-400"/> Cohort Rules
                                </button>
                                <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <BarChart2 size={16} className="text-slate-400"/> Analytics
                                </button>
                                <button onClick={openSettings} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700/50">
                                    <Settings size={16} className="text-slate-400"/> Group Settings
                                </button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {/* Standard Navigation (For You & List) */}
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
                            <span className="truncate font-bold">For You</span>
                        </button>

                        <div className="mt-6 mb-2 px-3 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                            <div className="flex items-center gap-2"><Users size={12} /> Your Teams</div>
                            {canCreateCohort && (
                                <button 
                                    onClick={() => setIsCreateCohortModalOpen(true)}
                                    className="p-1 hover:bg-slate-100 rounded dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 transition-colors"
                                    title="Create Cohort"
                                >
                                    <Plus size={12} />
                                </button>
                            )}
                        </div>
                        
                        {myCohort ? (
                            <button 
                                onClick={() => { setActiveTab(myCohort.id); setIsSidebarOpen(false); }}
                                className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
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
                        {isGlobalAdmin && (
                            <>
                                <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">All Cohorts (Admin)</div>
                                {cohorts.filter(c => c.id !== currentUser.cohortId).map(c => (
                                    <button 
                                        key={c.id}
                                        onClick={() => { setActiveTab(c.id); setIsSidebarOpen(false); }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                                    >
                                        <div className="w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0 dark:bg-slate-700 dark:text-slate-400"><Users size={12} /></div>
                                        <div className="truncate text-xs">{c.name}</div>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
      </div>

      {/* Main Feed Area (Standard / Desktop View) */}
      <div className={`hidden md:block flex-1 min-w-0 max-w-3xl`}>
          {activeTab === 'GLOBAL' ? renderGlobalFeedContent() : renderCohortContent()}
      </div>

      {/* Right Column (Desktop Only) - Context Aware */}
      <div className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-6 space-y-6">
              
              {/* Context Switcher for Right Column */}
              {activeTab === 'GLOBAL' ? (
                  // --- GLOBAL CONTEXT ---
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
              ) : activeCohortDetails ? (
                  // --- COHORT CONTEXT ---
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <h3 className="font-bold text-slate-800 mb-4 dark:text-white flex items-center gap-2">
                          <Info size={18} className="text-emerald-500" /> About this Cohort
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {activeCohortDetails.description}
                      </p>
                      
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                              {activeCohortDetails.privacy === 'PUBLIC' ? <Globe size={16} className="text-slate-400"/> : <Lock size={16} className="text-slate-400"/>}
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">{activeCohortDetails.privacy === 'PUBLIC' ? 'Public' : 'Private'}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {activeCohortDetails.privacy === 'PUBLIC' ? 'Visible to everyone.' : 'Only members can see posts.'}
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              {activeCohortDetails.isHidden ? <EyeOff size={16} className="text-slate-400"/> : <Eye size={16} className="text-slate-400"/>}
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">{activeCohortDetails.isHidden ? 'Hidden' : 'Visible'}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeCohortDetails.isHidden ? 'Search hidden.' : 'Anyone can find this group.'}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs dark:bg-emerald-900 dark:text-emerald-300">
                                  {activeCohortDetails.mentorHandle.charAt(1).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">Created by</p>
                                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{activeCohortDetails.mentorHandle}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              ) : null}

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl shadow-lg text-white">
                  <h3 className="font-bold mb-2">💡 Tip of the Day</h3>
                  <p className="text-sm text-indigo-200 leading-relaxed">
                      "Consistency beats intensity. Post one update or comment every day to build momentum."
                  </p>
              </div>
          </div>
      </div>

      {/* Create Cohort Modal */}
      {isCreateCohortModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">Create New Cohort</h3>
                      <button onClick={() => setIsCreateCohortModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      <form onSubmit={handleCreateSubmit} className="space-y-6">
                          {/* Cover Image Upload */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Image</label>
                              <div 
                                onClick={() => coverInputRef.current?.click()}
                                className={`relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${newCohortCover ? 'border-transparent' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700'}`}
                              >
                                  {newCohortCover ? (
                                      <>
                                        <img src={newCohortCover} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold">Change Image</span>
                                        </div>
                                      </>
                                  ) : (
                                      <div className="text-center text-slate-400 dark:text-slate-500">
                                          <ImageIcon className="mx-auto mb-1" />
                                          <span className="text-xs font-bold">Upload Cover</span>
                                      </div>
                                  )}
                                  <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">Recommended: 820px x 312px</p>
                          </div>

                          <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Cohort Name</label>
                                <span className={`text-[10px] font-bold ${newCohortName.length === 50 ? 'text-red-500' : 'text-slate-400'}`}>{newCohortName.length}/50</span>
                              </div>
                              <input 
                                  type="text" 
                                  value={newCohortName}
                                  maxLength={50}
                                  onChange={(e) => setNewCohortName(e.target.value)}
                                  placeholder="e.g. June Achievers 2025"
                                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                  required
                              />
                          </div>
                          
                          <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                                <span className={`text-[10px] font-bold ${newCohortDesc.length === 100 ? 'text-red-500' : 'text-slate-400'}`}>{newCohortDesc.length}/100</span>
                              </div>
                              <textarea 
                                  value={newCohortDesc}
                                  maxLength={100}
                                  onChange={(e) => setNewCohortDesc(e.target.value)}
                                  placeholder="What is this group about?"
                                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                              <button 
                                  type="button" 
                                  onClick={() => setIsCreateCohortModalOpen(false)}
                                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                              >
                                  Cancel
                              </button>
                              <button 
                                  type="submit"
                                  disabled={!newCohortName.trim()}
                                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Create Group
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* Group Settings Modal */}
      {isSettingsModalOpen && activeCohortDetails && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">Group Settings</h3>
                      <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-6">
                      
                      {/* Set up group */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 dark:border-slate-800">Set Up Group</h4>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                              <input 
                                  type="text" 
                                  value={settingsForm.name}
                                  onChange={(e) => setSettingsForm(prev => ({...prev, name: e.target.value}))}
                                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                              <textarea 
                                  value={settingsForm.description}
                                  onChange={(e) => setSettingsForm(prev => ({...prev, description: e.target.value}))}
                                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                              />
                          </div>
                      </div>

                      {/* New Member Intro */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 dark:border-slate-800">Community Features</h4>
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">New Member Intro</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Welcome new members automatically</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={settingsForm.introEnabled ?? true} 
                                    onChange={(e) => setSettingsForm(prev => ({...prev, introEnabled: e.target.checked}))} 
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div>
                              </label>
                          </div>
                      </div>

                      {/* Privacy & Visibility */}
                      <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 dark:border-slate-800">Privacy & Location</h4>
                          
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <Lock size={18} className="text-slate-400"/>
                                  <div>
                                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Privacy</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">Public or Private</p>
                                  </div>
                              </div>
                              <select 
                                  value={settingsForm.privacy || 'PRIVATE'}
                                  onChange={(e) => setSettingsForm(prev => ({...prev, privacy: e.target.value as 'PUBLIC' | 'PRIVATE'}))}
                                  className="p-2 border border-slate-200 rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
                              >
                                  <option value="PUBLIC">Public</option>
                                  <option value="PRIVATE">Private</option>
                              </select>
                          </div>

                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <EyeOff size={18} className="text-slate-400"/>
                                  <div>
                                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Hide Group</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">Visibility in search</p>
                                  </div>
                              </div>
                              <select 
                                  value={settingsForm.isHidden ? 'HIDDEN' : 'VISIBLE'}
                                  onChange={(e) => setSettingsForm(prev => ({...prev, isHidden: e.target.value === 'HIDDEN'}))}
                                  className="p-2 border border-slate-200 rounded-lg text-sm bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
                              >
                                  <option value="VISIBLE">Visible</option>
                                  <option value="HIDDEN">Hidden</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                              <div className="relative">
                                  <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                  <input 
                                      type="text" 
                                      value={settingsForm.location || ''}
                                      onChange={(e) => setSettingsForm(prev => ({...prev, location: e.target.value}))}
                                      placeholder="e.g. London, UK"
                                      className="w-full pl-9 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-4 border-t border-red-100 dark:border-red-900/30">
                          <button 
                              type="button" 
                              onClick={() => setIsDeleteConfirmOpen(true)}
                              className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors border border-red-200 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                              Delete Group
                          </button>
                      </div>

                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                      <button onClick={() => setIsSettingsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                      <button onClick={handleSaveSettings} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm">Save Changes</button>
                  </div>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-red-900/30">
                          <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Delete Group?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                          Are you sure you want to delete <strong>{activeCohortDetails?.name}</strong>? This action cannot be undone and all data will be lost.
                      </p>
                      <div className="flex gap-3">
                          <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                          <button onClick={handleDeleteGroup} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-md">Delete</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

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
    const [activeMode, setActiveMode] = useState<'STATUS' | 'POLL'>('STATUS'); // Poll mode toggles the view
    const [postType, setPostType] = useState<CommunityPost['type']>('DISCUSSION');
    const [mediaFiles, setMediaFiles] = useState<PostMedia[]>([]);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Close logic: Click Outside OR Empty Content
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                // Only collapse if content is empty and no media/poll active
                if (!content.trim() && mediaFiles.length === 0 && activeMode !== 'POLL') {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [content, mediaFiles, activeMode]);

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
                    setActiveMode('STATUS'); // Ensure we are in status mode to see preview
                    setIsExpanded(true); // Ensure expanded
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePollMode = () => {
        if (activeMode === 'POLL') {
            setActiveMode('STATUS');
        } else {
            setActiveMode('POLL');
            setMediaFiles([]); // Clear media if switching to poll
            setIsExpanded(true);
        }
    };

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'WIN': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'CHALLENGE': return 'text-red-600 bg-red-50 border-red-200';
            case 'QUESTION': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'MOTIVATION': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const handleSubmit = () => {
        if (!content.trim() && mediaFiles.length === 0 && activeMode !== 'POLL') return;
        if (activeMode === 'POLL' && (!content.trim() || pollOptions.some(o => !o.trim()))) return;

        const newPost: any = { 
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
                question: content, 
                options: pollOptions.map((text, i) => ({ id: `opt_${i}`, text, votes: [] })),
                isOpen: true
            };
            newPost.type = 'QUESTION'; 
        }

        onPost(newPost);
        
        // Reset
        setContent('');
        setMediaFiles([]);
        setPollOptions(['', '']);
        setActiveMode('STATUS');
        setPostType('DISCUSSION');
        setShowTypeSelector(false);
        setIsExpanded(false);
    };

    return (
        <div ref={widgetRef} className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700 transition-all duration-300`}>
            {/* Top Area: Avatar + Input */}
            <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-slate-100 shadow-sm dark:bg-emerald-900 dark:text-emerald-300 dark:border-slate-600 overflow-hidden">
                    {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} className="w-full h-full object-cover"/> : currentUser.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                    {isExpanded ? (
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={activeMode === 'POLL' ? "Ask a question..." : `What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                            className="w-full bg-transparent border-none p-0 text-base focus:ring-0 focus:outline-none resize-none min-h-[80px] placeholder-slate-500 text-slate-800 dark:text-white dark:placeholder-slate-400 cursor-text"
                            autoFocus
                        />
                    ) : (
                        <div 
                            onClick={() => setIsExpanded(true)}
                            className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full px-4 py-2 hover:bg-slate-200/50 transition-all text-slate-500 cursor-pointer h-10 flex items-center text-sm dark:text-slate-400"
                        >
                            {`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Content Area */}
            {isExpanded && (
                <div className="mt-3 animate-fade-in">
                    <div className="px-2">
                        {/* Media Preview - Improved for transparent images */}
                        {mediaFiles.length > 0 && activeMode === 'STATUS' && (
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 pt-1">
                                {mediaFiles.map((media, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-sm bg-white dark:bg-slate-700">
                                        {media.type === 'VIDEO' ? <div className="bg-black w-full h-full flex items-center justify-center"><Video className="text-white" size={24}/></div> : <img src={media.url} className="w-full h-full object-cover" />}
                                        <button onClick={() => setMediaFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm transition-colors"><X size={12}/></button>
                                    </div>
                                ))}
                                <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-500 transition-all dark:hover:bg-slate-700"><Plus size={24}/><span className="text-xs font-bold mt-1">Add</span></button>
                            </div>
                        )}

                        {/* Poll Editor */}
                        {activeMode === 'POLL' && (
                            <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-700 animate-fade-in">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Poll Options</span>
                                    <button onClick={togglePollMode} className="text-slate-400 hover:text-red-500"><XCircle size={16}/></button>
                                </div>
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
                                        className="w-full p-2.5 text-sm border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                ))}
                                <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"><Plus size={14} /> Add Option</button>
                            </div>
                        )}

                        {/* Type Selector (Category) */}
                        {showTypeSelector && (
                            <div className="flex flex-wrap gap-2 mb-4 pt-2 animate-fade-in border-t border-slate-100 dark:border-slate-700">
                                {['DISCUSSION', 'WIN', 'CHALLENGE', 'QUESTION', 'MOTIVATION'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => { setPostType(type as any); setShowTypeSelector(false); }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                            postType === type 
                                            ? getTypeColor(type) + ' shadow-sm'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 w-full mb-3 dark:bg-slate-700"></div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex gap-1 md:gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-500 font-semibold text-sm transition-colors dark:hover:bg-slate-700 dark:text-slate-400"
                            >
                                <ImageIcon size={20} className="text-green-500" />
                                <span className="hidden sm:inline">Photo/Video</span>
                            </button>
                            
                            <button 
                                onClick={togglePollMode}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold text-sm transition-colors ${activeMode === 'POLL' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 dark:hover:bg-slate-700 dark:text-slate-400'}`}
                            >
                                <BarChart2 size={20} className="text-orange-500" />
                                <span className="hidden sm:inline">Poll</span>
                            </button>

                            <button 
                                onClick={() => setShowTypeSelector(!showTypeSelector)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 font-semibold text-sm transition-colors ${showTypeSelector ? 'bg-yellow-50 text-yellow-700' : 'text-slate-500 dark:hover:bg-slate-700 dark:text-slate-400'}`}
                            >
                                <Tag size={20} className="text-yellow-500" />
                                <span className="hidden sm:inline">{postType === 'DISCUSSION' ? 'Topic' : postType}</span>
                                {postType !== 'DISCUSSION' && <span className="sm:hidden font-bold text-xs uppercase">{postType}</span>}
                            </button>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={!content && mediaFiles.length === 0 && activeMode !== 'POLL'}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Post <Send size={14} className="opacity-80" />
                        </button>
                    </div>
                </div>
            )}
            
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
                
                {/* Media Grid - Improved for transparent images */}
                {post.media && post.media.length > 0 && (
                    <div className={`grid gap-2 mt-3 rounded-xl overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.media.map((m, i) => (
                            <div key={i} className="aspect-video bg-white relative shadow-sm">
                                {m.type === 'VIDEO' ? (
                                    <video src={m.url} controls className="w-full h-full object-contain bg-black" />
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
