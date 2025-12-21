
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { SalesPage, Product, FaqItem } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { 
  Check, User, ShoppingCart, MessageCircle, ChevronLeft,
  Image as ImageIcon, CreditCard, Smartphone, Truck, Send, Loader2, Package, 
  ShoppingBag, CheckCircle, ChevronDown, Wallet, Building2, CreditCard as CardIcon, 
  MapPin, Mail, LayoutGrid, Map as MapIcon, Navigation, Search, X, AlertCircle,
  Tag, ArrowRight, Box, Home, Clock, Plus, Minus, Crosshair, Mic, Landmark, Banknote, RefreshCw, Map
} from 'lucide-react';

// Import Templates
import ProductClean from '../SalesPreview/templates/Product/Clean';
import Placeholder from '../SalesPreview/templates/Placeholder';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const MOCK_ADDRESSES = [
    { street: '123 Independence Ave', city: 'Accra', region: 'Greater Accra', zip: 'GA-123-4567' },
    { street: '45 Osei Tutu Blvd', city: 'Kumasi', region: 'Ashanti', zip: 'AK-000-1111' },
    { street: '88 Harbour Road', city: 'Tema', region: 'Greater Accra', zip: 'GT-022-8888' },
    { street: '12 Cape Coast Highway', city: 'Takoradi', region: 'Western', zip: 'WR-001-2222' },
    { street: '500 Oxford Street', city: 'Osu, Accra', region: 'Greater Accra', zip: 'GA-002-3333' }
];

