
import React from 'react';
import { SalesPage } from '../../../types/salesPage';
import { Sparkles, Construction } from 'lucide-react';

interface PlaceholderProps {
    data: SalesPage;
    theme: string;
    type: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ data, theme, type }) => (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 dark:bg-slate-900 p-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
            <Construction size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Coming Soon</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
            You've selected the <span className="font-bold text-emerald-600">{theme}</span> template for 
            <span className="font-bold text-blue-600"> {type}</span>. 
            This UI is currently being polished and will be available shortly!
        </p>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 w-full max-w-xs">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Previewing</p>
            <p className="font-bold text-slate-800 dark:text-white">{data.title || 'Untitled Page'}</p>
        </div>
    </div>
);

export default Placeholder;
