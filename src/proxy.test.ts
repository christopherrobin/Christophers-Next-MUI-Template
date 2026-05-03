/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { proxy } from './proxy'

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn()
}))

const mockedGetToken = jest.mocked(getToken)

function makeRequest(url: string) {
  return new NextRequest(new URL(url))
}

describe('proxy', () => {
  describe('authenticated requests', () => {
    beforeEach(() => {
      mockedGetToken.mockResolvedValue({ sub: 'user-1' })
    })

    it('redirects authed users away from /sign-in to /dashboard', async () => {
      const res = await proxy(makeRequest('http://localhost/sign-in'))
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost/dashboard')
    })

    it('redirects authed users away from /join to /dashboard', async () => {
      const res = await proxy(makeRequest('http://localhost/join'))
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('http://localhost/dashboard')
    })

    it('passes authed users through to /dashboard', async () => {
      const res = await proxy(makeRequest('http://localhost/dashboard'))
      expect(res.headers.get('location')).toBeNull()
    })
  })

  describe('unauthenticated requests', () => {
    beforeEach(() => {
      mockedGetToken.mockResolvedValue(null)
    })

    it('redirects unauthed users from /dashboard to /sign-in with callbackUrl', async () => {
      const res = await proxy(makeRequest('http://localhost/dashboard'))
      expect(res.status).toBe(307)
      const location = res.headers.get('location')
      expect(location).toContain('/sign-in')
      expect(location).toContain('callbackUrl=')
      expect(decodeURIComponent(location ?? '')).toContain('/dashboard')
    })

    it('redirects unauthed users from nested /dashboard/* to /sign-in', async () => {
      const res = await proxy(
        makeRequest('http://localhost/dashboard/settings')
      )
      expect(res.status).toBe(307)
      expect(decodeURIComponent(res.headers.get('location') ?? '')).toContain(
        '/dashboard/settings'
      )
    })

    it('passes unauthed users through to /sign-in', async () => {
      const res = await proxy(makeRequest('http://localhost/sign-in'))
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes unauthed users through to /join', async () => {
      const res = await proxy(makeRequest('http://localhost/join'))
      expect(res.headers.get('location')).toBeNull()
    })
  })
})
