# MAMA STORE Rose Chrome Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a polished, branded glass-and-3D MAMA STORE homepage that retains practical shopping and WhatsApp ordering.

**Architecture:** Replace the home-page composition with focused presentation components and extend the global design tokens. The existing catalog, product-card, cart, and routing interfaces remain unchanged.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS, existing Three.js dependency.

**Spec:** `docs/superpowers/specs/2026-09-07-mama-store-rose-chrome-design.md`

## Global Constraints

- Preserve routes and catalog data contracts.
- Use a local SVG logo; add no external asset dependency.
- Keep effects motion-safe and keyboard accessible.
- Build and inspect desktop and mobile homepage renders.

---

### Task 1: Add the MAMA STORE identity component

**Files:**
- Create: `src/components/brand/MamaLogo.tsx`
- Test: `src/components/brand/MamaLogo.test.tsx`

**Interfaces:**
- Produces: `MamaLogo({ inverse?: boolean, compact?: boolean }): JSX.Element`

- [ ] Write a failing test that asserts the logo exposes the MAMA STORE accessible label and an SVG mark.
- [ ] Run the focused test and confirm it fails because the component does not exist.
- [ ] Create the SVG monogram and wordmark with a title and responsive variants.
- [ ] Run the focused test and confirm it passes.

### Task 2: Establish the Rose Chrome shell

**Files:**
- Modify: `src/app/globals.css`
- Test: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: global CSS tokens
- Produces: glass utilities, hero layout, responsive motion rules

- [ ] Write a failing token test for the rose-chrome color and reduced-motion rule.
- [ ] Run the test and confirm it fails against the current styles.
- [ ] Add scoped tokens and responsive utility rules without changing catalog component contracts.
- [ ] Run the test and confirm it passes.

### Task 3: Recompose the homepage

**Files:**
- Modify: `src/app/page.tsx`
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: `MamaLogo`, `categories`, `bestsellers`, `offers`, `ProductGrid`, existing WhatsApp helper
- Produces: accessible homepage landmark structure and main CTAs

- [ ] Write a failing page test for the custom brand label, Shop collection and WhatsApp order links.
- [ ] Run the test and confirm it fails with the current page.
- [ ] Replace the effect-heavy composition with hero, trust strip, category cards, bestsellers and offers.
- [ ] Run the test and confirm it passes.

### Task 4: Verify the integrated experience

**Files:**
- Modify: `src/app/layout.tsx` only if required to apply the logo or metadata

- [ ] Run lint/type checks and a production build.
- [ ] Start the application and inspect the homepage at desktop and mobile widths.
- [ ] Fix build, console, overflow, contrast, or interaction failures found by inspection.
- [ ] Re-run production build and final visual inspection.
