
import React, { useState, useEffect } from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Minus, Send, Loader2, Package, Quote, ShieldCheck, ArrowDown, Plus, X, ChevronUp, Sparkles, Zap, Star, HelpCircle, Tag, ArrowRight, ShoppingBag
} from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  const isMobile = device === 'mobile';
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
  const [isBenefitsDrawerOpen, setIsBenefitsDrawerOpen] = useState(false);
  const [isUsageDrawerOpen, setIsUsageDrawerOpen] = useState(false);
  const [isFaqDrawerOpen, setIsFaqDrawerOpen] = useState(false);
  
  // Design System Calculations
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

  const whatsappMsg = data.whatsappMessage?.replace('{title}', data.title) || "";

  return (
    <>
      <style>{`
        .preview-wrapper {
          font-family: var(--font-body);
          font-size: var(--base-size);
          line-height: 1.6;
          color: #334155;
          width: 100%;
          height: 100%;
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
          padding: 0.85rem 1.25rem;
          font-weight: 800;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
        }

        /* Reference Image Card Style: Flat, Rounded, Simple Border */
        .attachment-card {
            background-color: white;
            border-radius: 2.5rem;
            border: 1px solid #f1f5f9;
            padding: 2rem;
            transition: all 0.3s ease;
        }
        .dark .attachment-card {
            background-color: #1e293b;
            border-color: #334155;
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

        /* Drawer: Bottom Up Logic */
        .custom-story-drawer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -110%;
            background: white;
            z-index: 500;
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

        /* Checkout Drawer: Slide from Right */
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

        .zigzag-line {
          position: absolute;
          left: 1.75rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: repeating-linear-gradient(
            to bottom,
            var(--page-bg) 0px,
            var(--page-bg) 10px,
            transparent 10px,
            transparent 20px
          );
          opacity: 0.3;
        }
      `}</style>

      {isMobile ? (
        <div 
          className="mx-auto w-full max-w-[375px] h-full max-h-[850px] rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative transition-colors duration-500"
          style={{ backgroundColor: data.pageBgColor }}
        >
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           
           {/* Page Content */}
           <div className="absolute inset-0 overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950 z-[1]" style={previewStyle}>
              <CleanThemeContent 
                data={data} 
                onOpenCheckout={() => setIsCheckoutOpen(true)} 
                onReadMoreStory={() => setIsStoryDrawerOpen(true)}
                onReadMoreBenefits={() => setIsBenefitsDrawerOpen(true)}
                onReadMoreUsage={() => setIsUsageDrawerOpen(true)}
                onReadMoreFaq={() => setIsFaqDrawerOpen(true)}
              />
           </div>

           {/* Checkout Side Drawer (Slides from Right) */}
           <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           {/* Drawers (Slide from bottom) */}
           <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle}</h3>
                  <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </div>
           </div>

           {/* ... Other drawers (Benefits, Usage, FAQ) follow same logic as StoryDrawer ... */}
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
        </div>
      ) : (
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper relative" style={previewStyle}>
            <CleanThemeContent 
                data={data} 
                onOpenCheckout={() => setIsCheckoutOpen(true)} 
                onReadMoreStory={() => alert('Full Story View')}
                onReadMoreBenefits={() => alert('All Benefits View')}
                onReadMoreUsage={() => alert('Full Usage Path View')}
                onReadMoreFaq={() => alert('All FAQs View')}
            />
            {/* Desktop Side Drawer */}
            <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''} max-w-sm border-l border-slate-100 shadow-2xl`}>
                <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
            </div>
        </div>
      )}
    </>
  );
};

const CleanThemeContent: React.FC<{ 
    data: SalesPage; 
    onOpenCheckout: () => void;
    onReadMoreStory: () => void;
    onReadMoreBenefits: () => void;
    onReadMoreUsage: () => void;
    onReadMoreFaq: () => void;
}> = ({ data, onOpenCheckout, onReadMoreStory, onReadMoreBenefits, onReadMoreUsage, onReadMoreFaq }) => {
  const [activeImg, setActiveImg] = useState(0);
  const product = data.products[0];
  const images = product?.images || [];
  const testimonials = data.testimonials || [];
  const faqs = data.faqs || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setActiveImg((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const isDarkBg = data.pageBgColor === '#064e3b' || data.pageBgColor === '#111827' || data.pageBgColor === '#000000';
  const textColorClass = isDarkBg ? 'text-white' : 'text-slate-900';

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <header className="clean-section pt-16 pb-12 flex flex-col items-center text-center transition-colors duration-500 overflow-hidden" style={{ backgroundColor: data.pageBgColor }}>
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 opacity-80 ${textColorClass}`}>{product?.category || 'Wellness'}</span>
        <h1 className={`max-w-[90%] mx-auto mb-10 leading-[1.1] ${textColorClass}`}>{product?.name || data.title}</h1>
        <div className="w-[80%] max-w-[300px] mb-12 relative">
            <div className="arch-frame relative">
                {images.map((img, idx) => (
                    <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
            </div>
        </div>
        
        {/* Buttons: If direct checkout enabled, show two buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full px-6 max-w-[400px]">
            <button className="clean-btn flex-1 text-white" style={{ backgroundColor: data.themeColor }}><MessageCircle size={18} /> Order Now</button>
            {data.checkoutConfig?.enabled && (
                <button onClick={onOpenCheckout} className="clean-btn flex-1 bg-white text-slate-900 shadow-xl border border-slate-200">
                    <ShoppingBag size={18} /> Checkout
                </button>
            )}
        </div>
      </header>

      {/* 2. STORY - ATTACHMENT STYLE */}
      {data.description && (
          <div className="px-6 py-6 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{data.shortStoryTitle || 'The Story'}</h3>
                  <div className="h-1 w-10 mb-6 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-[8]">{data.description}</p>
                  <button onClick={onReadMoreStory} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-6">Read Full Story <ArrowRight size={14} /></button>
              </div>
          </div>
      )}

      {/* 3. BENEFITS - ATTACHMENT STYLE */}
      {product?.benefits?.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Exclusive Benefits</h3>
                  <div className="grid grid-cols-1 gap-5">
                      {product.benefits.slice(0, 4).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-700">
                                  <Check size={14} className="text-emerald-500" strokeWidth={4} />
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{benefit}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* 4. FAQ - ATTACHMENT STYLE */}
      {faqs.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Frequently Asked</h3>
                  <div className="space-y-6">
                      {faqs.slice(0, 3).map((faq, idx) => (
                          <div key={idx} className="space-y-1">
                              <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><span className="text-emerald-500">Q.</span> {faq.question}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">{faq.answer}</p>
                          </div>
                      ))}
                  </div>
                  {faqs.length > 3 && (
                    <button onClick={onReadMoreFaq} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-8">View All Questions <ArrowRight size={14} /></button>
                  )}
              </div>
          </div>
      )}

      {/* 5. PRICE CARD - RECTANGULAR ATTACHMENT STYLE */}
      <div className="px-6 py-10 bg-white dark:bg-slate-950">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-left border border-slate-800">
              <div className="relative z-10 space-y-8">
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Official Pricing</h3>
                  <div className="space-y-6">
                      <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Single Unit</p>
                            <p className="text-4xl font-black text-white">{data.currency} {product?.price?.toLocaleString()}</p>
                          </div>
                          {product?.discountPrice && (
                              <div className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">Discounted</div>
                          )}
                      </div>
                      {data.fullPackPrice > 0 && (
                          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center">
                              <div>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Full Pack Box</p>
                                <p className="text-2xl font-black text-white">{data.currency} {data.fullPackPrice.toLocaleString()}</p>
                              </div>
                              <Package size={24} className="text-emerald-500 opacity-50" />
                          </div>
                      )}
                  </div>
                  <button onClick={onOpenCheckout} className="w-full py-5 rounded-2xl font-black text-sm bg-emerald-500 text-slate-900 shadow-xl transition-transform active:scale-95 uppercase tracking-widest">Add to Cart</button>
              </div>
          </div>
      </div>

      <footer className="clean-section text-center space-y-6 pb-32 bg-white dark:bg-slate-950">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest max-w-[80%] mx-auto leading-relaxed">{data.disclaimer}</p>
          <div className="pt-10 text-[10px] text-slate-500 uppercase font-black tracking-widest">
              <p className="text-slate-800 dark:text-white mb-1">{data.title}</p>
              <p>&copy; {new Date().getFullYear()} Forever FBO.</p>
          </div>
      </footer>
    </div>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const product = data.products[0];
  const total = (product?.price || 0) * quantity;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex items-center px-6 py-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-800 dark:text-white"><ChevronLeft size={28} strokeWidth={3} /></button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white ml-2 uppercase tracking-tight">Cart</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
          {/* Product Summary */}
          <div className="flex gap-5 items-start">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 p-2 shrink-0 overflow-hidden dark:bg-slate-800">
                  <img src={product?.images[0]} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase leading-tight truncate">{product?.name}</h3>
                  <p className="text-xl font-black text-emerald-600 mt-1">{data.currency} {product?.price?.toLocaleString()}</p>
              </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl dark:bg-slate-800">
              <span className="text-xs font-black uppercase text-slate-500">Amount</span>
              <div className="flex items-center gap-4 bg-white dark:bg-slate-700 border border-slate-100 rounded-full px-2 py-1 shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-600 text-slate-900 dark:text-white"><Minus size={14} strokeWidth={4}/></button>
                  <span className="text-base font-black w-6 text-center dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 text-white"><Plus size={14} strokeWidth={4}/></button>
              </div>
          </div>

          {/* Payments */}
          <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pay With</h3>
              <div className="space-y-2">
                  {['momo', 'card', 'cod'].map(method => (
                      <div key={method} onClick={() => setSelectedPayment(method)} className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedPayment === method ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <span className="font-bold text-sm text-slate-800 dark:text-white capitalize">{method === 'momo' ? 'Mobile Money' : method === 'card' ? 'Credit Card' : 'Cash on Delivery'}</span>
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedPayment === method ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`} />
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="p-8 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/30">
          <div className="flex justify-between items-end mb-6">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{data.currency} {total.toLocaleString()}</span>
          </div>
          <button disabled={!selectedPayment} className="w-full py-5 rounded-2xl font-black text-sm bg-slate-900 text-white uppercase tracking-widest shadow-xl disabled:opacity-30 transition-all active:scale-95 dark:bg-emerald-600">Place Order</button>
      </div>
    </div>
  );
};

export default PreviewPanel;
