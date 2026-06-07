import { getMarketData } from '@/lib/polygon';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 300;

export async function GET() {
  try {
    const data = await getMarketData();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('Market data error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
