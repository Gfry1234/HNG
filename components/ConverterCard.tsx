import React from 'react'

interface ConverterCardProps {
  children: React.ReactNode
  title: string
  icon?: string
}

export function ConverterCard({ children, title, icon }: ConverterCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {children}
    </div>
  )
}
