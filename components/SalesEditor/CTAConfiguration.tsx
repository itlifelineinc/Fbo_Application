
import React, { useState, useEffect, useMemo } from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import { MessageCircle, CheckCircle, AlertCircle, Smartphone, ArrowDown, CreditCard, Link as LinkIcon, Plus, Trash2, ArrowUp, ArrowDown as ArrowDownIcon, Layout } from 'lucide-react';

interface CTAConfigurationProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const COUNTRY_CODES = [
    { code: '+233', flag: '🇬🇭', label: 'Ghana' },
    { code: '+1', flag: '🇺🇸', label: 'USA/Canada' },
    { code: '+44', flag: '🇬🇧', label: 'UK' },
    { code: '+234', flag: '🇳🇬', label: 'Nigeria' },
    { code: '+27', flag: '🇿🇦', label: 'South Africa' },
    { code: '+971', flag: '🇦🇪', label: 'UAE' },
    { code: '+91', flag: '🇮🇳', label: 'India' },
];

const CTAConfiguration: React.FC<CTAConfigurationProps> = ({ data, onChange }) => {
  
  // --- WhatsApp Logic ---
  const [selectedCode, setSelectedCode] = useState('+233');
  const [localNumber, setLocalNumber] = useState('');

  // Init logic for phone number
  useEffect(() => {
      if (data.whatsappNumber) {
          const match = COUNTRY_CODES.find(c => data.whatsappNumber.startsWith(c.code));
          if (match) {
              setSelectedCode(match.code);
              setLocalNumber(data.whatsappNumber.replace(match.code, ''));
          } else {
              setLocalNumber(data.whatsappNumber); // Fallback
          }
      }
  }, []);

  const handlePhoneUpdate = (code: string, number: string) => {
      let clean = number.replace(/\D/g, '');
      if (clean.startsWith('0')) clean = clean.substring(1);
      
      setLocalNumber(clean);
      setSelectedCode(code);
      onChange('whatsappNumber', `${code}${clean}`);
  };

  // --- CTA Button Logic ---
  const addCTA = () => {
      const newBtn: CTAButton = {
          id: `cta-${Date.now()}`,
          label: 'Chat on WhatsApp',
          actionType: 'WHATSAPP',
          style: 'primary',
          url: '',
          icon: 'whatsapp'
      };
      onChange('ctas', [...data.ctas, newBtn]);
  };

  const updateCTA = (index: number, field: keyof CTAButton, value: any) => {
      const updated = [...data.ctas];
      
      // Auto-update icon based on action type if not manually set differently? 
      // Simplified: If switching to WhatsApp, set icon to whatsapp.
      if (field === 'actionType' && value === 'WHATSAPP') {
          updated[index].icon = 'whatsapp';
          updated[index].label = 'Chat on WhatsApp';
      } else if (field === 'actionType' && value === 'SCROLL') {
          updated[index].icon = 'shopping-cart';
          updated[index].label = 'Order Now';
      }

      updated[index] = { ...updated[index], [field]: value };
      onChange('ctas', updated);
  };

  const removeCTA = (index: number) => {
      const updated = [...data.ctas];
      updated.splice(index, 1);
      onChange('ctas', updated);
  };

  // --- Toggle Helpers ---
  const toggleDisplay = (field: keyof SalesPage['ctaDisplay']) => {
      onChange('ctaDisplay', { ...data.ctaDisplay, [field]: !data.ctaDisplay[field] });
  };

  return (
    <div className="space-y-10 pb-10">
        
        {/* 1. WhatsApp Configuration */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <MessageCircle className="text-green-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">WhatsApp Integration</h2>
            </div>

            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 dark:bg-green-900/10 dark:border-green-900/30">
                <div className="mb-4">
                    <label className={LABEL_STYLE}>WhatsApp Number</label>
                    <div className="flex gap-2">
                        <select 
                            value={selectedCode}
                            onChange={(e) => handlePhoneUpdate(e.target.value, localNumber)}
                            className="w-24 p-3 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none focus:border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                        </select>
                        <input 
                            type="tel" 
                            value={localNumber}
                            onChange={(e) => handlePhoneUpdate(selectedCode, e.target.value)}
                            placeholder="e.g. 54 123 4567"
                            className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-sm font-mono font-bold outline-none focus:border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className={LABEL_STYLE}>Pre-filled Message</label>
                    <textarea 
                        value={data.whatsappMessage}
                        onChange={(e) => onChange('whatsappMessage', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-green-500 h-24 resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Hi, I'm interested in..."
                    />
                    <p className="text-[10px] text-slate-500 mt-1 dark:text-slate-400">
                        Tip: Use <strong>{'{title}'}</strong> to dynamically insert the page title.
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Show Floating Button</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={data.ctaDisplay?.showFloatingWhatsapp} 
                            onChange={() => toggleDisplay('showFloatingWhatsapp')} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 dark:bg-slate-700"></div>
                    </label>
                </div>
            </div>
        </section>

        {/* 2. Action Buttons */}
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <CreditCard className="text-blue-500" size={18} />
                    <h2 className="font-bold text-slate-800 dark:text-white">Call to Action Buttons</h2>
                </div>
                <button onClick={addCTA} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                    + Add Button
                </button>
            </div>

            <div className="space-y-4">
                {data.ctas.map((cta, idx) => (
                    <div key={cta.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative group dark:bg-slate-800 dark:border-slate-700">
                        <button 
                            onClick={() => removeCTA(idx)} 
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"
                        >
                            <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Button Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        onClick={() => updateCTA(idx, 'actionType', 'WHATSAPP')}
                                        className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${cta.actionType === 'WHATSAPP' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-slate-500 border border-slate-200'}`}
                                    >
                                        <MessageCircle size={14} /> WhatsApp
                                    </button>
                                    <button 
                                        onClick={() => updateCTA(idx, 'actionType', 'SCROLL')}
                                        className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${cta.actionType === 'SCROLL' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white text-slate-500 border border-slate-200'}`}
                                    >
                                        <ArrowDown size={14} /> Scroll
                                    </button>
                                    <button 
                                        onClick={() => updateCTA(idx, 'actionType', 'LINK')}
                                        className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${cta.actionType === 'LINK' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-white text-slate-500 border border-slate-200'}`}
                                    >
                                        <LinkIcon size={14} /> Link
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Label</label>
                                <input 
                                    type="text" 
                                    value={cta.label}
                                    onChange={(e) => updateCTA(idx, 'label', e.target.value)}
                                    className="w-full p-2 text-sm font-bold rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                            </div>

                            {cta.actionType === 'LINK' && (
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">External URL</label>
                                    <input 
                                        type="text" 
                                        value={cta.url}
                                        onChange={(e) => updateCTA(idx, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full p-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white font-mono text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                            )}
                            
                            <div className="md:col-span-2 flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Style</label>
                                    <select 
                                        value={cta.style}
                                        onChange={(e) => updateCTA(idx, 'style', e.target.value)}
                                        className="w-full p-2 text-sm rounded-lg border border-slate-200 outline-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="primary">Solid Color</option>
                                        <option value="outline">Outline</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Icon</label>
                                    <select 
                                        value={cta.icon || ''}
                                        onChange={(e) => updateCTA(idx, 'icon', e.target.value)}
                                        className="w-full p-2 text-sm rounded-lg border border-slate-200 outline-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="">None</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="shopping-cart">Cart</option>
                                        <option value="arrow-right">Arrow</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. Placement Control */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Layout className="text-orange-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Placement Strategy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Hero Placement */}
                <div 
                    onClick={() => toggleDisplay('showHero')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${data.ctaDisplay?.showHero ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <div className="h-16 bg-slate-200 rounded-lg mb-3 relative overflow-hidden dark:bg-slate-700">
                        <div className="absolute inset-x-4 top-4 h-2 bg-slate-300 rounded dark:bg-slate-600"></div>
                        <div className="absolute inset-x-8 top-8 h-2 bg-slate-300 rounded dark:bg-slate-600 w-1/2 mx-auto"></div>
                        {data.ctaDisplay?.showHero && <div className="absolute bottom-2 inset-x-10 h-3 bg-emerald-500 rounded shadow-sm"></div>}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Hero Section</span>
                        {data.ctaDisplay?.showHero && <CheckCircle size={16} className="text-emerald-500"/>}
                    </div>
                </div>

                {/* Content End Placement */}
                <div 
                    onClick={() => toggleDisplay('showContentEnd')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${data.ctaDisplay?.showContentEnd ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <div className="h-16 bg-slate-200 rounded-lg mb-3 relative overflow-hidden dark:bg-slate-700">
                        <div className="absolute inset-x-4 top-2 h-2 bg-slate-300 rounded dark:bg-slate-600"></div>
                        <div className="absolute inset-x-4 top-5 h-2 bg-slate-300 rounded dark:bg-slate-600"></div>
                        {data.ctaDisplay?.showContentEnd && <div className="absolute bottom-2 inset-x-10 h-3 bg-emerald-500 rounded shadow-sm"></div>}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">After Content</span>
                        {data.ctaDisplay?.showContentEnd && <CheckCircle size={16} className="text-emerald-500"/>}
                    </div>
                </div>

                {/* Sticky Bottom Placement */}
                <div 
                    onClick={() => toggleDisplay('showBottomSticky')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${data.ctaDisplay?.showBottomSticky ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <div className="h-16 bg-slate-200 rounded-lg mb-3 relative overflow-hidden dark:bg-slate-700">
                        {data.ctaDisplay?.showBottomSticky && <div className="absolute bottom-0 inset-x-0 h-4 bg-white border-t border-emerald-500 flex items-center justify-center"><div className="w-12 h-2 bg-emerald-500 rounded"></div></div>}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Sticky Bottom</span>
                        {data.ctaDisplay?.showBottomSticky && <CheckCircle size={16} className="text-emerald-500"/>}
                    </div>
                </div>

            </div>
        </section>

    </div>
  );
};

export default CTAConfiguration;
