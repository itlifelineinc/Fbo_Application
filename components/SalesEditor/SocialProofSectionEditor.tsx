
import React, { useRef, useState } from 'react';
import { SalesPage, ProblemSolverData, BeforeAfterPair } from '../../types/salesPage';
import TestimonialsEditor from './TestimonialsEditor';
import { ShieldCheck, Plus, Trash2, Image as ImageIcon, Camera, Star, ShieldAlert, Globe, Award } from 'lucide-react';

interface SocialProofSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const SOCIAL_BADGES = [
    { id: 'quality', label: 'Forever Quality', icon: Award },
    { id: 'millions', label: 'Used by Millions', icon: Globe },
    { id: 'natural', label: '100% Natural Inner Leaf', icon: ShieldCheck },
    { id: 'compliance', label: 'IASC Certified', icon: ShieldCheck },
];

const SocialProofSectionEditor: React.FC<SocialProofSectionEditorProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUpload, setActiveUpload] = useState<{ id: string, type: 'before' | 'after' } | null>(null);

  const problemData = data.problemSolverData || {
    beforeAfterImages: [],
    socialProofBadges: []
  } as any;

  const updateProblemData = (field: keyof ProblemSolverData, value: any) => {
    onChange('problemSolverData', { ...data.problemSolverData, [field]: value } as any);
  };

  const toggleBadge = (badgeId: string) => {
    const current = problemData.socialProofBadges || [];
    const next = current.includes(badgeId)
        ? current.filter((b: string) => b !== badgeId)
        : [...current, badgeId];
    updateProblemData('socialProofBadges', next);
  };

  const addBeforeAfter = () => {
      const newPair: BeforeAfterPair = { id: `ba_${Date.now()}`, before: '', after: '', label: 'Result after 30 days' };
      updateProblemData('beforeAfterImages', [...(problemData.beforeAfterImages || []), newPair]);
  };

  const removeBeforeAfter = (id: string) => {
      updateProblemData('beforeAfterImages', problemData.beforeAfterImages.filter((p: BeforeAfterPair) => p.id !== id));
  };

  const handleBAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeUpload) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const updated = problemData.beforeAfterImages.map((p: BeforeAfterPair) => 
                  p.id === activeUpload.id ? { ...p, [activeUpload.type]: reader.result as string } : p
              );
              updateProblemData('beforeAfterImages', updated);
              setActiveUpload(null);
          };
          reader.readAsDataURL(file);
      }
      e.target.value = '';
  };

  const triggerUpload = (id: string, type: 'before' | 'after') => {
      setActiveUpload({ id, type });
      fileInputRef.current?.click();
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* 1. Compliance Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 dark:bg-amber-900/20 dark:border-amber-800">
          <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest dark:text-amber-400">Compliance First</p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-1 leading-relaxed">
                  Only share <strong>real experiences</strong>. Avoid making medical claims or promising a "cure". Use phrases like "how I felt" or "my personal results".
              </p>
          </div>
      </div>

      {/* 2. Testimonials (Reusing existing component) */}
      <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Star className="text-yellow-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Experience Sharing</h2>
          </div>
          <TestimonialsEditor data={data} onChange={onChange} />
      </section>

      {/* 3. Before / After Section */}
      <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                  <ImageIcon className="text-blue-500" size={18} />
                  <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Visual Results</h2>
              </div>
              <button onClick={addBeforeAfter} className="text-xs font-bold text-emerald-600 hover:underline">+ Add Transformation</button>
          </div>

          <div className="space-y-6">
              {(problemData.beforeAfterImages || []).map((pair: BeforeAfterPair) => (
                  <div key={pair.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700 relative group">
                      <button onClick={() => removeBeforeAfter(pair.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Plus className="rotate-45" size={16} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase text-slate-400">Before</span>
                              <div 
                                onClick={() => triggerUpload(pair.id, 'before')}
                                className="aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden dark:bg-slate-900 dark:border-slate-700"
                              >
                                  {pair.before ? <img src={pair.before} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                              </div>
                          </div>
                          <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase text-emerald-500">After</span>
                              <div 
                                onClick={() => triggerUpload(pair.id, 'after')}
                                className="aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden dark:bg-slate-900 dark:border-slate-700"
                              >
                                  {pair.after ? <img src={pair.after} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                              </div>
                          </div>
                      </div>
                      <input 
                        type="text" 
                        value={pair.label} 
                        onChange={(e) => {
                            const updated = problemData.beforeAfterImages.map((p: BeforeAfterPair) => 
                                p.id === pair.id ? { ...p, label: e.target.value } : p
                            );
                            updateProblemData('beforeAfterImages', updated);
                        }}
                        className="w-full mt-4 bg-transparent border-b border-slate-100 dark:border-slate-700 text-center text-xs font-bold text-slate-500 outline-none pb-1"
                        placeholder="Add a label (e.g. After 2 weeks)"
                      />
                  </div>
              ))}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleBAUpload} />
          </div>
      </section>

      {/* 4. Trust Badges */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldCheck className="text-emerald-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Global Trust Badges</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
                {SOCIAL_BADGES.map(badge => {
                    const isActive = (problemData.socialProofBadges || []).includes(badge.id);
                    return (
                        <button
                            key={badge.id}
                            onClick={() => toggleBadge(badge.id)}
                            className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all text-left ${
                                isActive 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' 
                                : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                        >
                            <badge.icon size={16} className="shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{badge.label}</span>
                        </button>
                    );
                })}
            </div>
      </section>

    </div>
  );
};

export default SocialProofSectionEditor;
