'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConverterCard } from '@/components/ConverterCard'
import { UnitInput } from '@/components/UnitInput'
import { ConverterDisplay } from '@/components/ConverterDisplay'
import { convertLength, lengthUnits, lengthUnitLabels, type LengthUnit } from '@/lib/converters/length'

const lengthData = [
  { symbol: 'm', name: 'Meter', description: 'SI base unit of length' },
  { symbol: 'km', name: 'Kilometer', description: '1,000 meters' },
  { symbol: 'cm', name: 'Centimeter', description: '1/100 of a meter' },
  { symbol: 'mm', name: 'Millimeter', description: '1/1,000 of a meter' },
  { symbol: 'mi', name: 'Mile', description: '~1.609 kilometers' },
  { symbol: 'yd', name: 'Yard', description: '3 feet' },
  { symbol: 'ft', name: 'Foot', description: '12 inches' },
  { symbol: 'in', name: 'Inch', description: '2.54 centimeters' },
]

export default function LengthConverter() {
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<LengthUnit>('m')
  const [outputUnit, setOutputUnit] = useState<LengthUnit>('ft')

  const result = inputValue
    ? convertLength(parseFloat(inputValue), inputUnit, outputUnit).toFixed(6)
    : '0'

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-6 sm:px-6 sm:py-8">
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
        <ConverterCard title="Length Converter" icon="📏">
          <div className="space-y-6">
            {/* Input */}
            <UnitInput
              label="From"
              value={inputValue}
              onChange={setInputValue}
              unit={inputUnit}
              onUnitChange={(unit) => setInputUnit(unit as LengthUnit)}
              units={lengthUnits.map((u) => lengthUnitLabels[u])}
              placeholder="Enter length"
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
              unit={lengthUnitLabels[outputUnit]}
              label="To"
            />
          </div>
        </ConverterCard>

        {/* Units Info Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Units</h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {lengthData.map((unit) => (
              <div key={unit.symbol} className="glass-card p-3 text-center">
                <div className="text-lg font-bold text-primary">{unit.symbol}</div>
                <div className="text-xs font-medium text-foreground">{unit.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{unit.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Quick Facts</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <span className="text-foreground font-medium">1 kilometer</span> = 1,000 meters = 0.621 miles</p>
            <p>• <span className="text-foreground font-medium">1 mile</span> = 1.609 kilometers = 5,280 feet</p>
            <p>• <span className="text-foreground font-medium">1 foot</span> = 12 inches = 0.3048 meters</p>
            <p>• <span className="text-foreground font-medium">1 meter</span> = 100 centimeters = 39.37 inches</p>
          </div>
        </div>
      </div>
    </main>
  )
}
