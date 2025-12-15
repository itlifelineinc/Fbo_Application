
import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  previewFont?: string; // Optional: for font selector previews
}

interface CustomSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Select..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  // Base styling for the trigger (matching input style)
  const TRIGGER_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 outline-none transition-all dark:border-slate-700 dark:text-white cursor-pointer flex justify-between items-center";
  const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

  return (
    <div className="w-full">
      {label && <label className={LABEL_STYLE}>{label}</label>}
      
      {/* Trigger Button */}
      <div onClick={() => setIsOpen(true)} className={TRIGGER_STYLE}>
        <span className={selectedOption ? "opacity-100" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* Overlay & Drawers */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* 
             DESKTOP DRAWER (Slide from Left)
             Classes: fixed left-0 top-0 bottom-0, min-w-[320px] max-w-md w-auto
          */}
          <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-[101] bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-700 flex-col min-w-[350px] max-w-lg w-auto animate-slide-right transform origin-left">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-heading">{label || "Select Option"}</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                    <X size={20} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between group ${
                            value === opt.value 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500' 
                            : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <span 
                            className="text-base font-medium" 
                            style={opt.previewFont ? { fontFamily: opt.previewFont } : {}}
                        >
                            {opt.label}
                        </span>
                        {value === opt.value && <Check size={18} className="text-emerald-600 dark:text-emerald-400" />}
                    </button>
                ))}
             </div>
          </div>

          {/* 
             MOBILE DRAWER (Slide from Bottom)
             Classes: fixed bottom-0 left-0 right-0, max-h-[80vh] h-auto
          */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] h-auto animate-slide-up transform origin-bottom border-t border-slate-200 dark:border-slate-700">
             <div className="flex justify-center pt-3 pb-1">
                 <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
             </div>
             <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-heading">{label || "Select Option"}</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 dark:hover:bg-slate-800">
                    <X size={20} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar pb-10">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between ${
                            value === opt.value 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-700 active:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                        }`}
                    >
                        <span 
                            className="text-base font-medium" 
                            style={opt.previewFont ? { fontFamily: opt.previewFont } : {}}
                        >
                            {opt.label}
                        </span>
                        {value === opt.value && <Check size={18} className="text-emerald-600 dark:text-emerald-400" />}
                    </button>
                ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;
