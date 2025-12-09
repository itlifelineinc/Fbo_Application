
import React, { useState } from 'react';
import { MentorshipTemplate, Student } from '../types';
import { Copy, ChevronDown, ChevronUp, Search, FileText, CheckCircle } from 'lucide-react';

interface MentorshipInboxProps {
  currentUser: Student;
  templates: MentorshipTemplate[];
}

const MentorshipInbox: React.FC<MentorshipInboxProps> = ({ currentUser, templates }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Filter templates: Show those from Sponsor OR System (Generic)
  const myTemplates = templates.filter(t => 
    (t.authorHandle === currentUser.sponsorId || t.authorHandle === '@forever_system') &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === 'ALL' || t.category === activeCategory)
  );

  const categories = ['ALL', 'PROSPECTING', 'PRODUCT', 'ONBOARDING', 'MOTIVATION', 'SALES', 'FOLLOWUP'];

  const handleCopy = (template: MentorshipTemplate) => {
      // Convert blocks to plain text for clipboard
      const text = template.blocks.map(b => b.content).join('\n\n');
      navigator.clipboard.writeText(text);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading dark:text-white">Mentorship Inbox</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Proven scripts and strategies from your team leader.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                  <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                          activeCategory === cat 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      <div className="space-y-4">
          {myTemplates.map(template => (
              <div key={template.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                  <div 
                      onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50"
                  >
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${template.authorHandle === '@forever_system' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                              <FileText size={20} />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">{template.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase dark:bg-slate-700">{template.category}</span>
                                  <span>• By {template.authorHandle}</span>
                              </p>
                          </div>
                      </div>
                      <div className="text-slate-400">
                          {expandedId === template.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                  </div>

                  {expandedId === template.id && (
                      <div className="px-5 pb-5 pt-0 animate-fade-in">
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
                              {template.blocks.map((block, idx) => (
                                  <div key={idx} className="mb-3 last:mb-0">
                                      {block.type === 'heading' && <h4 className="font-bold text-slate-800 mb-1 dark:text-slate-200">{block.content}</h4>}
                                      {block.type === 'paragraph' && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap dark:text-slate-300">{block.content}</p>}
                                      {block.type === 'list' && (
                                          <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                                              {block.content.split('\n').map((line, i) => <li key={i}>{line}</li>)}
                                          </ul>
                                      )}
                                      {block.type === 'callout' && (
                                          <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded border border-blue-100 italic dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                                              💡 {block.content}
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                          <div className="mt-4 flex justify-end">
                              <button 
                                  onClick={() => handleCopy(template)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                      copiedId === template.id 
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                                  }`}
                              >
                                  {copiedId === template.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                  {copiedId === template.id ? 'Copied!' : 'Copy Message'}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          ))}

          {myTemplates.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
                      <FileText size={24} />
                  </div>
                  <p>No templates found for this category.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default MentorshipInbox;
