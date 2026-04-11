export type TemperatureUnit = 'C' | 'F' | 'K'

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return value

  // Convert to Celsius first
  let celsius: number
  if (from === 'C') {
    celsius = value
  } else if (from === 'F') {
    celsius = (value - 32) * (5 / 9)
  } else {
    // Kelvin
    celsius = value - 273.15
  }

  // Convert from Celsius to target unit
  if (to === 'C') {
    return celsius
  } else if (to === 'F') {
    return celsius * (9 / 5) + 32
  } else {
    // Kelvin
    return celsius + 273.15
  }
}

export const temperatureUnits: TemperatureUnit[] = ['C', 'F', 'K']

export const temperatureUnitLabels: Record<TemperatureUnit, string> = {
  C: 'Celsius (°C)',
  F: 'Fahrenheit (°F)',
  K: 'Kelvin (K)',
}
