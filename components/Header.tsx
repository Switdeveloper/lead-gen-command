'use client'

import { Activity, Radio, Settings } from 'lucide-react'

interface HeaderProps {
  isScraping: boolean
  totalScraped: number
}

export default function Header({ isScraping, totalScraped }: HeaderProps) {
  return (
    <header className="border-b border-radar-border bg-radar-panel/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-radar-green flex items-center justify-center bg-radar-green/10">
                <Radio className="w-5 h-5 text-radar-green" />
              </div>
              {isScraping && (
                <div className="absolute inset-0 rounded-full border-2 border-radar-green animate-ping opacity-50" />
              )}
            </div>
            <div>
              <h1 className="font-orbitron text-sm font-bold tracking-[0.15em] uppercase text-radar-green">
                Lead Gen
              </h1>
              <p className="font-orbitron text-[10px] tracking-[0.2em] text-radar-muted uppercase">
                Command Center
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-6">
            {totalScraped > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-radar-cyan" />
                <span className="text-radar-muted">
                  Session: <span className="text-radar-cyan font-bold">{totalScraped}</span> leads
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-radar-border bg-radar-bg">
              <div className={`w-2 h-2 rounded-full ${isScraping ? 'bg-radar-green animate-pulse' : 'bg-radar-dim'}`} />
              <span className="text-[10px] font-mono text-radar-muted uppercase tracking-wider">
                {isScraping ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}