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
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5">
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
              <h1 className="text-2xl font-bold text-foreground">Weight</h1>
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
                onUnitChange={(unit) => setInputUnit(unit as WeightUnit)}
                units={weightUnits.map((u) => ({ key: u, label: weightUnitLabels[u] }))}
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
          </div>

          {/* Weight Units Grid - Compact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Available Units</h3>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {weightData.map((unit) => (
                <div key={unit.symbol} className="glass-card p-3 text-center text-xs">
                  <div className="font-bold text-primary">{unit.symbol}</div>
                  <div className="text-foreground">{unit.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
