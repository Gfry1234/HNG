// Service for fetching and managing exchange rates with offline support

import { cacheService } from '@/lib/storage/cache'

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest'
const CACHE_KEY_PREFIX = 'exchange_rates_'
const CACHE_TTL_MINUTES = 60 * 24 // 24 hours

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'INR' | 'CHF'

export interface ExchangeRates {
  base: string
  rates: Record<CurrencyCode, number>
  timestamp: number
}

// Fallback rates for offline support (last known good values)
const FALLBACK_RATES: ExchangeRates = {
  base: 'USD',
  rates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.5,
    AUD: 1.53,
    CAD: 1.36,
    INR: 83.12,
    CHF: 0.88,
  },
  timestamp: Date.now(),
}

export async function getExchangeRates(baseCurrency: CurrencyCode = 'USD'): Promise<ExchangeRates> {
  const cacheKey = `${CACHE_KEY_PREFIX}${baseCurrency}`

  // Try to get from cache first
  const cached = await cacheService.get<ExchangeRates>(cacheKey)
  if (cached) {
    return cached
  }

  // Try to fetch fresh data
  try {
    const response = await fetch(`${EXCHANGE_RATE_API}/${baseCurrency}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Filter to only the currencies we support
    const supportedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'CHF']
    const rates: Record<string, number> = {}

    supportedCurrencies.forEach((currency) => {
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency]
      }
    })

    const exchangeRates: ExchangeRates = {
      base: baseCurrency,
      rates: rates as Record<CurrencyCode, number>,
      timestamp: Date.now(),
    }

    // Cache the result
    await cacheService.set(cacheKey, exchangeRates, CACHE_TTL_MINUTES)

    return exchangeRates
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)

    // Return cached data if available, otherwise fallback
    const cached = await cacheService.get<ExchangeRates>(cacheKey)
    if (cached) {
      return cached
    }

    return FALLBACK_RATES
  }
}

export async function convertCurrency(
  value: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  if (from === to) return value
  if (value === 0) return 0

  const rates = await getExchangeRates(from)

  // Convert from source to USD first if from is not USD
  const usdValue = from === 'USD' ? value : value / rates.rates[from]

  // Then convert to target currency
  const targetRates = await getExchangeRates('USD')
  return usdValue * targetRates.rates[to]
}

export const currencyUnits: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'CHF']

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
