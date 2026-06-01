import { NextRequest, NextResponse } from 'next/server'
import { getRunStatus, getDatasetItems, calculateCost } from '@/lib/apify'
import { deduplicateLeads, filterWithEmails } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Apify API token required. Add it in Settings.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const runId = searchParams.get('runId')

  if (!runId) {
    return NextResponse.json({ error: 'runId required' }, { status: 400 })
  }

  try {
    const status = await getRunStatus(runId, token)

    if (status.status === 'running') {
      return NextResponse.json({
        status: 'running',
        currentCount: status.currentCount || 0,
      })
    }

    if (status.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: status.error,
      })
    }

    if (status.status === 'succeeded' && status.datasetId) {
      const leads = await getDatasetItems(status.datasetId, token)
      const allLeads = deduplicateLeads(leads)
      const withEmails = filterWithEmails(allLeads)
      const cost = calculateCost(allLeads.length)

      return NextResponse.json({
        status: 'completed',
        results: allLeads,
        stats: {
          total: allLeads.length,
          withEmails: withEmails.length,
          withoutEmails: allLeads.length - withEmails.length,
          cost,
          emailRate: allLeads.length > 0
            ? Math.round((withEmails.length / allLeads.length) * 100)
            : 0,
        },
      })
    }

    return NextResponse.json({ status: 'unknown', error: 'Unexpected state' })
  } catch (err) {
    console.error('Results error:', err)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}