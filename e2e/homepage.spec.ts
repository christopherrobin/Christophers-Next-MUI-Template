import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has expected title', async ({ page }) => {
    await expect(page).toHaveTitle('Christophers-Next-MUI-Template')
  })

  test('Join button links to /join', async ({ page }) => {
    const joinLink = page.getByRole('link', { name: /^join$/i })
    await expect(joinLink).toHaveAttribute('href', '/join')
  })

  test('Sign In button links to /sign-in', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i })
    await expect(signInLink).toHaveAttribute('href', '/sign-in')
  })
})
