
import React, { useState, useEffect } from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, 
  MessageCircle, ChevronLeft, ChevronRight, Maximize2, 
  X, Leaf, ShieldCheck, Heart, Sparkles, Plus, ArrowDown, HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  const isMobile = device === 'mobile';
  
  // Design System Calculations
  const settings = isMobile && data.mobileOverrides ? { ...data, ...data.mobileOverrides } : data;
  const baseSize = settings.baseFontSize || 16;
  const scaleRatio = settings.typeScale || 1.25;
  const spacingValue = settings.sectionSpacing ?? 5;
  
  const h1Size = Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const h2Size = Math.round(baseSize * Math.pow(scaleRatio, 3)); 
  const h3Size = Math.round(baseSize * Math.pow(scaleRatio, 2)); 
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
        .preview-wrapper h1, .preview-wrapper h2, .preview-wrapper h3 {
          font-family: var(--font-heading);
          line-height: 1.1;
          font-weight: 800;
        }
        .preview-wrapper h1 { font-size: var(--h1-size); margin-bottom: 1rem; }
        .preview-wrapper h2 { font-size: var(--h2-size); margin-bottom: 1rem; }
        .preview-wrapper h3 { font-size: var(--h3-size); margin-bottom: 1rem; }
        
        .clean-section { padding: var(--section-padding) 1.5rem; }
        
        .clean-btn {
          border-radius: var(--btn-radius);
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .clean-btn:active { transform: scale(0.96); }

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

        .mini-arch {
            border-radius: 2rem 2rem 2rem 2rem;
            width: 2.5rem;
            height: 3.5rem;
            background-color: var(--card-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px -2px rgba(0,0,0,0.2);
        }

        .fade-in-slide {
            animation: fadeInSlide 0.8s ease-out forwards;
        }

        @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {isMobile ? (
        <div className="mx-auto w-full max-w-[375px] h-full max-h-[850px] bg-slate-900 rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>
           <div className="h-full overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950" style={previewStyle}>
              <CleanThemeContent data={data} isMobile={true} />
           </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper" style={previewStyle}>
            <CleanThemeContent data={data} isMobile={false} />
        </div>
      )}
    </>
  );
};

