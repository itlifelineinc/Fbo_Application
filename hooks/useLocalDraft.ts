
import { useState, useEffect, useCallback } from 'react';
import { SalesPage, CurrencyCode, PageType } from '../types/salesPage';
import { Student } from '../types';
import { COUNTRY_CURRENCY_MAP } from '../services/currencyService';

const EMPTY_PAGE: SalesPage = {
  id: '',
  type: 'product',
  title: '',
  subtitle: '',
  slug: '',
  heroImage: null,
  galleryImages: [],
  themeColor: '#10b981', 
  pageBgColor: '#064e3b', 
  cardBgColor: '#fcd34d', 
  layoutStyle: 'clean', 
  
  headingFont: 'Lexend',
  bodyFont: 'Noto Sans',
  baseFontSize: 16,
  subtitleFontSize: 20, 
  typeScale: 1.25, 
  sectionSpacing: 5, 
  
  buttonCorner: 'pill',
  buttonSize: 'md',

  mobileOverrides: {
      baseFontSize: 15,
      subtitleFontSize: 18,
      typeScale: 1.2,
      sectionSpacing: 4,
      buttonSize: 'md'
  },

  description: '', 
  shortStoryTitle: 'Why this product?',
  features: [],
  testimonials: [],
  
  badges: ['guarantee'],
  personalBranding: {
      bio: '',
      yearsExperience: 0,
      rank: '',
      photoUrl: ''
  },
  faqs: [],
  disclaimer: 'Statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.',

  currency: 'USD', 
  products: [],
  packages: [],
  
  fullPackPrice: 0,

  whatsappNumber: '',
  whatsappMessage: "Hi, I'm interested in {title}. Can you tell me more?",
  ctaDisplay: {
      showHero: true,
      showBottomSticky: false,
      showContentEnd: true,
      showFloatingWhatsapp: true
  },
  ctas: [
    { id: 'default-cta', label: 'Chat on WhatsApp', style: 'primary', actionType: 'WHATSAPP', url: '', icon: 'whatsapp' }
  ],
  
  checkoutConfig: {
      enabled: false,
      paymentMethods: {
          mobileMoney: true,
          card: false,
          cashOnDelivery: true,
          bankTransfer: false
      },
      shipping: {
          enabled: true,
          flatRate: 0,
          freeShippingThreshold: 0,
          pickupOption: true
      },
      notifications: {
          emailOrderAlert: true,
          whatsappOrderAlert: true
      }
  },
  
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  },
  contactEmail: '',
  contactVisible: true,
  refundPolicy: '30-day money-back guarantee.',
  termsRequired: false,
  views: 0,
  leads: 0,
  sales: 0,
  isPublished: false,
  lastSavedAt: Date.now(),
};

const DB_NAME = 'NexuSalesSystem';
const STORE_NAME = 'pages';

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version bump
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const useLocalDraft = (currentUser?: Student) => {
  const [pages, setPages] = useState<SalesPage[]>([]);
  const [currentPage, setCurrentPage] = useState<SalesPage | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load all pages on init
  const refreshPages = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        setPages(request.result || []);
        setIsLoaded(true);
      };
    } catch (e) {
      console.error("Failed to load pages", e);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    refreshPages();
  }, []);

  const savePage = async (page: SalesPage) => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ ...page, lastSavedAt: Date.now() });
      setPages(prev => {
        const idx = prev.findIndex(p => p.id === page.id);
        if (idx > -1) {
           const next = [...prev];
           next[idx] = page;
           return next;
        }
        return [...prev, page];
      });
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const createNewPage = (type: PageType) => {
      const defaultCurrency = (currentUser?.country && COUNTRY_CURRENCY_MAP[currentUser.country]) || 'USD';
      const newPage: SalesPage = {
          ...EMPTY_PAGE,
          id: `sp_${Date.now()}`,
          type,
          currency: defaultCurrency as CurrencyCode,
          whatsappNumber: currentUser?.whatsappNumber || '',
          contactEmail: currentUser?.email || '',
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Page`,
          lastSavedAt: Date.now()
      };
      savePage(newPage);
      setCurrentPage(newPage);
      return newPage;
  };

  const selectPage = (id: string) => {
      const page = pages.find(p => p.id === id);
      if (page) setCurrentPage(page);
  };

  const updateField = useCallback(<K extends keyof SalesPage>(field: K, value: SalesPage[K]) => {
    setCurrentPage(prev => {
        if (!prev) return null;
        const updated = { ...prev, [field]: value, lastSavedAt: Date.now() };
        // Background save
        savePage(updated);
        return updated;
    });
  }, []);

  const deletePage = async (id: string) => {
      try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        setPages(prev => prev.filter(p => p.id !== id));
        if (currentPage?.id === id) setCurrentPage(null);
      } catch (e) {
          console.error("Delete failed", e);
      }
  };

  return { 
      pages, 
      currentPage, 
      setCurrentPage,
      createNewPage, 
      selectPage, 
      updateField, 
      deletePage,
      isLoaded 
  };
};
