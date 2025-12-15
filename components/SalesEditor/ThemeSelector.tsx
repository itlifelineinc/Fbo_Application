
import React from 'react';
import { SalesPage } from '../../types/salesPage';
import { Layout, Palette, Type, MoveVertical, Check, Lock, Sliders, Minus, Plus, MousePointerClick, Square, Circle } from 'lucide-react';
import CustomSelect from '../Shared/CustomSelect';

interface ThemeSelectorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const FONTS_HEADING_OPTIONS = [
  { value: 'Lexend', label: 'Lexend (Modern)', previewFont: 'Lexend' },
  { value: 'Josefin Sans', label: 'Josefin Sans (Geometric)', previewFont: 'Josefin Sans' },
  { value: 'Montserrat', label: 'Montserrat (Bold)', previewFont: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)', previewFont: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather (Classic)', previewFont: 'Merriweather' },
  { value: 'Noto Sans', label: 'Noto Sans (Clean)', previewFont: 'Noto Sans' },
];

const FONTS_BODY_OPTIONS = [
  { value: 'Noto Sans', label: 'Noto Sans (Standard)', previewFont: 'Noto Sans' },
  { value: 'Inter', label: 'Inter (UI Optimized)', previewFont: 'Inter' },
  { value: 'Open Sans', label: 'Open Sans (Friendly)', previewFont: 'Open Sans' },
  { value: 'Lato', label: 'Lato (Round)', previewFont: 'Lato' },
  { value: 'Roboto', label: 'Roboto (Tech)', previewFont: 'Roboto' },
  { value: 'Poppins', label: 'Poppins (Soft)', previewFont: 'Poppins' },
];

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
  
  // Handlers for steppers
  const adjustValue = (field: 'baseFontSize' | 'subtitleFontSize' | 'sectionSpacing', amount: number, min: number, max: number) => {
      const current = data[field] || (field === 'baseFontSize' ? 16 : field === 'subtitleFontSize' ? 20 : 5);
      const next = Math.min(max, Math.max(min, current + amount));
      onChange(field, next);
  };

  return (
    <div className="space-y-10 pb-10">
      
      {/* 1. Theme Selection */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <Layout size={18} className="text-emerald-500" /> Theme Layout
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Active Theme: Clean */}
          <button
            onClick={() => onChange('layoutStyle', 'clean')}
            className={`
              relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden group
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
          <button disabled className="relative p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute top-2 right-2"><Lock size={14} className="text-slate-400" /></div>
            <div className="w-8 h-8 rounded-full bg-slate-200 mb-2"></div>
            <div className="font-bold text-slate-400">Health</div>
            <div className="text-[10px] text-slate-400 mt-1">Coming Soon</div>
          </button>

          {/* Disabled Theme: Bold */}
          <button disabled className="relative p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
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
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <Palette size={18} className="text-pink-500" /> Brand Colors
        </label>
        
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((color) => (
                    <button
                    key={color}
                    onClick={() => onChange('themeColor', color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-slate-100 dark:border-slate-700 ${
                        data.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    >
                    {data.themeColor === color && <Check size={16} className="text-white" strokeWidth={3} />}
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
                    <div className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 shadow-sm">
                        <Palette size={16} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 3. Button Styles */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-6 flex items-center gap-2 dark:text-slate-300">
          <MousePointerClick size={18} className="text-indigo-500" /> Button Styles
        </label>

        <div className="space-y-6">
            {/* Shape Selection */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400 mb-3 block">Shape</label>
                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => onChange('buttonCorner', 'square')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'square' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <div className="w-8 h-8 bg-slate-900 rounded-none shadow-sm dark:bg-white"></div>
                        <span className={`text-[10px] font-bold uppercase ${data.buttonCorner === 'square' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>Square</span>
                    </button>
                    
                    <button 
                        onClick={() => onChange('buttonCorner', 'rounded')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'rounded' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <div className="w-8 h-8 bg-slate-900 rounded-lg shadow-sm dark:bg-white"></div>
                        <span className={`text-[10px] font-bold uppercase ${data.buttonCorner === 'rounded' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>Soft</span>
                    </button>

                    <button 
                        onClick={() => onChange('buttonCorner', 'pill')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'pill' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <div className="w-8 h-8 bg-slate-900 rounded-full shadow-sm dark:bg-white"></div>
                        <span className={`text-[10px] font-bold uppercase ${data.buttonCorner === 'pill' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>Pill</span>
                    </button>
                </div>
            </div>

            {/* Size Selection */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400 mb-3 block">Size</label>
                <div className="bg-slate-100 p-1 rounded-xl flex dark:bg-slate-800">
                    {['sm', 'md', 'lg'].map((size) => (
                        <button
                            key={size}
                            onClick={() => onChange('buttonSize', size as 'sm'|'md'|'lg')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                data.buttonSize === size 
                                ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                        >
                            {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 4. Advanced Typography */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-6 flex items-center gap-2 dark:text-slate-300">
          <Type size={18} className="text-blue-500" /> Typography
        </label>
        
        <div className="space-y-6">
            {/* Font Families */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <CustomSelect 
                        label="Headings Font"
                        value={data.headingFont || 'Lexend'}
                        options={FONTS_HEADING_OPTIONS}
                        onChange={(val) => onChange('headingFont', val)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <CustomSelect 
                        label="Body Font"
                        value={data.bodyFont || 'Noto Sans'}
                        options={FONTS_BODY_OPTIONS}
                        onChange={(val) => onChange('bodyFont', val)}
                    />
                </div>
            </div>

            {/* Body Size Control */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-blue-100 text-blue-600 rounded dark:bg-blue-900/30 dark:text-blue-400"><Type size={14} /></span>
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Body Text Size</label>
                            <span className="text-[10px] text-slate-400">Base scale for paragraphs</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => adjustValue('baseFontSize', -1, 12, 24)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-white">{data.baseFontSize || 16}</span>
                        <button 
                            onClick={() => adjustValue('baseFontSize', 1, 12, 24)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
                <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    step="1" 
                    value={data.baseFontSize || 16} 
                    onChange={(e) => onChange('baseFontSize', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:bg-slate-700"
                />
            </div>

            {/* Subtitle Size Control (NEW) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded dark:bg-indigo-900/30 dark:text-indigo-400"><Type size={14} /></span>
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Subtitle Size</label>
                            <span className="text-[10px] text-slate-400">Controls size of secondary text</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => adjustValue('subtitleFontSize', -1, 14, 32)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-white">{data.subtitleFontSize || 20}</span>
                        <button 
                            onClick={() => adjustValue('subtitleFontSize', 1, 14, 32)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
                <input 
                    type="range" 
                    min="14" 
                    max="32" 
                    step="1" 
                    value={data.subtitleFontSize || 20} 
                    onChange={(e) => onChange('subtitleFontSize', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 dark:bg-slate-700"
                />
            </div>

            {/* Heading Scale Slider */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-purple-100 text-purple-600 rounded dark:bg-purple-900/30 dark:text-purple-400"><Sliders size={14} /></span>
                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Heading Prominence</label>
                            <span className="text-[10px] text-slate-400">Scale ratio for Headers vs Body</span>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 px-2 py-1 rounded dark:bg-purple-900/20">
                        {data.typeScale?.toFixed(2) || '1.25'}x
                    </span>
                </div>
                <input 
                    type="range" 
                    min="1.1" 
                    max="1.6" 
                    step="0.05" 
                    value={data.typeScale || 1.25} 
                    onChange={(e) => onChange('typeScale', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:bg-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium px-1">
                    <span>Subtle</span>
                    <span>Dramatic</span>
                </div>
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 5. Spacing */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-6 flex items-center gap-2 dark:text-slate-300">
          <MoveVertical size={18} className="text-orange-500" /> Layout Spacing
        </label>
        
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-orange-100 text-orange-600 rounded dark:bg-orange-900/30 dark:text-orange-400"><MoveVertical size={14} /></span>
                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Section Breathing Room</label>
                        <span className="text-[10px] text-slate-400">Vertical padding between blocks</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => adjustValue('sectionSpacing', -1, 0, 10)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-white">{data.sectionSpacing ?? 5}</span>
                    <button 
                        onClick={() => adjustValue('sectionSpacing', 1, 0, 10)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <input 
                type="range" 
                min="0" 
                max="10" 
                step="1" 
                value={data.sectionSpacing ?? 5} 
                onChange={(e) => onChange('sectionSpacing', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 dark:bg-slate-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium px-1">
                <span>Compact</span>
                <span>Airy</span>
            </div>
        </div>
      </section>

    </div>
  );
};

export default ThemeSelector;
