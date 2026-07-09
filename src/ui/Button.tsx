import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '~/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'secondary-accent' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    'secondary-accent': 'btn--secondary-accent',
    ghost: 'btn--ghost',
    danger: 'btn--danger',
  }

  return (
    <button className={cn('btn', variantClasses[variant], className)} {...props}>
      {children}
    </button>
  )
}
