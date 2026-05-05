import Spinner from './Spinner'

import { renderWithProviders, screen } from '@/test-utils/renderWithProviders'

describe('Spinner', () => {
  it('renders a progressbar', () => {
    renderWithProviders(<Spinner />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders inside an accessible loading status region', () => {
    renderWithProviders(<Spinner />)
    const status = screen.getByRole('status', { name: /loading/i })
    expect(status).toBeInTheDocument()
    expect(status.querySelector('[role="progressbar"]')).not.toBeNull()
  })
})
