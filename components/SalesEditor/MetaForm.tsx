
import React, { useMemo } from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';
import CustomSelect from '../Shared/CustomSelect';
import { CheckCircle, XCircle } from 'lucide-react';

interface MetaFormProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  pages: SalesPage[];
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const MetaForm: React.FC<MetaFormProps> = ({ data, onChange, pages }) => {
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onChange('title', title);
    // Auto-generate slug if it's empty or looks like a default draft slug
    if (!data.slug || data.slug.startsWith('sp_')) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      onChange('slug', slug.slice(0, 50));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow safe URL characters
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange('slug', val);
  };

  const isSlugTaken = useMemo(() => {
    if (!data.slug) return false;
    return pages.some(p => p.slug === data.slug && p.id !== data.id);
  }, [data.slug, data.id, pages]);

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar ($)' },
    { value: 'EUR', label: 'EUR - Euro (€)' },
    { value: 'GBP', label: 'GBP - British Pound (£)' },
    { value: 'GHS', label: 'GHS - Ghana Cedi (₵)' },
    { value: 'NGN', label: 'NGN - Nigerian Naira (₦)' },
    { value: 'ZAR', label: 'ZAR - South African Rand (R)' },
    { value: 'KES', label: 'KES - Kenyan Shilling (KSh)' },
    { value: 'TZS', label: 'TZS - Tanzanian Shilling (TSh)' },
    { value: 'UGX', label: 'UGX - Ugandan Shilling (USh)' },
    { value: 'AED', label: 'AED - UAE Dirham (AED)' },
    { value: 'INR', label: 'INR - Indian Rupee (₹)' },
    { value: 'CAD', label: 'CAD - Canadian Dollar (C$)' },
    { value: 'AUD', label: 'AUD - Australian Dollar (A$)' },
    { value: 'PHP', label: 'PHP - Philippine Peso (₱)' },
    { value: 'MYR', label: 'MYR - Malaysian Ringgit (RM)' },
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
            <CustomSelect 
                label="Store Currency"
                value={data.currency}
                options={currencyOptions}
                onChange={(val) => onChange('currency', val as CurrencyCode)}
                placeholder="Select Currency"
            />
        </div>

        <div>
            <label className={LABEL_STYLE}>URL Slug</label>
            <div className="relative">
                <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl px-3 py-3 text-slate-500 text-[10px] font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">app.nexu.com/p/</span>
                <input 
                    type="text" 
                    value={data.slug}
                    onChange={handleSlugChange}
                    maxLength={50}
                    className={`flex-1 rounded-r-xl rounded-l-none ${INPUT_STYLE} pr-10 ${isSlugTaken ? 'border-red-500 focus:border-red-600' : ''}`}
                />
                </div>
                <div className="absolute right-3 top-[14px]">
                    {data.slug && !isSlugTaken && <CheckCircle size={16} className="text-emerald-500" />}
                    {isSlugTaken && <XCircle size={16} className="text-red-500" />}
                </div>
            </div>
            {isSlugTaken && <p className="text-[10px] text-red-500 mt-1 font-bold">This link is already taken. Try a different name.</p>}
            {!isSlugTaken && data.slug && <p className="text-[10px] text-emerald-600 mt-1 font-bold uppercase tracking-wider">Link is available!</p>}
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
