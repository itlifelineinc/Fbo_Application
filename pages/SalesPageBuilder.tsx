
import React, { useState } from 'react';
import { useLocalDraft } from '../hooks/useLocalDraft';
import { PageType } from '../types/salesPage';
import EditorToolbar from '../components/SalesEditor/EditorToolbar';
import EditorLayout from '../components/SalesEditor/Layout';
import PreviewPanel from '../components/SalesEditor/PreviewPanel';
import { ResponsiveModal } from '../components/Shared/ResponsiveModal';
import { LayoutTemplate, ShoppingBag, Package, Heart, MessageCircle, User, Briefcase, Check, Lock } from 'lucide-react';

const SalesPageBuilder: React.FC = () => {
  const { page, updateField, publish, lastSaved } = useLocalDraft();
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Controls Mobile View mainly
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [showSplitView, setShowSplitView] = useState(true);
  
  // Page Type Selection State
  const [showTypeSelection, setShowTypeSelection] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const pageTypes: { 
      id: PageType; 
      title: string; 
      description: string; 
      icon: any; 
      badge?: string; 
      active: boolean 
  }[] = [
    {
      id: 'product',
      title: 'Product Sales',
      description: 'Single product conversion page',
      icon: ShoppingBag,
      badge: 'Popular',
      active: true
    },
    {
      id: 'bundle',
      title: 'Package Bundle',
      description: 'Sell multiple products together',
      icon: Package,
      active: true
    },
    {
      id: 'problem',
      title: 'Problem Solver',
      description: 'Focus on health solution',
      icon: Heart,
      active: true
    },
    {
      id: 'capture',
      title: 'Lead Capture',
      description: 'Get WhatsApp leads fast',
      icon: MessageCircle,
      active: false
    },
    {
      id: 'brand',
      title: 'Personal Brand',
      description: 'Your mini website profile',
      icon: User,
      active: false
    },
    {
      id: 'recruit',
      title: 'Recruitment',
      description: 'Join the business opportunity',
      icon: Briefcase,
      active: false
    }
  ];

  const handleSelectType = (id: PageType, active: boolean) => {
      if (!active) return;
      
      setSelectedType(id);
      
      // Update the draft with the selected type so EditorLayout knows what tabs to show
      updateField('type', id);

      // Close modal after delay
      setTimeout(() => {
          setShowTypeSelection(false);
      }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden relative">
      
      {/* Page Type Selection Modal */}
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
                          onClick={() => handleSelectType(type.id, type.active)}
                          className={`
                              flex flex-col items-center justify-center gap-3 p-4 py-6 rounded-3xl transition-all duration-300 h-full border text-center group relative
                              ${type.active 
                                  ? selectedType === type.id 
                                      ? 'bg-emerald-50 border-emerald-500 shadow-xl ring-1 ring-emerald-500 dark:bg-emerald-900/20 dark:border-emerald-500 scale-105' 
                                      : 'bg-white hover:shadow-xl hover:border-slate-200 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750'
                                  : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed grayscale dark:bg-slate-800/50 dark:border-slate-700'
                              }
                          `}
                      >
                          {/* Badge if exists */}
                          {type.badge && type.active && (
                              <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider dark:bg-emerald-900 dark:text-emerald-300">
                                  {type.badge}
                              </span>
                          )}

                          <div className={`
                              p-4 rounded-2xl transition-all duration-300 relative mb-1
                              ${type.active 
                                  ? selectedType === type.id 
                                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                                      : 'text-slate-500 group-hover:text-slate-800 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white bg-slate-50 dark:bg-slate-700/30'
                                  : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                              }
                          `}>
                              {type.active ? (
                                <type.icon 
                                    strokeWidth={2.5}
                                    size={32}
                                    className={selectedType === type.id ? 'fill-emerald-200/50' : 'fill-slate-100 dark:fill-slate-800'}
                                />
                              ) : (
                                <Lock size={32} className="opacity-50" />
                              )}
                          </div>
                          
                          <div className="space-y-1 w-full px-1">
                              <h4 className={`font-extrabold text-sm md:text-base leading-tight ${selectedType === type.id ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-700 dark:text-slate-200'}`}>
                                  {type.title}
                              </h4>
                              <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-snug">
                                  {type.active ? type.description : 'Coming Soon'}
                              </p>
                          </div>
                          
                          {selectedType === type.id && (
                              <div className="absolute top-3 left-3 text-emerald-600 animate-in zoom-in duration-300">
                                  <Check size={18} strokeWidth={4} />
                              </div>
                          )}
                      </button>
                  ))}
              </div>
          </div>
      </ResponsiveModal>

      {/* Main Builder UI */}
      <EditorToolbar 
        lastSaved={lastSaved}
        isPublished={page.isPublished}
        onPublish={publish}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        previewDevice={previewDevice}
        onSetPreviewDevice={setPreviewDevice}
        showSplitView={showSplitView}
        onToggleSplitView={() => setShowSplitView(!showSplitView)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Panel */}
        <div className={`
            flex-col transition-all duration-300 ease-in-out z-10
            ${isPreviewMode ? 'hidden' : 'flex'}
            ${showSplitView ? 'flex-1 border-r border-slate-200 max-w-3xl' : 'w-full max-w-5xl mx-auto shadow-xl my-0 md:my-6 rounded-none md:rounded-2xl border-x border-slate-200'}
            bg-white
        `}>
          <EditorLayout data={page} updateField={updateField} isPreviewMode={false} />
        </div>

        {/* Preview Panel */}
        <div className={`
            flex-1 bg-slate-200 overflow-hidden relative transition-all duration-300
            ${isPreviewMode ? 'flex' : 'hidden'}
            ${showSplitView && !isPreviewMode ? 'hidden md:flex' : ''}
        `}>
          <div className="w-full h-full bg-dot-pattern flex items-center justify-center overflow-hidden p-4 md:p-8">
             <PreviewPanel data={page} device={previewDevice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPageBuilder;
