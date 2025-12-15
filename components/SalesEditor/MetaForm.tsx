
import React from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';

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
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
            <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Page Title <span className="text-red-500">*</span></label>
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
          className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl bg-white text-sm md:text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
        />
        <p className="text-[10px] text-slate-400 mt-1 dark:text-slate-500">Keep it punchy. This is your main headline.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
            <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Short Subtitle</label>
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
          className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl bg-white text-sm md:text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Store Currency</label>
            <select 
                value={data.currency}
                onChange={(e) => onChange('currency', e.target.value as CurrencyCode)}
                className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl bg-white text-sm md:text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
                {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">URL Slug</label>
            <div className="flex items-center">
            <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 md:py-3 text-slate-500 text-xs md:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400">fbo.com/p/</span>
            <input 
                type="text" 
                value={data.slug}
                onChange={handleSlugChange}
                maxLength={50}
                className="flex-1 p-2.5 md:p-3 border border-slate-200 rounded-r-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-xs md:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
