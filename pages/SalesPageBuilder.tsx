import React, { useState } from 'react';
import { useLocalDraft } from '../hooks/useLocalDraft';
import EditorToolbar from '../components/SalesEditor/EditorToolbar';
import EditorLayout from '../components/SalesEditor/Layout';
import PreviewPanel from '../components/SalesEditor/PreviewPanel';

const SalesPageBuilder: React.FC = () => {
  const { page, updateField, publish, lastSaved } = useLocalDraft();
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Controls Mobile View mainly
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [showSplitView, setShowSplitView] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
      <EditorToolbar 
        lastSaved={lastSaved}
        isPublished={page.isPublished}
        onPublish={publish}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        previewDevice={previewDevice}
        onSetPreviewDevice={setPreviewDevice}
        showSplitView={showSplitView}
        onToggleSplitView={() => setShowSplitView(!showSplitView)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Panel */}
        <div className={`
            flex-col transition-all duration-300 ease-in-out z-10
            ${isPreviewMode ? 'hidden' : 'flex'}
            ${showSplitView ? 'flex-1 border-r border-slate-200 max-w-3xl' : 'w-full max-w-5xl mx-auto shadow-xl my-0 md:my-6 rounded-none md:rounded-2xl border-x border-slate-200'}
            bg-white
        `}>
          <EditorLayout data={page} updateField={updateField} isPreviewMode={false} />
        </div>

        {/* Preview Panel */}
        <div className={`
            flex-1 bg-slate-200 overflow-hidden relative transition-all duration-300
            ${isPreviewMode ? 'flex' : 'hidden'}
            ${showSplitView && !isPreviewMode ? 'hidden md:flex' : ''}
        `}>
          <div className="w-full h-full overflow-y-auto bg-dot-pattern flex items-start justify-center p-4 md:p-8">
             <PreviewPanel data={page} device={previewDevice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPageBuilder;