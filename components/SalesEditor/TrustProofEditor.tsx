
import React, { useRef, useEffect } from 'react';
import { SalesPage, FaqItem } from '../../types/salesPage';
import { Student } from '../../types';
import TestimonialsEditor from './TestimonialsEditor';
import { ShieldCheck, User, HelpCircle, Plus, Trash2, CheckCircle, Leaf, Sparkles, Heart, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { RANKS } from '../../constants';

interface TrustProofEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
  currentUser: Student;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const BADGES_CONFIG = [
    { id: 'iasc', label: 'IASC Certified', icon: Leaf },
    { id: 'guarantee', label: '30-Day Guarantee', icon: ShieldCheck },
    { id: 'cruelty_free', label: 'Cruelty Free', icon: Heart },
    { id: 'kosher', label: 'Kosher Rated', icon: CheckCircle },
    { id: 'halal', label: 'Halal Certified', icon: CheckCircle },
    { id: 'natural', label: 'Natural Ingredients', icon: Sparkles },
];

const TrustProofEditor: React.FC<TrustProofEditorProps> = ({ data, onChange, currentUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill rank from currentUser if empty
  useEffect(() => {
      if (!data.personalBranding?.rank && currentUser.rankProgress?.currentRankId) {
          const officialRank = RANKS[currentUser.rankProgress.currentRankId]?.name || currentUser.rankProgress.currentRankId;
          updatePersonalBrand('rank', officialRank);
      }
  }, []);

  // --- Handlers ---

  const toggleBadge = (badgeId: string) => {
      const current = data.badges || [];
      const updated = current.includes(badgeId)
          ? current.filter(b => b !== badgeId)
          : [...current, badgeId];
      onChange('badges', updated);
  };

  const updatePersonalBrand = (field: string, value: any) => {
      onChange('personalBranding', { ...data.personalBranding, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => updatePersonalBrand('photoUrl', reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  // FAQ Handlers
  const addFaq = () => {
      const newFaq: FaqItem = { id: Date.now().toString(), question: '', answer: '' };
      onChange('faqs', [...(data.faqs || []), newFaq]);
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
      const newFaqs = [...(data.faqs || [])];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      onChange('faqs', newFaqs);
  };

  const removeFaq = (index: number) => {
      const newFaqs = [...(data.faqs || [])];
      newFaqs.splice(index, 1);
      onChange('faqs', newFaqs);
  };

  return (
    <div className="space-y-10 pb-10">
        
        {/* 1. Credibility Badges */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="text-emerald-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Credibility & Badges</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BADGES_CONFIG.map(badge => {
                    const isActive = (data.badges || []).includes(badge.id);
                    return (
                        <button
                            key={badge.id}
                            onClick={() => toggleBadge(badge.id)}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                isActive 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' 
                                : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                            }`}
                        >
                            <badge.icon size={20} />
                            <span className="text-xs font-bold">{badge.label}</span>
                        </button>
                    );
                })}
            </div>
        </section>

        {/* 2. "Why Buy From Me" */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <User className="text-blue-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Why Buy From Me?</h2>
            </div>

            <div className="flex items-start gap-4">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden relative group dark:bg-slate-800 dark:border-slate-600"
                >
                    {data.personalBranding?.photoUrl ? (
                        <img src={data.personalBranding.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-slate-400">
                            <ImageIcon size={20} />
                            <span className="text-[9px] font-bold mt-1">Photo</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_STYLE}>Years As FBO</label>
                            <input 
                                type="number" 
                                value={data.personalBranding?.yearsExperience || ''}
                                onChange={(e) => updatePersonalBrand('yearsExperience', parseInt(e.target.value))}
                                className={INPUT_STYLE}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className={LABEL_STYLE}>FBO Rank</label>
                            <input 
                                type="text" 
                                value={data.personalBranding?.rank || ''}
                                onChange={(e) => updatePersonalBrand('rank', e.target.value)}
                                className={INPUT_STYLE}
                                placeholder="e.g. Manager"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className={LABEL_STYLE}>Short Bio / Intro</label>
                <textarea 
                    value={data.personalBranding?.bio || ''}
                    onChange={(e) => updatePersonalBrand('bio', e.target.value)}
                    className={`${INPUT_STYLE} h-24 resize-none text-sm font-normal`}
                    placeholder="Hi! I'm Jane. I help people achieve their health goals..."
                />
            </div>
        </section>

        {/* 3. Testimonials */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="text-yellow-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Success Stories</h2>
            </div>
            <TestimonialsEditor data={data} onChange={onChange} />
        </section>

        {/* 4. FAQ Builder */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <HelpCircle className="text-purple-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
                {(data.faqs || []).map((faq, idx) => (
                    <div key={faq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group dark:bg-slate-800 dark:border-slate-700">
                        <button 
                            onClick={() => removeFaq(idx)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="space-y-2">
                            <input 
                                type="text" 
                                value={faq.question}
                                onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                placeholder="e.g. Is this safe for kids?"
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-sm outline-none focus:border-purple-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <textarea 
                                value={faq.answer}
                                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                placeholder="Answer..."
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500 resize-none h-16 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                            />
                        </div>
                    </div>
                ))}
                <button onClick={addFaq} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 dark:text-purple-400">
                    <Plus size={14} /> Add Question
                </button>
            </div>
        </section>

        {/* 5. Compliance Disclaimer */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="text-orange-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Compliance Footer</h2>
            </div>
            <div>
                <label className={LABEL_STYLE}>Disclaimer Text</label>
                <textarea 
                    value={data.disclaimer}
                    onChange={(e) => onChange('disclaimer', e.target.value)}
                    className={`${INPUT_STYLE} h-24 resize-none text-xs font-normal text-slate-500`}
                />
            </div>
        </section>

    </div>
  );
};

export default TrustProofEditor;