const CheckoutView: React.FC<{ data: SalesPage; onClose: () => void }> = ({ data, onClose }) => {
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [activeDrawer, setActiveDrawer] = useState<'MOMO' | 'CARD' | null>(null);
    const product = data.products[0];

    // Shipping State
    const [shipping, setShipping] = useState({
        street: '',
        apartment: '',
        city: '',
        region: '',
        zip: ''
    });
    const [addressSuggestions, setAddressSuggestions] = useState<typeof MOCK_ADDRESSES>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Payment Form States
    const [momoNumber, setMomoNumber] = useState('');
    const [momoProvider, setMomoProvider] = useState('MTN');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setShipping({ ...shipping, street: val });
        
        if (val.length > 2) {
            const matches = MOCK_ADDRESSES.filter(addr => 
                addr.street.toLowerCase().includes(val.toLowerCase())
            );
            setAddressSuggestions(matches);
            setShowSuggestions(matches.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectAddress = (addr: typeof MOCK_ADDRESSES[0]) => {
        setShipping({
            ...shipping,
            street: addr.street,
            city: addr.city,
            region: addr.region,
            zip: addr.zip
        });
        setShowSuggestions(false);
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setOrderSuccess(true);
        }, 1500);
    };

    const paymentMethods = data.checkoutConfig?.paymentMethods || {};
    const availablePayments = [
        { id: 'momo', label: 'Mobile Money', icon: Smartphone, enabled: paymentMethods.mobileMoney, color: 'text-yellow-600', drawer: 'MOMO' as const },
        { id: 'card', label: 'Credit/Debit Card', icon: CardIcon, enabled: paymentMethods.card, color: 'text-blue-600', drawer: 'CARD' as const },
        { id: 'cod', label: 'Cash on Delivery', icon: Banknote, enabled: paymentMethods.cashOnDelivery, color: 'text-emerald-600' },
        { id: 'bank', label: 'Bank Transfer', icon: Landmark, enabled: paymentMethods.bankTransfer, color: 'text-slate-600' },
    ].filter(p => p.enabled);

    useEffect(() => {
        if (!selectedPayment && availablePayments.length > 0) {
            setSelectedPayment(availablePayments[0].id);
        }
    }, [availablePayments]);

    const handlePaymentSelect = (p: any) => {
        setSelectedPayment(p.id);
        if (p.drawer) {
            setActiveDrawer(p.drawer);
        }
    };

    if (isTracking) {
        return (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0f172a] animate-fade-in">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
                    <button onClick={() => setIsTracking(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-bold text-slate-900 dark:text-white">Track Order #NEXU-9821</h3>
                </div>
                <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
                    <div className="bg-emerald-600 text-white p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Estimated Delivery</p>
                            <h2 className="text-3xl font-black font-heading mt-1">Today, 4:30 PM</h2>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span>In Transit</span>
                            </div>
                        </div>
                        <Truck size={120} className="absolute -right-8 -bottom-8 text-white/10" strokeWidth={1} />
                    </div>

                    <div className="space-y-8 relative">
                        <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                        
                        {[
                            { label: 'Order Placed', time: '10:05 AM', done: true, current: false },
                            { label: 'Confirmed & Packed', time: '11:20 AM', done: true, current: false },
                            { label: 'Handed to Courier', time: '1:45 PM', done: true, current: true },
                            { label: 'Out for Delivery', time: 'Waiting', done: false, current: false },
                            { label: 'Delivered', time: 'Waiting', done: false, current: false }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6 relative z-10">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-[#0f172a] shadow-sm ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                    {step.done ? <Check size={18} strokeWidth={4} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`font-black text-sm uppercase tracking-wider ${step.done || step.current ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</h4>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5">{step.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">Delivery Address</h4>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{shipping.street}, {shipping.city}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white dark:bg-emerald-600 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Back to Store</button>
                </div>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in bg-white dark:bg-[#0f172a]">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-8 dark:bg-emerald-900/30 shadow-xl shadow-emerald-500/10">
                    <CheckCircle size={56} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 font-heading tracking-tight">Order Received!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed max-w-[280px]">We've received your payment and are preparing your package for shipment.</p>
                
                <div className="w-full space-y-3">
                    <button 
                        onClick={() => setIsTracking(true)}
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Map size={18} /> Track Your Order
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                    >
                        Return to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] relative overflow-hidden">
            {/* Payment Specific Drawers */}
            <div className={`custom-drawer ${activeDrawer === 'MOMO' ? 'open' : ''}`}>
                <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
                <button onClick={() => setActiveDrawer(null)} className="absolute top-4 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X size={20} />
                </button>
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
                            <Smartphone size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mobile Money</h3>
                        <p className="text-xs text-slate-500 mt-1">Select provider and enter your number</p>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            {['MTN', 'Telecel', 'AirtelTigo'].map(p => (
                                <button key={p} onClick={() => setMomoProvider(p)} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${momoProvider === p ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30' : 'border-slate-100 text-slate-400'}`}>{p}</button>
                            ))}
                        </div>
                        <input 
                            type="tel" 
                            placeholder="Mobile Number (e.g. 054...)" 
                            value={momoNumber}
                            onChange={e => setMomoNumber(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                        />
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Confirm Payment</button>
                </div>
            </div>

            <div className={`custom-drawer ${activeDrawer === 'CARD' ? 'open' : ''}`}>
                <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
                <button onClick={() => setActiveDrawer(null)} className="absolute top-4 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X size={20} />
                </button>
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
                            <CardIcon size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Secure Card</h3>
                        <p className="text-xs text-slate-500 mt-1">Visa, Mastercard, or AMEX</p>
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM / YY" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                            <input type="password" placeholder="CVV" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                        </div>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Submit Payment</button>
                </div>
            </div>

            {/* Checkout Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900 shrink-0">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Order Details</h3>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <form onSubmit={handleSubmitOrder} className="p-6 space-y-12 pb-20">
                    
                    {/* Section 1: Item Summary */}
                    <div className="space-y-4">
                        <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] ml-1">Your Package</h4>
                        <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shrink-0 border border-slate-200 dark:bg-slate-700 dark:border-slate-600 shadow-sm p-1">
                                {product?.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" /> : <Box className="w-full h-full p-5 text-slate-300" />}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">{product?.name || 'Product'}</p>
                                <p className="text-sm text-emerald-600 font-black mt-0.5">{data.currency} {product?.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact */}
                    <div className="space-y-5">
                        <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] ml-1">Customer Info</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name</label>
                                    <input type="text" required placeholder="John" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                                    <input type="text" required placeholder="Smith" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp / Phone</label>
                                <input type="tel" required placeholder="+233..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Detailed Shipping (Amazon Style) */}
                    {data.checkoutConfig?.shipping?.enabled && (
                        <div className="space-y-5">
                            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] ml-1">Shipping Address</h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5 relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Street Address</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={shipping.street} 
                                        onChange={handleStreetChange} 
                                        placeholder="House number and street name" 
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" 
                                    />
                                    {/* Address Suggestions */}
                                    {showSuggestions && (
                                        <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {addressSuggestions.map((addr, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => selectAddress(addr)}
                                                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-0"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                        <MapPin size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{addr.street}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{addr.city}, {addr.region}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Apartment, suite, etc. <span className="opacity-50">(optional)</span></label>
                                    <input type="text" value={shipping.apartment} onChange={e => setShipping({...shipping, apartment: e.target.value})} placeholder="Apt 4B" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">City / Town</label>
                                        <input type="text" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} placeholder="Accra" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Region / State</label>
                                        <input type="text" required value={shipping.region} onChange={e => setShipping({...shipping, region: e.target.value})} placeholder="Greater Accra" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Zip / Postal Code</label>
                                    <input type="text" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} placeholder="00233" className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Payment Selection */}
                    <div className="space-y-5">
                        <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] ml-1">Payment Method</h4>
                        <div className="space-y-3">
                            {availablePayments.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handlePaymentSelect(p)}
                                    className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all shadow-sm ${selectedPayment === p.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-700 shadow-sm ${p.color}`}>
                                            <p.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-left">
                                            <span className={`text-sm font-black uppercase tracking-wider block ${selectedPayment === p.id ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{p.label}</span>
                                            {p.id === 'momo' && momoNumber && <span className="text-[10px] font-bold text-emerald-600">{momoProvider}: {momoNumber}</span>}
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPayment === p.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-white'}`}>
                                        {selectedPayment === p.id && <Check size={14} className="text-white" strokeWidth={4} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA Overlay */}
                    <div className="pt-6 space-y-6">
                        <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Grand Total</span>
                            <span className="text-2xl font-black">{data.currency} {product?.price?.toLocaleString()}</span>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Complete Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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

        /* Unified Drawer Style */
        .custom-drawer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -110%;
            background: white;
            z-index: 700;
            border-top-left-radius: 2.5rem;
            border-top-right-radius: 2.5rem;
            box-shadow: 0 -10px 40px -10px rgba(0,0,0,0.3);
            max-height: 90%;
            display: flex;
            flex-direction: column;
            transform: translateY(110%);
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .custom-drawer.open {
            bottom: 0;
            transform: translateY(0);
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
        }
        .dark .custom-drawer { background: #0f172a; border-top: 1px solid #334155; }

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

        /* Sophisticated Mesh Gradient Stage */
        .stage-bg {
            background-color: #0f172a;
            background-image: 
                radial-gradient(at 0% 0%, var(--page-bg) 0px, transparent 50%),
                radial-gradient(at 100% 0%, #1e293b) 0px, transparent 50%),
                radial-gradient(at 100% 100%, var(--page-bg) 0px, transparent 50%),
                radial-gradient(at 0% 100%, #1e293b 0px, transparent 50%);
            position: relative;
        }
        .stage-overlay {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
            background-size: 32px 32px;
            pointer-events: none;
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

           {/* Drawers for Mobile */}
           <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''}`}>
              <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
           </div>

           <div className={`custom-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                  <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </div>
           </div>

           <div className={`custom-drawer ${isBenefitsDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
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

           <div className={`custom-drawer ${isUsageDrawerOpen ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
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

           <div className={`custom-drawer ${activeFaqForDrawer ? 'open' : ''}`}>
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
              <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Question</h3>
                  <button onClick={() => setActiveFaqForDrawer(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                  <p className="text-base font-black text-slate-900 dark:text-white mb-4">{activeFaqForDrawer?.question}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeFaqForDrawer?.answer}</p>
              </div>
           </div>
        </div>
      ) : (
        /* DESKTOP VIEW: Focused 700px container with fixed gradient background */
        <div className="w-full h-full stage-bg flex items-center justify-center overflow-hidden">
            <div className="stage-overlay"></div>
            
            {/* The 700px Container (The "Page") */}
            <div 
                className="w-full max-w-[700px] h-[95%] bg-white dark:bg-slate-950 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative rounded-2xl overflow-hidden flex flex-col"
            >
                {/* Scrollable content area inside the 700px container */}
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth preview-wrapper" style={previewStyle}>
                    {renderActiveTemplate()}
                </div>

                {/* Drawers strictly contained within the 700px box */}
                <div className={`checkout-drawer ${isCheckoutOpen ? 'open' : ''} border-l border-slate-100 shadow-2xl z-[600] dark:border-slate-800`}>
                    <CheckoutView data={data} onClose={() => setIsCheckoutOpen(false)} />
                </div>

                <div className={`custom-drawer ${isStoryDrawerOpen ? 'open' : ''}`}>
                  <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
                  <div className="flex justify-between items-center px-6 pt-4 pb-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.shortStoryTitle || 'The Story'}</h3>
                      <button onClick={() => setIsStoryDrawerOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                  </div>
                </div>

                <div className={`custom-drawer ${isBenefitsDrawerOpen ? 'open' : ''}`}>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
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

                <div className={`custom-drawer ${isUsageDrawerOpen ? 'open' : ''}`}>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
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
                
                <div className={`custom-drawer ${activeFaqForDrawer ? 'open' : ''}`}>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 shrink-0"></div>
                    <div className="flex justify-between items-center px-6 pt-4 pb-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Question</h3>
                        <button onClick={() => setActiveFaqForDrawer(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 no-scrollbar pt-2 text-left">
                        <p className="text-base font-black text-slate-900 dark:text-white mb-4">{activeFaqForDrawer?.question}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeFaqForDrawer?.answer}</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default PreviewPanel;
