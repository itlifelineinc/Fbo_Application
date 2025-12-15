
import React, { useState, useEffect } from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, MessageCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  
  // --- DYNAMIC DESIGN SYSTEM ---
  const fontFamilyHeading = data.headingFont || 'Lexend';
  const fontFamilyBody = data.bodyFont || 'Noto Sans';
  const baseSize = data.baseFontSize || 16;
  const subtitleSize = data.subtitleFontSize || 20; // New variable
  const scaleRatio = data.typeScale || 1.25;
  const spacingValue = data.sectionSpacing ?? 5; // 0 to 10

  // Calculate Header Sizes based on Modular Scale
  const h1Size = Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const h2Size = Math.round(baseSize * Math.pow(scaleRatio, 3)); 
  const h3Size = Math.round(baseSize * Math.pow(scaleRatio, 2)); 
  const smallSize = Math.round(baseSize * 0.85);

  const sectionPaddingRem = 1 + (spacingValue * 0.7); 
  
  // Button Styles Logic
  const btnCorner = data.buttonCorner || 'pill';
  const btnSize = data.buttonSize || 'md';
  const radius = btnCorner === 'pill' ? '9999px' : btnCorner === 'rounded' ? '0.75rem' : '0px';
  
  // Size Map (Normal)
  const paddingMap = {
      sm: '0.5rem 1rem', // px-4 py-2
      md: '0.75rem 1.5rem', // px-6 py-3
      lg: '1rem 2rem' // px-8 py-4
  };
  const fontSizeMap = {
      sm: '0.75rem', // text-xs
      md: '0.875rem', // text-sm
      lg: '1.125rem' // text-lg
  };

  const previewStyle = {
      '--font-heading': `'${fontFamilyHeading}', sans-serif`,
      '--font-body': `'${fontFamilyBody}', sans-serif`,
      '--base-size': `${baseSize}px`,
      '--subtitle-size': `${subtitleSize}px`, // Inject subtitle size
      '--h1-size': `${h1Size}px`,
      '--h2-size': `${h2Size}px`,
      '--h3-size': `${h3Size}px`,
      '--small-size': `${smallSize}px`,
      '--theme-color': data.themeColor || '#10b981',
      '--section-padding': `${sectionPaddingRem}rem`,
      '--gap-size': `${sectionPaddingRem * 0.5}rem`,
      
      // Button Vars
      '--btn-radius': radius,
      '--btn-padding': paddingMap[btnSize],
      '--btn-font-size': fontSizeMap[btnSize],
      
      // Hero Button Vars (One size up logic)
      '--btn-hero-padding': btnSize === 'sm' ? paddingMap['md'] : btnSize === 'md' ? paddingMap['lg'] : '1.25rem 2.5rem',
      '--btn-hero-font-size': btnSize === 'sm' ? fontSizeMap['md'] : btnSize === 'md' ? fontSizeMap['lg'] : '1.25rem',

  } as React.CSSProperties;

  const scrollbarStyles = (
    <style>{`
      .preview-wrapper {
        font-family: var(--font-body);
        font-size: var(--base-size);
        line-height: 1.6;
        color: #334155;
      }
      .preview-wrapper h1, .preview-wrapper h2, .preview-wrapper h3, .preview-wrapper h4 {
        font-family: var(--font-heading);
        line-height: 1.2;
        margin-bottom: 0.5em;
        color: #0f172a;
      }
      .preview-wrapper h1 { font-size: var(--h1-size); }
      .preview-wrapper h2 { font-size: var(--h2-size); }
      .preview-wrapper h3 { font-size: var(--h3-size); }
      
      .preview-section {
        padding-top: var(--section-padding);
        padding-bottom: var(--section-padding);
      }
      
      .preview-gap {
        gap: var(--gap-size);
      }

      .preview-btn {
        border-radius: var(--btn-radius);
        padding: var(--btn-padding);
        font-size: var(--btn-font-size);
      }

      .preview-btn-hero {
        border-radius: var(--btn-radius);
        padding: var(--btn-hero-padding);
        font-size: var(--btn-hero-font-size);
      }

      .dark .preview-wrapper { color: #cbd5e1; }
      .dark .preview-wrapper h1, .dark .preview-wrapper h2 { color: #ffffff; }

      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );

  if (device === 'desktop') {
    return (
      <>
        {scrollbarStyles}
        <div 
            className="w-full h-full relative overflow-hidden bg-slate-200 dark:bg-slate-900 rounded-xl md:rounded-none border border-slate-200 md:border-0 shadow-sm preview-wrapper"
            style={previewStyle}
        >
           <div className="w-full h-full overflow-y-auto scroll-smooth no-scrollbar bg-white dark:bg-slate-950 transition-colors">
              <PreviewContent data={data} device={device} />
           </div>
           
           <WhatsAppFloatingButton 
              phoneNumber={data.whatsappNumber} 
              isVisible={true} 
              className="absolute bottom-8 right-8"
           />
        </div>
      </>
    );
  }

  // Mobile View
  return (
    <div 
        className="mx-auto w-full max-w-[375px] h-full max-h-[850px] bg-white rounded-[2.5rem] shadow-2xl border-[10px] md:border-[12px] border-slate-900 overflow-hidden relative ring-1 ring-black/10 shrink-0 flex flex-col my-auto dark:bg-slate-950 dark:border-slate-800 preview-wrapper"
        style={previewStyle}
    >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20 pointer-events-none"></div>
        
        {/* Scrollable Content */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth bg-white relative dark:bg-slate-950 transition-colors">
            <PreviewContent data={data} device={device} />
            <div className="h-6"></div>
        </div>

        <WhatsAppFloatingButton 
            phoneNumber={data.whatsappNumber} 
            isVisible={true} 
            className="absolute bottom-4 right-4"
        />
        
        {scrollbarStyles}
    </div>
  );
};

// --- Extracted Content Component ---

const PreviewContent: React.FC<{ 
    data: SalesPage; 
    device: 'mobile' | 'desktop'; 
}> = ({ data, device }) => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [packageIndex, setPackageIndex] = useState(0);
  
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (data.testimonials.length === 0) return;
    const itemsVisible = device === 'mobile' ? 1 : 3;
    if (data.testimonials.length <= itemsVisible) return;

    const interval = setInterval(() => {
        setTestimonialIndex((prev) => {
            const maxIndex = data.testimonials.length - itemsVisible;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, 4000); 

    return () => clearInterval(interval);
  }, [data.testimonials.length, device]);

  useEffect(() => {
    if (data.packages.length === 0) return;
    const itemsVisible = device === 'mobile' ? 1 : 3;
    if (data.packages.length <= itemsVisible) return;

    const interval = setInterval(() => {
        setPackageIndex((prev) => {
            const maxIndex = data.packages.length - itemsVisible;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, 5000); 

    return () => clearInterval(interval);
  }, [data.packages.length, device]);

  useEffect(() => {
      setTestimonialIndex(0);
      setPackageIndex(0);
      setGalleryIndex(0);
  }, [device]);

  const getIcon = (name?: string) => {
    switch(name) {
        case 'shopping-cart': return <ShoppingCart size={20} />;
        case 'arrow-right': return <ArrowRight size={20} />;
        case 'check': return <CheckCircle size={20} />;
        case 'whatsapp': return <MessageCircle size={20} />;
        default: return null;
    }
  };

  const renderCTA = (cta: CTAButton, isHero: boolean = false) => {
      const baseClass = `${isHero ? 'preview-btn-hero' : 'preview-btn'} font-bold transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2`;
      
      let style: React.CSSProperties = {};
      let className = baseClass;
      
      const btnColor = cta.color || data.themeColor;

      if (cta.style === 'primary') {
          style = { backgroundColor: btnColor, color: '#fff', boxShadow: `0 10px 25px -5px ${btnColor}66` };
      } else if (cta.style === 'outline') {
          style = { border: `2px solid ${isHero ? '#e2e8f0' : btnColor}`, color: isHero ? '#334155' : btnColor, backgroundColor: 'transparent' };
          className = baseClass.replace('shadow-xl', 'shadow-sm hover:bg-slate-50'); 
      } else if (cta.style === 'link') {
          style = { color: btnColor, textDecoration: 'underline', padding: '0', boxShadow: 'none' };
          className = "font-bold text-sm hover:opacity-80 transition-opacity flex items-center gap-1 preview-btn"; // Link style ignores heavy sizing usually
      }

      return (
          <a 
            key={cta.id}
            href={cta.url || '#'}
            className={className}
            style={style}
          >
            {getIcon(cta.icon)}
            {cta.label}
          </a>
      );
  };

  const renderHero = () => {
      return (
          <div className={`bg-white dark:bg-slate-950 preview-section px-6 text-center relative overflow-hidden transition-colors`}>
              <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                  <div className="w-16 h-1 rounded-full mb-8 opacity-50" style={{ backgroundColor: data.themeColor }}></div>
                  
                  <h1 className="font-extrabold tracking-tight mb-6 drop-shadow-sm">
                      {data.title || 'Your Big Headline Here'}
                  </h1>
                  
                  <p 
                    className="text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
                    style={{ fontSize: 'var(--subtitle-size)' }}
                  >
                      {data.subtitle || 'Your compelling subtitle goes here explaining the value in seconds.'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                      {data.ctas.map((cta) => renderCTA(cta, true))}
                  </div>

                  <div className="mt-12 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-60">
                      <CheckCircle size={14} /> 100% Satisfaction Guarantee
                  </div>
              </div>
          </div>
      );
  };

  const renderProductGallery = () => {
      if (!data.products.length) return null;
      
      const product = data.products[0];
      const images = product.images && product.images.length > 0 ? product.images : [];
      
      if (images.length === 0) return null;

      const currentImg = images[galleryIndex % images.length];

      const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
      const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

      const onTouchStart = (e: React.TouchEvent) => {
          setTouchEnd(null);
          setTouchStart(e.targetTouches[0].clientX);
      };
      const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
      const onTouchEnd = () => {
          if (!touchStart || !touchEnd) return;
          const distance = touchStart - touchEnd;
          const isLeftSwipe = distance > 50;
          const isRightSwipe = distance < -50;
          if (isLeftSwipe) nextImage();
          if (isRightSwipe) prevImage();
      };

      return (
          <div className={`preview-section bg-slate-50 dark:bg-slate-900/50 transition-colors`}>
              <div className="px-6 md:px-20 mb-12">
                  <h2 className="font-bold mb-4">Product Gallery</h2>
                  <div className="h-1.5 w-24 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
              </div>

              <div 
                  className="relative w-full h-[50vh] md:h-[70vh] bg-transparent flex items-center justify-center overflow-hidden touch-pan-y"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
              >
                  <img 
                      src={currentImg} 
                      alt={`Product Shot ${galleryIndex + 1}`} 
                      className="max-h-full max-w-full md:max-w-[80%] object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out px-4"
                      key={galleryIndex} 
                  />

                  {images.length > 1 && (
                      <div className="hidden md:flex absolute bottom-12 right-20 gap-4 z-20">
                          <button 
                              onClick={prevImage} 
                              className="w-14 h-14 rounded-full bg-white shadow-xl hover:scale-110 transition-all flex items-center justify-center text-slate-900 dark:bg-slate-800 dark:text-white"
                          >
                              <ChevronLeft size={24} strokeWidth={2.5} />
                          </button>
                          <button 
                              onClick={nextImage} 
                              className="w-14 h-14 rounded-full bg-white shadow-xl hover:scale-110 transition-all flex items-center justify-center text-slate-900 dark:bg-slate-800 dark:text-white"
                          >
                              <ChevronRight size={24} strokeWidth={2.5} />
                          </button>
                      </div>
                  )}

                  {images.length > 1 && (
                      <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                          {images.map((_, i) => (
                              <div 
                                  key={i} 
                                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${i === galleryIndex ? 'w-8 bg-slate-900 dark:bg-white' : 'w-2 bg-slate-300 dark:bg-slate-600'}`}
                              />
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const renderProductDetails = () => {
      if (!data.products.length) return null;
      
      return (
          <div className={`preview-section px-6 bg-white dark:bg-slate-950 transition-colors`}>
              <div className={`max-w-4xl mx-auto space-y-16`}>
                  {data.products.map(product => (
                      <div key={product.id} className={`grid grid-cols-1 md:grid-cols-2 preview-gap items-start`}>
                          <div className="space-y-6">
                              <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm dark:text-emerald-400">Specification</span>
                              <h2 className="font-bold">{product.name}</h2>
                              <p className="text-xl text-emerald-600 font-bold dark:text-emerald-400">{data.currency} {product.discountPrice || product.price}</p>
                              <p className="text-slate-600 leading-relaxed text-lg dark:text-slate-300">{product.fullDescription || product.shortDescription}</p>
                              
                              <div className="pt-4">
                                  <button style={{ backgroundColor: data.themeColor }} className="preview-btn text-white font-bold shadow-lg hover:opacity-90 transition-opacity">
                                      Add to Cart
                                  </button>
                              </div>
                          </div>

                          <div className="space-y-8">
                              {product.benefits.length > 0 && (
                                  <div className="bg-slate-50 p-8 rounded-3xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                      <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                          <Star className="text-yellow-500" size={20} fill="currentColor" /> Key Highlights
                                      </h3>
                                      <ul className="space-y-4">
                                          {product.benefits.map((b, i) => (
                                              <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300">
                                                  <div className="mt-1 bg-emerald-100 text-emerald-700 rounded-full p-1 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                      <Check size={14} strokeWidth={3} />
                                                  </div>
                                                  <span className="flex-1">{b}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}

                              {product.ingredients && product.ingredients.length > 0 && (
                                  <div>
                                      <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Ingredients</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {product.ingredients.map((ing, i) => (
                                              <span key={i} className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                  {ing}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const renderPackages = () => {
      if (!data.packages.length) return null;

      const itemsPerView = device === 'mobile' ? 1 : 3;
      const slidePercentage = 100 / itemsPerView;

      return (
          <div className={`preview-section px-6 bg-white border-t border-slate-100 dark:bg-slate-950 dark:border-slate-800 transition-colors overflow-hidden`}>
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-4 dark:text-white">Bundles & Kits</h2>
              <p className="text-center text-slate-500 mb-12 dark:text-slate-400">Save more with our exclusive packages</p>
              
              <div className="max-w-6xl mx-auto relative">
                  <div 
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${packageIndex * slidePercentage}%)` }}
                  >
                      {data.packages.map(pkg => (
                          <div 
                            key={pkg.id} 
                            className="flex-shrink-0 px-3"
                            style={{ width: `${slidePercentage}%` }}
                          >
                              <div className="w-full bg-slate-50 rounded-3xl shadow-sm overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all flex flex-col h-full dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500">
                                  {pkg.bannerImage && (
                                      <div className="h-40 bg-slate-200 dark:bg-slate-800 shrink-0">
                                          <img src={pkg.bannerImage} className="w-full h-full object-cover" />
                                      </div>
                                  )}
                                  <div className="p-6 flex-1 flex flex-col">
                                      <h3 className="font-bold mb-2">{pkg.title}</h3>
                                      <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">{pkg.description}</p>
                                      
                                      <div className="space-y-2 mb-6 flex-1">
                                          {pkg.productIds.map(pid => {
                                              const prod = data.products.find(p => p.id === pid);
                                              return prod ? (
                                                  <div key={pid} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                      {prod.name}
                                                  </div>
                                              ) : null;
                                          })}
                                      </div>

                                      <div className="mt-auto pt-4 border-t border-slate-200 flex items-end justify-between dark:border-slate-700">
                                          <div>
                                              {pkg.specialPrice && (
                                                  <span className="text-xs text-slate-400 line-through block dark:text-slate-500">Total: {data.currency}{pkg.totalPrice}</span>
                                              )}
                                              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                  {data.currency}{pkg.specialPrice || pkg.totalPrice}
                                              </span>
                                          </div>
                                          <button style={{ backgroundColor: data.themeColor }} className="preview-btn text-white text-sm font-bold shadow-sm whitespace-nowrap">
                                              Order
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {data.packages.length > itemsPerView && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(data.packages.length / (device === 'mobile' ? 1 : 1)) }).slice(0, 5).map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-2 h-2 rounded-full transition-colors ${idx === packageIndex || (idx === 4 && packageIndex > 4) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            ></div>
                        ))}
                    </div>
                  )}
              </div>
          </div>
      );
  };

  const renderTestimonials = () => {
    if (!data.testimonials.length) return null;

    const itemsPerView = device === 'mobile' ? 1 : 3;
    const slidePercentage = 100 / itemsPerView;

    return (
        <div className={`preview-section px-6 bg-slate-50 border-t border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-colors overflow-hidden`}>
            <h2 className="text-2xl font-bold text-center mb-10 dark:text-white">What People Say</h2>
            
            <div className="max-w-6xl mx-auto relative">
                <div 
                    className="flex transition-transform duration-700 ease-in-out" 
                    style={{ transform: `translateX(-${testimonialIndex * slidePercentage}%)` }}
                >
                    {data.testimonials.map(t => (
                        <div 
                            key={t.id} 
                            className="flex-shrink-0 px-3"
                            style={{ width: `${slidePercentage}%` }}
                        >
                            <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-600 italic text-sm mb-6 flex-1 dark:text-slate-300">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700 shrink-0">
                                        {t.photoUrl ? <img src={t.photoUrl} className="w-full h-full object-cover"/> : <User className="p-2 text-slate-400 dark:text-slate-500"/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {data.testimonials.length > itemsPerView && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(data.testimonials.length / (device === 'mobile' ? 1 : 1)) }).slice(0, 5).map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-2 h-2 rounded-full transition-colors ${idx === testimonialIndex || (idx === 4 && testimonialIndex > 4) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <>
      {renderHero()}

      <div className={`preview-section px-6 max-w-3xl mx-auto dark:text-slate-200`}>
          <div 
            className="prose prose-slate prose-lg max-w-none dark:prose-invert leading-relaxed text-slate-600"
            dangerouslySetInnerHTML={{ __html: data.description }} 
          />
      </div>

      {renderProductGallery()}
      {renderProductDetails()}
      
      {renderPackages()}

      {data.features.length > 0 && (
          <div className={`preview-section bg-white text-center dark:bg-slate-950 transition-colors`}>
              <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {data.features.map((feat, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <CheckCircle className="mx-auto mb-3 text-emerald-500" size={32} />
                          <span className="font-bold text-slate-800 text-sm md:text-base dark:text-slate-200">{feat}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {renderTestimonials()}

      {/* Footer */}
      <div className={`bg-white border-t border-slate-100 preview-section px-6 text-center dark:bg-slate-950 dark:border-slate-800 transition-colors`}>
        {data.contactVisible && (
          <div className="mb-8 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Questions?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{data.contactEmail}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{data.whatsappNumber}</p>
          </div>
        )}
        <div className="text-xs text-slate-400 max-w-lg mx-auto dark:text-slate-500">
          <p className="mb-4 leading-relaxed">{data.refundPolicy}</p>
          <p>&copy; {new Date().getFullYear()} {data.title}. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;
