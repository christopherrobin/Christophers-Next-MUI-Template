import { expect, test } from '@playwright/test'

import { getUserByEmail, seedUser } from './helpers/db'

const EXISTING_EMAIL = 'existing@test.dev'
const EXISTING_PASSWORD = 'AlreadyHere42!'

test.describe('join flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: EXISTING_EMAIL, password: EXISTING_PASSWORD })
  })

  test('happy path creates user, lands on /dashboard, persists in DB', async ({
    page
  }, testInfo) => {
    const newEmail = `new-${testInfo.workerIndex}-${Date.now()}@test.dev`
    const password = 'BrandNew42!'

    await page.goto('/join')
    await page.getByLabel(/email/i).fill(newEmail)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /^join$/i }).click()
    await page.waitForURL('**/dashboard')
    await expect(
      page.getByRole('heading', { name: `Welcome, ${newEmail}` })
    ).toBeVisible()

    const dbUser = await getUserByEmail(newEmail)
    expect(dbUser).not.toBeNull()
    expect(dbUser?.email).toBe(newEmail)
  })

  test('existing email shows User already exists, stays on /join', async ({
    page
  }) => {
    await page.goto('/join')
    await page.getByLabel(/email/i).fill(EXISTING_EMAIL)
    await page.getByLabel(/password/i).fill('AnyPassword42!')
    await page.getByRole('button', { name: /^join$/i }).click()
    await expect(page.getByTestId('join-error')).toHaveText(
      /user already exists/i
    )
    await expect(page).toHaveURL(/\/join$/)
  })

  test('empty submit shows zod errors and skips network', async ({ page }) => {
    await page.goto('/join')
    let calledJoinApi = false
    page.on('request', (req) => {
      if (req.url().includes('/api/join')) calledJoinApi = true
    })
    await page.getByRole('button', { name: /^join$/i }).click()
    await expect(page).toHaveURL(/\/join$/)
    await expect(page.getByTestId('join-email-error')).toContainText(
      /email is required/i
    )
    await expect(page.getByTestId('join-password-error')).toContainText(
      /at least 8/i
    )
    expect(calledJoinApi).toBe(false)
  })

  test('Sign In link navigates to /sign-in', async ({ page }) => {
    await page.goto('/join')
    await page.getByRole('link', { name: /sign in/i }).click()
    await page.waitForURL('**/sign-in')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })
})
