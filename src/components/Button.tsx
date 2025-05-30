// src/components/Button.tsx
import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  href?: string;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  ghost?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      href,
      loading,
      disabled,
      startIcon,
      endIcon,
      ghost = false,
      ...props
    },
    ref
  ) => {
    const variant: MuiButtonProps['variant'] = ghost ? 'outlined' : 'contained';
    const color: MuiButtonProps['color'] = 'primary';
    const buttonProps: MuiButtonProps = {
      variant,
      color,
      disabled: disabled || loading,
      startIcon,
      endIcon,
      ref,
      ...props,
    };

    if (href) {
      return (
        <MuiButton
          component="a"
          href={href}
          {...buttonProps}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : children}
        </MuiButton>
      );
    }
    return (
      <MuiButton {...buttonProps}>
        {loading ? <CircularProgress size={24} color="inherit" /> : children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
