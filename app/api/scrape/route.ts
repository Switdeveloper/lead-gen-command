import { NextRequest, NextResponse } from 'next/server'
import { startApifyRun } from '@/lib/apify'

export async function POST(req: NextRequest) {
  if (!process.env.APIFY_API_TOKEN) {
    return NextResponse.json({ error: 'APIFY_API_TOKEN not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { keywords, location, maxResults = 50 } = body

    if (!keywords || !location) {
      return NextResponse.json({ error: 'keywords and location required' }, { status: 400 })
    }

    const result = await startApifyRun({
      emailOnlyResults: true,
      location,
      query: keywords,
      maxResultsPerKeyword: maxResults,
      proxyConfiguration: { useApifyProxy: true },
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Scrape error:', err)
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 })
  }
}