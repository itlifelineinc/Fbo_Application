
import React, { useState, useRef } from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import { Search, Image as ImageIcon, Package, ShoppingBag, Plus, X, Tag, List, DollarSign, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { FOREVER_CATALOG } from '../../data/foreverCatalog';

interface ProductSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ProductSectionEditor: React.FC<ProductSectionEditorProps> = ({ data, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionType, setSelectionType] = useState<'SINGLE' | 'BUNDLE'>('SINGLE');
  const [isPricingCustom, setIsPricingCustom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  // Since this page type focuses on a main offer, we look at the first product
  const activeProduct = data.products.length > 0 ? data.products[0] : null;

  const handleCatalogSelect = (catalogItem: Product) => {
    // Clone item to avoid mutation of catalog
    // Auto-generate 4 images if catalog has only 1 (replicating the main image to simulate different angles as requested)
    const baseImages = catalogItem.images || [];
    const filledImages = [...baseImages];
    
    // Ensure we have 4 slots, filling with the first image if available
    while (filledImages.length < 4) {
        filledImages.push(baseImages[0] || '');
    }

    const newProduct: Product = {
        ...catalogItem,
        id: `prod_${Date.now()}`,
        images: filledImages.slice(0, 4), // Exactly 4 images
        price: catalogItem.price,
        ingredients: catalogItem.ingredients || [],
        benefits: catalogItem.benefits || [],
        usageSteps: catalogItem.usageSteps || [],
        tags: catalogItem.tags || []
    };
    
    // Replace current products list with this single selection
    onChange('products', [newProduct]);
    setSearchQuery(''); 
    setIsPricingCustom(false); 
  };

  const handleUpdateProduct = (field: keyof Product, value: any) => {
      if (!activeProduct) return;
      const updatedProduct = { ...activeProduct, [field]: value };
      onChange('products', [updatedProduct]);
  };

  // --- Image Handling ---
  const handleImageClick = (index: number) => {
      setActiveImageIndex(index);
      fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeProduct && activeImageIndex !== null) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newImages = [...activeProduct.images];
              newImages[activeImageIndex] = reader.result as string;
              handleUpdateProduct('images', newImages);
              setActiveImageIndex(null);
          };
          reader.readAsDataURL(file);
      }
      e.target.value = ''; // Reset
  };

  // --- List Generators (Benefits, Usage, Ingredients) ---
  const handleListChange = (field: 'benefits' | 'usageSteps' | 'ingredients' | 'tags', index: number, val: string) => {
      if (!activeProduct) return;
      const newList = [...(activeProduct[field] || [])];
      newList[index] = val;
      handleUpdateProduct(field, newList);
  };

  const handleListAdd = (field: 'benefits' | 'usageSteps' | 'ingredients' | 'tags') => {
      if (!activeProduct) return;
      const newList = [...(activeProduct[field] || []), '']; // Add empty string for editing
      handleUpdateProduct(field, newList);
  };

  const handleListRemove = (field: 'benefits' | 'usageSteps' | 'ingredients' | 'tags', index: number) => {
      if (!activeProduct) return;
      const newList = [...(activeProduct[field] || [])];
      newList.splice(index, 1);
      handleUpdateProduct(field, newList);
  };

  // --- Pricing ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdateProduct('price', parseFloat(e.target.value));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      handleUpdateProduct('discountPrice', isNaN(val) ? undefined : val);
  };

  const filteredCatalog = FOREVER_CATALOG.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Selection Type */}
      <div className="bg-slate-100 p-1 rounded-xl flex dark:bg-slate-800 w-full">
          <button 
            onClick={() => setSelectionType('SINGLE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${selectionType === 'SINGLE' ? 'bg-white shadow-sm text-emerald-600 dark:bg-slate-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
              <ShoppingBag size={16} /> <span className="truncate">Single Product</span>
          </button>
          <button 
            onClick={() => setSelectionType('BUNDLE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${selectionType === 'BUNDLE' ? 'bg-white shadow-sm text-emerald-600 dark:bg-slate-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
              <Package size={16} /> <span className="truncate">Bundle / Pack</span>
          </button>
      </div>

      {/* 2. Catalog Search */}
      <div className="relative z-20 w-full">
          <div className="relative w-full">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Forever Catalog..."
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
          </div>
          
          {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-30 w-full">
                  {filteredCatalog.length > 0 ? filteredCatalog.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleCatalogSelect(item)}
                        className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                      >
                          <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                              <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="truncate">{item.category}</span>
                              </div>
                          </div>
                          <div className="text-emerald-600 font-bold text-xs md:text-sm dark:text-emerald-400 shrink-0">Select</div>
                      </button>
                  )) : (
                      <div className="p-4 text-center text-slate-500 text-sm">No products found.</div>
                  )}
              </div>
          )}
      </div>

      {/* 3. Product Customization */}
      {activeProduct ? (
          <div className="animate-fade-in space-y-8 w-full">
              
              {/* Basic Info & Images */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-6">
                  
                  {/* Images Grid (4 Slots) */}
                  <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Product Images (4 Angles)</label>
                      <div className="grid grid-cols-4 gap-3">
                          {[0, 1, 2, 3].map((idx) => (
                              <div 
                                key={idx}
                                onClick={() => handleImageClick(idx)}
                                className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative group transition-all ${
                                    activeProduct.images[idx] 
                                    ? 'border-transparent bg-slate-50 dark:bg-slate-700' 
                                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-700/50'
                                }`}
                              >
                                  {activeProduct.images[idx] ? (
                                      <>
                                        <img src={activeProduct.images[idx]} className="w-full h-full object-cover" alt={`Shot ${idx+1}`} />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="text-white w-6 h-6" />
                                        </div>
                                      </>
                                  ) : (
                                      <div className="text-center text-slate-400">
                                          <ImageIcon size={20} className="mx-auto" />
                                          <span className="text-[10px] font-bold block mt-1">Upload</span>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>

                  {/* Text Inputs */}
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Name</label>
                          <input 
                              type="text" 
                              value={activeProduct.name}
                              onChange={(e) => handleUpdateProduct('name', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 font-bold text-lg text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category / Tagline</label>
                          <input 
                              type="text" 
                              value={activeProduct.category || ''}
                              onChange={(e) => handleUpdateProduct('category', e.target.value)}
                              placeholder="e.g. Skin Care"
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Description</label>
                          <textarea 
                              value={activeProduct.shortDescription}
                              onChange={(e) => handleUpdateProduct('shortDescription', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20"
                          />
                      </div>
                  </div>
              </div>

              {/* 4. Pricing & Options */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <DollarSign size={18} className="text-emerald-500"/> Pricing
                      </h4>
                      <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Custom Price</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={isPricingCustom} onChange={(e) => setIsPricingCustom(e.target.checked)} className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-600"></div>
                          </label>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Selling Price ({data.currency})</label>
                          <input 
                              type="number" 
                              value={activeProduct.price}
                              onChange={handlePriceChange}
                              disabled={!isPricingCustom}
                              className={`w-full p-3 rounded-xl border font-mono font-bold text-lg outline-none transition-colors ${
                                  isPricingCustom 
                                  ? 'bg-white border-slate-300 focus:border-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white' 
                                  : 'bg-slate-200 border-transparent text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'
                              }`}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Discount Price (Optional)</label>
                          <input 
                              type="number" 
                              value={activeProduct.discountPrice || ''}
                              onChange={handleDiscountChange}
                              placeholder="e.g. 150.00"
                              className="w-full p-3 rounded-xl border border-slate-300 bg-white font-mono text-lg outline-none focus:border-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                          />
                      </div>
                  </div>
              </div>

              {/* 5. Detailed Content (Editable Lists) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  
                  {/* Benefits */}
                  <div className="border border-slate-200 rounded-xl p-5 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <CheckCircle size={16} className="text-emerald-500"/> Key Benefits
                          </h4>
                          <button onClick={() => handleListAdd('benefits')} className="p-1 hover:bg-slate-100 rounded text-emerald-600 dark:hover:bg-slate-700"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-3">
                          {activeProduct.benefits.map((b, i) => (
                              <div key={i} className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={b} 
                                    onChange={(e) => handleListChange('benefits', i, e.target.value)}
                                    className="flex-1 text-xs md:text-sm p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-emerald-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                  />
                                  <button onClick={() => handleListRemove('benefits', i)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Usage */}
                  <div className="border border-slate-200 rounded-xl p-5 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <List size={16} className="text-blue-500"/> How to Use
                          </h4>
                          <button onClick={() => handleListAdd('usageSteps')} className="p-1 hover:bg-slate-100 rounded text-blue-600 dark:hover:bg-slate-700"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-3">
                          {activeProduct.usageSteps.map((step, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                  <span className="text-xs font-bold text-slate-400 w-4">{i+1}.</span>
                                  <input 
                                    type="text" 
                                    value={step} 
                                    onChange={(e) => handleListChange('usageSteps', i, e.target.value)}
                                    className="flex-1 text-xs md:text-sm p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                  />
                                  <button onClick={() => handleListRemove('usageSteps', i)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Ingredients */}
                  <div className="border border-slate-200 rounded-xl p-5 dark:border-slate-700 bg-white dark:bg-slate-800 md:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <AlertCircle size={16} className="text-orange-500"/> Ingredients
                          </h4>
                          <button onClick={() => handleListAdd('ingredients')} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">+ Add Ingredient</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {(activeProduct.ingredients || []).map((ing, i) => (
                              <div key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 dark:bg-slate-700 dark:border-slate-600">
                                  <input 
                                    type="text" 
                                    value={ing} 
                                    onChange={(e) => handleListChange('ingredients', i, e.target.value)}
                                    className="bg-transparent text-xs outline-none w-auto min-w-[50px] max-w-[200px] text-slate-700 dark:text-slate-200"
                                  />
                                  <button onClick={() => handleListRemove('ingredients', i)} className="text-slate-400 hover:text-red-500"><X size={12}/></button>
                              </div>
                          ))}
                          {(activeProduct.ingredients || []).length === 0 && <p className="text-xs text-slate-400 italic">No ingredients listed.</p>}
                      </div>
                  </div>

              </div>

          </div>
      ) : (
          /* Empty State */
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/30 w-full">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm dark:bg-slate-800">
                  <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-700 dark:text-white">No Product Selected</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 dark:text-slate-400">Use the search bar above to find a product from the Forever catalog.</p>
          </div>
      )}

    </div>
  );
};

export default ProductSectionEditor;
