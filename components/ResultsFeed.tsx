'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Clock, Mail, Phone, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { ApifyLead } from '@/lib/apify'
import { cn, formatPhone, cleanAddress } from '@/lib/utils'

interface ResultsFeedProps {
  leads: ApifyLead[]
  isLoading: boolean
  status: 'idle' | 'running' | 'completed' | 'failed'
  error?: string
  currentCount: number
  onRefresh?: () => Promise<void>
}

export default function ResultsFeed({ leads, isLoading, status, error, currentCount }: ResultsFeedProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showEmailsOnly, setShowEmailsOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = leads.filter((lead) => {
    if (showEmailsOnly && (!lead.email || !lead.isEmail)) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        lead.title.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term) ||
        lead.address.toLowerCase().includes(term)
      )
    }
    return true
  })

  return (
    <div className="bracket-card bg-radar-card border border-radar-border rounded overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-radar-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'status-dot',
            status === 'running' && 'animate-pulse',
            status === 'completed' && 'bg-radar-green',
            status === 'failed' && 'bg-red-500',
            status === 'idle' && 'bg-radar-dim'
          )} />
          <h3 className="font-orbitron text-xs font-bold tracking-widest uppercase text-radar-text">
            Live Feed
          </h3>
          {status === 'running' && (
            <button
              onClick={async () => {
                if (onRefresh) {
                  try {
                    await onRefresh()
                  } catch (e) {
                    console.error('Refresh failed:', e)
                  }
                }
              }}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded border border-radar-border bg-radar-panel/20 px-2 py-1 text-xs font-mono transition-all hover:bg-radar-panel/30 hover:border-radar-green/50"
            >
              <Clock className="w-4 h-4 text-radar-amber" />
            </button>
          )}
          {status === 'running' && (
            <span className="text-xs font-mono text-radar-amber">
              {currentCount} results...
            </span>
          )}
          {status === 'completed' && (
            <span className="text-xs font-mono text-radar-green">
              {leads.length} total
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search filter */}
          <input
            type="text"
            placeholder="Filter results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-radar-panel border border-radar-border rounded px-3 py-1.5 text-xs font-mono text-radar-text placeholder:text-radar-dim w-40"
          />
          {/* Email only toggle */}
          <button
            onClick={() => setShowEmailsOnly(!showEmailsOnly)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all',
              showEmailsOnly
                ? 'bg-radar-green/10 border-radar-green text-radar-green'
                : 'bg-radar-panel border-radar-border text-radar-muted hover:border-radar-green/50'
            )}
          >
            <Mail className="w-3 h-3" />
            Email only
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        {leads.length === 0 && !isLoading && status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-20 text-radar-dim">
            <div className="w-16 h-16 rounded-full border border-radar-border flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="font-mono text-sm text-radar-muted">No results yet</p>
            <p className="text-xs text-radar-dim mt-1">Configure your search and initiate a scrape</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="w-12 h-12 mb-3" />
            <p className="font-mono text-sm">Scrape failed</p>
            <p className="text-xs text-red-400/60 mt-1">{error || 'Unknown error'}</p>
          </div>
        )}

        {(filtered.length > 0 || isLoading) && (
          <table className="result-table">
            <thead className="sticky top-0 bg-radar-card z-10">
              <tr>
                <th className="w-8"></th>
                <th>Business</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && status === 'running' && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={`skel-${i}`} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <td><div className="w-4 h-4 shimmer rounded" /></td>
                      <td><div className="h-4 w-32 shimmer rounded" /></td>
                      <td><div className="h-4 w-40 shimmer rounded" /></td>
                      <td><div className="h-4 w-24 shimmer rounded" /></td>
                      <td></td>
                    </tr>
                  ))}
                </>
              )}

              {filtered.map((lead, i) => {
                const hasEmail = lead.email && lead.isEmail
                return (
                  <tr
                    key={`${lead.email}-${i}`}
                    className={cn(
                      'animate-fade-in cursor-pointer group',
                      expandedId === i && 'bg-radar-green/5'
                    )}
                    style={{ animationDelay: `${i * 30}ms` }}
                    onClick={() => setExpandedId(expandedId === i ? null : i)}
                  >
                    <td>
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        hasEmail ? 'bg-radar-green' : 'bg-radar-amber'
                      )} />
                    </td>
                    <td>
                      <span className="font-mono text-radar-text font-medium">{lead.title}</span>
                    </td>
                    <td>
                      {hasEmail ? (
                        <a
                          href={`mailto:${lead.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-sm text-radar-cyan hover:text-radar-green transition-colors"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="font-mono text-sm text-radar-dim italic">No email</span>
                      )}
                    </td>
                    <td>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-sm text-radar-muted hover:text-radar-cyan transition-colors"
                        >
                          {formatPhone(lead.phone)}
                        </a>
                      ) : (
                        <span className="font-mono text-sm text-radar-dim">—</span>
                      )}
                    </td>
                    <td>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {expandedId === i ? (
                          <ChevronUp className="w-4 h-4 text-radar-green" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-radar-muted" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}