import * as React from "react"
import { cn } from "@/lib/utils"

type AlertVariant = "info" | "success" | "warning" | "error"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-800",
}

const titleStyles: Record<AlertVariant, string> = {
  info: "text-blue-900",
  success: "text-green-900",
  warning: "text-yellow-900",
  error: "text-red-900",
}

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      children,
      dismissible = false,
      onDismiss,
      icon,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false)

    if (dismissed) return null

    const handleDismiss = () => {
      setDismissed(true)
      onDismiss?.()
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex gap-3 rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon ?? defaultIcons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn("font-semibold text-sm mb-1", titleStyles[variant])}>
              {title}
            </p>
          )}
          {children && (
            <div className="text-sm opacity-90">{children}</div>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 self-start p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }
export type { AlertVariant }
