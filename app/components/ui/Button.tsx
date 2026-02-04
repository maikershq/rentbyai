import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary: 'bg-gradient-to-r from-brand-purple to-brand-green text-white hover:opacity-90 shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
      gradient: 'relative group',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const gradientStyles = variant === 'gradient' ? {
      container: 'relative',
      blur: 'absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-green rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300',
      content: 'relative bg-gray-900 border border-brand-purple/50',
    } : null

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variant !== 'gradient' ? variantStyles[variant] : ''} ${sizeStyles[size]} ${className} ${loading ? 'opacity-70' : ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {variant === 'gradient' ? (
          <>
            <div className={gradientStyles?.blur}></div>
            <div className={`${gradientStyles?.content} px-6 py-3 rounded-lg`}>
              <span className="relative font-semibold group-hover:text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-green">
                {loading ? 'Loading...' : children}
              </span>
            </div>
          </>
        ) : (
          <>
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
