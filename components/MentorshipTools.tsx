
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutTemplate, ClipboardCheck, Megaphone, Plus, Save, Trash2, X, ChevronDown, List, Type, AlertCircle } from 'lucide-react';
import { Student, MentorshipTemplate, ContentBlock, BlockType } from '../types';

interface MentorshipToolsProps {
  currentUser: Student;
  templates: MentorshipTemplate[];
  onAddTemplate: (template: MentorshipTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const MentorshipTools: React.FC<MentorshipToolsProps> = ({ currentUser, templates, onAddTemplate, onDeleteTemplate }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'MENU' | 'TEMPLATES_LIST' | 'TEMPLATE_EDITOR'>('MENU');
  
  // Editor State
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateCategory, setTemplateCategory] = useState<'PROSPECTING' | 'PRODUCT' | 'ONBOARDING' | 'MOTIVATION' | 'SALES' | 'FOLLOWUP'>('PROSPECTING');
  const [currentBlocks, setCurrentBlocks] = useState<ContentBlock[]>([]);

  // Filter My Templates
  const myTemplates = templates.filter(t => t.authorHandle === currentUser.handle).sort((a,b) => b.createdAt - a.createdAt);

  const resetEditor = () => {
      setTemplateTitle('');
      setTemplateCategory('PROSPECTING');
      setCurrentBlocks([]);
  };

  const handleSaveTemplate = () => {
      if (!templateTitle.trim() || currentBlocks.length === 0) {
          alert("Please add a title and at least one content block.");
          return;
      }

      const newTemplate: MentorshipTemplate = {
          id: `temp_${Date.now()}`,
          title: templateTitle,
          category: templateCategory,
          blocks: currentBlocks,
          authorHandle: currentUser.handle,
          createdAt: Date.now()
      };

      onAddTemplate(newTemplate);
      resetEditor();
      setActiveView('TEMPLATES_LIST');
  };

  const addBlock = (type: BlockType) => {
      setCurrentBlocks([...currentBlocks, { id: `blk_${Date.now()}`, type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
      setCurrentBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
      setCurrentBlocks(prev => prev.filter(b => b.id !== id));
  };

  // --- SUB-VIEWS ---

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setActiveView('TEMPLATES_LIST')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-indigo-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <LayoutTemplate size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Templates</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Create and manage reusable message strategies for your team.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
        </button>

        <button 
          onClick={() => alert('Assignments feature coming soon!')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden opacity-70"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-orange-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <ClipboardCheck size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Assignments</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Assign tasks and track progress (Coming Soon).</p>
          </div>
        </button>

        <button 
          onClick={() => alert('Broadcast feature coming soon!')}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden opacity-70"
        >
          <div className="p-4 rounded-2xl text-white shadow-lg bg-red-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <Megaphone size={28} />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Announcements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Send broadcast messages to multiple team members (Coming Soon).</p>
          </div>
        </button>
    </div>
  );

  const renderTemplatesList = () => (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Templates</h2>
              <button 
                  onClick={() => { resetEditor(); setActiveView('TEMPLATE_EDITOR'); }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 shadow-md transition-all"
              >
                  <Plus size={18} /> New Template
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTemplates.map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400">{t.category}</span>
                              <h3 className="font-bold text-lg text-slate-900 mt-1 dark:text-white">{t.title}</h3>
                          </div>
                          <button onClick={() => onDeleteTemplate(t.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                              <Trash2 size={18} />
                          </button>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-3 dark:text-slate-400">
                          {t.blocks.map(b => b.content).join(' ')}
                      </p>
                  </div>
              ))}
              {myTemplates.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-700 dark:text-slate-500">
                      <p>You haven't created any templates yet.</p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderTemplateEditor = () => (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700 flex flex-col h-[70vh]">
          {/* Editor Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-800 dark:text-white">New Template</h2>
              <div className="flex gap-2">
                  <button onClick={() => setActiveView('TEMPLATES_LIST')} className="text-slate-500 hover:text-slate-800 px-3 py-1.5 text-sm font-bold dark:text-slate-400 dark:hover:text-white">Cancel</button>
                  <button onClick={handleSaveTemplate} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-2">
                      <Save size={16} /> Save
                  </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Title</label>
                      <input 
                          type="text" 
                          value={templateTitle}
                          onChange={(e) => setTemplateTitle(e.target.value)}
                          placeholder="e.g. Cold Outreach Script #1"
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">Category</label>
                      <div className="relative">
                          <select 
                              value={templateCategory}
                              onChange={(e) => setTemplateCategory(e.target.value as any)}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 appearance-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                          >
                              <option value="PROSPECTING">Prospecting</option>
                              <option value="PRODUCT">Product Pitch</option>
                              <option value="ONBOARDING">Onboarding</option>
                              <option value="MOTIVATION">Motivation</option>
                              <option value="SALES">Sales Closing</option>
                              <option value="FOLLOWUP">Follow Up</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                      </div>
                  </div>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Content Blocks</label>
                      <div className="flex gap-2">
                          <button onClick={() => addBlock('heading')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Heading"><LayoutTemplate size={16}/></button>
                          <button onClick={() => addBlock('paragraph')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Text"><Type size={16}/></button>
                          <button onClick={() => addBlock('list')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add List"><List size={16}/></button>
                          <button onClick={() => addBlock('callout')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" title="Add Tip"><AlertCircle size={16}/></button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {currentBlocks.map((block, idx) => (
                          <div key={block.id} className="relative group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all dark:bg-slate-700/30 dark:border-slate-600">
                              <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><X size={14}/></button>
                              
                              {block.type === 'heading' && (
                                  <input 
                                      type="text" 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(block.id, e.target.value)}
                                      placeholder="Header Text"
                                      className="w-full bg-transparent font-bold text-lg outline-none placeholder-slate-300 text-slate-800 dark:text-white dark:placeholder-slate-600"
                                  />
                              )}
                              {block.type === 'paragraph' && (
                                  <textarea 
                                      value={block.content} 
                                      onChange={(e) => updateBlock(block.id, e.target.value)}
                                      placeholder="Message text..."
                                      className="w-full bg-transparent text-sm outline-none placeholder-slate-300 text-slate-600 resize-none h-20 dark:text-slate-300 dark:placeholder-slate-600"
                                  />
                              )}
                              {block.type === 'list' && (
                                  <div className="flex gap-2">
                                      <span className="text-slate-400 mt-1">•</span>
                                      <textarea 
                                          value={block.content} 
                                          onChange={(e) => updateBlock(block.id, e.target.value)}
                                          placeholder="List items (one per line)..."
                                          className="w-full bg-transparent text-sm outline-none placeholder-slate-300 text-slate-600 resize-none h-20 dark:text-slate-300 dark:placeholder-slate-600"
                                      />
                                  </div>
                              )}
                              {block.type === 'callout' && (
                                  <div className="flex gap-2 items-start">
                                      <span className="text-blue-500 mt-1">💡</span>
                                      <input 
                                          type="text" 
                                          value={block.content} 
                                          onChange={(e) => updateBlock(block.id, e.target.value)}
                                          placeholder="Pro tip or note..."
                                          className="w-full bg-transparent text-sm font-medium outline-none placeholder-slate-300 text-blue-800 dark:text-blue-300 dark:placeholder-slate-600"
                                      />
                                  </div>
                              )}
                          </div>
                      ))}
                      {currentBlocks.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-sm italic dark:text-slate-500">
                              Click buttons above to add content blocks.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button 
          onClick={() => {
              if (activeView === 'TEMPLATE_EDITOR') setActiveView('TEMPLATES_LIST');
              else if (activeView === 'TEMPLATES_LIST') setActiveView('MENU');
              else navigate('/dashboard'); // Go back to dashboard from main menu
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors font-medium text-sm dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={16} /> {activeView === 'MENU' ? 'Dashboard' : 'Back'}
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Mentorship Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Empower your team with advanced management features.</p>
      </div>

      {/* View Switcher */}
      <div className="max-w-4xl mx-auto">
          {activeView === 'MENU' && renderMenu()}
          {activeView === 'TEMPLATES_LIST' && renderTemplatesList()}
          {activeView === 'TEMPLATE_EDITOR' && renderTemplateEditor()}
      </div>
    </div>
  );
};

export default MentorshipTools;
