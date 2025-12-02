import React, { useEffect, useState } from 'react';
import { SalesPage } from '../../types/salesPage';

interface ContactSettingsProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({ data, onChange }) => {
  const countryCodes = [
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
  ];

  // Initialize state by parsing existing number
  const [selectedCode, setSelectedCode] = useState(() => {
    if (!data.whatsappNumber) return '+1';
    // Try to find a matching prefix
    const match = countryCodes.find(c => data.whatsappNumber.startsWith(c.code));
    return match ? match.code : '+1';
  });

  const [localNumber, setLocalNumber] = useState(() => {
    if (!data.whatsappNumber) return '';
    const match = countryCodes.find(c => data.whatsappNumber.startsWith(c.code));
    if (match) {
        return data.whatsappNumber.replace(match.code, '');
    }
    return data.whatsappNumber; // Fallback
  });

  // Update global state when local parts change
  useEffect(() => {
    // Remove any leading zeros from local number if strictly following standard, 
    // but typically WhatsApp handles it. We'll strip non-digits to be safe.
    const cleanLocal = localNumber.replace(/\D/g, ''); 
    const fullNumber = `${selectedCode}${cleanLocal}`;
    // Only update if it's different to prevent loops, though React helps here.
    if (data.whatsappNumber !== fullNumber) {
        onChange('whatsappNumber', fullNumber);
    }
  }, [selectedCode, localNumber]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">WhatsApp Number <span className="text-red-500">*</span></label>
        
        <div className="flex gap-2">
            <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-32 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
                {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                    </option>
                ))}
            </select>
            
            <input 
                type="tel" 
                value={localNumber}
                onChange={(e) => setLocalNumber(e.target.value)}
                placeholder="123 456 7890"
                className="flex-1 p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
            />
        </div>
        
        <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">
            Preview: <span className="font-mono font-bold text-emerald-600">{selectedCode} {localNumber}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">Contact Email</label>
        <input 
          type="email" 
          value={data.contactEmail}
          onChange={(e) => onChange('contactEmail', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
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
        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Refund Policy & Legal</label>
        <textarea 
          value={data.refundPolicy}
          onChange={(e) => onChange('refundPolicy', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          placeholder="e.g. 30-day money back guarantee for unopened products..."
        />
      </div>
    </div>
  );
};

export default ContactSettings;