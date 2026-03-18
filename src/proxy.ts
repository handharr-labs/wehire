// proxy.ts
// Rewrites subdomain requests to path-based routes.
// Driven by NEXT_PUBLIC_BASE_DOMAIN (e.g. "wehire.app").
//
// acme.wehire.app          → /acme
// acme.wehire.app/jobs/1   → /acme/jobs/1
// acme.wehire.app/acme/jobs/1 → /acme/jobs/1  (double-prefix guard)
// wehire.app/acme          → /acme            (path-based, no rewrite)

import { NextRequest, NextResponse } from "next/server";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "wehire.app";

export function proxy(request: NextRequest) {
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
  const { pathname } = request.nextUrl;

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
