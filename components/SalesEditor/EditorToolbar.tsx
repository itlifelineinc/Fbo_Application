
import React from 'react';
import { Save, Smartphone, Monitor, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorToolbarProps {
  lastSaved: Date;
  isPublished: boolean;
  onPublish: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  previewDevice: 'mobile' | 'desktop';
  onSetPreviewDevice: (device: 'mobile' | 'desktop') => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  lastSaved, 
  isPublished, 
  onPublish, 
  isPreviewMode, 
  onTogglePreview,
  previewDevice,
  onSetPreviewDevice
}) => {
  return (
    <div className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-slate-800 hidden md:block">Page Builder</h1>
        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Save size={12} />
          <span>Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Device Toggles (Only relevant if Preview is active or screen is large) */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center hidden md:flex">
          <button 
            onClick={() => onSetPreviewDevice('desktop')}
            className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Desktop View"
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => onSetPreviewDevice('mobile')}
            className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Mobile View"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <button 
          onClick={onTogglePreview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            isPreviewMode 
              ? 'bg-slate-800 text-white' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isPreviewMode ? (
            <>Edit Mode</>
          ) : (
            <><Eye size={16} /> Preview</>
          )}
        </button>

        <button 
          onClick={onPublish}
          className={`px-5 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-sm ${
            isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPublished ? 'Update Page' : 'Publish Page'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
