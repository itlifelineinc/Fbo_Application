
import React, { useState } from 'react';
import { SalesPage, Product, Package } from '../../types/salesPage';
import { FOREVER_CATALOG } from '../../data/foreverCatalog';
import { Search, Plus, Trash2, ShieldAlert, Sparkles, Package as PackageIcon, Info, ChevronDown, CheckCircle2 } from 'lucide-react';
import BenefitsEditor from './BenefitsEditor';

interface SolutionSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_CLASS = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const SolutionSectionEditor: React.FC<SolutionSectionEditorProps> = ({ data, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPackageBuilder, setShowPackageBuilder] = useState(data.packages.length > 0);

  const handleProductSelect = (catalogItem: Product) => {
    const exists = data.products.find(p => p.name === catalogItem.name);
    if (exists) {
        alert("Product already added to the solution.");
        return;
    }

    const newProduct: Product = {
      ...catalogItem,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      whyItFits: `Supports your wellness journey naturally.`,
      benefits: [...catalogItem.benefits],
      usageSteps: [...catalogItem.usageSteps]
    };
    
    onChange('products', [...data.products, newProduct]);
    setSearchQuery('');
  };

  const removeProduct = (id: string) => {
    onChange('products', data.products.filter(p => p.id !== id));
    // Also remove from any packages
    const updatedPackages = data.packages.map(pkg => ({
        ...pkg,
        productIds: pkg.productIds.filter(pid => pid !== id)
    }));
    onChange('packages', updatedPackages);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    const updated = data.products.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange('products', updated);
  };

  const addPackage = () => {
      const newPackage: Package = {
          id: `pkg_${Date.now()}`,
          title: 'Full Recovery Set',
          description: 'A complete approach to your health goals.',
          productIds: data.products.map(p => p.id),
          totalPrice: data.products.reduce((acc, p) => acc + p.price, 0),
          layout: 'grid',
          isPopular: true
      };
      onChange('packages', [...data.packages, newPackage]);
  };

  const removePackage = (id: string) => {
      onChange('packages', data.packages.filter(p => p.id !== id));
  };

  const updatePackage = (id: string, field: keyof Package, value: any) => {
      const updated = data.packages.map(p => p.id === id ? { ...p, [field]: value } : p);
      onChange('packages', updated);
  };

  const filteredCatalog = FOREVER_CATALOG.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* 1. Guardrails Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 dark:bg-amber-900/20 dark:border-amber-800">
          <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest dark:text-amber-400">Claims Guardrail</p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-1 leading-relaxed">
                  Avoid using "cure" or "treat". Use words like <strong>"supports"</strong>, <strong>"helps maintain"</strong>, or <strong>"aids"</strong> to stay compliant with Forever Living policies.
              </p>
          </div>
      </div>

      {/* 2. Intro Text */}
      <section className="space-y-4">
          <label className={LABEL_CLASS}>Solution Intro (Optional)</label>
          <textarea 
            value={data.problemSolverData?.solutionIntro || ''}
            onChange={(e) => onChange('problemSolverData', { ...(data.problemSolverData || {}), solutionIntro: e.target.value } as any)}
            placeholder="e.g. Based on these principles, here is our recommended natural approach..."
            className={INPUT_STYLE + " h-20 resize-none text-sm font-normal"}
          />
      </section>

      {/* 3. Product Selection */}
      <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                  <Sparkles className="text-emerald-500" size={18} />
                  <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Select Recommended Products</h2>
              </div>
          </div>

          <div className="relative z-20">
              <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Forever Catalog..."
                      className={INPUT_STYLE + " pl-10"}
                  />
              </div>
              
              {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-30">
                      {filteredCatalog.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => handleProductSelect(item)}
                            className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0"
                          >
                              <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</p>
                                  <p className="text-xs text-slate-500 truncate">{item.category}</p>
                              </div>
                              <div className="text-emerald-600 font-bold text-xs uppercase">+ Add</div>
                          </button>
                      ))}
                  </div>
              )}
          </div>

          <div className="space-y-6">
              {data.products.map((prod, idx) => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm dark:bg-slate-800 dark:border-slate-700 space-y-5 relative group">
                      <button onClick={() => removeProduct(prod.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                      </button>

                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                              <img src={prod.images[0]} className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">{prod.name}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{prod.category} • {data.currency} {prod.price}</p>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className={LABEL_CLASS}>Why it fits this problem</label>
                              <input 
                                type="text"
                                value={prod.whyItFits || ''}
                                onChange={(e) => updateProduct(prod.id, 'whyItFits', e.target.value)}
                                placeholder="e.g. Cleanses the digestive tract gently..."
                                className={INPUT_STYLE + " py-2 text-sm"}
                              />
                          </div>
                          
                          <BenefitsEditor 
                            benefits={prod.benefits}
                            onChange={(newBenefits) => updateProduct(prod.id, 'benefits', newBenefits)}
                          />

                          <div>
                              <label className={LABEL_CLASS}>How to use</label>
                              <textarea 
                                value={prod.usageSteps.join('\n')}
                                onChange={(e) => updateProduct(prod.id, 'usageSteps', e.target.value.split('\n'))}
                                placeholder="One step per line..."
                                className={INPUT_STYLE + " h-20 text-xs font-normal resize-none"}
                              />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 4. Package Builder */}
      <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                  <PackageIcon className="text-blue-500" size={18} />
                  <h2 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Package Builder (Bundle)</h2>
              </div>
              <button 
                onClick={() => setShowPackageBuilder(!showPackageBuilder)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${showPackageBuilder ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
              >
                  {showPackageBuilder ? 'Active' : 'Enable'}
              </button>
          </div>

          {showPackageBuilder && (
              <div className="space-y-4 animate-fade-in">
                  {data.packages.map(pkg => (
                      <div key={pkg.id} className="bg-blue-50/30 border-2 border-blue-100 rounded-2xl p-5 dark:bg-blue-900/10 dark:border-blue-800 relative">
                          <button onClick={() => removePackage(pkg.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                  <div>
                                      <label className={LABEL_CLASS}>Package Name</label>
                                      <input 
                                        type="text" 
                                        value={pkg.title}
                                        onChange={(e) => updatePackage(pkg.id, 'title', e.target.value)}
                                        className={INPUT_STYLE + " py-2 text-sm"}
                                      />
                                  </div>
                                  <div>
                                      <label className={LABEL_CLASS}>Total Bundle Price</label>
                                      <input 
                                        type="number" 
                                        value={pkg.totalPrice}
                                        onChange={(e) => updatePackage(pkg.id, 'totalPrice', parseFloat(e.target.value))}
                                        className={INPUT_STYLE + " py-2 text-sm font-mono"}
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className={LABEL_CLASS}>Included Products</label>
                                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 no-scrollbar">
                                      {data.products.map(p => (
                                          <div key={p.id} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                              <CheckCircle2 size={14} className="text-emerald-500" />
                                              {p.name}
                                          </div>
                                      ))}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-3 italic">*All products added above are included in this bundle automatically.</p>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {data.packages.length === 0 && (
                      <button 
                        onClick={addPackage}
                        className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all flex flex-col items-center gap-2 dark:border-slate-700"
                      >
                          <Plus size={24} />
                          <span className="text-xs font-bold uppercase tracking-widest">Create Full Solution Bundle</span>
                      </button>
                  )}
              </div>
          )}
      </section>

    </div>
  );
};

export default SolutionSectionEditor;
