
import React from 'react';
import { PageType } from '../../types/salesPage';
import { 
    Layout, Type, ShoppingBag, Package, FileText, 
    MousePointerClick, Star, Phone, ShieldCheck, 
    CreditCard, Share2, AlertTriangle, Lightbulb, Heart, ListChecks, X,
    Zap, UserPlus, Award, User, Briefcase, TrendingUp, Palette, ListOrdered, ClipboardCheck, Gift,
    Construction, LayoutGrid
} from 'lucide-react';

export interface TabDefinition {
    id: string;
    label: string;
    icon: any;
}

// Configuration Map for all six page builder portals
export const PAGE_TAB_CONFIG: Record<PageType, TabDefinition[]> = {
    'product': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'PRODUCTS', label: 'Product Selection', icon: ShoppingBag },
        { id: 'CONTENT', label: 'Page Content', icon: FileText },
        { id: 'TRUST_PROOF', label: 'Trust & Proof', icon: ShieldCheck },
        { id: 'CTA_SETUP', label: 'WhatsApp & CTA', icon: MousePointerClick },
        { id: 'CHECKOUT', label: 'Checkout', icon: CreditCard },
        { id: 'DESIGN', label: 'Design', icon: Layout },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'bundle': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'PKG_BASICS', label: 'Package Basics', icon: Type },
        { id: 'PKG_PRODUCTS', label: 'Bundle Contents', icon: Package },
        { id: 'EDUCATION', label: 'Why this Bundle?', icon: Lightbulb },
        { id: 'TRUST_BUILDER', label: 'Testimonials', icon: Star },
        { id: 'PRICING', label: 'Pricing & Offer', icon: CreditCard },
        { id: 'CHECKOUT', label: 'Checkout', icon: ShoppingBag },
        { id: 'CTA_SETUP', label: 'Lead Engine', icon: MousePointerClick },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'problem': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'PAGE_BASICS', label: 'Basics', icon: Type },
        { id: 'PROBLEM_EDU', label: 'The Pain Point', icon: AlertTriangle },
        { id: 'MISTAKES', label: 'Common Mistakes', icon: X }, 
        { id: 'LIFESTYLE', label: 'Lifestyle Impact', icon: Heart },
        { id: 'SOLUTION', label: 'Forever Solution', icon: ShoppingBag },
        { id: 'PROOF', label: 'Social Proof', icon: Star },
        { id: 'CTA_SETUP', label: 'Call To Action', icon: MousePointerClick },
        { id: 'COMPLIANCE', label: 'Compliance', icon: ListChecks },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'capture': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'HEADLINE_MSG', label: 'Headline & Message', icon: Type },
        { id: 'EXPLANATION', label: 'The Hook', icon: Zap },
        { id: 'WHATSAPP_SETUP', label: 'WhatsApp Link', icon: Phone },
        { id: 'LEAD_FORM', label: 'Lead Form', icon: ClipboardCheck },
        { id: 'DESIGN_PREVIEW', label: 'Theme Design', icon: Layout },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'brand': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'PROFILE_ID', label: 'My Identity', icon: User },
        { id: 'MY_STORY', label: 'My Vision', icon: FileText },
        { id: 'WHY_FOREVER', label: 'Why I Lead', icon: Heart },
        { id: 'CERTS_RANK', label: 'My Experience', icon: Award },
        { id: 'HELP_WITH', label: 'How I Help', icon: Lightbulb },
        { id: 'OFFERS_LINKS', label: 'Key Links', icon: Gift },
        { id: 'SETTINGS_PREVIEW', label: 'Brand Style', icon: Palette },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'recruit': [
        { id: 'OVERVIEW', label: 'Overview', icon: LayoutGrid },
        { id: 'PAGE_BASICS', label: 'Campaign Info', icon: Type },
        { id: 'OPP_OVERVIEW', label: 'Opportunity', icon: Briefcase },
        { id: 'BENEFITS', label: 'Incentives', icon: TrendingUp },
        { id: 'SUCCESS_STORIES', label: 'Success Stories', icon: Star },
        { id: 'GET_STARTED', label: 'Steps to Join', icon: ListOrdered },
        { id: 'SPONSOR_SETUP', label: 'Sponsor Profile', icon: UserPlus },
        { id: 'DESIGN_BRANDING', label: 'Modern Design', icon: Palette },
        { id: 'PUBLISH', label: 'Launch', icon: Share2 },
    ],
};

export const PlaceholderTab: React.FC<{ label: string, portalType: string }> = ({ label, portalType }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 animate-fade-in px-6">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <Construction className="text-emerald-500" size={36} />
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">{portalType} Portal</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{label} Editor</h3>
        </div>
        <p className="text-slate-500 max-w-xs mx-auto mt-4 text-sm leading-relaxed dark:text-slate-400">
            You've reached the <span className="font-bold text-slate-700 dark:text-slate-200">{label}</span> field workspace. 
            This area is currently being optimized for high conversion and will be available soon!
        </p>
        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-full border border-slate-100 dark:border-slate-600 shadow-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 text-slate-300 uppercase tracking-widest">Under Construction</span>
        </div>
    </div>
);
