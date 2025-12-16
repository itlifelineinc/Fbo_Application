
import React from 'react';
import { SalesPage, CheckoutConfig } from '../../types/salesPage';
import { ShoppingCart, Smartphone, CreditCard, Banknote, Truck, Bell, MessageCircle, MapPin, Wallet, ShoppingBag } from 'lucide-react';

interface CheckoutConfigurationProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const CheckoutConfiguration: React.FC<CheckoutConfigurationProps> = ({ data, onChange }) => {
  const { checkoutConfig, currency } = data;

  const updateConfig = (section: keyof CheckoutConfig, key: string, value: any) => {
      if (section === 'enabled') {
          onChange('checkoutConfig', { ...checkoutConfig, enabled: value });
      } else {
          onChange('checkoutConfig', {
              ...checkoutConfig,
              [section]: {
                  ...checkoutConfig[section as keyof Omit<CheckoutConfig, 'enabled'>],
                  [key]: value
              }
          });
      }
  };

  return (
    <div className="space-y-8 pb-10">
        
        {/* 1. Main Mode Switch */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ShoppingCart className="text-emerald-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Commerce Mode</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                    onClick={() => updateConfig('enabled', '', false)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${!checkoutConfig.enabled ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <div className={`p-3 rounded-full ${!checkoutConfig.enabled ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${!checkoutConfig.enabled ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-white'}`}>Lead Generation</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Buttons redirect to WhatsApp. Best for high-ticket items requiring conversation.
                        </p>
                    </div>
                </div>

                <div 
                    onClick={() => updateConfig('enabled', '', true)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${checkoutConfig.enabled ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 bg-white hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
                >
                    <div className={`p-3 rounded-full ${checkoutConfig.enabled ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${checkoutConfig.enabled ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-white'}`}>Direct Checkout</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Enable Add-to-Cart and instant purchase. Capture payment upfront.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Conditional Sections */}
        {checkoutConfig.enabled && (
            <div className="animate-fade-in space-y-8">
                
                {/* 2. Payment Methods */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Wallet className="text-blue-500" size={18} />
                        <h2 className="font-bold text-slate-800 dark:text-white">Payment Options</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <Smartphone className="text-yellow-600" size={20} />
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Mobile Money</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.paymentMethods.mobileMoney}
                                onChange={(e) => updateConfig('paymentMethods', 'mobileMoney', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <Banknote className="text-green-600" size={20} />
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Cash on Delivery</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.paymentMethods.cashOnDelivery}
                                onChange={(e) => updateConfig('paymentMethods', 'cashOnDelivery', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-indigo-600" size={20} />
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Card Payment</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.paymentMethods.card}
                                onChange={(e) => updateConfig('paymentMethods', 'card', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="font-serif font-bold text-slate-600 bg-slate-200 w-5 h-5 flex items-center justify-center rounded text-xs">B</div>
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Bank Transfer</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.paymentMethods.bankTransfer}
                                onChange={(e) => updateConfig('paymentMethods', 'bankTransfer', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>
                    </div>
                </section>

                {/* 3. Shipping & Delivery */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Truck className="text-orange-500" size={18} />
                        <h2 className="font-bold text-slate-800 dark:text-white">Shipping & Delivery</h2>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700 dark:text-white">Require Shipping Address</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={checkoutConfig.shipping.enabled} 
                                    onChange={(e) => updateConfig('shipping', 'enabled', e.target.checked)} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 dark:bg-slate-700"></div>
                            </label>
                        </div>

                        {checkoutConfig.shipping.enabled && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Flat Rate ({currency})</label>
                                    <input 
                                        type="number" 
                                        value={checkoutConfig.shipping.flatRate}
                                        onChange={(e) => updateConfig('shipping', 'flatRate', parseFloat(e.target.value))}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 dark:text-slate-400">Free Ship Threshold</label>
                                    <input 
                                        type="number" 
                                        value={checkoutConfig.shipping.freeShippingThreshold}
                                        onChange={(e) => updateConfig('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Allow Local Pickup</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.shipping.pickupOption}
                                onChange={(e) => updateConfig('shipping', 'pickupOption', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </section>

                {/* 4. Order Notifications */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Bell className="text-purple-500" size={18} />
                        <h2 className="font-bold text-slate-800 dark:text-white">Order Alerts</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800">
                            <div>
                                <p className="font-bold text-sm text-slate-700 dark:text-white">WhatsApp Alert</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Receive order details via WhatsApp</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.notifications.whatsappOrderAlert}
                                onChange={(e) => updateConfig('notifications', 'whatsappOrderAlert', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800">
                            <div>
                                <p className="font-bold text-sm text-slate-700 dark:text-white">Email Alert</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Send order confirmation to your email</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={checkoutConfig.notifications.emailOrderAlert}
                                onChange={(e) => updateConfig('notifications', 'emailOrderAlert', e.target.checked)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                        </label>
                    </div>
                </section>

            </div>
        )}

    </div>
  );
};

export default CheckoutConfiguration;
