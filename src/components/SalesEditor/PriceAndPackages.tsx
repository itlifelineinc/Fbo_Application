
import React, { useState } from 'react';
import { SalesPage, PackageOption, CurrencyCode } from '../../types/salesPage';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface PriceAndPackagesProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const PriceAndPackages: React.FC<PriceAndPackagesProps> = ({ data, onChange }) => {
  const [isEditingPkg, setIsEditingPkg] = useState<number | null>(null);
  const [tempPkg, setTempPkg] = useState<PackageOption | null>(null);

  const pricingOptions = data.pricingOptions || [];

  const addPackage = () => {
    const newPkg: PackageOption = {
      id: Date.now().toString(),
      name: 'New Option',
      priceDelta: 0,
      features: []
    };
    onChange('pricingOptions', [...pricingOptions, newPkg]);
  };

  const removePackage = (index: number) => {
    const newPkgs = [...pricingOptions];
    newPkgs.splice(index, 1);
    onChange('pricingOptions', newPkgs);
  };

  const updatePackage = (index: number, field: keyof PackageOption, value: any) => {
    const newPkgs = [...pricingOptions];
    newPkgs[index] = { ...newPkgs[index], [field]: value };
    onChange('pricingOptions', newPkgs);
  };

  const updatePackageFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    const newPkgs = [...pricingOptions];
    const newFeatures = [...newPkgs[pkgIndex].features];
    newFeatures[featureIndex] = value;
    newPkgs[pkgIndex].features = newFeatures;
    onChange('pricingOptions', newPkgs);
  };

  const addPackageFeature = (pkgIndex: number) => {
    const newPkgs = [...pricingOptions];
    newPkgs[pkgIndex].features.push('New Feature');
    onChange('pricingOptions', newPkgs);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Base Price</label>
          <input 
            type="number" 
            value={data.basePrice || ''}
            onChange={(e) => onChange('basePrice', parseFloat(e.target.value))}
            className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Currency</label>
          <select 
            value={data.currency}
            onChange={(e) => onChange('currency', e.target.value as CurrencyCode)}
            className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {['USD', 'EUR', 'GBP', 'GHS', 'NGN', 'ZAR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-bold text-slate-700">Packages / Variants</label>
          <button onClick={addPackage} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded">
            <Plus size={14} /> Add Package
          </button>
        </div>
        
        <div className="space-y-3">
          {pricingOptions.map((pkg, idx) => (
            <div key={pkg.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-3">
                <input 
                  type="text" 
                  value={pkg.name}
                  onChange={(e) => updatePackage(idx, 'name', e.target.value)}
                  className="font-bold bg-transparent border-b border-transparent focus:border-emerald-500 focus:bg-white outline-none w-1/2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Price +</span>
                  <input 
                    type="number" 
                    value={pkg.priceDelta}
                    onChange={(e) => updatePackage(idx, 'priceDelta', parseFloat(e.target.value))}
                    className="w-20 p-1 text-right border border-slate-200 rounded bg-white text-sm"
                  />
                  <button onClick={() => removePackage(idx)} className="text-red-400 hover:text-red-600 ml-2"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="space-y-2">
                {pkg.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex gap-2">
                    <span className="text-emerald-500 text-xs mt-1">•</span>
                    <input 
                      type="text" 
                      value={feat}
                      onChange={(e) => updatePackageFeature(idx, fIdx, e.target.value)}
                      className="flex-1 text-xs bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none pb-0.5"
                    />
                  </div>
                ))}
                <button onClick={() => addPackageFeature(idx)} className="text-xs text-slate-400 hover:text-emerald-600 pl-4">+ Add feature</button>
              </div>
            </div>
          ))}
          {pricingOptions.length === 0 && <p className="text-xs text-slate-400 italic">No packages added. Base price applies.</p>}
        </div>
      </div>
    </div>
  );
};

export default PriceAndPackages;
