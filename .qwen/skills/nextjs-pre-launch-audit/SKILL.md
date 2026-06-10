---
name: nextjs-pre-launch-audit
description: Structured full-stack audit checklist for Next.js 14 apps before production launch — configs, auth, API routes, components, security, build, dependencies
source: auto-skill
extracted_at: '2026-06-10T00:00:00.000Z'
---

# Next.js Pre-Launch Audit (LEVIATANO Method)

Systematic methodology for auditing a Next.js application before production deployment. Produces a prioritized verdict report with CRITICAL/MEDIUM/LOW findings.

## Audit Order (read files in this sequence)

### Phase 1: Configuration Layer
Read in parallel:
- `package.json` — check scripts (dev/build/start), all dependencies, devDependencies
- `next.config.js` — experimental flags, webpack overrides, external packages
- `tsconfig.json` — strict mode, path aliases, moduleResolution
- `.env.example` — exposed variables, placeholder secrets
- `.env` / `.env.local` — **CRITICAL: check for default/placeholder secrets**
- `prisma/schema.prisma` — models, relations, cascade deletes, provider
- `middleware.ts` — route protection matcher, auth middleware
- `.gitignore` — verify env files, DB files, .next are excluded

### Phase 2: Shared Libraries
Read in parallel:
- `src/lib/auth.ts` — NextAuth config, providers, callbacks, session strategy
- `src/lib/prisma.ts` — singleton pattern, global caching
- `src/lib/utils.ts` — utility functions
- `src/types/index.ts` — type definitions

### Phase 3: API Routes (all of them)
Read every route file in parallel:
- Auth routes (`[...nextauth]`, register, login, logout)
- CRUD routes (invoices, clients — GET/POST/PUT/DELETE)
- Specialized routes (PDF generation, stats)
- **Check each route for:** auth guard (`getServerSession`), input validation (Zod), ownership check (`userId`), error masking

### Phase 4: Frontend Components
Read all page.tsx, layout.tsx, and shared components:
- Login/Register page
- Dashboard layout + overview
- CRUD pages (list, create, edit, detail)
- ProtectedRoute component
- Form components (InvoiceForm, ClientManager)

### Phase 5: PDF/Export Templates
Read all template files — verify they match the route references exactly (naming mismatch = runtime crash).

### Phase 6: Security Checks
1. **NEXTAUTH_SECRET** — must NOT be the default placeholder
2. **Password hashing** — bcrypt cost factor (≥10 acceptable, 12 good)
3. **Auth guard consistency** — every protected API route calls `getServerSession`
4. **Ownership enforcement** — every resource access checks `userId === session.user.id`
5. **Input validation** — Zod schema on every POST/PUT route
6. **CSRF protection** — JWT strategy with NextAuth is partially immune, but check mutate routes
7. **Error information disclosure** — bare `catch {}` that mask errors (good for prod)
8. **Hardcoded credentials** — search seed files and console.log statements for passwords

### Phase 7: Build & Dependencies
```bash
npm install           # verify clean install
npx prisma generate   # verify client generation
npx tsc --noEmit      # TypeScript type-check (must pass 0 errors)
npm run build         # production build (must succeed)
npm audit             # vulnerability scan
```

## Common Findings to Look For

| Category | What to check |
|---|---|
| Secrets | `NEXTAUTH_SECRET`, hardcoded API keys, database URLs |
| Auth bypass | Missing `getServerSession`, missing `userId` ownership check |
| Race conditions | Client-side ID generation (invoice numbers, order numbers) |
| Template mismatch | PDF/export template names in route vs. on disk |
| Dependency rot | Next.js CVEs, outdated auth libraries |
| Seed/data leaks | Passwords printed in console, demo credentials in source |
| Route protection | Middleware matcher vs. per-route auth guard (both should exist) |
| Orphaned references | Import paths that reference files that don't exist |

## Build Failure Diagnosis

If `npm run build` crashes with "Bus error" or SIGBUS:
- Test the SWC binary directly: `node -e "require('@next/swc-linux-x64-gnu')"`
- Check CPU flags: `cat /proc/cpuinfo | grep flags` — Celeron N3060 lacks AVX, may not support some SWC builds
- If SWC is the culprit, the code is fine; build on a different machine or use Babel fallback
- Free RAM before retrying: Firefox is typically 500-800 MB, drop kernel caches

## Output Format

The audit report should include:
1. **Executive summary table** — code quality, security, performance, completeness, TypeScript, build, dependencies
2. **CRITICAL findings** — show exact file paths and line content for each issue
3. **MEDIUM findings** — what's wrong and the fix
4. **Strengths** — what's done well (don't just report problems)
5. **Test plan** — specific URLs to visit for manual validation
6. **Pre-launch action items** — prioritized table of fixes
7. **CONFIDENCE score** — X/100
