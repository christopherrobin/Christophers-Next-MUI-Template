import { renderWithProviders, screen } from '@/test-utils/renderWithProviders'

import Home from './page'

describe('Home page', () => {
  beforeEach(() => {
    renderWithProviders(<Home />)
  })

  it('renders the Howdy hero heading', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: /howdy/i })
    ).toBeInTheDocument()
  })

  it('renders a Join link pointing to /join', () => {
    const join = screen.getByRole('link', { name: /^join$/i })
    expect(join).toHaveAttribute('href', '/join')
  })

  it('renders a Sign In link pointing to /sign-in', () => {
    const signIn = screen.getByRole('link', { name: /sign in/i })
    expect(signIn).toHaveAttribute('href', '/sign-in')
  })

  it('renders the GitHub link with target=_blank and rel=noopener', () => {
    const github = screen.getByRole('link', { name: /view on github/i })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github.getAttribute('rel') ?? '').toMatch(/noopener/)
    expect(github).toHaveAttribute(
      'href',
      'https://github.com/christopherrobin/Christophers-Next-MUI-Template'
    )
  })
})
