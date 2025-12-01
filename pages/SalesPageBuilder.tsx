
import React, { useState } from 'react';
import { useLocalDraft } from '../hooks/useLocalDraft';
import EditorToolbar from '../components/SalesEditor/EditorToolbar';
import EditorLayout from '../components/SalesEditor/Layout';
import PreviewPanel from '../components/SalesEditor/PreviewPanel';

const SalesPageBuilder: React.FC = () => {
  const { page, updateField, publish, lastSaved } = useLocalDraft();
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Controls Mobile View mainly
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

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
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel - Hidden on mobile if preview is active */}
        <div className={`flex-1 min-w-0 md:flex ${isPreviewMode ? 'hidden md:flex' : 'flex'} flex-col border-r border-slate-200 max-w-3xl z-10 relative`}>
          <EditorLayout data={page} updateField={updateField} isPreviewMode={false} />
        </div>

        {/* Preview Panel - Hidden on mobile if preview is INACTIVE */}
        <div className={`flex-1 bg-slate-200 overflow-hidden relative ${!isPreviewMode ? 'hidden md:block' : 'block'}`}>
          <div className="h-full w-full flex items-center justify-center p-4 md:p-8 bg-dot-pattern">
             <PreviewPanel data={page} device={previewDevice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPageBuilder;
