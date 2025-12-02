import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, Heading1, Heading2, Heading3, Quote, AlignLeft, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync content from props if it changes externally (and editor is not focused/active)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if not focused to prevent cursor jumping, or if empty
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        editorRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Detailed Description</label>
        <span className="text-xs text-slate-400 dark:text-slate-500">Visual Editor</span>
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all flex flex-col h-96 dark:bg-slate-800 dark:border-slate-700">
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-2 py-2 flex flex-wrap gap-1 items-center shrink-0 dark:bg-slate-900 dark:border-slate-700">
          <ToolbarButton onClick={() => execFormat('formatBlock', 'H1')} icon={<Heading1 size={16} />} label="H1" />
          <ToolbarButton onClick={() => execFormat('formatBlock', 'H2')} icon={<Heading2 size={16} />} label="H2" />
          <ToolbarButton onClick={() => execFormat('formatBlock', 'H3')} icon={<Heading3 size={16} />} label="H3" />
          <div className="w-px h-5 bg-slate-300 mx-1 self-center dark:bg-slate-700"></div>
          <ToolbarButton onClick={() => execFormat('bold')} icon={<Bold size={16} />} label="Bold" />
          <ToolbarButton onClick={() => execFormat('italic')} icon={<Italic size={16} />} label="Italic" />
          <div className="w-px h-5 bg-slate-300 mx-1 self-center dark:bg-slate-700"></div>
          <ToolbarButton onClick={() => execFormat('insertUnorderedList')} icon={<List size={16} />} label="Bullet" />
          <ToolbarButton onClick={() => execFormat('insertOrderedList')} icon={<ListOrdered size={16} />} label="Number" />
          <ToolbarButton onClick={() => execFormat('formatBlock', 'blockquote')} icon={<Quote size={16} />} label="Quote" />
        </div>
        
        {/* Editor Area */}
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="flex-1 w-full p-4 outline-none text-sm leading-relaxed text-slate-900 bg-white overflow-y-auto [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-4 dark:bg-slate-800 dark:text-slate-200 dark:[&_blockquote]:border-slate-600 dark:[&_blockquote]:text-slate-400"
          style={{ minHeight: '200px' }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Highlight text and click toolbar buttons to apply formatting.
      </p>
    </div>
  );
};

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button 
        onClick={(e) => { e.preventDefault(); onClick(e); }}
        type="button"
        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
        title={label}
    >
        {icon}
        <span className="text-[10px] font-bold hidden sm:inline">{label}</span>
    </button>
);

export default RichTextEditor;