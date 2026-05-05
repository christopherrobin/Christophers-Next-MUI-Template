import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has expected title', async ({ page }) => {
    await expect(page).toHaveTitle('Christophers-Next-MUI-Template')
  })

  test('Sign Up button links to /sign-up', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /^sign up$/i })
    await expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })

  test('Sign In button links to /sign-in', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i })
    await expect(signInLink).toHaveAttribute('href', '/sign-in')
  })
})
