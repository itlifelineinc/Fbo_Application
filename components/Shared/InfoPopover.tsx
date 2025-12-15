
import React, { useState, useRef, useEffect } from 'react';
import { Info, X, ChevronDown } from 'lucide-react';

interface InfoPopoverProps {
    title: string;
    description: React.ReactNode;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({ title, description }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside (Desktop)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                aria-label="Info"
            >
                <Info size={18} />
            </button>

            {/* Desktop Popover */}
            <div className={`hidden md:block absolute right-0 top-8 z-50 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 transition-all origin-top-right transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="absolute -top-2 right-2 w-4 h-4 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 transform rotate-45"></div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">{title}</h4>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {description}
                </div>
            </div>

            {/* Mobile Bottom Drawer */}
            <div className={`md:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setIsOpen(false)}
                />
                
                {/* Drawer */}
                <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
                    
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {description}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl mt-4"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoPopover;
