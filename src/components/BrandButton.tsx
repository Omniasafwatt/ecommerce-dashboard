import { COLORS } from '@/config/branding'

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function BrandButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  style,
  ...props
}: BrandButtonProps) {
  const buttonStyle: React.CSSProperties = {
    ...style,
  }

  if (variant === 'primary') {
    buttonStyle.background = COLORS.primary[500]
    buttonStyle.color = '#FFFFFF'
  } else if (variant === 'secondary') {
    buttonStyle.background = COLORS.sky[500]
    buttonStyle.color = '#FFFFFF'
  } else if (variant === 'outline') {
    buttonStyle.borderColor = COLORS.primary[500]
    buttonStyle.color = COLORS.primary[500]
  } else if (variant === 'ghost') {
    buttonStyle.color = COLORS.primary[500]
  }

  return (
    <button
      style={buttonStyle}
      className={`
        rounded-lg font-medium transition-colors
        ${sizeClasses[size]}
        ${variant === 'outline' ? 'border-2' : ''}
        ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      {...props}
    >
      {children}
    </button>
  )
}
