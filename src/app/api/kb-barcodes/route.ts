import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[API] proxy -> http://app.antisoftlb.com/json.aspx?type=KBBarcode');
    const upstream = await fetch('http://app.antisoftlb.com/json.aspx?type=KBBarcode', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: `HTTP ${upstream.status}` }, { status: upstream.status });
    }

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json';
    return new NextResponse(text, { status: 200, headers: { 'content-type': contentType } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


