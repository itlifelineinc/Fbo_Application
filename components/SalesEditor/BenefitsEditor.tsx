
import React from 'react';
import { Plus, X, CheckCircle, Leaf, Heart, Zap, Star } from 'lucide-react';

interface BenefitsEditorProps {
  benefits: string[];
  onChange: (newBenefits: string[]) => void;
}

const BenefitsEditor: React.FC<BenefitsEditorProps> = ({ benefits, onChange }) => {
  
  const addBenefit = () => {
    onChange([...benefits, '']);
  };

  const updateBenefit = (index: number, val: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = val;
    onChange(newBenefits);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    onChange(newBenefits);
  };

  // Icon options could be expanded in future, utilizing a random or selectable logic. 
  // For now, we cycle them visually for the editor to show variety.
  const Icons = [CheckCircle, Leaf, Zap, Heart, Star];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Benefits Section</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Explain the value. Short bullet points work best.</p>
        </div>
        <button 
            onClick={addBenefit}
            className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
            <Plus size={14} /> Add Benefit
        </button>
      </div>

      <div className="space-y-3">
        {benefits.map((benefit, idx) => {
            const Icon = Icons[idx % Icons.length];
            return (
                <div key={idx} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 dark:bg-emerald-900/50 dark:text-emerald-400">
                        <Icon size={16} />
                    </div>
                    <input 
                        type="text" 
                        value={benefit}
                        onChange={(e) => updateBenefit(idx, e.target.value)}
                        placeholder="e.g. Supports healthy digestion"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    <button 
                        onClick={() => removeBenefit(idx)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            );
        })}
        {benefits.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-xs dark:border-slate-700 dark:bg-slate-900/20">
                No benefits added.
            </div>
        )}
      </div>
    </div>
  );
};

export default BenefitsEditor;
