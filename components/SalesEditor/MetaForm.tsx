
import React from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';

interface MetaFormProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const MetaForm: React.FC<MetaFormProps> = ({ data, onChange }) => {
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onChange('title', title);
    // Auto-generate slug if it's empty or looks like a default draft slug
    if (!data.slug || data.slug.startsWith('draft-')) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      onChange('slug', slug.slice(0, 50)); // Enforce slug limit logic
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow safe URL characters
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange('slug', val);
  };

  const currencies: {code: CurrencyCode, name: string}[] = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'GHS', name: 'Ghana Cedi (₵)' },
    { code: 'NGN', name: 'Nigerian Naira (₦)' },
    { code: 'ZAR', name: 'South African Rand (R)' },
    { code: 'KES', name: 'Kenyan Shilling (KSh)' },
    { code: 'TZS', name: 'Tanzanian Shilling (TSh)' },
    { code: 'UGX', name: 'Ugandan Shilling (USh)' },
    { code: 'AED', name: 'UAE Dirham (AED)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'PHP', name: 'Philippine Peso (₱)' },
    { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
            <label className={LABEL_STYLE}>Page Title <span className="text-red-500">*</span></label>
            <span className={`text-[10px] font-bold ${data.title.length >= 70 ? 'text-red-500' : 'text-slate-400'}`}>
                {data.title.length}/70
            </span>
        </div>
        <input 
          type="text" 
          value={data.title}
          onChange={handleTitleChange}
          maxLength={70}
          placeholder="e.g. 9-Day Detox Challenge"
          className={INPUT_STYLE}
        />
        <p className="text-[10px] text-slate-400 mt-1 dark:text-slate-500">Keep it punchy. This is your main headline.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
            <label className={LABEL_STYLE}>Short Subtitle</label>
            <span className={`text-[10px] font-bold ${data.subtitle.length >= 120 ? 'text-red-500' : 'text-slate-400'}`}>
                {data.subtitle.length}/120
            </span>
        </div>
        <input 
          type="text" 
          value={data.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
          maxLength={120}
          placeholder="e.g. Reset your body and mind in just 9 days."
          className={INPUT_STYLE}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className={LABEL_STYLE}>Store Currency</label>
            <select 
                value={data.currency}
                onChange={(e) => onChange('currency', e.target.value as CurrencyCode)}
                className={INPUT_STYLE}
            >
                {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className={LABEL_STYLE}>URL Slug</label>
            <div className="flex items-center">
            <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl px-3 py-3 text-slate-500 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">fbo.com/p/</span>
            <input 
                type="text" 
                value={data.slug}
                onChange={handleSlugChange}
                maxLength={50}
                className={`flex-1 rounded-r-xl rounded-l-none ${INPUT_STYLE}`}
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
