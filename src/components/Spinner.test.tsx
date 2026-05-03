import Spinner from './Spinner'

import { renderWithProviders, screen } from '@/test-utils/renderWithProviders'

describe('Spinner', () => {
  it('renders a progressbar', () => {
    renderWithProviders(<Spinner />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('uses the primary theme color', () => {
    renderWithProviders(<Spinner />)
    expect(screen.getByRole('progressbar')).toHaveClass(
      'MuiCircularProgress-colorPrimary'
    )
  })
})
