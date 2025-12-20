
import React, { useState, useEffect } from 'react';
import { SalesPage, FaqItem, CurrencyCode } from '../../../../types/salesPage';
import { 
  Check, MessageCircle, ShoppingBag, BookOpen, Zap, ListChecks, 
  CheckCircle, ChevronDown, Package, ArrowRight, Quote, Star, Award, CalendarDays, Shield, Globe
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

const ProductClean: React.FC<ProductCleanProps> = ({ 
    data, onOpenCheckout, onReadMoreStory, onReadMoreBenefits, onReadMoreUsage, onOpenFaq, onViewAllFaqs 
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // --- CURRENCY CONVERSION STATE ---
  const [visitorCurrency, setVisitorCurrency] = useState<CurrencyCode | null>(null);
  const [convertedMainPrice, setConvertedMainPrice] = useState<ConversionResult | null>(null);
  const [convertedPackPrice, setConvertedPackPrice] = useState<ConversionResult | null>(null);

  const product = data.products[0];
  const images = product?.images || [];
  const faqs = data.faqs || [];
  const testimonials = data.testimonials || [];

  // Buyer Side: Auto-detect location and convert
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
  const iconColor = data.pageBgColor;

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <header className="clean-section pt-16 pb-12 flex flex-col items-center text-center transition-all duration-500 overflow-hidden" style={{ backgroundColor: data.pageBgColor }}>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70 ${textColorClass}`}>{product?.category || 'Quality Wellness'}</span>
        <h1 className={`max-w-[95%] mx-auto mb-10 leading-[1.1] ${textColorClass}`}>{product?.name || data.title}</h1>
        
        <div className="w-[82%] max-w-[320px] mb-10 relative">
            <div className="arch-frame relative shadow-2xl">
                {images.map((img, idx) => (
                    <img key={idx} src={img} className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} />
                ))}
            </div>
        </div>

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

      {/* 5. TESTIMONIALS */}
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
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-left border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <div className="relative z-10">
                  <div className="flex flex-col gap-8">
                      <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Official Store Pricing</span>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Standard Selection</p>
                            
                            {/* DYNAMIC CONVERTED PRICE DISPLAY */}
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

                      {data.fullPackPrice > 0 && (
                          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-default">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Exclusive Full Pack</p>
                                <p className="text-3xl font-black text-white">
                                    {convertedPackPrice?.isConverted 
                                        ? `${convertedPackPrice.currency} ${Math.round(convertedPackPrice.amount).toLocaleString()}` 
                                        : `${data.currency} ${data.fullPackPrice.toLocaleString()}`}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Save more with our bulk case</p>
                              </div>
                              <div className="p-4 bg-emerald-500/20 rounded-2xl">
                                <Package size={32} className="text-emerald-500" />
                              </div>
                          </div>
                      )}
                      
                      <button 
                        onClick={onOpenCheckout} 
                        className="w-full py-5 rounded-[1.5rem] font-black text-sm bg-emerald-500 text-slate-950 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] transition-all active:scale-95 hover:bg-emerald-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 group"
                      >
                        Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* 8. WHY BUY FROM ME */}
      <div className="px-6 py-6 mb-12 bg-white dark:bg-slate-950">
          <div className="relative pt-12 pb-8 px-8 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Star size={120} strokeWidth={1} className="text-slate-900 dark:text-white" />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 transform group-hover:rotate-0 transition-transform">
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

                  <div className="text-center space-y-4 w-full">
                      <div>
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Your Certified Mentor</p>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase leading-none font-heading tracking-tight">{data.authorHandle || 'Official Partner'}</h3>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                              <Award size={14} className="text-emerald-500" />
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase">{data.personalBranding?.rank || 'FBO Member'}</span>
                          </div>
                          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                              <CalendarDays size={14} className="text-blue-500" />
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase">{data.personalBranding?.yearsExperience || '0'}+ Years Experience</span>
                          </div>
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

const HelpCircle = ({ size, color, strokeWidth }: { size: number, color?: string, strokeWidth?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);

export default ProductClean;
