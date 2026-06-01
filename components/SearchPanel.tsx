'use client'

import { useState } from 'react'
import { Radar, Zap, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchPanelProps {
  onScrape: (keywords: string, location: string, maxResults: number) => void
  isScraping: boolean
  estimatedCost: number
  emailRate: number
}

export default function SearchPanel({ onScrape, isScraping, estimatedCost, emailRate }: SearchPanelProps) {
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')
  const [maxResults, setMaxResults] = useState(50)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!keywords.trim() || !location.trim() || isScraping) return
    onScrape(keywords, location, maxResults)
  }

  return (
    <div className="bracket-card bg-radar-card border border-radar-border rounded p-6 relative overflow-hidden">
      {/* Radar sweep background */}
      <div className="radar-sweep opacity-30" />
      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded border border-radar-green/30 flex items-center justify-center bg-radar-green/10">
            <Radar className="w-5 h-5 text-radar-green" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold tracking-widest text-radar-green uppercase">
              Target Acquisition
            </h2>
            <p className="text-radar-muted text-xs mt-0.5">Configure your lead search parameters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Keywords + Location row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-radar-muted uppercase tracking-wider mb-2">
                Keywords / Search Query
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="coffee shops, restaurants..."
                className="w-full bg-radar-panel border border-radar-border rounded px-4 py-3 text-radar-text font-mono text-sm placeholder:text-radar-dim focus:border-radar-green transition-all"
                disabled={isScraping}
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-radar-muted uppercase tracking-wider mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Miami, Florida"
                className="w-full bg-radar-panel border border-radar-border rounded px-4 py-3 text-radar-text font-mono text-sm placeholder:text-radar-dim focus:border-radar-green transition-all"
                disabled={isScraping}
              />
            </div>
          </div>

          {/* Max Results slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-radar-muted uppercase tracking-wider">
                Max Results Per Query
              </label>
              <span className="font-orbitron text-radar-green text-sm font-bold">
                {maxResults}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full h-1 bg-radar-border rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-radar-green [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,136,0.5)]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
              disabled={isScraping}
            />
            <div className="flex justify-between text-[10px] text-radar-dim mt-1">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          {/* Cost estimate + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-radar-amber">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Est. Cost: <span className="text-radar-amber font-bold">${estimatedCost.toFixed(2)}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-radar-cyan">
                <Zap className="w-3.5 h-3.5" />
                <span>~{Math.round(maxResults * 0.6)} emails</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isScraping || !keywords.trim() || !location.trim()}
              className={cn(
                'btn-radar w-full sm:w-auto px-8 py-3 rounded font-orbitron text-xs font-bold tracking-widest uppercase',
                'bg-radar-green/10 border border-radar-green text-radar-green',
                'hover:bg-radar-green/20 transition-all duration-200',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-radar-green/10',
                isScraping && 'animate-pulse-glow'
              )}
            >
              {isScraping ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-radar-green rounded-full animate-ping" />
                  Scraping...
                </span>
              ) : (
                'Initiate Scrape'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}