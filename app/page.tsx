'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import SearchPanel from '@/components/SearchPanel'
import ResultsFeed from '@/components/ResultsFeed'
import StatsBar from '@/components/StatsBar'
import ExportBar from '@/components/ExportBar'
import { ApifyLead } from '@/lib/apify'

const COST_PER_RESULT = 0.004
const INITIAL_CREDIT = 5.0

export default function Home() {
  const [leads, setLeads] = useState<ApifyLead[]>([])
  const [isScraping, setIsScraping] = useState(false)
  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')
  const [error, setError] = useState<string | undefined>()
  const [currentCount, setCurrentCount] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalScraped, setTotalScraped] = useState(0)
  const [remainingCredit, setRemainingCredit] = useState(INITIAL_CREDIT)
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')
  const [maxResults, setMaxResults] = useState(50)
  const [scrapeStartTime, setScrapeStartTime] = useState<number | null>(null)

  const estimatedCost = maxResults * COST_PER_RESULT
  const emailRate = leads.length > 0
    ? Math.round((leads.filter((l) => l.email && l.isEmail).length / leads.length) * 100)
    : 60

  const handleScrape = useCallback(async (kw: string, loc: string, max: number) => {
    setKeywords(kw)
    setLocation(loc)
    setMaxResults(max)
    setIsScraping(true)
    setScrapeStatus('running')
    setError(undefined)
    setLeads([])
    setCurrentCount(0)
    setScrapeStartTime(Date.now())

    try {
      // Start the scrape
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: kw, location: loc, maxResults: max }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to start scrape')
      }

      const { runId } = await res.json()

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/results?runId=${runId}`)
          const data = await statusRes.json()

          if (data.status === 'running') {
            setCurrentCount(data.currentCount || 0)
          } else if (data.status === 'completed') {
            clearInterval(pollInterval)
            setLeads(data.results || [])
            setScrapeStatus('completed')
            setIsScraping(false)

            const cost = data.stats?.cost || 0
            setTotalCost((c) => c + cost)
            setTotalScraped((t) => t + (data.results?.length || 0))
            setRemainingCredit((r) => Math.max(0, r - cost))
            setCurrentCount(data.results?.length || 0)
          } else if (data.status === 'failed') {
            clearInterval(pollInterval)
            setError(data.error || 'Scrape failed')
            setScrapeStatus('failed')
            setIsScraping(false)
          }
        } catch (e) {
          clearInterval(pollInterval)
          setError(String(e))
          setScrapeStatus('failed')
          setIsScraping(false)
        }
      }, 3000)
    } catch (e) {
      setError(String(e))
      setScrapeStatus('failed')
      setIsScraping(false)
    }
  }, [])

  const handleClear = () => {
    setLeads([])
    setScrapeStatus('idle')
    setError(undefined)
    setCurrentCount(0)
  }

  const duration = scrapeStartTime && scrapeStatus === 'completed'
    ? Math.round((Date.now() - scrapeStartTime) / 1000)
    : undefined

  const withEmails = leads.filter((l) => l.email && l.isEmail).length
  const statsEmailRate = leads.length > 0
    ? Math.round((withEmails / leads.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-radar-bg grid-overlay">
      <Header isScraping={isScraping} totalScraped={totalScraped} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Search Panel */}
        <SearchPanel
          onScrape={handleScrape}
          isScraping={isScraping}
          estimatedCost={estimatedCost}
          emailRate={emailRate}
        />

        {/* Stats Bar */}
        <StatsBar
          total={leads.length}
          withEmails={withEmails}
          cost={totalCost}
          emailRate={statsEmailRate}
          remainingCredit={remainingCredit}
          duration={duration}
        />

        {/* Results Feed */}
        <ResultsFeed
          leads={leads}
          isLoading={isScraping}
          status={scrapeStatus}
          error={error}
          currentCount={currentCount}
        />

        {/* Export Bar */}
        <ExportBar
          leads={leads}
          keywords={keywords}
          location={location}
          onClear={handleClear}
        />

        {/* Credit info footer */}
        <div className="text-center text-xs font-mono text-radar-dim py-4">
          Apify $5 free credit · scraper-mind actor · $0.004/result · ~12,500 free leads remaining
        </div>
      </main>
    </div>
  )
}