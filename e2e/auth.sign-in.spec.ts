import { expect, test } from '@playwright/test'

import { seedUser } from './helpers/db'

const TEST_EMAIL = 'signin@test.dev'
const TEST_PASSWORD = 'ChrisIsTheBest42!'

test.describe('sign-in flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
  })

  test('happy path lands on /dashboard with welcome message', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL('**/dashboard')
    await expect(
      page.getByRole('heading', { name: `Welcome, ${TEST_EMAIL}` })
    ).toBeVisible()
  })

  test('wrong password shows Invalid password and stays on /sign-in', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill('WrongPassword!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByTestId('sign-in-error')).toHaveText(
      /invalid password/i
    )
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('unknown user shows No user found', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill('ghost@nowhere.dev')
    await page.getByLabel(/password/i).fill('Whatever123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByTestId('sign-in-error')).toHaveText(/no user found/i)
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('empty fields show zod errors and skip network call', async ({
    page
  }) => {
    await page.goto('/sign-in')
    let calledNextAuth = false
    page.on('request', (req) => {
      if (req.url().includes('/api/auth/callback/credentials')) {
        calledNextAuth = true
      }
    })
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/sign-in$/)
    await expect(page.getByTestId('sign-in-email-error')).toContainText(
      /email is required/i
    )
    await expect(page.getByTestId('sign-in-password-error')).toContainText(
      /password is required/i
    )
    expect(calledNextAuth).toBe(false)
  })

  test('Join now link navigates to /join', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('link', { name: /join now/i }).click()
    await page.waitForURL('**/join')
    await expect(page.getByRole('heading', { name: /^join$/i })).toBeVisible()
  })
})
