import type { NextRequest } from 'next/server';

export function requestMeta(request: NextRequest) {
  return {
    ipAddress:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      null,
    userAgent: request.headers.get('user-agent'),
  };
}
