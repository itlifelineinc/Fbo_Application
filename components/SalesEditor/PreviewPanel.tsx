
import React, { useState } from 'react';
import { SalesPage, FaqItem } from '../../types/salesPage';
import { 
  X, ChevronLeft, ShoppingBag, CreditCard, Smartphone, Banknote, 
  Truck, ArrowRight, ShieldCheck, MapPin, Tag, Package
} from 'lucide-react';

// Import Templates
import ProductClean from '../SalesPreview/templates/Product/Clean';
import Placeholder from '../SalesPreview/templates/Placeholder';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  const isMobile = device === 'mobile';
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
  
  const settings = isMobile && data.mobileOverrides ? { ...data, ...data.mobileOverrides } : data;
  const baseSize = settings.baseFontSize || 16;
  const scaleRatio = settings.typeScale || 1.25;
  const spacingValue = settings.sectionSpacing ?? 5;
  
  const h1Size = isMobile ? Math.round(baseSize * 1.5) : Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const radius = data.buttonCorner === 'pill' ? '9999px' : data.buttonCorner === 'rounded' ? '0.75rem' : '0px';

  const previewStyle = {
    '--font-heading': `'${data.headingFont}', sans-serif`,
    '--font-body': `'${data.bodyFont}', sans-serif`,
    '--base-size': `${baseSize}px`,
    '--h1-size': `${h1Size}px`,
    '--theme-color': data.themeColor || '#10b981',
    '--page-bg': data.pageBgColor || '#064e3b',
    '--card-bg': data.cardBgColor || '#fcd34d',
    '--section-padding': `${1 + (spacingValue * 0.5)}rem`,
    '--btn-radius': radius,
  } as React.CSSProperties;

  const renderActiveTemplate = () => {
      const type = data.type;
      const theme = data.layoutStyle;

      const handlers = {
          data,
          onOpenCheckout: () => setIsCheckoutOpen(true),
          onReadMoreStory: () => setIsStoryDrawerOpen(true),
          onReadMoreBenefits: () => {},
          onReadMoreUsage: () => {},
          onOpenFaq: (faq: FaqItem) => {},
          onViewAllFaqs: () => {},
      };

      if (type === 'product' && theme === 'clean') {
          return <ProductClean {...handlers} />;
      }
      return <Placeholder data={data} type={type} theme={theme} />;
  };

  const ContentShell = (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950 z-[1] relative" style={previewStyle}>
        {renderActiveTemplate()}
        
        {/* Drawers Local to frame */}
        <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
            <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
        </div>

        <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
            <div className="flex justify-between items-center px-6 pt-4 pb-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-2 text-left">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
        </div>
    </div>
  );

  return (
    <>
      <style>{`
        .preview-wrapper { font-family: var(--font-body); font-size: var(--base-size); line-height: 1.6; color: #334155; width: 100%; height: 100%; }
        .preview-wrapper h1 { font-family: var(--font-heading); line-height: 1.1; font-weight: 800; font-size: var(--h1-size); margin-bottom: 1rem; }
        .clean-section { padding: var(--section-padding) 1.5rem; }
        .clean-btn { border-radius: var(--btn-radius); padding: 0.85rem 1rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem; min-height: 3.5rem; }
        .attachment-card { background-color: white; border-radius: 2.5rem; border: 1px solid #e2e8f0; padding: 2rem; position: relative; }
        .dark .attachment-card { background-color: #111827; border-color: #334155; }
        .arch-frame { border-radius: 12rem; width: 100%; aspect-ratio: 4 / 5; background-color: var(--card-bg); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
        .custom-story-drawer { position: absolute; left: 0; right: 0; bottom: -110%; background: white; z-index: 700; border-top-left-radius: 2.5rem; border-top-right-radius: 2.5rem; box-shadow: 0 -10px 40px -10px rgba(0,0,0,0.3); max-height: 85%; display: flex; flex-direction: column; transform: translateY(110%); visibility: hidden; opacity: 0; transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1); }
        .custom-story-drawer.open { bottom: 0; transform: translateY(0); visibility: visible; opacity: 1; pointer-events: auto; }
        .dark .custom-story-drawer { background: #0f172a; border-top: 1px solid #334155; }
        .checkout-drawer { position: absolute; top: 0; right: -100%; bottom: 0; width: 100%; background: white; z-index: 600; transition: right 0.4s cubic-bezier(0.32, 0.72, 0, 1); display: flex; flex-direction: column; overflow-y: auto; }
        .checkout-drawer.open { right: 0; }
        .dark .checkout-drawer { background: #0f172a; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {isMobile ? (
        <div className="mx-auto w-full max-w-[375px] h-full max-h-[850px] rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative" style={{ backgroundColor: data.pageBgColor }}>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           {ContentShell}
        </div>
      ) : (
        <div className="hidden md:block relative w-[410px] aspect-[9/19.5] max-h-[92vh] group scale-95 lg:scale-100">
            <div className="absolute -left-[3px] top-28 w-[4px] h-14 bg-slate-800 rounded-l-md border-r border-white/5"></div>
            <div className="absolute -left-[3px] top-48 w-[4px] h-20 bg-slate-800 rounded-l-md border-r border-white/5"></div>
            <div className="absolute -right-[3px] top-44 w-[4px] h-24 bg-slate-800 rounded-r-md border-l border-white/5"></div>
            <div className="w-full h-full bg-slate-950 rounded-[3.5rem] p-[12px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-[4px] border-slate-800 relative ring-1 ring-white/10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-slate-950 rounded-b-3xl z-[250] flex items-center justify-end px-6 gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-full bg-[#111] border border-white/5"></div>
                </div>
                <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-white relative">
                    {ContentShell}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
    const product = data.products[0];
    const config = data.checkoutConfig;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans no-scrollbar overflow-y-auto">
            <div className="p-6 flex items-center gap-4 sticky top-0 bg-white dark:bg-[#0f172a] z-10 border-b border-slate-100 dark:border-slate-800">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-500"><ChevronLeft size={24}/></button>
                <h2 className="text-xl font-black font-heading">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-8">
                {/* 1. Item Details */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        {product?.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{product?.name || data.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quantity: 1</p>
                        <p className="text-sm font-black text-emerald-600 mt-2">{data.currency} {product?.price}</p>
                    </div>
                </div>

                {/* 2. Customer Fields */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Delivery Information</h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <input type="text" placeholder="Full Name" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="relative">
                            <input type="tel" placeholder="Phone Number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                        </div>
                        {config.shipping.enabled && (
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={16}/>
                                <input type="text" placeholder="Delivery Address" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 pl-10 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Payment Methods */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Payment Method</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {config.paymentMethods.mobileMoney && (
                            <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 text-left">
                                <Smartphone size={18} className="text-emerald-600"/>
                                <span className="font-bold text-sm">Mobile Money</span>
                            </button>
                        )}
                        {config.paymentMethods.cashOnDelivery && (
                            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left">
                                <Banknote size={18} className="text-slate-500"/>
                                <span className="font-bold text-sm">Cash on Delivery</span>
                            </button>
                        )}
                        {config.paymentMethods.card && (
                            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left">
                                <CreditCard size={18} className="text-slate-500"/>
                                <span className="font-bold text-sm">Debit/Credit Card</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Total Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 shadow-xl">
                    <div className="flex justify-between items-center text-sm opacity-70">
                        <span>Subtotal</span>
                        <span>{data.currency} {product?.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm opacity-70">
                        <span>Shipping</span>
                        <span>{config.shipping.flatRate ? `${data.currency} ${config.shipping.flatRate}` : 'FREE'}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="font-bold">Total Amount</span>
                        <span className="text-2xl font-black text-emerald-400">{data.currency} {(product?.price || 0) + (config.shipping.flatRate || 0)}</span>
                    </div>
                </div>

                <div className="space-y-4 pt-4 pb-10">
                    <button className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                        Complete Order <ArrowRight size={18}/>
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <ShieldCheck size={14} className="text-emerald-500"/> Secure SSL Encrypted Checkout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
