import { helperTextSlot } from './form-utils'

describe('helperTextSlot', () => {
  it('returns the correct slotProps shape with the given testId', () => {
    expect(helperTextSlot('email-error')).toEqual({
      formHelperText: { 'data-testid': 'email-error' }
    })
  })

  it('encodes the testId as a string passthrough (no encoding/escape)', () => {
    expect(helperTextSlot('a b c')).toEqual({
      formHelperText: { 'data-testid': 'a b c' }
    })
  })

  it('produces a fresh object per call', () => {
    expect(helperTextSlot('x')).not.toBe(helperTextSlot('x'))
  })
})
