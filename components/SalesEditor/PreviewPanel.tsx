
import React, { useState, useEffect } from 'react';
import { SalesPage, CTAButton, Product } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, 
  MessageCircle, ChevronLeft, ChevronRight, Maximize2, 
  X, Leaf, ShieldCheck, Heart, Sparkles, Plus, ArrowDown, HelpCircle,
  Image as ImageIcon, CreditCard, Smartphone, Truck, MapPin, Minus, Send, Loader2, Package
} from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  const isMobile = device === 'mobile';
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
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
          box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1);
        }
        .clean-btn:active:not(:disabled) { transform: scale(0.96); }
        .clean-btn:disabled { opacity: 0.5; cursor: not-allowed; }

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

        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: subtle-bounce 3s ease-in-out infinite;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .checkout-drawer {
          position: absolute;
          inset: 0;
          z-index: 100;
          background: white;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        .dark .checkout-drawer { background: #0f172a; }

        .payment-subdrawer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 110;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
            box-shadow: 0 -20px 40px -10px rgba(0,0,0,0.2);
            padding: 1.5rem;
            transition: transform 0.3s ease-out;
        }
        .dark .payment-subdrawer { background: #1e293b; }
      `}</style>

      {isMobile ? (
        <div className="mx-auto w-full max-w-[375px] h-full max-h-[850px] bg-slate-900 rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>
           
           {/* Checkout Drawer for Mobile */}
           <div className={`checkout-drawer ${isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           {/* Floating WhatsApp Button inside the mobile frame */}
           {data.ctaDisplay.showFloatingWhatsapp && !isCheckoutOpen && (
             <div className="absolute bottom-32 right-5 z-50 animate-bounce-subtle">
                <WhatsAppFloatingButton 
                  phoneNumber={data.whatsappNumber} 
                  message={whatsappMsg} 
                  isVisible={true} 
                  className="!static" 
                />
             </div>
           )}

           <div className="h-full overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950" style={previewStyle}>
              <CleanThemeContent data={data} onOpenCheckout={() => setIsCheckoutOpen(true)} />
           </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper relative" style={previewStyle}>
            {data.ctaDisplay.showFloatingWhatsapp && (
              <WhatsAppFloatingButton 
                phoneNumber={data.whatsappNumber} 
                message={whatsappMsg} 
                isVisible={true} 
                className="fixed bottom-10 right-10 z-50 animate-bounce-subtle"
              />
            )}
            <CleanThemeContent data={data} onOpenCheckout={() => alert('Checkout is only available in mobile preview for this specific request.')} />
        </div>
      )}
    </>
  );
};

