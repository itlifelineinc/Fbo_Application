
import { Product } from '../types/salesPage';

export const FOREVER_CATALOG: Product[] = [
    {
        id: 'cat_015',
        name: 'Forever Aloe Vera Gel',
        // Green/Yellow bottle context
        images: [
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2000&h=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1609120786967-3323049b49b4?q=80&w=2000&h=2000&auto=format&fit=crop'
        ],
        shortDescription: 'The pure power of nature.',
        fullDescription: 'Our flagship product. 99.7% pure inner leaf aloe vera gel. Supports healthy digestion and nutrient absorption.',
        price: 180.00,
        benefits: ['99.7% pure inner leaf aloe', 'Supports nutrient absorption', 'Promotes healthy digestion', 'No added preservatives'],
        usageSteps: ['Shake well before use', 'Take 60-120ml daily', 'Refrigerate after opening'],
        category: 'Digestive Health',
        ingredients: ['Stabilized Aloe Vera Gel', 'Ascorbic Acid', 'Citric Acid'],
        tags: ['Immunity', 'Digestion', 'Energy'],
        stockStatus: 'IN_STOCK'
    },
    {
        id: 'cat_028',
        name: 'Forever Bright Toothgel',
        // Dental/Fresh context
        images: [
            'https://images.unsplash.com/photo-1559599101-f09722fb2948?q=80&w=2000&h=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571781926291-280553fe755c?q=80&w=2000&h=2000&auto=format&fit=crop'
        ],
        shortDescription: 'Gentle, fluoride-free formula.',
        fullDescription: 'Aloe vera and bee propolis formula. Gentle on teeth and gums, great minty flavor.',
        price: 55.00,
        benefits: ['Fluoride-free', 'Contains Bee Propolis', 'Refreshing mint flavor', 'Suitable for the whole family'],
        usageSteps: ['Brush teeth after meals', 'Rinse thoroughly'],
        category: 'Personal Care',
        ingredients: ['Aloe Barbadensis Gel', 'Bee Propolis', 'Natural Mint Flavor'],
        tags: ['Hygiene', 'Family Friendly'],
        stockStatus: 'IN_STOCK'
    },
    {
        id: 'cat_475',
        name: 'C9™ Cleansing Program',
        // Supplements/Fitness context
        images: [
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&h=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&h=2000&auto=format&fit=crop'
        ],
        shortDescription: 'Look better and feel better in just 9 days.',
        fullDescription: 'The C9 program can help you jumpstart your journey to a slimmer, healthier you. This effective, easy-to-follow cleansing program will give you the tools you need to start transforming your body today.',
        price: 950.00,
        benefits: ['Reset your habits', 'Look and feel better', 'Nutritional support', 'Step-by-step guide included'],
        usageSteps: ['Follow the C9 booklet guide', 'Take supplements as directed', 'Drink plenty of water'],
        category: 'Weight Management',
        ingredients: ['Aloe Vera Gel', 'Forever Lite Ultra', 'Forever Therm', 'Forever Garcinia Plus', 'Forever Fiber'],
        tags: ['Weight Loss', 'Detox', 'Transformation'],
        stockStatus: 'LOW_STOCK'
    },
    {
        id: 'cat_034',
        name: 'Aloe Berry Nectar',
        // Red drink/Cranberry context
        images: [
            'https://images.unsplash.com/photo-1620917670397-a3313437ef78?q=80&w=2000&h=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600093463592-203651439697?q=80&w=2000&h=2000&auto=format&fit=crop'
        ],
        shortDescription: 'All the benefits of Aloe with a burst of cranberry.',
        fullDescription: 'A refreshing zest of cranberries and sweet apples for a naturally derived, sweet yet tangy flavor.',
        price: 180.00,
        benefits: ['Supports urinary health', 'High in Vitamin C', 'Natural antioxidants', 'Great taste'],
        usageSteps: ['Shake well before use', 'Take 60-120ml daily'],
        category: 'Digestive Health',
        ingredients: ['Stabilized Aloe Vera Gel', 'Apple Juice Concentrate', 'Cranberry Juice Concentrate'],
        tags: ['Digestion', 'Skin', 'Immunity'],
        stockStatus: 'OUT_OF_STOCK'
    }
];
