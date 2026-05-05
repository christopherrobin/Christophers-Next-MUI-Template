/**
 * @jest-environment node
 */
import { compare } from 'bcryptjs'
import type { JWT } from 'next-auth/jwt'

import { authOptions } from './auth'
import { prisma } from './prisma'

import { makeUser } from '@/test-utils/factories'

jest.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: jest.fn(), create: jest.fn() } }
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}))

const mockedFindUnique = jest.mocked(prisma.user.findUnique)
const mockedCompare = jest.mocked(compare)

const credentialsProvider = authOptions.providers[0] as unknown as {
  options: {
    authorize: (
      credentials: Record<'email' | 'password', string> | undefined
    ) => Promise<unknown>
  }
}
const authorize = credentialsProvider.options.authorize
const jwtCallback = authOptions.callbacks!.jwt!
const sessionCallback = authOptions.callbacks!.session!

describe('authOptions.authorize', () => {
  it('throws when credentials are missing', async () => {
    await expect(authorize(undefined)).rejects.toThrow(
      'Missing email or password'
    )
  })

  it('throws when only email is provided', async () => {
    await expect(authorize({ email: 'a@b.com', password: '' })).rejects.toThrow(
      'Missing email or password'
    )
  })

  it('throws when only password is provided', async () => {
    await expect(authorize({ email: '', password: 'pw' })).rejects.toThrow(
      'Missing email or password'
    )
  })

  it('throws Invalid email or password when prisma returns null', async () => {
    mockedFindUnique.mockResolvedValueOnce(null)
    await expect(
      authorize({ email: 'a@b.com', password: 'pw' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('throws Invalid email or password when bcrypt compare fails', async () => {
    mockedFindUnique.mockResolvedValueOnce(makeUser())
    mockedCompare.mockResolvedValueOnce(false as never)
    await expect(
      authorize({ email: 'a@b.com', password: 'wrong' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('returns a sanitized user when credentials are valid', async () => {
    const user = makeUser({
      id: 'user-9',
      email: 'valid@example.com',
      emailVerified: new Date('2026-02-01T00:00:00.000Z'),
      createdAt: new Date('2026-01-15T00:00:00.000Z'),
      updatedAt: new Date('2026-03-01T00:00:00.000Z')
    })
    mockedFindUnique.mockResolvedValueOnce(user)
    mockedCompare.mockResolvedValueOnce(true as never)

    const result = await authorize({
      email: 'valid@example.com',
      password: 'pw'
    })

    expect(result).toEqual({
      id: 'user-9',
      email: 'valid@example.com',
      createdAt: '2026-01-15T00:00:00.000Z',
      emailVerified: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    })
  })

  it('returns null emailVerified when the user has not verified', async () => {
    const user = makeUser({ emailVerified: null })
    mockedFindUnique.mockResolvedValueOnce(user)
    mockedCompare.mockResolvedValueOnce(true as never)

    const result = (await authorize({
      email: 'a@b.com',
      password: 'pw'
    })) as { emailVerified: string | null }

    expect(result.emailVerified).toBeNull()
  })
})

describe('authOptions.callbacks.jwt', () => {
  it('copies user fields onto the token on initial sign-in', async () => {
    const token = { sub: 'user-1' } as JWT
    const user = {
      id: 'user-1',
      email: 'a@b.com',
      emailVerified: '2026-02-01T00:00:00.000Z',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    }

    const result = await jwtCallback({
      token,
      user,
      account: null,
      trigger: 'signIn'
    })

    expect(result).toMatchObject({
      sub: 'user-1',
      emailVerified: '2026-02-01T00:00:00.000Z',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    })
  })

  it('returns the token unchanged on subsequent calls', async () => {
    const token = {
      sub: 'user-1',
      emailVerified: '2026-02-01T00:00:00.000Z',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    } as JWT

    const result = await jwtCallback({
      token,
      user: undefined as never,
      account: null,
      trigger: 'update'
    })

    expect(result).toEqual(token)
  })
})

describe('authOptions.callbacks.session', () => {
  it('throws when token has no sub', async () => {
    await expect(
      sessionCallback({
        session: {
          user: { email: 'a@b.com' },
          expires: '2099'
        } as never,
        token: {} as JWT,
        user: undefined as never,
        newSession: undefined,
        trigger: 'update'
      })
    ).rejects.toThrow('No user found')
  })

  it('mirrors token fields onto session.user when sub is present', async () => {
    const result = await sessionCallback({
      session: {
        user: { email: 'a@b.com' },
        expires: '2099'
      } as never,
      token: {
        sub: 'user-1',
        emailVerified: '2026-02-01T00:00:00.000Z',
        createdAt: '2026-01-15T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z'
      } as JWT,
      user: undefined as never,
      newSession: undefined,
      trigger: 'update'
    })

    expect(result.user).toMatchObject({
      id: 'user-1',
      emailVerified: '2026-02-01T00:00:00.000Z',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    })
  })
})
