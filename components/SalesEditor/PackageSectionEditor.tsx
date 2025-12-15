
import React, { useState, useRef } from 'react';
import { SalesPage, Package } from '../../types/salesPage';
import { Plus, Trash2, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

interface PackageSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const PackageSectionEditor: React.FC<PackageSectionEditorProps> = ({ data, onChange }) => {
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPackage = () => {
    const newPackage: Package = {
      id: `pkg_${Date.now()}`,
      title: 'New Bundle',
      description: 'Best value for money',
      productIds: [],
      totalPrice: 0,
      layout: 'grid'
    };
    onChange('packages', [...data.packages, newPackage]);
  };

  const updatePackage = (id: string, field: keyof Package, value: any) => {
    const updated = data.packages.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange('packages', updated);
  };

  const removePackage = (id: string) => {
    onChange('packages', data.packages.filter(p => p.id !== id));
  };

  const handleProductSelection = (pkgId: string, prodId: string) => {
    const pkg = data.packages.find(p => p.id === pkgId);
    if (!pkg) return;

    const newProductIds = pkg.productIds.includes(prodId)
      ? pkg.productIds.filter(id => id !== prodId)
      : [...pkg.productIds, prodId];
    
    // Auto-calculate total price
    const newTotal = newProductIds.reduce((sum, pid) => {
      const prod = data.products.find(p => p.id === pid);
      return sum + (prod ? prod.price : 0);
    }, 0);

    const updated = data.packages.map(p => p.id === pkgId ? { ...p, productIds: newProductIds, totalPrice: newTotal } : p);
    onChange('packages', updated);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePackage(activeUploadId, 'bannerImage', reader.result as string);
        setActiveUploadId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Product Bundles</label>
        <button onClick={addPackage} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50">
          <Plus size={14} /> Add Bundle
        </button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />

      <div className="space-y-6">
        {data.packages.map((pkg) => (
          <div key={pkg.id} className="border border-slate-200 rounded-xl bg-slate-50 p-3 md:p-4 space-y-4 dark:bg-slate-800 dark:border-slate-700">
            
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  value={pkg.title}
                  onChange={(e) => updatePackage(pkg.id, 'title', e.target.value)}
                  maxLength={40}
                  className="w-full bg-transparent border-b border-slate-300 focus:border-emerald-500 outline-none font-bold text-slate-800 text-sm md:text-base dark:text-slate-200 dark:border-slate-600"
                  placeholder="Bundle Name (Max 40)"
                />
                <input 
                  type="text" 
                  value={pkg.description}
                  onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                  maxLength={100}
                  className="w-full bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none text-xs text-slate-500 dark:text-slate-400 dark:border-slate-600"
                  placeholder="Short description (Max 100)"
                />
              </div>
              <button onClick={() => removePackage(pkg.id)} className="text-slate-400 hover:text-red-500 ml-2">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Product Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 dark:text-slate-400">Include Products:</label>
              <div className="flex flex-wrap gap-2">
                {data.products.length > 0 ? data.products.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => handleProductSelection(pkg.id, prod.id)}
                    className={`text-[10px] md:text-xs px-2 py-1 rounded border transition-all ${
                      pkg.productIds.includes(prod.id)
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {prod.name}
                  </button>
                )) : <span className="text-xs text-slate-400 italic">No products created yet.</span>}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-white p-3 rounded-lg border border-slate-100 dark:bg-slate-700 dark:border-slate-600">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-bold text-slate-400 uppercase dark:text-slate-300">Total Value</label>
                <div className="text-sm font-bold text-slate-700 dark:text-white">{data.currency} {pkg.totalPrice}</div>
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase dark:text-emerald-400">Special Price</label>
                <input 
                  type="number"
                  value={pkg.specialPrice || ''}
                  onChange={(e) => updatePackage(pkg.id, 'specialPrice', parseFloat(e.target.value))}
                  placeholder="Optional"
                  className="w-full text-sm font-bold text-emerald-600 outline-none border-b border-emerald-100 focus:border-emerald-500 bg-transparent dark:border-slate-500 dark:text-emerald-400"
                />
              </div>
            </div>

            {/* Layout & Visuals */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Layout</label>
                  <select 
                    value={pkg.layout}
                    onChange={(e) => updatePackage(pkg.id, 'layout', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 text-slate-900 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="grid">Grid Card</option>
                    <option value="hero">Featured Hero</option>
                    <option value="carousel">Carousel</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Banner Image</label>
                  <button 
                    onClick={() => { setActiveUploadId(pkg.id); fileInputRef.current?.click(); }}
                    className="w-full text-xs p-2 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    {pkg.bannerImage ? <span className="text-emerald-600 dark:text-emerald-400">Image Set</span> : <><ImageIcon size={12}/> Upload</>}
                  </button>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageSectionEditor;
