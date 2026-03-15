# 003 · Apply company brand colors dynamically on career pages

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#3](https://github.com/handharr-labs/wehire/issues/3)

---

## Goal
Replace hardcoded `zinc-900` colors on career pages with dynamic brand colors from the Company entity's `primaryColor` and `secondaryColor` fields.

---

## Changes
- Career page (`[slug]`): inject brand colors via CSS custom properties or inline styles
- Job detail page (`[slug]/jobs/[jobId]`): same
- Apply form page: same
- Fallback to sensible defaults if colors are absent

---

## Acceptance Criteria
- [ ] Career page ([slug]) applies company primaryColor and secondaryColor
- [ ] Job detail page ([slug]/jobs/[jobId]) applies brand colors
- [ ] Apply form page applies brand colors
- [ ] Implementation uses CSS custom properties or inline styles (no hardcoded values)
- [ ] Falls back to a sensible default if primaryColor/secondaryColor are absent
