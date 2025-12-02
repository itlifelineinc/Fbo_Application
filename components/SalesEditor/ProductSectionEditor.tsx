import React, { useState, useRef } from 'react';
import { SalesPage, Product, CurrencyCode } from '../../types/salesPage';
import { Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react';

interface ProductSectionEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const ProductSectionEditor: React.FC<ProductSectionEditorProps> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const addProduct = () => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: 'New Product',
      image: '',
      shortDescription: '',
      fullDescription: '',
      price: 0,
      benefits: [],
      usageSteps: []
    };
    onChange('products', [...data.products, newProduct]);
    setExpandedId(newProduct.id);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    const updatedProducts = data.products.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange('products', updatedProducts);
  };

  const removeProduct = (id: string) => {
    if (window.confirm('Delete this product?')) {
      onChange('products', data.products.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProduct(activeUploadId, 'image', reader.result as string);
        setActiveUploadId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleArrayItem = (productId: string, arrayField: 'benefits' | 'usageSteps', itemIndex: number | null, value?: string) => {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;

    let newArray = [...(product[arrayField] || [])];

    if (itemIndex === null && value) {
      // Add
      newArray.push(value);
    } else if (itemIndex !== null && value === undefined) {
      // Remove
      newArray.splice(itemIndex, 1);
    } else if (itemIndex !== null && value !== undefined) {
      // Edit
      newArray[itemIndex] = value;
    }

    updateProduct(productId, arrayField, newArray);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Single Products</label>
        <button onClick={addProduct} className="text-xs flex items-center gap-1 text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload} 
      />

      <div className="space-y-3">
        {data.products.map((product) => (
          <div key={product.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
              onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
            >
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-700" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-700 dark:text-slate-500">
                    <ImageIcon size={16} />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{product.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{data.currency} {product.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 size={16} />
                </button>
                <div className="text-slate-400 dark:text-slate-500">
                    {expandedId === product.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === product.id && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in dark:bg-slate-900/50 dark:border-slate-700">
                
                {/* Image & Basic Info */}
                <div className="flex gap-4">
                  <div 
                    onClick={() => { setActiveUploadId(product.id); fileInputRef.current?.click(); }}
                    className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-400 hover:text-emerald-500 transition-colors shrink-0 dark:bg-slate-800 dark:border-slate-600 dark:hover:border-emerald-500"
                  >
                    {product.image ? (
                      <img src={product.image} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1 font-bold">Upload</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                        <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        maxLength={40}
                        placeholder="Product Name (e.g. Aloe Vera Gel)"
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">{product.name.length}/40</span>
                    </div>
                    <div className="relative">
                        <input 
                        type="text" 
                        value={product.shortDescription}
                        onChange={(e) => updateProduct(product.id, 'shortDescription', e.target.value)}
                        maxLength={80}
                        placeholder="Tagline (e.g. For daily digestive health)"
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400">{product.shortDescription.length}/80</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Price ({data.currency})</label>
                    <input 
                      type="number" 
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Discount Price (Optional)</label>
                    <input 
                      type="number" 
                      value={product.discountPrice || ''}
                      onChange={(e) => updateProduct(product.id, 'discountPrice', parseFloat(e.target.value))}
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Full Description</label>
                  <textarea 
                    value={product.fullDescription}
                    onChange={(e) => updateProduct(product.id, 'fullDescription', e.target.value)}
                    className="w-full p-2 text-sm border border-slate-200 rounded-lg h-24 resize-none outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    placeholder="Rich text description..."
                  />
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Key Benefits</label>
                    <button 
                      onClick={() => toggleArrayItem(product.id, 'benefits', null, 'New Benefit')}
                      className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {product.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={benefit}
                          onChange={(e) => toggleArrayItem(product.id, 'benefits', idx, e.target.value)}
                          className="flex-1 p-1.5 text-xs border border-slate-200 rounded outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <button onClick={() => toggleArrayItem(product.id, 'benefits', idx)} className="text-slate-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSectionEditor;