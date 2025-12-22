
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
  whyItFits?: string; 
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

// Fix: Added Mistake interface for sales pages
export interface Mistake {
  id: string;
  title: string;
  explanation: string;
}

// Fix: Added ComparisonRow interface
export interface ComparisonRow {
  id: string;
  do: string;
  dont: string;
}

// Fix: Added BeforeAfterPair interface
export interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
  label?: string;
}

// Fix: Added PackageOption interface
export interface PackageOption {
  id: string;
  name: string;
  priceDelta: number;
  features: string[];
}

// Fix: Added MobileDesignOverrides interface
export interface MobileDesignOverrides {
  baseFontSize: number;
  subtitleFontSize: number;
  typeScale: number;
  sectionSpacing: number;
  buttonSize: 'sm' | 'md' | 'lg';
}

// Fix: Added CheckoutConfig interface with shipping details
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
      flatRate: number;
      freeShippingThreshold: number;
      pickupOption: boolean;
  };
  notifications: {
      emailOrderAlert: boolean;
      whatsappOrderAlert: boolean;
  };
}

export interface CTAButton {
  id: string;
  label: string;
  actionType: 'WHATSAPP' | 'SCROLL' | 'LINK' | 'PHONE'; 
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

export interface ProductSalesData {
    featuredProductId: string;
    showIngredients: boolean;
    comparisonTitle: string;
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
    // Fix: Using Mistake interface
    mistakes: Mistake[];
    // Fix: Using ComparisonRow interface
    comparisonTable: ComparisonRow[];
    lifestylePrinciples: string[];
    lifestyleTips: string[];
    dietSuggestions: { avoid: string[]; support: string[] };
    solutionIntro?: string;
    // Fix: Using BeforeAfterPair interface
    beforeAfterImages: BeforeAfterPair[];
    socialProofBadges: string[];
    countryNotice?: string;
    ctaHeadline: string; // Specific to this builder
}

export interface BundleData {
    bundleOfferTitle: string;
    timerEnabled: boolean;
    timerExpiry?: string;
}

export interface SalesPage {
  id: string;
  type: PageType; 
  title: string;
  subtitle: string;
  slug: string;
  language?: string;
  targetAudience?: string[];
  
  // Isolated Data Blocks
  productSalesData?: ProductSalesData;
  problemSolverData?: ProblemSolverData;
  bundleData?: BundleData;

  // Visuals (Global but customizable)
  heroImage: string | null;
  galleryImages: string[];
  themeColor: string;
  pageBgColor: string; 
  cardBgColor: string; 
  layoutStyle: LayoutStyle;
  
  // Typography
  headingFont: string;
  bodyFont: string;
  baseFontSize: number; 
  subtitleFontSize: number;
  typeScale: number; 
  sectionSpacing: number; 
  
  // Components
  buttonCorner?: 'square' | 'rounded' | 'pill';
  buttonSize?: 'sm' | 'md' | 'lg';
  
  // Fix: Added mobileOverrides property
  mobileOverrides?: MobileDesignOverrides;

  // Shared Content Lists
  description: string; 
  shortStoryTitle: string;
  features: string[]; 
  testimonials: Testimonial[];
  faqs: FaqItem[];
  badges: string[]; 
  
  personalBranding: {
      bio: string;
      yearsExperience: number;
      rank: string;
      photoUrl: string;
  };
  disclaimer: string;

  // Commerce
  currency: CurrencyCode;
  products: Product[];
  packages: Package[];
  // Fix: Added missing properties used in editors
  pricingOptions?: PackageOption[];
  basePrice?: number;
  fullPackPrice?: number; 
  
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
  
  // Checkout
  // Fix: Using CheckoutConfig interface
  checkoutConfig: CheckoutConfig;
  
  // SEO & Contact
  // Fix: Added seo and contact fields missing in definition
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  contactEmail: string;
  contactVisible: boolean;
  refundPolicy: string;
  termsRequired: boolean;

  isPublished: boolean;
  lastSavedAt: number;
  views: number;
  leads: number;
  sales: number;
}
