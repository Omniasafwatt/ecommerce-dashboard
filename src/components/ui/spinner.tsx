import * as React from "react"
import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg" | "xl"
type SpinnerColor = "primary" | "white" | "gray"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  color?: SpinnerColor
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
  xl: "h-16 w-16 border-4",
}

const colorStyles: Record<SpinnerColor, string> = {
  primary: "border-blue-600 border-t-transparent",
  white: "border-white border-t-transparent",
  gray: "border-gray-300 border-t-gray-600",
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "primary", ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeStyles[size],
          colorStyles[color]
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
)
Spinner.displayName = "Spinner"

export { Spinner }
export type { SpinnerSize, SpinnerColor }
