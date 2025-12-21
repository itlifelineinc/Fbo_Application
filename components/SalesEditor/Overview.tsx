
import React from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';
import { Plus, Globe, Calendar, Trash2, ChevronDown, ExternalLink } from 'lucide-react';

interface OverviewProps {
  pages: SalesPage[];
  activePageId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onUpdateCurrency: (id: string, currency: CurrencyCode) => void;
  onUpdateField: <K extends keyof SalesPage>(id: string, field: K, value: SalesPage[K]) => void;
  onTogglePreview: () => void;
}

const CURRENCIES = [
    { value: 'USD', label: 'USD ($)', flag: '🇺🇸' },
    { value: 'GHS', label: 'GHS (₵)', flag: '🇬🇭' },
    { value: 'NGN', label: 'NGN (₦)', flag: '🇳🇬' },
    { value: 'GBP', label: 'GBP (£)', flag: '🇬🇧' },
    { value: 'EUR', label: 'EUR (€)', flag: '🇪🇺' },
];

const Overview: React.FC<OverviewProps> = ({ 
    pages, 
    activePageId, 
    onSelect, 
    onCreate, 
    onDelete, 
    onUpdateCurrency,
    onUpdateField,
    onTogglePreview
}) => {

  const handleOpenPreview = (id: string) => {
      onSelect(id);
      // Small delay to ensure state propagates to the preview panel before showing it
      setTimeout(() => {
          onTogglePreview();
      }, 50);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          // Updated URL structure
          const liveUrl = `app.nexu.com/p/${page.slug || 'untitled'}`;
          
          // Logic: If draft, metrics are zero. Otherwise use real data.
          const views = page.isPublished ? (page.views || 0) : 0;
          const leads = page.isPublished ? (page.leads || 0) : 0;
          const sales = page.isPublished ? (page.sales || 0) : 0;

          return (
            <div 
              key={page.id} 
              className={`group bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${isActive ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500' : 'border-slate-100 hover:border-emerald-200 dark:border-slate-700 shadow-sm'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    {/* Editable Title */}
                    <input 
                        type="text"
                        value={page.title}
                        onChange={(e) => onUpdateField(page.id, 'title', e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-extrabold text-slate-900 dark:text-white leading-tight focus:ring-0 placeholder-slate-400 text-base"
                        placeholder="Internal Page Name"
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${page.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                            {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Calendar size={10} /> {new Date(page.lastSavedAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                  
                  {/* Quick Currency Picker */}
                  <div className="relative group/curr">
                    <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-700 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                        {page.currency} <ChevronDown size={10} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden hidden group-hover/curr:block z-50 min-w-[100px]">
                        {CURRENCIES.map(c => (
                            <button 
                                key={c.value}
                                onClick={(e) => { e.stopPropagation(); onUpdateCurrency(page.id, c.value as CurrencyCode); }}
                                className="w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                                {c.flag} {c.value}
                            </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Clickable URL to Preview */}
                <button 
                    onClick={() => handleOpenPreview(page.id)}
                    className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 hover:border-emerald-300 transition-colors dark:border-slate-800 mb-4 text-left overflow-hidden group/link"
                >
                    <Globe size={12} className="text-slate-400 shrink-0 group-hover/link:text-emerald-500" />
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate flex-1 group-hover/link:text-emerald-600">{liveUrl}</span>
                    <ExternalLink size={10} className="text-slate-300 group-hover/link:text-emerald-500" />
                </button>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Views</p>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{views}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Leads</p>
                        <p className={`text-sm font-black ${leads > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{leads}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Sales</p>
                        <p className={`text-sm font-black ${sales > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{sales}</p>
                    </div>
                </div>
              </div>

              <div className="flex gap-2">
                  <button 
                    onClick={() => onSelect(page.id)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {isActive ? 'Currently Editing' : 'Continue Editing'}
                  </button>
                  <button 
                    onClick={() => onDelete(page.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100 dark:bg-red-900/20 dark:border-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
              </div>
            </div>
          );
        })}

        {/* Create Card */}
        <button 
            onClick={onCreate}
            className="h-full min-h-[180px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-3 group dark:border-slate-700 dark:hover:bg-slate-800"
        >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all dark:bg-slate-700">
                <Plus size={24} />
            </div>
            <div className="text-center">
                <p className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">Create New Page</p>
                <p className="text-[10px] text-slate-400 mt-1">Start from a template</p>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Overview;