const CleanThemeContent: React.FC<{ data: SalesPage; isMobile: boolean }> = ({ data, isMobile }) => {
  const [activeImg, setActiveImg] = useState(0);
  const product = data.products[0];
  const images = product?.images || [];
  const whatsappMsg = data.whatsappMessage?.replace('{title}', data.title) || "";

  // Auto-slide logic for product images
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
        setActiveImg((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, [images.length]);
  
  // Curated logic for text color on background
  const isDarkBg = data.pageBgColor === '#064e3b' || data.pageBgColor === '#111827' || data.pageBgColor === '#1e1b4b' || data.pageBgColor === '#4c0519' || data.pageBgColor === '#000000';
  const textColorClass = isDarkBg ? 'text-white' : 'text-slate-900';
  const subtextColorClass = isDarkBg ? 'text-white/60' : 'text-slate-500';

  // Per instructions: catchy headline = problem/solution field (product.name), support phrase = promise/support field (product.category)
  const mainHeadline = product?.name || data.title || 'Main Catchy Headline';
  const supportPhrase = product?.category || data.subtitle || 'Your Support Phrase Here';

  return (
    <div className="flex flex-col">
      {/* 1. BRANDED HERO HEADER */}
      <header 
        className="clean-section pt-16 md:pt-24 pb-16 flex flex-col items-center text-center transition-colors duration-500 overflow-hidden"
        style={{ backgroundColor: data.pageBgColor }}
      >
        {/* Promise/Support (Small Text) */}
        <span 
            className={`text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-4 opacity-80 animate-fade-in ${textColorClass}`}
        >
            {supportPhrase}
        </span>

        {/* Main Headline (Problem/Solution) */}
        <h1 
            className={`max-w-[90%] mx-auto mb-10 leading-[1.05] tracking-tight animate-slide-up ${textColorClass}`}
        >
            {mainHeadline}
        </h1>

        {/* THE SIGNATURE ARCH FRAME WITH AUTO-SLIDER */}
        <div className="w-[85%] max-w-[300px] mb-12 relative">
            <div className="arch-frame relative group">
                {images.length > 0 ? (
                    images.map((img, idx) => (
                        <img 
                            key={idx}
                            src={img} 
                            alt={`Product View ${idx + 1}`} 
                            className={`absolute inset-0 w-full h-full object-cover p-2 transition-all duration-1000 ease-in-out ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon size={48} />
                        <span className="text-xs font-bold mt-2">Product Photo</span>
                    </div>
                )}
            </div>
            
            {/* Slide Indicators */}
            {images.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-500 ${activeImg === idx ? 'w-4 bg-white shadow-sm' : 'w-1 bg-white/30'}`}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* CREDIBILITY BADGES - In mini arched frames, matching cardBgColor */}
        <div className="flex flex-wrap justify-center gap-4 w-full px-4 mt-4">
            {data.badges.map((badgeId, idx) => (
                <div key={badgeId} className="flex flex-col items-center gap-1.5 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="mini-arch">
                        <ShieldCheck size={18} className="text-slate-900" strokeWidth={2.5} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${textColorClass} opacity-60`}>
                        {badgeId.replace('_', ' ')}
                    </span>
                </div>
            ))}
        </div>

        {/* Scroll Hint */}
        <div className="mt-10 animate-bounce opacity-40">
            <ArrowDown className={`${textColorClass}`} size={20} />
        </div>
      </header>

      {/* 2. PRODUCT DETAILS SECTION */}
      <section className="clean-section bg-white dark:bg-slate-950">
          <div className="space-y-6">
              <div className="flex justify-between items-baseline pt-4 border-b border-slate-100 pb-6 dark:border-slate-800">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">
                        {product?.name || 'Product Title'}
                    </h2>
                    <p className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-widest">{product?.category || 'Quality Natural Support'}</p>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                          {data.currency} {product?.price || '0.00'}
                      </span>
                  </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {product?.shortDescription}
              </p>

              <div className="space-y-4 pt-4">
                  {product?.benefits.slice(0, 5).map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{b}</span>
                    </div>
                  ))}
              </div>

              <div className="pt-8 space-y-4">
                {data.ctaDisplay.showHero && data.ctas.map(cta => (
                    <a 
                        key={cta.id}
                        href={cta.actionType === 'WHATSAPP' ? `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}` : '#'}
                        className="clean-btn w-full py-5 text-lg shadow-xl"
                        style={{ 
                            backgroundColor: cta.style === 'primary' ? data.themeColor : 'transparent',
                            color: cta.style === 'primary' ? 'white' : data.themeColor,
                            border: cta.style === 'outline' ? `2px solid ${data.themeColor}` : 'none'
                        }}
                    >
                        {cta.actionType === 'WHATSAPP' && <MessageCircle size={20} fill="white" />}
                        {cta.label}
                    </a>
                ))}
              </div>
          </div>
      </section>

      {/* 3. STORY / DESCRIPTION */}
      <section className="clean-section bg-slate-50 dark:bg-slate-900/50">
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: data.description }} />
      </section>

      {/* 4. EXPERT BIO */}
      <section className="clean-section">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-2xl">
                    {data.personalBranding.photoUrl ? (
                        <img src={data.personalBranding.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl font-bold">
                            {data.personalBranding.rank?.charAt(0) || 'F'}
                        </div>
                    )}
                  </div>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-2">Personal Mentor</span>
                  <h3 className="text-white text-xl md:text-2xl mb-4 font-heading">Connect with {data.personalBranding.rank || 'an Expert'}</h3>
                  <p className="text-slate-400 text-sm italic leading-relaxed px-2">
                      "{data.personalBranding.bio || "Supporting your health journey with high-quality Forever products."}"
                  </p>
                  
                  <div className="flex gap-6 pt-6">
                      <div className="text-center">
                          <p className="text-xl font-bold text-white">{data.personalBranding.yearsExperience}+</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Years</p>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                      <div className="text-center">
                          <p className="text-xl font-bold text-emerald-400">{data.personalBranding.rank || 'FBO'}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Status</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="clean-section text-center space-y-6 pb-32">
          <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-[10px] text-slate-400 leading-relaxed italic uppercase tracking-wider">
                  {data.disclaimer}
              </p>
              <div className="pt-8 text-xs text-slate-500">
                  <p className="font-bold text-slate-800 dark:text-white">{data.title}</p>
                  <p>&copy; {new Date().getFullYear()} Forever Business Owner.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default PreviewPanel;
