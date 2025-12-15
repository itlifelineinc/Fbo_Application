
import React, { useEffect, useState, useMemo } from 'react';
import { SalesPage } from '../../types/salesPage';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ContactSettingsProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({ data, onChange }) => {
  const countryCodes = [
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸', len: 10 },
    { code: '+44', name: 'UK', flag: '🇬🇧', len: 10 },
    { code: '+233', name: 'Ghana', flag: '🇬🇭', len: 9 }, // Length after removing 0
    { code: '+234', name: 'Nigeria', flag: '🇳🇬', len: 10 },
    { code: '+27', name: 'South Africa', flag: '🇿🇦', len: 9 },
    { code: '+254', name: 'Kenya', flag: '🇰🇪', len: 9 },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿', len: 9 },
    { code: '+256', name: 'Uganda', flag: '🇺🇬', len: 9 },
    { code: '+971', name: 'UAE', flag: '🇦🇪', len: 9 },
    { code: '+91', name: 'India', flag: '🇮🇳', len: 10 },
    { code: '+61', name: 'Australia', flag: '🇦🇺', len: 9 },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾', len: 9 }, // Varies 9-10
    { code: '+63', name: 'Philippines', flag: '🇵🇭', len: 10 },
    { code: '+49', name: 'Germany', flag: '🇩🇪', len: 10 }, // Varies
    { code: '+33', name: 'France', flag: '🇫🇷', len: 9 },
  ];

  // Initialize state by parsing existing number
  const [selectedCode, setSelectedCode] = useState(() => {
    if (!data.whatsappNumber) return '+233'; // Default to Ghana for this user context
    const match = countryCodes.find(c => data.whatsappNumber.startsWith(c.code));
    return match ? match.code : '+1';
  });

  // Local number state (what user types)
  const [localNumber, setLocalNumber] = useState(() => {
    if (!data.whatsappNumber) return '';
    const match = countryCodes.find(c => data.whatsappNumber.startsWith(c.code));
    if (match) {
        return data.whatsappNumber.replace(match.code, '');
    }
    return data.whatsappNumber; 
  });

  // Update global state and auto-correct format
  useEffect(() => {
    let cleanLocal = localNumber.replace(/\D/g, ''); 
    
    // Auto-correction: Remove leading zero if present (standard international format)
    if (cleanLocal.startsWith('0')) {
        cleanLocal = cleanLocal.substring(1);
    }

    const fullNumber = `${selectedCode}${cleanLocal}`;
    
    if (data.whatsappNumber !== fullNumber) {
        onChange('whatsappNumber', fullNumber);
    }
  }, [selectedCode, localNumber]);

  // Validation Logic
  const validationState = useMemo(() => {
      let cleanLocal = localNumber.replace(/\D/g, '');
      if (cleanLocal.startsWith('0')) cleanLocal = cleanLocal.substring(1);

      const country = countryCodes.find(c => c.code === selectedCode);
      if (!cleanLocal) return { valid: false, msg: '' };

      if (country) {
          // Specific check for Ghana or countries with strict length
          if (country.len && cleanLocal.length !== country.len) {
              return { 
                  valid: false, 
                  msg: `Expected ${country.len} digits (excluding '0'). You have ${cleanLocal.length}.` 
              };
          }
      }
      
      return { valid: true, msg: 'Valid number format' };
  }, [localNumber, selectedCode]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">WhatsApp Number <span className="text-red-500">*</span></label>
        
        <div className="flex gap-2 relative">
            <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-28 md:w-32 p-2.5 md:p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-xs md:text-sm appearance-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
                {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                    </option>
                ))}
            </select>
            
            <div className="flex-1 relative">
                <input 
                    type="tel" 
                    value={localNumber}
                    onChange={(e) => setLocalNumber(e.target.value)}
                    placeholder="e.g. 059 716 0478"
                    className={`w-full p-2.5 md:p-3 border rounded-xl bg-white text-slate-900 focus:ring-2 outline-none font-mono transition-colors text-sm dark:bg-slate-700 dark:text-white dark:placeholder-slate-500 ${
                        localNumber && !validationState.valid 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                />
                <div className="absolute right-3 top-3">
                    {localNumber && validationState.valid && <CheckCircle size={16} className="text-emerald-500" />}
                    {localNumber && !validationState.valid && <AlertCircle size={16} className="text-red-500" />}
                </div>
            </div>
        </div>
        
        {/* Validation Message / Preview */}
        <div className="flex justify-between items-start mt-2">
            <p className={`text-[10px] md:text-xs ${localNumber && !validationState.valid ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                {localNumber && !validationState.valid ? validationState.msg : 'We automatically remove the leading "0" for the link.'}
            </p>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
                {data.whatsappNumber}
            </p>
        </div>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Contact Email</label>
        <input 
          type="email" 
          value={data.contactEmail}
          onChange={(e) => onChange('contactEmail', e.target.value)}
          className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          id="contactVisible"
          checked={data.contactVisible}
          onChange={(e) => onChange('contactVisible', e.target.checked)}
          className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 dark:bg-slate-700 dark:border-slate-600"
        />
        <label htmlFor="contactVisible" className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Contact Info in Footer</label>
      </div>

      <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Refund Policy & Legal</label>
        <textarea 
          value={data.refundPolicy}
          onChange={(e) => onChange('refundPolicy', e.target.value)}
          className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-xs md:text-sm h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          placeholder="e.g. 30-day money back guarantee for unopened products..."
        />
      </div>
    </div>
  );
};

export default ContactSettings;
