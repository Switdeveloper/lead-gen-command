'use client'

import { Activity, Radio } from 'lucide-react'
import Link from 'next/link'

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
            <Link
              href="/settings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-radar-border bg-radar-bg hover:border-radar-cyan/50 transition-colors group"
              title="Settings"
            >
              <svg
                className="w-3.5 h-3.5 text-radar-dim group-hover:text-radar-cyan transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-[10px] font-mono text-radar-dim group-hover:text-radar-cyan uppercase tracking-wider transition-colors">
                Settings
              </span>
            </Link>
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