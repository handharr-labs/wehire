# 007 · Implement subdomain routing middleware for branded career pages

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#7](https://github.com/handharr-labs/wehire/issues/7)

---

## Goal
Add Next.js middleware that rewrites branded subdomain requests (`companyname.wehire.app`) to the path-based `[slug]` route so existing pages work transparently.

---

## Changes
- `src/middleware.ts`: rewrite `{slug}.wehire.app/*` → `/{slug}/*`
- Skip rewrites for `_next/*`, `api/*`, static assets
- Config: `matcher` covering all non-internal routes

---

## Acceptance Criteria
- [ ] Middleware created at src/middleware.ts
- [ ] Requests to companyname.wehire.app are rewritten to /companyname internally
- [ ] Requests to companyname.wehire.app/jobs/123 are rewritten to /companyname/jobs/123
- [ ] Path-based routing (e.g. wehire.app/companyname) continues to work
- [ ] Middleware does not affect API routes or Next.js internals (_next/*)
- [ ] Documented in README or env setup docs how to configure the base domain
