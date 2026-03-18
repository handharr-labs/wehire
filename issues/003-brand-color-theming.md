# Issue #003 — Apply Company Brand Colors Dynamically

## Problem
Career page views use hardcoded `zinc-900`/`zinc-700` Tailwind classes. Company data already includes `primaryColor` and `secondaryColor` hex fields from Google Sheets that are not being used.

## Acceptance Criteria
- [ ] A `BrandThemeStyle` server component sets `--brand-primary` and `--brand-secondary` CSS custom properties for each company's page
- [ ] Invalid or missing hex values fall back to `#18181b` (zinc-900) and `#3f3f46` (zinc-700)
- [ ] `CareerPageView` header has a brand-color top border accent; job card hover border uses brand color
- [ ] `JobDetailView` "Apply Now" button uses brand primary/secondary colors
- [ ] `ApplyFormView` input focus rings and submit button use brand primary/secondary colors
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

## Approach
CSS custom properties injected via an inline `<style>` block rendered by a `BrandThemeStyle` server component in each page route. Views consume the variables via Tailwind arbitrary-value syntax (`bg-[var(--brand-primary)]`).
