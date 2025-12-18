
import { useState, useEffect, useCallback } from 'react';
import { SalesPage } from '../types/salesPage';

const EMPTY_PAGE: SalesPage = {
  id: 'draft-new',
  type: 'product',
  title: '',
  subtitle: '',
  slug: '',
  heroImage: null,
  galleryImages: [],
  themeColor: '#10b981', // Emerald-500
  pageBgColor: '#064e3b', // Default Dark Green
  cardBgColor: '#fcd34d', // Default Amber/Yellow
  layoutStyle: 'clean', // Default to 'clean'
  
  // Defaults for new design system
  headingFont: 'Lexend',
  bodyFont: 'Noto Sans',
  baseFontSize: 16,
  subtitleFontSize: 20, 
  typeScale: 1.25, 
  sectionSpacing: 5, 
  
  // Button Defaults
  buttonCorner: 'pill',
  buttonSize: 'md',

  // Mobile Overrides (Responsive Defaults)
  mobileOverrides: {
      baseFontSize: 15,
      subtitleFontSize: 18,
      typeScale: 1.2,
      sectionSpacing: 4,
      buttonSize: 'md'
  },

  description: '',
  features: [],
  testimonials: [],
  
  // Trust Defaults
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
  
  // CTA Defaults
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
  
  // Checkout Defaults
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

export const useLocalDraft = () => {
  // Initialize state from localStorage or default
  const [page, setPage] = useState<SalesPage>(() => {
    try {
      const saved = localStorage.getItem('sales_page_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure new fields exist on old drafts
        const merged = { ...EMPTY_PAGE, ...parsed };
        
        // Safety checks for nested objects
        if (!merged.checkoutConfig) merged.checkoutConfig = EMPTY_PAGE.checkoutConfig;
        if (!merged.pageBgColor) merged.pageBgColor = EMPTY_PAGE.pageBgColor;
        if (!merged.cardBgColor) merged.cardBgColor = EMPTY_PAGE.cardBgColor;
        
        return merged;
      }
      return EMPTY_PAGE;
    } catch (e) {
      console.error("Failed to parse draft from local storage", e);
      return EMPTY_PAGE;
    }
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date(page.lastSavedAt));

  // Auto-save to localStorage whenever page changes
  useEffect(() => {
    try {
      localStorage.setItem('sales_page_draft', JSON.stringify(page));
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save draft to local storage", e);
    }
  }, [page]);

  // Generic field updater
  const updateField = useCallback(<K extends keyof SalesPage>(field: K, value: SalesPage[K]) => {
    setPage(prev => ({ ...prev, [field]: value, lastSavedAt: Date.now() }));
  }, []);

  const publish = () => {
    updateField('isPublished', !page.isPublished);
  };

  return { page, updateField, publish, lastSaved };
};
