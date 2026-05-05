# Christophers-Next-MUI-Template

A public Next.js 15 starter template with TypeScript, Material UI 5 + Emotion, Prisma + PostgreSQL, and NextAuth.js (credentials).

**Sibling repo:** `../Christophers-Next-Template` is the Tailwind variant. The two are kept in feature parity except for styling — when making structural changes here (auth, middleware, tooling, tests, scripts, configs), consider whether the same change applies there.

## Tech Stack

- Next.js 15.3 (App Router, Turbopack dev)
- React 19, TypeScript 5.8 (strict)
- Material UI 5.15 + `@emotion/react` + `@emotion/styled` + `@mui/icons-material`
- Custom MUI theme at `theme.ts` (root) — dark mode, primary `#20cb91`
- Prisma 6 + PostgreSQL
- NextAuth.js 4 (Credentials provider, bcryptjs)
- Jest + React Testing Library
- Playwright (E2E)
- Yarn 1.x, Node 22 LTS (pinned in `.nvmrc`)

## Project Layout

```
theme.ts         # MUI theme — dark palette, typography (Geist), component overrides
src/
  app/           # App Router pages + API routes (auth, sign-up)
  components/    # Spinner, Providers (wraps SessionProvider + MUI ThemeProvider)
  lib/           # auth.ts (NextAuth config), prisma.ts (singleton client)
  hooks/         # custom React hooks
  utilities/     # helper functions
  types/         # next-auth.d.ts and other ambient types
  middleware.ts  # route protection / auth redirects
prisma/          # schema.prisma + migrations
e2e/             # Playwright specs
```

## Path Aliases (tsconfig + jest)

- `@/*` → `src/*`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utilities/*`

## Commands

- `yarn dev` — Next dev (Turbopack); runs `prisma generate` first
- `yarn build` — production build; runs `prisma generate` first
- `yarn start` — production server
- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`
- `yarn type-check` — `tsc --noEmit`
- `yarn test` / `yarn test:watch`
- `yarn test:e2e` — Playwright
- `yarn clean` — lint:fix + format:fix + `prettier --write .`
- `yarn prisma:migrate` — `prisma migrate deploy`
- `yarn nuke` — wipe `node_modules` and rebuild

## Code Style

- **Prettier:** no semicolons, single quotes, 80-char width, 2-space tabs, no trailing commas. Don't fight this — it's enforced via lint.
- **ESLint:** strict — `no-unused-vars`, `no-explicit-any`, `ban-ts-comment` are errors. Imports must be alphabetized.
- React 19 / hooks only. No class components.

## Conventions

- **Tests are co-located:** `Foo.tsx` lives next to `Foo.test.tsx`. There is no `__tests__/` directory.
- API route handlers in `src/app/api/.../route.ts` follow App Router conventions.
- Use MUI primitives (`Box`, `Typography`, `Button`, `Stack`, etc.) directly. Custom wrappers should be rare and justified.
- MUI components use `'use client'` because Emotion runs in the client. The root `Providers` component handles theme + session injection.
- For styling, prefer `sx` prop or `styled()` over inline `style`. Match theme via the palette/spacing/typography tokens (`theme.palette.primary.main`, `theme.spacing(2)`, etc.).

## Auth & Middleware

- NextAuth Credentials provider; passwords hashed with bcryptjs; JWT sessions.
- `src/middleware.ts` behavior:
  - `/dashboard/*` → requires auth (redirects unauth users to `/sign-in?callbackUrl=...`)
  - `/sign-in` and `/sign-up` → redirect authed users to `/dashboard`
  - `/` → public for everyone (no redirect even if authed)

## Env

Copy `.env.local.example` → `.env.local`:

- `DATABASE_PUBLIC_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`

## Fonts

Geist Sans + Geist Mono are loaded via `next/font/google` in `src/app/layout.tsx` and applied to `<body>`. The CSS var `--font-geist-sans` is wired into the MUI theme at `theme.ts`:

```ts
typography: { fontFamily: 'var(--font-geist-sans)', ... }
```

This is **required** — without the theme wiring, MUI components fall back to the default Roboto regardless of body className.

## What NOT to do

- Don't reintroduce a `__tests__/` directory — co-locate.
- Don't add Co-Authored-By lines to commits.
- Don't drift from the Tailwind sibling repo on auth/middleware/scripts/configs without intentional reason.
- Don't reach for Roboto or system fonts — the theme is wired to Geist.
- Don't commit `.env*` files (only `.env.local.example` is allow-listed).
