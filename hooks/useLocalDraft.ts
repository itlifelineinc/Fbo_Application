
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
  layoutStyle: 'clean', // Default to 'clean'
  
  // Defaults for new design system
  headingFont: 'Lexend',
  bodyFont: 'Noto Sans',
  baseFontSize: 16,
  sectionSpacing: 2, // Medium spacing

  description: '',
  features: [],
  testimonials: [],
  currency: 'USD',
  products: [],
  packages: [],
  ctas: [
    { id: 'default-cta', label: 'Buy Now', style: 'primary', url: '#products' }
  ],
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  },
  whatsappNumber: '',
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
        return { ...EMPTY_PAGE, ...parsed };
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