const CleanThemeContent: React.FC<{ data: SalesPage; onOpenCheckout: () => void }> = ({ data, onOpenCheckout }) => {
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
        <div className="flex flex-wrap justify-center gap-4 w-full px-4 mb-10">
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

        {/* HERO CTA BUTTONS - Placed after badges on the solid background */}
        <div className="flex flex-col gap-3 w-full px-8 max-w-[340px] animate-slide-up delay-300">
            {/* Direct Message on WhatsApp (Primary) */}
            <a 
                href={`https://wa.me/${data.whatsappNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="clean-btn w-full text-white"
                style={{ backgroundColor: data.themeColor }}
            >
                <MessageCircle size={18} fill="white" />
                Message on WhatsApp
            </a>

            {/* Direct Checkout (Only if enabled) */}
            {data.checkoutConfig.enabled && (
                <button 
                    onClick={onOpenCheckout}
                    className={`clean-btn w-full border-2 ${isDarkBg ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : 'bg-slate-900/5 text-slate-900 border-slate-900/10 hover:bg-slate-900/10'}`}
                    style={{ backdropFilter: 'blur(8px)' }}
                >
                    <ShoppingCart size={18} className={textColorClass} />
                    Direct Checkout
                </button>
            )}
        </div>

        {/* Scroll Hint */}
        <div className="mt-12 animate-bounce opacity-40">
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

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [buyFullPack, setBuyFullPack] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [activePaymentDrawer, setActivePaymentDrawer] = useState<'momo' | 'card' | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Buyer Info States
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  
  const product = data.products[0];
  const unitPrice = buyFullPack && data.fullPackPrice ? data.fullPackPrice : (product?.price || 0);
  const shippingFee = data.checkoutConfig.shipping.flatRate || 0;
  const subtotal = unitPrice * quantity;
  const total = subtotal + shippingFee;

  const isFormValid = buyerName.trim() !== '' && 
                      buyerPhone.trim() !== '' && 
                      (data.checkoutConfig.shipping.enabled ? buyerAddress.trim() !== '' : true) &&
                      selectedPayment !== null &&
                      (selectedPayment === 'cod' || paymentVerified);

  const handleMomoSend = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setIsVerifying(false);
          setPaymentVerified(true);
          setActivePaymentDrawer(null);
          alert("MoMo Prompt Sent! Please confirm on your phone.");
      }, 2000);
  };

  const handleCardVerify = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setIsVerifying(false);
          setPaymentVerified(true);
          setActivePaymentDrawer(null);
          alert("Card eligible! Security check passed.");
      }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 font-sans relative">
      {/* 1. HEADER */}
      <div className="flex items-center px-4 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-800 dark:text-white">
              <ChevronLeft size={28} strokeWidth={3} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white ml-2">Checkout</h2>
      </div>

      {/* 2. SCROLLABLE FORM */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
          
          {/* Order Summary Summary */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-1 shrink-0">
                      <img src={product?.images[0]} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Item</p>
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{product?.name}</h3>
                      <p className="text-sm font-black text-emerald-600">{data.currency} {unitPrice.toLocaleString()}</p>
                  </div>
              </div>

              {/* Box/Full Pack Option */}
              {data.fullPackPrice && data.fullPackPrice > 0 && (
                  <div 
                    onClick={() => setBuyFullPack(!buyFullPack)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${buyFullPack ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                      <div className="flex items-center gap-3">
                          {/* Fix: Package icon is now properly imported from lucide-react */}
                          <Package size={20} className={buyFullPack ? 'text-emerald-600' : 'text-slate-400'} />
                          <div>
                              <p className={`font-bold text-sm ${buyFullPack ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-400'}`}>Full Pack Box</p>
                              <p className="text-[10px] text-slate-400">Save more with the complete set</p>
                          </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${buyFullPack ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                          {buyFullPack && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                  </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity</span>
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1 shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-white active:scale-90"
                      >
                          <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="text-lg font-black text-slate-900 dark:text-white w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 text-white active:scale-90"
                      >
                          <Plus size={16} strokeWidth={3} />
                      </button>
                  </div>
              </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User size={16} /> Contact Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                  <input 
                    type="text" 
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Full Name" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white" 
                  />
                  <input 
                    type="tel" 
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Phone Number" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white" 
                  />
              </div>
          </div>

          {/* Shipping Info (If Enabled) */}
          {data.checkoutConfig.shipping.enabled && (
              <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Truck size={16} /> Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                      <input 
                        type="text" 
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="Street Address" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white" 
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="City" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white" />
                        <input type="text" placeholder="Postal Code" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all dark:text-white" />
                      </div>
                  </div>
              </div>
          )}

          {/* Payment Methods */}
          <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <CreditCard size={16} /> Payment Method
              </h3>
              <div className="grid grid-cols-1 gap-3">
                  {data.checkoutConfig.paymentMethods.mobileMoney && (
                    <PaymentOption 
                        id="momo" 
                        label="Mobile Money (MTN/AirtelTigo)" 
                        icon={<Smartphone size={20} />} 
                        selected={selectedPayment === 'momo'} 
                        onSelect={() => { setSelectedPayment('momo'); setPaymentVerified(false); setActivePaymentDrawer('momo'); }} 
                        status={paymentVerified && selectedPayment === 'momo' ? 'VERIFIED' : undefined}
                    />
                  )}
                  {data.checkoutConfig.paymentMethods.card && (
                    <PaymentOption 
                        id="card" 
                        label="Credit / Debit Card" 
                        icon={<CreditCard size={20} />} 
                        selected={selectedPayment === 'card'} 
                        onSelect={() => { setSelectedPayment('card'); setPaymentVerified(false); setActivePaymentDrawer('card'); }} 
                        status={paymentVerified && selectedPayment === 'card' ? 'VERIFIED' : undefined}
                    />
                  )}
                  {data.checkoutConfig.paymentMethods.cashOnDelivery && (
                    <PaymentOption 
                        id="cod" 
                        label="Cash on Delivery" 
                        icon={<Truck size={20} />} 
                        selected={selectedPayment === 'cod'} 
                        onSelect={() => { setSelectedPayment('cod'); setPaymentVerified(false); }} 
                    />
                  )}
              </div>
          </div>
      </div>

      {/* 3. PAYMENT SUB-DRAWERS */}
      {activePaymentDrawer === 'momo' && (
          <>
            <div className="fixed inset-0 bg-black/40 z-[105]" onClick={() => setActivePaymentDrawer(null)}></div>
            <div className="payment-subdrawer animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">Verify MoMo</h4>
                    <button onClick={() => setActivePaymentDrawer(null)} className="text-slate-400"><X size={24} /></button>
                </div>
                <div className="relative">
                    <input 
                        type="tel" 
                        placeholder="05x xxx xxxx" 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-4 font-black outline-none dark:text-white pr-12"
                    />
                    <button 
                        onClick={handleMomoSend}
                        disabled={isVerifying}
                        className="absolute right-2 top-2 p-2 bg-emerald-500 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                        {isVerifying ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 text-center">Confirm the prompt that appears on your handset to verify funds.</p>
            </div>
          </>
      )}

      {activePaymentDrawer === 'card' && (
          <>
            <div className="fixed inset-0 bg-black/40 z-[105]" onClick={() => setActivePaymentDrawer(null)}></div>
            <div className="payment-subdrawer animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">Card Details</h4>
                    <button onClick={() => setActivePaymentDrawer(null)} className="text-slate-400"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <input type="text" placeholder="Card Number" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-4 font-black outline-none dark:text-white" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM / YY" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-4 font-black outline-none dark:text-white" />
                        <input type="text" placeholder="CVV" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-4 font-black outline-none dark:text-white" />
                    </div>
                    <button 
                        onClick={handleCardVerify}
                        disabled={isVerifying}
                        className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                        Securely Verify Card
                    </button>
                </div>
            </div>
          </>
      )}

      {/* 4. STICKY BOTTOM SUMMARY */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-bold">
                  <span>Subtotal ({quantity}x)</span>
                  <span>{data.currency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-bold">
                  <span>Shipping</span>
                  <span>{shippingFee > 0 ? `${data.currency} ${shippingFee}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-2 border-t border-slate-50 dark:border-slate-900">
                  <span>Total</span>
                  <span>{data.currency} {total.toLocaleString()}</span>
              </div>
          </div>
          <button 
            disabled={!isFormValid}
            className="w-full clean-btn text-white py-5 text-xl shadow-xl shadow-emerald-900/20"
            style={{ backgroundColor: isFormValid ? data.themeColor : '#94a3b8' }}
          >
            Complete Order
          </button>
      </div>
    </div>
  );
};

const PaymentOption: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ReactNode; 
    selected: boolean; 
    onSelect: () => void; 
    status?: 'VERIFIED'
}> = ({ label, icon, selected, onSelect, status }) => (
    <div 
        onClick={onSelect}
        className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${selected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${selected ? 'bg-emerald-200 text-emerald-800' : 'bg-white dark:bg-slate-800 text-slate-400 shadow-sm'}`}>
                {icon}
            </div>
            <div>
                <span className={`font-bold text-sm block ${selected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
                {status === 'VERIFIED' && <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Verified & Ready</span>}
            </div>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}>
            {selected && <Check size={14} strokeWidth={4} />}
        </div>
    </div>
);

export default PreviewPanel;
