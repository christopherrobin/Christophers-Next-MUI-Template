import type { FormHelperTextProps } from '@mui/material'

export function helperTextSlot(testId: string) {
  return {
    formHelperText: { 'data-testid': testId } as Partial<FormHelperTextProps>
  }
}
