
import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700">Detailed Description</label>
        <span className="text-xs text-slate-400">Markdown Supported</span>
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex gap-2 text-xs text-slate-600">
          <span className="font-bold">B</span>
          <span className="italic">I</span>
          <span>List</span>
        </div>
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 h-64 outline-none text-sm leading-relaxed text-slate-700 resize-y"
          placeholder="Describe the product benefits, ingredients, and story..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
