
import React from 'react';
import { SalesPage, LayoutStyle } from '../../types/salesPage';
import { Layout, Palette, Type, MoveVertical, Check, Lock, ChevronDown } from 'lucide-react';

interface ThemeSelectorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const FONTS_HEADING = ['Lexend', 'Josefin Sans', 'Noto Sans', 'Inter', 'Playfair Display'];
const FONTS_BODY = ['Noto Sans', 'Inter', 'Lato', 'Roboto', 'Open Sans'];

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#111827', // Gray
  '#000000', // Black
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ data, onChange }) => {
  
  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Theme Selection */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 dark:text-slate-300">
          <Layout size={16} /> Theme Layout
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Active Theme: Clean */}
          <button
            onClick={() => onChange('layoutStyle', 'clean')}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden group
              ${data.layoutStyle === 'clean' 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-500' 
                : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-white">Aa</div>
               {data.layoutStyle === 'clean' && <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Clean</div>
            <div className="text-[10px] text-slate-500 mt-1 dark:text-slate-400">Minimalist & Modern</div>
          </button>

          {/* Disabled Theme: Health */}
          <button disabled className="relative p-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute top-2 right-2"><Lock size={14} className="text-slate-400" /></div>
            <div className="w-8 h-8 rounded-full bg-slate-200 mb-2"></div>
            <div className="font-bold text-slate-400">Health</div>
            <div className="text-[10px] text-slate-400 mt-1">Coming Soon</div>
          </button>

          {/* Disabled Theme: Bold */}
          <button disabled className="relative p-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute top-2 right-2"><Lock size={14} className="text-slate-400" /></div>
            <div className="w-8 h-8 rounded-none bg-slate-900 mb-2"></div>
            <div className="font-bold text-slate-400">Bold</div>
            <div className="text-[10px] text-slate-400 mt-1">Coming Soon</div>
          </button>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 2. Brand Colors */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 dark:text-slate-300">
          <Palette size={16} /> Brand Colors
        </label>
        
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                    key={color}
                    onClick={() => onChange('themeColor', color)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-slate-100 dark:border-slate-700 ${
                        data.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    >
                    {data.themeColor === color && <Check size={14} className="text-white" />}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div 
                    className="w-8 h-8 rounded-lg shadow-sm border border-slate-200 shrink-0"
                    style={{ backgroundColor: data.themeColor }}
                ></div>
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Custom Hex</p>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400">#</span>
                        <input 
                            type="text" 
                            value={data.themeColor.replace('#', '')}
                            onChange={(e) => onChange('themeColor', `#${e.target.value}`)}
                            className="bg-transparent font-mono text-sm font-bold text-slate-800 w-full focus:outline-none dark:text-white"
                        />
                    </div>
                </div>
                <div className="relative">
                    <input 
                        type="color" 
                        value={data.themeColor}
                        onChange={(e) => onChange('themeColor', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                        <Palette size={16} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 3. Typography */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <Type size={16} /> Typography
        </label>
        
        <div className="space-y-4">
            {/* Heading Font */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Headings</label>
                <div className="relative">
                    <select 
                        value={data.headingFont || 'Lexend'} 
                        onChange={(e) => onChange('headingFont', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl appearance-none text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        style={{ fontFamily: data.headingFont }}
                    >
                        {FONTS_HEADING.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Body Font */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Body Text</label>
                <div className="relative">
                    <select 
                        value={data.bodyFont || 'Noto Sans'} 
                        onChange={(e) => onChange('bodyFont', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl appearance-none text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        style={{ fontFamily: data.bodyFont }}
                    >
                        {FONTS_BODY.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Base Size Slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">Base Size</label>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{data.baseFontSize || 16}px</span>
                </div>
                <input 
                    type="range" 
                    min="14" 
                    max="20" 
                    step="1" 
                    value={data.baseFontSize || 16} 
                    onChange={(e) => onChange('baseFontSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:bg-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                </div>
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 4. Spacing */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <MoveVertical size={16} /> Section Spacing
        </label>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase dark:text-slate-400">Vertical Density</label>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {data.sectionSpacing === 1 ? 'Compact' : data.sectionSpacing === 2 ? 'Normal' : 'Airy'}
                </span>
            </div>
            <input 
                type="range" 
                min="1" 
                max="3" 
                step="1" 
                value={data.sectionSpacing || 2} 
                onChange={(e) => onChange('sectionSpacing', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:bg-slate-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Tight</span>
                <span>Spacious</span>
            </div>
        </div>
      </section>

    </div>
  );
};

export default ThemeSelector;
