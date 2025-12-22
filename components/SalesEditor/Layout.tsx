
import React, { useState, useRef, useEffect } from 'react';
import { SalesPage, PageType, CurrencyCode } from '../../types/salesPage';
import { Student } from '../../types';
import MetaForm from './MetaForm';
import ThemeSelector from './ThemeSelector';
import Overview from './Overview';
import InfoPopover from '../Shared/InfoPopover';
import SEOSettings from './SEOSettings';
import { PAGE_TAB_CONFIG, PlaceholderTab } from './TabConfiguration';
import { Type, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

// Shared Components
import CTAConfiguration from './CTAConfiguration';
import CheckoutConfiguration from './CheckoutConfiguration';
import PublishShare from './PublishShare';

// Builder-Specific Components (Product Sales)
import ProductSectionEditor from './ProductSectionEditor';
import PageContentEditor from './PageContentEditor'; 
import TrustProofEditor from './TrustProofEditor'; 

// Builder-Specific Components (Problem Solver)
import ProblemSectionEditor from './ProblemSectionEditor';
import MistakesSectionEditor from './MistakesSectionEditor';
import LifestyleSectionEditor from './LifestyleSectionEditor';
import SolutionSectionEditor from './SolutionSectionEditor';
import SocialProofSectionEditor from './SocialProofSectionEditor';
import ComplianceSectionEditor from './ComplianceSectionEditor';

interface EditorLayoutProps {
  data: SalesPage | null;
  pages: SalesPage[];
  updateField: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  onSelectPage: (id: string) => void;
  onCreatePage: () => void;
  onDeletePage: (id: string) => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  previewDevice?: 'mobile' | 'desktop'; 
  currentUser: Student;
}

const TAB_HELP_CONTENT: Record<string, React.ReactNode> = {
    'OVERVIEW': 'View and manage all your published pages and drafts.',
    'PRODUCTS': 'Select a single product to build your conversion funnel.',
    'CONTENT': 'Craft your headline and the persuasive story behind the product.',
    'TRUST_PROOF': 'Add testimonials and official certification badges.',
    'CTA_SETUP': 'Configure how customers contact you.',
    'CHECKOUT': 'Switch between direct sales or lead collection via chat.',
    'PUBLISH': 'Take your page live and share it with your audience.',
    'PROBLEM_EDU': 'Explain the challenge clearly to build empathy.',
    'MISTAKES': 'Highlight what typically fails to position your solution.',
    'LIFESTYLE': 'Introduce healthy habits to build credibility.',
    'SOLUTION': 'Seamlessly transition to your recommended products.',
    'PROOF': 'Share real results and visual evidence.',
    'COMPLIANCE': 'Manage legal disclaimers and safety labels.'
};

const EditorLayout: React.FC<EditorLayoutProps> = ({ 
    data, 
    pages, 
    updateField, 
    onSelectPage, 
    onCreatePage, 
    onDeletePage,
    onTogglePreview,
    isPreviewMode, 
    previewDevice = 'desktop',
    currentUser
}) => {
  const portalType = data?.type || 'product';
  const tabs = PAGE_TAB_CONFIG[portalType] || PAGE_TAB_CONFIG['product'];
  
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
        const exists = tabs.some(t => t.id === activeTabId);
        if (!exists) setActiveTabId(tabs[0].id);
    }
  }, [portalType, tabs, activeTabId]);

  if (isPreviewMode) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const scrollAmount = 300;
        scrollContainerRef.current.scrollBy({ 
            left: direction === 'left' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
  };

  const getPortalLabel = (type: PageType) => {
      switch(type) {
          case 'product': return 'Product Sales';
          case 'bundle': return 'Package Bundle';
          case 'problem': return 'Problem Solver';
          case 'capture': return 'Lead Capture';
          case 'brand': return 'Personal Brand';
          case 'recruit': return 'Recruitment';
          default: return 'Page';
      }
  };

  const renderContent = () => {
      if (activeTabId === 'OVERVIEW') {
          return (
            <Overview 
                pages={pages.filter(p => p.type === portalType)} 
                activePageId={data?.id}
                onSelect={onSelectPage}
                onCreate={onCreatePage}
                onDelete={onDeletePage}
                onUpdateCurrency={(id, curr) => onSelectPage(id)} // Simplified
                onUpdateField={(id, f, v) => onSelectPage(id)} // Simplified
                onTogglePreview={onTogglePreview}
            />
          );
      }

      if (!data) return null;

      // 1. SHARED TABS (Common across all builders)
      switch (activeTabId) {
          case 'DESIGN':
          case 'DESIGN_PREVIEW':
          case 'DESIGN_BRANDING':
          case 'SETTINGS_PREVIEW':
              return <ThemeSelector data={data} onChange={updateField} previewDevice={previewDevice} />;

          case 'PUBLISH':
          case 'PREVIEW_PUBLISH':
              return <PublishShare data={data} onChange={updateField} pages={pages} />;

          case 'CHECKOUT':
              return <CheckoutConfiguration data={data} onChange={updateField} />;
              
          case 'SEO':
              return <SEOSettings data={data} onChange={updateField} pages={pages} />;
          
          case 'PAGE_BASICS':
          case 'PKG_BASICS':
          case 'HEADLINE_MSG':
          case 'PROFILE_ID':
              return <MetaForm data={data} onChange={updateField} pages={pages} />;
      }

      // 2. TYPE-SPECIFIC TABS (The "Router" logic)
      if (data.type === 'product') {
          switch (activeTabId) {
              case 'PRODUCTS': return <ProductSectionEditor data={data} onChange={updateField} />;
              case 'CONTENT': return <PageContentEditor data={data} onChange={updateField} />;
              case 'TRUST_PROOF': return <TrustProofEditor data={data} onChange={updateField} currentUser={currentUser} />;
              case 'CTA_SETUP': return <CTAConfiguration data={data} onChange={updateField} />;
          }
      }

      if (data.type === 'problem') {
          switch (activeTabId) {
              case 'PROBLEM_EDU': return <ProblemSectionEditor data={data} onChange={updateField} />;
              case 'MISTAKES': return <MistakesSectionEditor data={data} onChange={updateField} />;
              case 'LIFESTYLE': return <LifestyleSectionEditor data={data} onChange={updateField} />;
              case 'SOLUTION': return <SolutionSectionEditor data={data} onChange={updateField} />;
              case 'PROOF': return <SocialProofSectionEditor data={data} onChange={updateField} />;
              case 'COMPLIANCE': return <ComplianceSectionEditor data={data} onChange={updateField} />;
              case 'CTA_SETUP': 
                  // Even though the tab ID is the same, we could return a different component if needed
                  // For now, using the shared one but namespaced data ensures safety.
                  return <CTAConfiguration data={data} onChange={updateField} />;
          }
      }

      // 3. FALLBACK FOR UNDER CONSTRUCTION TABS
      const currentTab = tabs.find(t => t.id === activeTabId);
      return (
        <PlaceholderTab 
            label={currentTab?.label || 'Feature'} 
            portalType={getPortalLabel(portalType)} 
        />
      );
  };

  const activeTab = tabs.find(t => t.id === activeTabId);
  const ActiveIcon = activeTab?.icon || Type;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 w-full max-w-full">
      <div className="shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 sticky top-0 relative group">
        <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-start pl-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"><ChevronLeft size={18} strokeWidth={2.5} /></div>
        </button>

        <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2 scroll-smooth">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeTabId === tab.id ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-end pr-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"><ChevronRight size={18} strokeWidth={2.5} /></div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-fade-in w-full">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden w-full">
                <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                        <ActiveIcon size={20} className="text-emerald-500" /> {activeTab?.label}
                    </h2>
                    <InfoPopover title={`${activeTab?.label} Help`} description={TAB_HELP_CONTENT[activeTabId] || 'Configure your page settings here.'} />
                </div>
                <div className="min-h-[300px] w-full max-w-full overflow-x-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
