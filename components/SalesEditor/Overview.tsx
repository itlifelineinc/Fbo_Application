
import React from 'react';
import { SalesPage, CurrencyCode } from '../../types/salesPage';
import { Plus, Edit2, Globe, Calendar, BarChart2, Eye, MessageCircle, ShoppingBag, Trash2, ChevronDown } from 'lucide-react';

interface OverviewProps {
  pages: SalesPage[];
  activePageId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onUpdateCurrency: (id: string, currency: CurrencyCode) => void;
}

const CURRENCIES = [
    { value: 'USD', label: 'USD ($)', flag: '🇺🇸' },
    { value: 'GHS', label: 'GHS (₵)', flag: '🇬🇭' },
    { value: 'NGN', label: 'NGN (₦)', flag: '🇳🇬' },
    { value: 'GBP', label: 'GBP (£)', flag: '🇬🇧' },
    { value: 'EUR', label: 'EUR (€)', flag: '🇪🇺' },
];

const Overview: React.FC<OverviewProps> = ({ pages, activePageId, onSelect, onCreate, onDelete, onUpdateCurrency }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          // Mock stats - in real app these come from backend
          const stats = { views: 120, leads: 15, sales: 3 };

          return (
            <div 
              key={page.id} 
              className={`group bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${isActive ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500' : 'border-slate-100 hover:border-slate-200 dark:border-slate-700 shadow-sm'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white leading-tight">{page.title || 'Untitled Page'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${page.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                            {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Calendar size={10} /> {new Date(page.lastSavedAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                  
                  {/* Currency Picker on Card */}
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

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mb-4">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">fbo.com/p/{page.slug || '...'}</span>
                </div>

                {/* Performance Snapshot */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Views</p>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{stats.views}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Leads</p>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">{stats.leads}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Sales</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{stats.sales}</p>
                    </div>
                </div>
              </div>

              <div className="flex gap-2">
                  <button 
                    onClick={() => onSelect(page.id)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <Edit2 size={12} /> {isActive ? 'Currently Editing' : 'Edit Details'}
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

        {/* Create New Card */}
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
