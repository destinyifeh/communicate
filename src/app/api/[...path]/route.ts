import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function proxyRequest(request: NextRequest, path: string) {
  const url = new URL(path, BACKEND_URL);

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  // Build headers, forwarding cookies
  const headers = new Headers();
  headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');

  // Forward cookies to backend
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }

  // Also forward as Authorization header for JWT guard
  const accessToken = request.cookies.get('access_token')?.value;
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Forward other relevant headers
  const forwardHeaders = ['accept', 'accept-language', 'user-agent'];
  forwardHeaders.forEach((header) => {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  });

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
    });

    // Get response body
    const responseBody = await response.text();

    // Create response with same status and headers
    const proxyResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant response headers, including Set-Cookie
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['transfer-encoding', 'connection', 'keep-alive'].includes(lowerKey)) {
        // For Set-Cookie, we need to handle it specially to ensure it's forwarded
        if (lowerKey === 'set-cookie') {
          proxyResponse.headers.append(key, value);
        } else {
          proxyResponse.headers.set(key, value);
        }
      }
    });

    return proxyResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to connect to backend' } },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, `/api/${path.join('/')}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, `/api/${path.join('/')}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, `/api/${path.join('/')}`);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, `/api/${path.join('/')}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, `/api/${path.join('/')}`);
}
