
import React, { useState } from 'react';
import { SalesPage, FaqItem } from '../../types/salesPage';
import { 
  X, ChevronLeft, ShoppingBag, CreditCard, Smartphone, Banknote, 
  Truck, ArrowRight, ShieldCheck, MapPin, Tag, Package, Building2,
  Calendar, CreditCard as CardIcon, Lock, CheckCircle2, User, Mail, Phone,
  Wallet, AlertCircle
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
  
  const settings = isMobile && data.mobileOverrides ? { ...data, ...data.mobileOverrides } : data;
  const baseSize = settings.baseFontSize || 16;
  const scaleRatio = settings.typeScale || 1.25;
  const spacingValue = settings.sectionSpacing ?? 5;
  
  const h1Size = isMobile ? Math.round(baseSize * 1.5) : Math.round(baseSize * Math.pow(scaleRatio, 4)); 
  const radius = data.buttonCorner === 'pill' ? '9999px' : data.buttonCorner === 'rounded' ? '0.75rem' : '0px';

  const previewStyle = {
    '--font-heading': `'${data.headingFont}', sans-serif`,
    '--font-body': `'${data.bodyFont}', sans-serif`,
    '--base-size': `${baseSize}px`,
    '--h1-size': `${h1Size}px`,
    '--theme-color': data.themeColor || '#10b981',
    '--page-bg': data.pageBgColor || '#064e3b',
    '--card-bg': data.cardBgColor || '#fcd34d',
    '--section-padding': `${1 + (spacingValue * 0.5)}rem`,
    '--btn-radius': radius,
  } as React.CSSProperties;

  const renderActiveTemplate = () => {
      const type = data.type;
      const theme = data.layoutStyle;

      const handlers = {
          data,
          onOpenCheckout: () => setIsCheckoutOpen(true),
          onReadMoreStory: () => setIsStoryDrawerOpen(true),
          onReadMoreBenefits: () => {},
          onReadMoreUsage: () => {},
          onOpenFaq: (faq: FaqItem) => {},
          onViewAllFaqs: () => {},
      };

      if (type === 'product' && theme === 'clean') {
          return <ProductClean {...handlers} />;
      }
      return <Placeholder data={data} type={type} theme={theme} />;
  };

  const ContentShell = (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar preview-wrapper bg-white dark:bg-slate-950 z-[1]" style={previewStyle}>
        <div className="min-h-full flex flex-col">
            {renderActiveTemplate()}
        </div>
        
        {/* Main Checkout Drawer */}
        <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
            <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
        </div>

        {/* Story Drawer */}
        <div className={`custom-story-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4"></div>
            <div className="flex justify-between items-center px-6 pt-4 pb-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-2 text-left">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
        </div>
    </div>
  );

  return (
    <>
      <style>{`
        .preview-wrapper { font-family: var(--font-body); font-size: var(--base-size); line-height: 1.6; color: #334155; width: 100%; height: 100%; position: relative; }
        .preview-wrapper h1 { font-family: var(--font-heading); line-height: 1.1; font-weight: 800; font-size: var(--h1-size); margin-bottom: 1rem; }
        .clean-section { padding: var(--section-padding) 1.5rem; }
        .clean-btn { border-radius: var(--btn-radius); padding: 0.85rem 1rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem; min-height: 3.5rem; }
        .attachment-card { background-color: white; border-radius: 2.5rem; border: 1px solid #e2e8f0; padding: 2rem; position: relative; }
        .dark .attachment-card { background-color: #111827; border-color: #334155; }
        .arch-frame { border-radius: 12rem; width: 100%; aspect-ratio: 4 / 5; background-color: var(--card-bg); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
        .custom-story-drawer { position: absolute; left: 0; right: 0; bottom: -110%; background: white; z-index: 700; border-top-left-radius: 2.5rem; border-top-right-radius: 2.5rem; box-shadow: 0 -10px 40px -10px rgba(0,0,0,0.3); max-height: 85%; display: flex; flex-direction: column; transform: translateY(110%); visibility: hidden; opacity: 0; transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1); }
        .custom-story-drawer.open { bottom: 0; transform: translateY(0); visibility: visible; opacity: 1; pointer-events: auto; }
        .dark .custom-story-drawer { background: #0f172a; border-top: 1px solid #334155; }
        .checkout-drawer { position: absolute; top: 0; right: -100%; bottom: 0; width: 100%; background: white; z-index: 600; transition: right 0.4s cubic-bezier(0.32, 0.72, 0, 1); display: flex; flex-direction: column; overflow: hidden; }
        .checkout-drawer.open { right: 0; }
        .dark .checkout-drawer { background: #0b141a; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {isMobile ? (
        <div className="mx-auto w-full max-w-[375px] h-full max-h-[850px] rounded-[2.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative" style={{ backgroundColor: data.pageBgColor }}>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-[150]"></div>
           {ContentShell}
        </div>
      ) : (
        <div className="hidden md:block relative w-[410px] aspect-[9/19.5] max-h-[92vh] group scale-95 lg:scale-100">
            <div className="absolute -left-[3px] top-28 w-[4px] h-14 bg-slate-800 rounded-l-md border-r border-white/5"></div>
            <div className="absolute -left-[3px] top-48 w-[4px] h-20 bg-slate-800 rounded-l-md border-r border-white/5"></div>
            <div className="absolute -right-[3px] top-44 w-[4px] h-24 bg-slate-800 rounded-r-md border-l border-white/5"></div>
            <div className="w-full h-full bg-slate-950 rounded-[3.5rem] p-[12px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-[4px] border-slate-800 relative ring-1 ring-white/10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-32 bg-slate-950 rounded-b-3xl z-[250] flex items-center justify-end px-6 gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-full bg-[#111] border border-white/5"></div>
                </div>
                <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-white relative">
                    {ContentShell}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
    const product = data.products[0];
    const config = data.checkoutConfig;
    
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [activePaymentAction, setActivePaymentAction] = useState<'MOMO' | 'CARD' | null>(null);
    
    // Form States (Simulated)
    const [momoNumber, setMomoNumber] = useState('');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const subtotal = product?.price || 0;
    const shippingCost = config.shipping.flatRate || 0;
    const total = subtotal + shippingCost;

    const handleMethodSelect = (id: string) => {
        setSelectedMethod(id);
        if (id === 'momo') setActivePaymentAction('MOMO');
        else if (id === 'card') setActivePaymentAction('CARD');
        else setActivePaymentAction(null);
    };

    const InputField = ({ label, placeholder, icon: Icon, type = "text", value, onChange }: any) => (
        <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider ml-1">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3.5 top-3.5 text-slate-400" size={16} />}
                <input 
                    type={type} 
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder} 
                    className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all ${Icon ? 'pl-11' : ''} dark:text-white`}
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0b141a] text-slate-900 dark:text-white font-sans relative">
            {/* Header */}
            <div className="p-5 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0b141a]/95 backdrop-blur-md z-40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:hover:bg-slate-800"><ChevronLeft size={24}/></button>
                    <div>
                        <h2 className="text-lg font-black leading-none">Checkout</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Place Your Order</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={24} />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
                {/* Minimal Order Preview */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-slate-100 dark:border-slate-700">
                            {product?.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{product?.name || data.title}</h4>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{data.currency} {product?.price}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-10">
                    {/* Personal Info */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                            <User size={18} className="text-emerald-500" />
                            <h3 className="font-black text-sm uppercase tracking-wider">Contact Info</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="First Name" placeholder="John" />
                            <InputField label="Last Name" placeholder="Doe" />
                        </div>
                        <InputField label="Email" placeholder="john@example.com" icon={Mail} type="email" />
                        <InputField label="Phone" placeholder="054 123 4567" icon={Phone} type="tel" />
                    </div>

                    {/* Shipping Address */}
                    {config.shipping.enabled && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={18} className="text-blue-500" />
                                <h3 className="font-black text-sm uppercase tracking-wider">Shipping Details</h3>
                            </div>
                            <InputField label="Street Address" placeholder="123 Aloevera Lane" />
                            <InputField label="City" placeholder="Accra" />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="State / Region" placeholder="Greater Accra" />
                                <InputField label="Postal Code" placeholder="GA-123" />
                            </div>
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet size={18} className="text-amber-500" />
                            <h3 className="font-black text-sm uppercase tracking-wider">Payment Method</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {config.paymentMethods.mobileMoney && (
                                <PaymentCard 
                                    id="momo"
                                    label="Mobile Money" 
                                    desc="MTN, Vodafone, Airtel" 
                                    icon={Smartphone} 
                                    active={selectedMethod === 'momo'} 
                                    onClick={() => handleMethodSelect('momo')} 
                                />
                            )}
                            {config.paymentMethods.card && (
                                <PaymentCard 
                                    id="card"
                                    label="Credit / Debit Card" 
                                    desc="Visa, Mastercard, Amex" 
                                    icon={CardIcon} 
                                    active={selectedMethod === 'card'} 
                                    onClick={() => handleMethodSelect('card')} 
                                />
                            )}
                            {config.paymentMethods.cashOnDelivery && (
                                <PaymentCard 
                                    id="cod"
                                    label="Cash on Delivery" 
                                    desc="Pay when receiving" 
                                    icon={Banknote} 
                                    active={selectedMethod === 'cod'} 
                                    onClick={() => handleMethodSelect('cod')} 
                                />
                            )}
                            {config.paymentMethods.bankTransfer && (
                                <PaymentCard 
                                    id="bank"
                                    label="Bank Transfer" 
                                    desc="Direct wire to bank" 
                                    icon={Building2} 
                                    active={selectedMethod === 'bank'} 
                                    onClick={() => handleMethodSelect('bank')} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Summary Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white dark:bg-[#0b141a] border-t border-slate-100 dark:border-slate-800 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Total</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{data.currency} {total.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Shipping</p>
                        <p className="text-xs font-bold text-emerald-600">{shippingCost === 0 ? 'FREE' : `${data.currency} ${shippingCost}`}</p>
                    </div>
                </div>
                <button className="w-full bg-emerald-600 text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    Complete Order <ArrowRight size={20}/>
                </button>
            </div>

            {/* Payment Detail Drawers */}
            <PaymentSubDrawer 
                isOpen={activePaymentAction === 'MOMO'} 
                onClose={() => setActivePaymentAction(null)}
                title="Mobile Money"
                icon={Smartphone}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
                        <AlertCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                            A payment prompt will be sent to this number. Please authorize the transaction on your phone.
                        </p>
                    </div>
                    <InputField label="Enter Phone Number" placeholder="054 XXXXXXX" icon={Smartphone} type="tel" value={momoNumber} onChange={setMomoNumber} />
                    <button onClick={() => setActivePaymentAction(null)} className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95">Send Confirmation</button>
                </div>
            </PaymentSubDrawer>

            <PaymentSubDrawer 
                isOpen={activePaymentAction === 'CARD'} 
                onClose={() => setActivePaymentAction(null)}
                title="Card Details"
                icon={CardIcon}
            >
                <div className="space-y-5">
                    <InputField label="Cardholder Name" placeholder="JOHN DOE" icon={User} />
                    <InputField label="Card Number" placeholder="0000 0000 0000 0000" icon={CardIcon} type="tel" />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Expiry Date" placeholder="MM/YY" icon={Calendar} type="tel" />
                        <InputField label="CVV" placeholder="123" icon={Lock} type="password" />
                    </div>
                    <div className="flex items-center gap-2 justify-center py-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-500" /> 100% Encrypted & Secure
                    </div>
                    <button onClick={() => setActivePaymentAction(null)} className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all active:scale-95">Verify & Pay</button>
                </div>
            </PaymentSubDrawer>
        </div>
    );
};

const PaymentCard = ({ label, desc, icon: Icon, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${active ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-200 dark:hover:border-slate-700'}`}
    >
        <div className={`p-3 rounded-xl ${active ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
            <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm leading-none mb-1 ${active ? 'text-emerald-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>{label}</h4>
            <p className={`text-[10px] font-medium uppercase tracking-wider ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{desc}</p>
        </div>
        {active && <CheckCircle2 className="text-emerald-500" size={20} />}
    </button>
);

const PaymentSubDrawer = ({ isOpen, onClose, title, icon: Icon, children }: any) => (
    <div className={`absolute inset-0 z-[100] transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-[#152026] rounded-t-[2.5rem] shadow-2xl p-8 transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-8"></div>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-black font-heading dark:text-white">{title}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Confirm Details</p>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"><X size={20}/></button>
            </div>
            {children}
        </div>
    </div>
);

export default PreviewPanel;
