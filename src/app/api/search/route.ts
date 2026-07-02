import { NextResponse, type NextRequest } from 'next/server';
import { searchContent } from '@/lib/search';
import { getSiteSettings } from '@/lib/services/site-settings.service';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? '';
  const settings = await getSiteSettings();
  const results = query ? await searchContent(query, settings.mode) : [];
  return NextResponse.json({ results });
}
