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

        {/* Converter Card */}
        <ConverterCard title="Temperature Converter" icon="🌡️">
          <div className="space-y-6">
            {/* Input */}
            <UnitInput
              label="From"
              value={inputValue}
              onChange={setInputValue}
              unit={inputUnit}
              onUnitChange={(unit) => setInputUnit(unit as TemperatureUnit)}
              units={temperatureUnits.map((u) => temperatureUnitLabels[u])}
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
        </ConverterCard>

        {/* Temperature Scales Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Temperature Scales</h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {temperatureData.map((scale) => (
              <div key={scale.symbol} className="glass-card p-3">
                <div className="text-2xl font-bold text-primary mb-1">{scale.symbol}</div>
                <div className="text-sm font-medium text-foreground">{scale.name}</div>
                <div className="text-xs text-muted-foreground mt-2">{scale.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reference Points */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Reference Points</h3>
          <div className="space-y-2">
            {temperatureReferences.map((ref) => (
              <div key={ref.label} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{ref.label}</span>
                <div className="space-x-3">
                  <span className="text-foreground font-medium">{ref.value}</span>
                  <span className="text-foreground font-medium">{(ref.celsius * 9/5 + 32).toFixed(1)}°F</span>
                  <span className="text-foreground font-medium">{(ref.celsius + 273.15).toFixed(2)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Info */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="font-semibold text-foreground text-sm">Conversion Formulas</h3>
          <div className="space-y-1 text-xs text-muted-foreground font-mono">
            <p>°F = (°C × 9/5) + 32</p>
            <p>°C = (°F - 32) × 5/9</p>
            <p>K = °C + 273.15</p>
          </div>
        </div>
      </div>
    </main>
  )
}
