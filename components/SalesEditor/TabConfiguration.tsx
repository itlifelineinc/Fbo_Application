
import React from 'react';
import { PageType } from '../../types/salesPage';
import { 
    Layout, Type, Image as ImageIcon, ShoppingBag, Package, FileText, 
    MousePointerClick, Star, Phone, Search, Lock, ShieldCheck, 
    CreditCard, Share2, AlertTriangle, Lightbulb, Heart, ListChecks, X,
    Zap, UserPlus, Award, User, Briefcase, TrendingUp, Palette, ListOrdered, ClipboardCheck, Gift
} from 'lucide-react';

export interface TabDefinition {
    id: string;
    label: string;
    icon: any;
}

// Configuration Map for different page types
export const PAGE_TAB_CONFIG: Record<PageType, TabDefinition[]> = {
    'product': [
        { id: 'OVERVIEW', label: 'Overview', icon: Type },
        { id: 'PRODUCTS', label: 'Product Selection', icon: ShoppingBag },
        { id: 'CONTENT', label: 'Page Content', icon: FileText },
        { id: 'TRUST_PROOF', label: 'Trust & Proof', icon: ShieldCheck },
        { id: 'CTA_SETUP', label: 'WhatsApp & CTA', icon: MousePointerClick },
        { id: 'CHECKOUT', label: 'Checkout', icon: CreditCard },
        { id: 'DESIGN', label: 'Design', icon: Layout },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'bundle': [
        { id: 'PKG_BASICS', label: 'Package Basics', icon: Type },
        { id: 'PKG_PRODUCTS', label: 'Products', icon: Package },
        { id: 'EDUCATION', label: 'Education', icon: Lightbulb },
        { id: 'TRUST_BUILDER', label: 'Trust Builder', icon: Star },
        { id: 'PRICING', label: 'Pricing & Offer', icon: CreditCard },
        { id: 'CHECKOUT', label: 'Checkout', icon: ShoppingBag },
        { id: 'CTA_SETUP', label: 'Lead Engine', icon: MousePointerClick },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'problem': [
        { id: 'PAGE_BASICS', label: 'Basics', icon: Type },
        { id: 'PROBLEM_EDU', label: 'The Problem', icon: AlertTriangle },
        { id: 'MISTAKES', label: 'Common Mistakes', icon: X }, 
        { id: 'LIFESTYLE', label: 'Lifestyle', icon: Heart },
        { id: 'SOLUTION', label: 'Forever Solution', icon: ShoppingBag },
        { id: 'PROOF', label: 'Social Trust', icon: Star },
        { id: 'CTA_SETUP', label: 'Call To Action', icon: MousePointerClick },
        { id: 'COMPLIANCE', label: 'Compliance', icon: ListChecks },
        { id: 'PUBLISH', label: 'Publish', icon: Share2 },
    ],
    'capture': [
        { id: 'HEADLINE_MSG', label: 'Headline & Message', icon: Type },
        { id: 'EXPLANATION', label: 'Quick Explanation', icon: Zap },
        { id: 'WHATSAPP_SETUP', label: 'WhatsApp Setup', icon: Phone },
        { id: 'LEAD_FORM', label: 'Lead Form', icon: ClipboardCheck },
        { id: 'DESIGN_PREVIEW', label: 'Design & Preview', icon: Layout },
    ],
    'brand': [
        { id: 'PROFILE_ID', label: 'Profile & Identity', icon: User },
        { id: 'MY_STORY', label: 'My Story', icon: FileText },
        { id: 'WHY_FOREVER', label: 'Why Forever', icon: Heart },
        { id: 'CERTS_RANK', label: 'Certifications', icon: Award },
        { id: 'HELP_WITH', label: 'What I Help With', icon: Lightbulb },
        { id: 'OFFERS_LINKS', label: 'My Offers', icon: Gift },
        { id: 'SETTINGS_PREVIEW', label: 'Page Settings', icon: Layout },
    ],
    'recruit': [
        { id: 'PAGE_BASICS', label: 'Page Basics', icon: Type },
        { id: 'OPP_OVERVIEW', label: 'Opportunity', icon: Briefcase },
        { id: 'BENEFITS', label: 'Benefits', icon: TrendingUp },
        { id: 'SUCCESS_STORIES', label: 'Success Stories', icon: Star },
        { id: 'GET_STARTED', label: 'Steps to Start', icon: ListOrdered },
        { id: 'SPONSOR_SETUP', label: 'Sponsor Setup', icon: UserPlus },
        { id: 'DESIGN_BRANDING', label: 'Design', icon: Palette },
        { id: 'PREVIEW_PUBLISH', label: 'Publish', icon: Share2 },
    ],
};

export const PlaceholderTab: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm dark:bg-slate-800">
            <Lock className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{label} Feature</h3>
        <p className="text-slate-500 max-w-xs mx-auto dark:text-slate-400">
            This module is currently under development. Stay tuned for updates!
        </p>
    </div>
);
