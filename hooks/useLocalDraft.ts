
import { useState, useEffect, useCallback } from 'react';
import { SalesPage, CurrencyCode } from '../types/salesPage';
import { Student } from '../types';
import { COUNTRY_CURRENCY_MAP } from '../services/currencyService';

const EMPTY_PAGE: SalesPage = {
  id: 'draft-new',
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

  currency: 'USD', // Will be overridden by init logic
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
  isPublished: false,
  lastSavedAt: Date.now(),
};

const DB_NAME = 'NexuSalesDrafts';
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'current_draft';

const getDB = (): Promise<IDBDatabase> => {
  return new Error("IDB Error").stack?.includes("webkit") ? Promise.reject() : new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToIDB = async (data: SalesPage) => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data, DRAFT_KEY);
  } catch (e) {
      console.warn("IndexedDB not available, using fallback storage");
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }
};

const loadFromIDB = async (): Promise<SalesPage | null> => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(DRAFT_KEY);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
      const data = localStorage.getItem(DRAFT_KEY);
      return data ? JSON.parse(data) : null;
  }
};

export const useLocalDraft = (currentUser?: Student) => {
  const [page, setPage] = useState<SalesPage>(EMPTY_PAGE);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initLoad = async () => {
      try {
        const saved = await loadFromIDB();
        if (saved) {
          const merged = { ...EMPTY_PAGE, ...saved };
          setPage(merged);
          setLastSaved(new Date(merged.lastSavedAt || Date.now()));
        } else if (currentUser) {
          // Initialize NEW draft with FBO defaults
          const defaultCurrency = (currentUser.country && COUNTRY_CURRENCY_MAP[currentUser.country]) || 'USD';
          setPage({
              ...EMPTY_PAGE,
              currency: defaultCurrency as CurrencyCode,
              whatsappNumber: currentUser.whatsappNumber || '',
              contactEmail: currentUser.email || ''
          });
        }
      } catch (err) {
        console.error("Draft load failed", err);
      } finally {
        setIsLoaded(true);
      }
    };
    initLoad();
  }, [currentUser]);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(async () => {
      try {
        await saveToIDB(page);
        setLastSaved(new Date());
      } catch (err) {
        console.error("Draft save failed", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [page, isLoaded]);

  const updateField = useCallback(<K extends keyof SalesPage>(field: K, value: SalesPage[K]) => {
    setPage(prev => ({ ...prev, [field]: value, lastSavedAt: Date.now() }));
  }, []);

  const publish = () => {
    updateField('isPublished', !page.isPublished);
  };

  return { page, updateField, publish, lastSaved, isLoaded };
};
