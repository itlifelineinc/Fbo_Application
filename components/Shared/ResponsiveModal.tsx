
import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface ResponsiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    icon?: any;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    icon: Icon 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex justify-end md:items-center md:justify-center p-0 md:p-6">
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .drawer-enter {
                    animation: slideInRight 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
                }
                .modal-enter {
                    animation: zoomIn 0.2s ease-out forwards;
                }
            `}</style>

            {/* Blur Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
                onClick={onClose}
            />
            
            {/* Modal Content - Drawer on Mobile, Large Modal on Desktop */}
            <div className={`
                relative flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-hidden
                w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-6xl md:rounded-[2.5rem]
                drawer-enter md:modal-enter
            `}>
                {/* Header */}
                <div className="px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose} 
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        {Icon && <div className="hidden md:flex w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-emerald-600 dark:text-emerald-400"><Icon size={20} /></div>}
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white font-heading">{title}</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hidden md:block p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-black/20">
                    {children}
                </div>
            </div>
        </div>
    );
};
