import React, { useState } from 'react';
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
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EditorLayoutProps {
  data: SalesPage;
  updateField: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  isPreviewMode: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ data, updateField, isPreviewMode }) => {
  if (isPreviewMode) return null;

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6 space-y-4 pb-24 dark:bg-slate-900 no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <Section title="1. Page Details" defaultOpen>
        <MetaForm data={data} onChange={updateField} />
      </Section>

      <Section title="2. Design & Theme">
        <ThemeSelector data={data} onChange={updateField} />
      </Section>

      <Section title="3. Hero & Visuals">
        <MediaUploader data={data} onChange={updateField} />
      </Section>

      <Section title="4. Products">
        <ProductSectionEditor data={data} onChange={updateField} />
      </Section>

      <Section title="5. Packages & Bundles">
        <PackageSectionEditor data={data} onChange={updateField} />
      </Section>

      <Section title="6. Content & Copy">
        <RichTextEditor value={data.description} onChange={(val) => updateField('description', val)} />
        <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-700">
          <FeaturesList data={data} onChange={updateField} />
        </div>
      </Section>

      <Section title="7. Call to Action">
        <CTAButtonsEditor data={data} onChange={updateField} />
      </Section>

      <Section title="8. Social Proof">
        <TestimonialsEditor data={data} onChange={updateField} />
      </Section>

      <Section title="9. Contact & Legal">
        <ContactSettings data={data} onChange={updateField} />
      </Section>

      <Section title="10. SEO Settings">
        <SEOSettings data={data} onChange={updateField} />
      </Section>
    </div>
  );
};

const Section: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200 dark:bg-slate-800 dark:border-slate-700">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-700 font-heading flex justify-between items-center hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
        >
            <span>{title}</span>
            {isOpen ? <ChevronUp size={18} className="text-slate-400 dark:text-slate-500" /> : <ChevronDown size={18} className="text-slate-400 dark:text-slate-500" />}
        </button>
        {isOpen && (
            <div className="p-6 animate-fade-in dark:text-slate-200">
                {children}
            </div>
        )}
    </div>
  );
};

export default EditorLayout;