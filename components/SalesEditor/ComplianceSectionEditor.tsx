
import React from 'react';
import { SalesPage, ProblemSolverData } from '../../types/salesPage';
import { ShieldAlert, Scale, Info, CheckCircle2, Globe, AlertTriangle } from 'lucide-react';

interface ComplianceSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const ComplianceSectionEditor: React.FC<ComplianceSectionEditorProps> = ({ data, onChange }) => {
  
  const handleNoticeChange = (val: string) => {
    onChange('problemSolverData', {
      ...(data.problemSolverData || {}),
      countryNotice: val
    } as any);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Awareness Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-emerald-400">
                  <Scale size={28} />
              </div>
              <div>
                  <h3 className="text-xl font-black uppercase tracking-tight font-heading">FBO Compliance Engine</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Maintaining professional standards protects your business and the Forever brand. These fields are mandatory for all health-related landing pages.
                  </p>
              </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      </div>

      {/* 1. Health Disclaimer */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldAlert className="text-orange-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Main Health Disclaimer</h2>
          </div>

          <div className="space-y-3">
              <label className={LABEL_CLASS}>Primary Disclaimer Text</label>
              <textarea 
                  value={data.disclaimer}
                  onChange={(e) => onChange('disclaimer', e.target.value)}
                  placeholder="e.g. These statements have not been evaluated by the FDA..."
                  className={INPUT_STYLE + " h-32 text-xs font-normal leading-relaxed text-slate-600 dark:text-slate-300"}
              />
              <p className="text-[10px] text-slate-400 italic">This text appears at the bottom of every section on your live page.</p>
          </div>
      </section>

      {/* 2. Platform Safeguards */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Info className="text-blue-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Platform Safeguards</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
              {[
                  { label: "Auto-inserted 'Not Medical Advice' Badge", active: true },
                  { label: "Anti-Cure Word Filter Active", active: true },
                  { label: "Personal Data Encryption (GDPR)", active: true }
              ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                      <CheckCircle2 className="text-emerald-500" size={20} />
                  </div>
              ))}
          </div>
      </section>

      {/* 3. Regional/Country Specific */}
      <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Globe className="text-purple-500" size={18} />
              <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Country-Specific Notice</h2>
          </div>

          <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-900/50">
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                      Use this for specific regulatory requirements in your region (e.g. EU labeling, specific regional health notices).
                  </p>
              </div>
              
              <div>
                  <label className={LABEL_CLASS}>Regional Disclaimer (Optional)</label>
                  <input 
                      type="text" 
                      value={data.problemSolverData?.countryNotice || ''}
                      onChange={(e) => handleNoticeChange(e.target.value)}
                      placeholder="e.g. Special notice for customers in the UK..."
                      className={INPUT_STYLE + " text-sm font-normal"}
                  />
              </div>
          </div>
      </section>

      {/* Warning Alert */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4 dark:bg-red-900/10 dark:border-red-900/30">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div>
              <h4 className="text-sm font-bold text-red-900 dark:text-red-400 uppercase tracking-wider">Final Compliance Checklist</h4>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                  Before publishing, ensure you are not using the words <strong>"Cure"</strong>, <strong>"Treat"</strong>, or <strong>"Disease"</strong> in any of your custom text fields. Stick to <strong>"Support"</strong> and <strong>"Maintain"</strong>.
              </p>
          </div>
      </div>

    </div>
  );
};

export default ComplianceSectionEditor;
