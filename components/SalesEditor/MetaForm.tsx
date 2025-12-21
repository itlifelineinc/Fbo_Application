
import React, { useMemo, useRef } from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';
import CustomSelect from '../Shared/CustomSelect';
import { CheckCircle, XCircle, Users, Globe, Image as ImageIcon, Camera } from 'lucide-react';

interface MetaFormProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  pages: SalesPage[];
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const AUDIENCE_OPTIONS = [
  'Adults', 'Women', 'Men', 'Busy Professionals', 'General Public', 'Seniors', 'Parents'
];

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Twi', label: 'Twi' },
  { value: 'Hausa', label: 'Hausa' },
  { value: 'Swahili', label: 'Swahili' },
];

const MetaForm: React.FC<MetaFormProps> = ({ data, onChange, pages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onChange('title', title);
    if (!data.slug || data.slug.startsWith('sp_')) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      onChange('slug', slug.slice(0, 50));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange('slug', val);
  };

  const isSlugTaken = useMemo(() => {
    if (!data.slug) return false;
    return pages.some(p => p.slug === data.slug && p.id !== data.id);
  }, [data.slug, data.id, pages]);

  const toggleAudience = (aud: string) => {
    const current = data.targetAudience || [];
    const next = current.includes(aud) 
      ? current.filter(a => a !== aud) 
      : [...current, aud];
    onChange('targetAudience', next);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange('heroImage', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
  ];

  const isProblemSolver = data.type === 'problem';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Featured Image - Top for Problem Solver */}
      {isProblemSolver && (
          <div>
              <label className={LABEL_STYLE}>Featured Cover Image</label>
              <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group dark:bg-slate-800 dark:border-slate-700"
              >
                  {data.heroImage ? (
                      <>
                          <img src={data.heroImage} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="text-white" size={24} />
                          </div>
                      </>
                  ) : (
                      <div className="text-center text-slate-400">
                          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <span className="text-xs font-bold uppercase tracking-wider">Tap to upload cover</span>
                      </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
          </div>
      )}

      {/* Main Identity */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex justify-between items-center mb-1">
              <label className={LABEL_STYLE}>Page Title</label>
              <span className={`text-[10px] font-bold ${data.title.length >= 70 ? 'text-red-500' : 'text-slate-400'}`}>
                  {data.title.length}/70
              </span>
          </div>
          <input 
            type="text" 
            value={data.title}
            onChange={handleTitleChange}
            maxLength={70}
            placeholder={isProblemSolver ? "e.g. How to Manage Ulcer Naturally" : "Page Title"}
            className={INPUT_STYLE}
          />
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
            placeholder={isProblemSolver ? "e.g. Simple lifestyle and nutrition approaches that support digestive health" : "Short subtitle"}
            className={INPUT_STYLE}
          />
        </div>
      </div>

      {/* Logic & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
              <label className={LABEL_STYLE}>Page URL / Slug</label>
              <div className="relative">
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl px-3 py-3 text-slate-500 text-[10px] font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">app.nexu.com/p/</span>
                    <input 
                        type="text" 
                        value={data.slug}
                        onChange={handleSlugChange}
                        maxLength={50}
                        className={`flex-1 rounded-r-xl rounded-l-none ${INPUT_STYLE} pr-10 ${isSlugTaken ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <div className="absolute right-3 top-[14px]">
                      {data.slug && !isSlugTaken && <CheckCircle size={16} className="text-emerald-500" />}
                      {isSlugTaken && <XCircle size={16} className="text-red-500" />}
                  </div>
              </div>
          </div>

          <CustomSelect 
              label="Page Language"
              value={data.language || 'English'}
              options={LANGUAGE_OPTIONS}
              onChange={(val) => onChange('language', val)}
          />
      </div>

      {/* Target Audience Selector */}
      {isProblemSolver && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className={LABEL_STYLE}><Users size={12} className="inline mr-1" /> Target Audience</label>
              <div className="flex flex-wrap gap-2 mt-3">
                  {AUDIENCE_OPTIONS.map(opt => {
                      const isActive = (data.targetAudience || []).includes(opt);
                      return (
                          <button
                              key={opt}
                              onClick={() => toggleAudience(opt)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                                  isActive 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
                              }`}
                          >
                              {opt}
                          </button>
                      );
                  })}
              </div>
          </div>
      )}

      {!isProblemSolver && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <CustomSelect 
                    label="Store Currency"
                    value={data.currency}
                    options={currencyOptions}
                    onChange={(val) => onChange('currency', val as CurrencyCode)}
                    placeholder="Select Currency"
                />
          </div>
      )}
    </div>
  );
};

export default MetaForm;
