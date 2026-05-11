import type { Session } from 'next-auth'

interface SessionUserOverrides {
  id?: string
  email?: string | null
  name?: string | null
  image?: string | null
  emailVerified?: string | null
  createdAt?: string
  updatedAt?: string
}

/** Returns a fully-populated NextAuth session user with sensible defaults. */
export function makeSessionUser(overrides: SessionUserOverrides = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: null,
    image: null,
    emailVerified: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides
  }
}

/** Builds a NextAuth {@link Session} with an embedded {@link makeSessionUser}. */
export function makeSession(
  overrides: { user?: SessionUserOverrides; expires?: string } = {}
): Session {
  return {
    user: makeSessionUser(overrides.user),
    expires: overrides.expires ?? '2099-01-01T00:00:00.000Z'
  } as Session
}

export interface UserRecord {
  id: string
  email: string
  password: string
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

/** Builds a Prisma-shaped User row (with `Date` timestamps) for DB-level tests. */
export function makeUser(overrides: Partial<UserRecord> = {}): UserRecord {
  const now = new Date('2026-01-01T00:00:00.000Z')
  return {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed-password',
    emailVerified: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  }
}
