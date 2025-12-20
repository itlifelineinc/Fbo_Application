
import React, { useState, useRef } from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import { Search, Image as ImageIcon, Package, ShoppingBag, Upload, Trash2, Camera } from 'lucide-react';
import { FOREVER_CATALOG } from '../../data/foreverCatalog';

interface ProductSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const INPUT_STYLE = "w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold focus:border-emerald-600 focus:ring-0 outline-none transition-all dark:border-slate-700 dark:text-white placeholder-slate-400";
const LABEL_STYLE = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-200";

const ProductSectionEditor: React.FC<ProductSectionEditorProps> = ({ data, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  const activeProduct = data.products.length > 0 ? data.products[0] : null;

  const handleCatalogSelect = (catalogItem: Product) => {
    const baseImages = catalogItem.images || [];
    const filledImages = [...baseImages];
    
    while (filledImages.length < 4) {
        filledImages.push(baseImages[0] || '');
    }

    const newProduct: Product = {
        ...catalogItem,
        id: `prod_${Date.now()}`,
        images: filledImages.slice(0, 4),
        // We preserve catalog details as defaults, but editing happens in Content Tab now
        price: catalogItem.price,
        ingredients: catalogItem.ingredients || [],
        benefits: catalogItem.benefits || [],
        usageSteps: catalogItem.usageSteps || [],
        tags: catalogItem.tags || []
    };
    
    onChange('products', [newProduct]);
    setSearchQuery(''); 
  };

  const handleUpdateProduct = (field: keyof Product, value: any) => {
      if (!activeProduct) return;
      const updatedProduct = { ...activeProduct, [field]: value };
      onChange('products', [updatedProduct]);
  };

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

  const filteredCatalog = FOREVER_CATALOG.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 w-full max-w-full overflow-x-hidden">
      
      {/* Search Header */}
      <div className="mb-2">
          <label className={LABEL_STYLE}>Search Catalog</label>
          <p className="text-[10px] text-slate-500 mb-4 dark:text-slate-400">Search for any Forever product to automatically import its high-quality data.</p>
      </div>

      {/* Catalog Search */}
      <div className="relative z-20 w-full">
          <div className="relative w-full">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Aloe Vera Gel, C9, Bright..."
                  className={INPUT_STYLE + " pl-10"}
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

      {/* Product Images Area */}
      {activeProduct ? (
          <div className="animate-fade-in space-y-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <label className={LABEL_STYLE}>Product Visuals</label>
                      <span className="text-[10px] text-slate-400 font-medium">Selected: {activeProduct.name}</span>
                  </div>
                  
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
                                        <Camera className="text-white w-6 h-6" />
                                    </div>
                                  </>
                              ) : (
                                  <div className="text-center text-slate-400">
                                      <ImageIcon size={20} className="mx-auto" />
                                      <span className="text-[10px] font-bold block mt-1">Add</span>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg dark:bg-blue-900/20 dark:text-blue-300">
                      <strong>Tip:</strong> Go to the <strong>Page Content</strong> tab to edit the product name, price, benefits, and description.
                  </div>
              </div>
          </div>
      ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/30 w-full">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm dark:bg-slate-800">
                  <ShoppingBag size={24} className="text-slate-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-700 dark:text-white">No Product Selected</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 dark:text-slate-400">Search for a single product above to get started.</p>
          </div>
      )}

    </div>
  );
};

export default ProductSectionEditor;
