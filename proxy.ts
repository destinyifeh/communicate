import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reserved subdomains that cannot be used by businesses
const RESERVED_SUBDOMAINS = [
  'admin', 'api', 'app', 'www', 'mail', 'ftp', 'portal', 'dashboard',
  'login', 'signup', 'auth', 'static', 'assets', 'cdn', 'support',
  'help', 'billing', 'docs', 'blog', 'status', 'dev', 'staging', 'test', 'demo', 'sandbox'
];

/**
 * Extract subdomain from hostname
 */
function getSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    if (subdomain && subdomain !== 'www' && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain !== 'www' && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

/**
 * Get the base domain
 */
function getBaseDomain(host: string): string {
  const hostname = host.split(':')[0];
  const port = host.includes(':') ? `:${host.split(':')[1]}` : '';

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `localhost${port}`;
  }

  if (hostname.endsWith('.localhost')) {
    return `localhost${port}`;
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts.slice(-2).join('.') + port;
  }

  return host;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const pathname = request.nextUrl.pathname;
  const subdomain = getSubdomain(host);
  const protocol = request.nextUrl.protocol.replace(':', '');

  // Check if user is authenticated (has access_token cookie)
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;
   console.log(accessToken, 'accccce')
  // Static assets and API routes - allow from anywhere
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    const response = NextResponse.next();
    if (subdomain) {
      response.headers.set('x-subdomain', subdomain);
    }
    return response;
  }

  // Auth pages - redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Debug: log auth check for auth routes
  if (isAuthRoute) {
    console.log('[PROXY]', pathname, '| accessToken:', accessToken ? 'present' : 'missing', '| isAuthenticated:', isAuthenticated);
  }

  if (isAuthRoute && isAuthenticated) {
    // User is logged in, redirect to portal
    const url = new URL(`${protocol}://${host}/portal`);
    return NextResponse.redirect(url);
  }

  // Public marketing pages (landing, terms, privacy, pricing)
  const publicRoutes = ['/', '/terms', '/privacy', '/pricing'];

  // Main domain only routes (marketing, auth pages)
  // These should ONLY be accessible from the main domain, not subdomains
  const mainDomainRoutes = [...publicRoutes, ...authRoutes];
  const isMainDomainRoute = mainDomainRoutes.includes(pathname);

  if (isMainDomainRoute) {
    if (subdomain) {
      // Redirect to main domain - subdomains should only access /portal/*
      const baseDomain = getBaseDomain(host);
      const url = new URL(`${protocol}://${baseDomain}${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }
    // On main domain - allow access
    return NextResponse.next();
  }

  // Admin routes - only allow from main domain (no subdomain) and require auth
  if (pathname.startsWith('/admin')) {
    if (subdomain) {
      // Redirect to main domain
      const baseDomain = getBaseDomain(host);
      const url = new URL(`${protocol}://${baseDomain}${pathname}`);
      return NextResponse.redirect(url);
    }
    if (!isAuthenticated) {
      // Not logged in - redirect to login
      const url = new URL(`${protocol}://${host}/login`);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Portal routes - require authentication
  if (pathname.startsWith('/portal')) {
    if (!isAuthenticated) {
      // Not logged in - redirect to login
      const baseDomain = getBaseDomain(host);
      const url = new URL(`${protocol}://${baseDomain}/login`);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Logged in - allow access and pass subdomain info if present
    const response = NextResponse.next();
    if (subdomain) {
      response.headers.set('x-subdomain', subdomain);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
