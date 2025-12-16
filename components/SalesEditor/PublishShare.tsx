
import React, { useState } from 'react';
import { SalesPage } from '../../types/salesPage';
import { Share2, Globe, Copy, ExternalLink, Check, QrCode, Power, Smartphone, Facebook, Linkedin, MessageCircle, Instagram } from 'lucide-react';

interface PublishShareProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const PublishShare: React.FC<PublishShareProps> = ({ data, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Mock URL for display purposes
  const liveUrl = `https://nexu.fbo.com/p/${data.slug || 'untitled'}`;
  const encodedUrl = encodeURIComponent(liveUrl);
  const encodedText = encodeURIComponent(`Check out this offer: ${data.title}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublish = () => {
    onChange('isPublished', !data.isPublished);
  };

  const handleNativeShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: data.title,
                  text: data.subtitle,
                  url: liveUrl,
              });
          } catch (err) {
              console.log('Share canceled');
          }
      } else {
          handleCopy();
          alert('Link copied to clipboard!');
      }
  };

  return (
    <div className="space-y-8 pb-10">
        
        {/* 1. Status & Toggle */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg transition-all duration-500 ${data.isPublished ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200 dark:bg-emerald-900/30 dark:shadow-none' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                <Power size={40} strokeWidth={2.5} className={data.isPublished ? "drop-shadow-sm" : ""} />
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {data.isPublished ? 'Your Page is Live! 🚀' : 'Ready to Launch?'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {data.isPublished 
                        ? 'Your sales page is public and ready to accept customers. Share the link below to start selling.' 
                        : 'Your page is currently hidden. Publish it to make it accessible to your customers.'}
                </p>
            </div>

            <button 
                onClick={togglePublish}
                className={`w-full max-w-xs mx-auto py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
                    data.isPublished 
                    ? 'bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 dark:bg-slate-800 dark:border-red-900/50 dark:text-red-400' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none'
                }`}
            >
                {data.isPublished ? 'Unpublish Page' : 'Publish Now'}
            </button>
        </section>

        {/* 2. Link Management (Only visible if Live, or Draft Preview) */}
        <section className={`transition-opacity duration-500 ${data.isPublished ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Globe className="text-blue-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Public Link</h2>
            </div>
            
            <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-300 truncate">{liveUrl}</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-700 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
                    title="Copy Link"
                >
                    {copied ? <Check size={20} className="text-emerald-400"/> : <Copy size={20} />}
                </button>
                <a 
                    href="#" // In real app, this links to liveUrl
                    target="_blank"
                    className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    title="Open in new tab"
                >
                    <ExternalLink size={20} />
                </a>
            </div>
        </section>

        {/* 3. Sharing Options */}
        <section className={`transition-opacity duration-500 ${data.isPublished ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Share2 className="text-purple-500" size={18} />
                <h2 className="font-bold text-slate-800 dark:text-white">Share Everywhere</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a 
                    href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20"
                >
                    <MessageCircle size={24} />
                    <span className="text-xs font-bold">WhatsApp</span>
                </a>

                <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors border border-[#1877F2]/20"
                >
                    <div className="font-bold text-xl lowercase">f</div>
                    <span className="text-xs font-bold">Facebook</span>
                </a>

                <button 
                    onClick={handleNativeShare}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                >
                    <Smartphone size={24} />
                    <span className="text-xs font-bold">More...</span>
                </button>

                <button 
                    onClick={() => setShowQr(!showQr)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${showQr ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                >
                    <QrCode size={24} />
                    <span className="text-xs font-bold">QR Code</span>
                </button>
            </div>

            {/* QR Code Expansion */}
            {showQr && (
                <div className="mt-6 flex flex-col items-center animate-fade-in p-6 bg-white rounded-2xl border border-slate-100 shadow-sm dark:bg-white/5 dark:border-slate-700">
                    <div className="bg-white p-2 rounded-xl">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`} 
                            alt="Page QR Code" 
                            className="w-32 h-32 md:w-40 md:h-40"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wide">Scan to view page</p>
                </div>
            )}
        </section>

        {/* 4. Coach's Tip */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Share2 size={64} />
            </div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                💡 Coach's Tip
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
                Publishing is just the first step! To get results, share this link directly with 5-10 people on WhatsApp today with a personal message.
            </p>
        </div>

    </div>
  );
};

export default PublishShare;
