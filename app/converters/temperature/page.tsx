'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConverterCard } from '@/components/ConverterCard'
import { UnitInput } from '@/components/UnitInput'
import { ConverterDisplay } from '@/components/ConverterDisplay'
import { convertTemperature, temperatureUnits, temperatureUnitLabels, type TemperatureUnit } from '@/lib/converters/temperature'

const temperatureData = [
  { symbol: '°C', name: 'Celsius', description: 'Metric scale, water freezes at 0°C' },
  { symbol: '°F', name: 'Fahrenheit', description: 'Imperial scale, water freezes at 32°F' },
  { symbol: 'K', name: 'Kelvin', description: 'Absolute scale, starts at absolute zero' },
]

const temperatureReferences = [
  { value: '0°C', label: 'Water Freezes', celsius: 0 },
  { value: '37°C', label: 'Body Temperature', celsius: 37 },
  { value: '100°C', label: 'Water Boils', celsius: 100 },
]

export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('C')
  const [outputUnit, setOutputUnit] = useState<TemperatureUnit>('F')

  const result = inputValue
    ? convertTemperature(parseFloat(inputValue), inputUnit, outputUnit).toFixed(2)
    : '0'

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
              <h1 className="text-2xl font-bold text-foreground">Temperature</h1>
            </div>
          </div>

          {/* Converter Card */}
          <div className="glass-card p-6">
            <div className="space-y-6">
              {/* Input */}
              <UnitInput
                label="From"
                value={inputValue}
                onChange={setInputValue}
                unit={inputUnit}
                onUnitChange={(unit) => setInputUnit(unit as TemperatureUnit)}
                units={temperatureUnits.map((u) => ({ key: u, label: temperatureUnitLabels[u] }))}
                placeholder="Enter temperature"
              />

              {/* Swap button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const temp = inputUnit
                    setInputUnit(outputUnit)
                    setOutputUnit(temp)
                  }}
                  className="glass-button-secondary rounded-full px-4 py-2 text-sm"
                >
                  ⇄ Swap
                </button>
              </div>

              {/* Output */}
              <ConverterDisplay
                value={result}
                unit={temperatureUnitLabels[outputUnit]}
                label="To"
              />
            </div>
          </div>

          {/* Temperature Scales Info - Compact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Temperature Scales</h3>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
              {temperatureData.map((scale) => (
                <div key={scale.symbol} className="glass-card p-3">
                  <div className="text-lg font-bold text-primary">{scale.symbol}</div>
                  <div className="text-xs font-medium text-foreground">{scale.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
