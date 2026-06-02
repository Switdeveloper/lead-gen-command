const ACTOR_ID = 'scraper-mind~google-maps-email-scraper-unlimited'
const ACTOR_ID_OLD = 'scraper-mind/google-maps-email-scraper-unlimited'

export interface ApifyRunInput {
  emailOnlyResults: boolean
  location: string
  query: string
  maxResultsPerKeyword?: number
  proxyConfiguration?: {
    useApifyProxy: boolean
  }
}

export interface ApifyLead {
  title: string
  phone: string
  email: string
  address: string
  url: string
  isEmail: boolean
  searchQuery: string
}

export interface ApifyRunResponse {
  runId: string
  status: 'started' | 'error'
  error?: string
}

export interface ApifyStatusResponse {
  status: 'running' | 'succeeded' | 'failed' | 'ready'
  currentCount?: number
  totalCount?: number
  datasetId?: string
  error?: string
}

export async function startApifyRun(input: ApifyRunInput, token: string): Promise<ApifyRunResponse> {
  const res = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ui: { runSyncWindowMs: 300000 }, input }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { runId: '', status: 'error', error: err }
  }

  const data = await res.json()
  return { runId: data.data.id, status: 'started' }
}

export async function getRunStatus(runId: string, token: string): Promise<ApifyStatusResponse> {
  const res = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    return { status: 'failed', error: 'Failed to fetch run status' }
  }

  const data = await res.json()
  const status = data.data.status

  if (status === 'running' || status === 'ready') {
    return {
      status: 'running',
      currentCount: data.data.stats?.actorRunsCount || 0,
    }
  }

  if (status === 'succeeded') {
    return {
      status: 'succeeded',
      datasetId: data.data.defaultDatasetId,
      totalCount: data.data.stats?.totalInputCountries || 0,
    }
  }

  return { status: 'failed', error: data.data.errorMessage || 'Run failed' }
}

export async function getDatasetItems(datasetId: string, token: string): Promise<ApifyLead[]> {
  const res = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&format=json`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) return []

  const items = await res.json()
  return items.map((item: Record<string, unknown>) => {
    // Handle scraped_emails array - take first email if available
    let email = ''
    let isEmail = false
    if (Array.isArray(item.scraped_emails) && item.scraped_emails.length > 0) {
      email = String(item.scraped_emails[0].email || '')
      isEmail = email.length > 0
    }

    return {
      title: String(item.name || item.title || ''),
      phone: String(item.phone || ''),
      email,
      address: String(item.full_address || item.address || ''),
      url: String(item.website || item.url || ''),
      isEmail,
      searchQuery: String(item.searchQuery || ''),
    }
  })
}

export function calculateCost(resultCount: number): number {
  return resultCount * 0.004
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}