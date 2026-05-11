import type { FormHelperTextProps } from '@mui/material'

/**
 * Builds the `slotProps` object MUI 6+ expects for attaching a
 * `data-testid` to a `<TextField>`'s helper text element.
 *
 * @param testId - Value the rendered `FormHelperText` should expose via `data-testid`.
 *
 * @example
 * ```tsx
 * <TextField slotProps={helperTextSlot('signin-email-error')} ... />
 * ```
 */
export function helperTextSlot(testId: string) {
  return {
    formHelperText: { 'data-testid': testId } as Partial<FormHelperTextProps>
  }
}
