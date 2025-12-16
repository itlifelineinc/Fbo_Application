
import React from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import { Plus, Trash2, Link as LinkIcon, Palette, MousePointerClick } from 'lucide-react';

interface CTAButtonsEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const CTAButtonsEditor: React.FC<CTAButtonsEditorProps> = ({ data, onChange }) => {
  
  const addCTA = () => {
    const newCTA: CTAButton = {
      id: `cta-${Date.now()}`,
      label: 'Order Now',
      actionType: 'SCROLL',
      style: 'primary',
      url: '#products',
      color: data.themeColor,
      icon: 'shopping-cart'
    };
    onChange('ctas', [...(data.ctas || []), newCTA]);
  };

  const updateCTA = (index: number, field: keyof CTAButton, value: any) => {
    const newCTAs = [...data.ctas];
    newCTAs[index] = { ...newCTAs[index], [field]: value };
    onChange('ctas', newCTAs);
  };

  const removeCTA = (index: number) => {
    const newCTAs = [...data.ctas];
    newCTAs.splice(index, 1);
    onChange('ctas', newCTAs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Call to Action Buttons</label>
        <button onClick={addCTA} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded dark:text-emerald-400 dark:hover:bg-emerald-900/30">
          <Plus size={14} /> Add Button
        </button>
      </div>

      <div className="space-y-3">
        {(data.ctas || []).map((cta, idx) => (
          <div key={cta.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative group transition-all hover:border-emerald-300 dark:bg-slate-800 dark:border-slate-700">
            <button 
                onClick={() => removeCTA(idx)}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 z-10 p-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600"
            >
                <Trash2 size={14} />
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Label</label>
                    <input 
                        type="text" 
                        value={cta.label}
                        onChange={(e) => updateCTA(idx, 'label', e.target.value)}
                        maxLength={25}
                        placeholder="e.g. Buy Now (Max 25)"
                        className="w-full text-sm font-bold bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Style</label>
                    <select 
                        value={cta.style}
                        onChange={(e) => updateCTA(idx, 'style', e.target.value)}
                        className="w-full text-sm bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="primary">Solid (Primary)</option>
                        <option value="outline">Outline</option>
                        <option value="link">Link Text</option>
                    </select>
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <LinkIcon size={10} /> Link Destination
                    </label>
                    <input 
                        type="text" 
                        value={cta.url}
                        onChange={(e) => updateCTA(idx, 'url', e.target.value)}
                        placeholder="#products, https://wa.me/..."
                        className="w-full text-sm bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none placeholder-slate-400 font-mono text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
                    />
                </div>

                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mt-1">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Color</label>
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer dark:border-slate-600">
                            <input 
                                type="color" 
                                value={cta.color || data.themeColor}
                                onChange={(e) => updateCTA(idx, 'color', e.target.value)}
                                className="absolute -top-2 -left-2 w-12 h-12 p-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full sm:w-auto">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Icon</label>
                        <select 
                            value={cta.icon || ''}
                            onChange={(e) => updateCTA(idx, 'icon', e.target.value)}
                            className="w-full text-xs bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            <option value="">None</option>
                            <option value="shopping-cart">Shopping Cart</option>
                            <option value="arrow-right">Arrow Right</option>
                            <option value="check">Checkmark</option>
                            <option value="whatsapp">WhatsApp</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTAButtonsEditor;
