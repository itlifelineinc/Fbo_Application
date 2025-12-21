
import React, { useState, useEffect } from 'react';
import { useLocalDraft } from '../hooks/useLocalDraft';
import { PageType } from '../types/salesPage';
import EditorToolbar from '../components/SalesEditor/EditorToolbar';
import EditorLayout from '../components/SalesEditor/Layout';
import PreviewPanel from '../components/SalesEditor/PreviewPanel';
import { ResponsiveModal } from '../components/Shared/ResponsiveModal';
import { Student } from '../types';
import { LayoutTemplate, ShoppingBag, Package, Heart, MessageCircle, User, Briefcase, Check, Lock, Loader2 } from 'lucide-react';

interface SalesPageBuilderProps {
    currentUser: Student;
}

const SalesPageBuilder: React.FC<SalesPageBuilderProps> = ({ currentUser }) => {
  const { 
      pages, 
      currentPage, 
      createNewPage, 
      selectPage, 
      updateField, 
      deletePage, 
      isLoaded 
  } = useLocalDraft(currentUser);

  const [isPreviewMode, setIsPreviewMode] = useState(false); 
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [showSplitView, setShowSplitView] = useState(true);
  const [showTypeSelection, setShowTypeSelection] = useState(false);

  useEffect(() => {
      if (isLoaded && !currentPage) {
          setShowTypeSelection(true);
      }
  }, [isLoaded, currentPage]);

  const pageTypes: { 
      id: PageType; 
      title: string; 
      description: string; 
      icon: any; 
      badge?: string; 
      active: boolean 
  }[] = [
    { id: 'product', title: 'Product Sales', description: 'Single product conversion page', icon: ShoppingBag, badge: 'Popular', active: true },
    { id: 'bundle', title: 'Package Bundle', description: 'Sell multiple products together', icon: Package, active: true },
    { id: 'problem', title: 'Problem Solver', description: 'Focus on health solution', icon: Heart, active: true },
    { id: 'capture', title: 'Lead Capture', description: 'Get WhatsApp leads fast', icon: MessageCircle, active: true },
    { id: 'brand', title: 'Personal Brand', description: 'Your mini website profile', icon: User, active: true },
    { id: 'recruit', title: 'Recruitment', description: 'Join the business opportunity', icon: Briefcase, active: true }
  ];

  const handleSelectType = (id: PageType) => {
      createNewPage(id);
      setShowTypeSelection(false);
  };

  const handleTogglePreview = () => setIsPreviewMode(!isPreviewMode);

  if (!isLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing System...</p>
            </div>
        </div>
    );
  }

  const activePageType = pageTypes.find(t => t.id === (currentPage?.type || 'product'));
  const pageTypeTitle = activePageType ? activePageType.title : 'Page Builder';

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden relative">
      
      <ResponsiveModal 
        isOpen={showTypeSelection} 
        onClose={() => setShowTypeSelection(false)} 
        title="Choose Page Type"
        icon={LayoutTemplate}
      >
          <div className="space-y-8 pb-4">
              <div className="text-center mb-6">
                  <div className="inline-flex flex-col items-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-heading">
                          What do you want to build today?
                      </h2>
                      <div className="h-1.5 w-24 bg-emerald-500 mt-2 rounded-full"></div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-lg mx-auto">
                      Select a template structure to get started. You can customize everything later.
                  </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {pageTypes.map((type) => (
                      <button 
                          key={type.id}
                          onClick={() => type.active && handleSelectType(type.id)}
                          className={`
                              flex flex-col items-center justify-center gap-3 p-4 py-6 rounded-3xl transition-all duration-300 h-full border text-center group relative
                              ${type.active 
                                  ? 'bg-white hover:shadow-xl hover:border-slate-200 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750'
                                  : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed grayscale dark:bg-slate-800/50 dark:border-slate-700'
                              }
                          `}
                      >
                          {type.badge && type.active && (
                              <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider dark:bg-emerald-900 dark:text-emerald-300">
                                  {type.badge}
                              </span>
                          )}
                          <div className={`p-4 rounded-2xl transition-all duration-300 relative mb-1 ${type.active ? 'text-slate-500 group-hover:text-slate-800 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white bg-slate-50 dark:bg-slate-700/30' : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                              {type.active ? <type.icon strokeWidth={2.5} size={32} /> : <Lock size={32} className="opacity-50" />}
                          </div>
                          <div className="space-y-1 w-full px-1">
                              <h4 className={`font-extrabold text-sm md:text-base leading-tight ${type.active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                  {type.title}
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-snug">
                                  {type.active ? type.description : 'Coming Soon'}
                              </p>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      </ResponsiveModal>

      <EditorToolbar 
        pageTypeTitle={pageTypeTitle}
        lastSaved={new Date(currentPage?.lastSavedAt || Date.now())}
        isPublished={currentPage?.isPublished || false}
        onPublish={() => updateField('isPublished', !currentPage?.isPublished)}
        isPreviewMode={isPreviewMode}
        onTogglePreview={handleTogglePreview}
        previewDevice={previewDevice}
        onSetPreviewDevice={setPreviewDevice}
        showSplitView={showSplitView}
        onToggleSplitView={() => setShowSplitView(!showSplitView)}
        onToggleTypeSelection={() => setShowTypeSelection(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-col transition-all duration-300 ease-in-out z-10 bg-white ${isPreviewMode ? 'hidden' : 'flex'} ${showSplitView ? 'w-full md:w-1/2 border-r border-slate-200' : 'w-full max-w-5xl mx-auto shadow-xl my-0 md:my-6 rounded-none md:rounded-2xl border-x border-slate-200'}`}>
          <EditorLayout 
              data={currentPage} 
              pages={pages}
              updateField={updateField} 
              onSelectPage={selectPage}
              onCreatePage={() => setShowTypeSelection(true)}
              onDeletePage={deletePage}
              onTogglePreview={handleTogglePreview}
              isPreviewMode={false} 
              previewDevice={previewDevice} 
              currentUser={currentUser}
          />
        </div>

        <div className={`bg-slate-200 overflow-hidden relative transition-all duration-300 ${isPreviewMode ? 'flex w-full' : 'hidden'} ${showSplitView && !isPreviewMode ? 'hidden md:flex w-1/2' : ''}`}>
          <div className="w-full h-full bg-dot-pattern flex items-center justify-center overflow-hidden p-4 md:p-8">
             {currentPage ? <PreviewPanel data={currentPage} device={previewDevice} /> : <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Select a page to preview</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPageBuilder;
