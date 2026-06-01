import { NextResponse } from 'next/server'

export async function GET() {
  // $5 free credit, track usage via localStorage on client
  // Server-side credit check requires Apify account API - not needed for $5 free tier
  return NextResponse.json({
    total: 5.0,
    remaining: 5.0, // Client tracks usage via stats
    costPerResult: 0.004,
  })
}