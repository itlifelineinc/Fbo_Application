
import React, { useState } from 'react';
import { SalesPage, ProblemSolverData } from '../../types/salesPage';
import { Plus, X, Heart, Salad, Apple, Coffee, Utensils, CheckCircle2, ListChecks, Info } from 'lucide-react';

interface LifestyleSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const PRINCIPLES = [
    'Balanced Nutrition', 'Hydration', 'Stress Management', 'Consistent Sleep', 'Gut-Friendly Foods', 'Moderate Exercise'
];

const LifestyleSectionEditor: React.FC<LifestyleSectionEditorProps> = ({ data, onChange }) => {
  const [newTip, setNewTip] = useState('');
  const [newAvoid, setNewAvoid] = useState('');
  const [newSupport, setNewSupport] = useState('');

  const problemData = data.problemSolverData || {
    problemDescription: '',
    whoItAffects: '',
    symptoms: [],
    causes: { stress: true, diet: true, lifestyle: true, others: '' },
    mistakes: [],
    comparisonTable: [],
    lifestylePrinciples: [],
    lifestyleTips: [],
    dietSuggestions: { avoid: [], support: [] }
  };

  const updateProblemData = (field: keyof ProblemSolverData, value: any) => {
    onChange('problemSolverData', { ...problemData, [field]: value });
  };

  const togglePrinciple = (principle: string) => {
    const current = problemData.lifestylePrinciples || [];
    const next = current.includes(principle)
        ? current.filter(p => p !== principle)
        : [...current, principle];
    updateProblemData('lifestylePrinciples', next);
  };

  const addItem = (listField: 'lifestyleTips', value: string, setter: (v: string) => void) => {
      if (!value.trim()) return;
      updateProblemData(listField, [...(problemData[listField] || []), value.trim()]);
      setter('');
  };

  const addDietItem = (type: 'avoid' | 'support', value: string, setter: (v: string) => void) => {
      if (!value.trim()) return;
      updateProblemData('dietSuggestions', {
          ...problemData.dietSuggestions,
          [type]: [...(problemData.dietSuggestions[type] || []), value.trim()]
      });
      setter('');
  };

  const removeItem = (listField: 'lifestyleTips', index: number) => {
      updateProblemData(listField, problemData[listField].filter((_, i) => i !== index));
  };

  const removeDietItem = (type: 'avoid' | 'support', index: number) => {
      updateProblemData('dietSuggestions', {
          ...problemData.dietSuggestions,
          [type]: problemData.dietSuggestions[type].filter((_, i) => i !== index)
      });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Awareness Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 dark:bg-emerald-900/20 dark:border-emerald-800">
          <Info className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={18} />
          <div>
              <p className="text-xs font-black text-emerald-800 uppercase tracking-widest dark:text-emerald-400">Build Trust with Natural Advice</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 leading-relaxed">
                  Introducing lifestyle and dietary support first shows you care about the person's overall health, not just selling products.
              </p>
          </div>
      </div>

      {/* 1. Natural Principles */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Heart className="text-pink-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Natural Support Principles</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
              {PRINCIPLES.map(p => {
                  const isActive = (problemData.lifestylePrinciples || []).includes(p);
                  return (
                      <button
                          key={p}
                          onClick={() => togglePrinciple(p)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                              isActive 
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                              : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                      >
                          {p}
                      </button>
                  );
              })}
          </div>
      </section>

      {/* 2. Lifestyle Tips */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ListChecks className="text-blue-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Actionable Lifestyle Tips</h2>
          </div>

          <div className="flex gap-2">
              <input 
                  type="text" 
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem('lifestyleTips', newTip, setNewTip)}
                  placeholder="e.g. Drink 2L of warm water daily"
                  className={INPUT_STYLE + " text-sm"}
              />
              <button 
                  onClick={() => addItem('lifestyleTips', newTip, setNewTip)}
                  className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors dark:bg-emerald-600"
              >
                  <Plus size={20} />
              </button>
          </div>

          <div className="space-y-2">
              {(problemData.lifestyleTips || []).map((tip, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between dark:bg-slate-800 dark:border-slate-700 group">
                      <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{tip}</span>
                      </div>
                      <button onClick={() => removeItem('lifestyleTips', idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                      </button>
                  </div>
              ))}
              {(!problemData.lifestyleTips || problemData.lifestyleTips.length === 0) && (
                  <p className="text-center text-slate-400 text-xs italic py-4">No tips added yet. Try adding some hydration or stress-relief tips.</p>
              )}
          </div>
      </section>

      {/* 3. Diet Suggestions */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Salad className="text-orange-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Diet & Nutrition Suggestions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avoid */}
              <div className="space-y-3">
                  <label className={LABEL_CLASS + " text-red-500"}>Foods to Reduce/Avoid</label>
                  <div className="flex gap-2">
                      <input 
                          type="text" 
                          value={newAvoid}
                          onChange={(e) => setNewAvoid(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addDietItem('avoid', newAvoid, setNewAvoid)}
                          placeholder="e.g. Highly spicy foods"
                          className={INPUT_STYLE + " text-xs"}
                      />
                      <button onClick={() => addDietItem('avoid', newAvoid, setNewAvoid)} className="bg-red-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-1 mt-2">
                      {(problemData.dietSuggestions?.avoid || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-red-50 p-2 rounded-lg dark:bg-red-900/10 dark:text-red-300 group">
                              <span className="flex items-center gap-2"><X size={12}/> {item}</span>
                              <button onClick={() => removeDietItem('avoid', idx)} className="opacity-0 group-hover:opacity-100"><X size={12}/></button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Support */}
              <div className="space-y-3">
                  <label className={LABEL_CLASS + " text-emerald-600"}>Foods to Support</label>
                  <div className="flex gap-2">
                      <input 
                          type="text" 
                          value={newSupport}
                          onChange={(e) => setNewSupport(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addDietItem('support', newSupport, setNewSupport)}
                          placeholder="e.g. Probiotic yogurt"
                          className={INPUT_STYLE + " text-xs"}
                      />
                      <button onClick={() => addDietItem('support', newSupport, setNewSupport)} className="bg-emerald-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-1 mt-2">
                      {(problemData.dietSuggestions?.support || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50 p-2 rounded-lg dark:bg-emerald-900/10 dark:text-emerald-300 group">
                              <span className="flex items-center gap-2"><Plus size={12}/> {item}</span>
                              <button onClick={() => removeDietItem('support', idx)} className="opacity-0 group-hover:opacity-100"><X size={12}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default LifestyleSectionEditor;
