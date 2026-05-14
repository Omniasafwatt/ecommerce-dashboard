import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "secondary" | "outline"
type BadgeSize = "sm" | "md"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-blue-100 text-blue-800 border-blue-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  secondary: "bg-gray-100 text-gray-700 border-gray-200",
  outline: "bg-transparent text-gray-700 border-gray-300",
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
export type { BadgeVariant, BadgeSize }
