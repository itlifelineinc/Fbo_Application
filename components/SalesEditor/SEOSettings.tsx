
import React, { useMemo } from 'react';
import { SalesPage } from '../../types/salesPage';
import { Search, Image as ImageIcon, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SEOSettingsProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  pages: SalesPage[];
}

const SEOSettings: React.FC<SEOSettingsProps> = ({ data, onChange, pages }) => {
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange('slug', val);
  };

  const handleSEOChange = (field: keyof SalesPage['seo'], value: string) => {
    onChange('seo', { ...data.seo, [field]: value });
  };

  const handleOGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleSEOChange('ogImage', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isSlugTaken = useMemo(() => {
    if (!data.slug) return false;
    return pages.some(p => p.slug === data.slug && p.id !== data.id);
  }, [data.slug, data.id, pages]);

  // SEO Score Calculation
  const seoScore = useMemo(() => {
    let score = 0;
    const { metaTitle, metaDescription, ogImage } = data.seo;
    
    if (metaTitle && metaTitle.length >= 30 && metaTitle.length <= 60) score += 30;
    else if (metaTitle) score += 10;

    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 30;
    else if (metaDescription) score += 10;

    if (ogImage) score += 20;
    if (data.slug && !isSlugTaken) score += 20;

    return Math.min(100, score);
  }, [data.seo, data.slug, isSlugTaken]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-emerald-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-emerald-800 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Score Indicator */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${getScoreColor(seoScore)}`}>
        <div className="flex items-center gap-3">
            <div className="font-bold text-2xl">{seoScore}/100</div>
            <div className="text-sm font-medium">
                {seoScore >= 80 ? 'Excellent Optimization' : seoScore >= 50 ? 'Needs Improvement' : 'Poor Optimization'}
            </div>
        </div>
        {seoScore >= 80 ? <CheckCircle /> : <AlertTriangle />}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">URL Slug</label>
        <div className="relative">
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-3 text-slate-500 text-[10px] font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400">app.nexu.com/p/</span>
              <input 
                type="text" 
                value={data.slug}
                onChange={handleSlugChange}
                className={`flex-1 p-3 border border-slate-200 rounded-r-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10 ${isSlugTaken ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="absolute right-3 top-[14px]">
                {data.slug && !isSlugTaken && <CheckCircle size={16} className="text-emerald-500" />}
                {isSlugTaken && <XCircle size={16} className="text-red-500" />}
            </div>
        </div>
        {isSlugTaken && <p className="text-[10px] text-red-500 mt-1 font-bold">This link name is already taken.</p>}
        <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Auto-formatted from page title if empty.</p>
      </div>

      <div className="space-y-3">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Meta Title</label>
            <input 
              type="text" 
              value={data.seo.metaTitle}
              onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
              placeholder={data.title}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <div className="flex justify-between text-xs mt-1">
                <span className={data.seo.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}>{data.seo.metaTitle.length} / 60 characters</span>
                {data.seo.metaTitle.length < 30 && <span className="text-yellow-600 dark:text-yellow-500">Too short</span>}
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Meta Description</label>
            <textarea 
              value={data.seo.metaDescription}
              onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <div className="flex justify-between text-xs mt-1">
                <span className={data.seo.metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}>{data.seo.metaDescription.length} / 160 characters</span>
                {data.seo.metaDescription.length < 120 && <span className="text-yellow-600 dark:text-yellow-500">Ideally 120+ chars</span>}
            </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Social Share Image (OG)</label>
        <div className="flex items-center gap-4">
            <div className="w-32 h-20 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0 dark:bg-slate-700 dark:border-slate-600">
                {data.seo.ogImage ? (
                    <img src={data.seo.ogImage} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="text-slate-400 dark:text-slate-500" />
                )}
            </div>
            <div className="flex-1">
                <input 
                    type="file" 
                    id="og-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleOGUpload}
                />
                <label 
                    htmlFor="og-upload"
                    className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                    Upload Image
                </label>
                <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Recommended: 1200x630px</p>
            </div>
        </div>
      </div>

      {/* Keyword Suggestions Mockup */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1 dark:text-slate-400"><Search size={12}/> Keywords Detected</h4>
        <div className="flex flex-wrap gap-2">
            {data.title && data.title.split(' ').map((word, i) => (
                word.length > 3 && <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">{word}</span>
            ))}
            <span className="text-xs text-slate-400 italic dark:text-slate-500">...based on title</span>
        </div>
      </div>

    </div>
  );
};

export default SEOSettings;
