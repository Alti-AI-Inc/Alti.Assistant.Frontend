import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const session = (req as any).auth;

  // Redirect logged-in super_admin (owner) to /admin if they try to access any non-admin route
  if (session?.user?.role === 'super_admin' && !nextUrl.pathname.startsWith('/admin')) {
    const allowedAuthPaths = ['/auth', '/accept-invite'];
    const isAllowedAuth = allowedAuthPaths.some(path => nextUrl.pathname.startsWith(path));
    if (!isAllowedAuth) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/accept-invite', '/auth', '/login', '/register', '/', '/studio'];
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
    const userTenants: Array<{ id: string; name: string; role: string }> = session.user.tenants || [];
    const isMember = userTenants.some((t: { id: string }) => t.id === tenantId);

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
