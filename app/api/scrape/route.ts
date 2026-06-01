import { NextRequest, NextResponse } from 'next/server'
import { startApifyRun } from '@/lib/apify'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Apify API token required. Add it in Settings.' }, { status: 401 })
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
    }, token)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Scrape error:', err)
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 })
  }
}