/**
 * @deprecated 
 * This  is kept for backward compatibility only
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'INR' | 'CHF'

// Deprecated: These are mock rates. Use currency-service.ts for real-time rates
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  AUD: 1.53,
  CAD: 1.36,
  INR: 83.12,
  CHF: 0.88,
}

export function convertCurrency(value: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return value
  if (value === 0) return 0

  // Convert to USD first
  const usd = value / EXCHANGE_RATES[from]
  // Then convert to target currency
  return usd * EXCHANGE_RATES[to]
}

export const currencyUnits: CurrencyCode[] = Object.keys(EXCHANGE_RATES) as CurrencyCode[]

export const currencyUnitLabels: Record<CurrencyCode, string> = {
  USD: 'US Dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British Pound (£)',
  JPY: 'Japanese Yen (¥)',
  AUD: 'Australian Dollar (A$)',
  CAD: 'Canadian Dollar (C$)',
  INR: 'Indian Rupee (₹)',
  CHF: 'Swiss Franc (CHF)',
}
