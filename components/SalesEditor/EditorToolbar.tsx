
import React from 'react';
import { Smartphone, Monitor, Eye, ChevronLeft, Columns, Maximize, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorToolbarProps {
  pageTypeTitle: string;
  lastSaved: Date;
  isPublished: boolean;
  onPublish: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  previewDevice: 'mobile' | 'desktop';
  onSetPreviewDevice: (device: 'mobile' | 'desktop') => void;
  showSplitView: boolean;
  onToggleSplitView: () => void;
  onToggleTypeSelection: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  pageTypeTitle,
  lastSaved, 
  isPublished, 
  onPublish, 
  isPreviewMode, 
  onTogglePreview,
  previewDevice,
  onSetPreviewDevice,
  showSplitView,
  onToggleSplitView,
  onToggleTypeSelection
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-6 h-16 md:h-20 shrink-0 z-40 sticky top-0 border-b border-slate-100 dark:border-slate-800 transition-all">
      
      {/* Mobile Left: Custom Header */}
      <div className="md:hidden flex items-center gap-3">
        <Link to="/dashboard" className="p-1 -ml-2 text-slate-500 dark:text-slate-400">
            <ChevronLeft strokeWidth={2.5} size={24} />
        </Link>
        <div className="flex items-center gap-2">
            <button 
                onClick={onToggleTypeSelection}
                className="p-1.5 bg-slate-50 rounded-lg text-slate-400 dark:bg-slate-800"
            >
                <LayoutGrid size={16} strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">{pageTypeTitle}</h1>
        </div>
      </div>

      {/* Desktop Left: Standard Nav */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onToggleTypeSelection}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors dark:hover:bg-slate-800"
                        title="Change Page Type"
                    >
                        <LayoutGrid size={18} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{pageTypeTitle}</h1>
                </div>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-xs font-medium text-slate-400">
                    Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* View Options (Desktop) */}
        {!isPreviewMode && (
            <div className="hidden md:flex items-center gap-1">
                <button 
                    onClick={onToggleSplitView}
                    className={`p-2 rounded-lg transition-all ${showSplitView ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'}`}
                    title="Split View"
                >
                    <Columns size={20} />
                </button>
                <button 
                    onClick={onToggleSplitView}
                    className={`p-2 rounded-lg transition-all ${!showSplitView ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'}`}
                    title="Focus Mode"
                >
                    <Maximize size={20} />
                </button>
            </div>
        )}

        {(isPreviewMode || showSplitView) && <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>}

        {/* Device Toggles (Only relevant if Preview is active or screen is large) */}
        {(isPreviewMode || showSplitView) && (
            <div className="hidden md:flex items-center gap-1">
            <button 
                onClick={() => onSetPreviewDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'}`}
                title="Desktop View"
            >
                <Monitor size={20} />
            </button>
            <button 
                onClick={() => onSetPreviewDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'}`}
                title="Mobile View"
            >
                <Smartphone size={20} />
            </button>
            </div>
        )}

        {/* Mobile Right: Icons Only */}
        <div className="md:hidden flex items-center gap-3">
             <button 
                onClick={onTogglePreview} 
                className={`p-2 rounded-full transition-colors ${isPreviewMode ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-600 dark:text-slate-300'}`}
             >
                 <Eye size={22} />
             </button>
        </div>

        {/* Desktop Right: Preview Button */}
        <div className="hidden md:flex gap-3">
            <button 
            onClick={onTogglePreview}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                isPreviewMode 
                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            >
            {isPreviewMode ? (
                <>Edit Mode</>
            ) : (
                <><Eye size={18} /> Preview</>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
