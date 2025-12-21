import React, { useState } from 'react';
import { SalesPage, ProblemSolverData } from '../../types/salesPage';
import { AlertCircle, Plus, X, Brain, Apple, Utensils, Activity, ShieldAlert } from 'lucide-react';

interface ProblemSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
// Fix: Renamed LABEL_STYLE to LABEL_CLASS to resolve "Cannot find name 'LABEL_CLASS'" error
const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const ProblemSectionEditor: React.FC<ProblemSectionEditorProps> = ({ data, onChange }) => {
  const [newSymptom, setNewSymptom] = useState('');
  
  const problemData = data.problemSolverData || {
    problemDescription: '',
    whoItAffects: '',
    symptoms: [],
    causes: { stress: true, diet: true, lifestyle: true, others: '' }
  };

  const updateProblemData = (field: keyof ProblemSolverData, value: any) => {
    onChange('problemSolverData', { ...problemData, [field]: value });
  };

  const updateCause = (key: keyof ProblemSolverData['causes'], value: any) => {
    updateProblemData('causes', { ...problemData.causes, [key]: value });
  };

  const addSymptom = () => {
    if (!newSymptom.trim()) return;
    updateProblemData('symptoms', [...problemData.symptoms, newSymptom.trim()]);
    setNewSymptom('');
  };

  const removeSymptom = (index: number) => {
    updateProblemData('symptoms', problemData.symptoms.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. Compliance Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 dark:bg-amber-900/20 dark:border-amber-800">
          <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest dark:text-amber-400">Compliance Badge Active</p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                  We've automatically added this to your page: <strong>"This content is for educational purposes only. Not medical advice."</strong>
              </p>
          </div>
      </div>

      {/* 2. Overview */}
      <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Brain className="text-blue-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Problem Overview</h2>
          </div>

          <div>
              <label className={LABEL_CLASS}>What is this condition? (Simple words)</label>
              <textarea 
                  value={problemData.problemDescription}
                  onChange={(e) => updateProblemData('problemDescription', e.target.value)}
                  placeholder="e.g. An ulcer is an open sore in the lining of your stomach or small intestine..."
                  className={INPUT_STYLE + " h-28 resize-none text-sm font-normal"}
              />
          </div>

          <div>
              <label className={LABEL_CLASS}>Who does it affect?</label>
              <input 
                  type="text" 
                  value={problemData.whoItAffects}
                  onChange={(e) => updateProblemData('whoItAffects', e.target.value)}
                  placeholder="e.g. People who experience high stress or frequent acidity..."
                  className={INPUT_STYLE}
              />
          </div>
      </div>

      {/* 3. Symptoms */}
      <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Activity className="text-red-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Common Symptoms</h2>
          </div>

          <div className="flex gap-2">
              <input 
                  type="text" 
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
                  placeholder="e.g. Burning stomach pain"
                  className={INPUT_STYLE + " py-2 text-sm font-normal"}
              />
              <button 
                  onClick={addSymptom}
                  className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors dark:bg-emerald-600"
              >
                  <Plus size={20} />
              </button>
          </div>

          <div className="flex flex-wrap gap-2">
              {problemData.symptoms.map((symptom, idx) => (
                  <div key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {symptom}
                      <button onClick={() => removeSymptom(idx)}><X size={12} /></button>
                  </div>
              ))}
          </div>
      </div>

      {/* 4. Why it's common */}
      <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ShieldAlert className="text-orange-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Why it's common today</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                  { id: 'stress', label: 'Stress', icon: Brain },
                  { id: 'diet', label: 'Poor Diet', icon: Apple },
                  { id: 'lifestyle', label: 'Lifestyle Habits', icon: Utensils }
              ].map((cause) => (
                  <button
                      key={cause.id}
                      onClick={() => updateCause(cause.id as any, !problemData.causes[cause.id as keyof ProblemSolverData['causes']])}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          problemData.causes[cause.id as keyof ProblemSolverData['causes']]
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'border-slate-100 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                  >
                      <cause.icon size={20} />
                      <span className="text-xs font-bold">{cause.label}</span>
                  </button>
              ))}
          </div>

          <div>
              <label className={LABEL_CLASS}>Other Contributors (Optional)</label>
              <input 
                  type="text" 
                  value={problemData.causes.others}
                  onChange={(e) => updateCause('others', e.target.value)}
                  placeholder="e.g. Environmental toxins, processed foods..."
                  className={INPUT_STYLE}
              />
          </div>
      </div>

    </div>
  );
};

export default ProblemSectionEditor;