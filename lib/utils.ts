import { ApifyLead } from './apify'

export function deduplicateLeads(leads: ApifyLead[]): ApifyLead[] {
  const seen = new Set<string>()
  return leads.filter((lead) => {
    const key = lead.email.toLowerCase() || lead.title.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function filterWithEmails(leads: ApifyLead[]): ApifyLead[] {
  return leads.filter((lead) => lead.email && lead.email.length > 0 && lead.isEmail)
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function cleanAddress(address: string): string {
  return address.replace(/\s*View all\s*$/i, '').trim()
}

export function leadsToCSV(leads: ApifyLead[]): string {
  const headers = ['Business Name', 'Email', 'Phone', 'Address', 'Website']
  const rows = leads.map((lead) => [
    `"${lead.title.replace(/"/g, '""')}"`,
    lead.email || '',
    lead.phone || '',
    `"${cleanAddress(lead.address).replace(/"/g, '""')}"`,
    lead.url || '',
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function getEmailDomain(email: string): string {
  const parts = email.split('@')
  return parts[1] || ''
}

export function generateFilename(location: string, keywords: string): string {
  const loc = location.replace(/[^a-zA-Z0-9]/g, '_')
  const kw = keywords.replace(/[^a-zA-Z0-9]/g, '_')
  const ts = new Date().toISOString().slice(0, 10)
  return `${loc}_${kw}_${ts}.csv`
}

export function getAreaCode(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 3) return digits.slice(0, 3)
  return ''
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}