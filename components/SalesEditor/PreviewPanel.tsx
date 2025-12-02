import React from 'react';
import { SalesPage, CTAButton } from '../../types/salesPage';
import WhatsAppFloatingButton from '../Shared/WhatsAppFloatingButton';
import { Check, Star, User, ShoppingCart, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';

interface PreviewPanelProps {
  data: SalesPage;
  device: 'mobile' | 'desktop';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ data, device }) => {
  
  const scrollbarStyles = (
    <style>{`
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `}</style>
  );

  if (device === 'desktop') {
    return (
      <>
        {scrollbarStyles}
        {/* Desktop View: Fills container, no padding on outer wrapper needed as parent handles it for mobile, but here we want edge-to-edge often. 
            However, parent has padding. To make desktop full-bleed in the preview pane, we might want to negative margin or just accept the frame. 
            For now, let's keep it filling the available space. */}
        <div className="w-full h-full bg-white overflow-y-auto scroll-smooth no-scrollbar shadow-sm relative dark:bg-slate-950 transition-colors rounded-xl md:rounded-none border border-slate-200 md:border-0">
           <PreviewContent data={data} device={device} />
           <div className="fixed bottom-8 right-8 z-50">
              <WhatsAppFloatingButton phoneNumber={data.whatsappNumber} isVisible={true} />
           </div>
        </div>
      </>
    );
  }

  // Mobile View (Simulated Phone Frame)
  return (
    <div className="mx-auto w-full max-w-[375px] h-full max-h-[850px] bg-white rounded-[2.5rem] shadow-2xl border-[10px] md:border-[12px] border-slate-900 overflow-hidden relative ring-1 ring-black/10 shrink-0 flex flex-col my-auto dark:bg-slate-950 dark:border-slate-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20 pointer-events-none"></div>
        
        {/* Scrollable Content */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth bg-white relative dark:bg-slate-950 transition-colors">
            <PreviewContent data={data} device={device} />
            {/* Spacer for bottom navigation bar area on phones */}
            <div className="h-6"></div>
        </div>

        {/* Floating Button inside phone frame */}
        <div className="absolute bottom-4 right-4 z-50">
           <WhatsAppFloatingButton phoneNumber={data.whatsappNumber} isVisible={true} />
        </div>
        
        {scrollbarStyles}
    </div>
  );
};

// --- Extracted Content Component ---

const PreviewContent: React.FC<{ data: SalesPage; device: 'mobile' | 'desktop' }> = ({ data, device }) => {
  
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
      // Explicitly check for mobile device prop to override browser media queries
      const isMobile = device === 'mobile';
      
      // Font Sizes: Mobile fixed at text-2xl, Desktop uses responsive text-4xl to text-6xl
      const titleClass = isMobile ? 'text-2xl' : 'text-4xl md:text-6xl';
      const subtitleClass = isMobile ? 'text-base' : 'text-lg md:text-xl';
      
      // Layout: Modern layout only applies grids on desktop view
      const layoutContainerClass = (data.layoutStyle === 'modern' && !isMobile) 
        ? 'grid md:grid-cols-2 gap-10 items-center' 
        : 'text-center';

      return (
          <div className={`relative ${data.layoutStyle === 'classic' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white'} overflow-hidden transition-colors`}>
              {data.heroImage && (
                  <div className={`absolute inset-0 ${data.layoutStyle === 'classic' ? 'opacity-40' : 'opacity-100'} ${data.layoutStyle === 'modern' && !isMobile ? 'hidden md:block md:w-1/2 md:right-0 md:left-auto' : ''}`}>
                      <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
                      {data.layoutStyle === 'classic' && <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>}
                  </div>
              )}
              
              <div className={`relative z-10 px-6 py-16 md:py-24 max-w-6xl mx-auto ${layoutContainerClass}`}>
                  <div>
                      <span style={{ color: data.themeColor }} className="font-bold tracking-wider text-xs uppercase mb-3 block opacity-90">New Launch</span>
                      {/* Title Font Size Logic Applied Here */}
                      <h1 className={`${titleClass} font-bold font-heading mb-6 leading-tight break-words`}>
                          {data.title || 'Your Page Title'}
                      </h1>
                      <p className={`${subtitleClass} mb-8 ${data.layoutStyle === 'classic' ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>
                          {data.subtitle || 'Your compelling subtitle goes here.'}
                      </p>
                      <div className={`flex flex-wrap gap-4 ${(data.layoutStyle === 'modern' && !isMobile) ? 'justify-start' : 'justify-center'}`}>
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
          <div id="products" className="py-16 px-6 bg-white dark:bg-slate-950 transition-colors">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12 dark:text-white">Our Products</h2>
              <div className="max-w-5xl mx-auto grid gap-12">
                  {data.products.map(product => (
                      <div key={product.id} className="flex flex-col md:flex-row gap-8 items-start border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900">
                          {/* Image */}
                          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                              {product.image ? (
                                  <img src={product.image} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">No Image</div>
                              )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 space-y-4 w-full">
                              <div className="flex justify-between items-start">
                                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h3>
                                  <div className="text-right">
                                      {product.discountPrice && (
                                          <span className="text-sm text-slate-400 line-through block dark:text-slate-500">{data.currency} {product.price}</span>
                                      )}
                                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                          {data.currency} {product.discountPrice || product.price}
                                      </span>
                                  </div>
                              </div>
                              <p className="text-slate-600 text-sm dark:text-slate-300">{product.fullDescription || product.shortDescription}</p>
                              
                              {product.benefits.length > 0 && (
                                  <div className="bg-emerald-50/50 p-4 rounded-xl dark:bg-emerald-900/20">
                                      <h4 className="font-bold text-sm text-emerald-800 mb-2 dark:text-emerald-400">Key Benefits</h4>
                                      <ul className="space-y-2">
                                          {product.benefits.map((b, i) => (
                                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                  <Check size={14} className="text-emerald-500 mt-1 shrink-0" />
                                                  {b}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}

                              {product.usageSteps.length > 0 && (
                                  <div className="pt-2">
                                      <h4 className="font-bold text-sm text-slate-800 mb-2 dark:text-slate-200">How to Use</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {product.usageSteps.map((step, i) => (
                                              <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
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
          <div className="py-16 px-6 bg-slate-50 dark:bg-slate-900 transition-colors">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-4 dark:text-white">Bundles & Kits</h2>
              <p className="text-center text-slate-500 mb-12 dark:text-slate-400">Save more with our exclusive packages</p>
              
              <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
                  {data.packages.map(pkg => (
                      <div key={pkg.id} className="w-full md:w-[350px] bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all flex flex-col dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-500">
                          {pkg.bannerImage && (
                              <div className="h-40 bg-slate-200 dark:bg-slate-700">
                                  <img src={pkg.bannerImage} className="w-full h-full object-cover" />
                              </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">{pkg.title}</h3>
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

                              <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between dark:border-slate-700">
                                  <div>
                                      {pkg.specialPrice && (
                                          <span className="text-xs text-slate-400 line-through block dark:text-slate-500">Total: {data.currency}{pkg.totalPrice}</span>
                                      )}
                                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
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
      <div className="px-6 py-12 max-w-3xl mx-auto dark:text-slate-200">
          <div 
            className="prose prose-slate max-w-none dark:prose-invert [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-6 dark:[&_blockquote]:border-slate-600 dark:[&_blockquote]:text-slate-400"
            dangerouslySetInnerHTML={{ __html: data.description }} 
          />
      </div>

      {renderProducts()}
      {renderPackages()}

      {/* Global Features */}
      {data.features.length > 0 && (
          <div className="py-12 bg-white text-center dark:bg-slate-950 transition-colors">
              <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {data.features.map((feat, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl dark:bg-slate-900">
                          <CheckCircle className="mx-auto mb-2 text-emerald-500" />
                          <span className="font-bold text-slate-700 text-sm dark:text-slate-200">{feat}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
          <div className="py-16 px-6 bg-slate-50 border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold text-center mb-10 dark:text-white">What People Say</h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.testimonials.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm dark:bg-slate-800">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-600 italic text-sm mb-6 dark:text-slate-300">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                                {t.photoUrl ? <img src={t.photoUrl} className="w-full h-full object-cover"/> : <User className="p-2 text-slate-400 dark:text-slate-500"/>}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-slate-100 py-12 px-6 text-center dark:bg-slate-950 dark:border-slate-800 transition-colors">
        {data.contactVisible && (
          <div className="mb-8 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Questions?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{data.contactEmail}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{data.whatsappNumber}</p>
          </div>
        )}
        <div className="text-xs text-slate-400 max-w-lg mx-auto dark:text-slate-500">
          <p className="mb-4">{data.refundPolicy}</p>
          <p>&copy; {new Date().getFullYear()} {data.title}. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;