'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConverterCard } from '@/components/ConverterCard'
import { UnitInput } from '@/components/UnitInput'
import { ConverterDisplay } from '@/components/ConverterDisplay'
import { convertWeight, weightUnits, weightUnitLabels, type WeightUnit } from '@/lib/converters/weight'

const weightData = [
  { symbol: 'kg', name: 'Kilogram', description: 'SI base unit of mass' },
  { symbol: 'g', name: 'Gram', description: '1/1,000 of a kilogram' },
  { symbol: 'mg', name: 'Milligram', description: '1/1,000,000 of a kilogram' },
  { symbol: 'lb', name: 'Pound', description: '~0.454 kilograms' },
  { symbol: 'oz', name: 'Ounce', description: '1/16 of a pound' },
  { symbol: 't', name: 'Metric Tonne', description: '1,000 kilograms' },
  { symbol: 'st', name: 'Stone', description: '14 pounds' },
]

const commonWeights = [
  { item: 'Apple', weight: 0.182 },
  { item: 'Human (avg)', weight: 70 },
  { item: 'Car', weight: 1500 },
]

export default function WeightConverter() {
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<WeightUnit>('kg')
  const [outputUnit, setOutputUnit] = useState<WeightUnit>('lb')

  const result = inputValue
    ? convertWeight(parseFloat(inputValue), inputUnit, outputUnit).toFixed(4)
    : '0'

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 px-4 py-6 sm:px-6 sm:py-8">
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
        <ConverterCard title="Weight Converter" icon="⚖️">
          <div className="space-y-6">
            {/* Input */}
            <UnitInput
              label="From"
              value={inputValue}
              onChange={setInputValue}
              unit={inputUnit}
              onUnitChange={(unit) => setInputUnit(unit as WeightUnit)}
              units={weightUnits.map((u) => weightUnitLabels[u])}
              placeholder="Enter weight"
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
              unit={weightUnitLabels[outputUnit]}
              label="To"
            />
          </div>
        </ConverterCard>

        {/* Weight Units Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Units</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {weightData.map((unit) => (
              <div key={unit.symbol} className="glass-card p-3 text-center">
                <div className="text-lg font-bold text-primary">{unit.symbol}</div>
                <div className="text-xs font-medium text-foreground">{unit.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{unit.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Weight References */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Common Weight References</h3>
          <div className="space-y-2">
            {commonWeights.map((ref) => (
              <div key={ref.item} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{ref.item}</span>
                <span className="text-foreground font-medium">{ref.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Conversions */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Quick Conversions</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <span className="text-foreground font-medium">1 kilogram</span> = 1,000 grams = 2.205 pounds</p>
            <p>• <span className="text-foreground font-medium">1 pound</span> = 16 ounces = 0.454 kilograms</p>
            <p>• <span className="text-foreground font-medium">1 stone</span> = 14 pounds = 6.35 kilograms</p>
            <p>• <span className="text-foreground font-medium">1 tonne</span> = 1,000 kilograms = 2,205 pounds</p>
          </div>
        </div>
      </div>
    </main>
  )
}
