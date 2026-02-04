import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-brand-purple/20 text-brand-purple border-brand-purple/30',
    secondary: 'bg-gray-700/50 text-text-secondary border-gray-600/30',
    success: 'bg-status-active/20 text-status-active border-status-active/30',
    warning: 'bg-status-resolved/20 text-status-resolved border-status-resolved/30',
    error: 'bg-status-disputed/20 text-status-disputed border-status-disputed/30',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
