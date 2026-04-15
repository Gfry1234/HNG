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
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
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
              <h1 className="text-2xl font-bold text-foreground">Length</h1>
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
                onUnitChange={(unit) => setInputUnit(unit as LengthUnit)}
                units={lengthUnits.map((u) => ({ key: u, label: lengthUnitLabels[u] }))}
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
          </div>

          {/* Units Info Grid - Compact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Available Units</h3>
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
              {lengthData.map((unit) => (
                <div key={unit.symbol} className="glass-card p-3 text-center text-xs">
                  <div className="font-bold text-primary">{unit.symbol}</div>
                  <div className="text-xs text-foreground">{unit.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
