import { generateQSRBrief } from '@/lib/anthropic';
import { checkRateLimit } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'global';
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const brief = await generateQSRBrief();
    return NextResponse.json(
      { brief, generatedAt: new Date().toISOString() },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (err) {
    console.error('AI brief error:', err);
    return NextResponse.json(
      { error: 'Failed to generate brief. Check API key configuration.' },
      { status: 500 }
    );
  }
}
