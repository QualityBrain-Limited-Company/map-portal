// app/api/gistda/reverse-geocode/route.ts
import { NextResponse } from 'next/server'
import { GISTDA_CONFIG } from '@/app/lib/config/gistda'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing coordinates' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${GISTDA_CONFIG.API_BASE_URL}/services/geo/address?lon=${lng}&lat=${lat}&local=t&key=${GISTDA_CONFIG.API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error('GISTDA API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch address data' },
      { status: 500 }
    )
  }
}