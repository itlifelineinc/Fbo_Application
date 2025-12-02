import React, { useState, useRef } from 'react';
import { Student, SaleRecord } from '../types';
import { analyzeReceipt } from '../services/geminiService';

interface SalesPortalProps {
  currentUser: Student;
  onSubmitSale: (sale: SaleRecord) => void;
}

const SalesPortal: React.FC<SalesPortalProps> = ({ currentUser, onSubmitSale }) => {
  const [amount, setAmount] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [saleType, setSaleType] = useState<'RETAIL' | 'WHOLESALE'>('RETAIL');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants based on FBO rules
  const RETAIL_DIVISOR = 346;
  const WHOLESALE_DIVISOR = 242;

  const calculateCC = (val: number, type: 'RETAIL' | 'WHOLESALE') => {
    const divisor = type === 'RETAIL' ? RETAIL_DIVISOR : WHOLESALE_DIVISOR;
    return parseFloat((val / divisor).toFixed(3));
  };

  const currentCC = calculateCC(parseFloat(amount) || 0, saleType);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setReceiptImage(base64);
        
        // Trigger AI Scan using Gemini
        setIsScanning(true);
        try {
            const result = await analyzeReceipt(base64);
            if (result) {
                if (result.amount) setAmount(result.amount.toString());
                if (result.transactionId) setTransactionId(result.transactionId);
            } else {
                console.log("AI could not extract data, please enter manually.");
            }
        } catch (e) {
            console.error("Scan failed", e);
        } finally {
            setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !transactionId) return;

    const newSale: SaleRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(amount),
        type: saleType,
        ccEarned: currentCC,
        transactionId: transactionId,
        receiptUrl: receiptImage || undefined,
        status: 'APPROVED' // In a real app, this might be PENDING
    };

    onSubmitSale(newSale);
    
    // Reset Form
    setAmount('');
    setTransactionId('');
    setReceiptImage(null);
    alert(`Sales Report Submitted! +${currentCC} CC added to your profile.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="md:flex md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold text-emerald-950 font-heading dark:text-emerald-400">Sales & Case Credits</h1>
            <p className="text-emerald-700 mt-1 dark:text-emerald-300">Report your sales to rank up in the business.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-bold flex flex-col items-center border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
            <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Accumulated</span>
            <span className="text-2xl">{currentUser.caseCredits.toFixed(3)} CC</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Submission Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-heading dark:text-slate-100">Log New Transaction</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Receipt Upload Area */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        receiptImage ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50'
                    }`}
                >
                    {isScanning ? (
                        <div className="py-4 flex flex-col items-center text-emerald-600 dark:text-emerald-400">
                            <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-semibold">Scanning Receipt...</span>
                        </div>
                    ) : receiptImage ? (
                        <div className="relative">
                            <img src={receiptImage} alt="Receipt" className="h-32 mx-auto rounded-lg shadow-sm object-contain" />
                            <p className="text-xs text-emerald-600 mt-2 font-medium dark:text-emerald-400">Click to change image</p>
                        </div>
                    ) : (
                        <div className="py-4 text-slate-500 dark:text-slate-400">
                            <CameraIcon />
                            <p className="text-sm font-medium mt-2">Upload Receipt / Proof of Payment</p>
                            <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">We'll scan the amount automatically</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Transaction ID</label>
                        <input 
                            type="text" 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. TXN-123456"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-mono text-sm bg-white text-slate-900 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Sale Type</label>
                        <select 
                            value={saleType}
                            onChange={(e) => setSaleType(e.target.value as any)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none bg-white text-slate-900 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                        >
                            <option value="RETAIL">Retail (1CC = ${RETAIL_DIVISOR})</option>
                            <option value="WHOLESALE">Wholesale (1CC = ${WHOLESALE_DIVISOR})</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Total Amount ($)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:border-emerald-500 outline-none font-bold text-lg bg-white text-slate-900 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:bg-slate-700/50 dark:border-slate-600">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold dark:text-slate-400">Calculated Value</p>
                        <p className="text-sm text-slate-600 mt-1 dark:text-slate-300">
                            ${amount || '0'} / ${saleType === 'RETAIL' ? RETAIL_DIVISOR : WHOLESALE_DIVISOR}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600 font-heading dark:text-emerald-400">{currentCC}</p>
                        <p className="text-xs text-emerald-800 font-bold dark:text-emerald-300">CC Earned</p>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={!amount || !transactionId || isScanning}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Sales Report
                </button>
            </form>
        </div>

        {/* History & Info */}
        <div className="space-y-6">
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg dark:from-slate-700 dark:to-slate-800">
                <h3 className="font-bold text-lg mb-2 font-heading">How CC works</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Case Credits (CC) are the currency of Forever. Your rank is determined by the CC you accumulate over 2 consecutive months.
                </p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Retail Value</span>
                        <span className="font-mono text-yellow-400">1 CC = ${RETAIL_DIVISOR}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Wholesale Value</span>
                        <span className="font-mono text-yellow-400">1 CC = ${WHOLESALE_DIVISOR}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto dark:divide-slate-700">
                    {currentUser.salesHistory && currentUser.salesHistory.length > 0 ? (
                        currentUser.salesHistory.map((sale) => (
                            <div key={sale.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm dark:text-slate-200">{sale.type} Sale</p>
                                    <p className="text-xs text-slate-500 font-mono dark:text-slate-400">{sale.transactionId}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{sale.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-emerald-600 dark:text-emerald-400">+{sale.ccEarned} CC</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 font-medium dark:bg-green-900/30 dark:text-green-300">
                                        {sale.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            No sales reported yet.
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const CameraIcon = () => (
    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:bg-slate-700 dark:text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
    </div>
);

export default SalesPortal;