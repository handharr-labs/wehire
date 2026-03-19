// proxy.ts
// Handles two concerns:
// 1. Admin route guard — verifies HttpOnly JWT session for /admin/* paths
// 2. Subdomain proxy — rewrites subdomain requests to path-based routes
//
// acme.wehire.app          → /acme
// acme.wehire.app/jobs/1   → /acme/jobs/1
// acme.wehire.app/acme/jobs/1 → /acme/jobs/1  (double-prefix guard)
// wehire.app/acme          → /acme            (path-based, no rewrite)

import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from "next/server";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "wehire.app";
const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_ROUTE_RE = /^\/admin(\/|$)/;

async function getAdminJwtSecret(): Promise<Uint8Array> {
  return new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? '');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin route guard ---
  if (ADMIN_ROUTE_RE.test(pathname)) {
    if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    try {
      await jwtVerify(token, await getAdminJwtSecret());
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }
  }

  // --- Subdomain proxy ---
  const host = request.headers.get("host") ?? "";
  // Strip port for local dev (e.g. "acme.localhost:3000" → "acme.localhost")
  const hostname = host.split(":")[0];

  const isSubdomain =
    hostname.endsWith(`.${BASE_DOMAIN}`) &&
    hostname !== `www.${BASE_DOMAIN}`;

  if (!isSubdomain) {
    return NextResponse.next();
  }

  const slug = hostname.slice(0, hostname.length - BASE_DOMAIN.length - 1);

  // Double-prefix guard: ROUTES helpers already produce /${slug}/... paths,
  // so avoid rewriting again when the path already starts with the slug.
  const rewrittenPathname = pathname.startsWith(`/${slug}`)
    ? pathname
    : `/${slug}${pathname}`;

  const url = request.nextUrl.clone();
  url.pathname = rewrittenPathname;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - common static file extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
