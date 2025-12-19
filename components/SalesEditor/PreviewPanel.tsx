
import React, { useState, useEffect } from 'react';
import { SalesPage, Product } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Minus, Send, Loader2, Package, Quote, ShieldCheck, ArrowDown, Plus, X, ChevronUp, Sparkles, Zap, Star, HelpCircle, Tag
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
          padding: 0.85rem 1.5rem;
          font-weight: 800;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }

        .arch-frame {
            border-radius: 12rem 12rem 12rem 12rem;
            width: 100%;
            aspect-ratio: 4 / 6;
            background-color: var(--card-bg);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
        }

        /* Drawer Fix: Double-Locked Hiding (Bottom Offset + Transform + Visibility) */
        .custom-story-drawer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -100%; /* Move physically outside the parent boundary */
            background: white;
            z-index: 500;
            border-top-left-radius: 2rem;
            border-top-right-radius: 2rem;
            box-shadow: 0 -15px 40px -15px rgba(0,0,0,0.4);
            max-height: 85%;
            display: flex;
            flex-direction: column;
            transform: translateY(100%); /* Extra insurance to bury it */
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), 
                        bottom 0.4s cubic-bezier(0.32, 0.72, 0, 1),
                        visibility 0.4s step-end, 
                        opacity 0.3s ease-in;
        }
        .custom-story-drawer.open {
            bottom: 0; /* Align to visible bottom */
            transform: translateY(0);
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
            transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), 
                        bottom 0.4s cubic-bezier(0.32, 0.72, 0, 1),
                        visibility 0s step-start, 
                        opacity 0.2s ease-out;
        }
        .dark .custom-story-drawer { background: #0f172a; border-top: 1px solid #334155; }

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
          style={{ backgroundColor: data.pageBgColor }} // Match parent BG to page BG to kill gaps
        >
           {/* Notch */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           
           {/* Page Content - absolute inset-0 forces it to cover the entire inner area of the phone frame */}
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

           {/* Checkout View */}
           <div className={`absolute inset-0 z-[200] bg-white transition-transform duration-400 ${isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'} dark:bg-slate-900`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           {/* Full Story Drawer */}
           <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2 shrink-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {data.shortStoryTitle || 'Full Story'}
                  </h3>
                  <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {data.description}
                  </p>
              </div>
           </div>

           {/* Benefits Drawer */}
           <div className={`custom-story-drawer ${isBenefitsDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2 shrink-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Benefits</h3>
                  <button onClick={() => setIsBenefitsDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-4 text-left">
                  {data.products[0]?.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: data.pageBgColor }}>
                            <Check size={14} className="text-white" strokeWidth={4} />
                        </div>
                        <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-tight">{b}</p>
                    </div>
                  ))}
              </div>
           </div>

           {/* Usage Steps Drawer */}
           <div className={`custom-story-drawer ${isUsageDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2 shrink-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Usage Guide</h3>
                  <button onClick={() => setIsUsageDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-6 text-left">
                  {data.products[0]?.usageSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg border-2 border-white dark:border-slate-800 shrink-0" style={{ backgroundColor: data.pageBgColor, color: 'white' }}>
                            {i + 1}
                        </div>
                        <p className="text-base font-bold text-slate-700 dark:text-slate-200">{s}</p>
                    </div>
                  ))}
              </div>
           </div>

           {/* FAQ Drawer */}
           <div className={`custom-story-drawer ${isFaqDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2 shrink-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Questions</h3>
                  <button onClick={() => setIsFaqDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 space-y-6 text-left">
                  {data.faqs.map((f, i) => (
                    <div key={i} className="space-y-2">
                        <h4 className="font-black text-slate-900 dark:text-white text-base flex items-start gap-2">
                            <span className="text-emerald-500">Q:</span> {f.question}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">{f.answer}</p>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper relative" style={previewStyle}>
            {data.ctaDisplay.showFloatingWhatsapp && (
              <WhatsAppFloatingButton 
                phoneNumber={data.whatsappNumber} 
                message={whatsappMsg} 
                isVisible={true} 
                className="fixed bottom-10 right-10 z-50"
              />
            )}
            <CleanThemeContent 
                data={data} 
                onOpenCheckout={() => setIsCheckoutOpen(true)} 
                onReadMoreStory={() => alert('Full Story View')}
                onReadMoreBenefits={() => alert('All Benefits View')}
                onReadMoreUsage={() => alert('Full Usage Path View')}
                onReadMoreFaq={() => alert('All FAQs View')}
            />
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const product = data.products[0];
  const images = product?.images || [];
  const testimonials = data.testimonials || [];
  const faqs = data.faqs || [];

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
  
  const isDarkBg = data.pageBgColor === '#064e3b' || data.pageBgColor === '#111827' || data.pageBgColor === '#000000';
  const textColorClass = isDarkBg ? 'text-white' : 'text-slate-900';

  const storyContent = data.description || '';
  const displayStory = storyContent.length > 500 ? storyContent.substring(0, 500) + '...' : storyContent;

  const benefits = product?.benefits || [];
  const displayBenefits = benefits.slice(0, 4);

  const usageSteps = product?.usageSteps || [];
  const displayUsage = usageSteps.slice(0, 3);

  const displayFaqs = faqs.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <header className="clean-section pt-16 pb-12 flex flex-col items-center text-center transition-colors duration-500 overflow-hidden" style={{ backgroundColor: data.pageBgColor }}>
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 opacity-80 ${textColorClass}`}>{product?.category || 'Wellness'}</span>
        <h1 className={`max-w-[90%] mx-auto mb-10 leading-[1.1] ${textColorClass}`}>{product?.name || data.title}</h1>
        <div className="w-[85%] max-w-[300px] mb-12 relative">
            <div className="arch-frame relative group">
                {images.map((img, idx) => (
                    <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
            </div>
        </div>
        <div className="flex flex-col gap-3 w-full px-8 max-w-[340px]">
            <button onClick={onOpenCheckout} className="clean-btn w-full text-white" style={{ backgroundColor: data.themeColor }}><ShoppingCart size={18} /> Order Now</button>
        </div>
      </header>

      {/* 2. STORY */}
      {storyContent && (
          <div className="px-6 py-10 relative bg-white dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">{data.shortStoryTitle || 'Story'}</h3>
                  <div className="h-1.5 w-10 mb-6 rounded-full" style={{ backgroundColor: data.pageBgColor }}></div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{displayStory}</p>
                  {storyContent.length > 500 && (
                      <button onClick={onReadMoreStory} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-6">Read More <ChevronUp size={14} strokeWidth={4} /></button>
                  )}
              </div>
          </div>
      )}

      {/* 3. BENEFITS */}
      {benefits.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8">Benefits</h3>
                  <div className="grid grid-cols-1 gap-4">
                      {displayBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: data.pageBgColor }}>
                                  <Check size={14} className="text-white" strokeWidth={4} />
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{benefit}</p>
                          </div>
                      ))}
                  </div>
                  {benefits.length > 4 && (
                    <button onClick={onReadMoreBenefits} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-8">View All <ChevronUp size={14} strokeWidth={4} /></button>
                  )}
              </div>
          </div>
      )}

      {/* 4. USAGE */}
      {usageSteps.length > 0 && (
          <div className="px-6 py-10 bg-white dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-10">Steps</h3>
                  <div className="relative space-y-12">
                      <div className="zigzag-line" style={{ '--page-bg': data.pageBgColor } as React.CSSProperties}></div>
                      {displayUsage.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-8 relative z-10">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-4 border-white dark:border-slate-800 shrink-0 shadow-lg" style={{ backgroundColor: data.pageBgColor, color: 'white' }}>{idx + 1}</div>
                              <p className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">{step}</p>
                          </div>
                      ))}
                  </div>
                  {usageSteps.length > 3 && (
                    <button onClick={onReadMoreUsage} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-12">Full Path <ChevronUp size={14} strokeWidth={4} /></button>
                  )}
              </div>
          </div>
      )}

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-6">
                      {testimonials[activeTestimonial].photoUrl ? (
                          <img src={testimonials[activeTestimonial].photoUrl} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-black text-slate-400">{testimonials[activeTestimonial].name.charAt(0)}</div>
                      )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{testimonials[activeTestimonial].name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">{testimonials[activeTestimonial].role}</p>
                  <p className="text-base text-slate-700 dark:text-slate-300 italic font-bold">"{testimonials[activeTestimonial].quote}"</p>
              </div>
          </div>
      )}

      {/* 6. FAQ */}
      {faqs.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8">FAQ</h3>
                  <div className="space-y-6">
                      {displayFaqs.map((faq, idx) => (
                          <div key={idx} className="space-y-2">
                              <p className="text-sm font-black text-slate-900 dark:text-white flex items-start gap-2"><span className="text-emerald-500">Q:</span> {faq.question}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">{faq.answer}</p>
                          </div>
                      ))}
                  </div>
                  {faqs.length > 3 && (
                    <button onClick={onReadMoreFaq} className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-10">Read More FAQs <ChevronUp size={14} strokeWidth={4} /></button>
                  )}
              </div>
          </div>
      )}

      {/* 7. PRICE CARD */}
      <div className="px-6 py-10 bg-white dark:bg-slate-950">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-left">
              <Tag size={120} strokeWidth={1} className="absolute top-0 right-0 text-white opacity-5 rotate-12" />
              <div className="relative z-10 space-y-8">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Official Pricing</h3>
                  <div className="space-y-6">
                      <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Single Unit</p>
                            <p className="text-3xl font-black text-white">{data.currency} {product?.price?.toLocaleString()}</p>
                          </div>
                          {product?.discountPrice && (
                              <div className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">Special Discount</div>
                          )}
                      </div>
                      {data.fullPackPrice > 0 && (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Full Package Box</p>
                                <Package size={14} className="text-emerald-500" />
                              </div>
                              <p className="text-xl font-black text-white">{data.currency} {data.fullPackPrice.toLocaleString()}</p>
                          </div>
                      )}
                  </div>
                  <button onClick={onOpenCheckout} className="w-full py-4 rounded-xl font-black text-lg bg-emerald-500 text-slate-900 shadow-xl active:scale-95 transition-all">CHECKOUT NOW</button>
              </div>
          </div>
      </div>

      <footer className="clean-section text-center space-y-6 pb-32 bg-white dark:bg-slate-950">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider italic">{data.disclaimer}</p>
          <div className="pt-8 text-[10px] text-slate-500 uppercase font-bold">
              <p className="text-slate-800 dark:text-white">{data.title}</p>
              <p>&copy; {new Date().getFullYear()} Forever Business Owner.</p>
          </div>
      </footer>
    </div>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [buyFullPack, setBuyFullPack] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const product = data.products[0];
  const unitPrice = buyFullPack && data.fullPackPrice ? data.fullPackPrice : (product?.price || 0);
  const total = unitPrice * quantity;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative font-sans">
      <div className="flex items-center px-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-800 dark:text-white"><ChevronLeft size={28} strokeWidth={3} /></button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white ml-2">Checkout</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-4 text-left">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 p-1 shrink-0 overflow-hidden">
                      <img src={product?.images[0]} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Item</p>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{product?.name}</h3>
                      <p className="text-sm font-black text-emerald-600">{data.currency} {unitPrice.toLocaleString()}</p>
                  </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-white"><Minus size={14} strokeWidth={3}/></button>
                      <span className="text-base font-black text-slate-900 dark:text-white w-6 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-white"><Plus size={14} strokeWidth={3}/></button>
                  </div>
              </div>
          </div>
          <div className="space-y-4 text-left">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Payment Method</h3>
              <div className="grid grid-cols-1 gap-3">
                  {['momo', 'card', 'cod'].map(method => (
                      <div key={method} onClick={() => setSelectedPayment(method)} className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedPayment === method ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800'}`}>
                          <span className="font-bold text-sm text-slate-800 dark:text-white capitalize">{method === 'momo' ? 'Mobile Money' : method === 'card' ? 'Credit Card' : 'Cash on Delivery'}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'}`}>
                              {selectedPayment === method && <Check size={12} strokeWidth={4} />}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white mb-4">
              <span>Total</span>
              <span>{data.currency} {total.toLocaleString()}</span>
          </div>
          <button disabled={!selectedPayment} className="w-full clean-btn text-white py-5 shadow-xl disabled:opacity-50" style={{ backgroundColor: selectedPayment ? data.themeColor : '#94a3b8' }}>Complete Order</button>
      </div>
    </div>
  );
};

export default PreviewPanel;
