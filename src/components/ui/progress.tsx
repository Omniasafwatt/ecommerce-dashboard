import * as React from "react"
import { cn } from "@/lib/utils"

type ProgressColor = "blue" | "green" | "yellow" | "red" | "purple" | "gray"
type ProgressSize = "sm" | "md" | "lg"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  color?: ProgressColor
  size?: ProgressSize
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const colorStyles: Record<ProgressColor, string> = {
  blue: "bg-blue-600",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  purple: "bg-purple-600",
  gray: "bg-gray-400",
}

const sizeStyles: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      color = "blue",
      size = "md",
      showLabel = false,
      label,
      animated = false,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
            {showLabel && (
              <span className="text-sm font-medium text-gray-600 tabular-nums">
                {clampedValue}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn(
            "w-full rounded-full bg-gray-200 overflow-hidden",
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorStyles[color],
              animated && "animate-pulse"
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
export type { ProgressColor, ProgressSize }
