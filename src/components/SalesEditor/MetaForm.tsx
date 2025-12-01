
import React from 'react';
import { SalesPage } from '../../types/salesPage';

interface MetaFormProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const MetaForm: React.FC<MetaFormProps> = ({ data, onChange }) => {
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onChange('title', title);
    // Auto-generate slug if it's empty or looks like a default draft slug
    if (!data.slug || data.slug.startsWith('draft-')) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      onChange('slug', slug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow safe URL characters
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange('slug', val);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Page Title <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={data.title}
          onChange={handleTitleChange}
          placeholder="e.g. 9-Day Detox Challenge"
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Short Subtitle</label>
        <input 
          type="text" 
          value={data.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
          placeholder="e.g. Reset your body and mind in just 9 days."
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
        <div className="flex items-center">
          <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-3 text-slate-500 text-sm">fbo.com/p/</span>
          <input 
            type="text" 
            value={data.slug}
            onChange={handleSlugChange}
            className="flex-1 p-3 border border-slate-200 rounded-r-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
