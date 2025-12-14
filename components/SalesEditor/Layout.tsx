
import React, { useState, useRef } from 'react';
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
import { Layout, Type, Image as ImageIcon, ShoppingBag, Package, FileText, MousePointerClick, Star, Phone, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditorLayoutProps {
  data: SalesPage;
  updateField: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  isPreviewMode: boolean;
}

type TabId = 'DETAILS' | 'THEME' | 'MEDIA' | 'PRODUCTS' | 'PACKAGES' | 'CONTENT' | 'CTA' | 'SOCIAL' | 'CONTACT' | 'SEO';

const EditorLayout: React.FC<EditorLayoutProps> = ({ data, updateField, isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<TabId>('DETAILS');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'DETAILS', label: 'Details', icon: Type },
    { id: 'THEME', label: 'Theme', icon: Layout },
    { id: 'MEDIA', label: 'Visuals', icon: ImageIcon },
    { id: 'PRODUCTS', label: 'Products', icon: ShoppingBag },
    { id: 'PACKAGES', label: 'Bundles', icon: Package },
    { id: 'CONTENT', label: 'Content', icon: FileText },
    { id: 'CTA', label: 'Actions', icon: MousePointerClick },
    { id: 'SOCIAL', label: 'Reviews', icon: Star },
    { id: 'CONTACT', label: 'Contact', icon: Phone },
    { id: 'SEO', label: 'SEO', icon: Search },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
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
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                    {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Type, { size: 20, className: "text-emerald-500" })}
                    {tabs.find(t => t.id === activeTab)?.label} Settings
                </h2>
                
                <div className="min-h-[300px]">
                    {activeTab === 'DETAILS' && <MetaForm data={data} onChange={updateField} />}
                    {activeTab === 'THEME' && <ThemeSelector data={data} onChange={updateField} />}
                    {activeTab === 'MEDIA' && <MediaUploader data={data} onChange={updateField} />}
                    {activeTab === 'PRODUCTS' && <ProductSectionEditor data={data} onChange={updateField} />}
                    {activeTab === 'PACKAGES' && <PackageSectionEditor data={data} onChange={updateField} />}
                    {activeTab === 'CONTENT' && (
                        <div className="space-y-8">
                            <RichTextEditor value={data.description} onChange={(val) => updateField('description', val)} />
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <FeaturesList data={data} onChange={updateField} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'CTA' && <CTAButtonsEditor data={data} onChange={updateField} />}
                    {activeTab === 'SOCIAL' && <TestimonialsEditor data={data} onChange={updateField} />}
                    {activeTab === 'CONTACT' && <ContactSettings data={data} onChange={updateField} />}
                    {activeTab === 'SEO' && <SEOSettings data={data} onChange={updateField} />}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
