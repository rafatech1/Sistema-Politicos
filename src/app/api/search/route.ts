import { NextResponse, type NextRequest } from 'next/server';
import { searchContent } from '@/lib/search';
import { getSiteSettings } from '@/lib/services/site-settings.service';
import { isSearchRateLimited } from '@/lib/search/search-rate-limit';
import { jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function GET(request: NextRequest) {
  const { ipAddress } = requestMeta(request);
  if (isSearchRateLimited(ipAddress)) {
    return jsonError('Muitas buscas em pouco tempo. Tente novamente em instantes.', 429);
  }

  const query = request.nextUrl.searchParams.get('q') ?? '';
  const settings = await getSiteSettings();
  const results = query ? await searchContent(query, settings.mode) : [];
  return NextResponse.json({ results });
}
