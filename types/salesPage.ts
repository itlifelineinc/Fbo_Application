
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN' | 'ZAR' | 'KES' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'PHP' | 'MYR' | 'TZS' | 'UGX';
export type LayoutStyle = 'clean' | 'health' | 'bold'; 
export type PageType = 'product' | 'bundle' | 'problem' | 'capture' | 'brand' | 'recruit';

export interface Product {
  id: string;
  name: string;
  images: string[]; 
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  benefits: string[];
  usageSteps: string[];
  tags?: string[];
  ingredients: string[]; 
  category?: string; 
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  whyItFits?: string; // Specific for Problem Solver pages
}

export interface Package {
  id: string;
  title: string;
  productIds: string[]; 
  description: string;
  bannerImage?: string;
  totalPrice: number;
  specialPrice?: number;
  layout: "grid" | "hero" | "carousel";
  isPopular?: boolean;
}

export interface PackageOption {
  id: string;
  name: string;
  priceDelta: number;
  features: string[];
}

export interface CTAButton {
  id: string;
  label: string;
  actionType: 'WHATSAPP' | 'SCROLL' | 'LINK'; 
  url: string;
  style: "primary" | "outline" | "link";
  color?: string; 
  icon?: string; 
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  photoUrl?: string;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Mistake {
  id: string;
  title: string;
  explanation: string;
}

export interface ComparisonRow {
  id: string;
  do: string;
  dont: string;
}

export interface MobileDesignOverrides {
  baseFontSize?: number;
  subtitleFontSize?: number;
  typeScale?: number;
  sectionSpacing?: number;
  buttonSize?: 'sm' | 'md' | 'lg';
}

export interface CheckoutConfig {
  enabled: boolean;
  paymentMethods: {
    mobileMoney: boolean;
    card: boolean;
    cashOnDelivery: boolean;
    bankTransfer: boolean;
  };
  shipping: {
    enabled: boolean;
    freeShippingThreshold?: number;
    flatRate?: number;
    pickupOption: boolean;
  };
  notifications: {
    emailOrderAlert: boolean;
    whatsappOrderAlert: boolean;
  };
}

export interface ProblemSolverData {
  problemDescription: string;
  whoItAffects: string;
  symptoms: string[];
  causes: {
    stress: boolean;
    diet: boolean;
    lifestyle: boolean;
    others: string;
  };
  mistakes: Mistake[];
  comparisonTable: ComparisonRow[];
  lifestylePrinciples: string[];
  lifestyleTips: string[];
  dietSuggestions: {
    avoid: string[];
    support: string[];
  };
  solutionIntro?: string;
}

export interface SalesPage {
  id: string;
  type: PageType; 
  // Metadata
  title: string;
  subtitle: string;
  slug: string;
  language?: string;
  targetAudience?: string[];
  
  // Problem Solver Specific
  problemSolverData?: ProblemSolverData;

  // Visuals
  heroImage: string | null;
  galleryImages: string[];
  themeColor: string;
  pageBgColor: string; 
  cardBgColor: string; 
  layoutStyle: LayoutStyle;
  
  // New Design Props (Desktop Defaults)
  headingFont: string;
  bodyFont: string;
  baseFontSize: number; 
  subtitleFontSize?: number; 
  typeScale: number; 
  sectionSpacing: number; 
  
  // Button Styling
  buttonCorner?: 'square' | 'rounded' | 'pill';
  buttonSize?: 'sm' | 'md' | 'lg';

  // Responsive Overrides
  mobileOverrides?: MobileDesignOverrides;
  
  // Content
  description: string; // Used for persuasive story
  shortStoryTitle?: string;
  features: string[]; 
  testimonials: Testimonial[];
  
  // Trust & Proof
  badges: string[]; 
  personalBranding: {
      bio: string;
      yearsExperience: number;
      rank: string;
      photoUrl: string;
  };
  faqs: FaqItem[];
  disclaimer: string;

  // Commerce
  currency: CurrencyCode;
  products: Product[];
  packages: Package[];
  
  // Pricing extension
  basePrice?: number;
  fullPackPrice?: number; 
  pricingOptions?: PackageOption[];
  
  // CTA & WhatsApp
  whatsappNumber: string;
  whatsappMessage: string;
  ctaDisplay: {
      showHero: boolean;
      showBottomSticky: boolean;
      showContentEnd: boolean;
      showFloatingWhatsapp: boolean;
  };
  ctas: CTAButton[];
  
  // Checkout & Payments
  checkoutConfig: CheckoutConfig;

  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  
  // Contact & Legal
  contactEmail: string;
  contactVisible: boolean;
  refundPolicy: string;
  termsRequired: boolean;
  
  // Performance
  views: number;
  leads: number;
  sales: number;

  // State
  isPublished: boolean;
  lastSavedAt: number;
}
