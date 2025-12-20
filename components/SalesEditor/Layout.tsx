
import React, { useState, useRef, useEffect } from 'react';
import { SalesPage, PageType } from '../../types/salesPage';
import MetaForm from './MetaForm';
import MediaUploader from './MediaUploader';
import ProductSectionEditor from './ProductSectionEditor';
import PageContentEditor from './PageContentEditor'; 
import PackageSectionEditor from './PackageSectionEditor';
import TrustProofEditor from './TrustProofEditor'; 
import CTAConfiguration from './CTAConfiguration';
import CheckoutConfiguration from './CheckoutConfiguration'; 
import PublishShare from './PublishShare';
import ThemeSelector from './ThemeSelector';
import RichTextEditor from './RichTextEditor'; 
import InfoPopover from '../Shared/InfoPopover';
import { PAGE_TAB_CONFIG, PlaceholderTab } from './TabConfiguration';
import { Type, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorLayoutProps {
  data: SalesPage;
  updateField: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  isPreviewMode: boolean;
  previewDevice?: 'mobile' | 'desktop'; 
}

const TAB_HELP_CONTENT: Record<string, React.ReactNode> = {
    'PRODUCTS': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Search Catalog:</strong> Quickly find Forever products to auto-fill details.</li>
            <li><strong>Smart Data:</strong> Images, benefits, and usage instructions are loaded automatically.</li>
        </ul>
    ),
    'CONTENT': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Headline:</strong> The main hook of your page.</li>
            <li><strong>Benefits:</strong> Short bullet points that sell the result.</li>
        </ul>
    ),
    'TRUST_PROOF': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Bio:</strong> Tell them why you are the expert.</li>
            <li><strong>Badges:</strong> Official seals build instant trust.</li>
            <li><strong>Testimonials:</strong> Social proof is key to conversion.</li>
        </ul>
    ),
    'CTA_SETUP': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>WhatsApp Link:</strong> Auto-generated link with pre-filled message.</li>
            <li><strong>Placement:</strong> Choose where buttons appear to maximize clicks.</li>
        </ul>
    ),
    'CHECKOUT': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Commerce Mode:</strong> Choose between Lead Gen (Chat) or Direct Sales (Cart).</li>
            <li><strong>Payments:</strong> Configure Mobile Money, Card, or Cash on Delivery.</li>
        </ul>
    ),
    'PUBLISH': (
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Go Live:</strong> Make your page accessible to the world.</li>
            <li><strong>Share:</strong> Use the generated link or QR code to promote your page.</li>
        </ul>
    )
};

const EditorLayout: React.FC<EditorLayoutProps> = ({ data, updateField, isPreviewMode, previewDevice = 'desktop' }) => {
  const portalType = data.type;
  const tabs = PAGE_TAB_CONFIG[portalType] || PAGE_TAB_CONFIG['product'];
  
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset active tab if portal type changes
  useEffect(() => {
      setActiveTabId(tabs[0].id);
  }, [portalType]);

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

  // --- CONTEXT-AWARE DISPATCHER ---
  const renderContent = () => {
      // 1. SHARED GLOBAL COMPONENTS (Used across multiple portals)
      switch (activeTabId) {
          case 'PKG_BASICS':
          case 'PAGE_BASICS':
          case 'HEADLINE_MSG':
          case 'PROFILE_ID':
              return <MetaForm data={data} onChange={updateField} />;
          
          case 'DESIGN':
          case 'DESIGN_PREVIEW':
          case 'DESIGN_BRANDING':
          case 'SETTINGS_PREVIEW':
              return <ThemeSelector data={data} onChange={updateField} previewDevice={previewDevice} />;

          case 'PUBLISH':
          case 'PREVIEW_PUBLISH':
              return <PublishShare data={data} onChange={updateField} />;

          case 'CTA_SETUP':
          case 'WHATSAPP_SETUP':
          case 'SPONSOR_SETUP':
              return <CTAConfiguration data={data} onChange={updateField} />;
          
          case 'CHECKOUT':
              return <CheckoutConfiguration data={data} onChange={updateField} />;
      }

      // 2. PRODUCT SALES PORTAL (Only these tabs render specific editors)
      if (portalType === 'product') {
          switch (activeTabId) {
              case 'PRODUCTS':
                  return <ProductSectionEditor data={data} onChange={updateField} />;
              case 'CONTENT':
                  return <PageContentEditor data={data} onChange={updateField} />;
              case 'TRUST_PROOF':
                  return <TrustProofEditor data={data} onChange={updateField} />;
          }
      }

      // 3. FALLBACK TO PLACEHOLDERS (For all other portal-specific tabs not yet built)
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
  const activeLabel = activeTab?.label;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 w-full max-w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Scrollable Tabs Header */}
      <div className="shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 sticky top-0 relative group">
        
        {/* Left Scroll Button */}
        <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-start pl-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-colors">
                <ChevronLeft size={18} strokeWidth={2.5} />
            </div>
        </button>

        <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar py-3 px-4 gap-2 scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-200 dark:bg-white dark:text-slate-900 scale-105' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-end pr-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-colors">
                <ChevronRight size={18} strokeWidth={2.5} />
            </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-fade-in w-full">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden w-full">
                {/* Header with Title and Optional Info Icon */}
                <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                        <ActiveIcon size={20} className="text-emerald-500" />
                        {activeLabel}
                    </h2>
                    
                    {TAB_HELP_CONTENT[activeTabId] && (
                        <InfoPopover 
                            title={`${activeLabel} Help`} 
                            description={TAB_HELP_CONTENT[activeTabId]} 
                        />
                    )}
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
