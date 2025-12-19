
import React, { useState, useEffect } from 'react';
import { SalesPage, Product, FaqItem } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Minus, Send, Loader2, Package, Quote, ShieldCheck, ArrowDown, Plus, X, ChevronUp, Sparkles, Zap, Star, HelpCircle, Tag, ArrowRight, ShoppingBag, BookOpen, ListChecks, Shield, CheckCircle, ChevronDown, Wallet, Building2, CreditCard as CardIcon
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
  const [activeFaqForDrawer, setActiveFaqForDrawer] = useState<FaqItem | null>(null);
  const [isAllFaqsDrawerOpen, setIsAllFaqsDrawerOpen] = useState(false);
  
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
      `}</style>

      {isMobile ? (
        <div 
          className="mx-auto w-full max-w-[375px] h-full max-h-[850px] rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative transition-colors duration-500"
          style={{ backgroundColor: data.pageBgColor }}
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           
           <div className="absolute inset-0 overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950 z-[1]" style={previewStyle}>
              <CleanThemeContent 
                data={data} 
                onOpenCheckout={() => setIsCheckoutOpen(true)} 
                onReadMoreStory={() => setIsStoryDrawerOpen(true)}
                onReadMoreBenefits={() => setIsBenefitsDrawerOpen(true)}
                onReadMoreUsage={() => setIsUsageDrawerOpen(true)}
                onOpenFaq={(faq) => setActiveFaqForDrawer(faq)}
                onViewAllFaqs={() => setIsAllFaqsDrawerOpen(true)}
              />
           </div>

           <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           {/* Generic Bottom Drawer for Expanded Content */}
           <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                  <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
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
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper relative" style={previewStyle}>
            <CleanThemeContent 
                data={data} 
                onOpenCheckout={() => setIsCheckoutOpen(true)} 
                onReadMoreStory={() => alert('Full Story View')}
                onReadMoreBenefits={() => alert('All Benefits View')}
                onReadMoreUsage={() => alert('Full Usage Path View')}
                onOpenFaq={(faq) => alert(`FAQ: ${faq.answer}`)}
                onViewAllFaqs={() => alert('All FAQs')}
            />
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
    onOpenFaq: (faq: FaqItem) => void;
    onViewAllFaqs: () => void;
}> = ({ data, onOpenCheckout, onReadMoreStory, onReadMoreBenefits, onReadMoreUsage, onOpenFaq, onViewAllFaqs }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const product = data.products[0];
  const images = product?.images || [];
  const faqs = data.faqs || [];
  const testimonials = data.testimonials || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setActiveImg((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const isDarkBg = data.pageBgColor === '#064e3b' || data.pageBgColor === '#111827' || data.pageBgColor === '#000000' || data.pageBgColor === '#1e1b4b' || data.pageBgColor === '#4c0519';
  const textColorClass = isDarkBg ? 'text-white' : 'text-slate-900';
  const iconColor = data.pageBgColor;

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <header className="clean-section pt-16 pb-12 flex flex-col items-center text-center transition-colors duration-500 overflow-hidden" style={{ backgroundColor: data.pageBgColor }}>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70 ${textColorClass}`}>{product?.category || 'Quality Wellness'}</span>
        <h1 className={`max-w-[95%] mx-auto mb-10 leading-[1.1] ${textColorClass}`}>{product?.name || data.title}</h1>
        
        <div className="w-[82%] max-w-[320px] mb-10 relative">
            <div className="arch-frame relative shadow-2xl">
                {images.map((img, idx) => (
                    <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
            </div>
        </div>

        {/* CREDIBILITY BADGES */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 w-full px-6">
            <div className="flex flex-col items-center gap-1.5 opacity-80">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Shield size={18} className="text-white" />
                </div>
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">Certified</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 opacity-80">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <CheckCircle size={18} className="text-white" />
                </div>
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">Quality</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 opacity-80">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Zap size={18} className="text-white" />
                </div>
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">Natural</span>
            </div>
        </div>
        
        <div className="flex flex-row gap-3 w-full px-5 max-w-[440px]">
            <button className="clean-btn flex-1 bg-white text-slate-900 shadow-xl border border-slate-100">
                <MessageCircle size={16} strokeWidth={4} color={iconColor} /> WhatsApp
            </button>
            {data.checkoutConfig?.enabled && (
                <button onClick={onOpenCheckout} className="clean-btn flex-1 bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg">
                    <ShoppingBag size={16} strokeWidth={4} /> Checkout
                </button>
            )}
        </div>
      </header>

      {/* 2. STORY */}
      {data.description && (
          <div className="px-6 py-6 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <div className="flex items-center gap-3">
                      <BookOpen size={18} color={iconColor} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{data.shortStoryTitle || 'The Story'}</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-[10]">{data.description}</p>
                  {data.description.length > 500 && (
                      <button onClick={onReadMoreStory} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-8" style={{ color: iconColor }}>
                        Read More <ChevronDown size={14} strokeWidth={4} />
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* 3. BENEFITS */}
      {product?.benefits?.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <div className="flex items-center gap-3">
                      <Zap size={18} color={iconColor} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Exclusive Benefits</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <div className="grid grid-cols-1 gap-5">
                      {product.benefits.slice(0, 4).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-900/20">
                                  <Check size={14} color={iconColor} strokeWidth={4} />
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{benefit}</p>
                          </div>
                      ))}
                  </div>
                  {product.benefits.length > 4 && (
                      <button onClick={onReadMoreBenefits} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-8" style={{ color: iconColor }}>
                        View More <ChevronDown size={14} strokeWidth={4} />
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* 4. USAGE STEPS */}
      {product?.usageSteps?.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <div className="flex items-center gap-3">
                      <ListChecks size={18} color={iconColor} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Usage Guide</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <div className="space-y-8 relative">
                      {product.usageSteps.slice(0, 3).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-5 relative">
                              {idx < Math.min(product.usageSteps.length, 3) - 1 && <div className="step-connector"></div>}
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-blue-50 border-2 border-blue-100 text-blue-600 font-black text-sm z-10 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300" style={{ borderColor: iconColor, color: iconColor }}>
                                  {idx + 1}
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 pt-1.5 leading-relaxed">{step}</p>
                          </div>
                      ))}
                  </div>
                  {product.usageSteps.length > 3 && (
                      <button onClick={onReadMoreUsage} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-10" style={{ color: iconColor }}>
                        View Full Steps <ChevronDown size={14} strokeWidth={4} />
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* 5. TESTIMONIALS (Sliding Card) */}
      {testimonials.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-4">
                      {testimonials[activeTestimonial]?.photoUrl ? (
                          <img src={testimonials[activeTestimonial].photoUrl} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-black text-slate-400">{testimonials[activeTestimonial]?.name?.charAt(0)}</div>
                      )}
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mb-0.5">{testimonials[activeTestimonial]?.name}</h4>
                  <div className="flex items-center gap-1.5 mb-5">
                      <div className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                          <CheckCircle size={8} /> Verified Buyer
                      </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic font-bold leading-relaxed">
                      "{testimonials[activeTestimonial]?.quote}"
                  </p>
                  {testimonials.length > 1 && (
                      <div className="flex gap-1.5 mt-6">
                          {testimonials.map((_, i) => (
                              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'w-4 bg-emerald-500' : 'w-1 bg-slate-200 dark:bg-slate-700'}`} />
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* 6. FAQ */}
      {faqs.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <div className="flex items-center gap-3">
                      <HelpCircle size={18} color={iconColor} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Common Questions</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <div className="space-y-4">
                      {faqs.slice(0, 4).map((faq, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => onOpenFaq(faq)}
                            className="w-full flex items-center justify-between text-left group"
                          >
                              <p className="text-sm font-black text-slate-900 dark:text-white flex items-start gap-2 leading-tight group-active:text-emerald-600 transition-colors">
                                  <span style={{ color: iconColor }}>Q.</span> {faq.question}
                              </p>
                              <ChevronDown size={18} className="text-slate-300 shrink-0 ml-4 group-active:text-emerald-500" />
                          </button>
                      ))}
                  </div>
                  {faqs.length > 4 && (
                    <button onClick={onViewAllFaqs} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-8" style={{ color: iconColor }}>
                        See All Questions <ChevronDown size={14} strokeWidth={4} />
                    </button>
                  )}
              </div>
          </div>
      )}

      {/* 7. PRICE CARD */}
      <div className="px-6 py-10 bg-white dark:bg-slate-950">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-left border border-slate-800">
              <div className="relative z-10 space-y-8">
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Store Official Pricing</h3>
                  <div className="space-y-6">
                      <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Standard Unit</p>
                            <p className="text-4xl font-black text-white">{data.currency} {product?.price?.toLocaleString()}</p>
                          </div>
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
                  <button onClick={onOpenCheckout} className="w-full py-5 rounded-2xl font-black text-sm bg-emerald-500 text-slate-900 shadow-xl transition-transform active:scale-95 uppercase tracking-widest">Complete Purchase</button>
              </div>
          </div>
      </div>

      <footer className="clean-section text-center space-y-6 pb-32 bg-white dark:bg-slate-950">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.15em] max-w-[85%] mx-auto leading-relaxed">{data.disclaimer}</p>
          <div className="pt-10 text-[10px] text-slate-500 uppercase font-black tracking-widest">
              <p className="text-slate-800 dark:text-white mb-1">{data.title}</p>
              <p>&copy; {new Date().getFullYear()} Nexu Growth Academy</p>
          </div>
      </footer>
    </div>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
  const [packageType, setPackageType] = useState<'single' | 'full'>('single');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<string | null>(null); // 'momo' | 'card' | 'bank' | 'processing' | 'success'
  const [momoNumber, setMomoNumber] = useState('');
  
  const product = data.products[0];
  const unitPrice = packageType === 'full' ? (data.fullPackPrice || product?.price) : product?.price || 0;
  const shipping = data.checkoutConfig.shipping.enabled ? (data.checkoutConfig.shipping.flatRate || 0) : 0;
  const total = unitPrice + shipping;
  const iconColor = data.pageBgColor;

  const handlePaymentSubmit = (method: string) => {
      setSelectedPayment(method);
      if (['momo', 'card', 'bank'].includes(method)) {
          setPaymentStep(method);
      } else if (method === 'cod') {
          // Instant success for COD simulation
          setPaymentStep('success');
      }
  };

  const handleConfirmAction = () => {
      setPaymentStep('processing');
      setTimeout(() => setPaymentStep('success'), 2000);
  };

  if (paymentStep === 'success') {
      return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-950 items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 dark:bg-emerald-900/30">
                  <CheckCircle size={64} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Order Success!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Your order has been placed successfully. You will receive a confirmation message shortly.</p>
              <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm dark:bg-emerald-600">Back to Page</button>
          </div>
      );
  }

  if (paymentStep === 'processing') {
      return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-950 items-center justify-center p-8 text-center">
              <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-xs">Processing Payment...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative">
      {/* Drawer Overlay for Inputs */}
      <div className={`absolute inset-x-0 bottom-0 z-[800] bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 ease-in-out border-t border-slate-100 dark:border-slate-800 ${paymentStep ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-2"></div>
          <div className="p-8 pb-12">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      {paymentStep === 'momo' ? <Smartphone size={20}/> : paymentStep === 'card' ? <CardIcon size={20}/> : <Building2 size={20}/>}
                      {paymentStep === 'momo' ? 'Mobile Money' : paymentStep === 'card' ? 'Card Details' : 'Bank Transfer'}
                  </h3>
                  <button onClick={() => setPaymentStep(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>

              {paymentStep === 'momo' && (
                  <div className="space-y-6">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">MoMo Number</label>
                          <div className="relative">
                              <input 
                                type="tel" 
                                value={momoNumber}
                                onChange={e => setMomoNumber(e.target.value)}
                                placeholder="0XX XXX XXXX"
                                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-mono text-lg dark:text-white"
                              />
                              <button onClick={handleConfirmAction} className="absolute right-3 top-3 p-3 bg-emerald-500 text-white rounded-xl shadow-lg active:scale-90 transition-transform">
                                  <Send size={20} />
                              </button>
                          </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">You will receive a prompt on your phone to authorize the payment.</p>
                  </div>
              )}

              {paymentStep === 'card' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Card Number</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiry</label>
                              <input type="text" placeholder="MM/YY" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-mono" />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                              <input type="text" placeholder="123" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-mono" />
                          </div>
                      </div>
                      <button onClick={handleConfirmAction} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm mt-4 dark:bg-emerald-600">Pay {data.currency} {total.toLocaleString()}</button>
                  </div>
              )}

              {paymentStep === 'bank' && (
                  <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Name</span>
                              <span className="text-sm font-black dark:text-white">EcoBank Ghana</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Account Name</span>
                              <span className="text-sm font-black dark:text-white">Nexu Growth Academy</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Account Number</span>
                              <span className="text-sm font-black font-mono dark:text-white">144100234567</span>
                          </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic text-center px-4 leading-relaxed">Please make the transfer and tap the button below. Your order will be processed after confirmation.</p>
                      <button onClick={handleConfirmAction} className="w-full py-5 bg-emerald-500 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm">I have made the transfer</button>
                  </div>
              )}
          </div>
      </div>

      <div className="flex items-center px-6 py-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950 z-10">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-800 dark:text-white"><ChevronLeft size={28} strokeWidth={3} /></button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white ml-2 uppercase tracking-tight font-heading">Secure Checkout</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
          {/* Package Selection */}
          {data.fullPackPrice > 0 && (
              <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Offer</h3>
                  <div className="grid grid-cols-1 gap-3">
                      <div 
                          onClick={() => setPackageType('single')}
                          className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${packageType === 'single' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-100 bg-slate-50 dark:bg-slate-800'}`}
                      >
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${packageType === 'single' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}><ShoppingCart size={18}/></div>
                              <div>
                                  <p className="font-black text-sm text-slate-900 dark:text-white">Single Unit</p>
                                  <p className="text-xs text-slate-500">{data.currency} {product?.price.toLocaleString()}</p>
                              </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${packageType === 'single' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                              {packageType === 'single' && <Check size={14} className="text-white" strokeWidth={4} />}
                          </div>
                      </div>

                      <div 
                          onClick={() => setPackageType('full')}
                          className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${packageType === 'full' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-100 bg-slate-50 dark:bg-slate-800'}`}
                      >
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${packageType === 'full' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}><Package size={18}/></div>
                              <div>
                                  <p className="font-black text-sm text-slate-900 dark:text-white">Full Pack Case</p>
                                  <p className="text-xs text-slate-500">{data.currency} {data.fullPackPrice.toLocaleString()}</p>
                              </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${packageType === 'full' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                              {packageType === 'full' && <Check size={14} className="text-white" strokeWidth={4} />}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* Item Breakdown Card */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3 items-center">
                    <img src={product?.images[0]} className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-100 p-1" />
                    <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate max-w-[150px]">{product?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{packageType === 'full' ? 'Full Pack' : 'Single Unit'}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black dark:text-white">{data.currency} {unitPrice.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                      <span className="font-bold dark:text-slate-300">{data.currency} {unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-widest">Shipping</span>
                      <span className="font-bold text-emerald-600">{shipping === 0 ? 'FREE' : `${data.currency} ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 items-end">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Grand Total</span>
                      <span className="text-xl font-black text-emerald-600">{data.currency} {total.toLocaleString()}</span>
                  </div>
              </div>
          </div>

          {/* Payments */}
          <div className="space-y-4 pb-10">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Method</h3>
              <div className="grid grid-cols-1 gap-2">
                  {data.checkoutConfig.paymentMethods.mobileMoney && (
                      <button onClick={() => setSelectedPayment('momo')} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'momo' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-3">
                              <Smartphone size={20} className="text-yellow-600"/>
                              <span className="font-bold text-sm text-slate-800 dark:text-white">Mobile Money</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedPayment === 'momo' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.card && (
                      <button onClick={() => setSelectedPayment('card')} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'card' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-3">
                              <CardIcon size={20} className="text-indigo-600"/>
                              <span className="font-bold text-sm text-slate-800 dark:text-white">Credit / Debit Card</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedPayment === 'card' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.bankTransfer && (
                      <button onClick={() => setSelectedPayment('bank')} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'bank' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-3">
                              <Building2 size={20} className="text-blue-600"/>
                              <span className="font-bold text-sm text-slate-800 dark:text-white">Bank Transfer</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedPayment === 'bank' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.cashOnDelivery && (
                      <button onClick={() => setSelectedPayment('cod')} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'cod' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-3">
                              <Wallet size={20} className="text-green-600"/>
                              <span className="font-bold text-sm text-slate-800 dark:text-white">Cash on Delivery</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedPayment === 'cod' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`} />
                      </button>
                  )}
              </div>
          </div>
      </div>

      <div className="p-8 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/30">
          <button 
              disabled={!selectedPayment} 
              onClick={() => selectedPayment && handlePaymentSubmit(selectedPayment)}
              className="w-full py-5 rounded-2xl font-black text-sm bg-slate-900 text-white uppercase tracking-widest shadow-xl disabled:opacity-30 transition-all active:scale-95 dark:bg-emerald-600"
          >
              Place Order Now
          </button>
      </div>
    </div>
  );
};

export default PreviewPanel;
