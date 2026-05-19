import { BRAND, COLORS } from '@/config/branding'

interface MobileLogo2000Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'mark' | 'text'
  className?: string
}

const sizeMap = {
  sm: { box: 'w-8 h-8', text: 'text-sm', logo: 'text-base' },
  md: { box: 'w-10 h-10', text: 'text-base', logo: 'text-lg' },
  lg: { box: 'w-12 h-12', text: 'text-lg', logo: 'text-2xl' },
  xl: { box: 'w-16 h-16', text: 'text-xl', logo: 'text-3xl' },
}

export default function MobileLogo2000({
  size = 'md',
  variant = 'full',
  className = '',
}: MobileLogo2000Props) {
  const sizes = sizeMap[size]

  if (variant === 'mark') {
    return (
      <div 
        className={`${sizes.box} rounded-lg flex items-center justify-center shadow-md ${className}`}
        style={{ background: COLORS.primary[500] }}
      >
        <span 
          className={`${sizes.logo} font-bold`}
          style={{ color: '#FFFFFF' }}
        >
          M
        </span>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col ${className}`}>
        <h1 className={`${sizes.text} font-bold`} style={{ color: COLORS.primary[500] }}>
          {BRAND.name}
        </h1>
        <p className="text-xs" style={{ color: COLORS.neutral[500] }}>
          {BRAND.tagline}
        </p>
      </div>
    )
  }

  // Full variant (mark + text)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`${sizes.box} rounded-lg flex items-center justify-center shadow-md`}
        style={{ background: COLORS.primary[500] }}
      >
        <span 
          className={`${sizes.logo} font-bold`}
          style={{ color: '#FFFFFF' }}
        >
          M
        </span>
      </div>
      <div className="flex flex-col">
        <h1 className={`${sizes.text} font-bold`} style={{ color: COLORS.primary[500] }}>
          {BRAND.name}
        </h1>
        {size !== 'sm' && (
          <p className="text-xs" style={{ color: COLORS.neutral[500] }}>
            {BRAND.tagline}
          </p>
        )}
      </div>
    </div>
  )
}
