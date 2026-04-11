// Length conversion rates to meters
const LENGTH_UNITS = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
}

export type LengthUnit = keyof typeof LENGTH_UNITS

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  if (value === 0) return 0
  const meters = value * LENGTH_UNITS[from]
  return meters / LENGTH_UNITS[to]
}

export const lengthUnits: LengthUnit[] = Object.keys(LENGTH_UNITS) as LengthUnit[]

export const lengthUnitLabels: Record<LengthUnit, string> = {
  m: 'Meters (m)',
  km: 'Kilometers (km)',
  cm: 'Centimeters (cm)',
  mm: 'Millimeters (mm)',
  mi: 'Miles (mi)',
  yd: 'Yards (yd)',
  ft: 'Feet (ft)',
  in: 'Inches (in)',
}
