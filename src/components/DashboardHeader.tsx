import { BRAND, COLORS } from '@/config/branding'

interface DashboardHeaderProps {
  title?: string
  showBrand?: boolean
  compact?: boolean
}

export default function DashboardHeader({ 
  title, 
  showBrand = true, 
  compact = false 
}: DashboardHeaderProps) {
  return (
    <div 
      style={{
        background: COLORS.primary[500],
      }}
      className={`w-full text-white shadow-lg transition-all ${compact ? 'py-3' : 'py-6'}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          {showBrand && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span 
                  className="font-bold text-lg"
                  style={{ color: COLORS.primary[500] }}
                >
                  M
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">{BRAND.name}</h1>
                <p className="text-sm text-blue-100">{BRAND.tagline}</p>
              </div>
            </div>
          )}

          {/* Page Title */}
          {title && (
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
