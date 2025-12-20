
import { CurrencyCode } from '../types/salesPage';

// 1. Static Mapping for FBO Defaulting
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  'USA': 'USD',
  'UK': 'GBP',
  'Ghana': 'GHS',
  'Nigeria': 'NGN',
  'South Africa': 'ZAR',
  'Kenya': 'KES',
  'Tanzania': 'TZS',
  'Uganda': 'UGX',
  'UAE': 'AED',
  'India': 'INR',
  'Canada': 'CAD',
  'Australia': 'AUD',
  'Philippines': 'PHP',
  'Malaysia': 'MYR'
};

export interface ConversionResult {
  amount: number;
  currency: CurrencyCode;
  rate: number;
  isConverted: boolean;
}

// 2. Visitor Detection & Live Conversion Logic
class CurrencyService {
  private cache: Record<string, number> = {};

  // Get Visitor's Local Currency based on IP
  async detectVisitorCurrency(): Promise<CurrencyCode> {
    try {
      // Using a reliable free IP Geolocation API
      const response = await fetch('https://ipapi.co/currency/');
      if (!response.ok) throw new Error('Geo lookup failed');
      const currency = await response.text();
      return currency.trim() as CurrencyCode;
    } catch (error) {
      console.warn("Currency detection failed, defaulting to USD", error);
      return 'USD';
    }
  }

  // Fetch Live Exchange Rate
  async getExchangeRate(from: CurrencyCode, to: CurrencyCode): Promise<number> {
    const pair = `${from}_${to}`;
    if (this.cache[pair]) return this.cache[pair];

    try {
      // Using ExchangeRate-API (Free tier allows direct browser calls)
      const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await response.json();
      
      if (data.result === 'success' && data.rates[to]) {
        this.cache[pair] = data.rates[to];
        return data.rates[to];
      }
      return 1;
    } catch (error) {
      console.error("Exchange rate fetch failed", error);
      return 1;
    }
  }

  // High-level convert function
  async convertPrice(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<ConversionResult> {
    if (from === to) {
      return { amount, currency: from, rate: 1, isConverted: false };
    }

    const rate = await this.getExchangeRate(from, to);
    return {
      amount: amount * rate,
      currency: to,
      rate: rate,
      isConverted: true
    };
  }
}

export const currencyService = new CurrencyService();
