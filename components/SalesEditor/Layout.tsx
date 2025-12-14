
import React, { useState, useRef, useEffect } from 'react';
import { SalesPage } from '../../types/salesPage';
import MetaForm from './MetaForm';
import MediaUploader from './MediaUploader';
import RichTextEditor from './RichTextEditor';
import ProductSectionEditor from './ProductSectionEditor';
import PackageSectionEditor from './PackageSectionEditor';
import FeaturesList from './FeaturesList';
import TestimonialsEditor from './TestimonialsEditor';
import ContactSettings from './ContactSettings';
import ThemeSelector from './ThemeSelector';
import CTAButtonsEditor from './CTAButtonsEditor';
import SEOSettings from './SEOSettings';
import { PAGE_TAB_CONFIG, PlaceholderTab } from './TabConfiguration';
import { Type, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorLayoutProps {
  data: SalesPage;
  updateField: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  isPreviewMode: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ data, updateField, isPreviewMode }) => {
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
          // --- PRODUCT SALES TYPE ---
          case 'OVERVIEW':
              return <MetaForm data={data} onChange={updateField} />;
          case 'PRODUCTS':
              return <ProductSectionEditor data={data} onChange={updateField} />;
          case 'CONTENT':
              return (
                  <div className="space-y-8">
                      <RichTextEditor value={data.description} onChange={(val) => updateField('description', val)} />
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                          <FeaturesList data={data} onChange={updateField} />
                      </div>
                  </div>
              );
          case 'DESIGN':
              return <ThemeSelector data={data} onChange={updateField} />;
          case 'TRUST_PROOF':
          case 'PROOF': // Problem Solver
          case 'TRUST_BUILDER': // Bundle
              return <TestimonialsEditor data={data} onChange={updateField} />;
          case 'CTA_SETUP':
              return (
                  <div className="space-y-8">
                      <ContactSettings data={data} onChange={updateField} />
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                          <CTAButtonsEditor data={data} onChange={updateField} />
                      </div>
                  </div>
              );
          
          // --- BUNDLE TYPE ---
          case 'PKG_BASICS':
              return <MetaForm data={data} onChange={updateField} />;
          case 'PKG_PRODUCTS':
              return (
                  <div className="space-y-8">
                      <ProductSectionEditor data={data} onChange={updateField} />
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                          <PackageSectionEditor data={data} onChange={updateField} />
                      </div>
                  </div>
              );
          
          // --- PROBLEM SOLVER TYPE ---
          case 'PAGE_BASICS':
              return <MetaForm data={data} onChange={updateField} />;
          case 'SOLUTION':
              return <ProductSectionEditor data={data} onChange={updateField} />;

          // --- GENERIC / NEW FEATURES (Placeholders) ---
          case 'CHECKOUT':
          case 'PUBLISH':
          case 'EDUCATION':
          case 'PRICING':
          case 'PROBLEM_EDU':
          case 'MISTAKES':
          case 'LIFESTYLE':
          case 'COMPLIANCE':
              return <PlaceholderTab label={tabs.find(t => t.id === activeTabId)?.label || 'Feature'} />;
          
          default:
              return <PlaceholderTab label="Under Construction" />;
      }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTabId)?.icon || Type;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
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
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
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
      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-heading border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                    <ActiveIcon size={20} className="text-emerald-500" />
                    {tabs.find(t => t.id === activeTabId)?.label} Settings
                </h2>
                
                <div className="min-h-[300px]">
                    {renderContent()}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
