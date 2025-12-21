
import React from 'react';
import { SalesPage, ProblemSolverData, Mistake, ComparisonRow } from '../../types/salesPage';
import { AlertCircle, Plus, Trash2, Check, X, Shield, ListChecks, Info } from 'lucide-react';

interface MistakesSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const MistakesSectionEditor: React.FC<MistakesSectionEditorProps> = ({ data, onChange }) => {
  const problemData = data.problemSolverData || {
    problemDescription: '',
    whoItAffects: '',
    symptoms: [],
    causes: { stress: true, diet: true, lifestyle: true, others: '' },
    mistakes: [],
    comparisonTable: []
  };

  const updateProblemData = (field: keyof ProblemSolverData, value: any) => {
    onChange('problemSolverData', { ...problemData, [field]: value });
  };

  // Mistake Handlers
  const addMistake = () => {
    const newMistake: Mistake = { id: `mistake_${Date.now()}`, title: '', explanation: '' };
    updateProblemData('mistakes', [...(problemData.mistakes || []), newMistake]);
  };

  const updateMistake = (index: number, field: keyof Mistake, value: string) => {
    const newMistakes = [...(problemData.mistakes || [])];
    newMistakes[index] = { ...newMistakes[index], [field]: value };
    updateProblemData('mistakes', newMistakes);
  };

  const removeMistake = (index: number) => {
    const newMistakes = (problemData.mistakes || []).filter((_, i) => i !== index);
    updateProblemData('mistakes', newMistakes);
  };

  // Comparison Row Handlers
  const addComparisonRow = () => {
    const newRow: ComparisonRow = { id: `row_${Date.now()}`, do: '', dont: '' };
    updateProblemData('comparisonTable', [...(problemData.comparisonTable || []), newRow]);
  };

  const updateComparisonRow = (index: number, field: keyof ComparisonRow, value: string) => {
    const newTable = [...(problemData.comparisonTable || [])];
    newTable[index] = { ...newTable[index], [field]: value };
    updateProblemData('comparisonTable', newTable);
  };

  const removeComparisonRow = (index: number) => {
    const newTable = (problemData.comparisonTable || []).filter((_, i) => i !== index);
    updateProblemData('comparisonTable', newTable);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Awareness Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
          <div>
              <p className="text-xs font-black text-blue-800 uppercase tracking-widest dark:text-blue-400">Position Yourself as an Expert</p>
              <p className="text-xs text-blue-700 dark:text-blue-500 mt-1 leading-relaxed">
                  Highlighting common mistakes builds authority and trust. It shows you understand why previous attempts at a solution didn't work.
              </p>
          </div>
      </div>

      {/* 1. Mistake Cards */}
      <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={18} />
                  <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Common Mistakes</h2>
              </div>
              <button onClick={addMistake} className="text-xs font-bold text-emerald-600 hover:underline">+ Add Mistake</button>
          </div>

          <div className="space-y-4">
              {(problemData.mistakes || []).map((m, idx) => (
                  <div key={m.id} className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-slate-800 dark:border-slate-700 group">
                      <button onClick={() => removeMistake(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <Trash2 size={16} />
                      </button>
                      <div className="space-y-3">
                          <div>
                              <label className={LABEL_CLASS}>The Mistake</label>
                              <input 
                                  type="text" 
                                  value={m.title}
                                  onChange={(e) => updateMistake(idx, 'title', e.target.value)}
                                  placeholder="e.g. Relying only on painkillers"
                                  className={INPUT_STYLE + " text-sm"}
                              />
                          </div>
                          <div>
                              <label className={LABEL_CLASS}>Why it fails</label>
                              <textarea 
                                  value={m.explanation}
                                  onChange={(e) => updateMistake(idx, 'explanation', e.target.value)}
                                  placeholder="Short explanation of why this doesn't work long-term..."
                                  className={INPUT_STYLE + " h-20 resize-none text-xs font-normal"}
                              />
                          </div>
                      </div>
                  </div>
              ))}
              {problemData.mistakes.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 dark:border-slate-700">
                      <p className="text-slate-400 text-sm">Add mistakes people typically make when dealing with this problem.</p>
                  </div>
              )}
          </div>
      </section>

      {/* 2. Comparison Table */}
      <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                  <ListChecks className="text-emerald-500" size={18} />
                  <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Comparison Table</h2>
              </div>
              <button onClick={addComparisonRow} className="text-xs font-bold text-emerald-600 hover:underline">+ Add Row</button>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white dark:bg-slate-800 dark:border-slate-700">
              <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="p-3 text-[10px] font-black uppercase text-red-500 flex items-center gap-2 border-r border-slate-200 dark:border-slate-700"><X size={12}/> The Don't</div>
                  <div className="p-3 text-[10px] font-black uppercase text-emerald-600 flex items-center gap-2"><Check size={12}/> The Do</div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {(problemData.comparisonTable || []).map((row, idx) => (
                      <div key={row.id} className="grid grid-cols-2 relative group">
                          <div className="p-2 border-r border-slate-100 dark:border-slate-700">
                              <input 
                                  type="text" 
                                  value={row.dont}
                                  onChange={(e) => updateComparisonRow(idx, 'dont', e.target.value)}
                                  placeholder="Mistake..."
                                  className="w-full bg-transparent border-none p-2 text-xs text-slate-600 dark:text-slate-400 outline-none placeholder-slate-300"
                              />
                          </div>
                          <div className="p-2 flex items-center justify-between">
                              <input 
                                  type="text" 
                                  value={row.do}
                                  onChange={(e) => updateComparisonRow(idx, 'do', e.target.value)}
                                  placeholder="Solution..."
                                  className="w-full bg-transparent border-none p-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none placeholder-slate-300"
                              />
                              <button onClick={() => removeComparisonRow(idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 ml-2 transition-opacity">
                                  <Trash2 size={12}/>
                              </button>
                          </div>
                      </div>
                  ))}
                  {problemData.comparisonTable.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs italic">
                          No comparisons added. Use this to contrast bad habits with good ones.
                      </div>
                  )}
              </div>
          </div>
      </section>

    </div>
  );
};

export default MistakesSectionEditor;
