
import React from 'react';
import { Save, Smartphone, Monitor, Eye, ChevronLeft, Columns, Maximize, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorToolbarProps {
  lastSaved: Date;
  isPublished: boolean;
  onPublish: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  previewDevice: 'mobile' | 'desktop';
  onSetPreviewDevice: (device: 'mobile' | 'desktop') => void;
  showSplitView: boolean;
  onToggleSplitView: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  lastSaved, 
  isPublished, 
  onPublish, 
  isPreviewMode, 
  onTogglePreview,
  previewDevice,
  onSetPreviewDevice,
  showSplitView,
  onToggleSplitView
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-8 h-16 md:h-20 shrink-0 z-40 sticky top-0 shadow-md transition-all">
      
      {/* Mobile Left: Custom Header */}
      <div className="md:hidden flex items-center gap-3">
        <Link to="/dashboard" className="p-1 -ml-2 text-slate-900 dark:text-white font-bold">
            <ChevronLeft strokeWidth={3} size={24} />
        </Link>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">Page Builder</h1>
      </div>

      {/* Desktop Left: Standard Nav */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/dashboard" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
          <ChevronLeft size={28} strokeWidth={3} />
        </Link>
        
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Sales Funnel</span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading leading-none">Page Builder</h1>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
          <Save size={14} className="text-emerald-500" />
          <span className="font-medium">Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Options (Desktop) */}
        {!isPreviewMode && (
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2 border border-slate-200 dark:border-slate-700">
                <button 
                    onClick={onToggleSplitView}
                    className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${showSplitView ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    title="Split View (Editor + Preview)"
                >
                    <Columns size={18} />
                    <span>Split</span>
                </button>
                <button 
                    onClick={onToggleSplitView}
                    className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${!showSplitView ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    title="Focus Mode (Full Editor)"
                >
                    <Maximize size={18} />
                    <span>Focus</span>
                </button>
            </div>
        )}

        {/* Device Toggles (Only relevant if Preview is active or screen is large) */}
        {(isPreviewMode || showSplitView) && (
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center hidden md:flex border border-slate-200 dark:border-slate-700">
            <button 
                onClick={() => onSetPreviewDevice('desktop')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Desktop View"
            >
                <Monitor size={20} />
            </button>
            <button 
                onClick={() => onSetPreviewDevice('mobile')}
                className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
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
             <button 
                onClick={onPublish} 
                className={`p-2 rounded-full transition-colors ${isPublished ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'}`}
             >
                 <UploadCloud size={22} />
             </button>
        </div>

        {/* Desktop Right: Standard Buttons */}
        <div className="hidden md:flex gap-3">
            <button 
            onClick={onTogglePreview}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                isPreviewMode 
                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800'
            }`}
            >
            {isPreviewMode ? (
                <>Edit Mode</>
            ) : (
                <><Eye size={18} /> Preview</>
            )}
            </button>

            <button 
            onClick={onPublish}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 ${
                isPublished ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
            }`}
            >
            <UploadCloud size={18} />
            {isPublished ? 'Update Page' : 'Publish Page'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
