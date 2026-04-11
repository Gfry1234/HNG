// Weight conversion rates to kilograms
const WEIGHT_UNITS = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,
  oz: 0.0283495,
  t: 1000,
  st: 6.35029,
}

export type WeightUnit = keyof typeof WEIGHT_UNITS

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (value === 0) return 0
  const kilograms = value * WEIGHT_UNITS[from]
  return kilograms / WEIGHT_UNITS[to]
}

export const weightUnits: WeightUnit[] = Object.keys(WEIGHT_UNITS) as WeightUnit[]

export const weightUnitLabels: Record<WeightUnit, string> = {
  kg: 'Kilograms (kg)',
  g: 'Grams (g)',
  mg: 'Milligrams (mg)',
  lb: 'Pounds (lb)',
  oz: 'Ounces (oz)',
  t: 'Metric Tonnes (t)',
  st: 'Stones (st)',
}
