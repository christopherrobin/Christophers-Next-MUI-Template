/**
 * @jest-environment node
 */
import { hash } from 'bcryptjs'
import { NextRequest } from 'next/server'

import { POST } from './route'

import { prisma } from '@/lib/prisma'
import { makeUser } from '@/test-utils/factories'

jest.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: jest.fn(), create: jest.fn() } }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}))

const mockedFindUnique = jest.mocked(prisma.user.findUnique)
const mockedCreate = jest.mocked(prisma.user.create)
const mockedHash = jest.mocked(hash)

function makeRequest(body: unknown) {
  return new NextRequest(new URL('http://localhost/api/join'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  })
}

describe('POST /api/join', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: 'pw' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Missing email or password'
    })
    expect(mockedFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Missing email or password'
    })
  })

  it('returns 400 when the user already exists', async () => {
    mockedFindUnique.mockResolvedValueOnce(makeUser({ email: 'a@b.com' }))

    const res = await POST(makeRequest({ email: 'a@b.com', password: 'pw' }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'User already exists'
    })
    expect(mockedCreate).not.toHaveBeenCalled()
  })

  it('hashes the password and creates the user on success', async () => {
    mockedFindUnique.mockResolvedValueOnce(null)
    mockedHash.mockResolvedValueOnce('hashed-secret' as never)
    mockedCreate.mockResolvedValueOnce(makeUser({ email: 'new@example.com' }))

    const res = await POST(
      makeRequest({ email: 'new@example.com', password: 'plaintext' })
    )

    expect(mockedHash).toHaveBeenCalledWith('plaintext', 10)
    expect(mockedCreate).toHaveBeenCalledWith({
      data: { email: 'new@example.com', password: 'hashed-secret' }
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
  })

  it('returns 500 and logs when prisma throws', async () => {
    mockedFindUnique.mockRejectedValueOnce(new Error('db down'))

    const res = await POST(makeRequest({ email: 'a@b.com', password: 'pw' }))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error'
    })
    expect(consoleSpy).toHaveBeenCalledWith(
      'Registration error:',
      expect.any(Error)
    )
  })

  it('returns 500 when the request body is not valid JSON', async () => {
    const res = await POST(makeRequest('not-json'))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error'
    })
  })
})
