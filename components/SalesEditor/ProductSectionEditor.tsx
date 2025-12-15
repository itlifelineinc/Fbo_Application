
import React, { useState } from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import { Search, Image as ImageIcon, Package, ShoppingBag, AlertTriangle, CheckCircle, Tag, List, DollarSign } from 'lucide-react';
import { FOREVER_CATALOG } from '../../data/foreverCatalog';

interface ProductSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ProductSectionEditor: React.FC<ProductSectionEditorProps> = ({ data, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionType, setSelectionType] = useState<'SINGLE' | 'BUNDLE'>('SINGLE');
  const [isPricingCustom, setIsPricingCustom] = useState(false);
  
  // Since this page type focuses on a main offer, we look at the first product
  const activeProduct = data.products.length > 0 ? data.products[0] : null;

  const handleCatalogSelect = (catalogItem: Product) => {
    // Clone item to avoid mutation of catalog
    const newProduct: Product = {
        ...catalogItem,
        id: `prod_${Date.now()}`, // Generate unique ID for this instance
        price: catalogItem.price, // Reset any previous edits
    };
    
    // Replace current products list with this single selection
    onChange('products', [newProduct]);
    setSearchQuery(''); // Clear search
    setIsPricingCustom(false); // Reset custom pricing toggle
  };

  const handleUpdateProduct = (field: keyof Product, value: any) => {
      if (!activeProduct) return;
      const updatedProduct = { ...activeProduct, [field]: value };
      onChange('products', [updatedProduct]);
  };

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
    <div className="space-y-6 md:space-y-8 pb-10 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Selection Type Toggle (No Header Title Here anymore) */}
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
          
          {/* Search Results Dropdown */}
          {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-30 w-full">
                  {filteredCatalog.length > 0 ? filteredCatalog.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleCatalogSelect(item)}
                        className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                      >
                          <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="truncate">{item.category}</span>
                                  {item.stockStatus === 'LOW_STOCK' && <span className="text-orange-500 font-bold shrink-0">• Low Stock</span>}
                                  {item.stockStatus === 'OUT_OF_STOCK' && <span className="text-red-500 font-bold shrink-0">• Out of Stock</span>}
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

      {/* 3. Active Product Details */}
      {activeProduct ? (
          <div className="animate-fade-in space-y-6 w-full">
              
              {/* Product Card */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 md:p-5 shadow-sm relative overflow-hidden w-full">
                  {/* Stock Badge */}
                  {activeProduct.stockStatus && (
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl z-10 ${
                          activeProduct.stockStatus === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                          activeProduct.stockStatus === 'LOW_STOCK' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                          {activeProduct.stockStatus.replace('_', ' ')}
                      </div>
                  )}

                  <div className="flex flex-row gap-3 md:gap-4 items-start">
                      {/* Image - Fixed width to prevent squashing */}
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-600 overflow-hidden shrink-0 mt-1">
                          {activeProduct.image ? (
                              <img src={activeProduct.image} alt="Product" className="w-full h-full object-cover" />
                          ) : (
                              <ImageIcon className="text-slate-300" size={32} />
                          )}
                      </div>

                      {/* Info Fields - min-w-0 ensures children truncate properly inside flex container */}
                      <div className="flex-1 space-y-3 min-w-0">
                          <div className="w-full">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Name</label>
                              <input 
                                  type="text" 
                                  value={activeProduct.name}
                                  onChange={(e) => handleUpdateProduct('name', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-emerald-500"
                              />
                          </div>
                          <div className="w-full">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Short Description</label>
                              <input 
                                  type="text" 
                                  value={activeProduct.shortDescription}
                                  onChange={(e) => handleUpdateProduct('shortDescription', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-emerald-500"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Smart Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Tag size={12}/> Recommended:</span>
                      {activeProduct.category && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] md:text-xs font-bold dark:bg-blue-900/30 dark:text-blue-300">{activeProduct.category}</span>}
                      {activeProduct.tags?.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] md:text-xs font-medium dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                      ))}
                  </div>
              </div>

              {/* 4. Pricing Options */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm md:text-base">
                          <DollarSign size={18} className="text-emerald-500"/> Pricing Strategy
                      </h4>
                      <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Custom Price</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={isPricingCustom} onChange={(e) => setIsPricingCustom(e.target.checked)} className="sr-only peer" />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-600"></div>
                          </label>
                      </div>
                  </div>

                  {/* Grid becomes 1 column on mobile to prevent squishing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Selling Price ({data.currency})</label>
                          <input 
                              type="number" 
                              value={activeProduct.price}
                              onChange={handlePriceChange}
                              disabled={!isPricingCustom}
                              className={`w-full p-2.5 rounded-xl border font-mono font-bold text-base md:text-lg outline-none transition-colors ${
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
                              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono text-base md:text-lg outline-none focus:border-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                          />
                      </div>
                  </div>
              </div>

              {/* 5. Product Content (Auto-filled) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Benefits */}
                  <div className="border border-slate-200 rounded-xl p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <CheckCircle size={16} className="text-emerald-500"/> Key Benefits
                          </h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold dark:bg-emerald-900/30 dark:text-emerald-400">Auto-filled</span>
                      </div>
                      <ul className="space-y-2">
                          {activeProduct.benefits.map((b, i) => (
                              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                  <span className="text-emerald-400">•</span> {b}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Usage */}
                  <div className="border border-slate-200 rounded-xl p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <List size={16} className="text-blue-500"/> How to Use
                          </h4>
                          <button className="text-[10px] text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                      </div>
                      <ul className="space-y-2">
                          {activeProduct.usageSteps.map((step, i) => (
                              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                  <span className="font-bold text-slate-300">{i+1}.</span> {step}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Ingredients (Read Only) */}
              {activeProduct.ingredients && activeProduct.ingredients.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl dark:bg-slate-800/50 w-full">
                      <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">Ingredients (Read-only reference)</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                          {activeProduct.ingredients.join(', ')}
                      </p>
                  </div>
              )}

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
