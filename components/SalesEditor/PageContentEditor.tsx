
import React from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import BenefitsEditor from './BenefitsEditor';
import RichTextEditor from './RichTextEditor';
import { Type, DollarSign, List } from 'lucide-react';

interface PageContentEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const PageContentEditor: React.FC<PageContentEditorProps> = ({ data, onChange }) => {
  // We assume single product mode for the main landing page content usually
  const activeProduct = data.products.length > 0 ? data.products[0] : null;

  const handleUpdateProduct = (field: keyof Product, value: any) => {
      if (!activeProduct) return;
      const updatedProduct = { ...activeProduct, [field]: value };
      // Replace the first product
      const newProducts = [...data.products];
      newProducts[0] = updatedProduct;
      onChange('products', newProducts);
  };

  if (!activeProduct) {
      return (
          <div className="text-center py-12 text-slate-400">
              <p>Please select a product in the <strong>Products</strong> tab first.</p>
          </div>
      );
  }

  const handleUsageStepChange = (index: number, val: string) => {
      const newSteps = [...activeProduct.usageSteps];
      newSteps[index] = val;
      handleUpdateProduct('usageSteps', newSteps);
  };

  const addUsageStep = () => {
      handleUpdateProduct('usageSteps', [...activeProduct.usageSteps, '']);
  };

  const removeUsageStep = (index: number) => {
      const newSteps = activeProduct.usageSteps.filter((_, i) => i !== index);
      handleUpdateProduct('usageSteps', newSteps);
  };

  return (
    <div className="space-y-10 pb-10">
        
        {/* 1. Headline Builder */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Type className="text-blue-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Headline Builder</h2>
            </div>
            
            <div>
                <label className={LABEL_STYLE}>Main Headline (Problem/Solution)</label>
                <input 
                    type="text" 
                    value={activeProduct.name}
                    onChange={(e) => handleUpdateProduct('name', e.target.value)}
                    placeholder="e.g. Lose weight naturally in 9 days"
                    className={`${INPUT_STYLE} text-lg`}
                />
            </div>

            <div>
                <label className={LABEL_STYLE}>Sub-headline (Promise/Support)</label>
                <input 
                    type="text" 
                    value={activeProduct.category || ''} // Using category as Tagline/Subtitle
                    onChange={(e) => handleUpdateProduct('category', e.target.value)}
                    placeholder="e.g. The C9 Program helps you reset your habits."
                    className={INPUT_STYLE}
                />
            </div>

            <div>
                <label className={LABEL_STYLE}>Intro / Short Story</label>
                <textarea 
                    value={activeProduct.shortDescription}
                    onChange={(e) => handleUpdateProduct('shortDescription', e.target.value)}
                    className={`${INPUT_STYLE} h-24 resize-none text-sm font-normal`}
                    placeholder="Briefly explain the product value proposition..."
                />
            </div>
        </section>

        {/* 2. Pricing */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <DollarSign className="text-emerald-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Pricing & Offer</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={LABEL_STYLE}>Price ({data.currency})</label>
                    <input 
                        type="number" 
                        value={activeProduct.price}
                        onChange={(e) => handleUpdateProduct('price', parseFloat(e.target.value))}
                        className={INPUT_STYLE}
                    />
                </div>
                <div>
                    <label className={LABEL_STYLE}>Discount Price</label>
                    <input 
                        type="number" 
                        value={activeProduct.discountPrice || ''}
                        onChange={(e) => handleUpdateProduct('discountPrice', parseFloat(e.target.value))}
                        placeholder="Optional"
                        className={INPUT_STYLE}
                    />
                </div>
            </div>
        </section>

        {/* 3. Benefits Section */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded dark:bg-emerald-900/30">
                    <Type size={14} />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white">Benefits Section</h2>
            </div>
            
            <BenefitsEditor 
                benefits={activeProduct.benefits} 
                onChange={(newBenefits) => handleUpdateProduct('benefits', newBenefits)} 
            />
        </section>

        {/* 4. How to Use */}
        <section className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <List className="text-purple-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">How It Works / Usage</h2>
            </div>
            
            <div className="space-y-3">
                {activeProduct.usageSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="font-bold text-slate-400 py-3 w-6 text-center">{idx + 1}.</span>
                        <input 
                            type="text"
                            value={step}
                            onChange={(e) => handleUsageStepChange(idx, e.target.value)}
                            className={`${INPUT_STYLE} py-2 text-sm font-normal`}
                            placeholder={`Step ${idx + 1}`}
                        />
                        <button onClick={() => removeUsageStep(idx)} className="text-slate-400 hover:text-red-500 px-1">
                            <List size={16} className="rotate-45" /> {/* X icon alternative */}
                        </button>
                    </div>
                ))}
                <button onClick={addUsageStep} className="text-xs font-bold text-purple-600 hover:text-purple-700 pl-8">+ Add Step</button>
            </div>
        </section>

        {/* 5. Detailed Description (Rich Text) */}
        <section className="space-y-5">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Type className="text-indigo-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Full Story / Details</h2>
            </div>
            <RichTextEditor value={data.description} onChange={(val) => onChange('description', val)} />
        </section>

    </div>
  );
};

export default PageContentEditor;
