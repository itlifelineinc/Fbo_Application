
import React, { useState, useEffect, useRef } from 'react';
import { SalesPage, FaqItem, CurrencyCode } from '../../../../types/salesPage';
import { 
  Check, MessageCircle, ShoppingBag, BookOpen, Zap, ListChecks, 
  CheckCircle, ChevronDown, Package, ArrowRight, Quote, Star, Award, CalendarDays, Shield, Globe, ShieldCheck, Leaf, Heart, Sparkles, HelpCircle
} from 'lucide-react';
import { currencyService, ConversionResult } from '../../../../services/currencyService';

interface ProductCleanProps {
    data: SalesPage;
    onOpenCheckout: () => void;
    onReadMoreStory: () => void;
    onReadMoreBenefits: () => void;
    onReadMoreUsage: () => void;
    onOpenFaq: (faq: FaqItem) => void;
    onViewAllFaqs: () => void;
}

const BADGES_MAP: Record<string, { label: string, icon: any }> = {
    'iasc': { label: 'Certified', icon: Leaf },
    'guarantee': { label: 'Risk Free', icon: ShieldCheck },
    'cruelty_free': { label: 'Ethical', icon: Heart },
    'kosher': { label: 'Kosher', icon: CheckCircle },
    'halal': { label: 'Halal', icon: CheckCircle },
    'natural': { label: 'Natural', icon: Sparkles },
};

const getContrastColor = (hexcolor: string) => {
    if (!hexcolor || hexcolor === 'transparent') return 'text-slate-900';
    const hex = hexcolor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'text-slate-900' : 'text-white';
};

