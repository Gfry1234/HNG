import React from 'react'

interface UnitInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  unit: string
  onUnitChange: (unit: string) => void
  units: string[]
  placeholder?: string
  disabled?: boolean
}

export function UnitInput({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  units,
  placeholder = 'Enter value',
  disabled = false,
}: UnitInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="glass-input flex-1 disabled:opacity-50"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          disabled={disabled}
          className="glass-input w-32 disabled:opacity-50"
        >
          {units.map((u) => (
            <option key={u} value={u} className="bg-background text-foreground">
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
