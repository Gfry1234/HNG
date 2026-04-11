'use client'

import Link from 'next/link'

interface ConverterCard {
  href: string
  title: string
  description: string
  icon: string
  color: string
}

const converters: ConverterCard[] = [
  {
    href: '/converters/length',
    title: 'Length',
    description: 'Meters, kilometers, miles, feet',
    icon: '📏',
    color: 'from-primary/20 to-primary/5',
  },
  {
    href: '/converters/temperature',
    title: 'Temperature',
    description: 'Celsius, Fahrenheit, Kelvin',
    icon: '🌡️',
    color: 'from-accent/20 to-accent/5',
  },
  {
    href: '/converters/weight',
    title: 'Weight',
    description: 'Kilograms, pounds, ounces',
    icon: '⚖️',
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    href: '/converters/currency',
    title: 'Currency',
    description: 'USD, EUR, GBP, JPY, and more',
    icon: '💱',
    color: 'from-accent/20 to-accent/5',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-12">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="text-6xl">🛠️</div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Smart Utility Toolkit
          </h1>
          <p className="mx-auto max-w-sm text-lg text-muted-foreground">
            Essential everyday tools in a single mobile application
          </p>
        </div>

        {/* Converters Grid */}
        <div className="glass-grid grid-cols-1 sm:grid-cols-2">
          {converters.map((converter) => (
            <Link
              key={converter.href}
              href={converter.href}
              className="group glass-card overflow-hidden p-6 transition-all hover:scale-105 active:scale-95"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${converter.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />

              {/* Content */}
              <div className="space-y-3">
                {/* Icon and Title */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{converter.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{converter.description}</p>
                  </div>
                  <span className="text-4xl">{converter.icon}</span>
                </div>

                {/* Arrow indicator */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-1">
                  Open <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="glass-card space-y-4 p-6 text-center">
          <h2 className="text-xl font-bold text-foreground">Why Use Smart Utility Toolkit?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-2xl">⚡</div>
              <p className="text-sm text-muted-foreground">Instant conversions with precise calculations</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🎨</div>
              <p className="text-sm text-muted-foreground">Beautiful iOS 26 glass design</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">📱</div>
              <p className="text-sm text-muted-foreground">Perfect for mobile and tablet</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>All conversions are performed locally for privacy and speed</p>
        </div>
      </div>
    </main>
  )
}
