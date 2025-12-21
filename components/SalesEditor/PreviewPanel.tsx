
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { SalesPage, Product, FaqItem } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Send, Loader2, Package, 
  ShoppingBag, CheckCircle, ChevronDown, Wallet, Building2, CreditCard as CardIcon, 
  MapPin, Mail, LayoutGrid, Map as MapIcon, Navigation, Search, X, AlertCircle,
  Tag, ArrowRight, Box, Home, Clock, Plus, Minus, Crosshair
} from 'lucide-react';

// Import Templates
import ProductClean from '../SalesPreview/templates/Product/Clean';
import Placeholder from '../SalesPreview/templates/Placeholder';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

// Fix: Added missing CheckoutView component to resolve "Cannot find name 'CheckoutView'" errors
const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const product = data.products[0];

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setOrderSuccess(true);
        }, 1500);
    };

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in bg-white dark:bg-[#0f172a]">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 dark:bg-emerald-900/30">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Order Confirmed!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Your order has been placed successfully. You will receive a confirmation message on WhatsApp shortly.</p>
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white dark:bg-emerald-600 rounded-2xl font-bold uppercase tracking-widest text-xs"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a]">
            {/* Checkout Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50 dark:bg-slate-900">
                <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Secure Checkout</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {/* Order Summary */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</h4>
                    <div className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-100 dark:bg-slate-700 dark:border-slate-600">
                            {product?.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Box className="w-full h-full p-4 text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{product?.name || 'Product'}</p>
                            <p className="text-xs text-emerald-600 font-bold">{data.currency} {product?.price?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</h4>
                        <div className="space-y-3">
                            <input type="text" required placeholder="Full Name" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                            <input type="email" required placeholder="Email Address" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                            <input type="tel" required placeholder="Phone Number" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                        </div>
                    </div>

                    {data.checkoutConfig?.shipping?.enabled && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</h4>
                            <textarea required placeholder="House No, Street, City" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm h-24 resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                        </div>
                    )}

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-500 uppercase tracking-widest text-[10px]">Total Due</span>
                            <span className="text-xl text-slate-900 dark:text-white">{data.currency} {product?.price?.toLocaleString()}</span>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} strokeWidth={3} /> Place Order</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  const isMobile = device === 'mobile';
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
  const [isBenefitsDrawerOpen, setIsBenefitsDrawerOpen] = useState(false);
  const [isUsageDrawerOpen, setIsUsageDrawerOpen] = useState(false);
  const [activeFaqForDrawer, setActiveFaqForDrawer] = useState<FaqItem | null>(null);
  const [isAllFaqsDrawerOpen, setIsAllFaqsDrawerOpen] = useState(false);
  
  const settings = isMobile && data.mobileOverrides ? { ...data, ...data.mobileOverrides } : data;
  const baseSize = settings.baseFontSize || 16;
  const scaleRatio = settings.typeScale || 1.25;
  const spacingValue = settings.sectionSpacing ?? 5;
  
  const h1Size = isMobile ? Math.round(baseSize * 1.5) : Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const h2Size = isMobile ? Math.round(baseSize * 1.3) : Math.round(baseSize * Math.pow(scaleRatio, 3)); 
  const h3Size = isMobile ? Math.round(baseSize * 1.1) : Math.round(baseSize * Math.pow(scaleRatio, 2)); 

  const sectionPaddingRem = 1 + (spacingValue * 0.5); 
  const radius = data.buttonCorner === 'pill' ? '9999px' : data.buttonCorner === 'rounded' ? '0.75rem' : '0px';

  const previewStyle = {
    '--font-heading': `'${data.headingFont}', sans-serif`,
    '--font-body': `'${data.bodyFont}', sans-serif`,
    '--base-size': `${baseSize}px`,
    '--h1-size': `${h1Size}px`,
    '--h2-size': `${h2Size}px`,
    '--h3-size': `${h3Size}px`,
    '--theme-color': data.themeColor || '#10b981',
    '--page-bg': data.pageBgColor || '#064e3b',
    '--card-bg': data.cardBgColor || '#fcd34d',
    '--section-padding': `${sectionPaddingRem}rem`,
    '--btn-radius': radius,
  } as React.CSSProperties;

  // --- TEMPLATE DISPATCHER ---
  const renderActiveTemplate = () => {
      const type = data.type;
      const theme = data.layoutStyle;

      const handlers = {
          data,
          onOpenCheckout: () => setIsCheckoutOpen(true),
          onReadMoreStory: () => setIsStoryDrawerOpen(true),
          onReadMoreBenefits: () => setIsBenefitsDrawerOpen(true),
          onReadMoreUsage: () => setIsUsageDrawerOpen(true),
          onOpenFaq: (faq: FaqItem) => setActiveFaqForDrawer(faq),
          onViewAllFaqs: () => setIsAllFaqsDrawerOpen(true),
      };

      if (type === 'product' && theme === 'clean') {
          return <ProductClean {...handlers} />;
      }

      return <Placeholder data={data} type={type} theme={theme} />;
  };

  return (
    <>
      <style>{`
        .preview-wrapper {
          font-family: var(--font-body);
          font-size: var(--base-size);
          line-height: 1.6;
          color: #334155;
          width: 100%;
        }
        .preview-wrapper h1 { 
            font-family: var(--font-heading);
            line-height: 1.1;
            font-weight: 800;
            font-size: var(--h1-size); 
            margin-bottom: 1rem; 
        }
        
        .clean-section { padding: var(--section-padding) 1.5rem; }
        
        .clean-btn {
          border-radius: var(--btn-radius);
          padding: 0.85rem 1rem;
          font-weight: 800;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.72rem;
          white-space: nowrap;
          min-height: 3.5rem;
        }

        .attachment-card {
            background-color: white;
            border-radius: 2.5rem;
            border: 1px solid #e2e8f0;
            padding: 2rem;
            transition: all 0.3s ease;
            position: relative;
        }
        .dark .attachment-card {
            background-color: #111827;
            border-color: #334155;
        }

        .title-underline {
            height: 4px;
            width: 32px;
            border-radius: 999px;
            background-color: var(--theme-color);
            margin-top: 6px;
            margin-bottom: 1.5rem;
        }

        .arch-frame {
            border-radius: 12rem 12rem 12rem 12rem;
            width: 100%;
            aspect-ratio: 4 / 5;
            background-color: var(--card-bg);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .step-connector {
            position: absolute;
            left: 17px;
            top: 24px;
            bottom: -24px;
            width: 2px;
            background-color: #e2e8f0;
            z-index: 0;
        }
        .dark .step-connector { background-color: #334155; }

        .custom-story-drawer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -110%;
            background: white;
            z-index: 700;
            border-top-left-radius: 2.5rem;
            border-top-right-radius: 2.5rem;
            box-shadow: 0 -10px 40px -10px rgba(0,0,0,0.3);
            max-height: 85%;
            display: flex;
            flex-direction: column;
            transform: translateY(110%);
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .custom-story-drawer.open {
            bottom: 0;
            transform: translateY(0);
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
        }
        .dark .custom-story-drawer { background: #0f172a; border-top: 1px solid #334155; }

        .checkout-drawer {
            position: absolute;
            top: 0;
            right: -100%;
            bottom: 0;
            width: 100%;
            background: white;
            z-index: 600;
            transition: right 0.4s cubic-bezier(0.32, 0.72, 0, 1);
            display: flex;
            flex-direction: column;
        }
        .checkout-drawer.open {
            right: 0;
        }
        .dark .checkout-drawer { background: #0f172a; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .track-line {
            width: 2px;
            background-color: #e2e8f0;
            height: 100%;
            position: absolute;
            left: 15px;
            top: 24px;
            z-index: 1;
        }
        .track-line-active {
            background-color: #10b981;
        }

        .map-real-bg {
            background-image: url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/1000x1000?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.r_68_f3YXYByJ9as-kyMsA');
            background-size: cover;
            background-position: center;
            transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.3s ease;
        }
        .dark .map-real-bg {
            background-image: url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/1000x1000?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.r_68_f3YXYByJ9as-kyMsA');
        }
      `}</style>

      {isMobile ? (
        <div 
          className="mx-auto w-full max-w-[375px] h-full max-h-[850px] rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative transition-all duration-500"
          style={{ backgroundColor: data.pageBgColor }}
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           
           <div className="absolute inset-0 overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950 z-[1]" style={previewStyle}>
              {renderActiveTemplate()}
           </div>

           <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                  <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </div>
           </div>

           <div className={`custom-story-drawer ${isBenefitsDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Benefits</h3>
                  <button onClick={() => setIsBenefitsDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-4">
                  {data.products[0]?.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: data.pageBgColor }}><Check size={14} className="text-white" strokeWidth={4} /></div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{b}</p>
                    </div>
                  ))}
              </div>
           </div>

           <div className={`custom-story-drawer ${isUsageDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Usage Steps</h3>
                  <button onClick={() => setIsUsageDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-8 relative">
                  {data.products[0]?.usageSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-5 relative">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 font-black text-sm" style={{ borderColor: data.pageBgColor, color: data.pageBgColor }}>
                              {idx + 1}
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 pt-1.5 leading-relaxed">{step}</p>
                      </div>
                  ))}
              </div>
           </div>

           <div className={`custom-story-drawer ${activeFaqForDrawer ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Question</h3>
                  <button onClick={() => setActiveFaqForDrawer(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-base font-black text-slate-900 dark:text-white mb-4">{activeFaqForDrawer?.question}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeFaqForDrawer?.answer}</p>
              </div>
           </div>

           <div className={`custom-story-drawer ${isAllFaqsDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">All FAQs</h3>
                  <button onClick={() => setIsAllFaqsDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-6">
                  {data.faqs.map((faq, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><span style={{ color: data.pageBgColor }}>Q.</span> {faq.question}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">{faq.answer}</p>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="mx-auto w-full max-w-[700px] min-h-full bg-white dark:bg-slate-950 shadow-2xl relative preview-wrapper" style={previewStyle}>
                {renderActiveTemplate()}
                <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''} max-w-sm border-l border-slate-100 shadow-2xl z-[600]`}>
                    <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
                </div>

                <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
                  <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
                  <div className="flex justify-between items-center px-6 pt-4 pb-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                      <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                  </div>
                </div>
                
                {/* FAQ Drawer for Desktop constrained to 700px */}
                <div className={`custom-story-drawer ${activeFaqForDrawer ? 'open' : ''}`}>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
                    <div className="flex justify-between items-center px-6 pt-4 pb-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Question</h3>
                        <button onClick={() => setActiveFaqForDrawer(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                        <p className="text-base font-black text-slate-900 dark:text-white mb-4">{activeFaqForDrawer?.question}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeFaqForDrawer?.answer}</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

// Fix: Added default export for PreviewPanel to resolve Error in file pages/SalesPageBuilder.tsx on line 7
export default PreviewPanel;
