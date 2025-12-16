
import React, { useState, useRef, useEffect } from 'react';
import { SalesPage } from '../../types/salesPage';
import MetaForm from './MetaForm';
import MediaUploader from './MediaUploader';
import ProductSectionEditor from './ProductSectionEditor';
import PageContentEditor from './PageContentEditor'; 
import PackageSectionEditor from './PackageSectionEditor';
import TrustProofEditor from './TrustProofEditor'; 
import CTAConfiguration from './CTAConfiguration';
import CheckoutConfiguration from './CheckoutConfiguration'; 
import PublishShare from './PublishShare'; // NEW
import ThemeSelector from './ThemeSelector';
import ContactSettings from './ContactSettings';
import CTAButtonsEditor from './CTAButtonsEditor';
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
  // Get the tabs for the current page type
  const tabs = PAGE_TAB_CONFIG[data.type] || PAGE_TAB_CONFIG['product'];
  
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset active tab if type changes
  useEffect(() => {
      setActiveTabId(tabs[0].id);
  }, [data.type]);

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

  // Content Renderer Switch
  const renderContent = () => {
      switch (activeTabId) {
          // --- SHARED COMPONENTS / LOGIC ---
          case 'OVERVIEW':
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

          case 'CTA_SETUP':
          case 'WHATSAPP_SETUP':
          case 'SPONSOR_SETUP':
              return <CTAConfiguration data={data} onChange={updateField} />;

          // --- COMMERCE & CHECKOUT ---
          case 'CHECKOUT':
              return <CheckoutConfiguration data={data} onChange={updateField} />;

          // --- PRODUCT SALES TYPE ---
          case 'PRODUCTS':
              return <ProductSectionEditor data={data} onChange={updateField} />;
          case 'CONTENT':
              return <PageContentEditor data={data} onChange={updateField} />;
          
          case 'TRUST_PROOF':
          case 'PROOF': 
          case 'TRUST_BUILDER': 
          case 'SUCCESS_STORIES':
              return <TrustProofEditor data={data} onChange={updateField} />;
          
          // --- BUNDLE TYPE ---
          case 'PKG_PRODUCTS':
              return (
                  <div className="space-y-6 md:space-y-8">
                      <ProductSectionEditor data={data} onChange={updateField} />
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                          <PackageSectionEditor data={data} onChange={updateField} />
                      </div>
                  </div>
              );
          
          // --- PROBLEM SOLVER TYPE ---
          case 'SOLUTION':
              return <ProductSectionEditor data={data} onChange={updateField} />;

          // --- PERSONAL BRAND ---
          case 'MY_STORY':
              return <RichTextEditor value={data.description} onChange={(val) => updateField('description', val)} />;

          // --- PUBLISH ---
          case 'PUBLISH':
          case 'PREVIEW_PUBLISH':
              return <PublishShare data={data} onChange={updateField} />;

          // --- PLACEHOLDERS FOR SPECIFIC NEW FEATURES ---
          case 'EDUCATION':
          case 'PRICING':
          case 'PROBLEM_EDU':
          case 'MISTAKES':
          case 'LIFESTYLE':
          case 'COMPLIANCE':
          case 'EXPLANATION':
          case 'LEAD_FORM':
          case 'WHY_FOREVER':
          case 'CERTS_RANK':
          case 'HELP_WITH':
          case 'OFFERS_LINKS':
          case 'OPP_OVERVIEW':
          case 'BENEFITS':
          case 'GET_STARTED':
              return <PlaceholderTab label={tabs.find(t => t.id === activeTabId)?.label || 'Feature'} />;
          
          default:
              return <PlaceholderTab label="Under Construction" />;
      }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTabId)?.icon || Type;
  const activeLabel = tabs.find(t => t.id === activeTabId)?.label;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 w-full max-w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Scrollable Tabs Header */}
      <div className="shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 sticky top-0 relative group">
        
        {/* Left Scroll Button (Desktop) */}
        <button 
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-start pl-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll Left"
        >
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
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
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-200 dark:bg-white dark:text-slate-900 dark:shadow-none scale-105' 
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

        {/* Right Scroll Button (Desktop) */}
        <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 items-center justify-end pr-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll Right"
        >
            <div className="p-1.5 rounded-full bg-white shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
                <ChevronRight size={18} strokeWidth={2.5} />
            </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 animate-fade-in w-full">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden w-full">
                {/* Header with Title and Optional Info Icon */}
                <div className="mb-4 md:mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                        <ActiveIcon size={20} className="text-emerald-500" />
                        {activeLabel} Settings
                    </h2>
                    
                    {/* Info Icon in Top Right Corner */}
                    {TAB_HELP_CONTENT[activeTabId] && (
                        <InfoPopover 
                            title={`${activeLabel} Help`} 
                            description={TAB_HELP_CONTENT[activeTabId]} 
                        />
                    )}
                </div>
                
                {/* Content Wrapper with constrained width/overflow handling */}
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
