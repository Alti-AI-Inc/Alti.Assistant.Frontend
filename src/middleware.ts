import { auth } from '@/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();

  // Public routes that don't require authentication
  const publicRoutes = ['/accept-invite', '/'];
  const isPublicRoute = publicRoutes.some(route =>
    route === '/'
      ? nextUrl.pathname === '/'
      : nextUrl.pathname.startsWith(route),
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check authentication
  if (!session?.user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check for organization-specific routes
  const orgRouteMatch = nextUrl.pathname.match(/^\/organizations\/([^\/]+)/);

  if (orgRouteMatch) {
    const tenantId = orgRouteMatch[1];

    // Skip validation for static organization routes
    if (tenantId === 'create' || tenantId === 'dashboard') {
      return NextResponse.next();
    }

    // Validate tenant membership
    const userTenants = session.user.tenants || [];
    const isMember = userTenants.some(t => t.id === tenantId);

    if (!isMember) {
      // User is not a member of this tenant, redirect to organizations list
      return NextResponse.redirect(new URL('/organizations', req.url));
    }
  }

  return NextResponse.next();
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
