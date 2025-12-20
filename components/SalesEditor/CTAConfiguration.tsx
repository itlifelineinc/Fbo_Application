
import React, { useState, useEffect } from 'react';
import { SalesPage } from '../../types/salesPage';
import { MessageCircle } from 'lucide-react';

interface CTAConfigurationProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

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
  
  const [selectedCode, setSelectedCode] = useState('+233');
  const [localNumber, setLocalNumber] = useState('');

  useEffect(() => {
      if (data.whatsappNumber) {
          const match = COUNTRY_CODES.find(c => data.whatsappNumber.startsWith(c.code));
          if (match) {
              setSelectedCode(match.code);
              setLocalNumber(data.whatsappNumber.replace(match.code, ''));
          } else {
              setLocalNumber(data.whatsappNumber);
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

  const toggleDisplay = (field: keyof SalesPage['ctaDisplay']) => {
      onChange('ctaDisplay', { ...data.ctaDisplay, [field]: !data.ctaDisplay[field] });
  };

  return (
    <div className="space-y-10 pb-10">
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
                    <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Show Floating Button</span>
                        <p className="text-[10px] text-slate-400 leading-tight pr-4">Appears by the side once the hero button is scrolled away.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
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
    </div>
  );
};

export default CTAConfiguration;
