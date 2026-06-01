'use client'

import { useState } from 'react'
import { Download, Copy, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import { ApifyLead } from '@/lib/apify'
import { leadsToCSV, downloadCSV, generateFilename, cn } from '@/lib/utils'

interface ExportBarProps {
  leads: ApifyLead[]
  keywords: string
  location: string
  onClear: () => void
}

export default function ExportBar({ leads, keywords, location, onClear }: ExportBarProps) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const withEmails = leads.filter((l) => l.email && l.isEmail)

  const handleExportCSV = () => {
    setExporting(true)
    const csv = leadsToCSV(leads)
    const filename = generateFilename(location || 'leads', keywords || 'search')
    downloadCSV(csv, filename)
    setTimeout(() => setExporting(false), 500)
  }

  const handleCopyEmails = () => {
    const emails = withEmails.map((l) => l.email).filter(Boolean).join('\n')
    navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (leads.length === 0) return null

  return (
    <div className="bracket-card bg-radar-card border border-radar-border rounded p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-radar-muted">
            <span className="text-radar-text font-bold">{leads.length}</span> results
          </span>
          <span className="text-radar-dim">|</span>
          <span className="text-radar-green">
            <span className="text-radar-text font-bold">{withEmails.length}</span> with emails
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyEmails}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono border transition-all',
              copied
                ? 'bg-radar-green/10 border-radar-green text-radar-green'
                : 'bg-radar-panel border-radar-border text-radar-muted hover:border-radar-cyan hover:text-radar-cyan'
            )}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Emails'}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono bg-radar-green/10 border border-radar-green text-radar-green hover:bg-radar-green/20 transition-all disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export CSV
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}