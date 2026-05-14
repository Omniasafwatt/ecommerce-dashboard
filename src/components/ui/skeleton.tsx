import * as React from "react"
import { cn } from "@/lib/utils"

type SkeletonVariant = "text" | "circle" | "rect"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  lines?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", width, height, lines = 1, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
      height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    }

    if (variant === "text" && lines > 1) {
      return (
        <div className="space-y-2" ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === lines - 1 ? "75%" : "100%",
              }}
              className="h-4 rounded animate-pulse bg-gray-200"
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        style={baseStyle}
        className={cn(
          "animate-pulse bg-gray-200",
          variant === "text" && "h-4 rounded w-full",
          variant === "circle" && "rounded-full h-10 w-10",
          variant === "rect" && "rounded-lg",
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
