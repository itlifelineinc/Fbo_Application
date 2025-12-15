
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN' | 'ZAR' | 'KES' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'PHP' | 'MYR' | 'TZS' | 'UGX';
export type LayoutStyle = 'clean' | 'health' | 'bold'; // Updated styles
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

export interface SalesPage {
  id: string;
  type: PageType; 
  // Metadata
  title: string;
  subtitle: string;
  slug: string;
  
  // Visuals
  heroImage: string | null;
  galleryImages: string[];
  themeColor: string;
  layoutStyle: LayoutStyle;
  
  // New Design Props
  headingFont: string;
  bodyFont: string;
  baseFontSize: number; // 14-20
  typeScale: number; // 1.0 - 1.6 (Controls heading prominence)
  sectionSpacing: number; // 0-10 scale
  
  // Content
  description: string; 
  features: string[]; 
  testimonials: Testimonial[];
  
  // Commerce
  currency: CurrencyCode;
  products: Product[];
  packages: Package[];
  
  // New fields for alternative pricing model
  basePrice?: number;
  pricingOptions?: PackageOption[];
  
  ctas: CTAButton[];
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  
  // Contact & Legal
  whatsappNumber: string;
  contactEmail: string;
  contactVisible: boolean;
  refundPolicy: string;
  termsRequired: boolean;
  
  // State
  isPublished: boolean;
  lastSavedAt: number;
}
