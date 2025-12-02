import React from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  
  if (device === 'desktop') {
    return (
      <div className="w-full h-full bg-white overflow-y-auto scroll-smooth shadow-sm relative">
         <PreviewContent data={data} />
         <div className="fixed bottom-8 right-8 z-50">
            <WhatsAppFloatingButton phoneNumber={data.whatsappNumber} isVisible={true} />
         </div>
      </div>
    );
  }

  // Mobile View (Simulated Phone Frame)
  return (
    <div className="mx-auto w-full max-w-[375px] h-[800px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border-[10px] md:border-[12px] border-slate-900 overflow-hidden relative ring-1 ring-black/10 shrink-0 flex flex-col my-auto">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20 pointer-events-none"></div>
        
        {/* Scrollable Content */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth bg-white relative">
            <PreviewContent data={data} />
            {/* Spacer for bottom navigation bar area on phones */}
            <div className="h-6"></div>
        </div>

        {/* Floating Button inside phone frame */}
        <div className="absolute bottom-4 right-4 z-50">
           <WhatsAppFloatingButton phoneNumber={data.whatsappNumber} isVisible={true} />
        </div>
        
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
    </div>
  );
};

// --- Extracted Content Component ---

const PreviewContent: React.FC<{ data: SalesPage }> = ({ data }) => {
  
  // --- Helper Icons ---
  const getIcon = (name?: string) => {
    switch(name) {
        case 'shopping-cart': return <ShoppingCart size={16} />;
        case 'arrow-right': return <ArrowRight size={16} />;
        case 'check': return <CheckCircle size={16} />;
        case 'whatsapp': return <MessageCircle size={16} />;
        default: return null;
    }
  };

  const renderCTA = (cta: CTAButton) => {
      const baseClass = "px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 text-sm";
      let style: React.CSSProperties = {};
      let className = baseClass;
      
      const btnColor = cta.color || data.themeColor;

      if (cta.style === 'primary') {
          style = { backgroundColor: btnColor, color: '#fff' };
      } else if (cta.style === 'outline') {
          style = { border: `2px solid ${btnColor}`, color: btnColor, backgroundColor: 'transparent' };
          className = baseClass.replace('shadow-md', ''); 
      } else if (cta.style === 'link') {
          style = { color: btnColor, textDecoration: 'underline', padding: '0' };
          className = "font-bold text-sm hover:opacity-80 transition-opacity flex items-center gap-1";
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
          <div className={`relative ${data.layoutStyle === 'classic' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden`}>
              {data.heroImage && (
                  <div className={`absolute inset-0 ${data.layoutStyle === 'classic' ? 'opacity-40' : 'opacity-100'} ${data.layoutStyle === 'modern' ? 'hidden md:block md:w-1/2 md:right-0 md:left-auto' : ''}`}>
                      <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
                      {data.layoutStyle === 'classic' && <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>}
                  </div>
              )}
              
              <div className={`relative z-10 px-6 py-16 md:py-24 max-w-6xl mx-auto ${data.layoutStyle === 'modern' ? 'grid md:grid-cols-2 gap-10 items-center' : 'text-center'}`}>
                  <div>
                      <span style={{ color: data.themeColor }} className="font-bold tracking-wider text-xs uppercase mb-3 block opacity-90">New Launch</span>
                      <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight break-words">
                          {data.title || 'Your Page Title'}
                      </h1>
                      <p className={`text-lg md:text-xl mb-8 ${data.layoutStyle === 'classic' ? 'text-slate-200' : 'text-slate-600'}`}>
                          {data.subtitle || 'Your compelling subtitle goes here.'}
                      </p>
                      <div className={`flex flex-wrap gap-4 ${data.layoutStyle === 'modern' ? 'justify-start' : 'justify-center'}`}>
                          {data.ctas.map((cta) => renderCTA(cta))}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderProducts = () => {
      if (!data.products.length) return null;
      
      return (
          <div id="products" className="py-16 px-6 bg-white">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Products</h2>
              <div className="max-w-5xl mx-auto grid gap-12">
                  {data.products.map(product => (
                      <div key={product.id} className="flex flex-col md:flex-row gap-8 items-start border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          {/* Image */}
                          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-100">
                              {product.image ? (
                                  <img src={product.image} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                              )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 space-y-4 w-full">
                              <div className="flex justify-between items-start">
                                  <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                                  <div className="text-right">
                                      {product.discountPrice && (
                                          <span className="text-sm text-slate-400 line-through block">{data.currency} {product.price}</span>
                                      )}
                                      <span className="text-xl font-bold text-emerald-600">
                                          {data.currency} {product.discountPrice || product.price}
                                      </span>
                                  </div>
                              </div>
                              <p className="text-slate-600 text-sm">{product.fullDescription || product.shortDescription}</p>
                              
                              {product.benefits.length > 0 && (
                                  <div className="bg-emerald-50/50 p-4 rounded-xl">
                                      <h4 className="font-bold text-sm text-emerald-800 mb-2">Key Benefits</h4>
                                      <ul className="space-y-2">
                                          {product.benefits.map((b, i) => (
                                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                  <Check size={14} className="text-emerald-500 mt-1 shrink-0" />
                                                  {b}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}

                              {product.usageSteps.length > 0 && (
                                  <div className="pt-2">
                                      <h4 className="font-bold text-sm text-slate-800 mb-2">How to Use</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {product.usageSteps.map((step, i) => (
                                              <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">
                                                  {i+1}. {step}
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

      return (
          <div className="py-16 px-6 bg-slate-50">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Bundles & Kits</h2>
              <p className="text-center text-slate-500 mb-12">Save more with our exclusive packages</p>
              
              <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
                  {data.packages.map(pkg => (
                      <div key={pkg.id} className="w-full md:w-[350px] bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all flex flex-col">
                          {pkg.bannerImage && (
                              <div className="h-40 bg-slate-200">
                                  <img src={pkg.bannerImage} className="w-full h-full object-cover" />
                              </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.title}</h3>
                              <p className="text-sm text-slate-500 mb-4">{pkg.description}</p>
                              
                              <div className="space-y-2 mb-6 flex-1">
                                  {pkg.productIds.map(pid => {
                                      const prod = data.products.find(p => p.id === pid);
                                      return prod ? (
                                          <div key={pid} className="flex items-center gap-2 text-sm text-slate-700">
                                              <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                              {prod.name}
                                          </div>
                                      ) : null;
                                  })}
                              </div>

                              <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                                  <div>
                                      {pkg.specialPrice && (
                                          <span className="text-xs text-slate-400 line-through block">Total: {data.currency}{pkg.totalPrice}</span>
                                      )}
                                      <span className="text-2xl font-bold text-emerald-600">
                                          {data.currency}{pkg.specialPrice || pkg.totalPrice}
                                      </span>
                                  </div>
                                  <button style={{ backgroundColor: data.themeColor }} className="px-4 py-2 rounded-lg text-white text-sm font-bold shadow-sm">
                                      Order Bundle
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  return (
    <>
      {renderHero()}

      {/* Description Content - Rendered as HTML */}
      <div className="px-6 py-12 max-w-3xl mx-auto">
          <div 
            className="prose prose-slate max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-6"
            dangerouslySetInnerHTML={{ __html: data.description }} 
          />
      </div>

      {renderProducts()}
      {renderPackages()}

      {/* Global Features */}
      {data.features.length > 0 && (
          <div className="py-12 bg-white text-center">
              <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {data.features.map((feat, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl">
                          <CheckCircle className="mx-auto mb-2 text-emerald-500" />
                          <span className="font-bold text-slate-700 text-sm">{feat}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
          <div className="py-16 px-6 bg-slate-50 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-center mb-10">What People Say</h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.testimonials.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-600 italic text-sm mb-6">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                                {t.photoUrl ? <img src={t.photoUrl} className="w-full h-full object-cover"/> : <User className="p-2 text-slate-400"/>}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">{t.name}</p>
                                <p className="text-xs text-slate-500">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-slate-100 py-12 px-6 text-center">
        {data.contactVisible && (
          <div className="mb-8 space-y-2">
            <h3 className="font-bold text-slate-800">Questions?</h3>
            <p className="text-sm text-slate-600">{data.contactEmail}</p>
            <p className="text-sm text-slate-600">{data.whatsappNumber}</p>
          </div>
        )}
        <div className="text-xs text-slate-400 max-w-lg mx-auto">
          <p className="mb-4">{data.refundPolicy}</p>
          <p>&copy; {new Date().getFullYear()} {data.title}. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;