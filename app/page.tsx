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
  {
    href: '/tasks',
    title: 'Tasks',
    description: 'Create, track, and persist checklists',
    icon: '📝',
    color: 'from-secondary/20 to-secondary/5',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Animated background gradient overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <div className="relative px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          {/* Header Section */}
          <div className="space-y-4 text-center">
            <div className="text-6xl">🛠️</div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Smart Utility
            </h1>
            <p className="mx-auto max-w-sm text-lg text-muted-foreground">
              Powerful tools. Beautiful design. Always with you.
            </p>
          </div>

          {/* Main Grid */}
          <div className="glass-grid grid-cols-1 sm:grid-cols-2">{converters.map((converter) => (
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
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{converter.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{converter.description}</p>
                  </div>
                  <span className="text-4xl">{converter.icon}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-1">
                  Open <span>→</span>
                </div>
              </div>
            </Link>
          ))}
          </div>

          {/* Features Grid - Compact */}
          <div className="glass-card space-y-4 p-6">
            <h2 className="text-center text-xl font-bold text-foreground">Why Choose Us?</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2 text-center">
                <div className="text-2xl">⚡</div>
                <p className="text-xs text-muted-foreground">Instant conversions</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-2xl">🎨</div>
                <p className="text-xs text-muted-foreground">iOS design inspired</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-2xl">📱</div>
                <p className="text-xs text-muted-foreground">Mobile optimized</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-2xl">📝</div>
                <p className="text-xs text-muted-foreground">Local persistence</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground/80">
            <p>All conversions done locally. No tracking. No ads.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
