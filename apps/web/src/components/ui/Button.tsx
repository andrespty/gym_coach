import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink font-bold hover:brightness-95',
  secondary: 'border border-line text-ink font-semibold hover:bg-raised',
  ghost: 'text-ink-soft font-semibold hover:text-ink',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base transition disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_CLASSES[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
