'use client'

import { Target, Mail, DollarSign, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsBarProps {
  total: number
  withEmails: number
  cost: number
  emailRate: number
  remainingCredit: number
  duration?: number
}

export default function StatsBar({ total, withEmails, cost, emailRate, remainingCredit, duration }: StatsBarProps) {
  const cards = [
    {
      icon: Target,
      label: 'Total Leads',
      value: total,
      color: 'text-radar-cyan',
      bg: 'bg-radar-cyan/10',
    },
    {
      icon: Mail,
      label: 'With Emails',
      value: withEmails,
      sub: total > 0 ? `${emailRate}%` : '—',
      color: 'text-radar-green',
      bg: 'bg-radar-green/10',
    },
    {
      icon: DollarSign,
      label: 'Cost Used',
      value: `$${cost.toFixed(2)}`,
      color: 'text-radar-amber',
      bg: 'bg-radar-amber/10',
    },
    {
      icon: Zap,
      label: 'Credit Left',
      value: `$${remainingCredit.toFixed(2)}`,
      color: 'text-radar-green',
      bg: 'bg-radar-green/10',
    },
  ]

  if (duration !== undefined) {
    cards.push({
      icon: Clock,
      label: 'Duration',
      value: `${duration}s`,
      color: 'text-radar-muted',
      bg: 'bg-radar-muted/10',
    })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bracket-card bg-radar-card border border-radar-border rounded p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('w-7 h-7 rounded flex items-center justify-center', card.bg)}>
              <card.icon className={cn('w-3.5 h-3.5', card.color)} />
            </div>
            <span className="text-[10px] font-mono text-radar-muted uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <div className={cn('font-orbitron text-xl font-bold', card.color)}>
            {card.value}
          </div>
          {card.sub && (
            <div className="text-xs font-mono text-radar-dim mt-0.5">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  )
}