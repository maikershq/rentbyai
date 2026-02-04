import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  const baseStyles = 'relative overflow-hidden rounded-xl border border-dark-border bg-dark-card/50 backdrop-blur-sm transition-all duration-300'

  const hoverStyles = hover
    ? 'hover:border-brand-purple/50 hover:shadow-lg hover:-translate-y-1'
    : ''

  const glowStyles = glow
    ? 'hover:shadow-glow'
    : ''

  return (
    <div className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}>
      {/* Gradient overlay on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-green/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
      <div className="relative p-6">
        {children}
      </div>
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`mt-4 pt-4 border-t border-dark-border ${className}`}>{children}</div>
}
