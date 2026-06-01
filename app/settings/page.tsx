'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('')
  const [saved, setSaved] = useState(false)
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    setApiToken(localStorage.getItem('apify_token') || '')
  }, [])

  const handleSave = () => {
    localStorage.setItem('apify_token', apiToken.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    setApiToken('')
    localStorage.removeItem('apify_token')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const maskedToken = apiToken
    ? apiToken.slice(0, 6) + '•'.repeat(Math.max(0, apiToken.length - 8)) + apiToken.slice(-4)
    : ''

  return (
    <div className="min-h-screen bg-radar-bg grid-overlay">
      {/* Header */}
      <header className="border-b border-radar-border bg-radar-panel/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-radar-muted hover:text-radar-green transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-wider">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-orbitron text-2xl font-bold tracking-[0.15em] uppercase text-radar-green">
            Settings
          </h1>
          <p className="font-mono text-xs text-radar-muted mt-2 uppercase tracking-wider">
            Configure your scraping credentials
          </p>
        </div>

        {/* Apify API Token */}
        <div className="border border-radar-border rounded-lg bg-radar-panel/50 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-radar-amber" />
            <h2 className="font-orbitron text-sm font-semibold tracking-[0.1em] uppercase text-radar-cyan">
              Apify API Token
            </h2>
          </div>

          <p className="font-mono text-xs text-radar-muted leading-relaxed">
            Get your token from{' '}
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-radar-cyan underline hover:text-radar-green transition-colors"
            >
              console.apify.com/account/integrations
            </a>
            . Used to scrape Google Maps for business leads with emails.
          </p>

          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={apiToken}
              onChange={(e) => {
                setApiToken(e.target.value)
                setSaved(false)
              }}
              placeholder="Enter your Apify API token..."
              className="w-full bg-radar-bg border border-radar-border rounded px-4 py-3 font-mono text-sm text-radar-text placeholder-radar-dim focus:outline-none focus:border-radar-cyan transition-colors pr-20"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-radar-muted uppercase tracking-wider hover:text-radar-cyan transition-colors"
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>

          {apiToken && (
            <p className="font-mono text-[10px] text-radar-dim">
              Current: <span className="text-radar-cyan">{maskedToken}</span>
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!apiToken.trim()}
              className="px-6 py-2 bg-radar-green/10 border border-radar-green text-radar-green font-mono text-xs uppercase tracking-wider rounded hover:bg-radar-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saved ? '✓ Saved' : 'Save Token'}
            </button>
            {apiToken && (
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-radar-red/10 border border-radar-red/40 text-radar-red/70 font-mono text-xs uppercase tracking-wider rounded hover:bg-radar-red/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-6 border border-radar-border rounded-lg bg-radar-panel/30 p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-radar-cyan" />
            <h2 className="font-orbitron text-sm font-semibold tracking-[0.1em] uppercase text-radar-cyan">
              Usage & Pricing
            </h2>
          </div>

          <div className="space-y-2 font-mono text-xs text-radar-muted">
            <div className="flex justify-between">
              <span>Scraper Actor</span>
              <span className="text-radar-text">scraper-mind/google-maps-email-scraper-unlimited</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per result</span>
              <span className="text-radar-text">$0.004</span>
            </div>
            <div className="flex justify-between">
              <span>Email filter</span>
              <span className="text-radar-text">emailOnlyResults: true</span>
            </div>
            <div className="flex justify-between">
              <span>Free credit</span>
              <span className="text-radar-green font-bold">$5.00 (~6,250 leads)</span>
            </div>
          </div>
        </div>

        {/* Export Note */}
        <div className="mt-6 border border-radar-border/50 rounded-lg bg-radar-panel/20 p-4">
          <p className="font-mono text-[10px] text-radar-dim leading-relaxed">
            <span className="text-radar-amber uppercase font-bold">Note:</span> After scraping, export your leads as CSV and import them into the{' '}
            <a href="https://bulk-email-sender-pi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-radar-cyan underline hover:text-radar-green">
              Bulk Email Sender
            </a>{' '}
            app for outreach campaigns.
          </p>
        </div>
      </main>
    </div>
  )
}