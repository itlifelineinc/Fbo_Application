
import React, { useState, useEffect, Suspense } from 'react';
import { SalesPage, Product, FaqItem } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Send, Loader2, Package, 
  ShoppingBag, CheckCircle, ChevronDown, Wallet, Building2, CreditCard as CardIcon, 
  MapPin, Mail, LayoutGrid, Map as MapIcon, Navigation, Search, X, AlertCircle,
  Tag, ArrowRight, Box, Home, Clock
} from 'lucide-react';

// Import Templates
import ProductClean from '../SalesPreview/templates/Product/Clean';
import Placeholder from '../SalesPreview/templates/Placeholder';

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

        /* Stepper styles for Tracking */
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
        <div className="w-full h-full bg-white shadow-lg overflow-y-auto no-scrollbar preview-wrapper relative" style={previewStyle}>
            {renderActiveTemplate()}
            <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''} max-w-sm border-l border-slate-100 shadow-2xl`}>
                <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
            </div>
        </div>
      )}
    </>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
  const [packageType, setPackageType] = useState<'single' | 'full'>('single');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<string | null>(null); 
  const [momoNumber, setMomoNumber] = useState('');
  const [orderId] = useState(() => `NX-${Math.floor(100000 + Math.random() * 900000)}`);
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const product = data.products[0];
  const unitPrice = packageType === 'full' ? (data.fullPackPrice || product?.price) : product?.price || 0;
  
  const threshold = data.checkoutConfig.shipping.freeShippingThreshold || 0;
  const flatRate = data.checkoutConfig.shipping.flatRate || 0;
  const shipping = (data.checkoutConfig.shipping.enabled && unitPrice >= threshold && threshold > 0) ? 0 : (data.checkoutConfig.shipping.enabled ? flatRate : 0);
  
  const total = unitPrice + shipping;
  const iconColor = data.pageBgColor;

  const handleAddressSearch = (query: string) => {
    setCustomerInfo({ ...customerInfo, street: query });
    if (query.length > 2) {
      const mocks = [
        `${query} Avenue, East Legon, Accra`,
        `${query} Road, Kumasi Central`,
        `${query} Street, Osu, Accra`,
        `${query} Crescent, Tema Community 25`
      ];
      setAddressSuggestions(mocks);
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const parts = suggestion.split(', ');
    setCustomerInfo({
        ...customerInfo,
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || ''
    });
    setAddressSuggestions([]);
  };

  const handlePaymentSelect = (method: string) => {
      const mandatory = ['firstName', 'lastName', 'phone', 'houseNo', 'street', 'city', 'state'];
      const isMissing = mandatory.some(key => !customerInfo[key as keyof typeof customerInfo]);

      if (isMissing) {
          alert("Please complete the delivery information above before choosing a payment method.");
          return;
      }

      setSelectedPayment(method);
      if (method === 'cod') {
          setPaymentStep('success');
      } else {
          setPaymentStep(method);
      }
  };

  const handleConfirmAction = () => {
      setPaymentStep('processing');
      setTimeout(() => setPaymentStep('success'), 2000);
  };

  if (paymentStep === 'tracking') {
      const estArrival = new Date();
      estArrival.setDate(estArrival.getDate() + 3);
      const arrivalStr = estArrival.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });

      return (
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-fade-in overflow-hidden">
              <div className="px-6 py-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center gap-3">
                  <button onClick={() => setPaymentStep('success')} className="p-2 -ml-2 text-slate-500"><ChevronLeft size={24}/></button>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-heading">Track Order</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Arriving By</p>
                        <h3 className="text-2xl font-black">{arrivalStr}</h3>
                        <p className="text-xs font-bold mt-4 bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Order ID: {orderId}</p>
                      </div>
                      <Box size={80} className="absolute -bottom-4 -right-4 opacity-20 rotate-12" />
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 space-y-10 relative">
                      <div className="flex items-start gap-6 relative">
                          <div className="track-line track-line-active"></div>
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white z-10 shrink-0">
                              <Check size={16} strokeWidth={4}/>
                          </div>
                          <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Ordered</p>
                              <p className="text-xs text-slate-500">Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-6 relative">
                          <div className="track-line"></div>
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white z-10 shrink-0 shadow-lg shadow-emerald-500/30 animate-pulse">
                              <Package size={16} strokeWidth={3}/>
                          </div>
                          <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Processing</p>
                              <p className="text-xs text-slate-500 font-medium italic">Preparing your wellness items...</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-6 relative opacity-30 grayscale">
                          <div className="track-line"></div>
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 z-10 shrink-0">
                              <Truck size={16} />
                          </div>
                          <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Shipped</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-6 relative opacity-30 grayscale">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 z-10 shrink-0">
                              <Home size={16} />
                          </div>
                          <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Delivered</p>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Delivery Address</h4>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{customerInfo.firstName} {customerInfo.lastName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                          {customerInfo.houseNo}, {customerInfo.street}<br/>
                          {customerInfo.city}, {customerInfo.state}<br/>
                          {customerInfo.phone}
                      </p>
                  </div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs dark:bg-emerald-600">Back to Page</button>
              </div>
          </div>
      );
  }

  if (paymentStep === 'success') {
      return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-950 items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 dark:bg-emerald-900/30">
                  <CheckCircle size={64} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Order Placed!</h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Order ID: {orderId}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Hi {customerInfo.firstName}, we've received your order. We'll message you once it ships.</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                    onClick={() => setPaymentStep('tracking')} 
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2 group"
                >
                    <Truck size={18} /> Track Your Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={onClose} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Return to Store</button>
              </div>
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

  const INPUT_CLASS = "w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500 transition-all dark:text-white placeholder-slate-400";
  const LABEL_CLASS = "text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative overflow-hidden">
      
      {/* MAP PICKER */}
      {showMapPicker && (
          <div className="absolute inset-0 z-[900] bg-white dark:bg-slate-900 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold uppercase text-xs tracking-widest">Pin your location</h3>
                  <button onClick={() => setShowMapPicker(false)} className="p-2 bg-slate-100 rounded-full dark:bg-slate-800"><X size={18}/></button>
              </div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
                  <MapIcon size={64} className="text-slate-400 opacity-20" />
                  <div className="absolute animate-bounce" style={{ color: iconColor }}>
                      <MapPin size={48} strokeWidth={3} />
                  </div>
                  <div className="absolute bottom-10 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl dark:bg-slate-900/90 border border-white/20">
                      <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">Location Found</p>
                      <p className="text-[10px] text-slate-500 truncate mb-4">Boundary Rd., Accra, Ghana</p>
                      <button 
                        onClick={() => {
                            setCustomerInfo({...customerInfo, street: 'Boundary Rd.', city: 'Accra', state: 'Greater Accra'});
                            setShowMapPicker(false);
                        }} 
                        className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest"
                        style={{ backgroundColor: iconColor }}
                      >
                        Confirm Location
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* PAYMENT SUB-DRAWERS */}
      <div className={`absolute inset-x-0 bottom-0 z-[800] bg-white dark:bg-slate-900 rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-in-out border-t border-slate-100 dark:border-slate-800 ${paymentStep ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-6 mb-2"></div>
          <div className="p-10 pb-16">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                      {paymentStep === 'momo' ? <Smartphone size={24} color={iconColor}/> : paymentStep === 'card' ? <CardIcon size={24} color={iconColor}/> : <Building2 size={24} color={iconColor}/>}
                      {paymentStep === 'momo' ? 'Mobile Money' : paymentStep === 'card' ? 'Secure Card Pay' : 'Bank Confirmation'}
                  </h3>
                  <button onClick={() => setPaymentStep(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>

              {paymentStep === 'momo' && (
                  <div className="space-y-8">
                      <div>
                          <label className={LABEL_CLASS}>Enter MoMo Number</label>
                          <div className="relative">
                              <input 
                                type="tel" 
                                value={momoNumber}
                                onChange={e => setMomoNumber(e.target.value)}
                                placeholder="0XX XXX XXXX"
                                className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] outline-none focus:border-emerald-500 font-black text-xl dark:text-white placeholder-slate-300"
                              />
                              <button onClick={handleConfirmAction} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-emerald-500 text-white rounded-2xl shadow-xl active:scale-90 transition-transform flex items-center justify-center">
                                  <Send size={24} />
                              </button>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <AlertCircle size={20} className="text-blue-500" />
                        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider leading-relaxed">Check your phone screen for the prompt to confirm.</p>
                      </div>
                  </div>
              )}

              {paymentStep === 'card' && (
                  <div className="space-y-4">
                      <div className="space-y-4">
                          <div>
                              <label className={LABEL_CLASS}>Card Number</label>
                              <input type="text" placeholder="XXXX XXXX XXXX XXXX" className={INPUT_CLASS} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className={LABEL_CLASS}>Expiry</label>
                                  <input type="text" placeholder="MM/YY" className={INPUT_CLASS} />
                              </div>
                              <div>
                                  <label className={LABEL_CLASS}>CVV</label>
                                  <input type="text" placeholder="123" className={INPUT_CLASS} />
                              </div>
                          </div>
                      </div>
                      <button onClick={handleConfirmAction} className="w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm mt-6 shadow-xl" style={{ backgroundColor: iconColor }}>
                        Verify & Pay {data.currency} {total.toLocaleString()}
                      </button>
                  </div>
              )}

              {paymentStep === 'bank' && (
                  <div className="space-y-6 text-center">
                      <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-4">
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</span>
                              <span className="text-sm font-black dark:text-white uppercase">Nexu Growth Bank</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A/C Name</span>
                              <span className="text-sm font-black dark:text-white uppercase">Nexu Academy Ltd</span>
                          </div>
                          <div className="flex justify-between pb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Number</span>
                              <span className="text-sm font-black font-mono dark:text-white">099100234567</span>
                          </div>
                      </div>
                      <button onClick={handleConfirmAction} className="w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl" style={{ backgroundColor: iconColor }}>
                        I've made the transfer
                      </button>
                  </div>
              )}
          </div>
      </div>

      <div className="flex items-center px-6 py-8 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950 z-10">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-800 dark:text-white"><ChevronLeft size={28} strokeWidth={3} /></button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white ml-2 uppercase tracking-tight font-heading">Secure Checkout</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-12 no-scrollbar">
          <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                  <User size={14} color={iconColor} strokeWidth={4} /> Delivery Destination
              </h3>
              <div className="space-y-4">
                  <div>
                      <label className={LABEL_CLASS}>First Name*</label>
                      <input 
                        type="text" 
                        className={INPUT_CLASS} 
                        placeholder="Jane"
                        value={customerInfo.firstName}
                        onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className={LABEL_CLASS}>Last Name*</label>
                      <input 
                        type="text" 
                        className={INPUT_CLASS} 
                        placeholder="Doe"
                        value={customerInfo.lastName}
                        onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className={LABEL_CLASS}>Phone Number*</label>
                      <div className="relative">
                        <Smartphone size={16} color={iconColor} className="absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="tel" 
                            className={INPUT_CLASS + " pl-12"} 
                            placeholder="0XX XXX XXXX"
                            value={customerInfo.phone}
                            onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        />
                      </div>
                  </div>
                  <div>
                      <label className={LABEL_CLASS}>Email (Optional)</label>
                      <div className="relative">
                        <Mail size={16} color={iconColor} className="absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="email" 
                            className={INPUT_CLASS + " pl-12"} 
                            placeholder="jane@example.com"
                            value={customerInfo.email}
                            onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                        />
                      </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-4"></div>

                  <div className="space-y-4">
                      <div>
                          <label className={LABEL_CLASS}>House / Flat No.*</label>
                          <input 
                            type="text" 
                            className={INPUT_CLASS} 
                            placeholder="B12"
                            value={customerInfo.houseNo}
                            onChange={e => setCustomerInfo({...customerInfo, houseNo: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className={LABEL_CLASS}>Postal / Zip Code</label>
                          <input 
                            type="text" 
                            className={INPUT_CLASS} 
                            placeholder="00233"
                            value={customerInfo.zip}
                            onChange={e => setCustomerInfo({...customerInfo, zip: e.target.value})}
                          />
                      </div>
                      <div className="relative">
                          <label className={LABEL_CLASS}>Street Name / Area*</label>
                          <div className="relative">
                              <Search size={16} color={iconColor} className="absolute left-4 top-1/2 -translate-y-1/2" />
                              <input 
                                type="text" 
                                className={INPUT_CLASS + " pl-12"} 
                                placeholder="Start typing address..."
                                value={customerInfo.street}
                                onChange={e => handleAddressSearch(e.target.value)}
                              />
                              {addressSuggestions.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl mt-2 shadow-2xl z-50 max-h-40 overflow-y-auto">
                                      {addressSuggestions.map((s, i) => (
                                          <div key={i} onClick={() => selectSuggestion(s)} className="p-4 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                              <Navigation size={14} color={iconColor}/>
                                              <span className="truncate">{s}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>
                      <div>
                          <label className={LABEL_CLASS}>City*</label>
                          <input 
                            type="text" 
                            className={INPUT_CLASS} 
                            placeholder="Accra"
                            value={customerInfo.city}
                            onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className={LABEL_CLASS}>State / Region*</label>
                          <input 
                            type="text" 
                            className={INPUT_CLASS} 
                            placeholder="Greater Accra"
                            value={customerInfo.state}
                            onChange={e => setCustomerInfo({...customerInfo, state: e.target.value})}
                          />
                      </div>
                  </div>

                  <button 
                    onClick={() => setShowMapPicker(true)}
                    className="w-full mt-4 py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                    style={{ color: iconColor, borderColor: iconColor }}
                  >
                      <MapIcon size={16} /> Use My Precise Map Location
                  </button>
              </div>
          </div>

          {data.fullPackPrice > 0 && (
              <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                      <Tag size={14} color={iconColor} strokeWidth={4} /> Choose Your Package
                  </h3>
                  <div className="flex flex-col gap-4">
                      <div 
                          onClick={() => setPackageType('single')}
                          className={`p-6 rounded-[2rem] border-2 flex items-center justify-between cursor-pointer transition-all ${packageType === 'single' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg' : 'border-slate-100 bg-slate-50 dark:bg-slate-800'}`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${packageType === 'single' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}><ShoppingCart size={22}/></div>
                              <div>
                                  <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Standard Unit</p>
                                  <p className="text-xs text-slate-500 font-bold">{data.currency} {product?.price.toLocaleString()}</p>
                              </div>
                          </div>
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${packageType === 'single' ? 'border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-500/20' : 'border-slate-200'}`}>
                              {packageType === 'single' && <Check size={16} className="text-white" strokeWidth={4} />}
                          </div>
                      </div>

                      <div 
                          onClick={() => setPackageType('full')}
                          className={`p-6 rounded-[2rem] border-2 flex items-center justify-between cursor-pointer transition-all ${packageType === 'full' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg' : 'border-slate-100 bg-slate-50 dark:bg-slate-800'}`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${packageType === 'full' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}><Package size={22}/></div>
                              <div>
                                  <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Full Case Pack</p>
                                  <p className="text-xs text-slate-500 font-bold">{data.currency} {data.fullPackPrice.toLocaleString()}</p>
                              </div>
                          </div>
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${packageType === 'full' ? 'border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-500/20' : 'border-slate-200'}`}>
                              {packageType === 'full' && <Check size={16} className="text-white" strokeWidth={4} />}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                <LayoutGrid size={14} color={iconColor} strokeWidth={4} /> Checkout Summary
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
                <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-4 items-center">
                        <img src={product?.images[0]} className="w-16 h-16 object-contain bg-white rounded-2xl border border-slate-100 p-2 shadow-sm" />
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate max-w-[120px] tracking-tight">{product?.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{packageType === 'full' ? 'Bulk Case' : 'Individual'}</p>
                        </div>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{data.currency} {unitPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black">
                        <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                        <span className="text-slate-700 dark:text-slate-300">{data.currency} {unitPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black">
                        <span className="text-slate-400 uppercase tracking-widest">Delivery</span>
                        <span className={`uppercase ${shipping === 0 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{shipping === 0 ? 'FREE' : `${data.currency} ${shipping}`}</span>
                    </div>
                    
                    {data.checkoutConfig.shipping.freeShippingThreshold ? (
                        <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider text-center ${unitPrice >= threshold ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20'}`}>
                            {unitPrice >= threshold 
                                ? '🎉 Free Delivery Unlocked!' 
                                : `Add ${data.currency} ${(threshold - unitPrice).toLocaleString()} more for FREE Delivery`}
                        </div>
                    ) : null}

                    <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700 items-end">
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Total Amount</span>
                        <span className="text-3xl font-black text-emerald-500 tracking-tighter">{data.currency} {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-6 pb-20">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                  <CreditCard size={14} color={iconColor} strokeWidth={4} /> Payment Destination
              </h3>
              <div className="flex flex-col gap-3">
                  {data.checkoutConfig.paymentMethods.mobileMoney && (
                      <button onClick={() => handlePaymentSelect('momo')} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${selectedPayment === 'momo' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-4">
                              <Smartphone size={24} className="text-yellow-600"/>
                              <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight">Mobile Money</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 ${selectedPayment === 'momo' ? 'border-emerald-500 bg-emerald-500 shadow-md' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.card && (
                      <button onClick={() => handlePaymentSelect('card')} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${selectedPayment === 'card' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-4">
                              <CardIcon size={24} className="text-indigo-600"/>
                              <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight">Credit / Debit Card</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 ${selectedPayment === 'card' ? 'border-emerald-500 bg-emerald-500 shadow-md' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.bankTransfer && (
                      <button onClick={() => handlePaymentSelect('bank')} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${selectedPayment === 'bank' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-4">
                              <Building2 size={24} className="text-blue-600"/>
                              <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight">Direct Bank Transfer</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 ${selectedPayment === 'bank' ? 'border-emerald-500 bg-emerald-500 shadow-md' : 'border-slate-200'}`} />
                      </button>
                  )}
                  {data.checkoutConfig.paymentMethods.cashOnDelivery && (
                      <button onClick={() => handlePaymentSelect('cod')} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${selectedPayment === 'cod' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 bg-white dark:bg-slate-800'}`}>
                          <div className="flex items-center gap-4">
                              <Wallet size={24} className="text-green-600"/>
                              <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight">Cash on Delivery</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 ${selectedPayment === 'cod' ? 'border-emerald-500 bg-emerald-500 shadow-md' : 'border-slate-200'}`} />
                      </button>
                  )}
              </div>
          </div>
      </div>

      <div className="p-8 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 z-10">
          <button 
              disabled={!selectedPayment} 
              onClick={() => selectedPayment && handlePaymentSelect(selectedPayment)}
              className="w-full py-5 rounded-2xl font-black text-sm bg-slate-900 text-white uppercase tracking-widest shadow-2xl disabled:opacity-30 transition-all active:scale-95 dark:bg-emerald-600 flex items-center justify-center gap-2"
              style={selectedPayment ? { backgroundColor: iconColor } : {}}
          >
              Complete Order Now <ArrowRight size={18} />
          </button>
      </div>
    </div>
  );
};

export default PreviewPanel;
