import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders a progressbar', () => {
    render(<Spinner />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
