import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// Security headers applied to all responses
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const session = (req as any).auth;

  // Public routes that don't require authentication
  const publicRoutes = ['/accept-invite', '/auth', '/login', '/register', '/'];
  const isPublicRoute = publicRoutes.some(route =>
    route === '/'
      ? nextUrl.pathname === '/'
      : nextUrl.pathname.startsWith(route),
  );

  // Allow public routes
  if (isPublicRoute) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Check authentication
  if (!session?.user) {
    return applySecurityHeaders(NextResponse.redirect(new URL('/', req.url)));
  }

  // Check for organization-specific routes
  const orgRouteMatch = nextUrl.pathname.match(/^\/organizations\/([^\/]+)/);

  if (orgRouteMatch) {
    const tenantId = orgRouteMatch[1];

    // Skip validation for static organization routes
    if (tenantId === 'create' || tenantId === 'dashboard') {
      return applySecurityHeaders(NextResponse.next());
    }

    // Validate tenant membership
    const userTenants: Array<{ id: string; name: string; role: string }> = session.user.tenants || [];
    const isMember = userTenants.some((t: { id: string }) => t.id === tenantId);

    if (!isMember) {
      // User is not a member of this tenant, redirect to organizations list
      return applySecurityHeaders(NextResponse.redirect(new URL('/organizations', req.url)));
    }
  }

  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
