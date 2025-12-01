
import React from 'react';
import { SalesPage } from '../../types/salesPage';

interface ContactSettingsProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={data.whatsappNumber}
          onChange={(e) => onChange('whatsappNumber', e.target.value)}
          placeholder="e.g. +1234567890"
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">Required for the floating CTA button. Include country code.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Contact Email</label>
        <input 
          type="email" 
          value={data.contactEmail}
          onChange={(e) => onChange('contactEmail', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          id="contactVisible"
          checked={data.contactVisible}
          onChange={(e) => onChange('contactVisible', e.target.checked)}
          className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
        />
        <label htmlFor="contactVisible" className="text-sm font-medium text-slate-700">Show Contact Info in Footer</label>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <label className="block text-sm font-bold text-slate-700 mb-2">Refund Policy & Legal</label>
        <textarea 
          value={data.refundPolicy}
          onChange={(e) => onChange('refundPolicy', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="e.g. 30-day money back guarantee for unopened products..."
        />
      </div>
    </div>
  );
};

export default ContactSettings;
