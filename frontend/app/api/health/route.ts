import { NextResponse } from 'next/server';

// Liveness/readiness probe for uptime monitors (UptimeRobot, k8s, Vercel).
// Reports the web tier status and the reachability of the backend API so a
// single GET surfaces the whole request path.
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  const startedAt = Date.now();
  let backend: 'up' | 'down' | 'unknown' = 'unknown';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_URL}/`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    backend = res.ok ? 'up' : 'down';
  } catch {
    backend = 'down';
  }

  const body = {
    status: backend === 'down' ? 'degraded' : 'ok',
    service: 'internbridge-web',
    uptimeMs: Math.round(process.uptime() * 1000),
    backend,
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: backend === 'down' ? 503 : 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
