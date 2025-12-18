
import React from 'react';
import { SalesPage, MobileDesignOverrides } from '../../types/salesPage';
import { Layout, Palette, Type, Check, Lock, MousePointerClick, Smartphone, Monitor, Shield, Square } from 'lucide-react';
import CustomSelect from '../Shared/CustomSelect';

interface ThemeSelectorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  previewDevice?: 'mobile' | 'desktop';
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

// Eye-safe/High-end Background Palette
const PAGE_BG_PALETTE = [
  '#064e3b', // Deep Forest (Emerald 900)
  '#111827', // Slate 900
  '#f8fafc', // Soft White
  '#f5f5f4', // Warm Stone
  '#e2e8f0', // Clean Slate
  '#1e1b4b', // Deep Indigo
  '#4c0519', // Deep Rose
  '#000000', // Black
];

// Bold Accent Palette for Image Shape
const CARD_BG_PALETTE = [
  '#fcd34d', // Sun Yellow
  '#fbbf24', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Bright Blue
  '#ef4444', // Red
  '#ec4899', // Pink
  '#ffffff', // White
  '#d1d5db', // Silver
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ data, onChange, previewDevice = 'desktop' }) => {
  
  const isMobileView = previewDevice === 'mobile';

  return (
    <div className="space-y-10 pb-10">
      
      {/* 1. Theme Selection */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <Layout size={18} className="text-emerald-500" /> Theme Layout
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onChange('layoutStyle', 'clean')}
            className={`
              relative p-5 rounded-3xl border-2 text-left transition-all overflow-hidden group
              ${data.layoutStyle === 'clean' 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-500 shadow-lg' 
                : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
              }
            `}
          >
            <div className="flex justify-between items-start mb-3">
               <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm">Aa</div>
               {data.layoutStyle === 'clean' && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm"><Check size={14} strokeWidth={3} /></div>}
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white">Clean</div>
            <div className="text-[10px] text-slate-500 mt-1 dark:text-slate-400 uppercase font-bold tracking-wider">Arched & Modern</div>
          </button>

          <button disabled className="relative p-5 rounded-3xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute top-3 right-3 text-slate-300"><Lock size={14} /></div>
            <div className="w-10 h-10 rounded-2xl bg-slate-200 mb-3 shadow-sm"></div>
            <div className="font-bold text-slate-400">Health</div>
            <div className="text-[10px] text-slate-400 mt-1">Coming Soon</div>
          </button>

          <button disabled className="relative p-5 rounded-3xl border-2 border-slate-100 bg-slate-50 text-left opacity-60 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute top-3 right-3 text-slate-300"><Lock size={14} /></div>
            <div className="w-10 h-10 rounded-none bg-slate-900 mb-3 shadow-sm"></div>
            <div className="font-bold text-slate-400">Bold</div>
            <div className="text-[10px] text-slate-400 mt-1">Coming Soon</div>
          </button>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 2. Page Colors */}
      <section className="space-y-6">
        <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 dark:text-slate-300">
          <Palette size={18} className="text-pink-500" /> Header & Page Colors
        </label>
        
        {/* Page Background */}
        <div className="space-y-3">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Main Page Background</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
                {PAGE_BG_PALETTE.map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange('pageBgColor', color)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-slate-200 dark:border-slate-700 ${
                            data.pageBgColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                    >
                        {data.pageBgColor === color && <Check size={14} className={color === '#f8fafc' || color === '#f5f5f4' || color === '#e2e8f0' ? 'text-slate-900' : 'text-white'} strokeWidth={4} />}
                    </button>
                ))}
            </div>
        </div>

        {/* Card/Shape Background */}
        <div className="space-y-3 pt-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Image Frame Background</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
                {CARD_BG_PALETTE.map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange('cardBgColor', color)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-slate-200 dark:border-slate-700 ${
                            data.cardBgColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                    >
                        {data.cardBgColor === color && <Check size={14} className={color === '#ffffff' || color === '#fcd34d' || color === '#fbbf24' || color === '#d1d5db' ? 'text-slate-900' : 'text-white'} strokeWidth={4} />}
                    </button>
                ))}
            </div>
        </div>

        {/* Brand Primary (Buttons) */}
        <div className="space-y-3 pt-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Brand Accent (Buttons)</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
                {['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#111827'].map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange('themeColor', color)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-slate-200 dark:border-slate-700 ${
                            data.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                    >
                        {data.themeColor === color && <Check size={14} className="text-white" strokeWidth={4} />}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 3. Typography */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-6 flex items-center gap-2 dark:text-slate-300">
          <Type size={18} className="text-blue-500" /> Typography
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect 
                label="Headings Font"
                value={data.headingFont || 'Lexend'}
                options={FONTS_HEADING_OPTIONS}
                onChange={(val) => onChange('headingFont', val)}
            />
            <CustomSelect 
                label="Body Font"
                value={data.bodyFont || 'Noto Sans'}
                options={FONTS_BODY_OPTIONS}
                onChange={(val) => onChange('bodyFont', val)}
            />
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

      {/* 4. Button Styles */}
      <section>
        <label className="block text-sm font-bold text-slate-700 mb-6 flex items-center gap-2 dark:text-slate-300">
          <MousePointerClick size={18} className="text-indigo-500" /> Interaction Design
        </label>

        <div className="grid grid-cols-3 gap-3">
            <button 
                onClick={() => onChange('buttonCorner', 'square')}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'square' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
            >
                <div className="w-8 h-8 bg-slate-900 rounded-none dark:bg-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Sharp</span>
            </button>
            <button 
                onClick={() => onChange('buttonCorner', 'rounded')}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'rounded' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
            >
                <div className="w-8 h-8 bg-slate-900 rounded-xl dark:bg-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Soft</span>
            </button>
            <button 
                onClick={() => onChange('buttonCorner', 'pill')}
                className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${data.buttonCorner === 'pill' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'}`}
            >
                <div className="w-8 h-8 bg-slate-900 rounded-full dark:bg-white"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Capsule</span>
            </button>
        </div>
      </section>
    </div>
  );
};

export default ThemeSelector;
