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
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', description: 'Currency of South Africa' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', description: 'Currency of Nigeria' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', description: 'Currency of Egypt' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'Sh', description: 'Currency of Kenya' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', description: 'Currency of Ghana' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'Sh', description: 'Currency of Uganda' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', description: 'Currency of Ethiopia' },
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
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
      </div>

      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="glass-button-secondary flex h-10 w-10 items-center justify-center p-0 text-lg"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Converter</p>
              <h1 className="text-2xl font-bold text-foreground">Currency</h1>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="glass-card border-blue-400/50 p-4 text-center text-sm">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-500 mb-2" />
              <p className="text-blue-400">Loading exchange rates...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="glass-card border-red-400/50 p-4 text-center text-sm">
              <p className="text-red-400">⚠️ {error}</p>
            </div>
          )}

          {/* Offline State */}
          {isOffline && (
            <div className="glass-card border-amber-400/50 p-4 text-center text-sm">
              <p className="text-amber-400">🔌 Using cached rates</p>
            </div>
          )}

          {/* Converter Card */}
          <div className="glass-card p-6">
            <div className="space-y-6">
              {/* Input */}
              <UnitInput
                label="From"
                value={inputValue}
                onChange={setInputValue}
                unit={inputUnit}
                onUnitChange={(unit) => setInputUnit(unit as CurrencyCode)}
                units={currencyUnits.map((u) => ({ key: u, label: currencyUnitLabels[u] }))}
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
          </div>

          {/* Supported Currencies - Compact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Supported ({currencyUnits.length})</h3>
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-5">
              {currencyData.map((currency) => (
                <div key={currency.code} className="glass-card p-2 text-center text-xs">
                  <div className="font-bold text-primary">{currency.symbol}</div>
                  <div className="text-xs text-foreground">{currency.code}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
