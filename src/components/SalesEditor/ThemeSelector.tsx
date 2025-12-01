
import React from 'react';
import { SalesPage, LayoutStyle } from '../../types/salesPage';
import { Layout, Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ data, onChange }) => {
  
  const colors = [
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#111827', // Gray
  ];

  const layouts: { id: LayoutStyle; label: string; desc: string }[] = [
    { id: 'modern', label: 'Modern', desc: 'Full width hero, clean grid' },
    { id: 'classic', label: 'Classic', desc: 'Centered, long-form copy' },
    { id: 'minimal', label: 'Minimal', desc: 'Product focus, no distractions' },
  ];

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Layout size={16} /> Layout Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onChange('layoutStyle', layout.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                data.layoutStyle === layout.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div className="font-bold text-slate-800 text-sm">{layout.label}</div>
              <div className="text-[10px] text-slate-500 mt-1">{layout.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Palette size={16} /> Color Theme
        </label>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onChange('themeColor', color)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                data.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {data.themeColor === color && <Check size={16} className="text-white" />}
            </button>
          ))}
          <div className="relative flex items-center">
             <input 
               type="color" 
               value={data.themeColor}
               onChange={(e) => onChange('themeColor', e.target.value)}
               className="w-10 h-10 rounded-full p-0 border-0 overflow-hidden cursor-pointer"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
