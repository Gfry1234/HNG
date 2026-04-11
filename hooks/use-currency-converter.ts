// Hook for managing currency conversion with async data fetching
'use client'

import { useState, useEffect, useCallback } from 'react'
import { convertCurrency, type CurrencyCode, getExchangeRates, type ExchangeRates } from '@/lib/converters/currency-service'

export interface UseCurrencyConverterState {
  loading: boolean
  error: string | null
  rates: ExchangeRates | null
  isOffline: boolean
}

export function useCurrencyConverter() {
  const [state, setState] = useState<UseCurrencyConverterState>({
    loading: true,
    error: null,
    rates: null,
    isOffline: false,
  })

  // Initialize rates on mount
  useEffect(() => {
    const initRates = async () => {
      try {
        // Check if we're online
        const isOnline = navigator.onLine
        setState((prev: UseCurrencyConverterState) => ({ ...prev, isOffline: !isOnline }))

        const rates = await getExchangeRates('USD')
        setState((prev: UseCurrencyConverterState) => ({
          ...prev,
          rates,
          loading: false,
          error: null,
        }))
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to load exchange rates'
        setState((prev: UseCurrencyConverterState) => ({
          ...prev,
          loading: false,
          error,
          isOffline: !navigator.onLine,
        }))
      }
    }

    initRates()

    // Listen for online/offline events
    const handleOnline = () => setState((prev: UseCurrencyConverterState) => ({ ...prev, isOffline: false }))
    const handleOffline = () => setState((prev: UseCurrencyConverterState) => ({ ...prev, isOffline: true }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const convert = useCallback(
    async (value: number, from: CurrencyCode, to: CurrencyCode): Promise<number> => {
      return convertCurrency(value, from, to)
    },
    []
  )

  return {
    ...state,
    convert,
  }
}
