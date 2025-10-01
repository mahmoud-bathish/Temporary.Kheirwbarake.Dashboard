import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API] proxy -> https://panel.kheirwbarake.com/api/getItemBarcode');
    const upstream = await fetch('https://panel.kheirwbarake.com/api/getItemBarcode', {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      // Prevent caching to always check latest
      cache: 'no-store',
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json';

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Proxy error' }, { status: 500 });
  }
}


