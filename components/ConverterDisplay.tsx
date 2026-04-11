import React from 'react'
import { Loader2 } from 'lucide-react'

interface ConverterDisplayProps {
  value: string
  unit: string
  label?: string
  loading?: boolean
}

export function ConverterDisplay({ value, unit, label = 'Result', loading = false }: ConverterDisplayProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <div className="glass-card rounded-2xl bg-white/5 p-4">
        <div className="text-center">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold text-primary">{value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{unit}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