const ProductClean: React.FC<ProductCleanProps> = ({ 
    data, onOpenCheckout, onReadMoreStory, onReadMoreBenefits, onReadMoreUsage, onOpenFaq, onViewAllFaqs 
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [heroButtonVisible, setHeroButtonVisible] = useState(true);
  const heroButtonRef = useRef<HTMLAnchorElement>(null);
  
  const [visitorCurrency, setVisitorCurrency] = useState<CurrencyCode | null>(null);
  const [convertedMainPrice, setConvertedMainPrice] = useState<ConversionResult | null>(null);
  const [convertedPackPrice, setConvertedPackPrice] = useState<ConversionResult | null>(null);

  const product = data.products[0];
  const images = product?.images || [];
  const faqs = data.faqs || [];
  const testimonials = data.testimonials || [];
  const activeBadges = (data.badges || []).map(id => BADGES_MAP[id]).filter(Boolean);

  // WhatsApp Link Generation
  const whatsappUrl = React.useMemo(() => {
    if (!data.whatsappNumber) return '#';
    const cleanNumber = data.whatsappNumber.replace(/\D/g, '');
    const message = data.whatsappMessage.replace('{title}', product?.name || data.title);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [data.whatsappNumber, data.whatsappMessage, data.title, product?.name]);

  // Observer to check if Hero WhatsApp button is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroButtonRef.current) {
      observer.observe(heroButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const runConversion = async () => {
        const localCurr = await currencyService.detectVisitorCurrency();
        setVisitorCurrency(localCurr);
        if (product?.price) {
            const mainRes = await currencyService.convertPrice(product.price, data.currency, localCurr);
            setConvertedMainPrice(mainRes);
        }
        if (data.fullPackPrice) {
            const packRes = await currencyService.convertPrice(data.fullPackPrice, data.currency, localCurr);
            setConvertedPackPrice(packRes);
        }
    };
    runConversion();
  }, [data.currency, product?.price, data.fullPackPrice]);

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
  
  const accentContrast = getContrastColor(data.themeColor);
  const footerContrast = getContrastColor(data.pageBgColor);

  return (
    <div className="flex flex-col relative">
      {/* Smart Floating WhatsApp Button */}
      {data.ctaDisplay?.showFloatingWhatsapp && !heroButtonVisible && (
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-6 z-[60] w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-500 animate-in fade-in zoom-in-50 slide-in-from-bottom-10 active:scale-90"
          >
              <MessageCircle size={28} fill="currentColor" />
          </a>
      )}

      {/* 1. HERO */}
      <header className="clean-section pt-16 pb-12 flex flex-col items-center text-center transition-all duration-500 overflow-hidden" style={{ backgroundColor: data.pageBgColor }}>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70 ${textColorClass}`}>{product?.category || 'Quality Wellness'}</span>
        <h1 className={`max-w-[95%] mx-auto mb-10 leading-[1.1] ${textColorClass}`}>{product?.name || data.title}</h1>
        
        <div className="w-[82%] max-w-[320px] mb-8 relative">
            <div className="arch-frame relative shadow-2xl">
                {images.map((img, idx) => (
                    <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
            </div>
        </div>

        {activeBadges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-10 px-6 max-w-[400px]">
                {activeBadges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 opacity-80">
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <badge.icon size={18} className="text-white" />
                        </div>
                        <span className="text-[7px] font-black text-white uppercase tracking-widest whitespace-nowrap">{badge.label}</span>
                    </div>
                ))}
            </div>
        )}
        
        <div className="flex flex-row gap-3 w-full px-5 max-w-[440px]">
            <a 
                ref={heroButtonRef}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`clean-btn flex-1 shadow-xl border border-white/10 active:scale-95 ${accentContrast}`} 
                style={{ backgroundColor: data.themeColor }}
            >
                <MessageCircle size={16} strokeWidth={4} /> WhatsApp
            </a>
            {data.checkoutConfig?.enabled && (
                <button onClick={onOpenCheckout} className="clean-btn flex-1 bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg active:scale-95">
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
                      <BookOpen size={18} style={{ color: data.themeColor }} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{data.shortStoryTitle || 'The Story'}</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-[10]">{data.description}</p>
                  {data.description.length > 500 && (
                      <button onClick={onReadMoreStory} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-8" style={{ color: data.themeColor }}>
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
                      <Zap size={18} style={{ color: data.themeColor }} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Exclusive Benefits</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <div className="grid grid-cols-1 gap-5">
                      {product.benefits.slice(0, 4).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-900">
                                  <Check size={14} style={{ color: data.themeColor }} strokeWidth={4} />
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{benefit}</p>
                          </div>
                      ))}
                  </div>
                  {product.benefits.length > 4 && (
                      <button onClick={onReadMoreBenefits} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-8" style={{ color: data.themeColor }}>
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
                      <ListChecks size={18} style={{ color: data.themeColor }} strokeWidth={4} />
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Usage Guide</h3>
                  </div>
                  <div className="title-underline" style={{ backgroundColor: data.themeColor }}></div>
                  <div className="space-y-8 relative">
                      {product.usageSteps.slice(0, 3).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-5 relative">
                              {idx < Math.min(product.usageSteps.length, 3) - 1 && <div className="step-connector"></div>}
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-white border-2 text-blue-600 font-black text-sm z-10 dark:bg-slate-900" style={{ borderColor: data.themeColor, color: data.themeColor }}>
                                  {idx + 1}
                              </div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 pt-1.5 leading-relaxed">{step}</p>
                          </div>
                      ))}
                  </div>
                  {product.usageSteps.length > 3 && (
                      <button onClick={onReadMoreUsage} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mt-10" style={{ color: data.themeColor }}>
                        View Full Steps <ChevronDown size={14} strokeWidth={4} />
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left flex flex-col p-8">
                  <Quote size={32} className="text-slate-200 dark:text-slate-800 mb-4" fill="currentColor" />
                  <p className="text-base text-slate-800 dark:text-slate-200 italic font-bold leading-relaxed mb-8">
                      "{testimonials[activeTestimonial]?.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                          {testimonials[activeTestimonial]?.photoUrl ? (
                              <img src={testimonials[activeTestimonial].photoUrl} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-black text-slate-400 uppercase">
                                  {testimonials[activeTestimonial]?.name?.charAt(0)}
                              </div>
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{testimonials[activeTestimonial]?.name}</h4>
                              <div className="bg-emerald-50 rounded-full p-0.5 shadow-sm border border-white dark:border-slate-800 shrink-0">
                                  <ShieldCheck size={12} className="text-white" fill="currentColor" />
                              </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Verified Customer</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 6. FAQ */}
      {faqs.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-slate-950">
              <div className="attachment-card text-left">
                  <div className="flex items-center gap-3">
                      <HelpCircle size={18} style={{ color: data.themeColor }} strokeWidth={4} />
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
                                  <span style={{ color: data.themeColor }}>Q.</span> {faq.question}
                              </p>
                              <ChevronDown size={18} className="text-slate-300 shrink-0 ml-4" />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* 7. PRICE CARD */}
      <div className="px-6 py-10 bg-white dark:bg-slate-950">
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-left border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                  <div className="flex flex-col gap-8">
                      <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Official Store Pricing</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Standard Selection</p>
                            {convertedMainPrice?.isConverted ? (
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-emerald-500 text-lg font-black">{convertedMainPrice.currency}</span>
                                        <span className="text-5xl font-black text-white tracking-tighter">{Math.round(convertedMainPrice.amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Globe size={10} className="text-emerald-500" />
                                        <span>Local Estimate (Original: {data.currency} {product?.price.toLocaleString()})</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-emerald-500 text-lg font-black">{data.currency}</span>
                                    <span className="text-5xl font-black text-white tracking-tighter">{product?.price?.toLocaleString()}</span>
                                </div>
                            )}
                          </div>
                      </div>

                      <button 
                        onClick={onOpenCheckout} 
                        className={`w-full py-5 rounded-[1.5rem] font-black text-sm shadow-xl transition-all active:scale-95 hover:brightness-110 uppercase tracking-[0.2em] flex items-center justify-center gap-2 group ${accentContrast}`}
                        style={{ backgroundColor: data.themeColor }}
                      >
                        Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* 8. WHY BUY FROM ME */}
      <div className="px-6 pt-6 pb-0 bg-white dark:bg-slate-950">
          <div className="relative pt-12 pb-10 px-8 rounded-t-[3rem] bg-slate-50 dark:bg-slate-900 border-x border-t border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Star size={120} strokeWidth={1} className="text-slate-900 dark:text-white" />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 transform">
                          {data.personalBranding?.photoUrl ? (
                              <img src={data.personalBranding.photoUrl} className="w-full h-full object-cover" alt="Mentor" />
                          ) : (
                              <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-4xl font-black text-emerald-600">
                                  {data.personalBranding?.rank?.charAt(0) || 'N'}
                              </div>
                          )}
                      </div>
                      <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900">
                          <Check size={20} strokeWidth={4} />
                      </div>
                  </div>

                  <div className="text-center space-y-6 w-full">
                      <div className="px-2">
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Nexu Verified Expert</p>
                          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase leading-tight font-heading tracking-tight">Verified Forever Business Owner</h3>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-[0.1em]">
                          <span className="flex items-center gap-1.5"><Award size={14} style={{ color: data.themeColor }} /> {data.personalBranding?.rank || 'FBO Member'}</span>
                          <span className="w-px h-3 bg-slate-200 dark:bg-slate-700"></span>
                          <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-blue-500" /> {data.personalBranding?.yearsExperience || '0'}+ Years As FBO</span>
                      </div>
                      <div className="relative px-4">
                          <Quote size={20} className="absolute -top-2 -left-2 text-slate-200 dark:text-slate-700 opacity-50" />
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                              {data.personalBranding?.bio || "Committed to helping you achieve your wellness goals through nature's finest ingredients."}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* MODERNIZED FOOTER - REDUCED BOTTOM PADDING */}
      <footer className={`text-center space-y-4 pb-12 pt-10 px-6 transition-all duration-500 ${footerContrast}`} style={{ backgroundColor: data.pageBgColor }}>
          <p className="text-[9px] uppercase font-black tracking-[0.25em] max-w-[85%] mx-auto leading-relaxed opacity-70">{data.disclaimer}</p>
          <div className="pt-8 border-t border-current/10 mx-6">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">{data.title}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">&copy; {new Date().getFullYear()} Nexu Growth Academy</p>
          </div>
      </footer>
    </div>
  );
};

export default ProductClean;
