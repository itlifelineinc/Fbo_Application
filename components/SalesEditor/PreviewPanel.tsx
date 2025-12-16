
import React, { useState, useEffect } from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, MessageCircle, ChevronLeft, ChevronRight, AlertCircle, Maximize2, X, Leaf, ShieldCheck, Heart, Sparkles, Plus, ArrowDown } from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  
  // --- DYNAMIC DESIGN SYSTEM ---
  const isMobile = device === 'mobile';
  
  // Determine if we use mobile overrides or root defaults
  const settings = isMobile && data.mobileOverrides ? { ...data, ...data.mobileOverrides } : data;

  const fontFamilyHeading = data.headingFont || 'Lexend';
  const fontFamilyBody = data.bodyFont || 'Noto Sans';
  
  // Responsive Values from Merged Settings
  const baseSize = settings.baseFontSize || (isMobile ? 15 : 16);
  const subtitleSize = settings.subtitleFontSize || (isMobile ? 18 : 20);
  const scaleRatio = settings.typeScale || (isMobile ? 1.2 : 1.25);
  const spacingValue = settings.sectionSpacing ?? (isMobile ? 4 : 5); // 0 to 10
  
  // Responsive Button Values
  const btnCorner = data.buttonCorner || 'pill'; // Global
  const btnSize = settings.buttonSize || 'md'; // Responsive

  // Calculate Header Sizes based on Modular Scale
  const h1Size = Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const h2Size = Math.round(baseSize * Math.pow(scaleRatio, 3)); 
  const h3Size = Math.round(baseSize * Math.pow(scaleRatio, 2)); 
  const smallSize = Math.round(baseSize * 0.85);

  const sectionPaddingRem = 1 + (spacingValue * 0.7); 
  
  // Button Styles Logic
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
      .dark .preview-wrapper h1, .dark .preview-wrapper h2, .dark .preview-wrapper h3 { color: #ffffff; }

      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );

  // Parse Dynamic Message
  const whatsappMessage = data.whatsappMessage?.replace('{title}', data.title) || `Hi, I'm interested in ${data.title}`;

  if (device === 'desktop') {
    return (
      <>
        {scrollbarStyles}
        <div 
            className="w-full h-full relative overflow-hidden bg-slate-200 dark:bg-slate-900 rounded-xl md:rounded-none border border-slate-200 md:border-0 shadow-sm preview-wrapper"
            style={previewStyle}
        >
           <div className="w-full h-full overflow-y-auto scroll-smooth no-scrollbar bg-white dark:bg-slate-950 transition-colors relative">
              <PreviewContent data={data} device={device} whatsappMessage={whatsappMessage} />
           </div>
           
           <WhatsAppFloatingButton 
              phoneNumber={data.whatsappNumber} 
              isVisible={data.ctaDisplay?.showFloatingWhatsapp ?? true} 
              message={whatsappMessage}
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
            <PreviewContent data={data} device={device} whatsappMessage={whatsappMessage} />
            <div className="h-6"></div>
        </div>

        <WhatsAppFloatingButton 
            phoneNumber={data.whatsappNumber} 
            isVisible={data.ctaDisplay?.showFloatingWhatsapp ?? true} 
            message={whatsappMessage}
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
    whatsappMessage: string;
}> = ({ data, device, whatsappMessage }) => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [packageIndex, setPackageIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  
  // Advanced Zoom State
  const [isDeepZoomed, setIsDeepZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Common Product Logic
  const product = data.products.length > 0 ? data.products[0] : null;
  const images = product && product.images && product.images.length > 0 ? product.images : [];
  
  // Helper to force mobile layout styles even if viewport is wide
  const isDesktop = device === 'desktop';

  // Checkout Mode Logic
  const isCheckoutEnabled = data.checkoutConfig?.enabled;

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

  // Gallery Navigation
  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);

  // Touch Handlers
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

  // Zoom Mouse Movement
  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomOpen) return;
      // Calculate percentage position of mouse in the viewport
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPos({ x, y });
  };

  const toggleDeepZoom = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent closing modal
      setIsDeepZoomed(!isDeepZoomed);
  };

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
      // SLICK BUTTONS: Removed 'hover:scale-105' replaced with subtle hover transform. Removed 'shadow-xl'. 
      const baseClass = `${isHero ? 'preview-btn-hero' : 'preview-btn'} font-bold transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2`;
      
      let style: React.CSSProperties = {};
      let className = baseClass;
      
      const btnColor = cta.color || data.themeColor;

      if (cta.style === 'primary') {
          // SLICK SHADOW: Tighter, less blur, lower opacity for modern look
          style = { backgroundColor: btnColor, color: '#fff', boxShadow: `0 4px 14px 0 ${btnColor}40` };
      } else if (cta.style === 'outline') {
          style = { border: `2px solid ${isHero ? '#e2e8f0' : btnColor}`, color: isHero ? '#334155' : btnColor, backgroundColor: 'transparent' };
          className = baseClass.replace('shadow-md hover:shadow-lg', 'shadow-sm hover:bg-slate-50'); 
      } else if (cta.style === 'link') {
          style = { color: btnColor, textDecoration: 'underline', padding: '0', boxShadow: 'none' };
          className = "font-bold text-sm hover:opacity-80 transition-opacity flex items-center gap-1 preview-btn"; 
      }

      // Dynamic URL logic
      let href = cta.url;
      
      // If action is WHATSAPP or (SCROLL but Checkout Disabled, treat as WA fallback potentially)
      if (cta.actionType === 'WHATSAPP') {
          href = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      }

      // If action is SCROLL/Order and Checkout is Disabled, maybe redirect to WhatsApp too?
      // For now, keep as is unless specified logic change.
      // But if Checkout is enabled, maybe SCROLL should trigger Cart? 
      // Simplified: Just use href provided or default behavior.

      return (
          <a 
            key={cta.id}
            href={href || '#'}
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
              {/* Header with Cart Icon if Checkout Enabled */}
              {isCheckoutEnabled && (
                  <div className="absolute top-4 right-4 z-50">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700">
                          <ShoppingCart size={20} className="text-slate-700 dark:text-slate-200" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">0</div>
                      </div>
                  </div>
              )}

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
                  
                  {/* Hero CTA Logic: Only render if enabled */}
                  {data.ctaDisplay?.showHero && (
                      <div className={`flex flex-col ${isDesktop ? 'sm:flex-row' : ''} items-center justify-center gap-4 w-full ${isDesktop ? 'sm:w-auto' : ''}`}>
                          {data.ctas.map((cta) => renderCTA(cta, true))}
                      </div>
                  )}

                  <div className="mt-12 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-60">
                      <CheckCircle size={14} /> 100% Satisfaction Guarantee
                  </div>
              </div>
          </div>
      );
  };

  // ... (Zoom Modal code remains same) ...
  // ZOOM MODAL RENDERER
  const renderZoomModal = () => {
    if (!isZoomOpen || images.length === 0) return null;
    const currentImg = images[galleryIndex % images.length];

    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col animate-fade-in touch-none">
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-50 pointer-events-none">
                <button 
                    onClick={() => { setIsZoomOpen(false); setIsDeepZoomed(false); }}
                    className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm pointer-events-auto"
                >
                    <X size={24} className="text-slate-900 dark:text-white" />
                </button>
            </div>

            {/* Main Image Area */}
            <div 
                className="flex-1 relative flex items-center justify-center overflow-hidden w-full h-full cursor-zoom-in"
                onMouseMove={handleZoomMouseMove}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img 
                    src={currentImg} 
                    alt={`Zoomed Product ${galleryIndex + 1}`}
                    onClick={toggleDeepZoom}
                    className="w-full h-full object-contain max-h-screen max-w-screen transition-transform duration-300 ease-out"
                    style={{
                        transform: isDeepZoomed ? `scale(2.5)` : `scale(1)`,
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        cursor: isDeepZoomed ? 'zoom-out' : 'zoom-in'
                    }}
                />
                
                {/* Nav Arrows (Hidden on Mobile, and Hidden if Deep Zoomed to avoid obstruction) */}
                <div className={`hidden md:block transition-opacity duration-300 ${isDeepZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/90 hover:bg-white shadow-xl backdrop-blur-sm transition-all border border-slate-100 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/90 hover:bg-white shadow-xl backdrop-blur-sm transition-all border border-slate-100 dark:bg-slate-800/80 dark:border-slate-700 dark:text-white"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Dots (Hidden if deep zoomed) */}
            {images.length > 1 && (
                <div className={`absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-50 transition-opacity duration-300 ${isDeepZoomed ? 'opacity-0' : 'opacity-100'}`}>
                     {images.map((_, i) => (
                          <button 
                              key={i} 
                              onClick={() => setGalleryIndex(i)}
                              className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${i === galleryIndex ? 'w-10 bg-slate-900 dark:bg-white' : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'}`}
                          />
                      ))}
                </div>
            )}
        </div>
    )
  };

  const renderFeaturedProduct = () => {
      if (!product) return null;
      if (images.length === 0) return null;

      const currentImg = images[galleryIndex % images.length];

      return (
          // CLEAN LAYOUT: Use bg-slate-50 but minimized padding on mobile
          <div className={`preview-section bg-slate-50 dark:bg-slate-900/50 transition-colors`}>
              {/* Section Header: Reduced bottom margin for mobile */}
              <div className="px-6 md:px-12 max-w-[2000px] mx-auto mb-6 md:mb-8 flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 
                    className="font-bold mb-3 text-slate-900 dark:text-white"
                    style={{ fontSize: 'var(--h3-size)', fontFamily: 'var(--font-heading)' }}
                  >
                    Product Gallery
                  </h3>
                  <div className="h-1 w-16 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
              </div>

              {/* B&O Split Layout Container */}
              <div className="max-w-[2000px] mx-auto px-4 md:px-8">
                  {/* Reduced gap on mobile from gap-8 to gap-5 for tight modern feel */}
                  <div className={`flex flex-col ${isDesktop ? 'lg:flex-row' : ''} gap-5 lg:gap-16 items-center`}>
                      
                      {/* LEFT: Image Gallery (60% width on desktop) */}
                      <div className={`w-full ${isDesktop ? 'lg:w-[60%]' : ''} relative`}>
                          {/* Adjusted mobile height to be more compact (40vh) vs desktop (70vh) */}
                          <div className="relative w-full h-[40vh] lg:h-[70vh] max-h-[800px] flex items-center justify-center">
                              <div 
                                  className="relative w-full h-full flex items-center justify-center overflow-hidden touch-pan-y"
                                  onTouchStart={onTouchStart}
                                  onTouchMove={onTouchMove}
                                  onTouchEnd={onTouchEnd}
                              >
                                  <img 
                                      src={currentImg} 
                                      alt={`Product Shot ${galleryIndex + 1}`} 
                                      className="w-full h-full object-contain transition-opacity duration-500 ease-in-out rounded-3xl"
                                      key={galleryIndex} 
                                  />
                                  
                                  {/* Zoom / Expand Icon (Bottom Right) */}
                                  <button 
                                    onClick={() => { setIsZoomOpen(true); setIsDeepZoomed(false); }}
                                    className="absolute bottom-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors text-slate-800 shadow-sm dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white"
                                  >
                                      <Maximize2 size={18} />
                                  </button>
                              </div>
                          </div>

                          {/* Controls Row Below Image */}
                          <div className="mt-4 flex items-center justify-between px-2">
                              {/* Dots (Left Aligned) */}
                              <div className="flex gap-2">
                                  {images.length > 1 && images.map((_, i) => (
                                      <button 
                                          key={i} 
                                          onClick={() => setGalleryIndex(i)}
                                          className={`h-2 rounded-full transition-all duration-300 shadow-sm ${i === galleryIndex ? 'w-8 bg-slate-900 dark:bg-white' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'}`}
                                          aria-label={`Go to image ${i + 1}`}
                                      />
                                  ))}
                              </div>

                              {/* Arrows (Right Aligned, Hidden on Mobile) */}
                              {images.length > 1 && isDesktop && (
                                  <div className="hidden lg:flex gap-4">
                                      <button 
                                          onClick={prevImage} 
                                          className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                      >
                                          <ChevronLeft size={20} strokeWidth={2} />
                                      </button>
                                      <button 
                                          onClick={nextImage} 
                                          className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                      >
                                          <ChevronRight size={20} strokeWidth={2} />
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* RIGHT: Product Info (40% width on desktop) */}
                      <div className={`w-full ${isDesktop ? 'lg:w-[40%] text-left' : 'text-center'} space-y-8`}>
                          <div>
                              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-2 block dark:text-slate-500">
                                  {product.category || 'Premium Collection'}
                              </span>
                              <h4 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {product.name}
                              </h4>
                          </div>

                          <div className="text-slate-600 leading-relaxed dark:text-slate-300 text-base md:text-lg">
                              {product.shortDescription}
                          </div>

                          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                              {isCheckoutEnabled ? (
                                  <button 
                                    style={{ 
                                        backgroundColor: data.themeColor,
                                        borderRadius: 'var(--btn-radius)',
                                        padding: 'var(--btn-hero-padding)',
                                        fontSize: 'var(--btn-hero-font-size)',
                                        boxShadow: `0 4px 14px 0 ${data.themeColor}40` // Slick shadow
                                    }} 
                                    className="w-full text-white font-bold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                                  >
                                      <ShoppingCart size={20} /> Add to Cart
                                  </button>
                              ) : (
                                  <a 
                                    href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    style={{ 
                                        backgroundColor: '#25D366', // WhatsApp Green override for clarity, or use theme color
                                        borderRadius: 'var(--btn-radius)',
                                        padding: 'var(--btn-hero-padding)',
                                        fontSize: 'var(--btn-hero-font-size)',
                                        boxShadow: `0 4px 14px 0 rgba(37, 211, 102, 0.4)` 
                                    }} 
                                    className="w-full text-white font-bold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                                  >
                                      <MessageCircle size={20} /> Chat to Buy
                                  </a>
                              )}
                              
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                  Free shipping on orders over {data.currency}100
                              </p>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      );
  };

  const renderAdditionalDetails = () => {
      // If there are multiple products, list the rest here? 
      // Or just detailed descriptions. For now, let's render the detailed description of the first product if it differs significantly, 
      // or other products if they exist.
      if (data.products.length <= 1) return null;

      return (
          <div className="preview-section px-6 bg-white dark:bg-slate-950 transition-colors">
              <div className="max-w-4xl mx-auto space-y-12">
                  <h3 className="font-bold text-2xl text-center">More from this collection</h3>
                  {data.products.slice(1).map(product => (
                      <div key={product.id} className={`flex flex-col ${isDesktop ? 'md:flex-row' : ''} gap-8 items-center border-b border-slate-100 pb-8 last:border-0 dark:border-slate-800`}>
                          <div className={`w-full ${isDesktop ? 'md:w-1/3' : ''} aspect-square bg-slate-50 rounded-xl flex items-center justify-center dark:bg-slate-900`}>
                              {product.images[0] && <img src={product.images[0]} className="max-h-[80%] max-w-[80%] object-contain" />}
                          </div>
                          <div className={`flex-1 text-center ${isDesktop ? 'md:text-left' : ''}`}>
                              <h4 className="font-bold text-xl mb-2">{product.name}</h4>
                              <p className="text-emerald-600 font-bold mb-4">{data.currency} {product.price}</p>
                              <p className="text-slate-600 text-sm mb-4 dark:text-slate-400">{product.shortDescription}</p>
                              <button className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-emerald-600 transition-colors">View Details</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  };

  const renderPackages = () => {
      if (!data.packages.length) return null;

      const itemsPerView = device === 'mobile' ? 1 : 3;
      const slidePercentage = 100 / itemsPerView;

      return (
          <div className={`preview-section px-6 bg-white border-t border-slate-100 dark:bg-slate-950 dark:border-slate-800 transition-colors overflow-hidden`}>
              <div className="flex flex-col items-center mb-10">
                  <h3 
                    className="font-bold mb-3 text-slate-900 dark:text-white text-center"
                    style={{ fontSize: 'var(--h3-size)', fontFamily: 'var(--font-heading)' }}
                  >
                    Bundles & Kits
                  </h3>
                  <div className="h-1 w-16 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
                  <p className="text-center text-slate-500 mt-4 max-w-lg mx-auto dark:text-slate-400">Save more with our exclusive packages</p>
              </div>
              
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
                                              {isCheckoutEnabled ? 'Add to Cart' : 'Order'}
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

  const renderTrustBadges = () => {
      if (!data.badges || data.badges.length === 0) return null;
      
      const badgeIcons: Record<string, any> = {
          'iasc': Leaf,
          'guarantee': ShieldCheck,
          'cruelty_free': Heart,
          'kosher': CheckCircle,
          'halal': CheckCircle,
          'natural': Sparkles
      };

      const badgeLabels: Record<string, string> = {
          'iasc': 'IASC Certified',
          'guarantee': '30-Day Guarantee',
          'cruelty_free': 'Cruelty Free',
          'kosher': 'Kosher',
          'halal': 'Halal',
          'natural': 'Natural'
      };

      return (
          <div className="preview-section px-4 flex flex-wrap justify-center gap-4 bg-slate-50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
              {data.badges.map(b => {
                  const Icon = badgeIcons[b] || CheckCircle;
                  return (
                      <div key={b} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                              <Icon size={16} />
                          </div>
                          <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{badgeLabels[b]}</span>
                      </div>
                  );
              })}
          </div>
      );
  };

  const renderPersonalBrand = () => {
      if (!data.personalBranding?.bio) return null;
      
      return (
          <div className="preview-section px-6 bg-white dark:bg-slate-950 transition-colors">
              <div className="max-w-2xl mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row gap-6 items-center dark:bg-slate-900 dark:border-slate-800">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden shrink-0 dark:border-slate-700">
                      {data.personalBranding.photoUrl ? (
                          <img src={data.personalBranding.photoUrl} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 dark:bg-slate-800"><User size={32}/></div>
                      )}
                  </div>
                  <div className="text-center md:text-left">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-white">Meet Your Sponsor</h4>
                      <p className="text-sm text-slate-600 mt-2 italic leading-relaxed dark:text-slate-300">"{data.personalBranding.bio}"</p>
                      {(data.personalBranding.yearsExperience > 0 || data.personalBranding.rank) && (
                          <div className="flex gap-4 justify-center md:justify-start mt-4 text-xs font-bold text-emerald-600 uppercase dark:text-emerald-400">
                              {data.personalBranding.yearsExperience > 0 && <span>{data.personalBranding.yearsExperience}+ Years Exp.</span>}
                              {data.personalBranding.rank && <span>• {data.personalBranding.rank}</span>}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const renderFAQs = () => {
      if (!data.faqs || data.faqs.length === 0) return null;

      return (
          <div className="preview-section px-6 bg-white dark:bg-slate-950 transition-colors">
              <div className="max-w-2xl mx-auto space-y-4">
                  <h3 className="font-bold text-xl text-center mb-6 dark:text-white">Common Questions</h3>
                  {data.faqs.map((faq, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden dark:border-slate-800">
                          <button 
                              onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                              className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left dark:bg-slate-900 dark:hover:bg-slate-800"
                          >
                              <span className="font-bold text-sm text-slate-800 dark:text-white">{faq.question}</span>
                              <ChevronRight size={16} className={`text-slate-400 transition-transform ${activeFaq === faq.id ? 'rotate-90' : ''}`} />
                          </button>
                          {activeFaq === faq.id && (
                              <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800">
                                  {faq.answer}
                              </div>
                          )}
                      </div>
                  ))}
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
            <div className="flex flex-col items-center mb-10">
                <h3 
                    className="font-bold mb-3 text-slate-900 dark:text-white text-center"
                    style={{ fontSize: 'var(--h3-size)', fontFamily: 'var(--font-heading)' }}
                >
                    What People Say
                </h3>
                <div className="h-1 w-16 rounded-full" style={{ backgroundColor: data.themeColor }}></div>
            </div>
            
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

  const renderContentEndCTAs = () => {
      if (!data.ctaDisplay?.showContentEnd || data.ctas.length === 0) return null;
      return (
          <div className="preview-section px-6 pb-12 bg-white dark:bg-slate-950 text-center">
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Ready to start?</h3>
                  <div className="flex flex-col gap-3">
                      {data.ctas.map(cta => renderCTA(cta))}
                  </div>
              </div>
          </div>
      );
  };

  const renderStickyBottom = () => {
      if (!data.ctaDisplay?.showBottomSticky || data.ctas.length === 0) return null;
      // Use the first primary CTA for the sticky bar
      const primaryCTA = data.ctas.find(c => c.style === 'primary') || data.ctas[0];
      
      return (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg z-40 flex items-center justify-between gap-4 dark:bg-slate-900/90 dark:border-slate-800 animate-slide-up">
              <div className="hidden md:block">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{data.title}</p>
                  <p className="text-xs text-emerald-600 font-bold dark:text-emerald-400">{data.currency} {data.products[0]?.price || '0.00'}</p>
              </div>
              <div className="w-full md:w-auto">
                  {renderCTA(primaryCTA)}
              </div>
          </div>
      );
  };

  return (
    <>
      {renderHero()}
      {/* Zoom Modal - Must be at top level inside fragment */}
      {renderZoomModal()}
      
      {renderTrustBadges()}

      <div className={`preview-section px-6 max-w-3xl mx-auto dark:text-slate-200`}>
          <div 
            className="prose prose-slate prose-lg max-w-none dark:prose-invert leading-relaxed text-slate-600"
            dangerouslySetInnerHTML={{ __html: data.description }} 
          />
      </div>

      {renderFeaturedProduct()}
      {renderAdditionalDetails()}
      
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
      
      {renderPersonalBrand()}
      {renderTestimonials()}
      {renderFAQs()}
      
      {renderContentEndCTAs()}

      {/* Footer */}
      <div className={`bg-white border-t border-slate-100 preview-section px-6 text-center dark:bg-slate-950 dark:border-slate-800 transition-colors pb-32`}>
        {data.contactVisible && (
          <div className="mb-8 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Questions?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{data.contactEmail}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{data.whatsappNumber}</p>
          </div>
        )}
        <div className="text-xs text-slate-400 max-w-lg mx-auto dark:text-slate-500">
          <p className="mb-4 leading-relaxed">{data.refundPolicy}</p>
          {data.disclaimer && <p className="mb-4 leading-relaxed italic opacity-80">{data.disclaimer}</p>}
          <p>&copy; {new Date().getFullYear()} {data.title}. All rights reserved.</p>
        </div>
      </div>

      {renderStickyBottom()}
    </>
  );
};

export default PreviewPanel;
