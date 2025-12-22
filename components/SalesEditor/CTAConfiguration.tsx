
import React, { useState, useEffect } from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import { MessageCircle, ShoppingBag, MousePointerClick, Smartphone, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
    { code: '+254', flag: '🇰🇪', label: 'Kenya' },
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

  const toggleCheckout = (enabled: boolean) => {
      onChange('checkoutConfig', { ...data.checkoutConfig, enabled });
  };

  const updateSecondaryCTA = (label: string) => {
      // Find 'Order Now' button or create it
      const ctas = data.ctas || [];
      const orderBtnIndex = ctas.findIndex(c => c.id === 'secondary-order-cta' || c.label.toLowerCase().includes('order'));
      
      const newCTA: CTAButton = {
          id: 'secondary-order-cta',
          label: label,
          actionType: 'SCROLL',
          url: '#products',
          style: 'outline',
          icon: 'shopping-cart'
      };

      if (orderBtnIndex > -1) {
          const updated = [...ctas];
          updated[orderBtnIndex] = { ...updated[orderBtnIndex], label };
          onChange('ctas', updated);
      } else {
          onChange('ctas', [...ctas, newCTA]);
      }
  };

  const secondaryLabel = data.ctas?.find(c => c.id === 'secondary-order-cta' || c.label.toLowerCase().includes('order'))?.label || 'Order Now';

  return (
    <div className="space-y-10 pb-10 animate-fade-in">
        
        {/* Intro */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
                <Zap className="text-yellow-500" size={20} />
                <h3 className="font-bold text-slate-800 dark:text-white">Conversion Engine</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose how you want customers to interact with you. High trust usually happens via WhatsApp, while fast sales happen via Direct Checkout.
            </p>
        </div>

        {/* 1. Primary CTA: WhatsApp */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <MessageCircle className="text-emerald-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Primary Action: WhatsApp</h2>
            </div>

            <div className="space-y-5">
                <div>
                    <label className={LABEL_STYLE}>WhatsApp Number</label>
                    <div className="flex gap-2">
                        <select 
                            value={selectedCode}
                            onChange={(e) => handlePhoneUpdate(e.target.value, localNumber)}
                            className="w-24 p-3 rounded-xl border border-slate-300 bg-white text-sm font-bold outline-none focus:border-emerald-600 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                            {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                        </select>
                        <input 
                            type="tel" 
                            value={localNumber}
                            onChange={(e) => handlePhoneUpdate(selectedCode, e.target.value)}
                            placeholder="e.g. 54 123 4567"
                            className={INPUT_STYLE + " font-mono"}
                        />
                    </div>
                </div>

                <div>
                    <label className={LABEL_STYLE}>Editable Message Template</label>
                    <textarea 
                        value={data.whatsappMessage}
                        onChange={(e) => onChange('whatsappMessage', e.target.value)}
                        className={INPUT_STYLE + " h-24 resize-none text-sm font-normal"}
                        placeholder="Hi, I'm interested in..."
                    />
                    <p className="text-[10px] text-slate-400 mt-2">
                        Use <strong>{'{title}'}</strong> to automatically insert the product or page name.
                    </p>
                </div>
            </div>
        </section>

        {/* 2. Secondary CTA: Order Action */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShoppingBag className="text-blue-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Secondary Action: Orders</h2>
            </div>

            <div className="space-y-5">
                {/* 
                   ISOLATION LOGIC: 
                   We remove the Button Label field only for the 'product' type builder 
                */}
                {data.type !== 'product' && (
                    <div>
                        <label className={LABEL_STYLE}>Button Label</label>
                        <input 
                            type="text" 
                            value={secondaryLabel}
                            onChange={(e) => updateSecondaryCTA(e.target.value)}
                            placeholder="e.g. Order Now"
                            className={INPUT_STYLE}
                        />
                    </div>
                )}

                {/* Checkout Toggle */}
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${data.checkoutConfig.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Enable Direct Checkout</p>
                            <p className="text-[10px] text-slate-500">Allow customers to pay instantly on the page.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={data.checkoutConfig.enabled} 
                            onChange={(e) => toggleCheckout(e.target.checked)} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:bg-slate-700"></div>
                    </label>
                </div>
            </div>
        </section>

        {/* 3. Floating Button Visibility */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <MousePointerClick className="text-purple-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Visibility Settings</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${data.ctaDisplay.showFloatingWhatsapp ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Floating WhatsApp Button</p>
                        <p className="text-[10px] text-slate-500">Stay reachable as the customer scrolls.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={data.ctaDisplay.showFloatingWhatsapp} 
                        onChange={() => toggleDisplay('showFloatingWhatsapp')} 
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:bg-slate-700"></div>
                </label>
            </div>
        </section>

        {/* Conversion Tip */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4 dark:bg-emerald-900/10 dark:border-emerald-800">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
            <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Conversion Tip</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 leading-relaxed">
                    Personalized WhatsApp messages significantly increase response rates. Make sure your message sounds friendly and helpful.
                </p>
            </div>
        </div>

    </div>
  );
};

export default CTAConfiguration;
