# Øditr — Pre-launch Waitlist Landing Page

## Original Problem Statement
Premium pre-launch waitlist landing page for Øditr (pronounced "Auditor", Ø replaces O everywhere). Strict monochrome, typography-driven, Apple-level simplicity. Performance Intelligence brand for web developers and performance engineers.

## User Personas
- Web developers, frontend engineers, performance engineers
- Technical founders, SaaS builders, website optimization enthusiasts

## Core Requirements (Static)
- Strict monochrome palette: #FFFFFF, #0A0A0A, #666666, #EAEAEA, #111111
- No gradients, neon, glassmorphism
- Massive typography hero with Øditr wordmark
- Geist + Geist Mono fonts
- Atmospheric low-opacity floating tech keywords (LCP, CLS, INP, TTFB, etc.)
- Floating minimal nav (Product, Vision, Roadmap, Docs, Join Waitlist)
- Primary CTA "Join Waitlist", Secondary "See Vision"
- Live developer count from MongoDB
- Lenis smooth scroll + framer-motion fades

## Architecture
- Backend: FastAPI + Motor (async MongoDB), routes prefixed /api
  - GET /api/ — health
  - POST /api/waitlist — join (idempotent on email)
  - GET /api/waitlist/count — live count
- Frontend: React 19 + react-router + Tailwind + framer-motion + Lenis
  - Single Landing page at /

## Implemented (2026-06)
- Backend waitlist API (email validation, dedup by lowercase email, position tracking)
- Frontend landing with: floating nav, hero (massive Øditr wordmark + atmosphere), problem, flow (Audit→Prioritize→Understand→Fix→Monitor), vision (5 pillars), 6 capability tiles, waitlist form with live count, footer
- Geist fonts via Google Fonts, Lenis smooth scroll
- Pytest backend tests + Playwright e2e in /app/backend/tests/

## Backlog (P0 → P2)
- P1: Admin endpoint to export waitlist emails (CSV)
- P1: Rate limiting on POST /api/waitlist
- P2: OG/Twitter share image generation for Øditr brand
- P2: Founder note / FAQ section if requested
