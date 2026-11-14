/**
 * Next.js App Router RBAC Edge Middleware (middleware.ts)
 * Intercepts requests to /admin/* and /api/admin/*, validates HttpOnly JWT session cookies,
 * verifies role privileges ('super_admin' | 'admin' | 'staff'), and blocks unauthorized access
 * before any protected page or API route executes.
 */

export interface NextRequestLike {
  nextUrl: {
    pathname: string;
    clone: () => URL;
  };
  url: string;
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
  headers: Headers;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

const ALLOWED_ADMIN_ROLES = new Set(['super_admin', 'admin', 'staff']);

function decodeJwtPayload(token: string): { sub?: string; role?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const parsed = JSON.parse(json);
    if (parsed.exp && Date.now() / 1000 > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequestLike): Response | undefined {
  const { pathname } = request.nextUrl;
  const accessCookie = request.cookies.get('nextgen_access_token')?.value;
  const refreshCookie = request.cookies.get('nextgen_refresh_token')?.value;

  const isApiRoute = pathname.startsWith('/api/admin');

  if (!accessCookie && !refreshCookie) {
    if (isApiRoute) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing HttpOnly admin session cookie.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const loginUrl = new URL('/?tab=admin&auth=required', request.url);
    return Response.redirect(loginUrl, 307);
  }

  const payload = accessCookie ? decodeJwtPayload(accessCookie) : null;
  if (payload && (!payload.role || !ALLOWED_ADMIN_ROLES.has(payload.role))) {
    if (isApiRoute) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: Insufficient RBAC role privilege.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const homeUrl = new URL('/?error=forbidden', request.url);
    return Response.redirect(homeUrl, 307);
  }

  // Forward request with verified context
  return undefined;
}
