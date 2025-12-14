
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN' | 'ZAR' | 'KES' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'PHP' | 'MYR' | 'TZS' | 'UGX';
export type LayoutStyle = 'classic' | 'modern' | 'minimal';
export type PageType = 'product' | 'bundle' | 'problem' | 'capture' | 'brand' | 'recruit';

export interface Product {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  benefits: string[];
  usageSteps: string[];
  tags?: string[];
}

export interface Package {
  id: string;
  title: string;
  productIds: string[]; // References Product.id
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
  color?: string; // Custom hex override
  icon?: string; // Icon name
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
  type: PageType; // New field
  // Metadata
  title: string;
  subtitle: string;
  slug: string;
  
  // Visuals
  heroImage: string | null;
  galleryImages: string[];
  themeColor: string;
  layoutStyle: LayoutStyle;
  
  // Content
  description: string; // Global page description (optional now)
  features: string[]; // Global page features (optional now)
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
