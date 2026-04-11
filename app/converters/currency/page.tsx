'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ConverterCard } from '@/components/ConverterCard'
import { UnitInput } from '@/components/UnitInput'
import { ConverterDisplay } from '@/components/ConverterDisplay'
import { useCurrencyConverter } from '@/hooks/use-currency-converter'
import { currencyUnits, currencyUnitLabels, type CurrencyCode } from '@/lib/converters/currency-service'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2, AlertTriangle } from 'lucide-react'

const currencyData = [
  { code: 'USD', name: 'US Dollar', symbol: '$', description: 'Currency of the United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', description: 'Currency of the European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', description: 'Currency of the United Kingdom' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', description: 'Currency of Japan' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', description: 'Currency of Australia' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', description: 'Currency of Canada' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', description: 'Currency of India' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', description: 'Currency of Switzerland' },
]

const exchangeFacts = [
  'Exchange rates fluctuate constantly based on market conditions and economic factors',
  '1 USD is often considered the global reserve currency for international trade',
  'The EUR is the second most widely used reserve currency after the USD',
  'Daily forex trading volume exceeds $6 trillion, making it the largest financial market',
]

const conversionTips = [
  'Consider transaction fees when converting large amounts',
  'Mid-market rates are the true exchange rates between banks',
  'Bank rates may differ from market rates due to profit margins',
  'Crypto exchanges sometimes offer competitive rates for international transfers',
]

export default function CurrencyConverter() {
  const { loading, error, isOffline, convert } = useCurrencyConverter()
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<CurrencyCode>('USD')
  const [outputUnit, setOutputUnit] = useState<CurrencyCode>('EUR')
  const [result, setResult] = useState('0')
  const [converting, setConverting] = useState(false)

  // Handle conversion
  useEffect(() => {
    if (!inputValue || !inputValue.match(/^\d*\.?\d*$/)) {
      setResult('0')
      return
    }

    const performConversion = async () => {
      setConverting(true)
      try {
        const converted = await convert(parseFloat(inputValue), inputUnit, outputUnit)
        setResult(converted.toFixed(2))
      } catch (err) {
        console.error('Conversion error:', err)
        setResult('0')
      } finally {
        setConverting(false)
      }
    }

    const timer = setTimeout(performConversion, 300)
    return () => clearTimeout(timer)
  }, [inputValue, inputUnit, outputUnit, convert])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="glass-button-secondary flex h-10 w-10 items-center justify-center p-0 text-lg"
          >
            ←
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Converters</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Loading Exchange Rates</AlertTitle>
            <AlertDescription>Fetching the latest currency exchange rates...</AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Offline State */}
        {isOffline && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-900 dark:text-amber-100">Offline Mode</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Using cached exchange rates. Connect to the internet for the latest rates.
            </AlertDescription>
          </Alert>
        )}

        {/* Converter Card */}
        <ConverterCard title="Currency Converter" icon="💱">
          <div className="space-y-6">
            {/* Input */}
            <UnitInput
              label="From"
              value={inputValue}
              onChange={setInputValue}
              unit={inputUnit}
              onUnitChange={(unit) => setInputUnit(unit as CurrencyCode)}
              units={currencyUnits.map((u) => currencyUnitLabels[u])}
              placeholder="Enter amount"
              disabled={loading}
            />

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const temp = inputUnit
                  setInputUnit(outputUnit)
                  setOutputUnit(temp)
                }}
                disabled={loading || converting}
                className="glass-button-secondary rounded-full px-4 py-2 text-sm disabled:opacity-50"
              >
                ⇄ Swap
              </button>
            </div>

            {/* Output */}
            <ConverterDisplay
              value={result}
              unit={currencyUnitLabels[outputUnit]}
              label="To"
              loading={converting}
            />
          </div>
        </ConverterCard>

        {/* Info card */}
        <div className="glass-card p-4 text-center text-sm text-muted-foreground">
          <p>Convert between major world currencies using {isOffline ? 'cached' : 'current'} exchange rates.</p>
        </div>

        {/* Supported Currencies Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Supported Currencies</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {currencyData.map((currency) => (
              <div key={currency.code} className="glass-card p-3 text-center">
                <div className="text-lg font-bold text-primary">{currency.symbol}</div>
                <div className="text-xs font-medium text-foreground">{currency.code}</div>
                <div className="text-xs text-muted-foreground mt-1">{currency.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Exchange Rate Facts */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Did You Know?</h3>
          <div className="space-y-2">
            {exchangeFacts.map((fact, idx) => (
              <div key={idx} className="py-2 border-b border-border/50 last:border-0 text-sm text-muted-foreground">
                <p>• {fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Tips */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Conversion Tips</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {conversionTips.map((tip, idx) => (
              <p key={idx}>• {tip}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
